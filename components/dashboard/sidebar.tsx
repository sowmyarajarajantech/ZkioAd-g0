"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/types"
import { Map, LayoutDashboard, Compass, Trophy, Plus, Users, UserIcon, Sparkles, Flame } from "lucide-react"

interface SidebarProps {
  user: User
  profile: Profile | null
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Explore Roadmaps", href: "/dashboard/explore", icon: Compass },
  { name: "My Roadmaps", href: "/dashboard/my-roadmaps", icon: Map },
  { name: "Create Roadmap", href: "/dashboard/create", icon: Plus },
  { name: "Achievements", href: "/dashboard/achievements", icon: Trophy },
  { name: "Community", href: "/dashboard/community", icon: Users },
  { name: "Profile", href: "/dashboard/profile", icon: UserIcon },
]

export function DashboardSidebar({ profile }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r bg-card">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 px-6 border-b">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Map className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">ZkioAd</span>
        </div>

        {/* Stats Card */}
        <div className="p-4">
          <div className="rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--xp-gold)]/20">
                <Sparkles className="h-5 w-5 text-[var(--xp-gold)]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total XP</p>
                <p className="text-lg font-bold">{profile?.xp_points?.toLocaleString() || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--streak-orange)]/20">
                <Flame className="h-5 w-5 text-[var(--streak-orange)]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current Streak</p>
                <p className="text-lg font-bold">{profile?.current_streak || 0} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground text-center">Keep learning, keep growing!</p>
        </div>
      </aside>
    </>
  )
}
