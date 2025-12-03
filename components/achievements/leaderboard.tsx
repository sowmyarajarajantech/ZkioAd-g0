import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { LeaderboardEntry } from "@/lib/types"
import { Trophy, Crown, Medal, Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentUserId: string
}

export function Leaderboard({ entries, currentUserId }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-4 w-4 text-[var(--xp-gold)]" />
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />
      case 3:
        return <Award className="h-4 w-4 text-orange-400" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="h-5 w-5 text-[var(--xp-gold)]" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground">No public profiles yet. Be the first!</div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => {
              const rank = index + 1
              const isCurrentUser = entry.id === currentUserId
              const initials = entry.display_name
                ? entry.display_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "?"

              return (
                <div
                  key={entry.id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg",
                    isCurrentUser && "bg-primary/5 border border-primary/20",
                    rank <= 3 && "font-medium",
                  )}
                >
                  {/* Rank */}
                  <div className="flex h-6 w-6 items-center justify-center">
                    {getRankIcon(rank) || <span className="text-sm text-muted-foreground">{rank}</span>}
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {entry.display_name || entry.username || "Anonymous"}
                      {isCurrentUser && <span className="text-primary ml-1">(You)</span>}
                    </p>
                  </div>

                  {/* XP */}
                  <div className="text-right">
                    <p className="text-sm font-bold text-[var(--xp-gold)]">{entry.xp_points.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">XP</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
