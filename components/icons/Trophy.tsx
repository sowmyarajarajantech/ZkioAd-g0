export function Trophy({ className }: { className?: string }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7 4V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1h2a1 1 0 0 1 1 1v2a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V5a1 1 0 0 1 1-1h2zm0 0V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1m-10 0h10"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15v6m-4 0h8"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
