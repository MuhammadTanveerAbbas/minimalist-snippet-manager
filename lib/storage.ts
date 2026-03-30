import type { Snippet, SnippetVersion } from "./types"

const STORAGE_KEY = "snippet-manager-data"
const VERSION_LIMIT = 10

const FILE_EXTENSIONS: Record<string, string> = {
  javascript: ".js",
  typescript: ".ts",
  python: ".py",
  java: ".java",
  cpp: ".cpp",
  c: ".c",
  csharp: ".cs",
  go: ".go",
  rust: ".rs",
  ruby: ".rb",
  php: ".php",
  swift: ".swift",
  kotlin: ".kt",
  scala: ".scala",
  dart: ".dart",
  html: ".html",
  css: ".css",
  scss: ".scss",
  json: ".json",
  yaml: ".yaml",
  xml: ".xml",
  sql: ".sql",
  graphql: ".graphql",
  bash: ".sh",
  shell: ".sh",
  powershell: ".ps1",
  markdown: ".md",
  jsx: ".jsx",
  tsx: ".tsx",
  vue: ".vue",
  svelte: ".svelte",
  r: ".r",
  perl: ".pl",
  elixir: ".ex",
  haskell: ".hs",
  lua: ".lua",
}

function getFileExtension(language: string): string {
  return FILE_EXTENSIONS[language] ?? ".txt"
}

function isValidSnippet(obj: unknown): obj is Snippet {
  if (typeof obj !== "object" || obj === null) return false
  const s = obj as Record<string, unknown>
  return (
    typeof s.id === "string" &&
    typeof s.title === "string" &&
    typeof s.code === "string" &&
    typeof s.language === "string" &&
    Array.isArray(s.tags) &&
    typeof s.visibility === "string"
  )
}

export class SnippetStorage {
  static getAll(): Snippet[] {
    if (typeof window === "undefined") return []
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return []
      const parsed = JSON.parse(data)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  static save(snippets: Snippet[]): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets))
    } catch (err) {
      console.error("Failed to persist snippets:", err)
    }
  }

  static create(snippet: Omit<Snippet, "id" | "createdAt" | "updatedAt" | "versions">): Snippet {
    const snippets = this.getAll()
    const newSnippet: Snippet = {
      ...snippet,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versions: [],
    }
    snippets.push(newSnippet)
    this.save(snippets)
    return newSnippet
  }

  static update(id: string, updates: Partial<Snippet>, saveVersion = true): Snippet | null {
    const snippets = this.getAll()
    const index = snippets.findIndex((s) => s.id === id)
    if (index === -1) return null

    const snippet = snippets[index]

    if (saveVersion && updates.code && updates.code !== snippet.code) {
      const version: SnippetVersion = {
        id: crypto.randomUUID(),
        code: snippet.code,
        timestamp: new Date().toISOString(),
      }
      snippet.versions = [version, ...snippet.versions].slice(0, VERSION_LIMIT)
    }

    snippets[index] = {
      ...snippet,
      ...updates,
      versions: snippet.versions,
      updatedAt: new Date().toISOString(),
    }
    this.save(snippets)
    return snippets[index]
  }

  static delete(id: string): boolean {
    const snippets = this.getAll()
    const filtered = snippets.filter((s) => s.id !== id)
    if (filtered.length === snippets.length) return false
    this.save(filtered)
    return true
  }

  static getById(id: string): Snippet | null {
    return this.getAll().find((s) => s.id === id) ?? null
  }

  static exportJSON(): string {
    return JSON.stringify(this.getAll(), null, 2)
  }

  static importJSON(json: string): { success: boolean; count: number; error?: string } {
    try {
      const parsed = JSON.parse(json)
      if (!Array.isArray(parsed)) {
        return { success: false, count: 0, error: "Invalid format: expected a JSON array of snippets." }
      }

      const valid = parsed.filter(isValidSnippet)
      if (valid.length === 0) {
        return { success: false, count: 0, error: "No valid snippets found in the provided JSON." }
      }

      const existing = this.getAll()
      const existingIds = new Set(existing.map((s) => s.id))

      // Assign new IDs to duplicates to avoid collisions
      const toImport = valid.map((s) => {
        if (existingIds.has(s.id)) {
          return { ...s, id: crypto.randomUUID() }
        }
        return s
      })

      this.save([...existing, ...toImport])
      return { success: true, count: toImport.length }
    } catch (err) {
      return { success: false, count: 0, error: (err as Error).message }
    }
  }

  static exportGist(): { description: string; public: boolean; files: Record<string, { content: string }> } {
    const snippets = this.getAll()
    const files: Record<string, { content: string }> = {}

    snippets.forEach((snippet) => {
      const ext = getFileExtension(snippet.language)
      const safeName = snippet.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()
      const filename = `${safeName}${ext}`
      const header = [
        `// ${snippet.title}`,
        snippet.description ? `// ${snippet.description}` : null,
        snippet.tags.length > 0 ? `// Tags: ${snippet.tags.join(", ")}` : null,
        "",
      ]
        .filter((line) => line !== null)
        .join("\n")

      files[filename] = { content: `${header}${snippet.code}` }
    })

    return {
      description: "Code snippets export  Snippet Manager",
      public: false,
      files,
    }
  }
}
