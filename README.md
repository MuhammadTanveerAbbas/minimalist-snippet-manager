# Snippet Manager

A developer-focused code snippet manager with syntax highlighting, version history, tagging, and advanced search. Built with Next.js 16, React 19, TypeScript, and CodeMirror 6.

## Features

- Create, edit, delete, and duplicate code snippets
- Syntax highlighting for 35+ languages via CodeMirror 6
- Version history  up to 10 previous versions per snippet, with one-click restore
- Live full-text search across title, description, code, and tags (with optional regex support)
- Filter by language, category, tags, and visibility
- Dark / light theme with localStorage persistence
- Export all snippets as JSON or GitHub Gist format
- Import snippets from JSON (duplicate IDs are automatically resolved)
- Fully responsive  mobile sidebar via slide-out sheet
- Keyboard shortcuts for power users
- All data stored locally in `localStorage`  no backend required

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| Editor | CodeMirror 6 (`@uiw/react-codemirror`) |
| Icons | Lucide React |
| Storage | Browser `localStorage` |

## Architecture

```
app/
  layout.tsx        Root layout  fonts, metadata, favicon
  page.tsx          Main page  orchestrates all state and dialogs
  loading.tsx       Route-level loading UI
  globals.css       CSS variables, dark/light theme tokens

components/
  header.tsx        Top navigation bar with custom SVG logo
  sidebar.tsx       Filter panel (desktop aside + mobile sheet)
  search-bar.tsx    Live search input with advanced filter popover
  snippet-list.tsx  Responsive grid of snippet cards
  snippet-card.tsx  Individual card with hover actions
  snippet-form.tsx  Create/edit form with version history dialog
  snippet-viewer.tsx Read-only snippet detail dialog
  code-editor.tsx   CodeMirror wrapper with copy button
  export-import-dialog.tsx  JSON and Gist export/import
  keyboard-shortcuts-dialog.tsx  Shortcut reference modal
  theme-toggle.tsx  Dark/light toggle button
  ui/               shadcn/ui primitives

hooks/
  use-snippets.ts         CRUD state management + import/export
  use-theme.ts            Theme toggle with localStorage persistence
  use-keyboard-shortcuts.ts  Global keyboard shortcut registration
  use-mobile.ts           Responsive breakpoint detection

lib/
  types.ts          TypeScript interfaces (Snippet, Language, etc.)
  storage.ts        localStorage persistence layer with validation
  search.ts         Filter and search logic (regex-capable)
  snippet-stats.ts  Aggregate counts for sidebar
  editor-languages.ts  CodeMirror language extension mapping
  utils.ts          cn() utility (clsx + tailwind-merge)

public/
  icon.svg          Custom terminal-style SVG favicon
```

## Environment Variables

This application has no required environment variables. All data is stored in the browser's `localStorage`.

## Local Development

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
pnpm build
pnpm start
```

## Deployment

The app is a standard Next.js project and can be deployed to any platform that supports Node.js:

**Vercel (recommended)**
```bash
npx vercel
```

**Docker**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Production Considerations

- All snippet data lives in the user's browser `localStorage`. There is no server-side persistence.
- For multi-device sync, consider adding a backend (e.g., Supabase, PlanetScale) and replacing `SnippetStorage` in `lib/storage.ts`.
- The `importJSON` function validates and deduplicates snippets on import to prevent data corruption.
- Version history is capped at 10 entries per snippet to keep `localStorage` usage bounded.

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/⌘ + N` | Create new snippet |
| `Ctrl/⌘ + K` | Focus search |
| `/` | Focus search (alternative) |
| `Escape` | Close open dialogs |

## License

MIT  see [LICENSE](./LICENSE)

---

Made by [Muhammad Tanveer Abbas](https://themvpguy.vercel.app/) · [X](https://x.com/m_tanveerabbas) · [LinkedIn](https://linkedin.com/in/muhammadtanveerabbas) · [GitHub](https://github.com/MuhammadTanveerAbbas/minimalist-snippet-manager)
