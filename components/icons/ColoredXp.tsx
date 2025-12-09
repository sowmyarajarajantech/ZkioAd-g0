import React from "react"

export function ColoredXp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="var(--xp-gold)" opacity="0.12" />
      <path d="M8 12.5c.5 1 1.5 1.5 3 1.5s2.5-.5 3-1.5" stroke="var(--xp-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7v.01" stroke="var(--xp-gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 16v.01" stroke="var(--xp-gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
