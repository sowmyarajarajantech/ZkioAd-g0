import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
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

    // Get roadmapId from query params if provided
    const url = new URL(request.url)
    const roadmapId = url.searchParams.get("roadmapId")

    // Get user's profile for context
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, total_xp, current_streak")
      .eq("id", user.id)
      .single()

    let roadmapContext = ""
    let upcomingTopicsContext = ""
    let currentTopicId: string | null = null
    let conceptResources: { title: string; url: string; platform: string }[] = []

    // If a specific roadmap is being pursued, get its details and upcoming topics
    if (roadmapId) {
      const { data: roadmap } = await supabase
        .from("roadmaps")
        .select("title, description, category, level")
        .eq("id", roadmapId)
        .single()

      if (roadmap) {
        roadmapContext = `Currently pursuing: ${roadmap.title} (${roadmap.category}, ${roadmap.level})`

        // Get roadmap sections and topics
        const { data: sections } = await supabase
          .from("roadmap_sections")
          .select(`
            id,
            title,
            topics (
              id,
              title,
              difficulty
            )
          `)
          .eq("roadmap_id", roadmapId)
          .order("order_index", { ascending: true })

        // Get user's progress on this specific roadmap
        const { data: userProgress } = await supabase
          .from("topic_completions")
          .select("topic_id")
          .eq("user_id", user.id)

        const completedTopicIds = new Set(userProgress?.map((p) => p.topic_id) || [])

        // Find upcoming/remaining topics and get resources for the first incomplete topic
        const upcomingTopics: string[] = []
        let foundIncompleteInSection = false

        sections?.forEach((section) => {
          const topics = (section.topics as any[]) || []
          for (const topic of topics) {
            if (!completedTopicIds.has(topic.id)) {
              if (!foundIncompleteInSection) {
                upcomingTopics.push(`${topic.title} (from ${section.title})`)
                if (!currentTopicId) {
                  currentTopicId = topic.id
                }
                foundIncompleteInSection = true
              }
            }
          }
        })

        upcomingTopicsContext = upcomingTopics.slice(0, 3).join(", ") || "All topics completed!"

        // If we found the current topic, fetch its resources (articles)
        if (currentTopicId) {
          const { data: resources } = await supabase
            .from("resources")
            .select("title, platform, resource_type, url")
            .eq("topic_id", currentTopicId)
            .eq("resource_type", "article")
            .limit(3)

          if (resources && resources.length > 0) {
            conceptResources = resources.map((r: any) => ({
              title: r.title,
              url: r.url,
              platform: r.platform,
            }))
          }
        }
      }
    } else {
      // If no specific roadmap, get user's active roadmaps
      const { data: activeRoadmaps } = await supabase
        .from("user_roadmap_progress")
        .select(`
          roadmap_id,
          roadmaps (
            id,
            title,
            category
          )
        `)
        .eq("user_id", user.id)
        .eq("is_active", true)
        .limit(1)

      if (activeRoadmaps && activeRoadmaps.length > 0) {
        const roadmap = (activeRoadmaps[0].roadmaps as any)
        roadmapContext = `Active roadmap: ${roadmap?.title}`
        const activeRoadmapId = activeRoadmaps[0].roadmap_id

        // Get sections and topics for the active roadmap
        const { data: sections } = await supabase
          .from("roadmap_sections")
          .select(`
            id,
            title,
            topics (
              id,
              title,
              difficulty
            )
          `)
          .eq("roadmap_id", activeRoadmapId)
          .order("order_index", { ascending: true })

        // Get user's progress
        const { data: userProgress } = await supabase
          .from("topic_completions")
          .select("topic_id")
          .eq("user_id", user.id)

        const completedTopicIds = new Set(userProgress?.map((p) => p.topic_id) || [])

        // Find first incomplete topic
        sections?.forEach((section) => {
          const topics = (section.topics as any[]) || []
          for (const topic of topics) {
            if (!completedTopicIds.has(topic.id) && !currentTopicId) {
              currentTopicId = topic.id
              break
            }
          }
        })

        // Fetch articles for the current topic
        if (currentTopicId) {
          const { data: resources } = await supabase
            .from("resources")
            .select("title, platform, resource_type, url")
            .eq("topic_id", currentTopicId)
            .eq("resource_type", "article")
            .limit(3)

          if (resources && resources.length > 0) {
            conceptResources = resources.map((r: any) => ({
              title: r.title,
              url: r.url,
              platform: r.platform,
            }))
          }
        }
      }
    }

    // Get user's recently completed topics
    const { data: completedTopics } = await supabase
      .from("topic_completions")
      .select(`
        topic_id,
        topics (
          title
        )
      `)
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(10)

    const completedTopicsList = completedTopics
      ?.map((p) => (p.topics as any)?.title)
      .filter(Boolean)
      .join(", ")

    const prompt = `You are a helpful learning assistant for students. Based on the following student profile and their current roadmap progress, generate 3 personalized learning suggestions that align with their active roadmap.

Student Profile:
- Name: ${profile?.display_name || "Student"}
- Total XP: ${profile?.total_xp || 0}
- Current Streak: ${profile?.current_streak || 0} days
- ${roadmapContext}
- Next topics to complete: ${upcomingTopicsContext || "Not specified"}
- Recently completed: ${completedTopicsList || "None yet"}
${conceptResources.length > 0 ? `- Recommended concept articles for current topic: ${conceptResources
  .map((a) => `${a.title} (${a.platform})`)
  .join(", ")}` : ""}

IMPORTANT: Your suggestions MUST be directly related to the roadmap they are currently pursuing. Focus on:
1. Recommending the concept articles listed above if available
2. Next logical topic in their roadmap
3. Project or practical challenge using skills from the roadmap
4. Reinforcing weak areas in the roadmap progression

Generate exactly 3 suggestions in JSON format. Each suggestion should have:
- title: A short, actionable title (max 8 words)
- description: A brief explanation (max 20 words)
- type: One of "article", "project", "topic", "challenge", "review"
- priority: "high", "medium", or "low"

Note: Include "article" type suggestions when concept articles are available.
Return ONLY valid JSON array, no markdown or explanation.`

    let suggestions

    try {
      // Use Google Generative AI API directly for better control and reliability
      if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        const resp = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
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
          throw new Error(`Gemini API error: ${resp.status} ${errText}`)
        }

        const result = await resp.json()
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || ""
        try {
          const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim()
          suggestions = JSON.parse(cleanedText)
        } catch (parseErr) {
          throw new Error("Failed to parse Gemini response: " + parseErr.message)
        }
      } else {
        // Fall back to the 'ai' SDK with Gemini
        const { text } = await generateText({
          model: "google/gemini-pro",
          prompt,
          temperature: 0.7,
        })

        // Parse the AI response
        try {
          // Clean up the response - remove markdown code blocks if present
          const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim()
          suggestions = JSON.parse(cleanedText)
        } catch (err) {
          throw new Error("Failed to parse AI response")
        }
      }
    } catch (aiError) {
      // If AI generation fails, use fallback suggestions
      console.warn("AI generation failed, using fallback suggestions:", aiError)

      // If we have concept resources, include the top article as a suggestion
      if (conceptResources.length > 0) {
        const top = conceptResources[0]
        suggestions = [
          {
            title: `Read: ${top.title}`,
            description: `Read this concept article on ${top.platform}`,
            type: "article",
            priority: "high",
            url: top.url,
          },
          {
            title: "Explore the next section",
            description: "Move forward in your roadmap with the upcoming topics",
            type: "topic",
            priority: "medium",
          },
          {
            title: "Review and reinforce",
            description: "Practice what you've learned with a quick review",
            type: "review",
            priority: "low",
          },
        ]
      } else {
        suggestions = [
          {
            title: "Continue your learning streak",
            description: "Complete at least one topic today to maintain your streak!",
            type: "challenge",
            priority: "high",
          },
          {
            title: "Explore the next section",
            description: "Move forward in your roadmap with the upcoming topics",
            type: "topic",
            priority: "medium",
          },
          {
            title: "Review and reinforce",
            description: "Practice what you've learned with a quick review",
            type: "review",
            priority: "low",
          },
        ]
      }
    }

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("AI suggestions error:", error)
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}
