"use client"

import { useState } from "react"
import { TopicItem } from "./topic-item"
import type { RoadmapSection, Topic, Resource } from "@/lib/types"
import { ChevronDown, ChevronRight, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TopicWithStatus extends Topic {
  isCompleted: boolean
  resources: Resource[]
}

interface SectionWithTopics extends RoadmapSection {
  topics: TopicWithStatus[]
}

interface RoadmapSectionsProps {
  sections: SectionWithTopics[]
  roadmapId: string
  userId: string
}

export function RoadmapSections({ sections, roadmapId, userId }: RoadmapSectionsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(sections.map((s) => s.id)))

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  return (
    <div className="space-y-4">
      {sections.map((section, sectionIndex) => {
        const isExpanded = expandedSections.has(section.id)
        const completedInSection = section.topics.filter((t) => t.isCompleted).length
        const totalInSection = section.topics.length
        const isSectionComplete = completedInSection === totalInSection && totalInSection > 0

        return (
          <div key={section.id} className="rounded-xl border bg-card overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className={cn(
                "w-full flex items-center justify-between p-4 md:p-6 text-left transition-colors",
                "hover:bg-muted/50",
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                    isSectionComplete ? "bg-[var(--success)] text-white" : "bg-primary/10 text-primary",
                  )}
                >
                  {isSectionComplete ? <CheckCircle2 className="h-5 w-5" /> : sectionIndex + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{section.title}</h3>
                  {section.description && <p className="text-sm text-muted-foreground mt-0.5">{section.description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {completedInSection}/{totalInSection} completed
                </span>
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Topics */}
            {isExpanded && (
              <div className="border-t">
                {section.topics.map((topic, topicIndex) => (
                  <TopicItem
                    key={topic.id}
                    topic={topic}
                    index={topicIndex}
                    roadmapId={roadmapId}
                    userId={userId}
                    isLast={topicIndex === section.topics.length - 1}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
