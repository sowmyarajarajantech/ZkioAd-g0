import { createClient } from "@/lib/supabase/client"

interface BadgeCheckResult {
  newBadges: string[]
  totalXpEarned: number
}

export async function checkAndAwardBadges(userId: string): Promise<BadgeCheckResult> {
  const supabase = createClient()
  const result: BadgeCheckResult = { newBadges: [], totalXpEarned: 0 }

  // Get user stats
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp_points, current_streak")
    .eq("id", userId)
    .single()

  const { count: topicsCompleted } = await supabase
    .from("topic_completions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  const { count: roadmapsCompleted } = await supabase
    .from("user_roadmap_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .not("completed_at", "is", null)

  // Get all badges and user's earned badges
  const { data: allBadges } = await supabase.from("badges").select("*")
  const { data: userBadges } = await supabase.from("user_badges").select("badge_id").eq("user_id", userId)

  const earnedBadgeIds = new Set(userBadges?.map((ub) => ub.badge_id) || [])

  // Check each badge
  for (const badge of allBadges || []) {
    if (earnedBadgeIds.has(badge.id)) continue

    let qualifies = false
    switch (badge.requirement_type) {
      case "streak_days":
        qualifies = (profile?.current_streak || 0) >= badge.requirement_value
        break
      case "topics_completed":
        qualifies = (topicsCompleted || 0) >= badge.requirement_value
        break
      case "roadmaps_completed":
        qualifies = (roadmapsCompleted || 0) >= badge.requirement_value
        break
      case "total_xp":
        qualifies = (profile?.xp_points || 0) >= badge.requirement_value
        break
    }

    if (qualifies) {
      // Award badge
      const { error } = await supabase.from("user_badges").insert({
        user_id: userId,
        badge_id: badge.id,
      })

      if (!error) {
        result.newBadges.push(badge.name)
        result.totalXpEarned += badge.xp_reward

        // Add XP reward
        if (badge.xp_reward > 0) {
          await supabase
            .from("profiles")
            .update({
              xp_points: (profile?.xp_points || 0) + badge.xp_reward,
            })
            .eq("id", userId)
        }
      }
    }
  }

  return result
}
