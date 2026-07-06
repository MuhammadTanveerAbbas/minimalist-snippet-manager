"use client"

import type { Snippet } from "@/lib/types"
import { LANGUAGE_NAMES } from "@/lib/editor-languages"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye, EyeOff, Copy } from "lucide-react"

interface SnippetCardProps {
  snippet: Snippet
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
  onClick: () => void
}

export function SnippetCard({ snippet, onEdit, onDelete, onDuplicate, onClick }: SnippetCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col gap-3 p-4 rounded-xl border border-border bg-card hover:border-foreground/20 hover:shadow-md transition-all cursor-pointer"
    >
      {/* Action buttons */}
      <div
        className="absolute top-3 right-3 flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <Button size="icon" variant="ghost" className="h-10 w-10 sm:h-8 sm:w-8" onClick={onDuplicate} title="Duplicate">
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button size="icon" variant="ghost" className="h-10 w-10 sm:h-8 sm:w-8" onClick={onEdit} title="Edit">
          <Edit className="h-3.5 w-3.5" />
        </Button>
        <Button size="icon" variant="ghost" className="h-10 w-10 sm:h-8 sm:w-8 hover:text-destructive" onClick={onDelete} title="Delete">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Top: language + visibility */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
          {LANGUAGE_NAMES[snippet.language]}
        </span>
        <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground/60">
          {snippet.visibility === "public"
            ? <Eye className="h-3 w-3" />
            : <EyeOff className="h-3 w-3" />
          }
        </span>
      </div>

      {/* Title + description */}
      <div className="space-y-1 pr-16">
        <p className="text-sm font-semibold leading-snug line-clamp-1">{snippet.title}</p>
        {snippet.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{snippet.description}</p>
        )}
      </div>

      {/* Tags */}
      {(snippet.tags.length > 0 || snippet.category) && (
        <div className="flex flex-wrap gap-1">
          {snippet.category && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              {snippet.category}
            </span>
          )}
          {snippet.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground">
              #{tag}
            </span>
          ))}
          {snippet.tags.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground">
              +{snippet.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground/50 pt-1 border-t border-border/50">
        <span>{new Date(snippet.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
        {snippet.versions.length > 0 && (
          <span className="ml-auto">{snippet.versions.length} version{snippet.versions.length !== 1 ? "s" : ""}</span>
        )}
      </div>
    </div>
  )
}
