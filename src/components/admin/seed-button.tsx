"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { seedProjects } from "@/lib/actions/admin"

export function SeedButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  async function handleSeed() {
    if (!confirm("Seed 3 sample projects into Supabase? This will only run if the table is empty."))
      return

    setLoading(true)
    setMessage("")
    try {
      const result = await seedProjects()
      setMessage(`Seeded ${result.count} project(s). Refreshing...`)
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Seed failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleSeed}
        disabled={loading}
        className="border border-[#b89a5e] bg-transparent px-4 py-2 text-[10px] font-medium tracking-[0.2em] uppercase text-[#b89a5e] transition-colors hover:bg-[#b89a5e]/10 disabled:opacity-50"
      >
        {loading ? "Seeding..." : "Seed Sample Projects"}
      </button>
      {message && <p className="mt-2 text-xs text-[#989080]">{message}</p>}
    </div>
  )
}
