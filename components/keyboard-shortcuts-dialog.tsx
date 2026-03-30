"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Keyboard } from "lucide-react"
import { KEYBOARD_SHORTCUTS } from "@/hooks/use-keyboard-shortcuts"
import { Badge } from "@/components/ui/badge"

export function KeyboardShortcutsDialog() {
  const isMac = typeof window !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0
  const ctrlKey = isMac ? "⌘" : "Ctrl"

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Keyboard Shortcuts">
          <Keyboard className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>Speed up your workflow with these shortcuts</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {KEYBOARD_SHORTCUTS.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between">
              <span className="text-sm">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.ctrl && <Badge variant="outline">{ctrlKey}</Badge>}
                {shortcut.shift && <Badge variant="outline">Shift</Badge>}
                {shortcut.alt && <Badge variant="outline">Alt</Badge>}
                <Badge variant="outline">{shortcut.key === "/" ? "/" : shortcut.key.toUpperCase()}</Badge>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
