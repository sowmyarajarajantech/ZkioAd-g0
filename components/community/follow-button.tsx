"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { UserPlus, Check, Loader2 } from "lucide-react"

export function FollowButton({
  currentUserId,
  targetUserId,
}: {
  currentUserId: string
  targetUserId: string
}) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    checkFollowStatus()
  }, [])

  const checkFollowStatus = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("user_follows")
      .select("id")
      .eq("follower_id", currentUserId)
      .eq("following_id", targetUserId)
      .single()

    setIsFollowing(!!data)
    setLoading(false)
  }

  const toggleFollow = async () => {
    setUpdating(true)
    const supabase = createClient()

    if (isFollowing) {
      await supabase.from("user_follows").delete().eq("follower_id", currentUserId).eq("following_id", targetUserId)
      setIsFollowing(false)
    } else {
      await supabase.from("user_follows").insert({
        follower_id: currentUserId,
        following_id: targetUserId,
      })
      setIsFollowing(true)
    }

    setUpdating(false)
  }

  if (loading) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  return (
    <Button variant={isFollowing ? "secondary" : "default"} onClick={toggleFollow} disabled={updating}>
      {updating ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : isFollowing ? (
        <Check className="h-4 w-4 mr-2" />
      ) : (
        <UserPlus className="h-4 w-4 mr-2" />
      )}
      {isFollowing ? "Following" : "Follow"}
    </Button>
  )
}
