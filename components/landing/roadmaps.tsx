import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Binary, Brain, Shield, Globe, Server } from "lucide-react"

const roadmaps = [
  {
    id: "dsa",
    icon: Binary,
    title: "Data Structures & Algorithms",
    description: "Master the fundamentals to ace coding interviews",
    topics: 45,
    hours: 120,
    color: "bg-emerald-500",
  },
  {
    id: "ai",
    icon: Brain,
    title: "Artificial Intelligence & ML",
    description: "From basics to neural networks and real-world applications",
    topics: 52,
    hours: 200,
    color: "bg-violet-500",
  },
  {
    id: "security",
    icon: Shield,
    title: "Cybersecurity Fundamentals",
    description: "Protect systems and networks with essential security skills",
    topics: 38,
    hours: 100,
    color: "bg-red-500",
  },
  {
    id: "webdev",
    icon: Globe,
    title: "Web Development",
    description: "Full-stack development from HTML to React and Node.js",
    topics: 60,
    hours: 150,
    color: "bg-blue-500",
  },
  {
    id: "system",
    icon: Server,
    title: "System Design",
    description: "Design scalable distributed systems like a senior engineer",
    topics: 30,
    hours: 80,
    color: "bg-amber-500",
  },
]

export function LandingRoadmaps() {
  return (
    <section id="roadmaps" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Expert-Curated Roadmaps</h2>
          <p className="text-muted-foreground text-lg">
            Start with battle-tested learning paths created by industry experts, or create your own custom roadmap.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className="group rounded-xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              <div className={`h-2 ${roadmap.color}`} />
              <div className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <roadmap.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{roadmap.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{roadmap.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{roadmap.topics} topics</span>
                  <span>~{roadmap.hours} hours</span>
                </div>
              </div>
            </div>
          ))}

          {/* Create Custom Card */}
          <div className="group rounded-xl border border-dashed bg-card/50 overflow-hidden transition-all hover:border-primary/50 hover:bg-card">
            <div className="h-2 bg-gradient-to-r from-primary to-accent opacity-50" />
            <div className="p-6 flex flex-col items-center justify-center text-center h-[calc(100%-8px)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <span className="text-2xl">+</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Create Your Own</h3>
              <p className="mb-4 text-sm text-muted-foreground">Build a custom roadmap tailored to your goals</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/sign-up">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
