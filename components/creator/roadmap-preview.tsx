"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Section } from "./roadmap-creator"
import { ArrowLeft, Clock, BookOpen, Zap } from "lucide-react"

interface RoadmapPreviewProps {
  roadmap: {
    title: string
    description: string
    category: string
    difficulty: string
    estimated_hours: number
  }
  sections: Section[]
  onBack: () => void
}

export function RoadmapPreview({ roadmap, sections, onBack }: RoadmapPreviewProps) {
  const totalTopics = sections.reduce((acc, s) => acc + s.topics.length, 0)
  const totalXP = sections.reduce((acc, s) => acc + s.topics.reduce((tacc, t) => tacc + t.xp_value, 0), 0)

  const difficultyColors: Record<string, string> = {
    beginner: "bg-green-500/10 text-green-500",
    intermediate: "bg-yellow-500/10 text-yellow-500",
    advanced: "bg-red-500/10 text-red-500",
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Editor
      </Button>

      {/* Header */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{roadmap.category || "Uncategorized"}</Badge>
                <Badge className={difficultyColors[roadmap.difficulty]}>{roadmap.difficulty}</Badge>
              </div>
              <h1 className="text-3xl font-bold">{roadmap.title || "Untitled Roadmap"}</h1>
              <p className="text-muted-foreground mt-2">{roadmap.description || "No description"}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>{roadmap.estimated_hours} hours</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <span>{totalTopics} topics</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-xp" />
              <span className="text-xp font-semibold">{totalXP} XP</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections Preview */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Roadmap Structure</h2>

        {sections.map((section, sectionIndex) => (
          <Card key={section.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                    {sectionIndex + 1}
                  </span>
                  {section.title}
                </CardTitle>
                <span className="text-sm text-muted-foreground">{section.topics.length} topics</span>
              </div>
              {section.description && <p className="text-sm text-muted-foreground ml-9">{section.description}</p>}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="ml-9 space-y-2">
                {section.topics.map((topic, topicIndex) => (
                  <div key={topic.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                      <span className="font-medium">{topic.title}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          topic.difficulty === "beginner"
                            ? "text-green-500"
                            : topic.difficulty === "intermediate"
                              ? "text-yellow-500"
                              : "text-red-500"
                        }`}
                      >
                        {topic.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      {topic.resources.length > 0 && (
                        <span className="text-xs text-muted-foreground">{topic.resources.length} resources</span>
                      )}
                      <span className="text-sm font-medium text-xp">{topic.xp_value} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Preview Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-bold">{sections.length}</p>
              <p className="text-sm text-muted-foreground">Sections</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{totalTopics}</p>
              <p className="text-sm text-muted-foreground">Topics</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-xp">{totalXP}</p>
              <p className="text-sm text-muted-foreground">Total XP</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{roadmap.estimated_hours}h</p>
              <p className="text-sm text-muted-foreground">Est. Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
