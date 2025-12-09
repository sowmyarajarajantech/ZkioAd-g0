import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardStats } from "@/components/dashboard/stats"
import { DashboardProgress } from "@/components/dashboard/progress"
import { DashboardActivity } from "@/components/dashboard/activity"
import { AiSuggestions } from "@/components/dashboard/ai-suggestions"
import { ShareProgress } from "@/components/dashboard/share-progress"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // and changed roadmaps to roadmap (singular for join alias)
  const { data: userRoadmapProgress } = await supabase
    .from("user_roadmap_progress")
    .select(`
      *,
      roadmap:roadmaps (*)
    `)
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("started_at", { ascending: false })
    .limit(5)

  const { data: completedTopicsByRoadmap } = await supabase
    .from("topic_completions")
    .select("roadmap_id")
    .eq("user_id", user.id)

  // Count completions per roadmap
  const completionCounts: Record<string, number> = {}
  completedTopicsByRoadmap?.forEach((item) => {
    completionCounts[item.roadmap_id] = (completionCounts[item.roadmap_id] || 0) + 1
  })

  // Merge completion counts into roadmap progress
  const progressWithCounts =
    userRoadmapProgress?.map((item) => ({
      ...item,
      completed_topics_count: completionCounts[item.roadmap_id] || 0,
    })) || []

  // Get user badges
  const { data: userBadges } = await supabase
    .from("user_badges")
    .select(`
      *,
      badges (*)
    `)
    .eq("user_id", user.id)
    .order("earned_at", { ascending: false })
    .limit(5)

  // Get recent activity
  const { data: recentActivity } = await supabase
    .from("daily_activity")
    .select("*")
    .eq("user_id", user.id)
    .order("activity_date", { ascending: false })
    .limit(7)

  // Get total completed topics count
  const { count: completedTopicsCount } = await supabase
    .from("topic_completions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Welcome back, {profile?.display_name || "Learner"}!</h1>
          <p className="text-muted-foreground mt-1">Here&apos;s your learning progress overview</p>
        </div>
        {/* Share Progress Button */}
        <ShareProgress
          stats={{
            totalXp: profile?.xp_points || 0,
            streak: profile?.current_streak || 0,
            completedTopics: completedTopicsCount || 0,
            badges: userBadges?.length || 0,
          }}
        />
      </div>

      {/* Stats Cards */}
      <DashboardStats
        profile={profile}
        badgesCount={userBadges?.length || 0}
        activeRoadmapsCount={progressWithCounts?.length || 0}
      />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Progress Section - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardProgress progress={progressWithCounts} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Suggestions Component */}
          <AiSuggestions 
            activeRoadmap={
              progressWithCounts && progressWithCounts.length > 0 
                ? {
                    id: progressWithCounts[0].roadmap_id,
                    title: (progressWithCounts[0].roadmap as any)?.title || "",
                    category: (progressWithCounts[0].roadmap as any)?.category || "",
                  }
                : undefined
            }
          />
          <DashboardActivity activity={recentActivity || []} badges={userBadges || []} />
        </div>
      </div>
    </div>
  )
}
