import type { ReactNode } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Sidebar } from "@/components/admin/sidebar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="ml-56 flex-1 overflow-auto pt-16 px-8 pb-8">{children}</main>
      </div>
    </AdminGuard>
  )
}
