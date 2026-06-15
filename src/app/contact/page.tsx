import { getSiteSettings } from "@/lib/supabase/site-settings"
import { Section } from "@/components/section"
import { SectionReveal } from "@/components/section-reveal"
import { ContactForm } from "@/components/contact-form"
import { MapPin } from "lucide-react"

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <section className="relative flex min-h-[50vh] items-end overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 md:px-12 lg:px-16 md:pb-24">
          <SectionReveal>
            <span className="mb-4 block text-xs tracking-[0.3em] uppercase text-gold">
              Contact
            </span>
            <h1 className="max-w-4xl font-serif text-[clamp(2.5rem,8vw,5rem)] leading-[0.95] tracking-tight text-cream">
              Let&apos;s create<br />
              <span className="text-gold">something memorable.</span>
            </h1>
          </SectionReveal>
        </div>
      </section>

      <Section>
        <div className="grid gap-16 md:grid-cols-[1fr_1.5fr] md:gap-20">
          <div>
            <SectionReveal>
              <h2 className="font-serif text-2xl text-cream md:text-3xl">
                Get in Touch
              </h2>
            </SectionReveal>
            <SectionReveal>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                I&apos;m always open to new projects, collaborations, and conversations.
                Whether you have a specific project in mind or just want to explore
                possibilities, I&apos;d love to hear from you.
              </p>
            </SectionReveal>
            <SectionReveal>
              <div className="mt-8 space-y-6">
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-text-muted">
                    Email
                  </span>
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="mt-1 block text-sm text-cream transition-colors hover:text-gold"
                  >
                    {settings.contact_email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-text-muted">
                    Based In
                  </span>
                  <p className="mt-1 flex items-center gap-2 text-sm text-cream">
                    <MapPin className="h-3 w-3 text-gold" />
                    Cairo / Egypt
                  </p>
                </div>
              </div>
            </SectionReveal>
          </div>

          <SectionReveal>
            <ContactForm />
          </SectionReveal>
        </div>
      </Section>
    </>
  )
}
