import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { RoadmapCreator } from "@/components/creator/roadmap-creator"

export default async function CreateRoadmapPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create Custom Roadmap</h1>
        <p className="text-muted-foreground mt-2">
          Design your own learning pathway with drag-and-drop sections and topics
        </p>
      </div>
      <RoadmapCreator userId={user.id} />
    </div>
  )
}
