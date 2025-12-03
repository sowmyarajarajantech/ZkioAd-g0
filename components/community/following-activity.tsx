"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { Trophy, Flame, BookOpen, Star, Zap, Users } from "lucide-react"

type Activity = {
  id: string
  user_id: string
  activity_type: string
  metadata: any
  created_at: string
  profiles: {
    display_name: string
    avatar_url: string | null
  }
}

export function FollowingActivity({ userId }: { userId: string }) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFollowingActivities()
  }, [])

  const fetchFollowingActivities = async () => {
    const supabase = createClient()

    // Get following IDs
    const { data: follows } = await supabase.from("user_follows").select("following_id").eq("follower_id", userId)

    if (!follows || follows.length === 0) {
      setLoading(false)
      return
    }

    const followingIds = follows.map((f) => f.following_id)

    // Get activities from followed users
    const { data } = await supabase
      .from("activity_feed")
      .select(`
        *,
        profiles!activity_feed_user_id_fkey (
          display_name,
          avatar_url
        )
      `)
      .in("user_id", followingIds)
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(20)

    if (data) setActivities(data)
    setLoading(false)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "completed_topic":
        return <BookOpen className="h-4 w-4 text-primary" />
      case "earned_badge":
        return <Trophy className="h-4 w-4 text-badge" />
      case "completed_roadmap":
        return <Star className="h-4 w-4 text-xp" />
      case "streak_milestone":
        return <Flame className="h-4 w-4 text-streak" />
      case "created_roadmap":
        return <Zap className="h-4 w-4 text-primary" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getActivityMessage = (activity: Activity) => {
    const { activity_type, metadata } = activity
    switch (activity_type) {
      case "completed_topic":
        return `completed "${metadata.topic_name}" in ${metadata.roadmap_name}`
      case "earned_badge":
        return `earned the "${metadata.badge_name}" badge`
      case "completed_roadmap":
        return `completed the ${metadata.roadmap_name} roadmap!`
      case "streak_milestone":
        return `reached a ${metadata.days}-day learning streak!`
      case "created_roadmap":
        return `created a new roadmap: "${metadata.roadmap_name}"`
      default:
        return "had an activity"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No activity from people you follow yet.</p>
          <p className="text-sm text-muted-foreground mt-2">Follow other learners to see their progress here!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="hover:bg-muted/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src={activity.profiles?.avatar_url || undefined} />
                <AvatarFallback>{activity.profiles?.display_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{activity.profiles?.display_name || "Anonymous"}</span>
                  <span className="text-muted-foreground text-sm">{getActivityMessage(activity)}</span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  {getActivityIcon(activity.activity_type)}
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
