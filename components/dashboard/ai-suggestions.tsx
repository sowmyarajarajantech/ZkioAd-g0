"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Lightbulb, Code, BookOpen, RefreshCw, Target } from "lucide-react"

type Suggestion = {
  title: string
  description: string
  type: "project" | "topic" | "challenge" | "review"
  priority: "high" | "medium" | "low"
}

export function AiSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchSuggestions = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const res = await fetch("/api/ai/suggestions")
      const data = await res.json()
      if (data.suggestions) {
        setSuggestions(data.suggestions)
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchSuggestions()
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project":
        return <Code className="h-4 w-4" />
      case "topic":
        return <BookOpen className="h-4 w-4" />
      case "challenge":
        return <Target className="h-4 w-4" />
      case "review":
        return <RefreshCw className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "project":
        return "bg-purple-500/10 text-purple-500"
      case "topic":
        return "bg-blue-500/10 text-blue-500"
      case "challenge":
        return "bg-orange-500/10 text-orange-500"
      case "review":
        return "bg-teal-500/10 text-teal-500"
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
                <div className={`p-2 rounded-lg ${getTypeColor(suggestion.type)}`}>{getTypeIcon(suggestion.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm line-clamp-1">{suggestion.title}</span>
                    <Badge variant="outline" className={`text-xs shrink-0 ${getPriorityColor(suggestion.priority)}`}>
                      {suggestion.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{suggestion.description}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
