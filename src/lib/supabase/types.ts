import type { GalleryItem, Project } from "@/lib/projects"

export interface ProjectRow {
  id: string
  created_at: string
  updated_at: string
  title: string
  slug: string
  type: string
  year: number | null
  role: string
  short_description: string
  description: string
  cover_image: string | null
  hero_image: string | null
  mood_images: GalleryItem[]
  sketch_images: GalleryItem[]
  material_images: GalleryItem[]
  gallery_images: GalleryItem[]
  materials: { label: string; value: string }[]
  credits: { role: string; name: string }[]
  featured: boolean
  published: boolean
  sort_order: number
}

export function rowToProject(row: ProjectRow): Project {
  return {
    slug: row.slug ?? "",
    title: row.title ?? "",
    category: row.type ?? "",
    role: row.role ?? "",
    year: row.year ?? new Date().getFullYear(),
    description: row.short_description ?? "",
    concept: row.description ?? "",
    hero: row.hero_image ?? "",
    thumbnail: row.cover_image ?? "",
    gallery: row.gallery_images ?? [],
    sketches: row.sketch_images ?? [],
    references: row.mood_images ?? [],
    materials: row.materials ?? [],
    credits: row.credits ?? [],
  }
}
