import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist_Mono } from "next/font/google"
import { ThemeInit } from "@/components/theme-init"
import "./globals.css"

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://minimalist-snippet-manager.vercel.app'

export const metadata: Metadata = {
  title: "Snippet Manager - Developer Code Library",
  description:
    "A powerful code snippet manager with syntax highlighting, tagging, version history, and advanced search for developers.",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Snippet Manager",
    title: "Snippet Manager - Developer Code Library",
    description:
      "A powerful code snippet manager with syntax highlighting, tagging, version history, and advanced search for developers.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snippet Manager - Developer Code Library",
    description:
      "A powerful code snippet manager with syntax highlighting, tagging, version history, and advanced search for developers.",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.variable} font-mono antialiased`}>
        <ThemeInit />
        {children}
      </body>
    </html>
  )
}
