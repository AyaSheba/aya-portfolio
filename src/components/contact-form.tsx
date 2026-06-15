"use client"

import { useState, useRef } from "react"
import { Send, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { submitContactMessage } from "@/lib/actions/contact"

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    setErrorMsg("")

    try {
      const formData = new FormData(e.currentTarget)
      await submitContactMessage(formData)
      setStatus("success")
      formRef.current?.reset()
    } catch {
      setStatus("error")
      setErrorMsg("Something went wrong. Please try again.")
    }
  }

  if (status === "success") {
    return (
      <div className="flex h-full items-center justify-center border border-gold/30 p-12 text-center">
        <div>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold/30">
            <CheckCircle className="h-6 w-6 text-gold" />
          </div>
          <h3 className="font-serif text-2xl text-cream">Message sent successfully.</h3>
          <p className="mt-2 text-sm text-text-secondary">
            I&apos;ll respond within 48 hours.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-xs tracking-[0.2em] uppercase text-text-muted"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-gold"
            placeholder="Your name"
            disabled={status === "sending"}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-xs tracking-[0.2em] uppercase text-text-muted"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-gold"
            placeholder="your@email.com"
            disabled={status === "sending"}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-xs tracking-[0.2em] uppercase text-text-muted"
        >
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-gold"
          placeholder="Project type / inquiry"
          disabled={status === "sending"}
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-xs tracking-[0.2em] uppercase text-text-muted"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className="mt-2 w-full resize-none border border-border bg-transparent px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-gold"
          placeholder="Tell me about your project..."
          disabled={status === "sending"}
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 border border-red-900/50 bg-red-950/20 px-4 py-3 text-xs text-red-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex items-center gap-3 border border-gold bg-gold/10 px-8 py-4 text-sm font-medium tracking-[0.15em] uppercase text-gold transition-all duration-500 hover:bg-gold hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "sending" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  )
}
