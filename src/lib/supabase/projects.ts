import { createClient } from "./server"
import { rowToProject } from "./types"
import { projects as fallbackProjects, getProject as fallbackGetProject } from "@/lib/projects"
import type { Project } from "@/lib/projects"

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .eq("published", true)
      .order("sort_order", { ascending: true })

    if (error || !data || data.length === 0) return fallbackProjects.filter((p) => p.slug)
    return data.map(rowToProject)
  } catch {
    return fallbackProjects.filter((p) => p.slug)
  }
}

export async function getPublishedProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })

    if (error || !data || data.length === 0) return fallbackProjects
    return data.map(rowToProject)
  } catch {
    return fallbackProjects
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single()

    if (error || !data) return fallbackGetProject(slug) ?? null
    return rowToProject(data)
  } catch {
    return fallbackGetProject(slug) ?? null
  }
}
