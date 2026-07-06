"use client"

import { useEffect } from "react"

const THEME_KEY = "snippet-manager-theme"

export function ThemeInit() {
  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as "dark" | "light" | null
    document.documentElement.classList.toggle("dark", (stored ?? "dark") === "dark")
  }, [])

  return null
}
