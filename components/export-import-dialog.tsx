"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Upload, FileJson, Github, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ExportImportDialogProps {
  onExportJSON: () => string
  onImportJSON: (json: string) => Promise<{ success: boolean; count: number; error?: string }>
  onExportGist: () => { description: string; public: boolean; files: Record<string, { content: string }> }
}

export function ExportImportDialog({ onExportJSON, onImportJSON, onExportGist }: ExportImportDialogProps) {
  const [open, setOpen] = useState(false)
  const [importText, setImportText] = useState("")
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null)
  const [gistJson, setGistJson] = useState("")
  const [gistCopied, setGistCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportJSON = () => {
    const json = onExportJSON()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `snippets-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportJSON = async () => {
    const result = await onImportJSON(importText)
    if (result.success) {
      setImportResult({
        success: true,
        message: `Imported ${result.count} snippet${result.count !== 1 ? "s" : ""} successfully.`,
      })
      setImportText("")
      setTimeout(() => { setOpen(false); setImportResult(null) }, 2000)
    } else {
      setImportResult({ success: false, message: result.error ?? "Failed to import snippets." })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImportText(ev.target?.result as string)
    reader.readAsText(file)
    e.target.value = ""
  }

  const handleExportGist = () => {
    const data = onExportGist()
    setGistJson(JSON.stringify(data, null, 2))
  }

  const handleCopyGist = async () => {
    await navigator.clipboard.writeText(gistJson)
    setGistCopied(true)
    setTimeout(() => setGistCopied(false), 2000)
  }

  const handleOpenChange = (val: boolean) => {
    setOpen(val)
    if (!val) {
      setImportText("")
      setImportResult(null)
      setGistJson("")
    }
  }

  return (
    <>
      <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} className="hidden" aria-hidden />
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export / Import
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Export &amp; Import</DialogTitle>
            <DialogDescription>Back up your snippets or restore from a previous export.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="export" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="export">Export JSON</TabsTrigger>
              <TabsTrigger value="import">Import JSON</TabsTrigger>
              <TabsTrigger value="gist">GitHub Gist</TabsTrigger>
            </TabsList>

            <TabsContent value="export" className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                Download all snippets as a JSON file, including metadata, tags, and version history.
              </p>
              <Button onClick={handleExportJSON} className="w-full gap-2">
                <FileJson className="h-4 w-4" />
                Download JSON
              </Button>
            </TabsContent>

            <TabsContent value="import" className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                Import snippets from a JSON file. Duplicates are automatically assigned new IDs.
              </p>
              <div className="space-y-1.5">
                <Label>Upload File</Label>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full gap-2">
                  <Upload className="h-4 w-4" />
                  Choose JSON File
                </Button>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="import-text">Or Paste JSON</Label>
                <Textarea
                  id="import-text"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder='[{"title": "My snippet", ...}]'
                  rows={8}
                  className="font-mono text-xs"
                />
              </div>
              {importResult && (
                <Alert variant={importResult.success ? "default" : "destructive"}>
                  {importResult.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <AlertDescription>{importResult.message}</AlertDescription>
                </Alert>
              )}
              <Button onClick={handleImportJSON} disabled={!importText.trim()} className="w-full gap-2">
                <Upload className="h-4 w-4" />
                Import Snippets
              </Button>
            </TabsContent>

            <TabsContent value="gist" className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                Generate a GitHub Gist-compatible payload. Copy the JSON and paste it when creating a new Gist.
              </p>
              {!gistJson ? (
                <Button onClick={handleExportGist} className="w-full gap-2">
                  <Github className="h-4 w-4" />
                  Generate Gist JSON
                </Button>
              ) : (
                <>
                  <Textarea value={gistJson} readOnly rows={10} className="font-mono text-xs" />
                  <div className="flex gap-2">
                    <Button onClick={handleCopyGist} className="flex-1 gap-2">
                      {gistCopied ? <Check className="h-4 w-4" /> : <FileJson className="h-4 w-4" />}
                      {gistCopied ? "Copied!" : "Copy JSON"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open("https://gist.github.com/new", "_blank")}
                      className="flex-1 gap-2"
                    >
                      <Github className="h-4 w-4" />
                      Open GitHub Gist
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
