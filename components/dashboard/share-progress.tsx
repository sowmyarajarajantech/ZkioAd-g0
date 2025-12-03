"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Share2, Copy, Check, Twitter, Linkedin } from "lucide-react"

type ShareProgressProps = {
  stats: {
    totalXp: number
    streak: number
    completedTopics: number
    badges: number
  }
}

export function ShareProgress({ stats }: ShareProgressProps) {
  const [copied, setCopied] = useState(false)

  const shareText = `I've earned ${stats.totalXp.toLocaleString()} XP on ZkioAd! ${stats.streak > 0 ? `Currently on a ${stats.streak}-day streak.` : ""} ${stats.badges > 0 ? `Earned ${stats.badges} badges so far.` : ""} Join me in learning! #ZkioAd #Learning`

  const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://zkioad.com"

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, "_blank")
  }

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(url, "_blank")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share Progress
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Progress</DialogTitle>
          <DialogDescription>Show off your learning achievements to friends and colleagues</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Preview Card */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
              <div>
                <p className="font-semibold">My ZkioAd Journey</p>
                <p className="text-sm text-muted-foreground">Learning in progress...</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 rounded bg-background">
                <span className="text-[var(--xp-gold)] font-bold">{stats.totalXp.toLocaleString()}</span> XP
              </div>
              <div className="p-2 rounded bg-background">
                <span className="text-[var(--streak-orange)] font-bold">{stats.streak}</span> day streak
              </div>
              <div className="p-2 rounded bg-background">
                <span className="font-bold">{stats.completedTopics}</span> topics
              </div>
              <div className="p-2 rounded bg-background">
                <span className="text-[var(--badge-purple)] font-bold">{stats.badges}</span> badges
              </div>
            </div>
          </div>

          {/* Share URL */}
          <div className="space-y-2">
            <Label>Share Link</Label>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="bg-muted" />
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Social Share */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={shareToTwitter}>
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" onClick={shareToLinkedIn}>
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
