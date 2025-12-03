import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Roadmap, UserRoadmapProgress } from "@/lib/types"
import { ArrowRight, Map } from "lucide-react"

interface ProgressProps {
  progress: (UserRoadmapProgress & {
    roadmap: Roadmap
    completed_topics_count: number
  })[]
}

export function DashboardProgress({ progress }: ProgressProps) {
  if (progress.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Map className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No roadmaps started yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Start a learning roadmap to track your progress</p>
            <Button asChild>
              <Link href="/dashboard/explore">
                Explore Roadmaps
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          Your Progress
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/my-roadmaps">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {progress.map((item) => {
          const totalTopics = item.roadmap.total_topics || 1
          const percentage = Math.round((item.completed_topics_count / totalTopics) * 100)

          return (
            <Link key={item.id} href={`/dashboard/roadmap/${item.roadmap_id}`} className="block group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium group-hover:text-primary transition-colors">{item.roadmap.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.completed_topics_count} of {totalTopics} topics completed
                    </p>
                  </div>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
