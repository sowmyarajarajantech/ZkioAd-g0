import { LandingHero } from "@/components/landing/hero"
import { LandingFeatures } from "@/components/landing/features"
import { LandingRoadmaps } from "@/components/landing/roadmaps"
import { LandingStats } from "@/components/landing/stats"
import { LandingCTA } from "@/components/landing/cta"
import { LandingNav } from "@/components/landing/nav"
import { LandingFooter } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav />
      <main className="flex-1">
        <LandingHero />
        <LandingStats />
        <LandingFeatures />
        <LandingRoadmaps />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  )
}
