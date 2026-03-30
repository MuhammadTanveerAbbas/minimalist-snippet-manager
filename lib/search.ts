import type { Snippet, SnippetFilters } from "./types"

export function filterSnippets(snippets: Snippet[], filters: SnippetFilters): Snippet[] {
  return snippets.filter((snippet) => {
    if (filters.search) {
      const term = filters.search

      if (filters.useRegex) {
        try {
          const regex = new RegExp(term, "i")
          const matches =
            regex.test(snippet.title) ||
            regex.test(snippet.description) ||
            regex.test(snippet.code) ||
            snippet.tags.some((tag) => regex.test(tag))
          if (!matches) return false
        } catch {
          // Invalid regex  fall back to plain text search
          const lower = term.toLowerCase()
          const matches =
            snippet.title.toLowerCase().includes(lower) ||
            snippet.description.toLowerCase().includes(lower) ||
            snippet.code.toLowerCase().includes(lower) ||
            snippet.tags.some((tag) => tag.toLowerCase().includes(lower))
          if (!matches) return false
        }
      } else {
        const lower = term.toLowerCase()
        const matches =
          snippet.title.toLowerCase().includes(lower) ||
          snippet.description.toLowerCase().includes(lower) ||
          snippet.code.toLowerCase().includes(lower) ||
          snippet.tags.some((tag) => tag.toLowerCase().includes(lower))
        if (!matches) return false
      }
    }

    if (filters.language && snippet.language !== filters.language) return false

    if (filters.tags && filters.tags.length > 0) {
      const hasAll = filters.tags.every((tag) =>
        snippet.tags.some((st) => st.toLowerCase() === tag.toLowerCase())
      )
      if (!hasAll) return false
    }

    if (filters.category && snippet.category !== filters.category) return false

    if (filters.visibility && snippet.visibility !== filters.visibility) return false

    return true
  })
}

export function getAllTags(snippets: Snippet[]): string[] {
  const tags = new Set<string>()
  snippets.forEach((s) => s.tags.forEach((t) => tags.add(t)))
  return Array.from(tags).sort()
}

export function getAllCategories(snippets: Snippet[]): string[] {
  const categories = new Set<string>()
  snippets.forEach((s) => {
    if (s.category) categories.add(s.category)
  })
  return Array.from(categories).sort()
}
