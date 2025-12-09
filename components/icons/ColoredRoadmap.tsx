import React from "react"

export function ColoredRoadmap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="var(--primary)" opacity="0.08" />
      <path d="M8 16l8-8" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8l4 1-1 4-3-1-1 3-2-2 1-5z" fill="var(--primary)" opacity="0.2" />
      <path d="M16 9l-4 1-1 3" stroke="var(--primary)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
