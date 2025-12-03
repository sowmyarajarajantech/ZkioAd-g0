import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Flame, Trophy, Zap, BookOpen, Calendar, Lock } from "lucide-react"
import { FollowButton } from "@/components/community/follow-button"

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to own profile if viewing self
  if (user?.id === id) {
    redirect("/dashboard/profile")
  }

  // Get the profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", id).single()

  if (!profile) {
    notFound()
  }

  // Check if profile is public
  if (!profile.is_public) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Private Profile</h2>
            <p className="text-muted-foreground">This user has set their profile to private.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get badges if public
  const { data: userBadges } = profile.show_badges
    ? await supabase
        .from("user_badges")
        .select(`
          earned_at,
          badges (
            id,
            name,
            icon,
            description
          )
        `)
        .eq("user_id", id)
        .order("earned_at", { ascending: false })
        .limit(6)
    : { data: [] }

  // Get active roadmaps
  const { data: roadmaps } = await supabase
    .from("user_roadmaps")
    .select(`
      progress_percentage,
      roadmaps (
        id,
        title,
        icon,
        category
      )
    `)
    .eq("user_id", id)
    .order("last_activity_at", { ascending: false })
    .limit(3)

  // Calculate level
  const level = Math.floor(profile.total_xp / 1000) + 1
  const xpInLevel = profile.total_xp % 1000
  const xpForNextLevel = 1000

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-3xl">{profile.display_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{profile.display_name}</h1>
                <Badge variant="secondary">Level {level}</Badge>
              </div>

              <p className="text-muted-foreground mb-4">
                Joined {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-xp" />
                  <span className="font-semibold">{profile.total_xp.toLocaleString()}</span>
                  <span className="text-muted-foreground">XP</span>
                </div>

                {profile.show_streak && (
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-streak" />
                    <span className="font-semibold">{profile.current_streak}</span>
                    <span className="text-muted-foreground">day streak</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">{profile.longest_streak}</span>
                  <span className="text-muted-foreground">best streak</span>
                </div>
              </div>
            </div>

            {user && <FollowButton currentUserId={user.id} targetUserId={id} />}
          </div>

          {/* XP Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Level {level} Progress</span>
              <span className="text-muted-foreground">
                {xpInLevel} / {xpForNextLevel} XP
              </span>
            </div>
            <Progress value={(xpInLevel / xpForNextLevel) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Badges */}
        {profile.show_badges && userBadges && userBadges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="h-5 w-5 text-badge" />
                Badges ({userBadges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {userBadges.map((ub: any) => (
                  <div key={ub.badges.id} className="flex flex-col items-center p-3 rounded-lg bg-muted/50 text-center">
                    <span className="text-2xl mb-1">{ub.badges.icon}</span>
                    <span className="text-xs font-medium line-clamp-1">{ub.badges.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Roadmaps */}
        {roadmaps && roadmaps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-5 w-5 text-primary" />
                Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {roadmaps.map((r: any) => (
                <div key={r.roadmaps.id} className="flex items-center gap-3">
                  <span className="text-xl">{r.roadmaps.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{r.roadmaps.title}</p>
                    <Progress value={r.progress_percentage} className="h-1.5 mt-1" />
                  </div>
                  <span className="text-sm text-muted-foreground">{r.progress_percentage}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
