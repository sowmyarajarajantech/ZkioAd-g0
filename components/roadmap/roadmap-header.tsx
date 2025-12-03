"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Roadmap, UserRoadmapProgress } from "@/lib/types"
import { ArrowLeft, Play, CheckCircle2, Clock, BookOpen, Trophy } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface RoadmapHeaderProps {
  roadmap: Roadmap
  progress: number
  completedCount: number
  totalTopics: number
  userProgress: UserRoadmapProgress | null
  userId: string
}

export function RoadmapHeader({
  roadmap,
  progress,
  completedCount,
  totalTopics,
  userProgress,
  userId,
}: RoadmapHeaderProps) {
  const [isStarting, setIsStarting] = useState(false)
  const router = useRouter()

  const handleStartRoadmap = async () => {
    setIsStarting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("user_roadmap_progress").insert({
        user_id: userId,
        roadmap_id: roadmap.id,
        is_active: true,
      })

      if (error) throw error
      toast.success("Roadmap started! Good luck on your learning journey.")
      router.refresh()
    } catch (error) {
      console.error("Error starting roadmap:", error)
      toast.error("Failed to start roadmap. Please try again.")
    } finally {
      setIsStarting(false)
    }
  }

  const isStarted = !!userProgress
  const isCompleted = progress === 100

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/explore">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Roadmaps
        </Link>
      </Button>

      {/* Header Card */}
      <div className="rounded-xl border bg-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              {roadmap.is_official && <Badge variant="secondary">Official</Badge>}
              <Badge variant="outline" className="capitalize">
                {roadmap.difficulty}
              </Badge>
              <Badge variant="outline">{roadmap.category}</Badge>
            </div>

            <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">{roadmap.title}</h1>

            <p className="text-muted-foreground text-lg">{roadmap.description}</p>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{totalTopics} topics</span>
              </div>
              {roadmap.estimated_hours && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>~{roadmap.estimated_hours} hours</span>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0">
            {!isStarted ? (
              <Button size="lg" onClick={handleStartRoadmap} disabled={isStarting}>
                <Play className="mr-2 h-5 w-5" />
                {isStarting ? "Starting..." : "Start Learning"}
              </Button>
            ) : isCompleted ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--success)]/10 text-[var(--success)]">
                <Trophy className="h-5 w-5" />
                <span className="font-medium">Completed!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">In Progress</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {isStarted && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedCount} of {totalTopics} topics ({progress}%)
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        )}
      </div>
    </div>
  )
}
