import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Flame, Sparkles, Target, Map, Award } from "lucide-react"

interface AchievementsHeaderProps {
  stats: {
    topicsCompleted: number
    roadmapsCompleted: number
    totalXp: number
    currentStreak: number
    longestStreak: number
    badgesEarned: number
    totalBadges: number
  }
}

export function AchievementsHeader({ stats }: AchievementsHeaderProps) {
  const statCards = [
    {
      icon: Sparkles,
      label: "Total XP",
      value: stats.totalXp.toLocaleString(),
      color: "text-[var(--xp-gold)]",
      bgColor: "bg-[var(--xp-gold)]/10",
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${stats.currentStreak} days`,
      color: "text-[var(--streak-orange)]",
      bgColor: "bg-[var(--streak-orange)]/10",
    },
    {
      icon: Trophy,
      label: "Badges Earned",
      value: `${stats.badgesEarned}/${stats.totalBadges}`,
      color: "text-[var(--badge-purple)]",
      bgColor: "bg-[var(--badge-purple)]/10",
    },
    {
      icon: Target,
      label: "Topics Completed",
      value: stats.topicsCompleted.toString(),
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Map,
      label: "Roadmaps Finished",
      value: stats.roadmapsCompleted.toString(),
      color: "text-[var(--success)]",
      bgColor: "bg-[var(--success)]/10",
    },
    {
      icon: Award,
      label: "Longest Streak",
      value: `${stats.longestStreak} days`,
      color: "text-[var(--streak-orange)]",
      bgColor: "bg-[var(--streak-orange)]/10",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Achievements</h1>
        <p className="text-muted-foreground mt-1">Track your progress and earn badges for your accomplishments</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
