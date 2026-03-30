export type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "cpp"
  | "c"
  | "csharp"
  | "go"
  | "rust"
  | "ruby"
  | "php"
  | "swift"
  | "kotlin"
  | "scala"
  | "dart"
  | "html"
  | "css"
  | "scss"
  | "json"
  | "yaml"
  | "xml"
  | "sql"
  | "graphql"
  | "bash"
  | "shell"
  | "powershell"
  | "markdown"
  | "jsx"
  | "tsx"
  | "vue"
  | "svelte"
  | "r"
  | "perl"
  | "elixir"
  | "haskell"
  | "lua"

export interface Snippet {
  id: string
  title: string
  description: string
  code: string
  language: Language
  tags: string[]
  category: string
  visibility: "public" | "private"
  createdAt: string
  updatedAt: string
  versions: SnippetVersion[]
}

export interface SnippetVersion {
  id: string
  code: string
  timestamp: string
  message?: string
}

export interface SnippetFilters {
  search?: string
  language?: Language
  tags?: string[]
  category?: string
  visibility?: "public" | "private"
  useRegex?: boolean
}
