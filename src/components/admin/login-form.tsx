"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
      <div className="space-y-1">
        <label htmlFor="email" className="text-xs tracking-[0.15em] uppercase text-[#989080]">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-[#222] bg-[#0f0f0f] px-4 py-2.5 text-sm text-[#f0ebe0] outline-none transition-colors focus:border-[#b89a5e]"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-xs tracking-[0.15em] uppercase text-[#989080]">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-[#222] bg-[#0f0f0f] px-4 py-2.5 text-sm text-[#f0ebe0] outline-none transition-colors focus:border-[#b89a5e]"
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full border border-[#b89a5e] bg-[#b89a5e] px-6 py-2.5 text-xs font-medium tracking-[0.2em] uppercase text-[#050505] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  )
}
