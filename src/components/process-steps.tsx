import type { ProcessStep } from "@/lib/supabase/site-settings"

export function ProcessSteps({ steps: processSteps }: { steps?: ProcessStep[] }) {
  const steps = processSteps ?? [
    {
      number: "01",
      title: "Research & Mood",
      thumb: "/images/the-last-light-ref-1.jpg",
      description:
        "I immerse myself in the script, characters, and world — gathering references that define the emotional palette.",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {steps.slice(0, 4).map((step) => (
        <div key={step.number} className="group">
          <div className="mb-3 overflow-hidden border border-gold/20">
            <div
              className="relative h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${step.thumb})`, aspectRatio: "16/10" }}
            >
              <div className="absolute inset-0 bg-black/30" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-serif text-base leading-none text-gold/40">
              {step.number}
            </span>
            <div>
              <h3 className="font-serif text-sm text-cream">
                {step.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                {step.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
