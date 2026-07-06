<div align="center">

  <img src="public/icon.svg" alt="Snippet Manager Logo" width="80" height="80" />

  # Snippet Manager

  **A developer-focused code snippet manager  organize, search, and reuse your code instantly**

  [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://minimalist-snippet-manager.vercel.app)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

</div>

---

## Overview

Snippet Manager is a developer-focused tool for organizing, searching, and reusing code snippets. It gives you a fast, searchable, syntax-highlighted library backed by Supabase  with user authentication, per-user data isolation via Row Level Security, and full CRUD from any device.

---

## ✨ Features

- 🚀 **Create, Edit, Duplicate & Delete**  Full CRUD for all your code snippets in one place
- 🎨 **Syntax Highlighting for 36 Languages**  Powered by CodeMirror 6 with GitHub and One Dark themes
- 🕓 **Version History**  Up to 10 previous versions per snippet with one-click restore
- 🔍 **Live Full-Text Search**  Search across title, description, code, and tags with optional regex support
- 🏷️ **Tags, Categories & Filters**  Filter by language, category, tags, and visibility
- 🌗 **Dark / Light Theme**  Persistent theme toggle saved in localStorage
- 📤 **Export as JSON or GitHub Gist**  Share or back up your entire snippet library
- 📥 **Import from JSON**  Duplicate IDs are automatically resolved on import
- 📱 **Fully Responsive**  Mobile sidebar via slide-out sheet
- ⌨️ **Keyboard Shortcuts**  Power-user shortcuts for common actions
- 🔐 **Auth & Cloud Sync**  Supabase authentication with per-user Row Level Security

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| Editor | CodeMirror 6 (`@uiw/react-codemirror`) |
| Icons | Lucide React |
| Auth & Storage | Supabase (Auth + Postgres + RLS) |
| Deployment | Vercel |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/MuhammadTanveerAbbas/minimalist-snippet-manager.git
cd minimalist-snippet-manager

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase project credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these in your Supabase dashboard under **Settings → API**. Then run the SQL in `supabase/schema.sql` via the Supabase SQL Editor to create the required tables.

---

## 📁 Project Structure

```
minimalist-snippet-manager/
├── public/
│   └── icon.svg                        # Custom terminal-style SVG favicon
├── app/
│   ├── auth/
│   │   └── callback/                   # Supabase OAuth callback handler
│   ├── login/
│   │   └── page.tsx                    # Login page
│   ├── layout.tsx                      # Root layout — fonts, metadata, theme init
│   ├── page.tsx                        # Main dashboard — snippet CRUD and filters
│   ├── loading.tsx                     # Route-level loading UI
│   └── globals.css                     # CSS variables, dark/light theme tokens
├── components/
│   ├── auth-modal.tsx                  # Sign-in / sign-up modal
│   ├── header.tsx                      # Top navigation bar with custom SVG logo
│   ├── sidebar.tsx                     # Filter panel (desktop aside + mobile sheet)
│   ├── search-bar.tsx                  # Live search input with advanced filter popover
│   ├── snippet-list.tsx                # Responsive grid of snippet cards
│   ├── snippet-card.tsx                # Individual card with hover actions
│   ├── snippet-form.tsx                # Create/edit form with version history dialog
│   ├── snippet-viewer.tsx              # Read-only snippet detail dialog
│   ├── code-editor.tsx                 # CodeMirror wrapper with copy button
│   ├── export-import-dialog.tsx        # JSON and Gist export/import
│   ├── keyboard-shortcuts-dialog.tsx   # Shortcut reference modal
│   ├── theme-init.tsx                  # Applies saved theme on every route
│   ├── theme-toggle.tsx                # Dark/light toggle button
│   └── ui/                             # shadcn/ui primitives
├── hooks/
│   ├── use-snippets.ts                 # CRUD state management + import/export
│   ├── use-theme.ts                    # Theme toggle helper
│   ├── use-keyboard-shortcuts.ts       # Global keyboard shortcut registration
│   └── use-mobile.ts                   # Responsive breakpoint detection (768px)
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Supabase browser client
│   │   └── server.ts                   # Supabase server client (SSR)
│   ├── types.ts                        # TypeScript interfaces (Snippet, Language, etc.)
│   ├── storage.ts                      # Supabase persistence layer
│   ├── search.ts                       # Filter and search logic (regex-capable)
│   ├── snippet-stats.ts                # Aggregate counts for sidebar
│   ├── editor-languages.ts             # CodeMirror language extension mapping
│   └── utils.ts                        # cn() utility (clsx + tailwind-merge)
├── supabase/
│   └── schema.sql                      # Supabase table definitions + RLS policies
├── .env.example
├── package.json
└── README.md
```

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type check |

---

## 🌐 Deployment

This project is deployed on **Vercel**.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MuhammadTanveerAbbas/minimalist-snippet-manager)

1. Click the button above
2. Connect your GitHub account
3. Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables
4. Deploy

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/⌘ + N` | Create new snippet |
| `Ctrl/⌘ + K` | Focus search |
| `/` | Focus search (alternative) |
| `Escape` | Close open dialogs |

---

## 🗺 Roadmap

- [x] Full CRUD for snippets
- [x] Syntax highlighting for 36 languages
- [x] Version history with restore
- [x] Live full-text search with regex support
- [x] JSON and GitHub Gist export/import
- [x] Dark/light theme
- [x] Keyboard shortcuts
- [x] Fully responsive mobile UI
- [x] Cloud sync (Supabase backend)
- [ ] Browser extension for quick save
- [ ] Team/collaboration features

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

---

## 👨‍💻 Built by The MVP Guy

<div align="center">

**Muhammad Tanveer Abbas**
SaaS Developer | Building production-ready MVPs in 14–21 days

[![Portfolio](https://img.shields.io/badge/Portfolio-themvpguy.vercel.app-black?style=for-the-badge)](https://themvpguy.vercel.app)
[![Twitter](https://img.shields.io/badge/Twitter-@m__tanveerabbas-1DA1F2?style=for-the-badge&logo=twitter)](https://x.com/m_tanveerabbas)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/muhammadtanveerabbas)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/MuhammadTanveerAbbas)

*If this project helped you, please consider giving it a ⭐*

</div>
