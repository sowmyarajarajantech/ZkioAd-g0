import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Flame, Trophy, Users, Sparkles } from "lucide-react"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-primary font-medium">Gamified Learning for Students</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-balance">
            Master Skills with
            <span className="text-primary"> Interactive Roadmaps</span>
          </h1>

          {/* Subheadline */}
          <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto text-pretty">
            Track your learning journey, earn XP and badges, maintain streaks, and connect with fellow students. From
            DSA to AI, we&apos;ve got your path covered.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="text-base px-8 h-12" asChild>
              <Link href="/auth/sign-up">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 h-12 bg-transparent" asChild>
              <Link href="#roadmaps">Explore Roadmaps</Link>
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-[var(--streak-orange)]/10 px-4 py-2 text-sm font-medium text-[var(--streak-orange)]">
              <Flame className="h-4 w-4" />
              Daily Streaks
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[var(--xp-gold)]/10 px-4 py-2 text-sm font-medium text-[var(--xp-gold)]">
              <Trophy className="h-4 w-4" />
              Earn Badges
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[var(--badge-purple)]/10 px-4 py-2 text-sm font-medium text-[var(--badge-purple)]">
              <Users className="h-4 w-4" />
              Community
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-16 relative mx-auto max-w-5xl">
          <div className="rounded-xl border bg-card shadow-2xl shadow-primary/10 overflow-hidden">
            <div className="border-b bg-muted/50 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 text-center text-sm text-muted-foreground">Your Learning Dashboard</div>
            </div>
            <div className="p-6 md:p-8 bg-gradient-to-b from-muted/30 to-background">
              <div className="grid gap-4 md:grid-cols-3">
                {/* XP Card */}
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--xp-gold)]/20">
                      <Sparkles className="h-5 w-5 text-[var(--xp-gold)]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total XP</p>
                      <p className="text-2xl font-bold">2,450</p>
                    </div>
                  </div>
                </div>
                {/* Streak Card */}
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--streak-orange)]/20">
                      <Flame className="h-5 w-5 text-[var(--streak-orange)]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Streak</p>
                      <p className="text-2xl font-bold">14 days</p>
                    </div>
                  </div>
                </div>
                {/* Badges Card */}
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--badge-purple)]/20">
                      <Trophy className="h-5 w-5 text-[var(--badge-purple)]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Badges Earned</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Progress Bars */}
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Data Structures & Algorithms</span>
                    <span className="text-sm text-muted-foreground">68%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[68%] rounded-full bg-primary transition-all" />
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Web Development</span>
                    <span className="text-sm text-muted-foreground">42%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[42%] rounded-full bg-[var(--badge-purple)] transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
