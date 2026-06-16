"use client"

import { useRef, useCallback } from "react"

export function useHorizontalDrag() {
  const ref = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = false
    const el = ref.current
    if (!el) return
    startX.current = e.pageX - el.getBoundingClientRect().left
    scrollLeft.current = el.scrollLeft
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const x = e.pageX - el.getBoundingClientRect().left
    const walk = (x - startX.current) * 1.5
    if (Math.abs(walk) > 5) isDragging.current = true
    el.scrollLeft = scrollLeft.current - walk
  }, [])

  const onMouseUp = useCallback(() => {
    /* isDragging resets on next mousedown so click handler can check it */
  }, [])

  const onMouseLeave = useCallback(() => {
    /* leave during drag: don't reset so next click doesn't fire */
  }, [])

  return { ref, handlers: { onMouseDown, onMouseMove, onMouseUp, onMouseLeave }, isDragging }
}
