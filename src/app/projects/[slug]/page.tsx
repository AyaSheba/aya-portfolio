import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getProjectBySlug } from "@/lib/supabase/projects"
import { SectionReveal } from "@/components/section-reveal"
import { ProjectImageGrid } from "@/components/project-image-grid"
import { cn } from "@/lib/utils"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-cream">Project not found</h1>
          <Link href="/projects" className="mt-4 block text-sm text-gold hover:underline">
            &larr; Back to projects
          </Link>
        </div>
      </div>
    )
  }

  const sections = [
    {
      number: "01",
      title: "Mood & References",
      images: project.references,
      text: "The visual language of the project was built from a rich tapestry of references — cinematic stills, architectural photography, texture studies, and period documents. Each reference informed the emotional temperature of the spaces we would later build.",
    },
    {
      number: "02",
      title: "Sketches & Layouts",
      images: project.sketches,
      text: "Initial sketches explored spatial relationships and circulation patterns. Each iteration refined the connection between camera placement, blocking, and the psychological experience of the space. The sketches evolved from loose thumbnails into measured elevations.",
    },
    {
      number: "03",
      title: "Materials & Details",
      images: [],
      text: "Materials were selected for narrative weight — aged brass for warmth, raw concrete for coldness, weathered linen for intimacy. Every finish was chosen to reinforce the story being told, from patinated door handles to hand-painted wallpapers.",
    },
    {
      number: "04",
      title: "Finished Set",
      images: project.gallery,
      text: "The final sets exist at the intersection of design and storytelling. Each space was built, dressed, and lit to serve the narrative — creating environments that feel lived-in, layered with history, and emotionally resonant.",
    },
  ]

  return (
    <>
      <section className="relative flex min-h-[75vh] items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.hero || "/images/the-last-light-hero.jpg"})` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#050505_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-12 md:px-12 lg:px-16 md:pb-16">
          <Link
            href="/projects"
            className="mb-6 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-cream-muted transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Projects
          </Link>

          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-[10px] tracking-[0.15em] uppercase text-gold">
              <span>{project.category}</span>
              <span className="h-px w-5 bg-gold/40" />
              <span className="text-cream-muted/60">{project.year}</span>
            </div>
            <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-cream md:text-6xl lg:text-7xl">
              {project.title}
            </h1>
            <div className="mt-4 space-y-1 text-xs text-text-muted">
              <p>Role: {project.role || "\u2014"}</p>
              <p>Year: {project.year || "\u2014"}</p>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-cream/60">
              {project.description || ""}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
          <div className="mx-auto max-w-3xl">
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold">Concept</span>
            <div className="mt-6">
              <p className="text-sm leading-relaxed text-text-secondary">
                {project.concept || ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      {sections.map((section) => (
        <section key={section.number} className="border-b border-border py-16 md:py-20">
          <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
            <div className="mb-8 flex items-baseline gap-4">
              <span className="font-serif text-3xl leading-none text-gold/20 md:text-4xl">
                {section.number}
              </span>
              <h2 className="font-serif text-xl tracking-tight text-cream md:text-2xl">
                {section.title}
              </h2>
            </div>

            <div className={cn("grid gap-8", section.images.length > 0 && section.images.length <= 3 && "md:grid-cols-[1fr_280px]")}>
              <div className="min-w-0">
                {section.images.length > 0 ? (
                  <ProjectImageGrid images={section.images} />
                ) : (
                  <div className="grid gap-4 md:grid-cols-4">
                    {project.materials.map((m) => (
                      <div key={m.label} className="border border-gold/20 p-4">
                        <span className="text-[9px] tracking-[0.2em] uppercase text-gold">{m.label}</span>
                        <p className="mt-2 text-xs leading-relaxed text-text-secondary">{m.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <SectionReveal>
                <p className="text-xs leading-relaxed text-text-secondary">
                  {section.text}
                </p>
              </SectionReveal>
            </div>
          </div>
        </section>
      ))}

      {project.credits && (
        <section className="border-b border-border py-12">
          <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
            <span className="text-[10px] tracking-[0.3em] uppercase text-text-muted">Credits</span>
            <div className="mt-4 flex flex-wrap gap-x-12 gap-y-3">
              {project.credits.map((credit) => (
                <div key={credit.role} className="text-sm">
                  <span className="text-text-muted">{credit.role}: </span>
                  <span className="text-cream">{credit.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <span className="text-[10px] tracking-[0.2em] uppercase text-text-muted">
              Next Project
            </span>
            <Link
              href="/projects"
              className="font-serif text-lg text-cream transition-colors hover:text-gold"
            >
              View All Projects &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
