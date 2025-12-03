import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Map, Plus, ArrowRight, CheckCircle2 } from "lucide-react"

export default async function MyRoadmapsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's roadmap progress
  const { data: userProgress } = await supabase
    .from("user_roadmap_progress")
    .select(`
      *,
      roadmap:roadmaps(*)
    `)
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })

  // Get completion counts
  const { data: completions } = await supabase.from("topic_completions").select("roadmap_id").eq("user_id", user.id)

  const completionCounts: Record<string, number> = {}
  completions?.forEach((c) => {
    completionCounts[c.roadmap_id] = (completionCounts[c.roadmap_id] || 0) + 1
  })

  const activeRoadmaps = userProgress?.filter((p) => p.is_active && !p.completed_at) || []
  const completedRoadmaps = userProgress?.filter((p) => p.completed_at) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">My Roadmaps</h1>
          <p className="text-muted-foreground mt-1">Track your learning progress across all roadmaps</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Custom
          </Link>
        </Button>
      </div>

      {/* Active Roadmaps */}
      <div>
        <h2 className="text-lg font-semibold mb-4">In Progress ({activeRoadmaps.length})</h2>
        {activeRoadmaps.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No active roadmaps</h3>
              <p className="text-sm text-muted-foreground mb-4">Start learning by exploring our roadmaps</p>
              <Button asChild>
                <Link href="/dashboard/explore">
                  Explore Roadmaps
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {activeRoadmaps.map((item) => {
              const totalTopics = item.roadmap.total_topics || 1
              const completed = completionCounts[item.roadmap_id] || 0
              const percentage = Math.round((completed / totalTopics) * 100)

              return (
                <Link key={item.id} href={`/dashboard/roadmap/${item.roadmap_id}`}>
                  <Card className="h-full transition-all hover:shadow-md hover:border-primary/20">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{item.roadmap.title}</CardTitle>
                        <Badge variant="outline" className="text-xs capitalize">
                          {item.roadmap.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {completed} of {totalTopics} topics
                          </span>
                          <span className="font-medium">{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Completed Roadmaps */}
      {completedRoadmaps.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Completed ({completedRoadmaps.length})</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {completedRoadmaps.map((item) => (
              <Link key={item.id} href={`/dashboard/roadmap/${item.roadmap_id}`}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/20 bg-[var(--success)]/5">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[var(--success)]" />
                        {item.roadmap.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Completed on {new Date(item.completed_at!).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
