import { LoginForm } from "@/components/admin/login-form"

export default function AdminLoginPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL

  const missing: string[] = []
  if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL")
  if (!anonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  if (!adminEmail) missing.push("NEXT_PUBLIC_ADMIN_EMAIL")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505]">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-3xl tracking-tight text-[#f0ebe0]">Aya / Admin</h1>
        <p className="mt-2 text-xs tracking-[0.2em] uppercase text-[#686058]">Sign in to continue</p>
      </div>
      {missing.length > 0 ? (
        <div className="max-w-sm text-center">
          <p className="text-xs text-red-400">
            Missing environment variables: {missing.join(", ")}. Add them to .env.local and restart.
          </p>
        </div>
      ) : (
        <LoginForm />
      )}
    </div>
  )
}
