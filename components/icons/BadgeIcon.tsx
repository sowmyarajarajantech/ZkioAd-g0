import Image from "next/image"

export function BadgeIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/medal.png"
      alt="Badge Icon"
      width={24}
      height={24}
      className={className}
    />
  )
}
