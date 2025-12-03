import { createClient } from "@/lib/supabase/server"
import { AchievementsHeader } from "@/components/achievements/achievements-header"
import { BadgesGrid } from "@/components/achievements/badges-grid"
import { StreakCard } from "@/components/achievements/streak-card"
import { XPProgress } from "@/components/achievements/xp-progress"
import { Leaderboard } from "@/components/achievements/leaderboard"

export default async function AchievementsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get all badges
  const { data: allBadges } = await supabase.from("badges").select("*").order("requirement_value", { ascending: true })

  // Get user's earned badges
  const { data: userBadges } = await supabase.from("user_badges").select("badge_id, earned_at").eq("user_id", user.id)

  // Get user stats for badge calculation
  const { count: topicsCompleted } = await supabase
    .from("topic_completions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: roadmapsCompleted } = await supabase
    .from("user_roadmap_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .not("completed_at", "is", null)

  // Get weekly activity for streak visualization
  const { data: weeklyActivity } = await supabase
    .from("daily_activity")
    .select("*")
    .eq("user_id", user.id)
    .order("activity_date", { ascending: false })
    .limit(30)

  // Get leaderboard (top users by XP)
  const { data: leaderboardData } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, xp_points, current_streak")
    .eq("is_profile_public", true)
    .order("xp_points", { ascending: false })
    .limit(10)

  const earnedBadgeIds = new Set(userBadges?.map((ub) => ub.badge_id) || [])
  const earnedBadgesMap = new Map(userBadges?.map((ub) => [ub.badge_id, ub.earned_at]) || [])

  // Enrich badges with earned status and progress
  const enrichedBadges =
    allBadges?.map((badge) => {
      let currentProgress = 0
      switch (badge.requirement_type) {
        case "streak_days":
          currentProgress = profile?.current_streak || 0
          break
        case "topics_completed":
          currentProgress = topicsCompleted || 0
          break
        case "roadmaps_completed":
          currentProgress = roadmapsCompleted || 0
          break
        case "total_xp":
          currentProgress = profile?.xp_points || 0
          break
      }

      return {
        ...badge,
        isEarned: earnedBadgeIds.has(badge.id),
        earnedAt: earnedBadgesMap.get(badge.id),
        currentProgress,
        progressPercentage: Math.min(100, Math.round((currentProgress / badge.requirement_value) * 100)),
      }
    }) || []

  const stats = {
    topicsCompleted: topicsCompleted || 0,
    roadmapsCompleted: roadmapsCompleted || 0,
    totalXp: profile?.xp_points || 0,
    currentStreak: profile?.current_streak || 0,
    longestStreak: profile?.longest_streak || 0,
    badgesEarned: earnedBadgeIds.size,
    totalBadges: allBadges?.length || 0,
  }

  return (
    <div className="space-y-6">
      <AchievementsHeader stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <XPProgress xp={stats.totalXp} />
          <BadgesGrid badges={enrichedBadges} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <StreakCard
            currentStreak={stats.currentStreak}
            longestStreak={stats.longestStreak}
            activity={weeklyActivity || []}
          />
          <Leaderboard entries={leaderboardData || []} currentUserId={user.id} />
        </div>
      </div>
    </div>
  )
}
