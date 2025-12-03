"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { SectionEditor } from "./section-editor"
import { RoadmapPreview } from "./roadmap-preview"
import { Save, Eye, Plus, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export type Topic = {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  xp_value: number
  resources: { title: string; url: string; type: string }[]
  order_index: number
}

export type Section = {
  id: string
  title: string
  description: string
  topics: Topic[]
  order_index: number
}

const CATEGORIES = [
  "Data Structures & Algorithms",
  "Artificial Intelligence",
  "Cybersecurity",
  "Web Development",
  "System Design",
  "Mobile Development",
  "DevOps",
  "Data Science",
  "Other",
]

const DIFFICULTIES = [
  { value: "beginner", label: "Beginner", color: "text-green-500" },
  { value: "intermediate", label: "Intermediate", color: "text-yellow-500" },
  { value: "advanced", label: "Advanced", color: "text-red-500" },
]

export function RoadmapCreator({ userId }: { userId: string }) {
  const router = useRouter()
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  const [roadmap, setRoadmap] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "beginner" as const,
    is_public: false,
    estimated_hours: 10,
  })

  const [sections, setSections] = useState<Section[]>([])

  const addSection = () => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      title: `Section ${sections.length + 1}`,
      description: "",
      topics: [],
      order_index: sections.length,
    }
    setSections([...sections, newSection])
  }

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setSections(sections.map((s) => (s.id === sectionId ? { ...s, ...updates } : s)))
  }

  const deleteSection = (sectionId: string) => {
    setSections(
      sections
        .filter((s) => s.id !== sectionId)
        .map((s, i) => ({
          ...s,
          order_index: i,
        })),
    )
  }

  const moveSection = (sectionId: string, direction: "up" | "down") => {
    const index = sections.findIndex((s) => s.id === sectionId)
    if ((direction === "up" && index === 0) || (direction === "down" && index === sections.length - 1)) return

    const newSections = [...sections]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    ;[newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]

    setSections(newSections.map((s, i) => ({ ...s, order_index: i })))
  }

  const addTopic = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId)
    if (!section) return

    const newTopic: Topic = {
      id: crypto.randomUUID(),
      title: `Topic ${section.topics.length + 1}`,
      description: "",
      difficulty: "beginner",
      xp_value: 10,
      resources: [],
      order_index: section.topics.length,
    }

    updateSection(sectionId, {
      topics: [...section.topics, newTopic],
    })
  }

  const updateTopic = (sectionId: string, topicId: string, updates: Partial<Topic>) => {
    const section = sections.find((s) => s.id === sectionId)
    if (!section) return

    updateSection(sectionId, {
      topics: section.topics.map((t) => (t.id === topicId ? { ...t, ...updates } : t)),
    })
  }

  const deleteTopic = (sectionId: string, topicId: string) => {
    const section = sections.find((s) => s.id === sectionId)
    if (!section) return

    updateSection(sectionId, {
      topics: section.topics
        .filter((t) => t.id !== topicId)
        .map((t, i) => ({
          ...t,
          order_index: i,
        })),
    })
  }

  const moveTopic = (sectionId: string, topicId: string, direction: "up" | "down") => {
    const section = sections.find((s) => s.id === sectionId)
    if (!section) return

    const index = section.topics.findIndex((t) => t.id === topicId)
    if ((direction === "up" && index === 0) || (direction === "down" && index === section.topics.length - 1)) return

    const newTopics = [...section.topics]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    ;[newTopics[index], newTopics[targetIndex]] = [newTopics[targetIndex], newTopics[index]]

    updateSection(sectionId, {
      topics: newTopics.map((t, i) => ({ ...t, order_index: i })),
    })
  }

  const saveRoadmap = async () => {
    if (!roadmap.title || sections.length === 0) {
      alert("Please add a title and at least one section")
      return
    }

    setSaving(true)
    const supabase = createClient()

    try {
      // Create the roadmap
      const { data: newRoadmap, error: roadmapError } = await supabase
        .from("roadmaps")
        .insert({
          title: roadmap.title,
          description: roadmap.description,
          category: roadmap.category || "Other",
          difficulty: roadmap.difficulty,
          estimated_hours: roadmap.estimated_hours,
          is_official: false,
          is_public: roadmap.is_public,
          created_by: userId,
          icon: "📚",
        })
        .select()
        .single()

      if (roadmapError) throw roadmapError

      // Create sections and topics
      for (const section of sections) {
        const { data: newSection, error: sectionError } = await supabase
          .from("roadmap_sections")
          .insert({
            roadmap_id: newRoadmap.id,
            title: section.title,
            description: section.description,
            order_index: section.order_index,
          })
          .select()
          .single()

        if (sectionError) throw sectionError

        // Create topics for this section
        for (const topic of section.topics) {
          const { data: newTopic, error: topicError } = await supabase
            .from("topics")
            .insert({
              section_id: newSection.id,
              title: topic.title,
              description: topic.description,
              difficulty: topic.difficulty,
              xp_value: topic.xp_value,
              order_index: topic.order_index,
            })
            .select()
            .single()

          if (topicError) throw topicError

          // Add resources for this topic
          if (topic.resources.length > 0) {
            const { error: resourceError } = await supabase.from("resources").insert(
              topic.resources.map((r, i) => ({
                topic_id: newTopic.id,
                title: r.title,
                url: r.url,
                type: r.type,
                order_index: i,
              })),
            )

            if (resourceError) throw resourceError
          }
        }
      }

      router.push(`/dashboard/roadmap/${newRoadmap.id}`)
    } catch (error) {
      console.error("Error saving roadmap:", error)
      alert("Failed to save roadmap. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const totalTopics = sections.reduce((acc, s) => acc + s.topics.length, 0)
  const totalXP = sections.reduce((acc, s) => acc + s.topics.reduce((tacc, t) => tacc + t.xp_value, 0), 0)

  if (showPreview) {
    return <RoadmapPreview roadmap={roadmap} sections={sections} onBack={() => setShowPreview(false)} />
  }

  return (
    <div className="space-y-6">
      {/* Roadmap Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Roadmap Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Frontend Development Mastery"
                value={roadmap.title}
                onChange={(e) => setRoadmap({ ...roadmap, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={roadmap.category} onValueChange={(v) => setRoadmap({ ...roadmap, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what students will learn..."
              value={roadmap.description}
              onChange={(e) => setRoadmap({ ...roadmap, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={roadmap.difficulty} onValueChange={(v: any) => setRoadmap({ ...roadmap, difficulty: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      <span className={d.color}>{d.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Estimated Hours</Label>
              <Input
                id="hours"
                type="number"
                min={1}
                value={roadmap.estimated_hours}
                onChange={(e) => setRoadmap({ ...roadmap, estimated_hours: Number.parseInt(e.target.value) || 10 })}
              />
            </div>
            <div className="flex items-center justify-between space-x-2 pt-6">
              <Label htmlFor="public" className="text-sm">
                Make Public
              </Label>
              <Switch
                id="public"
                checked={roadmap.is_public}
                onCheckedChange={(checked) => setRoadmap({ ...roadmap, is_public: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Bar */}
      <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Sections:</span>
          <span className="font-semibold">{sections.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Topics:</span>
          <span className="font-semibold">{totalTopics}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Total XP:</span>
          <span className="font-semibold text-xp">{totalXP}</span>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Sections</h2>
          <Button onClick={addSection} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </div>

        {sections.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-muted-foreground text-center">
                No sections yet. Click "Add Section" to start building your roadmap.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sections.map((section, index) => (
              <SectionEditor
                key={section.id}
                section={section}
                index={index}
                totalSections={sections.length}
                onUpdate={(updates) => updateSection(section.id, updates)}
                onDelete={() => deleteSection(section.id)}
                onMove={(dir) => moveSection(section.id, dir)}
                onAddTopic={() => addTopic(section.id)}
                onUpdateTopic={(topicId, updates) => updateTopic(section.id, topicId, updates)}
                onDeleteTopic={(topicId) => deleteTopic(section.id, topicId)}
                onMoveTopic={(topicId, dir) => moveTopic(section.id, topicId, dir)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-end pt-4 border-t">
        <Button variant="outline" onClick={() => setShowPreview(true)} disabled={sections.length === 0}>
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button onClick={saveRoadmap} disabled={saving || !roadmap.title || sections.length === 0}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Roadmap"}
        </Button>
      </div>
    </div>
  )
}
