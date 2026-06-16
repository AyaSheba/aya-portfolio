"use client"

import { useState } from "react"
import { ImageLightbox } from "@/components/image-lightbox"

interface Props {
  images: string[]
}

export function ProjectImageGrid({ images }: Props) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightboxSrc(img)}
            className="aspect-[4/3] min-w-[240px] flex-shrink-0 overflow-hidden border border-gold/20 md:min-w-[280px] cursor-pointer group"
          >
            <div
              className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${img})` }}
            />
          </button>
        ))}
      </div>
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </>
  )
}
