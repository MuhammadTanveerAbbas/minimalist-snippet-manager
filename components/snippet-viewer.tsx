"use client"

import type { Snippet } from "@/lib/types"
import { LANGUAGE_NAMES } from "@/lib/editor-languages"
import { CodeEditor } from "./code-editor"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, EyeOff, Calendar, Edit, Trash2, Copy } from "lucide-react"

interface SnippetViewerProps {
  snippet: Snippet | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
  theme?: "dark" | "light"
}

export function SnippetViewer({
  snippet,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onDuplicate,
  theme = "dark",
}: SnippetViewerProps) {
  if (!snippet) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl max-h-dvh sm:max-h-[90vh] overflow-y-auto sm:rounded-lg rounded-none sm:m-4 m-0">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl">{snippet.title}</DialogTitle>
              {snippet.description && (
                <DialogDescription className="mt-1">{snippet.description}</DialogDescription>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <Button size="sm" variant="outline" onClick={onDuplicate}>
                <Copy className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Duplicate</span>
              </Button>
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button size="sm" variant="outline" onClick={onDelete} className="hover:text-destructive hover:border-destructive">
                <Trash2 className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{LANGUAGE_NAMES[snippet.language]}</Badge>
            {snippet.category && <Badge variant="secondary">{snippet.category}</Badge>}
            {snippet.visibility === "public" ? (
              <Badge variant="default" className="gap-1">
                <Eye className="h-3 w-3" />
                Public
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <EyeOff className="h-3 w-3" />
                Private
              </Badge>
            )}
            {snippet.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Created {new Date(snippet.createdAt).toLocaleString()}
            </div>
            <div>Updated {new Date(snippet.updatedAt).toLocaleString()}</div>
            {snippet.versions.length > 0 && (
              <div>{snippet.versions.length} version{snippet.versions.length !== 1 ? "s" : ""}</div>
            )}
          </div>

          <CodeEditor
            value={snippet.code}
            onChange={() => {}}
            language={snippet.language}
            readOnly
            minHeight="400px"
            theme={theme}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
