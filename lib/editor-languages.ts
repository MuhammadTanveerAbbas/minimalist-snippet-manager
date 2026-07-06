import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { java } from "@codemirror/lang-java"
import { cpp } from "@codemirror/lang-cpp"
import { rust } from "@codemirror/lang-rust"
import { go } from "@codemirror/lang-go"
import { php } from "@codemirror/lang-php"
import { sql } from "@codemirror/lang-sql"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { json } from "@codemirror/lang-json"
import { xml } from "@codemirror/lang-xml"
import { markdown } from "@codemirror/lang-markdown"
import { sass } from "@codemirror/lang-sass"
import type { LanguageSupport } from "@codemirror/language"
import type { Language } from "./types"

export function getLanguageExtension(language: Language): LanguageSupport | null {
  switch (language) {
    case "javascript":
    case "jsx":
      return javascript({ jsx: true })
    case "typescript":
    case "tsx":
      return javascript({ jsx: true, typescript: true })
    case "python":
      return python()
    case "java":
      return java()
    case "cpp":
    case "c":
      return cpp()
    case "rust":
      return rust()
    case "go":
      return go()
    case "php":
      return php()
    case "sql":
      return sql()
    case "html":
      return html()
    case "css":
      return css()
    case "scss":
      return sass()
    case "json":
      return json()
    case "xml":
      return xml()
    case "markdown":
      return markdown()
    default:
      return null
  }
}

export const LANGUAGE_NAMES: Record<Language, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
  cpp: "C++",
  c: "C",
  csharp: "C#",
  go: "Go",
  rust: "Rust",
  ruby: "Ruby",
  php: "PHP",
  swift: "Swift",
  kotlin: "Kotlin",
  scala: "Scala",
  dart: "Dart",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  json: "JSON",
  yaml: "YAML",
  xml: "XML",
  sql: "SQL",
  graphql: "GraphQL",
  bash: "Bash",
  shell: "Shell",
  powershell: "PowerShell",
  markdown: "Markdown",
  jsx: "JSX",
  tsx: "TSX",
  vue: "Vue",
  svelte: "Svelte",
  r: "R",
  perl: "Perl",
  elixir: "Elixir",
  haskell: "Haskell",
  lua: "Lua",
}

export const LANGUAGE_COUNT = Object.keys(LANGUAGE_NAMES).length
