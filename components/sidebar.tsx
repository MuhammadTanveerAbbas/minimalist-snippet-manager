"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChevronDown, Tag, Folder, LayoutGrid, Eye, EyeOff, Menu, Code2 } from "lucide-react"
import type { Language, SnippetFilters } from "@/lib/types"
import { LANGUAGE_NAMES } from "@/lib/editor-languages"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface SnippetCounts {
  total: number
  public: number
  private: number
  byLanguage: Record<string, number>
  byCategory: Record<string, number>
  byTag: Record<string, number>
}

interface SidebarProps {
  allTags: string[]
  allCategories: string[]
  filters: SnippetFilters
  onFiltersChange: (filters: SnippetFilters) => void
  snippetCounts: SnippetCounts
}

function NavItem({
  icon: Icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: React.ElementType
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-sm transition-colors group",
        active
          ? "bg-secondary text-secondary-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      <span className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        {label}
      </span>
      <span className={cn(
        "text-xs tabular-nums px-1.5 py-0.5 rounded",
        active ? "bg-background/40 text-secondary-foreground" : "text-muted-foreground"
      )}>
        {count}
      </span>
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-2.5 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
      {children}
    </p>
  )
}

function SidebarInner({ allTags, allCategories, filters, onFiltersChange, snippetCounts }: SidebarProps) {
  const [languagesOpen, setLanguagesOpen] = useState(true)
  const [categoriesOpen, setCategoriesOpen] = useState(true)
  const [tagsOpen, setTagsOpen] = useState(true)

  const topLanguages = Object.entries(snippetCounts.byLanguage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Browse</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 py-2 space-y-0.5">
          <NavItem
            icon={LayoutGrid}
            label="All Snippets"
            count={snippetCounts.total}
            active={!filters.visibility}
            onClick={() => onFiltersChange({ ...filters, visibility: undefined })}
          />
          <NavItem
            icon={Eye}
            label="Public"
            count={snippetCounts.public}
            active={filters.visibility === "public"}
            onClick={() => onFiltersChange({ ...filters, visibility: "public" })}
          />
          <NavItem
            icon={EyeOff}
            label="Private"
            count={snippetCounts.private}
            active={filters.visibility === "private"}
            onClick={() => onFiltersChange({ ...filters, visibility: "private" })}
          />

          {topLanguages.length > 0 && (
            <>
              <SectionLabel>Languages</SectionLabel>
              <Collapsible open={languagesOpen} onOpenChange={setLanguagesOpen}>
                <CollapsibleTrigger className="w-full flex items-center justify-between px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <span className="flex items-center gap-2">
                    <Code2 className="h-3 w-3" />
                    {languagesOpen ? "Hide" : "Show all"}
                  </span>
                  <ChevronDown className={cn("h-3 w-3 transition-transform", !languagesOpen && "-rotate-90")} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-0.5 mt-0.5">
                  {topLanguages.map(([lang, count]) => (
                    <button
                      key={lang}
                      onClick={() => onFiltersChange({
                        ...filters,
                        language: filters.language === lang ? undefined : (lang as Language),
                      })}
                      className={cn(
                        "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors",
                        filters.language === lang
                          ? "bg-secondary text-secondary-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span className={cn(
                          "h-1.5 w-1.5 rounded-full shrink-0",
                          filters.language === lang ? "bg-foreground" : "bg-muted-foreground/50"
                        )} />
                        {LANGUAGE_NAMES[lang as Language]}
                      </span>
                      <span className="tabular-nums text-muted-foreground">{count}</span>
                    </button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </>
          )}

          {allCategories.length > 0 && (
            <>
              <SectionLabel>Categories</SectionLabel>
              <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
                <CollapsibleTrigger className="w-full flex items-center justify-between px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <span className="flex items-center gap-2">
                    <Folder className="h-3 w-3" />
                    {categoriesOpen ? "Hide" : "Show all"}
                  </span>
                  <ChevronDown className={cn("h-3 w-3 transition-transform", !categoriesOpen && "-rotate-90")} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-0.5 mt-0.5">
                  {allCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => onFiltersChange({
                        ...filters,
                        category: filters.category === category ? undefined : category,
                      })}
                      className={cn(
                        "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors",
                        filters.category === category
                          ? "bg-secondary text-secondary-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <span className="truncate">{category}</span>
                      <span className="tabular-nums text-muted-foreground shrink-0 ml-2">
                        {snippetCounts.byCategory[category] ?? 0}
                      </span>
                    </button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </>
          )}

          {allTags.length > 0 && (
            <>
              <SectionLabel>Tags</SectionLabel>
              <Collapsible open={tagsOpen} onOpenChange={setTagsOpen}>
                <CollapsibleTrigger className="w-full flex items-center justify-between px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <span className="flex items-center gap-2">
                    <Tag className="h-3 w-3" />
                    {tagsOpen ? "Hide" : "Show all"}
                  </span>
                  <ChevronDown className={cn("h-3 w-3 transition-transform", !tagsOpen && "-rotate-90")} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-0.5 mt-0.5">
                  {allTags.slice(0, 20).map((tag) => {
                    const isSelected = filters.tags?.includes(tag)
                    return (
                      <button
                        key={tag}
                        onClick={() => {
                          const current = filters.tags ?? []
                          const next = isSelected ? current.filter((t) => t !== tag) : [...current, tag]
                          onFiltersChange({ ...filters, tags: next.length > 0 ? next : undefined })
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors",
                          isSelected
                            ? "bg-secondary text-secondary-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <span className="truncate">#{tag}</span>
                        <span className="tabular-nums text-muted-foreground shrink-0 ml-2">
                          {snippetCounts.byTag[tag] ?? 0}
                        </span>
                      </button>
                    )
                  })}
                  {allTags.length > 20 && (
                    <p className="text-xs text-muted-foreground/50 text-center py-1">
                      +{allTags.length - 20} more
                    </p>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export function Sidebar(props: SidebarProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="fixed bottom-4 left-4 z-20 h-10 w-10 rounded-full shadow-lg border border-border"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open filters</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-60">
          <SidebarInner {...props} />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside className="w-52 border-r border-border flex flex-col h-full shrink-0 bg-background">
      <SidebarInner {...props} />
    </aside>
  )
}
