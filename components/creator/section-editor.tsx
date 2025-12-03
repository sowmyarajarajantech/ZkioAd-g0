"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { TopicEditor } from "./topic-editor"
import type { Section, Topic } from "./roadmap-creator"
import { ChevronDown, ChevronUp, Trash2, GripVertical, Plus, ChevronRight } from "lucide-react"

interface SectionEditorProps {
  section: Section
  index: number
  totalSections: number
  onUpdate: (updates: Partial<Section>) => void
  onDelete: () => void
  onMove: (direction: "up" | "down") => void
  onAddTopic: () => void
  onUpdateTopic: (topicId: string, updates: Partial<Topic>) => void
  onDeleteTopic: (topicId: string) => void
  onMoveTopic: (topicId: string, direction: "up" | "down") => void
}

export function SectionEditor({
  section,
  index,
  totalSections,
  onUpdate,
  onDelete,
  onMove,
  onAddTopic,
  onUpdateTopic,
  onDeleteTopic,
  onMoveTopic,
}: SectionEditorProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Card className="border-l-4 border-l-primary">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onMove("up")}
                disabled={index === 0}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onMove("down")}
                disabled={index === totalSections - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />

            <div className="flex-1">
              <Input
                value={section.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="font-semibold text-lg border-none p-0 h-auto focus-visible:ring-0"
                placeholder="Section Title"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {section.topics.length} topic{section.topics.length !== 1 ? "s" : ""}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            <Input
              value={section.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Section description (optional)"
              className="text-sm"
            />

            {/* Topics */}
            <div className="space-y-3 pl-4 border-l-2 border-muted">
              {section.topics.map((topic, topicIndex) => (
                <TopicEditor
                  key={topic.id}
                  topic={topic}
                  index={topicIndex}
                  totalTopics={section.topics.length}
                  onUpdate={(updates) => onUpdateTopic(topic.id, updates)}
                  onDelete={() => onDeleteTopic(topic.id)}
                  onMove={(dir) => onMoveTopic(topic.id, dir)}
                />
              ))}

              <Button variant="outline" size="sm" className="w-full border-dashed bg-transparent" onClick={onAddTopic}>
                <Plus className="h-4 w-4 mr-2" />
                Add Topic
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
