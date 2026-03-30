"use client"

import { useEffect, useState } from "react"

type Theme = "dark" | "light"

const THEME_KEY = "snippet-manager-theme"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null
    const resolved = stored ?? "dark"
    setTheme(resolved)
    document.documentElement.classList.toggle("dark", resolved === "dark")
  }, [])

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark"
    setTheme(next)
    localStorage.setItem(THEME_KEY, next)
    document.documentElement.classList.toggle("dark", next === "dark")
  }

  return { theme, toggleTheme }
}
