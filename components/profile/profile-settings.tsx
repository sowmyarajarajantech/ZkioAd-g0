"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { User, Shield, LogOut, Save, Eye, EyeOff } from "lucide-react"

type Profile = {
  id: string
  display_name: string
  avatar_url: string | null
  is_public: boolean
  show_streak: boolean
  show_badges: boolean
}

export function ProfileSettings({
  profile,
  userId,
  email,
}: {
  profile: Profile | null
  userId: string
  email: string
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || "",
    is_public: profile?.is_public ?? true,
    show_streak: profile?.show_streak ?? true,
    show_badges: profile?.show_badges ?? true,
  })

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()

    await supabase.from("profiles").update(formData).eq("id", userId)

    setSaving(false)
    router.refresh()
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="space-y-6">
      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your display name and profile picture</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">{formData.display_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Avatar is synced from your authentication provider</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              placeholder="Your display name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
          <CardDescription>Control what other learners can see about you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                {formData.is_public ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                Public Profile
              </Label>
              <p className="text-sm text-muted-foreground">Allow others to see your profile and progress</p>
            </div>
            <Switch
              checked={formData.is_public}
              onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Streak</Label>
              <p className="text-sm text-muted-foreground">Display your learning streak on your profile</p>
            </div>
            <Switch
              checked={formData.show_streak}
              onCheckedChange={(checked) => setFormData({ ...formData, show_streak: checked })}
              disabled={!formData.is_public}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Badges</Label>
              <p className="text-sm text-muted-foreground">Display your earned badges on your profile</p>
            </div>
            <Switch
              checked={formData.show_badges}
              onCheckedChange={(checked) => setFormData({ ...formData, show_badges: checked })}
              disabled={!formData.is_public}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button variant="destructive" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
