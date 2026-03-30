"use client"

import type React from "react"
import { useState } from "react"
import type { Snippet, Language } from "@/lib/types"
import { LANGUAGE_NAMES } from "@/lib/editor-languages"
import { CodeEditor } from "./code-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Save, Clock, AlertCircle, Eye, EyeOff, Tag, Folder, Hash } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface SnippetFormProps {
  snippet?: Snippet
  onSave: (data: Omit<Snippet, "id" | "createdAt" | "updatedAt" | "versions">) => void
  onCancel: () => void
  theme?: "dark" | "light"
}

export function SnippetForm({ snippet, onSave, onCancel, theme = "dark" }: SnippetFormProps) {
  const [title, setTitle] = useState(snippet?.title ?? "")
  const [description, setDescription] = useState(snippet?.description ?? "")
  const [code, setCode] = useState(snippet?.code ?? "")
  const [language, setLanguage] = useState<Language>(snippet?.language ?? "javascript")
  const [category, setCategory] = useState(snippet?.category ?? "")
  const [visibility, setVisibility] = useState<"public" | "private">(snippet?.visibility ?? "private")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>(snippet?.tags ?? [])
  const [showVersions, setShowVersions] = useState(false)
  const [titleError, setTitleError] = useState("")

  const languages = Object.keys(LANGUAGE_NAMES) as Language[]

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => setTags(tags.filter((t) => t !== tag))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setTitleError("Title is required."); return }
    if (!code.trim()) return
    setTitleError("")
    onSave({ title: title.trim(), description: description.trim(), code, language, category: category.trim(), visibility, tags })
  }

  const isValid = title.trim() && code.trim()

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-0">

        {/* Title bar */}
        <div className="px-1 pb-4 border-b border-border">
          <div className="relative">
            <input
              id="title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setTitleError("") }}
              placeholder="Snippet title..."
              className="w-full bg-transparent text-xl font-semibold placeholder:text-muted-foreground/40 outline-none border-none focus:ring-0 py-1"
              autoFocus
            />
            {titleError && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />{titleError}
              </p>
            )}
          </div>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a short description..."
            rows={1}
            className="mt-2 resize-none bg-transparent dark:bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-sm text-muted-foreground placeholder:text-muted-foreground/40"
          />
        </div>

        {/* Body: metadata sidebar + code editor */}
        <div className="flex flex-col sm:flex-row gap-0 mt-4">

          {/* Left metadata panel */}
          <div className="sm:w-52 shrink-0 flex flex-col gap-4 sm:border-r border-border sm:pr-5 pr-0 pb-4 sm:pb-0">

            {/* Language */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Language</p>
              <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                <SelectTrigger className="h-8 text-sm bg-muted/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>{LANGUAGE_NAMES[lang]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Visibility toggle */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Visibility</p>
              <div className="flex rounded-md overflow-hidden border border-border">
                <button
                  type="button"
                  onClick={() => setVisibility("private")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs transition-colors",
                    visibility === "private"
                      ? "bg-secondary text-secondary-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <EyeOff className="h-3 w-3" />
                  Private
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility("public")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs transition-colors border-l border-border",
                    visibility === "public"
                      ? "bg-secondary text-secondary-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Eye className="h-3 w-3" />
                  Public
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</p>
              <div className="relative">
                <Folder className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Utilities"
                  className="h-8 text-sm pl-8 bg-muted/50"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tags</p>
              <div className="relative">
                <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag() } }}
                  placeholder="Add tag, press Enter"
                  className="h-8 text-sm pl-8 bg-muted/50"
                />
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 text-xs h-5 px-1.5">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-destructive">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Version history */}
            {snippet && snippet.versions.length > 0 && (
              <button
                type="button"
                onClick={() => setShowVersions(true)}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mt-auto pt-2 border-t border-border"
              >
                <Clock className="h-3.5 w-3.5" />
                {snippet.versions.length} version{snippet.versions.length !== 1 ? "s" : ""} saved
              </button>
            )}
          </div>

          {/* Right: code editor */}
          <div className="flex-1 sm:pl-5 flex flex-col gap-2 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Code <span className="text-destructive normal-case">*</span>
              </p>
              <Badge variant="outline" className="text-xs h-5">{LANGUAGE_NAMES[language]}</Badge>
            </div>
            <div className="rounded-lg overflow-hidden border border-border">
              <CodeEditor value={code} onChange={setCode} language={language} theme={theme} minHeight="320px" />
            </div>
            {!code.trim() && (
              <p className="text-xs text-muted-foreground/60">Code is required to save.</p>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
          <p className="text-xs text-muted-foreground hidden sm:block">
            {snippet ? "Editing snippet" : "New snippet"} · {code.split("\n").length} line{code.split("\n").length !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-2 ml-auto">
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
            <Button type="submit" size="sm" variant="secondary" className="gap-2" disabled={!isValid}>
              <Save className="h-3.5 w-3.5" />
              {snippet ? "Save Changes" : "Save Snippet"}
            </Button>
          </div>
        </div>
      </form>

      {snippet && (
        <Dialog open={showVersions} onOpenChange={setShowVersions}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Version History</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {snippet.versions.map((version, i) => (
                <div key={version.id} className="space-y-2 border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Version {snippet.versions.length - i} · {new Date(version.timestamp).toLocaleString()}</span>
                    <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => { setCode(version.code); setShowVersions(false) }}>
                      Restore
                    </Button>
                  </div>
                  <CodeEditor value={version.code} onChange={() => {}} language={language} readOnly minHeight="150px" theme={theme} />
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
