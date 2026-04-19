import type { Snippet } from "./types"

const FILE_EXTENSIONS: Record<string, string> = {
  javascript: ".js", typescript: ".ts", python: ".py", java: ".java",
  cpp: ".cpp", c: ".c", csharp: ".cs", go: ".go", rust: ".rs",
  ruby: ".rb", php: ".php", swift: ".swift", kotlin: ".kt", scala: ".scala",
  dart: ".dart", html: ".html", css: ".css", scss: ".scss", json: ".json",
  yaml: ".yaml", xml: ".xml", sql: ".sql", graphql: ".graphql", bash: ".sh",
  shell: ".sh", powershell: ".ps1", markdown: ".md", jsx: ".jsx", tsx: ".tsx",
  vue: ".vue", svelte: ".svelte", r: ".r", perl: ".pl", elixir: ".ex",
  haskell: ".hs", lua: ".lua",
}

export class SnippetStorage {
  static exportGistFromSnippets(
    snippets: Snippet[]
  ): { description: string; public: boolean; files: Record<string, { content: string }> } {
    const files: Record<string, { content: string }> = {}

    snippets.forEach((snippet) => {
      const ext = FILE_EXTENSIONS[snippet.language] ?? ".txt"
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
