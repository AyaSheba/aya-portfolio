"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, FolderKanban, Settings, MessageSquare, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/site", label: "Site Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-16 flex h-[calc(100vh-4rem)] w-56 flex-col border-r border-[#1a1a1a] bg-[#0a0a0a]">
      <div className="flex h-16 items-center border-b border-[#1a1a1a] px-6">
        <Link href="/admin" className="font-serif text-lg tracking-wide text-[#f0ebe0]">
          Aya / Admin
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 p-4">
        {nav.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-[#1a1a1a] text-[#b89a5e]"
                  : "text-[#989080] hover:bg-[#111] hover:text-[#f0ebe0]",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[#1a1a1a] p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-[#686058] transition-colors hover:bg-[#111] hover:text-[#f0ebe0]"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
