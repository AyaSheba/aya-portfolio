"use client"

import { useState, useRef, useCallback } from "react"
import { ImageLightbox } from "@/components/image-lightbox"

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
  const scrollRef = useRef<HTMLDivElement>(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const didDrag = useRef(false)

  const filtered = images.filter((item) => !isVideo(item))
  const imageUrls = filtered.map(getUrl)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDown.current = true
    didDrag.current = false
    const el = scrollRef.current
    if (!el) return
    startX.current = e.pageX - el.getBoundingClientRect().left
    scrollLeft.current = el.scrollLeft
    el.setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDown.current) return
    const el = scrollRef.current
    if (!el) return
    e.preventDefault()
    const x = e.pageX - el.getBoundingClientRect().left
    const walk = (x - startX.current) * 1.5
    if (Math.abs(walk) > 5) didDrag.current = true
    el.scrollLeft = scrollLeft.current - walk
  }, [])

  const onPointerUp = useCallback(() => {
    isDown.current = false
  }, [])

  return (
    <>
      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="flex cursor-grab gap-4 overflow-x-auto pb-2 max-w-full touch-pan-x select-none active:cursor-grabbing"
      >
        {images.map((item, i) => {
          const url = getUrl(item)
          return (
            <div
              key={i}
              onClick={() => {
                if (didDrag.current) return
                const idx = filtered.indexOf(item)
                if (idx !== -1) setLightboxIndex(idx)
              }}
              className="shrink-0 w-[220px] h-[360px] overflow-hidden border border-gold/20 cursor-pointer group sm:w-[260px] sm:h-[420px] md:w-[280px] md:h-[520px]"
            >
              <div
                className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${url})` }}
              />
            </div>
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
