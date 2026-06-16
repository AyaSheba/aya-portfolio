import { createClient } from "./client"

export async function uploadMedia(
  file: File,
  bucket = "portfolio-images",
): Promise<string> {
  const supabase = createClient()

  const ext = (file.name.split(".").pop() || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
  const fileName = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (error) throw new Error(error.message)

  const { data: urlData } = await supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return urlData.publicUrl
}
