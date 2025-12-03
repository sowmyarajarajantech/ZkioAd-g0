import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DailyActivity, UserBadge } from "@/lib/types"
import { Activity, Trophy, Flame, Award } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActivityProps {
  activity: DailyActivity[]
  badges: (UserBadge & { badge: { name: string; icon: string; color: string } })[]
}

export function DashboardActivity({ activity, badges }: ActivityProps) {
  return (
    <div className="space-y-6">
      {/* Recent Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-5 w-5 text-[var(--badge-purple)]" />
            Recent Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          {badges.length === 0 ? (
            <div className="text-center py-4">
              <Award className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Complete topics to earn badges!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {badges.slice(0, 3).map((ub) => (
                <div key={ub.id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--badge-purple)]/10">
                    <Trophy className="h-5 w-5 text-[var(--badge-purple)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{ub.badge.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(ub.earned_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-5 w-5 text-primary" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-1">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date()
              date.setDate(date.getDate() - (6 - i))
              const dateStr = date.toISOString().split("T")[0]
              const dayActivity = activity.find((a) => a.activity_date === dateStr)
              const hasActivity = dayActivity && dayActivity.topics_completed > 0

              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`h-8 w-8 rounded-md flex items-center justify-center ${
                      hasActivity ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {hasActivity && <Flame className="h-4 w-4" />}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {date.toLocaleDateString("en-US", { weekday: "narrow" })}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Topics this week</span>
              <span className="font-medium">{activity.reduce((sum, a) => sum + (a.topics_completed || 0), 0)}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">XP earned</span>
              <span className="font-medium text-[var(--xp-gold)]">
                +{activity.reduce((sum, a) => sum + (a.xp_earned || 0), 0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
