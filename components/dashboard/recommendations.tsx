import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Binary, Brain, Globe } from "lucide-react"

const recommendations = [
  {
    icon: Binary,
    title: "Continue DSA Journey",
    description: "You were working on Binary Search. Keep the momentum!",
    href: "/dashboard/roadmap/11111111-1111-1111-1111-111111111111",
    color: "bg-emerald-500",
  },
  {
    icon: Brain,
    title: "Try AI & ML",
    description: "Based on your DSA progress, you're ready for ML basics.",
    href: "/dashboard/roadmap/22222222-2222-2222-2222-222222222222",
    color: "bg-violet-500",
  },
  {
    icon: Globe,
    title: "Mini Project Time",
    description: "Build a todo app to practice your React skills!",
    href: "/dashboard/explore",
    color: "bg-blue-500",
  },
]

export function DashboardRecommendations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[var(--xp-gold)]" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {recommendations.map((rec) => (
            <Link key={rec.title} href={rec.href} className="group">
              <div className="rounded-lg border p-4 h-full transition-all hover:border-primary/50 hover:shadow-sm">
                <div className={`h-1.5 w-12 rounded-full ${rec.color} mb-3`} />
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                    <rec.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{rec.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/explore">
              Explore All Roadmaps
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
