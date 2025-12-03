import type React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Roadmap } from "@/lib/types"
import { Binary, Brain, Shield, Globe, Server, Map, Clock, BookOpen } from "lucide-react"

interface RoadmapGridProps {
  roadmaps: Roadmap[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  binary: Binary,
  brain: Brain,
  shield: Shield,
  globe: Globe,
  server: Server,
}

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
  amber: "bg-amber-500",
}

export function RoadmapGrid({ roadmaps }: RoadmapGridProps) {
  if (roadmaps.length === 0) {
    return (
      <div className="text-center py-12">
        <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold mb-2">No roadmaps found</h3>
        <p className="text-sm text-muted-foreground">Check back later or create your own!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {roadmaps.map((roadmap) => {
        const IconComponent = iconMap[roadmap.icon || ""] || Map
        const colorClass = colorMap[roadmap.color || ""] || "bg-primary"

        return (
          <Link key={roadmap.id} href={`/dashboard/roadmap/${roadmap.id}`}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 group">
              <div className={`h-2 ${colorClass}`} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  {roadmap.is_official && (
                    <Badge variant="secondary" className="text-xs">
                      Official
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{roadmap.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{roadmap.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{roadmap.total_topics} topics</span>
                  </div>
                  {roadmap.estimated_hours && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>~{roadmap.estimated_hours}h</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Badge variant="outline" className="text-xs capitalize">
                    {roadmap.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs ml-2">
                    {roadmap.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
