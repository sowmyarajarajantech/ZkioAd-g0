import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { RoadmapSection, Topic, Resource } from "@/lib/types"
import { Map, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TopicWithStatus extends Topic {
  isCompleted: boolean
  resources: Resource[]
}

interface SectionWithTopics extends RoadmapSection {
  topics: TopicWithStatus[]
}

interface RoadmapSidebarProps {
  sections: SectionWithTopics[]
  completedCount: number
  totalTopics: number
}

export function RoadmapSidebar({ sections, completedCount, totalTopics }: RoadmapSidebarProps) {
  const progress = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Map className="h-5 w-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * progress) / 100}
                  className="text-primary transition-all duration-500"
                />
              </svg>
              <span className="absolute text-2xl font-bold">{progress}%</span>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            {completedCount} of {totalTopics} topics completed
          </div>
        </CardContent>
      </Card>

      {/* Section Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sections.map((section, index) => {
            const completedInSection = section.topics.filter((t) => t.isCompleted).length
            const totalInSection = section.topics.length
            const sectionProgress = totalInSection > 0 ? Math.round((completedInSection / totalInSection) * 100) : 0
            const isComplete = completedInSection === totalInSection && totalInSection > 0

            return (
              <div key={section.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium shrink-0",
                        isComplete ? "bg-[var(--success)] text-white" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {isComplete ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
                    </span>
                    <span className="text-sm font-medium truncate">{section.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {completedInSection}/{totalInSection}
                  </span>
                </div>
                <Progress value={sectionProgress} className="h-1.5" />
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
