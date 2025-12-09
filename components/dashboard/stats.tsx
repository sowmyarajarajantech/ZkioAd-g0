import { Card, CardContent } from "@/components/ui/card"
import type { Profile } from "@/lib/types"
import { Trophy } from "lucide-react"
import { ColoredXp } from "@/components/icons/ColoredXp"
import { ColoredStreak } from "@/components/icons/ColoredStreak"
import { ColoredRoadmap } from "@/components/icons/ColoredRoadmap"
import { ActiveRoadmaps } from "@/components/icons/ActiveRoadmaps"
import { BadgeIcon } from "@/components/icons/BadgeIcon"
import { StreakIcon } from "@/components/icons/StreakIcon"
import { XpCardIcon } from "@/components/icons/XpCardIcon"

interface StatsProps {
  profile: Profile | null
  badgesCount: number
  activeRoadmapsCount: number
}

export function DashboardStats({ profile, badgesCount, activeRoadmapsCount }: StatsProps) {
  const stats = [
    {
      icon: XpCardIcon,
      label: "Total XP",
      value: profile?.xp_points?.toLocaleString() || "0",
      color: "text-[var(--xp-gold)]",
      bgColor: "bg-[var(--xp-gold)]/10",
    },
    {
      icon: StreakIcon,
      label: "Current Streak",
      value: `${profile?.current_streak || 0} days`,
      color: "text-[var(--streak-orange)]",
      bgColor: "bg-[var(--streak-orange)]/10",
    },
    {
      icon: BadgeIcon,
      label: "Badges Earned",
      value: badgesCount.toString(),
      color: "text-[var(--badge-purple)]",
      bgColor: "bg-[var(--badge-purple)]/10",
    },
    {
      icon: ActiveRoadmaps,
      label: "Active Roadmaps",
      value: activeRoadmapsCount.toString(),
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
