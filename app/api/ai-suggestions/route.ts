import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Create Supabase client with proper cookie handling
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              // Ignore errors in server context
            }
          },
        },
      }
    )

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

Be specific and actionable. If they've completed foundational topics, suggest hands-on projects. If they're on a streak, encourage them to maintain it. If they haven't started, suggest beginner-friendly topics. Return ONLY valid JSON, no markdown.`

    let recommendations = []

    try {
      // Use Gemini API for dynamic suggestions
      if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        const resp = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GOOGLE_GENERATIVE_AI_API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            },
          }),
        })

        if (!resp.ok) {
          const errText = await resp.text()
          console.error("Gemini API error:", resp.status, errText)
          throw new Error(`Gemini API error: ${resp.status}`)
        }

        const result = await resp.json()
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || ""
        
        try {
          const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim()
          const parsed = JSON.parse(cleanedText)
          recommendations = parsed.recommendations || []
        } catch (parseErr) {
          console.error("Failed to parse Gemini response:", parseErr)
          throw new Error("Failed to parse AI response")
        }
      } else {
        throw new Error("Gemini API key not configured")
      }
    } catch (error) {
      console.error("AI suggestion error:", error)
      // Return fallback recommendations if AI generation fails
      recommendations = [
        {
          type: "next_topic",
          title: "Continue Your Learning Journey",
          description: "Pick the next topic in your active roadmap and dive in!",
          reason: "Consistent progress builds strong foundations."
        },
        {
          type: "mini_project",
          title: "Build a Small Project",
          description: "Apply what you've learned with a practical mini-project.",
          reason: "Hands-on practice reinforces learning."
        },
        {
          type: "streak_tip",
          title: "Maintain Your Streak",
          description: "Complete at least one topic today to keep your streak alive!",
          reason: "Daily consistency is key to mastering new skills."
        }
      ]
    }

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Route error:", error)
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
