"use client"

import { useRef } from "react"
import { useInView } from "motion/react"
import { cn } from "@/lib/utils"

export function StaggerReveal({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 1s ease-out, transform 1s ease-out",
      }}
    >
      {children}
    </div>
  )
}
