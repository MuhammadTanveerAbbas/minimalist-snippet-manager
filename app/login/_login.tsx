'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  return (
    <div className="h-screen flex items-center justify-center bg-background px-4">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative flex flex-col items-center gap-8 w-full max-w-sm">
        {/* Logo + brand */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl" />
            <svg
              width="52"
              height="52"
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative"
            >
              <rect width="34" height="34" rx="9" className="fill-foreground" />
              <circle cx="8" cy="8.5" r="2" className="fill-background" opacity="0.35" />
              <path
                d="M9 17.5L13.5 21L9 24.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dark:stroke-background stroke-primary-foreground"
                opacity="0.9"
              />
              <rect x="16" y="18" width="10" height="2.5" rx="1" className="fill-background logo-cursor" opacity="0.75" />
              <rect x="16" y="22.5" width="6" height="2" rx="1" className="fill-background" opacity="0.25" />
              <style>{`
                .logo-cursor { animation: logoBlink 1.1s step-start infinite; }
                @keyframes logoBlink { 0%, 100% { opacity: 0.75; } 50% { opacity: 0; } }
              `}</style>
            </svg>
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Snippet Manager</h1>
            <p className="text-sm text-muted-foreground">Your developer code library</p>
          </div>
        </div>

        {/* Card */}
        <div className="w-full rounded-2xl border border-border bg-card p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-semibold">Welcome back</h2>
            <p className="text-xs text-muted-foreground">Sign in to access your snippets</p>
          </div>

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted/60 active:scale-[0.98] transition-all text-sm font-medium"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
              <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground/50">features</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <ul className="space-y-2">
            {[
              "Syntax highlighting for 35+ languages",
              "Version history with one-click restore",
              "Full-text search with regex support",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground/50">
          Free forever · No credit card required
        </p>
      </div>
    </div>
  )
}
