"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

interface Props {
  src: string | null
  onClose: () => void
}

export function ImageLightbox({ src, onClose }: Props) {
  useEffect(() => {
    if (!src) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [src, onClose])

  if (!src) return null

  return (
    <div
      className="fixed inset-0 z-[400] flex cursor-pointer items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-gold hover:text-gold"
        aria-label="Close lightbox"
      >
        <X className="h-5 w-5" />
      </button>
      <img
        src={src}
        alt=""
        className="max-h-[88vh] max-w-[92vw] cursor-default object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
