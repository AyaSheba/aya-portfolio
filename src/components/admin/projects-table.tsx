"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Eye, EyeOff, Star, ArrowUpDown } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface ProjectRow {
  id: string
  title: string
  slug: string
  type: string
  year: number | null
  published: boolean
  featured: boolean
  sort_order: number
}

export function ProjectsTable({ projects: initial }: { projects: ProjectRow[] }) {
  const [projects, setProjects] = useState(initial)
  const router = useRouter()

  async function togglePublished(id: string, current: boolean) {
    const supabase = createClient()
    await supabase.from("projects").update({ published: !current }).eq("id", id)
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, published: !current } : p)))
    router.refresh()
  }

  async function toggleFeatured(id: string, current: boolean) {
    const supabase = createClient()
    await supabase.from("projects").update({ featured: !current }).eq("id", id)
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !current } : p)))
    router.refresh()
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    const supabase = createClient()
    await supabase.from("projects").delete().eq("id", id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
    router.refresh()
  }

  return (
    <div className="overflow-x-auto border border-[#1a1a1a]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
            <th className="px-4 py-3 text-left text-[10px] font-medium tracking-[0.2em] uppercase text-[#686058]">
              Title
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-medium tracking-[0.2em] uppercase text-[#686058]">
              Type
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-medium tracking-[0.2em] uppercase text-[#686058]">
              Year
            </th>
            <th className="px-4 py-3 text-center text-[10px] font-medium tracking-[0.2em] uppercase text-[#686058]">
              <div className="flex items-center justify-center gap-1">
                <ArrowUpDown className="h-3 w-3" />
                Order
              </div>
            </th>
            <th className="px-4 py-3 text-center text-[10px] font-medium tracking-[0.2em] uppercase text-[#686058]">
              Published
            </th>
            <th className="px-4 py-3 text-center text-[10px] font-medium tracking-[0.2em] uppercase text-[#686058]">
              Featured
            </th>
            <th className="px-4 py-3 text-right text-[10px] font-medium tracking-[0.2em] uppercase text-[#686058]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-b border-[#111] transition-colors hover:bg-[#0f0f0f]">
              <td className="px-4 py-3">
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="font-medium text-[#f0ebe0] transition-colors hover:text-[#b89a5e]"
                >
                  {project.title}
                </Link>
                <p className="text-[10px] text-[#686058]">/{project.slug}</p>
              </td>
              <td className="px-4 py-3 text-[#989080]">{project.type}</td>
              <td className="px-4 py-3 text-[#989080]">{project.year ?? "—"}</td>
              <td className="px-4 py-3 text-center font-mono text-xs text-[#686058]">
                {project.sort_order}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => togglePublished(project.id, project.published)}
                  className={cn(
                    "transition-colors",
                    project.published ? "text-[#b89a5e]" : "text-[#333] hover:text-[#686058]",
                  )}
                >
                  {project.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => toggleFeatured(project.id, project.featured)}
                  className={cn(
                    "transition-colors",
                    project.featured ? "text-[#b89a5e]" : "text-[#333] hover:text-[#686058]",
                  )}
                >
                  <Star className={cn("h-4 w-4", project.featured && "fill-[#b89a5e]")} />
                </button>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="rounded p-1.5 text-[#686058] transition-colors hover:bg-[#1a1a1a] hover:text-[#f0ebe0]"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    className="rounded p-1.5 text-[#686058] transition-colors hover:bg-[#1a1a1a] hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {projects.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-sm text-[#686058]">
                No projects yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
