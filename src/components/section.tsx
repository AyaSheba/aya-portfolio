import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  containerClassName?: string
}

export function Section({
  children,
  className,
  id,
  containerClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-24 md:py-32", className)}
    >
      <div className={cn("mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16", containerClassName)}>
        {children}
      </div>
    </section>
  )
}

export function SectionHeading({
  label,
  title,
  className,
}: {
  label?: string
  title: string
  className?: string
}) {
  return (
    <div className={cn("mb-16 md:mb-20", className)}>
      {label && (
        <span className="mb-3 block text-xs font-medium tracking-[0.3em] uppercase text-gold">
          {label}
        </span>
      )}
      <h2 className="font-serif text-4xl leading-tight tracking-tight text-cream md:text-5xl lg:text-6xl">
        {title}
      </h2>
    </div>
  )
}
