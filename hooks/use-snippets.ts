"use client"

import { useState, useEffect, useCallback } from "react"
import type { Snippet, SnippetFilters, SnippetVersion } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { filterSnippets, getAllTags, getAllCategories } from "@/lib/search"
import { SnippetStorage } from "@/lib/storage"

const VERSION_LIMIT = 10
const supabase = createClient()

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [filters, setFilters] = useState<SnippetFilters>({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    let mounted = true

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      if (mounted) {
        setSnippets((data ?? []).map(dbToSnippet))
        setIsLoaded(true)
      }
    }

    load().catch(console.error)
    return () => { mounted = false }
  }, [])

  const filteredSnippets = filterSnippets(snippets, filters)
  const allTags = getAllTags(snippets)
  const allCategories = getAllCategories(snippets)

  const createSnippet = useCallback(
    async (data: Omit<Snippet, "id" | "createdAt" | "updatedAt" | "versions">) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data: row, error } = await supabase
        .from("snippets")
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          code: data.code,
          language: data.language,
          tags: data.tags,
          category: data.category,
          visibility: data.visibility,
          versions: [],
        })
        .select()
        .single()

      if (error) throw error
      const snippet = dbToSnippet(row)
      setSnippets((prev) => [snippet, ...prev])
      return snippet
    },
    []
  )

  const updateSnippet = useCallback(
    async (id: string, updates: Partial<Snippet>, saveVersion = true) => {
      const existing = snippets.find((s) => s.id === id)
      if (!existing) return null

      let versions = existing.versions
      if (saveVersion && updates.code && updates.code !== existing.code) {
        const newVersion: SnippetVersion = {
          id: crypto.randomUUID(),
          code: existing.code,
          timestamp: new Date().toISOString(),
        }
        versions = [newVersion, ...versions].slice(0, VERSION_LIMIT)
      }

      const { data: row, error } = await supabase
        .from("snippets")
        .update({
          ...(updates.title !== undefined && { title: updates.title }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.code !== undefined && { code: updates.code }),
          ...(updates.language !== undefined && { language: updates.language }),
          ...(updates.tags !== undefined && { tags: updates.tags }),
          ...(updates.category !== undefined && { category: updates.category }),
          ...(updates.visibility !== undefined && { visibility: updates.visibility }),
          versions,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      const snippet = dbToSnippet(row)
      setSnippets((prev) => prev.map((s) => (s.id === id ? snippet : s)))
      return snippet
    },
    [snippets]
  )

  const deleteSnippet = useCallback(async (id: string) => {
    const { error } = await supabase.from("snippets").delete().eq("id", id)
    if (error) throw error
    setSnippets((prev) => prev.filter((s) => s.id !== id))
    return true
  }, [])

  const duplicateSnippet = useCallback(
    async (id: string) => {
      const original = snippets.find((s) => s.id === id)
      if (!original) return null
      return createSnippet({
        title: `${original.title} (copy)`,
        description: original.description,
        code: original.code,
        language: original.language,
        tags: [...original.tags],
        category: original.category,
        visibility: original.visibility,
      })
    },
    [snippets, createSnippet]
  )

  const exportJSON = useCallback(() => JSON.stringify(snippets, null, 2), [snippets])

  const importJSON = useCallback(
    async (json: string) => {
      try {
        const parsed = JSON.parse(json)
        if (!Array.isArray(parsed)) {
          return { success: false, count: 0, error: "Invalid format: expected a JSON array." }
        }
        const valid = parsed.filter(isValidSnippet)
        if (valid.length === 0) {
          return { success: false, count: 0, error: "No valid snippets found." }
        }

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { success: false, count: 0, error: "Not authenticated." }

        const existingIds = new Set(snippets.map((s) => s.id))
        const rows = valid.map((s) => ({
          id: existingIds.has(s.id) ? crypto.randomUUID() : s.id,
          user_id: user.id,
          title: s.title,
          description: s.description ?? "",
          code: s.code,
          language: s.language,
          tags: s.tags ?? [],
          category: s.category ?? "",
          visibility: s.visibility ?? "private",
          versions: s.versions ?? [],
          created_at: s.createdAt ?? new Date().toISOString(),
          updated_at: s.updatedAt ?? new Date().toISOString(),
        }))

        const { data, error } = await supabase.from("snippets").insert(rows).select()
        if (error) return { success: false, count: 0, error: error.message }

        setSnippets((prev) => [...(data ?? []).map(dbToSnippet), ...prev])
        return { success: true, count: rows.length }
      } catch (err) {
        return { success: false, count: 0, error: (err as Error).message }
      }
    },
    [snippets]
  )

  const exportGist = useCallback(
    () => SnippetStorage.exportGistFromSnippets(snippets),
    [snippets]
  )

  return {
    snippets: filteredSnippets,
    allSnippets: snippets,
    filters,
    setFilters,
    allTags,
    allCategories,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    duplicateSnippet,
    exportJSON,
    importJSON,
    exportGist,
    isLoaded,
  }
}

function dbToSnippet(row: Record<string, unknown>): Snippet {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) ?? "",
    code: row.code as string,
    language: row.language as Snippet["language"],
    tags: (row.tags as string[]) ?? [],
    category: (row.category as string) ?? "",
    visibility: (row.visibility as "public" | "private") ?? "private",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    versions: (row.versions as SnippetVersion[]) ?? [],
  }
}

function isValidSnippet(obj: unknown): obj is Snippet {
  if (typeof obj !== "object" || obj === null) return false
  const s = obj as Record<string, unknown>
  return (
    typeof s.title === "string" &&
    typeof s.code === "string" &&
    typeof s.language === "string" &&
    Array.isArray(s.tags) &&
    typeof s.visibility === "string"
  )
}
