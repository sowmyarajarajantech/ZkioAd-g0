import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Map, ArrowLeft } from "lucide-react"

export default function RoadmapNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
        <Map className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Roadmap Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        The roadmap you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/dashboard/explore">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Browse Roadmaps
        </Link>
      </Button>
    </div>
  )
}
