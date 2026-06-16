"use client"

import { useState, useRef, useEffect } from "react"
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
  const imagesRef = useRef(images)
  imagesRef.current = images

  const filtered = images.filter((item) => !isVideo(item))
  const imageUrls = filtered.map(getUrl)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let isDown = false
    let startX = 0
    let scrollLeft = 0
    let dragDistance = 0

    function onPointerDown(e: PointerEvent) {
      isDown = true
      dragDistance = 0
      startX = e.clientX
      scrollLeft = el!.scrollLeft
    }

    function onPointerMove(e: PointerEvent) {
      if (!isDown) return
      const dx = e.clientX - startX
      dragDistance = Math.abs(dx)
      el!.scrollLeft = scrollLeft - dx
    }

    function onPointerUp() {
      isDown = false
    }

    function onPointerLeave() {
      isDown = false
    }

    function onClick(e: MouseEvent) {
      if (dragDistance > 5) {
        e.stopPropagation()
        return
      }
      const card = (e.target as HTMLElement).closest("[data-idx]")
      if (!card) return
      const raw = card.getAttribute("data-idx")
      if (raw === null) return
      const idx = parseInt(raw, 10)
      if (isNaN(idx)) return
      const currentImages = imagesRef.current
      const item = currentImages[idx]
      if (!item) return
      const filteredIdx = currentImages.filter((x) => !isVideo(x)).indexOf(item)
      if (filteredIdx !== -1) setLightboxIndex(filteredIdx)
    }

    el.addEventListener("pointerdown", onPointerDown)
    el.addEventListener("pointermove", onPointerMove)
    el.addEventListener("pointerup", onPointerUp)
    el.addEventListener("pointerleave", onPointerLeave)
    el.addEventListener("click", onClick)

    return () => {
      el.removeEventListener("pointerdown", onPointerDown)
      el.removeEventListener("pointermove", onPointerMove)
      el.removeEventListener("pointerup", onPointerUp)
      el.removeEventListener("pointerleave", onPointerLeave)
      el.removeEventListener("click", onClick)
    }
  }, [])

  return (
    <>
      <div
        ref={scrollRef}
        className="flex cursor-grab gap-4 overflow-x-auto pb-2 max-w-full touch-pan-x select-none active:cursor-grabbing"
      >
        {images.map((item, i) => {
          const url = getUrl(item)
          return (
            <div
              key={i}
              data-idx={i}
              className="shrink-0 w-[220px] h-[360px] overflow-hidden border border-gold/20 sm:w-[260px] sm:h-[420px] md:w-[280px] md:h-[520px]"
            >
              <div
                className="h-full w-full bg-cover bg-center transition-transform duration-500 hover:scale-105"
                style={{ backgroundImage: `url(${url})` }}
                draggable={false}
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
