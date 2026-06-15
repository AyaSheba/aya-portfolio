"use client"

import { useState } from "react"
import { Send } from "lucide-react"

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex h-full items-center justify-center border border-gold/30 p-12 text-center">
        <div>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold/30">
            <Send className="h-6 w-6 text-gold" />
          </div>
          <h3 className="font-serif text-2xl text-cream">Thank you</h3>
          <p className="mt-2 text-sm text-text-secondary">
            Your message has been received. I&apos;ll respond within 48 hours.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            required
            className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-gold"
            placeholder="Your name"
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
            required
            className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-gold"
            placeholder="your@email.com"
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
          required
          className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-gold"
          placeholder="Project type / inquiry"
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
          rows={6}
          required
          className="mt-2 w-full resize-none border border-border bg-transparent px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-gold"
          placeholder="Tell me about your project..."
        />
      </div>

      <button
        type="submit"
        className="flex items-center gap-3 border border-gold bg-gold/10 px-8 py-4 text-sm font-medium tracking-[0.15em] uppercase text-gold transition-all duration-500 hover:bg-gold hover:text-background"
      >
        <Send className="h-4 w-4" />
        Send Message
      </button>
    </form>
  )
}
