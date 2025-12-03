import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { RoadmapHeader } from "@/components/roadmap/roadmap-header"
import { RoadmapSections } from "@/components/roadmap/roadmap-sections"
import { RoadmapSidebar } from "@/components/roadmap/roadmap-sidebar"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RoadmapPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get roadmap with sections and topics
  const { data: roadmap, error } = await supabase.from("roadmaps").select("*").eq("id", id).single()

  if (error || !roadmap) {
    notFound()
  }

  // Get sections
  const { data: sections } = await supabase
    .from("roadmap_sections")
    .select("*")
    .eq("roadmap_id", id)
    .order("order_index", { ascending: true })

  // Get topics
  const { data: topics } = await supabase
    .from("topics")
    .select("*")
    .eq("roadmap_id", id)
    .order("order_index", { ascending: true })

  // Get user progress
  const { data: userProgress } = await supabase
    .from("user_roadmap_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("roadmap_id", id)
    .maybeSingle()

  // Get completed topics
  const { data: completedTopics } = await supabase
    .from("topic_completions")
    .select("topic_id")
    .eq("user_id", user.id)
    .eq("roadmap_id", id)

  // Get resources
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .in("topic_id", topics?.map((t) => t.id) || [])

  // Organize data
  const completedTopicIds = new Set(completedTopics?.map((c) => c.topic_id) || [])
  const resourcesByTopic: Record<string, typeof resources> = {}
  resources?.forEach((r) => {
    if (!resourcesByTopic[r.topic_id]) {
      resourcesByTopic[r.topic_id] = []
    }
    resourcesByTopic[r.topic_id]!.push(r)
  })

  const sectionsWithTopics =
    sections?.map((section) => ({
      ...section,
      topics:
        topics
          ?.filter((t) => t.section_id === section.id)
          .map((t) => ({
            ...t,
            isCompleted: completedTopicIds.has(t.id),
            resources: resourcesByTopic[t.id] || [],
          })) || [],
    })) || []

  const totalTopics = topics?.length || 0
  const completedCount = completedTopicIds.size
  const progress = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0

  return (
    <div className="space-y-6">
      <RoadmapHeader
        roadmap={roadmap}
        progress={progress}
        completedCount={completedCount}
        totalTopics={totalTopics}
        userProgress={userProgress}
        userId={user.id}
      />

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <RoadmapSections sections={sectionsWithTopics} roadmapId={id} userId={user.id} />
        </div>
        <div className="lg:col-span-1">
          <RoadmapSidebar sections={sectionsWithTopics} completedCount={completedCount} totalTopics={totalTopics} />
        </div>
      </div>
    </div>
  )
}
