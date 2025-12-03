import { createClient } from "@/lib/supabase/server"
import { RoadmapGrid } from "@/components/roadmap/roadmap-grid"

export default async function ExplorePage() {
  const supabase = await createClient()

  // Get all public roadmaps
  const { data: roadmaps } = await supabase
    .from("roadmaps")
    .select("*")
    .eq("is_public", true)
    .order("is_official", { ascending: false })
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Explore Roadmaps</h1>
        <p className="text-muted-foreground mt-1">Discover learning paths created by experts and the community</p>
      </div>

      <RoadmapGrid roadmaps={roadmaps || []} />
    </div>
  )
}
