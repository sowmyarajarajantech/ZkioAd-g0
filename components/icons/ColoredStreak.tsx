import React from "react"

export function ColoredStreak({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="var(--streak-orange)" opacity="0.12" />
      <path d="M9.5 14c1-2 3-3.5 4.5-5 0 0-1 1.8 0 3.5S13 15 11 16" stroke="var(--streak-orange)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8c.5 1 1 1.6 1 1.6" stroke="var(--streak-orange)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
