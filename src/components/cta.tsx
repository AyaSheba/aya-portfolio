import Link from "next/link"
import { cn } from "@/lib/utils"

interface CTAProps {
  href: string
  children: React.ReactNode
  variant?: "primary" | "outline" | "ghost"
  className?: string
  arrow?: boolean
}

export function CTA({ href, children, variant = "primary", className, arrow = true }: CTAProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-sm font-medium tracking-[0.15em] uppercase transition-all duration-500",
        variant === "primary" &&
          "text-gold hover:text-gold-light relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-500 hover:after:w-full",
        variant === "outline" &&
          "border border-border-light px-8 py-4 text-cream hover:border-gold hover:text-gold",
        variant === "ghost" &&
          "text-cream-muted hover:text-gold",
        className,
      )}
    >
      <span>{children}</span>
      {arrow && (
        <span className="transition-transform duration-500 group-hover:translate-x-1">
          &rarr;
        </span>
      )}
    </Link>
  )
}
