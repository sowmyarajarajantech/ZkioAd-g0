"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { TrendingUp, Bookmark, BookmarkCheck } from "lucide-react"

type Roadmap = {
  id: string
  title: string
  category: string
  difficulty: string
  icon: string
  save_count: number
}

export function TrendingRoadmaps({ userId }: { userId: string }) {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [savedRoadmaps, setSavedRoadmaps] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingRoadmaps()
    fetchSavedRoadmaps()
  }, [])

  const fetchTrendingRoadmaps = async () => {
    const supabase = createClient()

    // Get roadmaps with most saves (community-created)
    const { data: saves } = await supabase.from("roadmap_saves").select("roadmap_id")

    // Count saves per roadmap
    const saveCounts: Record<string, number> = {}
    saves?.forEach((s) => {
      saveCounts[s.roadmap_id] = (saveCounts[s.roadmap_id] || 0) + 1
    })

    // Get public roadmaps
    const { data: roadmaps } = await supabase
      .from("roadmaps")
      .select("id, title, category, difficulty, icon")
      .eq("is_public", true)
      .limit(10)

    if (roadmaps) {
      const roadmapsWithCount = roadmaps
        .map((r) => ({
          ...r,
          save_count: saveCounts[r.id] || 0,
        }))
        .sort((a, b) => b.save_count - a.save_count)
        .slice(0, 5)

      setRoadmaps(roadmapsWithCount)
    }
    setLoading(false)
  }

  const fetchSavedRoadmaps = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("roadmap_saves").select("roadmap_id").eq("user_id", userId)

    if (data) {
      setSavedRoadmaps(new Set(data.map((s) => s.roadmap_id)))
    }
  }

  const toggleSave = async (roadmapId: string) => {
    const supabase = createClient()
    const isSaved = savedRoadmaps.has(roadmapId)

    if (isSaved) {
      await supabase.from("roadmap_saves").delete().eq("user_id", userId).eq("roadmap_id", roadmapId)

      setSavedRoadmaps((prev) => {
        const next = new Set(prev)
        next.delete(roadmapId)
        return next
      })
    } else {
      await supabase.from("roadmap_saves").insert({ user_id: userId, roadmap_id: roadmapId })

      setSavedRoadmaps((prev) => new Set([...prev, roadmapId]))
    }
  }

  const difficultyColors: Record<string, string> = {
    beginner: "bg-green-500/10 text-green-500",
    intermediate: "bg-yellow-500/10 text-yellow-500",
    advanced: "bg-red-500/10 text-red-500",
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending Roadmaps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : roadmaps.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No trending roadmaps yet</p>
        ) : (
          roadmaps.map((roadmap) => (
            <div key={roadmap.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-2xl">{roadmap.icon}</span>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/dashboard/roadmap/${roadmap.id}`}
                  className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
                >
                  {roadmap.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className={`text-xs ${difficultyColors[roadmap.difficulty]}`}>
                    {roadmap.difficulty}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{roadmap.save_count} saves</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => toggleSave(roadmap.id)}>
                {savedRoadmaps.has(roadmap.id) ? (
                  <BookmarkCheck className="h-4 w-4 text-primary" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
