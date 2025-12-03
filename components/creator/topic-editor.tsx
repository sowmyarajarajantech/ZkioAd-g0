"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { Topic } from "./roadmap-creator"
import { ChevronDown, ChevronUp, Trash2, Plus, Link, X, ChevronRight } from "lucide-react"

interface TopicEditorProps {
  topic: Topic
  index: number
  totalTopics: number
  onUpdate: (updates: Partial<Topic>) => void
  onDelete: () => void
  onMove: (direction: "up" | "down") => void
}

const RESOURCE_TYPES = [
  { value: "video", label: "Video", icon: "🎥" },
  { value: "article", label: "Article", icon: "📄" },
  { value: "course", label: "Course", icon: "📚" },
  { value: "documentation", label: "Docs", icon: "📖" },
  { value: "practice", label: "Practice", icon: "💻" },
]

export function TopicEditor({ topic, index, totalTopics, onUpdate, onDelete, onMove }: TopicEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newResource, setNewResource] = useState({ title: "", url: "", type: "video" })

  const addResource = () => {
    if (!newResource.title || !newResource.url) return
    onUpdate({
      resources: [...topic.resources, newResource],
    })
    setNewResource({ title: "", url: "", type: "video" })
  }

  const removeResource = (index: number) => {
    onUpdate({
      resources: topic.resources.filter((_, i) => i !== index),
    })
  }

  return (
    <Card className="bg-muted/30">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-2 p-3">
          <div className="flex flex-col">
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onMove("up")} disabled={index === 0}>
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => onMove("down")}
              disabled={index === totalTopics - 1}
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>

          <Input
            value={topic.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="flex-1 h-8 text-sm"
            placeholder="Topic title"
          />

          <Select value={topic.difficulty} onValueChange={(v: any) => onUpdate({ difficulty: v })}>
            <SelectTrigger className="w-28 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">
                <span className="text-green-500">Beginner</span>
              </SelectItem>
              <SelectItem value="intermediate">
                <span className="text-yellow-500">Intermediate</span>
              </SelectItem>
              <SelectItem value="advanced">
                <span className="text-red-500">Advanced</span>
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Input
              type="number"
              min={5}
              max={100}
              value={topic.xp_value}
              onChange={(e) => onUpdate({ xp_value: Number.parseInt(e.target.value) || 10 })}
              className="w-16 h-8 text-xs text-center"
            />
            <span className="text-xs text-xp font-medium">XP</span>
          </div>

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

        <CollapsibleContent>
          <CardContent className="pt-0 pb-3 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Description</Label>
              <Input
                value={topic.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Brief description of this topic"
                className="text-sm"
              />
            </div>

            {/* Resources */}
            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1">
                <Link className="h-3 w-3" />
                Resources ({topic.resources.length})
              </Label>

              {topic.resources.map((resource, i) => (
                <div key={i} className="flex items-center gap-2 text-sm bg-background p-2 rounded">
                  <span>{RESOURCE_TYPES.find((t) => t.value === resource.type)?.icon}</span>
                  <span className="flex-1 truncate">{resource.title}</span>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-xs"
                  >
                    Link
                  </a>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeResource(i)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}

              {/* Add new resource */}
              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <Input
                    placeholder="Resource title"
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Input
                    placeholder="URL"
                    value={newResource.url}
                    onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                    className="h-8 text-sm"
                  />
                </div>
                <Select value={newResource.type} onValueChange={(v) => setNewResource({ ...newResource, type: v })}>
                  <SelectTrigger className="w-24 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOURCE_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.icon} {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" className="h-8" onClick={addResource}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
