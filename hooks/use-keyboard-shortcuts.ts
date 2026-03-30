"use client"

import { useEffect } from "react"

interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  description: string
  handler: () => void
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip when typing inside an input, textarea, or contenteditable
      const target = e.target as HTMLElement
      const isEditing =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl === undefined || shortcut.ctrl === (e.ctrlKey || e.metaKey)
        const shiftMatch = shortcut.shift === undefined || shortcut.shift === e.shiftKey
        const altMatch = shortcut.alt === undefined || shortcut.alt === e.altKey
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          // Allow Escape to fire even inside inputs
          if (isEditing && shortcut.key.toLowerCase() !== "escape") continue
          e.preventDefault()
          shortcut.handler()
          break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [shortcuts])
}

export const KEYBOARD_SHORTCUTS = [
  { key: "n", ctrl: true, shift: false, alt: false, description: "Create new snippet" },
  { key: "k", ctrl: true, shift: false, alt: false, description: "Focus search" },
  { key: "/", ctrl: false, shift: false, alt: false, description: "Focus search (alternative)" },
  { key: "Escape", ctrl: false, shift: false, alt: false, description: "Close dialogs" },
]
