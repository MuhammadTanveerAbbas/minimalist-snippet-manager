"use client"

import { useCallback, useSyncExternalStore } from "react"

type Theme = "dark" | "light"

const THEME_KEY = "snippet-manager-theme"
const THEME_EVENT = "snippet-manager-theme-change"

function getThemeSnapshot(): Theme {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null
  return stored ?? "dark"
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(THEME_EVENT, onStoreChange)
  return () => window.removeEventListener(THEME_EVENT, onStoreChange)
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, () => "dark" as Theme)

  const toggleTheme = useCallback(() => {
    const next: Theme = getThemeSnapshot() === "dark" ? "light" : "dark"
    localStorage.setItem(THEME_KEY, next)
    document.documentElement.classList.toggle("dark", next === "dark")
    window.dispatchEvent(new Event(THEME_EVENT))
  }, [])

  return { theme, toggleTheme }
}
