"use client"

import { useState } from "react"
import { ImageLightbox } from "@/components/image-lightbox"
import type { GalleryItem } from "@/lib/projects"

function getUrl(item: GalleryItem): string {
  return typeof item === "string" ? item : item.url
}

function isVideo(item: GalleryItem): boolean {
  return typeof item !== "string" && item.type === "video"
}

interface Props {
  images: GalleryItem[]
}

export function ProjectImageGrid({ images }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const imageItems = images.filter((item) => !isVideo(item))
  const indices = imageItems.map((item) => images.indexOf(item))

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-2 max-w-full">
        {images.map((item, i) => {
          const url = getUrl(item)
          if (isVideo(item)) {
            return (
              <div
                key={i}
                className="aspect-[4/3] min-w-[320px] flex-shrink-0 overflow-hidden border border-gold/20 md:min-w-[360px]"
              >
                <video
                  src={url}
                  controls
                  preload="metadata"
                  playsInline
                  className="h-full w-full object-cover"
                />
              </div>
            )
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => setLightboxIndex(i)}
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
          images={imageItems.map(getUrl)}
          index={imageItems.indexOf(images[lightboxIndex])}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(i) => {
            const target = imageItems[i]
            const realIdx = images.indexOf(target)
            setLightboxIndex(realIdx)
          }}
        />
      )}
    </>
  )
}
