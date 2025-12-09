import Image from "next/image"

export function StreakIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/fire.png"
      alt="Streak Icon"
      width={24}
      height={24}
      className={className}
    />
  )
}
