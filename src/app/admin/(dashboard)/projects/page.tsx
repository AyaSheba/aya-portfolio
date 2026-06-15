import Link from "next/link"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ProjectsTable } from "@/components/admin/projects-table"
import { SeedButton } from "@/components/admin/seed-button"

export default async function AdminProjectsPage() {
  let projects: {
    id: string
    title: string
    slug: string
    type: string
    year: number | null
    published: boolean
    featured: boolean
    sort_order: number
  }[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("projects")
      .select("id, title, slug, type, year, published, featured, sort_order")
      .order("sort_order", { ascending: true })

    if (data) projects = data
  } catch {}

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-[#f0ebe0]">Projects</h1>
          <p className="mt-1 text-xs text-[#686058]">{projects.length} total</p>
        </div>
        <div className="flex items-center gap-3">
          {projects.length === 0 && <SeedButton />}
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 border border-[#b89a5e] bg-[#b89a5e] px-4 py-2 text-[10px] font-medium tracking-[0.2em] uppercase text-[#050505] transition-opacity hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" />
            New Project
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <ProjectsTable projects={projects} />
      </div>
    </div>
  )
}
