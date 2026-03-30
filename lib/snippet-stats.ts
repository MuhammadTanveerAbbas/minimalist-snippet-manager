import type { Snippet } from "./types"

export function getSnippetCounts(snippets: Snippet[]) {
  const byLanguage: Record<string, number> = {}
  const byCategory: Record<string, number> = {}
  const byTag: Record<string, number> = {}
  let publicCount = 0
  let privateCount = 0

  snippets.forEach((snippet) => {
    // Count by language
    byLanguage[snippet.language] = (byLanguage[snippet.language] || 0) + 1

    // Count by category
    if (snippet.category) {
      byCategory[snippet.category] = (byCategory[snippet.category] || 0) + 1
    }

    // Count by tags
    snippet.tags.forEach((tag) => {
      byTag[tag] = (byTag[tag] || 0) + 1
    })

    // Count by visibility
    if (snippet.visibility === "public") {
      publicCount++
    } else {
      privateCount++
    }
  })

  return {
    total: snippets.length,
    public: publicCount,
    private: privateCount,
    byLanguage,
    byCategory,
    byTag,
  }
}
