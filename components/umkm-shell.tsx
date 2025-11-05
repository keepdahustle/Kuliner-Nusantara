"use client"

import { useTheme } from "@/lib/use-theme"
import { Moon, Sun, Plus } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import Image from "next/image"

interface UmkmShellProps {
  children: ReactNode
  title: string
  showAddButton?: boolean
}

export function UmkmShell({ children, title, showAddButton = false }: UmkmShellProps) {
  const { theme, toggleTheme, mounted } = useTheme()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border p-6 flex flex-col sticky top-0 h-screen overflow-y-auto">
        <Link href="/umkm" className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 relative">
            <Image
              src="/Logo-Kuliner-Nusantara.png"
              alt="Kuliner Nusantara Logo"
              width={48}
              height={48}
              className="w-full h-full"
            />
          </div>
          <div>
            <div className="font-bold text-sm text-sidebar-foreground">Kuliner</div>
            <div className="font-bold text-sm text-sidebar-foreground">Nusantara</div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <Link
            href="/umkm"
            className="block px-4 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            Dashboard
          </Link>
          {showAddButton && (
            <Link
              href="/umkm/tambah"
              className="block px-4 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              Tambah Kuliner
            </Link>
          )}
        </nav>

        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            aria-label={`Ganti ke ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            <span className="text-sm">{theme === "light" ? "Dark" : "Light"}</span>
          </button>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-sidebar border-b border-sidebar-border px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {showAddButton && (
            <Link
              href="/umkm/tambah"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity focus-ring"
            >
              <Plus size={20} />
              Tambah Kuliner
            </Link>
          )}
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  )
}
