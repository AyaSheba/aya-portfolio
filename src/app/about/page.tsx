import { getSiteSettings } from "@/lib/supabase/site-settings"
import { CTA } from "@/components/cta"
import { SectionReveal } from "@/components/section-reveal"

const howWork = [
  {
    number: "01",
    title: "Research & Mood",
    thumb: "/images/the-last-light-ref-1.jpg",
    text: "Deep immersion in script and character to define the emotional palette of every space.",
  },
  {
    number: "02",
    title: "Concept & Sketch",
    thumb: "/images/the-last-light-sketch-1.jpg",
    text: "Translating emotion into floor plans, circulation, and narrative-driven spatial layouts.",
  },
  {
    number: "03",
    title: "Materials & Details",
    thumb: "/images/the-last-light-1.jpg",
    text: "Selecting every surface and finish for its narrative weight and authenticity.",
  },
  {
    number: "04",
    title: "Execution & Styling",
    thumb: "/images/the-last-light-2.jpg",
    text: "Overseeing construction, dressing, and final styling on set.",
  },
]


export default async function AboutPage() {
  const settings = await getSiteSettings()
  const aboutLines = settings.about_title.split("\n")
  const aboutParagraphs = settings.about_description
    .split("\n\n")
    .filter(Boolean)

  return (
    <>
      <section className="pt-20">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
          <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:gap-16">
            <div className="aspect-[4/5] overflow-hidden border border-border">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${settings.about_image})` }}
              />
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold">
                About Aya
              </span>
              <SectionReveal>
                <h1 className="mt-4 font-serif text-3xl leading-tight tracking-tight text-cream md:text-4xl lg:text-5xl">
                  {aboutLines.length > 1 ? (
                    <>
                      {aboutLines.slice(0, -1).map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                      <span className="text-gold">
                        {aboutLines[aboutLines.length - 1]}
                      </span>
                    </>
                  ) : (
                    aboutLines[0]
                  )}
                </h1>
              </SectionReveal>
              {aboutParagraphs.map((p, i) => (
                <SectionReveal key={i}>
                  <p
                    className={
                      i === 0
                        ? "mt-6 text-sm leading-relaxed text-text-secondary"
                        : "mt-4 text-sm leading-relaxed text-text-secondary"
                    }
                  >
                    {p}
                  </p>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 md:py-20">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
          <span className="mb-8 block text-xs font-medium tracking-[0.3em] uppercase text-gold">
            How I Work
          </span>
          <div className="grid gap-4 md:grid-cols-4">
            {howWork.map((item) => (
              <div key={item.number} className="group">
                <div className="mb-3 overflow-hidden border border-gold/20">
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.thumb})`, aspectRatio: "16/10" }}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-serif text-base leading-none text-gold/40">
                    {item.number}
                  </span>
                  <div>
                    <h3 className="font-serif text-sm text-cream">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-6 text-center md:px-12 lg:px-16">
          <SectionReveal>
            <h2 className="font-serif text-3xl leading-tight text-cream md:text-4xl lg:text-5xl">
              Let&apos;s create something<br />
              <span className="text-gold">unforgettable.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-text-secondary">
              I&apos;m always open to new collaborations, ambitious projects, and
              stories waiting to be told.
            </p>
            <div className="mt-8">
              <CTA href="/contact" variant="primary">
                Get in Touch
              </CTA>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
