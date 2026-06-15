"use client"

const clients = [
  "Netflix",
  "Amazon Studios",
  "A24",
  "BBC Films",
  "HBO",
  "Warner Bros.",
  "Apple TV+",
  "Focus Features",
]

export function ClientStrip() {
  return (
    <div className="overflow-hidden border-y border-border py-10">
      <div className="flex animate-marquee gap-16" style={{ width: "fit-content" }}>
        {[...clients, ...clients].map((client, i) => (
          <span
            key={`${client}-${i}`}
            className="whitespace-nowrap font-serif text-lg tracking-wider text-text-muted"
          >
            {client}
          </span>
        ))}
      </div>
    </div>
  )
}
