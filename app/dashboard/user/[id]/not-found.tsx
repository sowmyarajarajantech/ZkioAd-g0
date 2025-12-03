import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserX } from "lucide-react"

export default function UserNotFound() {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
      <UserX className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
      <p className="text-muted-foreground mb-6">The user you&apos;re looking for doesn&apos;t exist.</p>
      <Button asChild>
        <Link href="/dashboard/community">Back to Community</Link>
      </Button>
    </div>
  )
}
