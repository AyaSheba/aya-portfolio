import { getPublishedProjects } from "@/lib/supabase/projects"
import { ProjectCard } from "@/components/project-card"

export default async function ProjectsPage() {
  const projects = await getPublishedProjects()
  return (
    <div className="pt-28">
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16">
          <div className="mb-12">
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-gold">
              Portfolio
            </span>
            <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-cream md:text-5xl lg:text-6xl">
              Selected Projects
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-secondary">
              A curated selection of work across feature films, television, and independent
              productions &mdash; each a world built from the ground up.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
