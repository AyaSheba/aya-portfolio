import { MessageSquare } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { MessagesList } from "@/components/admin/messages-list"

export default async function AdminMessagesPage() {
  let messages: {
    id: string
    name: string
    email: string
    subject: string
    message: string
    status: string
    created_at: string
  }[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) messages = data
  } catch {}

  const newCount = messages.filter((m) => m.status === "new").length

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-[#f0ebe0]">Messages</h1>
          <p className="mt-1 text-xs text-[#686058]">
            {messages.length} total{newCount > 0 && ` · ${newCount} unread`}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center border border-[#b89a5e] bg-[#b89a5e]/10">
          <MessageSquare className="h-5 w-5 text-[#b89a5e]" />
        </div>
      </div>

      <div className="mt-6">
        <MessagesList messages={messages} />
      </div>
    </div>
  )
}
