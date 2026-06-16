export interface CompressionResult {
  blob: Blob
  ext: string
}

export async function compressImage(file: File): Promise<CompressionResult> {
  const img = await loadImage(file)

  const { width, height } = scaleDimensions(img.width, img.height, 2400)

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(img, 0, 0, width, height)

  const supportsWebP = canvas.toDataURL("image/webp").indexOf("image/webp") === 0

  if (supportsWebP) {
    const blob = await compressToTarget(canvas, "image/webp", 0.82, 0.65, 5)
    if (blob) return { blob, ext: "webp" }
  }

  const blob = await compressToTarget(canvas, "image/jpeg", 0.85, 0.65, 5)
  if (blob) return { blob, ext: "jpg" }

  throw new Error("Image is too large even after compression. Please upload a smaller image.")
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image"))
    }
    img.src = url
  })
}

function scaleDimensions(
  origW: number,
  origH: number,
  max: number,
): { width: number; height: number } {
  if (origW <= max && origH <= max) return { width: origW, height: origH }
  const ratio = Math.min(max / origW, max / origH)
  return {
    width: Math.round(origW * ratio),
    height: Math.round(origH * ratio),
  }
}

async function compressToTarget(
  canvas: HTMLCanvasElement,
  mimeType: string,
  initialQuality: number,
  minQuality: number,
  targetMB: number,
): Promise<Blob | null> {
  const targetBytes = targetMB * 1024 * 1024

  for (let q = initialQuality; q >= minQuality; q -= 0.05) {
    const blob = await canvasToBlob(canvas, mimeType, Math.round(q * 100) / 100)
    if (blob.size <= targetBytes) return blob
  }

  const finalBlob = await canvasToBlob(canvas, mimeType, minQuality)
  if (finalBlob.size <= targetBytes) return finalBlob

  return null
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Canvas toBlob failed"))
      },
      mimeType,
      quality,
    )
  })
}
