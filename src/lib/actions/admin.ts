"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { GalleryItem } from "@/lib/projects"

function containsRawMedia(value: unknown): boolean {
  if (typeof value === "string") {
    if (value.startsWith("data:") || value.startsWith("blob:")) return true
  }
  if (Array.isArray(value)) {
    return value.some((item) => containsRawMedia(item))
  }
  if (value && typeof value === "object") {
    return Object.values(value).some((v) => containsRawMedia(v))
  }
  return false
}

function parseAndGuard(formData: FormData, key: string): unknown {
  const raw = formData.get(key) as string
  const parsed = JSON.parse(raw || "[]")
  if (containsRawMedia(parsed)) {
    throw new Error("Media must be uploaded before saving.")
  }
  return parsed
}

export async function createProject(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const type = formData.get("type") as string
  const year = parseInt(formData.get("year") as string) || null
  const role = formData.get("role") as string
  const short_description = formData.get("short_description") as string
  const description = formData.get("description") as string
  const cover_image = formData.get("cover_image") as string
  const hero_image = formData.get("hero_image") as string
  const mood_images = parseAndGuard(formData, "mood_images") as GalleryItem[]
  const sketch_images = parseAndGuard(formData, "sketch_images") as GalleryItem[]
  const material_images = parseAndGuard(formData, "material_images") as GalleryItem[]
  const gallery_images = parseAndGuard(formData, "gallery_images") as GalleryItem[]
  const materials = JSON.parse((formData.get("materials") as string) || "[]")
  const credits = JSON.parse((formData.get("credits") as string) || "[]")
  const featured = formData.get("featured") === "true"
  const published = formData.get("published") === "true"
  const sort_order = parseInt(formData.get("sort_order") as string) || 0

  const { data, error } = await supabase
    .from("projects")
    .insert({
      title,
      slug,
      type,
      year,
      role,
      short_description,
      description,
      cover_image,
      hero_image,
      mood_images,
      sketch_images,
      material_images,
      gallery_images,
      materials,
      credits,
      featured,
      published,
      sort_order,
    })
    .select("id")
    .single()

  if (error) throw new Error(error.message)

  revalidatePath("/admin/projects")
  revalidatePath("/projects")
  revalidatePath("/")

  return { id: data?.id }
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const type = formData.get("type") as string
  const year = parseInt(formData.get("year") as string) || null
  const role = formData.get("role") as string
  const short_description = formData.get("short_description") as string
  const description = formData.get("description") as string
  const cover_image = formData.get("cover_image") as string
  const hero_image = formData.get("hero_image") as string
  const mood_images = parseAndGuard(formData, "mood_images") as GalleryItem[]
  const sketch_images = parseAndGuard(formData, "sketch_images") as GalleryItem[]
  const material_images = parseAndGuard(formData, "material_images") as GalleryItem[]
  const gallery_images = parseAndGuard(formData, "gallery_images") as GalleryItem[]
  const materials = JSON.parse((formData.get("materials") as string) || "[]")
  const credits = JSON.parse((formData.get("credits") as string) || "[]")
  const featured = formData.get("featured") === "true"
  const published = formData.get("published") === "true"
  const sort_order = parseInt(formData.get("sort_order") as string) || 0

  const { error } = await supabase
    .from("projects")
    .update({
      title,
      slug,
      type,
      year,
      role,
      short_description,
      description,
      cover_image,
      hero_image,
      mood_images,
      sketch_images,
      material_images,
      gallery_images,
      materials,
      credits,
      featured,
      published,
      sort_order,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/projects")
  revalidatePath(`/admin/projects/${id}/edit`)
  revalidatePath("/projects")
  revalidatePath(`/projects/${slug}`)
  revalidatePath("/")
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("projects").delete().eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/projects")
  revalidatePath("/projects")
  revalidatePath("/")
}

export async function seedProjects() {
  const supabase = await createClient()

  const { data: existing } = await supabase.from("projects").select("id").limit(1)
  if (existing && existing.length > 0) {
    return { count: existing.length }
  }

  const projects = [
    {
      title: "The Last Light",
      slug: "the-last-light",
      type: "Feature Film",
      year: 2024,
      role: "Set Design / Production Styling",
      short_description:
        "A dystopian love story set in a fading world where light is the last remaining luxury.",
      description:
        "The Last Light required building a world caught between decay and beauty. The visual language balanced brutalist architecture with intimate, warm interiors — each space reflecting the emotional arc of the characters. Every set was designed to feel lived-in, layered with history, and slowly consumed by shadow.",
      cover_image: "/images/the-last-light-thumb.jpg",
      hero_image: "/images/the-last-light-hero.jpg",
      mood_images: [
        "/images/the-last-light-ref-1.jpg",
        "/images/the-last-light-ref-2.jpg",
        "/images/the-last-light-ref-3.jpg",
      ],
      sketch_images: [
        "/images/the-last-light-sketch-1.jpg",
        "/images/the-last-light-sketch-2.jpg",
      ],
      material_images: [],
      gallery_images: [
        "/images/the-last-light-1.jpg",
        "/images/the-last-light-2.jpg",
        "/images/the-last-light-3.jpg",
        "/images/the-last-light-4.jpg",
      ],
      materials: [
        { label: "Style", value: "Brutalist meets warm minimalism" },
        { label: "Palette", value: "Charcoal, ochre, oxidized brass, warm amber" },
        { label: "Textures", value: "Raw concrete, aged wood, linen, patinated metal" },
        { label: "Lighting", value: "Practical sources, tungsten warmth, deep shadow" },
      ],
      credits: [
        { role: "Director", name: "Elena Marchetti" },
        { role: "Production Designer", name: "Aya Sheba" },
        { role: "DOP", name: "Rafael Torres" },
      ],
      featured: true,
      published: true,
      sort_order: 1,
    },
    {
      title: "Echo Chamber",
      slug: "echo-chamber",
      type: "TV Series",
      year: 2025,
      role: "Set Design / Décor Execution",
      short_description:
        "A psychological thriller where the architecture itself becomes a character.",
      description:
        "Echo Chamber explores paranoia through space. Corridors tighten. Rooms repeat with subtle differences. The sets were constructed to feel both familiar and deeply wrong — using forced perspective, mirrored layouts, and an increasingly oppressive color script that shifts from neutral grays to sickly greens.",
      cover_image: "/images/echo-chamber-thumb.jpg",
      hero_image: "/images/echo-chamber-hero.jpg",
      mood_images: [
        "/images/echo-chamber-ref-1.jpg",
        "/images/echo-chamber-ref-2.jpg",
      ],
      sketch_images: [
        "/images/echo-chamber-sketch-1.jpg",
      ],
      material_images: [],
      gallery_images: [
        "/images/echo-chamber-1.jpg",
        "/images/echo-chamber-2.jpg",
        "/images/echo-chamber-3.jpg",
      ],
      materials: [
        { label: "Style", value: "Corporate brutalism, subtle dread" },
        { label: "Palette", value: "Cool grays, institutional green, fluorescent white" },
        { label: "Textures", value: "Vinyl flooring, acoustic tile, brushed aluminum" },
        { label: "Lighting", value: "Overhead fluorescent, harsh shadows, flickering practicals" },
      ],
      credits: [],
      featured: true,
      published: true,
      sort_order: 2,
    },
    {
      title: "Dust & Bone",
      slug: "dust-and-bone",
      type: "Independent Film",
      year: 2023,
      role: "Spatial Storytelling / Production Styling",
      short_description:
        "A raw, visceral story set across the American dust belt — where every object carries memory.",
      description:
        "Dust & Bone called for an authentic, tactile world. We sourced period-accurate furniture, hand-worn props, and built interiors that felt excavated from memory. The color palette was grounded in faded earth tones — sun-bleached wood, rusted metal, dried earth — punctuated by small moments of vivid color.",
      cover_image: "/images/dust-and-bone-thumb.jpg",
      hero_image: "/images/dust-and-bone-hero.jpg",
      mood_images: [
        "/images/dust-and-bone-ref-1.jpg",
        "/images/dust-and-bone-ref-2.jpg",
      ],
      sketch_images: [
        "/images/dust-and-bone-sketch-1.jpg",
        "/images/dust-and-bone-sketch-2.jpg",
      ],
      material_images: [],
      gallery_images: [
        "/images/dust-and-bone-1.jpg",
        "/images/dust-and-bone-2.jpg",
        "/images/dust-and-bone-3.jpg",
        "/images/dust-and-bone-4.jpg",
        "/images/dust-and-bone-5.jpg",
      ],
      materials: [
        { label: "Style", value: "American vernacular, weathered authenticity" },
        { label: "Palette", value: "Faded ochre, rust, denim blue, sun-bleached bone" },
        {
          label: "Textures",
          value: "Weathered wood, distressed leather, cotton, patinaed metal",
        },
        { label: "Lighting", value: "Natural light, practical lamps, golden hour warmth" },
      ],
      credits: [],
      featured: true,
      published: true,
      sort_order: 3,
    },
  ]

  const { error } = await supabase.from("projects").insert(projects)
  if (error) throw new Error(error.message)

  return { count: projects.length }
}

export async function markMessageAsRead(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("contact_messages")
    .update({ status: "read" })
    .eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/messages")
}

export async function deleteMessage(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/messages")
}

export async function uploadImage(formData: FormData) {
  const supabase = await createClient()
  const file = formData.get("file") as File
  const bucket = formData.get("bucket") as string || "portfolio-images"

  if (!file) throw new Error("No file provided")

  const ext = (file.name.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "")
  const fileName = `${crypto.randomUUID()}.${ext}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (error) throw new Error(error.message)

  const { data: urlData } = await supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}
