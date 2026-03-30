"use client"

import type { Snippet } from "@/lib/types"
import { SnippetCard } from "./snippet-card"
import { FileCode } from "lucide-react"

interface SnippetListProps {
  snippets: Snippet[]
  onEdit: (snippet: Snippet) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onView: (snippet: Snippet) => void
  hasFilters: boolean
}

export function SnippetList({ snippets, onEdit, onDelete, onDuplicate, onView, hasFilters }: SnippetListProps) {
  if (snippets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileCode className="h-14 w-14 text-muted-foreground mb-4 opacity-40" />
        <h3 className="text-lg font-semibold mb-1">
          {hasFilters ? "No matching snippets" : "No snippets yet"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {hasFilters
            ? "Try adjusting your search or filters."
            : "Create your first snippet to get started."}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          snippet={snippet}
          onEdit={() => onEdit(snippet)}
          onDelete={() => onDelete(snippet.id)}
          onDuplicate={() => onDuplicate(snippet.id)}
          onClick={() => onView(snippet)}
        />
      ))}
    </div>
  )
}
