import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's completed topics with roadmap info
    const { data: completedTopics } = await supabase
      .from("user_progress")
      .select(`
        topics (
          title,
          difficulty,
          roadmap_sections (
            title,
            roadmaps (
              title,
              category
            )
          )
        )
      `)
      .eq("user_id", user.id)
      .eq("completed", true)
      .order("completed_at", { ascending: false })
      .limit(20)

    // Get user's current roadmaps
    const { data: userRoadmaps } = await supabase
      .from("user_roadmaps")
      .select(`
        roadmaps (
          title,
          category
        )
      `)
      .eq("user_id", user.id)

    // Get user profile for streak and XP context
    const { data: profile } = await supabase
      .from("profiles")
      .select("total_xp, current_streak")
      .eq("id", user.id)
      .single()

    // Format context for AI
    const completedTopicsList =
      completedTopics
        ?.map((p) => {
          const topic = p.topics as any
          return `${topic?.title} (${topic?.difficulty}) in ${topic?.roadmap_sections?.roadmaps?.title}`
        })
        .filter(Boolean)
        .join(", ") || "No topics completed yet"

    const currentRoadmapsList =
      userRoadmaps
        ?.map((r) => {
          const roadmap = r.roadmaps as any
          return `${roadmap?.title} (${roadmap?.category})`
        })
        .join(", ") || "No active roadmaps"

    const prompt = `You are a helpful learning assistant for a student skill tracker app. Based on the student's learning progress, provide 3-4 personalized recommendations.

Student Context:
- Total XP: ${profile?.total_xp || 0}
- Current Streak: ${profile?.current_streak || 0} days
- Active Roadmaps: ${currentRoadmapsList}
- Recently Completed Topics: ${completedTopicsList}

Provide recommendations in this JSON format:
{
  "recommendations": [
    {
      "type": "next_topic" | "mini_project" | "review" | "new_roadmap" | "streak_tip",
      "title": "Brief title",
      "description": "1-2 sentence explanation",
      "reason": "Why this is recommended based on their progress"
    }
  ]
}

Be specific and actionable. If they've completed foundational topics, suggest hands-on projects. If they're on a streak, encourage them to maintain it. If they haven't started, suggest beginner-friendly topics.`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      maxTokens: 500,
    })

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({
        recommendations: [
          {
            type: "next_topic",
            title: "Keep Learning!",
            description: "Continue with your current roadmap to build momentum.",
            reason: "Consistency is key to mastering new skills.",
          },
        ],
      })
    }

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
  } catch (error) {
    console.error("AI suggestion error:", error)
    return NextResponse.json({
      recommendations: [
        {
          type: "next_topic",
          title: "Explore a New Topic",
          description: "Pick any topic from your roadmap and dive in!",
          reason: "Every topic you complete brings you closer to your goals.",
        },
      ],
    })
  }
}
