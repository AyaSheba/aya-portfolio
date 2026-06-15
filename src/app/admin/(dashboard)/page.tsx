import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { FolderKanban, CheckCircle, Globe, Settings, Plus, MessageSquare } from "lucide-react"

export default async function AdminDashboard() {
  let projectCount = 0
  let publishedCount = 0
  let featuredCount = 0

  let messageCount = 0
  let newMessageCount = 0

  try {
    const supabase = await createClient()
    const { data: projects } = await supabase.from("projects").select("id, published, featured")
    if (projects) {
      projectCount = projects.length
      publishedCount = projects.filter((p) => p.published).length
      featuredCount = projects.filter((p) => p.featured).length
    }
    const { data: messages } = await supabase
      .from("contact_messages")
      .select("status")
    if (messages) {
      messageCount = messages.length
      newMessageCount = messages.filter((m) => m.status === "new").length
    }
  } catch {}

  const stats = [
    { label: "Total Projects", value: projectCount, icon: FolderKanban },
    { label: "Published", value: publishedCount, icon: Globe },
    { label: "Messages", value: `${messageCount}${newMessageCount > 0 ? ` · ${newMessageCount} new` : ""}`, icon: MessageSquare },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl text-[#f0ebe0]">Dashboard</h1>
      <p className="mt-1 text-xs text-[#686058]">Overview of your portfolio</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="border border-[#1a1a1a] bg-[#0f0f0f] p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-[0.15em] uppercase text-[#686058]">
                  {stat.label}
                </span>
                <Icon className="h-4 w-4 text-[#b89a5e]" />
              </div>
              <p className="mt-3 font-serif text-3xl text-[#f0ebe0]">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-3 border border-[#1a1a1a] bg-[#0f0f0f] p-6 transition-colors hover:border-[#333]"
        >
          <div className="flex h-10 w-10 items-center justify-center border border-[#b89a5e] bg-[#b89a5e]/10">
            <Plus className="h-5 w-5 text-[#b89a5e]" />
          </div>
          <div>
            <span className="text-xs font-medium tracking-[0.15em] uppercase text-[#f0ebe0]">
              Add Project
            </span>
            <p className="mt-0.5 text-[10px] text-[#686058]">Create a new portfolio project</p>
          </div>
        </Link>
        <Link
          href="/admin/messages"
          className="flex items-center gap-3 border border-[#1a1a1a] bg-[#0f0f0f] p-6 transition-colors hover:border-[#333]"
        >
          <div className="flex h-10 w-10 items-center justify-center border border-[#b89a5e] bg-[#b89a5e]/10">
            <MessageSquare className="h-5 w-5 text-[#b89a5e]" />
          </div>
          <div>
            <span className="text-xs font-medium tracking-[0.15em] uppercase text-[#f0ebe0]">
              Messages
            </span>
            <p className="mt-0.5 text-[10px] text-[#686058]">
              {newMessageCount > 0
                ? `${newMessageCount} unread message${newMessageCount === 1 ? "" : "s"}`
                : "View all contact messages"}
            </p>
          </div>
        </Link>
        <Link
          href="/admin/site"
          className="flex items-center gap-3 border border-[#1a1a1a] bg-[#0f0f0f] p-6 transition-colors hover:border-[#333]"
        >
          <div className="flex h-10 w-10 items-center justify-center border border-[#b89a5e] bg-[#b89a5e]/10">
            <Settings className="h-5 w-5 text-[#b89a5e]" />
          </div>
          <div>
            <span className="text-xs font-medium tracking-[0.15em] uppercase text-[#f0ebe0]">
              Site Settings
            </span>
            <p className="mt-0.5 text-[10px] text-[#686058]">Edit homepage, about, process, footer</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
