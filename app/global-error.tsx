'use client'

import './globals.css'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4 max-w-sm">
            <h1 className="text-lg font-semibold">Critical error</h1>
            <p className="text-sm text-muted-foreground">
              A critical error occurred. Please refresh the page.
            </p>
            <button
              onClick={() => reset()}
              className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
