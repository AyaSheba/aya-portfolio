"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveSiteSettings(formData: FormData) {
  const supabase = await createClient()

  const processStepsRaw = formData.get("process_steps") as string
  let process_steps = []
  try {
    process_steps = JSON.parse(processStepsRaw)
  } catch {
    process_steps = []
  }

  const payload = {
    singleton_key: "main",
    hero_title: formData.get("hero_title") as string,
    hero_subtitle: formData.get("hero_subtitle") as string,
    hero_description: formData.get("hero_description") as string,
    hero_cta_label: formData.get("hero_cta_label") as string,
    hero_cta_link: formData.get("hero_cta_link") as string,
    hero_background_image: formData.get("hero_background_image") as string,
    about_title: formData.get("about_title") as string,
    about_description: formData.get("about_description") as string,
    about_image: formData.get("about_image") as string,
    process_title: formData.get("process_title") as string,
    process_subtitle: formData.get("process_subtitle") as string,
    process_steps,
    footer_text: formData.get("footer_text") as string,
    contact_email: formData.get("contact_email") as string,
    instagram_url: formData.get("instagram_url") as string,
    linkedin_url: formData.get("linkedin_url") as string,
    updated_at: new Date().toISOString(),
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[admin-site] saving with singleton_key=main")
    console.log("[admin-site] hero_background_image:", payload.hero_background_image)
    console.log("[admin-site] about_image:", payload.about_image)
  }

  const { error } = await supabase.from("site_settings").upsert(payload, {
    onConflict: "singleton_key",
    ignoreDuplicates: false,
  })

  if (error) throw new Error(error.message)

  if (process.env.NODE_ENV === "development") {
    console.log("[admin-site] saved successfully")
  }

  revalidatePath("/")
  revalidatePath("/about")
  revalidatePath("/process")
  revalidatePath("/contact")
  revalidatePath("/admin/site")
}
