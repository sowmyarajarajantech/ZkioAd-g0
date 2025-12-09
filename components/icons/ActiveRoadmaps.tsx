import Image from "next/image"

export function ActiveRoadmaps({ className }: { className?: string }) {
  return (
    <Image
      src="/roadmap.png"
      alt="Roadmap Icon"
      width={24}
      height={24}
      className={className}
    />
  )
}
