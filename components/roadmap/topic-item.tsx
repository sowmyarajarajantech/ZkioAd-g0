"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { Topic, Resource } from "@/lib/types"
import { ChevronDown, Clock, Sparkles, ExternalLink, Youtube, BookOpen, FileText, Code } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface TopicWithStatus extends Topic {
  isCompleted: boolean
  resources: Resource[]
}

interface TopicItemProps {
  topic: TopicWithStatus
  index: number
  roadmapId: string
  userId: string
  isLast: boolean
}

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  youtube: Youtube,
  documentation: FileText,
  article: BookOpen,
  course: BookOpen,
  project: Code,
}

export function TopicItem({ topic, index, roadmapId, userId, isLast }: TopicItemProps) {
  const [isCompleted, setIsCompleted] = useState(topic.isCompleted)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleToggleComplete = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      if (isCompleted) {
        // Remove completion
        const { error } = await supabase
          .from("topic_completions")
          .delete()
          .eq("user_id", userId)
          .eq("topic_id", topic.id)

        if (error) throw error
        setIsCompleted(false)
        toast.success("Topic marked as incomplete")
      } else {
        // Add completion
        const { error: completionError } = await supabase.from("topic_completions").insert({
          user_id: userId,
          topic_id: topic.id,
          roadmap_id: roadmapId,
          xp_earned: topic.xp_reward,
        })

        if (completionError) throw completionError

        // Update user XP
        const { data: profile } = await supabase
          .from("profiles")
          .select("xp_points, current_streak, last_activity_date")
          .eq("id", userId)
          .single()

        const today = new Date().toISOString().split("T")[0]
        const lastActivity = profile?.last_activity_date
        let newStreak = profile?.current_streak || 0

        // Calculate streak
        if (lastActivity) {
          const lastDate = new Date(lastActivity)
          const todayDate = new Date(today)
          const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

          if (diffDays === 1) {
            newStreak += 1
          } else if (diffDays > 1) {
            newStreak = 1
          }
        } else {
          newStreak = 1
        }

        // Update profile
        await supabase
          .from("profiles")
          .update({
            xp_points: (profile?.xp_points || 0) + topic.xp_reward,
            current_streak: newStreak,
            longest_streak: Math.max(newStreak, profile?.current_streak || 0),
            last_activity_date: today,
          })
          .eq("id", userId)

        // Update daily activity
        await supabase.from("daily_activity").upsert(
          {
            user_id: userId,
            activity_date: today,
            topics_completed: 1,
            xp_earned: topic.xp_reward,
          },
          {
            onConflict: "user_id,activity_date",
          },
        )

        setIsCompleted(true)
        toast.success(`+${topic.xp_reward} XP earned!`, {
          description: "Keep up the great work!",
        })
      }
      router.refresh()
    } catch (error) {
      console.error("Error toggling topic:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("border-b last:border-b-0", isLast && "border-b-0")}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-4 p-4 md:px-6">
          {/* Checkbox */}
          <div className="shrink-0">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={handleToggleComplete}
              disabled={isLoading}
              className="h-5 w-5"
            />
          </div>

          {/* Topic Info */}
          <CollapsibleTrigger asChild>
            <button className="flex-1 flex items-center justify-between text-left min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">{String(index + 1).padStart(2, "0")}</span>
                  <h4 className={cn("font-medium truncate", isCompleted && "text-muted-foreground line-through")}>
                    {topic.title}
                  </h4>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  {topic.estimated_minutes && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {topic.estimated_minutes} min
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[var(--xp-gold)]">
                    <Sparkles className="h-3 w-3" />+{topic.xp_reward} XP
                  </span>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform shrink-0 ml-2",
                  isOpen && "rotate-180",
                )}
              />
            </button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <div className="px-4 pb-4 md:px-6 md:pb-6 ml-9">
            {/* Description */}
            {topic.description && <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>}

            {/* Resources */}
            {topic.resources.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Learning Resources</h5>
                <div className="space-y-2">
                  {topic.resources.map((resource) => {
                    const IconComponent = platformIcons[resource.platform] || ExternalLink
                    return (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted transition-colors"
                      >
                        <IconComponent className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{resource.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {resource.platform} • {resource.resource_type}
                            {resource.is_free ? " • Free" : ""}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                      </a>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Mark Complete Button */}
            {!isCompleted && (
              <Button onClick={handleToggleComplete} disabled={isLoading} className="mt-4" size="sm">
                <Sparkles className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : `Mark Complete (+${topic.xp_reward} XP)`}
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
