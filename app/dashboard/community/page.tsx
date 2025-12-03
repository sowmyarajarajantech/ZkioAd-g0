import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CommunityFeed } from "@/components/community/community-feed"
import { TopLearners } from "@/components/community/top-learners"
import { TrendingRoadmaps } from "@/components/community/trending-roadmaps"
import { FollowingActivity } from "@/components/community/following-activity"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function CommunityPage() {
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
        <h1 className="text-3xl font-bold text-foreground">Community</h1>
        <p className="text-muted-foreground mt-2">Connect with fellow learners and discover trending roadmaps</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="feed">Global Feed</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>
            <TabsContent value="feed" className="mt-4">
              <CommunityFeed userId={user.id} />
            </TabsContent>
            <TabsContent value="following" className="mt-4">
              <FollowingActivity userId={user.id} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <TopLearners currentUserId={user.id} />
          <TrendingRoadmaps userId={user.id} />
        </div>
      </div>
    </div>
  )
}
