import { getSiteSettings } from "@/lib/supabase/site-settings"

export async function Footer() {
  const settings = await getSiteSettings()

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-6 py-10 md:flex-row md:justify-between md:px-12 lg:px-16">
        <span className="font-serif text-lg tracking-wide text-cream">
          Aya
        </span>
        <p className="text-sm text-text-muted">{settings.footer_text}</p>
        <div className="flex items-center gap-6">
          <a
            href={`mailto:${settings.contact_email}`}
            className="text-xs tracking-[0.15em] uppercase text-text-secondary transition-colors hover:text-gold"
          >
            Email
          </a>
          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-[0.15em] uppercase text-text-secondary transition-colors hover:text-gold"
          >
            Instagram
          </a>
          <a
            href={settings.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-[0.15em] uppercase text-text-secondary transition-colors hover:text-gold"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
