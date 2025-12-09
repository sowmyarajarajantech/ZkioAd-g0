"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Badge as BadgeType } from "@/lib/types"
import {
  Flame,
  Award,
  Star,
  Medal,
  Crown,
  Zap,
  Map,
  BookOpen,
  Footprints,
  Rocket,
  GraduationCap,
  Brain,
  Compass,
  Lock,
} from "lucide-react"
import { ColoredBadge } from "@/components/icons/ColoredBadge"
import { BadgeIcon } from "@/components/icons/BadgeIcon"
import { Trophy } from "@/components/icons/Trophy"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface EnrichedBadge extends BadgeType {
  isEarned: boolean
  earnedAt?: string
  currentProgress: number
  progressPercentage: number
}

interface BadgesGridProps {
  badges: EnrichedBadge[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  flame: Flame,
  fire: Flame,
  zap: Zap,
  trophy: Trophy,
  crown: Crown,
  footprints: Footprints,
  rocket: Rocket,
  star: Star,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  map: Map,
  compass: Compass,
  brain: Brain,
  award: Award,
  medal: Medal,
}

const colorMap: Record<string, string> = {
  orange: "from-orange-400 to-orange-600",
  yellow: "from-yellow-400 to-yellow-600",
  gold: "from-amber-400 to-amber-600",
  purple: "from-purple-400 to-purple-600",
  green: "from-green-400 to-green-600",
  blue: "from-blue-400 to-blue-600",
  teal: "from-teal-400 to-teal-600",
  cyan: "from-cyan-400 to-cyan-600",
  pink: "from-pink-400 to-pink-600",
  indigo: "from-indigo-400 to-indigo-600",
  bronze: "from-orange-300 to-orange-500",
  silver: "from-gray-300 to-gray-500",
  diamond: "from-cyan-300 to-blue-500",
}

export function BadgesGrid({ badges }: BadgesGridProps) {
  const [selectedBadge, setSelectedBadge] = useState<EnrichedBadge | null>(null)

  const categories = ["all", "streak", "completion", "milestone"] as const
  const earnedCount = badges.filter((b) => b.isEarned).length

  const getBadgesByCategory = (category: string) => {
    if (category === "all") return badges
    return badges.filter((b) => b.category === category)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BadgeIcon className="h-5 w-5" />
              Badges
            </CardTitle>
            <Badge variant="secondary">
              {earnedCount}/{badges.length} Earned
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="capitalize">
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {getBadgesByCategory(category).map((badge) => {
                    const IconComponent = iconMap[badge.icon] || Award
                    const gradientClass = colorMap[badge.color] || "from-gray-400 to-gray-600"

                    return (
                      <button
                        key={badge.id}
                        onClick={() => setSelectedBadge(badge)}
                        className={cn(
                          "relative flex flex-col items-center p-4 rounded-xl border transition-all text-center",
                          badge.isEarned
                            ? "bg-card hover:shadow-lg hover:border-primary/20"
                            : "bg-muted/30 opacity-60 hover:opacity-80",
                        )}
                      >
                        {/* Badge Icon */}
                        <div
                          className={cn(
                            "relative flex h-16 w-16 items-center justify-center rounded-full mb-3",
                            badge.isEarned ? `bg-gradient-to-br ${gradientClass}` : "bg-muted",
                          )}
                        >
                          {badge.isEarned ? (
                            <IconComponent className="h-8 w-8 text-white" />
                          ) : (
                            <Lock className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>

                        {/* Badge Name */}
                        <p className={cn("font-medium text-sm mb-1", !badge.isEarned && "text-muted-foreground")}>
                          {badge.name}
                        </p>

                        {/* Progress or Earned */}
                        {badge.isEarned ? (
                          <span className="text-xs text-[var(--success)]">Earned!</span>
                        ) : (
                          <div className="w-full space-y-1">
                            <Progress value={badge.progressPercentage} className="h-1.5" />
                            <span className="text-xs text-muted-foreground">
                              {badge.currentProgress}/{badge.requirement_value}
                            </span>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Badge Detail Modal */}
      <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
        <DialogContent>
          {selectedBadge && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full",
                      selectedBadge.isEarned
                        ? `bg-gradient-to-br ${colorMap[selectedBadge.color] || "from-gray-400 to-gray-600"}`
                        : "bg-muted",
                    )}
                  >
                    {(() => {
                      const IconComponent = iconMap[selectedBadge.icon] || Award
                      return selectedBadge.isEarned ? (
                        <IconComponent className="h-6 w-6 text-white" />
                      ) : (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      )
                    })()}
                  </div>
                  {selectedBadge.name}
                </DialogTitle>
                <DialogDescription>{selectedBadge.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {selectedBadge.isEarned ? (
                  <div className="rounded-lg bg-[var(--success)]/10 p-4 text-center">
                    <p className="text-sm text-[var(--success)] font-medium">
                      Earned {formatDistanceToNow(new Date(selectedBadge.earnedAt!), { addSuffix: true })}
                    </p>
                    {selectedBadge.xp_reward > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">+{selectedBadge.xp_reward} XP rewarded</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">
                        {selectedBadge.currentProgress} / {selectedBadge.requirement_value}
                      </span>
                    </div>
                    <Progress value={selectedBadge.progressPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      {selectedBadge.requirement_value - selectedBadge.currentProgress} more to unlock
                    </p>
                    {selectedBadge.xp_reward > 0 && (
                      <p className="text-xs text-center text-[var(--xp-gold)]">+{selectedBadge.xp_reward} XP reward</p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
