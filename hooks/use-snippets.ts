"use client"

import { useState, useEffect, useCallback } from "react"
import type { Snippet, SnippetFilters } from "@/lib/types"
import { SnippetStorage } from "@/lib/storage"
import { filterSnippets, getAllTags, getAllCategories } from "@/lib/search"

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [filters, setFilters] = useState<SnippetFilters>({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setSnippets(SnippetStorage.getAll())
    setIsLoaded(true)
  }, [])

  const filteredSnippets = filterSnippets(snippets, filters)
  const allTags = getAllTags(snippets)
  const allCategories = getAllCategories(snippets)

  const createSnippet = useCallback(
    (data: Omit<Snippet, "id" | "createdAt" | "updatedAt" | "versions">) => {
      const created = SnippetStorage.create(data)
      setSnippets((prev) => [...prev, created])
      return created
    },
    []
  )

  const updateSnippet = useCallback((id: string, updates: Partial<Snippet>, saveVersion = true) => {
    const updated = SnippetStorage.update(id, updates, saveVersion)
    if (updated) {
      setSnippets((prev) => prev.map((s) => (s.id === id ? updated : s)))
    }
    return updated
  }, [])

  const deleteSnippet = useCallback((id: string) => {
    const success = SnippetStorage.delete(id)
    if (success) {
      setSnippets((prev) => prev.filter((s) => s.id !== id))
    }
    return success
  }, [])

  const duplicateSnippet = useCallback((id: string) => {
    const original = SnippetStorage.getById(id)
    if (!original) return null
    const copy = SnippetStorage.create({
      title: `${original.title} (copy)`,
      description: original.description,
      code: original.code,
      language: original.language,
      tags: [...original.tags],
      category: original.category,
      visibility: original.visibility,
    })
    setSnippets((prev) => [...prev, copy])
    return copy
  }, [])

  const exportJSON = useCallback(() => SnippetStorage.exportJSON(), [])

  const importJSON = useCallback((json: string) => {
    const result = SnippetStorage.importJSON(json)
    if (result.success) {
      setSnippets(SnippetStorage.getAll())
    }
    return result
  }, [])

  const exportGist = useCallback(() => SnippetStorage.exportGist(), [])

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
