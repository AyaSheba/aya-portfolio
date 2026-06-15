import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProjectForm } from "@/components/admin/project-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params

  let project: {
    id: string
    title: string
    slug: string
    type: string
    year: number | null
    role: string
    short_description: string
    description: string
    cover_image: string | null
    hero_image: string | null
    mood_images: string[]
    sketch_images: string[]
    material_images: string[]
    gallery_images: string[]
    materials: { label: string; value: string }[]
    credits: { role: string; name: string }[]
    featured: boolean
    published: boolean
    sort_order: number
  } | null = null

  try {
    const supabase = await createClient()
    const { data } = await supabase.from("projects").select("*").eq("id", id).single()
    if (data) project = data
  } catch {}

  if (!project) notFound()

  return (
    <div>
      <h1 className="font-serif text-2xl text-[#f0ebe0]">Edit Project</h1>
      <p className="mt-1 text-xs text-[#686058]">{project.title}</p>
      <div className="mt-8 max-w-3xl">
        <ProjectForm initial={project} />
      </div>
    </div>
  )
}
