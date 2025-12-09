import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DailyActivity } from "@/lib/types"
import { Flame, TrendingUp } from "lucide-react"
import { StreakIcon } from "@/components/icons/StreakIcon"
import { cn } from "@/lib/utils"

interface StreakCardProps {
  currentStreak: number
  longestStreak: number
  activity: DailyActivity[]
}

export function StreakCard({ currentStreak, longestStreak, activity }: StreakCardProps) {
  // Generate last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toISOString().split("T")[0]
  })

  const activityMap = new Map(activity.map((a) => [a.activity_date, a]))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <StreakIcon className="h-5 w-5" />
          Study Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Streak */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-[var(--streak-orange)]/20 mb-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--streak-orange)]">{currentStreak}</p>
              <p className="text-xs text-muted-foreground">days</p>
            </div>
          </div>
          <p className="text-sm font-medium">Current Streak</p>
        </div>

        {/* Best Streak */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>Best: {longestStreak} days</span>
        </div>

        {/* 30 Day Heatmap */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Last 30 days</p>
          <div className="grid grid-cols-10 gap-1">
            {last30Days.map((date) => {
              const dayActivity = activityMap.get(date)
              const hasActivity = dayActivity && dayActivity.topics_completed > 0
              const intensity = dayActivity?.topics_completed || 0

              return (
                <div
                  key={date}
                  className={cn(
                    "h-3 w-3 rounded-sm",
                    hasActivity
                      ? intensity >= 5
                        ? "bg-[var(--streak-orange)]"
                        : intensity >= 3
                          ? "bg-[var(--streak-orange)]/70"
                          : "bg-[var(--streak-orange)]/40"
                      : "bg-muted",
                  )}
                  title={`${date}: ${intensity} topics`}
                />
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-sm bg-muted" />
            <div className="h-3 w-3 rounded-sm bg-[var(--streak-orange)]/40" />
            <div className="h-3 w-3 rounded-sm bg-[var(--streak-orange)]/70" />
            <div className="h-3 w-3 rounded-sm bg-[var(--streak-orange)]" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}
