"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/#selected-works", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false
    return pathname === href
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 left-0 z-50 transition-all duration-500",
          "border-b border-transparent",
          "bg-background/80 backdrop-blur-2xl",
        )}
      >
        <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 md:px-12 lg:px-16">
          <Link
            href="/"
            className="font-serif text-xl tracking-wide text-cream transition-colors hover:text-gold"
          >
            Aya
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-300",
                  isActive(link.href)
                    ? "text-gold"
                    : "text-cream-muted hover:text-cream",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label="Toggle menu"
          >
            <span
              className={cn(
                "h-px w-5 bg-cream transition-all duration-300",
                menuOpen && "translate-y-[3.5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "h-px w-5 bg-cream transition-all duration-300",
                menuOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "h-px w-5 bg-cream transition-all duration-300",
                menuOpen && "-translate-y-[3.5px] -rotate-45",
              )}
            />
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[300] flex flex-col bg-[#050505]">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute right-6 top-5 flex h-10 w-10 items-center justify-center border border-[#333] text-cream transition-colors hover:border-gold hover:text-gold"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>

          <nav className="flex flex-1 flex-col items-center justify-center gap-10 px-6">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-serif text-3xl tracking-wide transition-colors duration-300 sm:text-4xl",
                  isActive(link.href) ? "text-gold" : "text-cream hover:text-gold",
                )}
                style={{ animation: `fade-in-up 0.4s ease-out ${i * 0.08}s both` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
