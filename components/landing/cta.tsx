import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"

export function LandingCTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-16 md:px-12 md:py-20">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm text-primary-foreground">
              <Zap className="h-4 w-4" />
              <span>100% Free to Start</span>
            </div>

            <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl text-balance">
              Ready to Transform Your Learning?
            </h2>

            <p className="mb-8 text-lg text-primary-foreground/80">
              Join thousands of students who are leveling up their skills with ZkioAd. Start your journey today and
              watch your progress soar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" className="text-base px-8 h-12" asChild>
                <Link href="/auth/sign-up">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-base px-8 h-12 text-primary-foreground hover:text-primary-foreground hover:bg-white/20"
                asChild
              >
                <Link href="#roadmaps">Browse Roadmaps</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
