"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { LANGUAGE_NAMES } from "@/lib/editor-languages"
import type { SnippetFilters, Language } from "@/lib/types"

interface SearchBarProps {
  filters: SnippetFilters
  onFiltersChange: (filters: SnippetFilters) => void
  allTags: string[]
  allCategories: string[]
  searchInputRef?: React.RefObject<HTMLInputElement | null>
}

export function SearchBar({ filters, onFiltersChange, allTags, allCategories, searchInputRef }: SearchBarProps) {
  const [localSearch, setLocalSearch] = useState(filters.search ?? "")

  useEffect(() => {
    if (!filters.search) setLocalSearch("")
  }, [filters.search])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setLocalSearch(val)
    onFiltersChange({ ...filters, search: val || undefined })
  }

  const clearFilters = () => {
    setLocalSearch("")
    onFiltersChange({})
  }

  const hasActiveFilters =
    !!filters.search ||
    !!filters.language ||
    !!filters.category ||
    (filters.tags && filters.tags.length > 0) ||
    !!filters.visibility

  const languages = Object.keys(LANGUAGE_NAMES) as Language[]

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={searchInputRef}
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="Search snippets..."
            className="pl-9 pr-9 bg-muted/40 border-border/60 focus:bg-background"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => { setLocalSearch(""); onFiltersChange({ ...filters, search: undefined }) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className={cn("shrink-0 bg-muted/40 border-border/60", hasActiveFilters && "border-foreground/30 bg-secondary")}>
              <Filter className="h-4 w-4" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-foreground" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="end">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Language</Label>
                <Select
                  value={filters.language ?? "all"}
                  onValueChange={(v) =>
                    onFiltersChange({ ...filters, language: v === "all" ? undefined : (v as Language) })
                  }
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    <SelectItem value="all">All Languages</SelectItem>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>{LANGUAGE_NAMES[lang]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {allCategories.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Category</Label>
                  <Select
                    value={filters.category ?? "all"}
                    onValueChange={(v) =>
                      onFiltersChange({ ...filters, category: v === "all" ? undefined : v })
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {allCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Visibility</Label>
                <Select
                  value={filters.visibility ?? "all"}
                  onValueChange={(v) =>
                    onFiltersChange({
                      ...filters,
                      visibility: v === "all" ? undefined : (v as "public" | "private"),
                    })
                  }
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {allTags.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Tags</Label>
                  <div className="max-h-28 overflow-y-auto space-y-1.5">
                    {allTags.map((tag) => (
                      <div key={tag} className="flex items-center gap-2">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={filters.tags?.includes(tag) ?? false}
                          onCheckedChange={(checked) => {
                            const current = filters.tags ?? []
                            const next = checked ? [...current, tag] : current.filter((t) => t !== tag)
                            onFiltersChange({ ...filters, tags: next.length > 0 ? next : undefined })
                          }}
                        />
                        <Label htmlFor={`tag-${tag}`} className="cursor-pointer text-sm font-normal">{tag}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Checkbox
                  id="regex"
                  checked={filters.useRegex ?? false}
                  onCheckedChange={(checked) =>
                    onFiltersChange({ ...filters, useRegex: checked as boolean })
                  }
                />
                <Label htmlFor="regex" className="cursor-pointer text-sm font-normal">Use Regular Expression</Label>
              </div>

              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="w-full gap-2 bg-transparent h-8 text-sm">
                  <X className="h-3.5 w-3.5" />
                  Clear All Filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5">
          {filters.search && (
            <Badge variant="secondary" className="gap-1 text-xs">
              &ldquo;{filters.search}&rdquo;
              <button onClick={() => { setLocalSearch(""); onFiltersChange({ ...filters, search: undefined }) }} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.language && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {LANGUAGE_NAMES[filters.language]}
              <button onClick={() => onFiltersChange({ ...filters, language: undefined })} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {filters.category}
              <button onClick={() => onFiltersChange({ ...filters, category: undefined })} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.visibility && (
            <Badge variant="secondary" className="gap-1 text-xs capitalize">
              {filters.visibility}
              <button onClick={() => onFiltersChange({ ...filters, visibility: undefined })} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 text-xs">
              #{tag}
              <button
                onClick={() => {
                  const current = filters.tags ?? []
                  const next = current.filter((t) => t !== tag)
                  onFiltersChange({ ...filters, tags: next.length > 0 ? next : undefined })
                }}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
