import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sparkles } from "lucide-react"
import { XpCardIcon } from "@/components/icons/XpCardIcon"

interface XPProgressProps {
  xp: number
}

// XP level thresholds
const levels = [
  { level: 1, name: "Beginner", xp: 0 },
  { level: 2, name: "Learner", xp: 100 },
  { level: 3, name: "Student", xp: 300 },
  { level: 4, name: "Scholar", xp: 600 },
  { level: 5, name: "Apprentice", xp: 1000 },
  { level: 6, name: "Practitioner", xp: 1500 },
  { level: 7, name: "Expert", xp: 2500 },
  { level: 8, name: "Master", xp: 4000 },
  { level: 9, name: "Grandmaster", xp: 6000 },
  { level: 10, name: "Legend", xp: 10000 },
]

export function XPProgress({ xp }: XPProgressProps) {
  // Find current level
  let currentLevel = levels[0]
  let nextLevel = levels[1]

  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].xp) {
      currentLevel = levels[i]
      nextLevel = levels[i + 1] || levels[i]
      break
    }
  }

  const xpInCurrentLevel = xp - currentLevel.xp
  const xpNeededForNext = nextLevel.xp - currentLevel.xp
  const progressToNext = xpNeededForNext > 0 ? Math.round((xpInCurrentLevel / xpNeededForNext) * 100) : 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <XpCardIcon className="h-5 w-5" />
          Experience Level
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Level Display */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Level</p>
            <p className="text-3xl font-bold">{currentLevel.level}</p>
            <p className="text-sm font-medium text-[var(--xp-gold)]">{currentLevel.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total XP</p>
            <p className="text-3xl font-bold text-[var(--xp-gold)]">{xp.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress to Next Level */}
        {currentLevel.level < 10 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress to Level {nextLevel.level}</span>
              <span className="text-muted-foreground">
                {xpInCurrentLevel} / {xpNeededForNext} XP
              </span>
            </div>
            <Progress value={progressToNext} className="h-3" />
            <p className="text-xs text-muted-foreground text-center">
              {xpNeededForNext - xpInCurrentLevel} XP to reach {nextLevel.name}
            </p>
          </div>
        )}

        {/* Level Milestones */}
        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-3">Level Milestones</p>
          <div className="grid grid-cols-5 gap-2">
            {levels.slice(0, 10).map((level) => (
              <div
                key={level.level}
                className={`text-center p-2 rounded-lg ${
                  xp >= level.xp ? "bg-[var(--xp-gold)]/20 text-[var(--xp-gold)]" : "bg-muted text-muted-foreground"
                }`}
              >
                <p className="text-lg font-bold">{level.level}</p>
                <p className="text-xs truncate">{level.name}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
