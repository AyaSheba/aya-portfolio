"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react"
import { markMessageAsRead, deleteMessage } from "@/lib/actions/admin"

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  created_at: string
}

export function MessagesList({ messages }: { messages: Message[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  async function handleMarkRead(id: string) {
    try {
      await markMessageAsRead(id)
      router.refresh()
    } catch {}
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await deleteMessage(id)
      router.refresh()
    } catch {
      setDeleting(null)
    }
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-[#1a1a1a] bg-[#0f0f0f] p-12 text-center">
        <Mail className="h-8 w-8 text-[#686058]" />
        <p className="mt-3 text-sm text-[#686058]">No messages yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`border ${
            msg.status === "new" ? "border-[#b89a5e]/30" : "border-[#1a1a1a]"
          } bg-[#0f0f0f] transition-colors`}
        >
          <button
            onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
            className="flex w-full items-center gap-4 p-4 text-left"
          >
            <div className="shrink-0">
              {msg.status === "new" ? (
                <div className="flex h-8 w-8 items-center justify-center border border-[#b89a5e] bg-[#b89a5e]/10">
                  <Mail className="h-3.5 w-3.5 text-[#b89a5e]" />
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center border border-[#333] bg-[#1a1a1a]">
                  <MailOpen className="h-3.5 w-3.5 text-[#686058]" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <span className="truncate text-sm font-medium text-[#f0ebe0]">
                  {msg.name}
                </span>
                {msg.status === "new" && (
                  <span className="shrink-0 rounded-full bg-[#b89a5e]/20 px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase text-[#b89a5e]">
                    New
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-[#686058]">
                {msg.subject}
              </p>
            </div>
            <span className="hidden shrink-0 text-[10px] text-[#686058] md:block">
              {new Date(msg.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <div className="shrink-0 text-[#686058]">
              {expanded === msg.id ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </button>

          {expanded === msg.id && (
            <div className="border-t border-[#1a1a1a] px-4 pb-4 pt-3">
              <div className="mb-3 flex flex-wrap gap-4 text-xs text-[#686058]">
                <span>
                  Email:{" "}
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-[#b89a5e] hover:underline"
                  >
                    {msg.email}
                  </a>
                </span>
                <span>
                  Date:{" "}
                  {new Date(msg.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="mb-3 rounded border border-[#1a1a1a] bg-[#0a0a0a] p-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#c8c0b0]">
                  {msg.message}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {msg.status === "new" && (
                  <button
                    onClick={() => handleMarkRead(msg.id)}
                    className="flex items-center gap-2 border border-[#333] px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#989080] transition-colors hover:border-[#b89a5e] hover:text-[#b89a5e]"
                  >
                    <MailOpen className="h-3 w-3" />
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(msg.id)}
                  disabled={deleting === msg.id}
                  className="flex items-center gap-2 border border-[#333] px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-red-400/60 transition-colors hover:border-red-800 hover:text-red-400"
                >
                  {deleting === msg.id ? (
                    <AlertCircle className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
