import { getSiteSettings } from "@/lib/supabase/site-settings"
import { CTA } from "@/components/cta"
import { SectionReveal } from "@/components/section-reveal"

export default async function ProcessPage() {
  const settings = await getSiteSettings()
  const details = settings.process_steps

  return (
    <>
      <section className="relative flex min-h-[50vh] items-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url(/images/process-hero.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
          <SectionReveal>
            <span className="mb-3 block text-xs tracking-[0.3em] uppercase text-gold">
              {settings.process_title}
            </span>
            <h1 className="max-w-3xl font-serif text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.95] tracking-tight text-cream">
              Every story begins<br />
              <span className="text-gold">with a space.</span>
            </h1>
          </SectionReveal>
        </div>
      </section>

      {details.map((detail) => (
        <section key={detail.number} className="border-b border-border py-16 md:py-20">
          <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
            <div className="grid gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
              <div>
                <div className="mb-4 overflow-hidden border border-gold/20" style={{ aspectRatio: "16/10" }}>
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${detail.thumb})` }}
                  />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl text-gold/20">{detail.number}</span>
                  <div>
                    <h2 className="font-serif text-lg text-cream">{detail.title}</h2>
                    <p className="text-xs italic text-gold/60">{detail.subtitle}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {(detail.paragraphs ?? []).map((p, i) => (
                  <SectionReveal key={i}>
                    <p className="text-sm leading-relaxed text-text-secondary">{p}</p>
                  </SectionReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-6 text-center md:px-12 lg:px-16">
          <SectionReveal>
            <h2 className="font-serif text-3xl leading-tight text-cream md:text-4xl">
              Interested in working together?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-text-secondary">
              I&apos;d love to hear about your project.
            </p>
            <div className="mt-8">
              <CTA href="/contact" variant="primary">
                Start a Conversation
              </CTA>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
