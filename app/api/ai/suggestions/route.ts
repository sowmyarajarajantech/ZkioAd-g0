import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get user's completed topics with roadmap info
    const { data: completedTopics } = await supabase
      .from("user_progress")
      .select(`
        topics (
          id,
          title,
          difficulty,
          section_id,
          roadmap_sections (
            title,
            roadmap_id,
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

    // Get user's profile for context
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, total_xp, current_streak")
      .eq("id", user.id)
      .single()

    // Get user's active roadmaps
    const { data: activeRoadmaps } = await supabase
      .from("user_roadmaps")
      .select(`
        roadmaps (
          id,
          title,
          category
        )
      `)
      .eq("user_id", user.id)

    // Build context for AI
    const completedTopicsList = completedTopics
      ?.map((p) => {
        const topic = p.topics as any
        return `${topic?.title} (${topic?.roadmap_sections?.roadmaps?.category})`
      })
      .filter(Boolean)
      .join(", ")

    const activeRoadmapsList = activeRoadmaps
      ?.map((r) => (r.roadmaps as any)?.title)
      .filter(Boolean)
      .join(", ")

    const prompt = `You are a helpful learning assistant for students. Based on the following student profile, generate 3 personalized learning suggestions.

Student Profile:
- Name: ${profile?.display_name || "Student"}
- Total XP: ${profile?.total_xp || 0}
- Current Streak: ${profile?.current_streak || 0} days
- Active Roadmaps: ${activeRoadmapsList || "None"}
- Recently Completed Topics: ${completedTopicsList || "None yet"}

Generate exactly 3 suggestions in JSON format. Each suggestion should have:
- title: A short, actionable title (max 8 words)
- description: A brief explanation (max 20 words)
- type: One of "project", "topic", "challenge", "review"
- priority: "high", "medium", or "low"

Consider:
1. If they completed React basics, suggest a mini project
2. If they have a streak, encourage maintaining it
3. If they haven't started, suggest beginner-friendly topics
4. Mix practical projects with learning

Return ONLY valid JSON array, no markdown or explanation.`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      temperature: 0.7,
    })

    // Parse the AI response
    let suggestions
    try {
      // Clean up the response - remove markdown code blocks if present
      const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim()
      suggestions = JSON.parse(cleanedText)
    } catch {
      // Fallback suggestions if AI parsing fails
      suggestions = [
        {
          title: "Continue your learning streak",
          description: "Complete at least one topic today to maintain your streak!",
          type: "challenge",
          priority: "high",
        },
        {
          title: "Explore a new roadmap",
          description: "Discover new skills and expand your knowledge",
          type: "topic",
          priority: "medium",
        },
        {
          title: "Review completed topics",
          description: "Reinforce what you've learned with a quick review",
          type: "review",
          priority: "low",
        },
      ]
    }

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("AI suggestions error:", error)
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}
