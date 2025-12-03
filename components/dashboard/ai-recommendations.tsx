"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, RefreshCw, BookOpen, Code, History, Map, Flame } from "lucide-react"

type Recommendation = {
  type: "next_topic" | "mini_project" | "review" | "new_roadmap" | "streak_tip"
  title: string
  description: string
  reason: string
}

export function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/ai-suggestions", { method: "POST" })
      const data = await res.json()
      setRecommendations(data.recommendations || [])
      setHasLoaded(true)
    } catch (error) {
      console.error("Failed to fetch recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "next_topic":
        return <BookOpen className="h-4 w-4" />
      case "mini_project":
        return <Code className="h-4 w-4" />
      case "review":
        return <History className="h-4 w-4" />
      case "new_roadmap":
        return <Map className="h-4 w-4" />
      case "streak_tip":
        return <Flame className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "next_topic":
        return "bg-primary/10 text-primary"
      case "mini_project":
        return "bg-badge/10 text-badge"
      case "review":
        return "bg-blue-500/10 text-blue-500"
      case "new_roadmap":
        return "bg-green-500/10 text-green-500"
      case "streak_tip":
        return "bg-streak/10 text-streak"
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
            AI Recommendations
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchRecommendations} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            {hasLoaded ? "Refresh" : "Get Tips"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!hasLoaded ? (
          <div className="text-center py-6">
            <Sparkles className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              Get personalized learning suggestions based on your progress
            </p>
            <Button onClick={fetchRecommendations} disabled={loading}>
              {loading ? "Analyzing..." : "Get AI Recommendations"}
            </Button>
          </div>
        ) : loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-3 rounded-lg bg-muted/50">
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(rec.type)}`}>{getIcon(rec.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{rec.title}</h4>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {rec.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1 italic">{rec.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
