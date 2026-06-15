import Link from "next/link"
import type { Project } from "@/lib/projects"

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <article className="relative overflow-hidden border border-border bg-surface">
        <div className="aspect-[4/3] overflow-hidden">
          <div
            className="h-full w-full bg-cover transition-all duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${project.hero})`, backgroundSize: "105%", backgroundPosition: "center 30%" }}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-serif text-lg tracking-tight text-cream md:text-xl">
            {project.title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-gold/70">
            <span>{project.category}</span>
            <span className="h-px w-4 bg-gold/30" />
            <span className="text-cream-muted/50">{project.year}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
