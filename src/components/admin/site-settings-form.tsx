"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, ExternalLink, X, CheckCircle } from "lucide-react"
import { saveSiteSettings } from "@/lib/actions/admin-site"
import { compressImage } from "@/lib/image-compression"
import { uploadMedia } from "@/lib/supabase/upload"
import { cn } from "@/lib/utils"
import type { SiteSettings, ProcessStep } from "@/lib/supabase/site-settings"

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)

  const [hero_title, setHeroTitle] = useState(settings.hero_title)
  const [hero_subtitle, setHeroSubtitle] = useState(settings.hero_subtitle)
  const [hero_description, setHeroDescription] = useState(settings.hero_description)
  const [hero_cta_label, setHeroCtaLabel] = useState(settings.hero_cta_label)
  const [hero_cta_link, setHeroCtaLink] = useState(settings.hero_cta_link)
  const [hero_background_image, setHeroBgImage] = useState(settings.hero_background_image)

  const [about_title, setAboutTitle] = useState(settings.about_title)
  const [about_description, setAboutDescription] = useState(settings.about_description)
  const [about_image, setAboutImage] = useState(settings.about_image)

  const [process_title, setProcessTitle] = useState(settings.process_title)
  const [process_subtitle, setProcessSubtitle] = useState(settings.process_subtitle)
  const [process_steps, setProcessSteps] = useState<ProcessStep[]>(settings.process_steps)

  const [footer_text, setFooterText] = useState(settings.footer_text)
  const [contact_email, setContactEmail] = useState(settings.contact_email)
  const [instagram_url, setInstagramUrl] = useState(settings.instagram_url)
  const [linkedin_url, setLinkedinUrl] = useState(settings.linkedin_url)

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
  const MAX_SIZE = 15 * 1024 * 1024

  function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Invalid file type. Please upload JPG, PNG, or WebP."
    }
    if (file.size > MAX_SIZE) {
      return "Image is too large. Please upload an image under 15MB."
    }
    return null
  }

  const handleUpload = async (target: string) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/jpeg,image/png,image/webp"
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const validationError = validateFile(file)
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

        const url = await uploadMedia(compressedFile)
        if (process.env.NODE_ENV === "development") {
          console.log(`[site-settings-form] uploaded ${target}:`, url)
        }
        if (target === "hero_background_image") setHeroBgImage(url)
        if (target === "about_image") setAboutImage(url)
        for (let i = 0; i < process_steps.length; i++) {
          if (target === `step_${i}_thumb`) {
            setProcessSteps((prev) =>
              prev.map((s, idx) => (idx === i ? { ...s, thumb: url } : s)),
            )
          }
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed")
      } finally {
        setUploading(null)
        setUploadStatus(null)
      }
    }
    input.click()
  }

  const updateStep = (index: number, field: keyof ProcessStep, value: string | string[]) => {
    setProcessSteps((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSaved(false)

    const fd = new FormData()
    fd.set("hero_title", hero_title)
    fd.set("hero_subtitle", hero_subtitle)
    fd.set("hero_description", hero_description)
    fd.set("hero_cta_label", hero_cta_label)
    fd.set("hero_cta_link", hero_cta_link)
    fd.set("hero_background_image", hero_background_image)
    fd.set("about_title", about_title)
    fd.set("about_description", about_description)
    fd.set("about_image", about_image)
    fd.set("process_title", process_title)
    fd.set("process_subtitle", process_subtitle)
    fd.set("process_steps", JSON.stringify(process_steps))
    fd.set("footer_text", footer_text)
    fd.set("contact_email", contact_email)
    fd.set("instagram_url", instagram_url)
    fd.set("linkedin_url", linkedin_url)

    try {
      await saveSiteSettings(fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  const inputCls =
    "w-full border bg-[#0f0f0f] px-3 py-2 text-sm text-[#f0ebe0] outline-none transition-colors focus:border-[#b89a5e]"

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {saved && (
        <div className="flex items-center gap-2 border border-green-800 bg-green-900/20 px-4 py-3">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span className="text-sm text-green-400">Settings saved</span>
        </div>
      )}
      {error && (
        <div className="border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <Section title="Hero Section">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Hero Title">
            <input
              className={cn(inputCls, "mt-1.5")}
              value={hero_title}
              onChange={(e) => setHeroTitle(e.target.value)}
            />
          </Field>
          <Field label="CTA Label">
            <input
              className={cn(inputCls, "mt-1.5")}
              value={hero_cta_label}
              onChange={(e) => setHeroCtaLabel(e.target.value)}
            />
          </Field>
          <Field label="CTA Link">
            <input
              className={cn(inputCls, "mt-1.5")}
              value={hero_cta_link}
              onChange={(e) => setHeroCtaLink(e.target.value)}
            />
          </Field>
          <Field label="Subtitle">
            <input
              className={cn(inputCls, "mt-1.5")}
              value={hero_subtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description">
              <textarea
                className={cn(inputCls, "mt-1.5 min-h-[60px] resize-y")}
                value={hero_description}
                onChange={(e) => setHeroDescription(e.target.value)}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <SingleImageUpload
              label="Hero Background Image"
              value={hero_background_image}
              onUpload={() => handleUpload("hero_background_image")}
              onRemove={() => setHeroBgImage("")}
              uploading={uploading === "hero_background_image"}
              uploadStatus={uploading === "hero_background_image" ? uploadStatus : null}
            />
          </div>
        </div>
      </Section>

      <Section title="About Section">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title (use \n for line break)">
            <textarea
              className={cn(inputCls, "mt-1.5 min-h-[60px] resize-y")}
              value={about_title}
              onChange={(e) => setAboutTitle(e.target.value)}
            />
          </Field>
          <Field label="About Image">
            <SingleImageUpload
              label=""
              value={about_image}
              onUpload={() => handleUpload("about_image")}
              onRemove={() => setAboutImage("")}
              uploading={uploading === "about_image"}
              uploadStatus={uploading === "about_image" ? uploadStatus : null}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description (use \n\n for paragraph break)">
              <textarea
                className={cn(inputCls, "mt-1.5 min-h-[120px] resize-y")}
                value={about_description}
                onChange={(e) => setAboutDescription(e.target.value)}
              />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="Process Section">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Process Title">
            <input
              className={cn(inputCls, "mt-1.5")}
              value={process_title}
              onChange={(e) => setProcessTitle(e.target.value)}
            />
          </Field>
          <Field label="Process Subtitle">
            <input
              className={cn(inputCls, "mt-1.5")}
              value={process_subtitle}
              onChange={(e) => setProcessSubtitle(e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-6 space-y-6">
          {process_steps.map((step, i) => (
            <div key={i} className="border border-[#1a1a1a] p-4">
              <h3 className="mb-3 font-serif text-sm text-[#b89a5e]">
                Step {step.number} — {step.title}
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Title">
                  <input
                    className={cn(inputCls, "mt-1")}
                    value={step.title}
                    onChange={(e) => updateStep(i, "title", e.target.value)}
                  />
                </Field>
                <Field label="Subtitle">
                  <input
                    className={cn(inputCls, "mt-1")}
                    value={step.subtitle}
                    onChange={(e) => updateStep(i, "subtitle", e.target.value)}
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Description (homepage short text)">
                    <textarea
                      className={cn(inputCls, "mt-1 min-h-[60px] resize-y")}
                      value={step.description}
                      onChange={(e) => updateStep(i, "description", e.target.value)}
                    />
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <Field label="Paragraphs (one per line for process page)">
                    <textarea
                      className={cn(inputCls, "mt-1 min-h-[80px] resize-y")}
                      value={step.paragraphs.join("\n\n")}
                      onChange={(e) => updateStep(i, "paragraphs", e.target.value.split("\n\n"))}
                    />
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <SingleImageUpload
                    label="Thumbnail Image"
                    value={step.thumb}
                    onUpload={() => handleUpload(`step_${i}_thumb`)}
                    onRemove={() => updateStep(i, "thumb", "")}
                    uploading={uploading === `step_${i}_thumb`}
                    uploadStatus={uploading === `step_${i}_thumb` ? uploadStatus : null}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Footer & Contact">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Footer Text">
            <input
              className={cn(inputCls, "mt-1.5")}
              value={footer_text}
              onChange={(e) => setFooterText(e.target.value)}
            />
          </Field>
          <Field label="Contact Email">
            <input
              className={cn(inputCls, "mt-1.5")}
              value={contact_email}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </Field>
          <Field label="Instagram URL">
            <input
              className={cn(inputCls, "mt-1.5")}
              value={instagram_url}
              onChange={(e) => setInstagramUrl(e.target.value)}
            />
          </Field>
          <Field label="LinkedIn URL">
            <input
              className={cn(inputCls, "mt-1.5")}
              value={linkedin_url}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
          </Field>
        </div>
      </Section>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="border border-[#b89a5e] bg-[#b89a5e] px-6 py-2.5 text-xs font-medium tracking-[0.2em] uppercase text-[#050505] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
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
      {label && (
        <span className="mb-2 block text-xs tracking-[0.15em] uppercase text-[#686058]">
          {label}
        </span>
      )}
      <div className="overflow-hidden border border-[#1a1a1a]">
        {value ? (
          <div className="relative">
            <img src={value} alt={label} className="h-32 w-full object-cover" />
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
            className="flex h-32 w-full items-center justify-center border-2 border-dashed border-[#222] bg-[#0a0a0a] text-[#686058] transition-colors hover:border-[#333] disabled:opacity-50"
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
