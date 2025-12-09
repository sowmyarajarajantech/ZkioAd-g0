import Image from "next/image"

export function XpCardIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/xp.png"
      alt="XP Icon"
      width={24}
      height={24}
      className={className}
    />
  )
}
