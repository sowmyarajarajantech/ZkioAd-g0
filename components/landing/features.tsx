import { Map, CheckCircle2, Flame, Award, Palette, Link2, Users, Sparkles } from "lucide-react"

const features = [
  {
    icon: Map,
    title: "Structured Roadmaps",
    description:
      "Follow expert-curated learning paths for DSA, AI, Web Dev, Cybersecurity, and more. Each roadmap breaks down complex topics into manageable steps.",
  },
  {
    icon: CheckCircle2,
    title: "Progress Tracking",
    description:
      "Check off completed topics and visualize your advancement with intuitive progress bars. Never lose track of where you left off.",
  },
  {
    icon: Flame,
    title: "Daily Streaks",
    description:
      "Build consistent study habits with streak tracking. Stay motivated by maintaining your learning momentum every day.",
  },
  {
    icon: Award,
    title: "Badge System",
    description:
      "Earn badges for milestones like completing roadmaps, maintaining streaks, and mastering topics. Show off your achievements!",
  },
  {
    icon: Palette,
    title: "Custom Roadmaps",
    description:
      "Create your own personalized learning paths with our drag-and-drop builder. Share your custom roadmaps with the community.",
  },
  {
    icon: Link2,
    title: "Resource Links",
    description:
      "Access curated links to YouTube, Udemy, Coursera, and documentation. All the best resources in one place.",
  },
  {
    icon: Users,
    title: "Community Visibility",
    description:
      "Opt-in to share your progress with classmates. Foster accountability and celebrate achievements together.",
  },
  {
    icon: Sparkles,
    title: "AI Suggestions",
    description:
      "Get personalized recommendations based on your progress. AI suggests next steps and mini-projects to solidify your learning.",
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Everything You Need to Level Up</h2>
          <p className="text-muted-foreground text-lg">
            Powerful features designed to make your learning journey engaging, structured, and rewarding.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
