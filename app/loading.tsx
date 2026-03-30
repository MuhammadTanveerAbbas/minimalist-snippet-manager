import { Code2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center mx-auto animate-pulse">
          <Code2 className="h-5 w-5 text-primary-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
