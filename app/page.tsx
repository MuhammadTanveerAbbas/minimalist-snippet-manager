"use client"

import { useState, useRef, useCallback } from "react"
import type { Snippet } from "@/lib/types"
import { useSnippets } from "@/hooks/use-snippets"
import { useTheme } from "@/hooks/use-theme"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { getSnippetCounts } from "@/lib/snippet-stats"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { SnippetList } from "@/components/snippet-list"
import { SnippetForm } from "@/components/snippet-form"
import { SnippetViewer } from "@/components/snippet-viewer"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Code2 } from "lucide-react"

export default function HomePage() {
  const { theme, toggleTheme } = useTheme()

  const {
    snippets,
    allSnippets,
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
  } = useSnippets()

  const [formOpen, setFormOpen] = useState(false)
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null)
  const [viewingSnippet, setViewingSnippet] = useState<Snippet | null>(null)
  const [deletingSnippetId, setDeletingSnippetId] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const snippetCounts = getSnippetCounts(allSnippets)

  const hasFilters =
    !!filters.search ||
    !!filters.language ||
    !!filters.category ||
    (filters.tags && filters.tags.length > 0) ||
    !!filters.visibility

  const handleNewSnippet = useCallback(() => {
    setEditingSnippet(null)
    setFormOpen(true)
  }, [])

  const handleEditSnippet = useCallback((snippet: Snippet) => {
    setEditingSnippet(snippet)
    setViewingSnippet(null)
    setFormOpen(true)
  }, [])

  const handleSaveSnippet = useCallback(
    (data: Omit<Snippet, "id" | "createdAt" | "updatedAt" | "versions">) => {
      if (editingSnippet) {
        updateSnippet(editingSnippet.id, data)
      } else {
        createSnippet(data)
      }
      setFormOpen(false)
      setEditingSnippet(null)
    },
    [editingSnippet, updateSnippet, createSnippet]
  )

  const handleDeleteSnippet = useCallback(
    (id: string) => {
      deleteSnippet(id)
      setDeletingSnippetId(null)
      setViewingSnippet(null)
    },
    [deleteSnippet]
  )

  const handleDuplicateSnippet = useCallback(
    (id: string) => {
      duplicateSnippet(id)
      setViewingSnippet(null)
    },
    [duplicateSnippet]
  )

  useKeyboardShortcuts([
    {
      key: "n",
      ctrl: true,
      description: "Create new snippet",
      handler: handleNewSnippet,
    },
    {
      key: "k",
      ctrl: true,
      description: "Focus search",
      handler: () => searchInputRef.current?.focus(),
    },
    {
      key: "/",
      description: "Focus search",
      handler: () => searchInputRef.current?.focus(),
    },
    {
      key: "Escape",
      description: "Close dialogs",
      handler: () => {
        setFormOpen(false)
        setViewingSnippet(null)
        setDeletingSnippetId(null)
      },
    },
  ])

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center mx-auto">
            <Code2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Loading your snippets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        onNewSnippet={handleNewSnippet}
        onExportJSON={exportJSON}
        onImportJSON={importJSON}
        onExportGist={exportGist}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          allTags={allTags}
          allCategories={allCategories}
          filters={filters}
          onFiltersChange={setFilters}
          snippetCounts={snippetCounts}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-20 sm:pb-6 space-y-5">
            <SearchBar
              filters={filters}
              onFiltersChange={setFilters}
              allTags={allTags}
              allCategories={allCategories}
              searchInputRef={searchInputRef}
            />

            <p className="text-xs text-muted-foreground">
              {snippets.length} snippet{snippets.length !== 1 ? "s" : ""}
              {hasFilters ? " matching filters" : ""}
            </p>

            <SnippetList
              snippets={snippets}
              onEdit={handleEditSnippet}
              onDelete={(id) => setDeletingSnippetId(id)}
              onDuplicate={handleDuplicateSnippet}
              onView={(snippet) => setViewingSnippet(snippet)}
              hasFilters={hasFilters}
            />
          </div>

        </main>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="w-full max-w-4xl max-h-dvh sm:max-h-[92vh] overflow-y-auto sm:rounded-lg rounded-none sm:m-4 m-0">
          <VisuallyHidden.Root>
            <DialogTitle>{editingSnippet ? "Edit Snippet" : "New Snippet"}</DialogTitle>
          </VisuallyHidden.Root>
          <SnippetForm
            snippet={editingSnippet ?? undefined}
            onSave={handleSaveSnippet}
            onCancel={() => { setFormOpen(false); setEditingSnippet(null) }}
            theme={theme}
          />
        </DialogContent>
      </Dialog>

      <SnippetViewer
        snippet={viewingSnippet}
        open={!!viewingSnippet}
        onOpenChange={(open) => { if (!open) setViewingSnippet(null) }}
        onEdit={() => viewingSnippet && handleEditSnippet(viewingSnippet)}
        onDelete={() => viewingSnippet && setDeletingSnippetId(viewingSnippet.id)}
        onDuplicate={() => viewingSnippet && handleDuplicateSnippet(viewingSnippet.id)}
        theme={theme}
      />

      <AlertDialog open={!!deletingSnippetId} onOpenChange={(open) => { if (!open) setDeletingSnippetId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Snippet</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the snippet and all its version history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingSnippetId && handleDeleteSnippet(deletingSnippetId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
