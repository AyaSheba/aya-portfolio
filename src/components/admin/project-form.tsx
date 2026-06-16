"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, X, Upload, ExternalLink, CheckCircle } from "lucide-react"
import { createProject, updateProject, uploadImage } from "@/lib/actions/admin"
import { compressImage } from "@/lib/image-compression"
import { cn } from "@/lib/utils"
import type { GalleryItem } from "@/lib/projects"

interface Props {
  initial?: {
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
}

type GalleryKey = "mood_images" | "sketch_images" | "material_images" | "gallery_images"
type ImageKey = "cover_image" | "hero_image"

const galleryLabels: Record<GalleryKey, string> = {
  mood_images: "Mood & References",
  sketch_images: "Sketches & Layouts",
  material_images: "Materials & Details",
  gallery_images: "Finished Set Gallery",
}

export function ProjectForm({ initial }: Props) {
  const router = useRouter()
  const isEdit = !!initial
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const [title, setTitle] = useState(initial?.title ?? "")
  const [slug, setSlug] = useState(initial?.slug ?? "")
  const [type, setType] = useState(initial?.type ?? "")
  const [year, setYear] = useState(initial?.year?.toString() ?? "")
  const [role, setRole] = useState(initial?.role ?? "")
  const [shortDescription, setShortDescription] = useState(initial?.short_description ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")

  const [coverImage, setCoverImage] = useState(initial?.cover_image ?? "")
  const [heroImage, setHeroImage] = useState(initial?.hero_image ?? "")
  const [moodImages, setMoodImages] = useState<GalleryItem[]>(initial?.mood_images ?? [])
  const [sketchImages, setSketchImages] = useState<GalleryItem[]>(initial?.sketch_images ?? [])
  const [materialImages, setMaterialImages] = useState<GalleryItem[]>(initial?.material_images ?? [])
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>(initial?.gallery_images ?? [])

  const [credits, setCredits] = useState<{ role: string; name: string }[]>(initial?.credits ?? [])
  const [featured, setFeatured] = useState(initial?.featured ?? false)
  const [published, setPublished] = useState(initial?.published ?? false)
  const [sortOrder, setSortOrder] = useState(initial?.sort_order?.toString() ?? "0")

  const [uploading, setUploading] = useState<GalleryKey | ImageKey | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)

  function generateSlug(val: string) {
    if (isEdit && initial?.title === title) return
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    )
  }

  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
  const IMAGE_MAX_SIZE = 15 * 1024 * 1024
  const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"]
  const VIDEO_MAX_SIZE = 50 * 1024 * 1024

  function validateImageFile(file: File): string | null {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Invalid file type. Please upload JPG, PNG, or WebP."
    }
    if (file.size > IMAGE_MAX_SIZE) {
      return "Image is too large. Please upload an image under 15MB."
    }
    return null
  }

  function validateVideoFile(file: File): string | null {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return "Invalid video type. Please upload MP4 or WebM."
    }
    if (file.size > VIDEO_MAX_SIZE) {
      return "Video is too large. Please upload a video under 50MB."
    }
    return null
  }

  function isGalleryKey(v: string): v is GalleryKey {
    return v in galleryLabels
  }

  function appendToGallery(key: GalleryKey, item: GalleryItem) {
    const setters: Record<GalleryKey, React.Dispatch<React.SetStateAction<GalleryItem[]>>> = {
      mood_images: setMoodImages,
      sketch_images: setSketchImages,
      material_images: setMaterialImages,
      gallery_images: setGalleryImages,
    }
    setters[key]((p) => [...p, item])
  }

  const handleUpload = useCallback(
    async (target: GalleryKey | ImageKey) => {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/jpeg,image/png,image/webp"
      input.onchange = async () => {
        const file = input.files?.[0]
        if (!file) return
        const validationError = validateImageFile(file)
        if (validationError) {
          setError(validationError)
          return
        }
        setUploading(target)
        setError("")
        try {
          setUploadStatus("Optimizing image\u2026")
          const { blob, ext } = await compressImage(file)

          setUploadStatus("Uploading image\u2026")
          const sanitizedName = `${crypto.randomUUID()}.${ext}`
          const compressedFile = new File([blob], sanitizedName, {
            type: `image/${ext === "jpg" ? "jpeg" : ext}`,
          })

          const fd = new FormData()
          fd.append("file", compressedFile)
          fd.append("bucket", "portfolio-images")
          const url = await uploadImage(fd)

          if (target === "cover_image") setCoverImage(url)
          else if (target === "hero_image") setHeroImage(url)
          else if (isGalleryKey(target)) appendToGallery(target, { type: "image", url })
        } catch (e) {
          setError(e instanceof Error ? e.message : "Upload failed")
        } finally {
          setUploading(null)
          setUploadStatus(null)
        }
      }
      input.click()
    },
    [],
  )

  const handleVideoUpload = useCallback(
    async (target: GalleryKey) => {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "video/mp4,video/webm"
      input.onchange = async () => {
        const file = input.files?.[0]
        if (!file) return
        const validationError = validateVideoFile(file)
        if (validationError) {
          setError(validationError)
          return
        }
        setUploading(target)
        setError("")
        try {
          setUploadStatus("Uploading video\u2026")

          const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "mp4"
          const sanitizedName = `${crypto.randomUUID()}.${ext}`
          const renamedFile = new File([file], sanitizedName, { type: file.type })

          const fd = new FormData()
          fd.append("file", renamedFile)
          fd.append("bucket", "portfolio-images")
          const url = await uploadImage(fd)

          if (isGalleryKey(target)) appendToGallery(target, { type: "video", url })
        } catch (e) {
          setError(e instanceof Error ? e.message : "Upload failed")
        } finally {
          setUploading(null)
          setUploadStatus(null)
        }
      }
      input.click()
    },
    [],
  )

  function removeGalleryImg(key: GalleryKey, idx: number) {
    const setters: Record<GalleryKey, (v: GalleryItem[]) => void> = {
      mood_images: setMoodImages,
      sketch_images: setSketchImages,
      material_images: setMaterialImages,
      gallery_images: setGalleryImages,
    }
    const state: Record<GalleryKey, GalleryItem[]> = {
      mood_images: moodImages,
      sketch_images: sketchImages,
      material_images: materialImages,
      gallery_images: galleryImages,
    }
    setters[key](state[key].filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const fd = new FormData()
    fd.set("title", title)
    fd.set("slug", slug)
    fd.set("type", type)
    fd.set("year", year)
    fd.set("role", role)
    fd.set("short_description", shortDescription)
    fd.set("description", description)
    fd.set("cover_image", coverImage)
    fd.set("hero_image", heroImage)
    fd.set("mood_images", JSON.stringify(moodImages))
    fd.set("sketch_images", JSON.stringify(sketchImages))
    fd.set("material_images", JSON.stringify(materialImages))
    fd.set("gallery_images", JSON.stringify(galleryImages))
    fd.set("materials", JSON.stringify([]))
    fd.set("credits", JSON.stringify(credits))
    fd.set("featured", featured ? "true" : "false")
    fd.set("published", published ? "true" : "false")
    fd.set("sort_order", sortOrder)

    try {
      if (isEdit && initial) {
        await updateProject(initial.id, fd)
      } else {
        await createProject(fd)
      }
      setSaved(true)
      setSaving(false)
      setTimeout(() => setSaved(false), 4000)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setSaving(false)
    }
  }

  const inputCls = "w-full border bg-[#0f0f0f] px-3 py-2 text-sm text-[#f0ebe0] outline-none transition-colors focus:border-[#b89a5e]"

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <Section title="Basic Info">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title">
            <input
              className={cn(inputCls, "mt-1.5")}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (!isEdit) generateSlug(e.target.value)
              }}
              required
            />
          </Field>
          <Field label="Slug">
            <input
              className={cn(inputCls, "mt-1.5")}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Field>
          <Field label="Type (Category)">
            <input
              className={cn(inputCls, "mt-1.5")}
              placeholder="Feature Film, TV Series..."
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </Field>
          <Field label="Year">
            <input
              className={cn(inputCls, "mt-1.5")}
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Role">
              <input
                className={cn(inputCls, "mt-1.5")}
                placeholder="Set Design / Production Styling"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </Field>
          </div>
        </div>
      </Section>

      {/* Description */}
      <Section title="Content">
        <div className="space-y-4">
          <Field label="Short Description">
            <textarea
              className={cn(inputCls, "mt-1.5", "min-h-[60px] resize-y")}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
          </Field>
          <Field label="Full Description (Concept)">
            <textarea
              className={cn(inputCls, "mt-1.5", "min-h-[120px] resize-y")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
        </div>
      </Section>

      {/* Single Images */}
      <Section title="Images">
        <div className="grid gap-6 md:grid-cols-2">
          <SingleImageUpload
            label="Cover Image (Thumbnail)"
            value={coverImage}
            onUpload={() => handleUpload("cover_image")}
            onRemove={() => setCoverImage("")}
            uploading={uploading === "cover_image"}
            uploadStatus={uploading === "cover_image" ? uploadStatus : null}
          />
          <SingleImageUpload
            label="Hero Image"
            value={heroImage}
            onUpload={() => handleUpload("hero_image")}
            onRemove={() => setHeroImage("")}
            uploading={uploading === "hero_image"}
            uploadStatus={uploading === "hero_image" ? uploadStatus : null}
          />
        </div>
      </Section>

      {/* Galleries */}
      <Section title="Galleries">
        <div className="space-y-8">
          {(Object.keys(galleryLabels) as GalleryKey[]).map((key) => {
            const images: Record<GalleryKey, GalleryItem[]> = {
              mood_images: moodImages,
              sketch_images: sketchImages,
              material_images: materialImages,
              gallery_images: galleryImages,
            }
            return (
              <GallerySection
                key={key}
                label={galleryLabels[key]}
                images={images[key]}
                uploading={uploading === key}
                uploadStatus={uploading === key ? uploadStatus : null}
                onUpload={() => handleUpload(key)}
                onVideoUpload={() => handleVideoUpload(key)}
                onRemove={(idx) => removeGalleryImg(key, idx)}
              />
            )
          })}
        </div>
      </Section>

      {/* Credits */}
      <Section title="Credits">
        <div className="space-y-3">
          {credits.map((credit, i) => (
            <div key={i} className="flex items-start gap-3">
              <Field label="Role">
                <input
                  className={cn(inputCls, "mt-1.5")}
                  value={credit.role}
                  onChange={(e) => {
                    const next = [...credits]
                    next[i] = { ...next[i], role: e.target.value }
                    setCredits(next)
                  }}
                  placeholder="Director, DOP..."
                />
              </Field>
              <Field label="Name">
                <input
                  className={cn(inputCls, "mt-1.5")}
                  value={credit.name}
                  onChange={(e) => {
                    const next = [...credits]
                    next[i] = { ...next[i], name: e.target.value }
                    setCredits(next)
                  }}
                  placeholder="Full name"
                />
              </Field>
              <button
                type="button"
                onClick={() => setCredits(credits.filter((_, j) => j !== i))}
                className="mt-5 flex h-9 w-9 shrink-0 items-center justify-center border border-[#333] text-[#686058] transition-colors hover:border-red-800 hover:text-red-400"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setCredits([...credits, { role: "", name: "" }])}
            className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#b89a5e] transition-opacity hover:opacity-80"
          >
            <Plus className="h-3 w-3" /> Add Credit
          </button>
        </div>
      </Section>

      {/* Status */}
      <Section title="Status">
        <div className="flex flex-wrap gap-6">
          <Toggle label="Published" checked={published} onChange={setPublished} />
          <Toggle label="Featured" checked={featured} onChange={setFeatured} />
          <Field label="Sort Order">
            <input
              className={cn(inputCls, "mt-1.5")}
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </Field>
        </div>
      </Section>

      {saved && (
        <div className="flex items-center gap-2 border border-green-800 bg-green-900/20 px-4 py-3">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span className="text-sm text-green-400">
            {isEdit ? "Project updated" : "Project created"}
          </span>
        </div>
      )}
      {error && (
        <div className="border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="border border-[#b89a5e] bg-[#b89a5e] px-6 py-2.5 text-xs font-medium tracking-[0.2em] uppercase text-[#050505] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="border border-[#222] bg-transparent px-6 py-2.5 text-xs tracking-[0.2em] uppercase text-[#686058] transition-colors hover:border-[#333] hover:text-[#989080]"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 border-b border-[#1a1a1a] pb-2 text-xs font-medium tracking-[0.2em] uppercase text-[#b89a5e]">
        {title}
      </h2>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs tracking-[0.15em] uppercase text-[#686058]">
      {label}
      {children}
    </label>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors",
          checked ? "bg-[#b89a5e]" : "bg-[#222]",
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-[#0a0a0a] transition-transform",
            checked && "translate-x-4",
          )}
        />
      </button>
      <span className="text-xs tracking-[0.15em] uppercase text-[#989080]">{label}</span>
    </label>
  )
}

function SingleImageUpload({
  label,
  value,
  onUpload,
  onRemove,
  uploading,
  uploadStatus,
}: {
  label: string
  value: string
  onUpload: () => void
  onRemove: () => void
  uploading: boolean
  uploadStatus: string | null
}) {
  return (
    <div>
      <span className="mb-2 block text-xs tracking-[0.15em] uppercase text-[#686058]">{label}</span>
      <div className="overflow-hidden border border-[#1a1a1a]">
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt={label}
              className="h-40 w-full object-cover"
            />
            <div className="absolute right-2 top-2 flex gap-1">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded bg-black/60 p-1 text-[#f0ebe0] hover:bg-black/80"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                onClick={onRemove}
                className="rounded bg-black/60 p-1 text-red-400 hover:bg-black/80"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onUpload}
            disabled={uploading}
            className="flex h-40 w-full items-center justify-center border-2 border-dashed border-[#222] bg-[#0a0a0a] text-[#686058] transition-colors hover:border-[#333] disabled:opacity-50"
          >
            {uploading ? (
              <span className="text-xs">{uploadStatus || "Uploading\u2026"}</span>
            ) : (
              <Upload className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}

function getItemUrl(item: GalleryItem): string {
  return typeof item === "string" ? item : item.url
}

function isVideoItem(item: GalleryItem): boolean {
  return typeof item !== "string" && item.type === "video"
}

function GallerySection({
  label,
  images,
  uploading,
  uploadStatus,
  onUpload,
  onVideoUpload,
  onRemove,
}: {
  label: string
  images: GalleryItem[]
  uploading: boolean
  uploadStatus: string | null
  onUpload: () => void
  onVideoUpload: () => void
  onRemove: (idx: number) => void
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs tracking-[0.15em] uppercase text-[#686058]">{label}</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onVideoUpload}
            disabled={uploading}
            className="flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-[#b89a5e] transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {uploading ? (
              uploadStatus || "Uploading\u2026"
            ) : (
              <>
                <Plus className="h-3 w-3" />
                Add Video
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onUpload}
            disabled={uploading}
            className="flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-[#b89a5e] transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {uploading ? (
              uploadStatus || "Uploading\u2026"
            ) : (
              <>
                <Plus className="h-3 w-3" />
                Add Image
              </>
            )}
          </button>
        </div>
      </div>
      {images.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {images.map((item, i) => (
            <div key={i} className="group relative overflow-hidden border border-[#1a1a1a]">
              {isVideoItem(item) ? (
                <div className="flex h-20 w-28 items-center justify-center bg-[#0f0f0f]">
                  <span className="text-[9px] tracking-[0.15em] uppercase text-[#686058]">Video</span>
                </div>
              ) : (
                <img src={getItemUrl(item)} alt={`${label} ${i + 1}`} className="h-20 w-28 object-cover" />
              )}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute right-1 top-1 rounded bg-black/70 p-0.5 text-red-400 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-xs text-[#444]">No images yet</p>
      )}
    </div>
  )
}
