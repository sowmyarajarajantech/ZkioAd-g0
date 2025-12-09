import React from "react"

export function ColoredBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--badge-purple, #8b5cf6)" />
          <stop offset="100%" stopColor="var(--primary, #ef4444)" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="9" r="5" fill="url(#g)" />
      <path d="M6 18c2-1 4-1.5 6-1.5s4 .5 6 1.5v2H6v-2z" fill="var(--badge-purple)" opacity="0.08" />
      <path d="M10 9.5l1 1 3-3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
