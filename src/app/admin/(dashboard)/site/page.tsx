import { getSiteSettings } from "@/lib/supabase/site-settings"
import { SiteSettingsForm } from "@/components/admin/site-settings-form"

export default async function AdminSitePage() {
  const settings = await getSiteSettings()

  return (
    <div>
      <h1 className="font-serif text-2xl text-[#f0ebe0]">Site Settings</h1>
      <p className="mt-1 text-xs text-[#686058]">
        Manage homepage hero, about section, process steps, and footer content
      </p>
      <div className="mt-8 max-w-3xl">
        <SiteSettingsForm settings={settings} />
      </div>
    </div>
  )
}
