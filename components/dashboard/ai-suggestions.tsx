"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Lightbulb, Code, BookOpen, RefreshCw, Target } from "lucide-react"

type Suggestion = {
  title: string
  description: string
  type: "article" | "project" | "topic" | "challenge" | "review" | "next_topic" | "mini_project" | "new_roadmap" | "streak_tip"
  priority?: "high" | "medium" | "low"
  reason?: string
  url?: string
}

interface RoadmapData {
  id: string
  title: string
  category: string
}

export function AiSuggestions({ activeRoadmap }: { activeRoadmap?: RoadmapData }) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSuggestions = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    
    setError(null)

    try {
      const params = new URLSearchParams()
      if (activeRoadmap?.id) {
        params.append("roadmapId", activeRoadmap.id)
      }
      const queryString = params.toString()
      const url = queryString ? `/api/ai/suggestions?${queryString}` : "/api/ai/suggestions"
      
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      if (!res.ok) {
        throw new Error(`Failed to fetch suggestions: ${res.statusText}`)
      }

      const data = await res.json()
      
      // Handle both /api/ai/suggestions and /api/ai-suggestions response formats
      const suggestionsList = data.suggestions || data.recommendations || []
      
      if (Array.isArray(suggestionsList) && suggestionsList.length > 0) {
        setSuggestions(suggestionsList)
      } else {
        setError("No suggestions generated")
        setSuggestions([])
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch suggestions"
      console.error("Error fetching suggestions:", error)
      setError(errorMessage)
      setSuggestions([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchSuggestions()
  }, [activeRoadmap?.id])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <BookOpen className="h-4 w-4" />
      case "project":
      case "mini_project":
        return <Code className="h-4 w-4" />
      case "topic":
      case "next_topic":
        return <BookOpen className="h-4 w-4" />
      case "challenge":
        return <Target className="h-4 w-4" />
      case "review":
        return <RefreshCw className="h-4 w-4" />
      case "new_roadmap":
        return <Sparkles className="h-4 w-4" />
      case "streak_tip":
        return <Target className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "article":
        return "bg-cyan-500/10 text-cyan-500"
      case "project":
      case "mini_project":
        return "bg-purple-500/10 text-purple-500"
      case "topic":
      case "next_topic":
        return "bg-blue-500/10 text-blue-500"
      case "challenge":
        return "bg-orange-500/10 text-orange-500"
      case "review":
        return "bg-teal-500/10 text-teal-500"
      case "new_roadmap":
        return "bg-indigo-500/10 text-indigo-500"
      case "streak_tip":
        return "bg-rose-500/10 text-rose-500"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Suggestions
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => fetchSuggestions(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-3 rounded-lg bg-muted/50">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 text-sm text-red-500">
            <Lightbulb className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p>{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => fetchSuggestions(true)}
            >
              Retry
            </Button>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No suggestions available</p>
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getTypeColor(suggestion.type)}`}>
                  {getTypeIcon(suggestion.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-sm line-clamp-1">{suggestion.title}</span>
                    {suggestion.priority && (
                      <Badge variant="outline" className={`text-xs shrink-0 ${getPriorityColor(suggestion.priority)}`}>
                        {suggestion.priority}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{suggestion.description}</p>
                  {suggestion.reason && (
                    <p className="text-xs text-muted-foreground/70 mt-1 italic">
                      💡 {suggestion.reason}
                    </p>
                  )}
                  {suggestion.type === "article" && suggestion.url ? (
                    <div className="mt-2">
                      <a
                        href={suggestion.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Read article →
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
