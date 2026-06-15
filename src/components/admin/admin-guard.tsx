"use client"

import { useEffect, useState, useRef, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function AdminGuard({ children }: { children: ReactNode }) {
  const [state, setState] = useState<"loading" | "authorized" | "denied" | "error">("loading")
  const [errorMsg, setErrorMsg] = useState("")
  const router = useRouter()
  const checked = useRef(false)

  useEffect(() => {
    if (checked.current) return
    checked.current = true

    const timeout = setTimeout(() => {
      setState("error")
      setErrorMsg("Request timed out. Check your Supabase configuration.")
    }, 10000)

    async function check() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL

        if (!supabaseUrl || !anonKey || !adminEmail) {
          clearTimeout(timeout)
          setState("error")
          setErrorMsg("Missing Supabase or admin configuration. Check your .env.local file.")
          return
        }

        const supabase = createClient()
        const { data, error } = await supabase.auth.getUser()

        if (error || !data.user) {
          clearTimeout(timeout)
          router.replace("/admin/login")
          return
        }

        if (data.user.email !== adminEmail) {
          clearTimeout(timeout)
          await supabase.auth.signOut()
          setState("denied")
          return
        }

        clearTimeout(timeout)
        setState("authorized")
      } catch (err) {
        clearTimeout(timeout)
        console.error("AdminGuard error:", err)
        setState("error")
        setErrorMsg("An unexpected error occurred. Please try again.")
      }
    }

    check()

    return () => clearTimeout(timeout)
  }, [router])

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#b89a5e] border-t-transparent" />
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="max-w-md text-center">
          <p className="text-sm text-red-400">{errorMsg}</p>
        </div>
      </div>
    )
  }

  if (state === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="max-w-md text-center">
          <p className="text-sm text-[#f0ebe0]">Access denied. You are not authorized as admin.</p>
          <a
            href="/admin/login"
            className="mt-4 inline-block text-xs text-[#b89a5e] hover:underline"
          >
            Back to login
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
