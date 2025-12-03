import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ZkioAd - Gamified Learning Roadmaps for Students",
  description:
    "Track your learning journey with gamified roadmaps, earn badges, maintain streaks, and connect with fellow students. Master DSA, AI, Web Dev, and more.",
  keywords: ["learning", "roadmap", "students", "gamification", "skills", "DSA", "AI", "programming", "ZkioAd"],
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
