"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const handleGoogleSignIn = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm p-0 overflow-hidden border-border bg-card gap-0">
        {/* Top accent bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="flex flex-col items-center gap-6 px-8 py-8">
          {/* Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted border border-border">
            <svg width="22" height="22" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="34" height="34" rx="9" className="fill-foreground" />
              <path
                d="M9 17.5L13.5 21L9 24.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dark:stroke-background stroke-primary-foreground"
                opacity="0.9"
              />
              <rect x="16" y="18" width="10" height="2.5" rx="1" className="fill-background" opacity="0.75" />
              <rect x="16" y="22.5" width="6" height="2" rx="1" className="fill-background" opacity="0.25" />
            </svg>
          </div>

          {/* Text */}
          <div className="text-center space-y-1.5">
            <h2 className="text-lg font-semibold tracking-tight">Sign in to continue</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create an account to save and manage<br />your code snippets across devices.
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogleSignIn}
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

          <p className="text-xs text-muted-foreground/60 text-center">
            Free forever · No credit card required
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
