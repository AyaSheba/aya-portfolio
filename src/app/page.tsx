import Link from "next/link"
import { getFeaturedProjects } from "@/lib/supabase/projects"
import { getSiteSettings } from "@/lib/supabase/site-settings"
import { CTA } from "@/components/cta"
import { ProjectCard } from "@/components/project-card"
import { ProcessSteps } from "@/components/process-steps"
import { HeroAnimation } from "@/components/hero-animation"

export default async function Home() {
  const [projects, settings] = await Promise.all([
    getFeaturedProjects(),
    getSiteSettings(),
  ])
  return (
    <>
      <section className="relative flex min-h-[65vh] items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${settings.hero_background_image})` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#050505_75%)]" />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 text-center">
          <div className="mx-auto max-w-3xl">
            <HeroAnimation>
              <h1 className="font-serif text-[clamp(4.3rem,17vw,11.4rem)] leading-[0.8] tracking-tight text-cream">
                {settings.hero_title}
              </h1>
            </HeroAnimation>
            <div className="animate-fade-in-up reveal-delay-1 opacity-0">
              <p className="mt-10 mb-10 text-[10px] tracking-[0.35em] text-gold md:text-xs">
                {settings.hero_subtitle}
              </p>
            </div>
            <div className="animate-fade-in-up reveal-delay-2 opacity-0">
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-cream/60 md:text-base">
                {settings.hero_description}
              </p>
            </div>
            <div className="animate-fade-in-up reveal-delay-3 opacity-0">
              <div className="mt-8 flex justify-center">
                <CTA href={settings.hero_cta_link} variant="primary" arrow={false}>
                  {settings.hero_cta_label}
                </CTA>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-text-muted">
              Scroll
            </span>
            <div className="h-8 w-px animate-scroll-bounce bg-gradient-to-b from-gold/50 to-transparent" />
          </div>
        </div>
      </section>

      <section id="selected-works" className="py-16 md:py-20">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
          <div className="mb-10 flex items-end justify-between">
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-gold">
              Selected Works
            </span>
            <Link
              href="/projects"
              className="text-[10px] tracking-[0.2em] uppercase text-cream-muted transition-colors hover:text-gold"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 md:py-20">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
          <span className="mb-8 block text-xs font-medium tracking-[0.3em] uppercase text-gold">
            Process
          </span>
          <ProcessSteps steps={settings.process_steps} />
        </div>
      </section>
    </>
  )
}
