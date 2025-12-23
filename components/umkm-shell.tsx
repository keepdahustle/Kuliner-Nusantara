"use client"

import { useTheme } from "@/lib/use-theme"
import { Moon, Sun, Plus, LogOut, LayoutDashboard, Utensils } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import Image from "next/image"

interface UmkmShellProps {
  children: ReactNode
  title: string
  showAddButton?: boolean
}

export function UmkmShell({ children, title, showAddButton = false }: UmkmShellProps) {
  const { theme, toggleTheme, mounted } = useTheme()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.clear()
    router.push("/umkm/auth")
  }

  return (
    <div className="flex min-h-screen bg-[#f4e8d1]/30 font-sans text-[#3b2f2f]">
      {/* Sidebar UMKM */}
      <aside className="w-64 bg-[#3b2f2f] p-6 flex flex-col sticky top-0 h-screen shadow-2xl z-50">
        <Link href="/" className="flex items-center gap-3 mb-10 group">
          <div className="w-12 h-12 bg-[#a64029] rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12">
            <Utensils className="text-white" size={24} />
          </div>
          <div className="text-white">
            <div className="font-bold text-lg leading-tight">Mitra</div>
            <div className="text-xs text-white/50 tracking-widest uppercase">Nusantara</div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-3">
          <Link
            href="/umkm"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all"
          >
            <LayoutDashboard size={20} />
            <span className="font-semibold text-sm">Dashboard Utama</span>
          </Link>
          
          <Link
            href="/umkm/tambah"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all"
          >
            <Plus size={20} />
            <span className="font-semibold text-sm">Tambah Menu</span>
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white/70 hover:text-white transition-all"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              <span className="text-sm font-bold">{theme === "light" ? "Gelap" : "Terang"}</span>
            </button>
          )}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold"
          >
            <LogOut size={20} />
            <span className="text-sm">Keluar Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar Dashboard */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-sm">
          <h1 className="text-2xl font-bold text-[#3b2f2f]">{title}</h1>
          {showAddButton && (
            <Link
              href="/umkm/tambah"
              className="flex items-center gap-2 bg-[#4e5b31] text-white px-5 py-2.5 rounded-xl hover:bg-[#3a4323] transition-all font-bold shadow-md shadow-[#4e5b31]/20"
            >
              <Plus size={20} />
              Hidangan Baru
            </Link>
          )}
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto">
                {children}
            </div>
        </div>
      </main>
    </div>
  )
}