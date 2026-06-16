"use client"

import { useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  images: string[]
  index: number
  onClose: () => void
  onNavigate: (nextIndex: number) => void
}

export function ImageLightbox({ images, index, onClose, onNavigate }: Props) {
  const total = images.length

  function handlePrev() {
    onNavigate((index - 1 + total) % total)
  }

  function handleNext() {
    onNavigate((index + 1) % total)
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") { e.preventDefault(); handleNext() }
      if (e.key === "ArrowLeft") { e.preventDefault(); handlePrev() }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  })

  return (
    <div
      className="fixed inset-0 z-[400] flex cursor-pointer items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-gold hover:text-gold"
        aria-label="Close lightbox"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="pointer-events-none absolute inset-0 z-[401] flex items-center justify-between px-2 md:px-6">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handlePrev() }}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:border-gold/50 hover:text-gold md:h-12 md:w-12"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleNext() }}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:border-gold/50 hover:text-gold md:h-12 md:w-12"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      </div>

      <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[index]}
          alt=""
          className="max-h-[88vh] max-w-[92vw] object-contain"
        />
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-xs tracking-[0.2em] text-white/40">
        {index + 1} / {total}
      </div>
    </div>
  )
}
