import { Users, BookOpen, Trophy, Flame } from "lucide-react"

const stats = [
  { icon: Users, value: "10,000+", label: "Active Students" },
  { icon: BookOpen, value: "50+", label: "Learning Paths" },
  { icon: Trophy, value: "100K+", label: "Badges Earned" },
  { icon: Flame, value: "5M+", label: "Study Streaks" },
]

export function LandingStats() {
  return (
    <section className="border-y bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold md:text-3xl">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
