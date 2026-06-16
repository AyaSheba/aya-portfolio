"use client"

import { useState } from "react"
import { ImageLightbox } from "@/components/image-lightbox"
import { useHorizontalDrag } from "@/hooks/use-horizontal-drag"

function getUrl(item: string | { type?: string; url: string }): string {
  return typeof item === "string" ? item : item.url
}

function isVideo(item: string | { type?: string; url: string }): boolean {
  return typeof item !== "string" && item.type === "video"
}

interface Props {
  images: (string | { type?: string; url: string })[]
}

export function ProjectImageGrid({ images }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const { ref, handlers, isDragging } = useHorizontalDrag()

  const filtered = images.filter((item) => !isVideo(item))
  const imageUrls = filtered.map(getUrl)

  return (
    <>
      <div
        ref={ref}
        {...handlers}
        className="flex cursor-grab gap-3 overflow-x-auto pb-2 max-w-full touch-pan-x select-none"
      >
        {images.map((item, i) => {
          const url = getUrl(item)
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (isDragging.current) return
                const idx = filtered.indexOf(item)
                if (idx !== -1) setLightboxIndex(idx)
              }}
              className="aspect-[4/3] min-w-[240px] flex-shrink-0 overflow-hidden border border-gold/20 md:min-w-[280px] cursor-pointer group"
            >
              <div
                className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${url})` }}
              />
            </button>
          )
        })}
      </div>
      {lightboxIndex !== null && (
        <ImageLightbox
          images={imageUrls}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(i) => setLightboxIndex(i)}
        />
      )}
    </>
  )
}
