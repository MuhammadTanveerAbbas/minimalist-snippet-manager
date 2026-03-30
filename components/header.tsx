"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { KeyboardShortcutsDialog } from "./keyboard-shortcuts-dialog"
import { ExportImportDialog } from "./export-import-dialog"
import { ThemeToggle } from "./theme-toggle"

interface HeaderProps {
  onNewSnippet: () => void
  onExportJSON: () => string
  onImportJSON: (json: string) => { success: boolean; count: number; error?: string }
  onExportGist: () => { description: string; public: boolean; files: Record<string, { content: string }> }
  theme: "dark" | "light"
  onToggleTheme: () => void
}

function Logo() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-label="Snippet Manager logo"
    >
      {/* Rounded square background */}
      <rect width="34" height="34" rx="9" className="fill-foreground" />

      {/* Top-left dot  terminal traffic light feel */}
      <circle cx="8" cy="8.5" r="2" className="fill-background" opacity="0.35" />

      {/* Prompt chevron > */}
      <path
        d="M9 17.5L13.5 21L9 24.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="dark:stroke-background stroke-primary-foreground"
        opacity="0.9"
      />

      {/* Cursor block  blinking via CSS animation */}
      <rect
        x="16"
        y="18"
        width="10"
        height="2.5"
        rx="1"
        className="fill-background logo-cursor"
        opacity="0.75"
      />

      {/* Subtle second line below cursor */}
      <rect
        x="16"
        y="22.5"
        width="6"
        height="2"
        rx="1"
        className="fill-background"
        opacity="0.25"
      />

      <style>{`
        .logo-cursor {
          animation: logoBlink 1.1s step-start infinite;
        }
        @keyframes logoBlink {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 0; }
        }
      `}</style>
    </svg>
  )
}

export function Header({
  onNewSnippet,
  onExportJSON,
  onImportJSON,
  onExportGist,
  theme,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5">
        <div className="flex items-center gap-2 sm:gap-3">
          <Logo />
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold leading-tight">Snippet Manager</h1>
            <p className="text-xs text-muted-foreground">Developer&apos;s Code Library</p>
          </div>
          <h1 className="text-lg font-bold sm:hidden">Snippets</h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <ExportImportDialog
            onExportJSON={onExportJSON}
            onImportJSON={onImportJSON}
            onExportGist={onExportGist}
          />
          <KeyboardShortcutsDialog />
          <Button onClick={onNewSnippet} size="sm" variant="secondary" className="gap-1 sm:gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Snippet</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
