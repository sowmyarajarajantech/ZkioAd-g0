"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Trophy, UserPlus, Check } from "lucide-react"

type Learner = {
  id: string
  display_name: string
  avatar_url: string | null
  total_xp: number
  current_streak: number
}

export function TopLearners({ currentUserId }: { currentUserId: string }) {
  const [learners, setLearners] = useState<Learner[]>([])
  const [following, setFollowing] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopLearners()
    fetchFollowing()
  }, [])

  const fetchTopLearners = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, total_xp, current_streak")
      .eq("is_public", true)
      .order("total_xp", { ascending: false })
      .limit(5)

    if (data) setLearners(data)
    setLoading(false)
  }

  const fetchFollowing = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("user_follows").select("following_id").eq("follower_id", currentUserId)

    if (data) {
      setFollowing(new Set(data.map((f) => f.following_id)))
    }
  }

  const toggleFollow = async (targetUserId: string) => {
    const supabase = createClient()
    const isFollowing = following.has(targetUserId)

    if (isFollowing) {
      await supabase.from("user_follows").delete().eq("follower_id", currentUserId).eq("following_id", targetUserId)

      setFollowing((prev) => {
        const next = new Set(prev)
        next.delete(targetUserId)
        return next
      })
    } else {
      await supabase.from("user_follows").insert({ follower_id: currentUserId, following_id: targetUserId })

      setFollowing((prev) => new Set([...prev, targetUserId]))
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="h-5 w-5 text-xp" />
          Top Learners
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : learners.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No public profiles yet</p>
        ) : (
          learners.map((learner, index) => (
            <div key={learner.id} className="flex items-center gap-3">
              <span className="text-sm font-bold text-muted-foreground w-4">{index + 1}</span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={learner.avatar_url || undefined} />
                <AvatarFallback className="text-xs">{learner.display_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{learner.display_name}</p>
                <p className="text-xs text-xp">{learner.total_xp.toLocaleString()} XP</p>
              </div>
              {learner.id !== currentUserId && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFollow(learner.id)}>
                  {following.has(learner.id) ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
