"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Utensils, LogOut, User as UserIcon } from "lucide-react"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [role, setRole] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Cek status login dari LocalStorage
    const token = localStorage.getItem("auth_token")
    const userRole = localStorage.getItem("user_role")
    if (token) {
      setIsLoggedIn(true)
      setRole(userRole || "")
    }
  }, [])

  const handleLogout = () => {
    localStorage.clear() // Hapus semua session
    setIsLoggedIn(false)
    router.push("/")
    window.location.reload() // Force reload agar state bersih
  }

  return (
    <header className="sticky top-0 z-50 bg-[#f4e8d1]/90 backdrop-blur-md border-b border-[#3b2f2f]/10 py-4 font-sans">
      <nav className="container mx-auto px-5 flex justify-between items-center max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-serif font-bold text-2xl text-[#A64029] hover:opacity-80 transition-all">
          <Utensils className="w-8 h-8" />
          <span>Kulineria</span>
        </Link>

        {/* Navigation */}
        <ul className="hidden md:flex list-none m-0 p-0 gap-8 items-center">
          <li>
            <Link href="/" className="text-[#3b2f2f] font-semibold hover:text-[#A64029] transition-colors">
              Beranda
            </Link>
          </li>
          
          {/* Menu Dinamis berdasarkan Login */}
          {!isLoggedIn ? (
            <>
              <li>
                <Link href="/umkm/auth" className="text-[#3b2f2f] font-semibold hover:text-[#A64029] transition-colors">
                  Portal UMKM
                </Link>
              </li>
              <li>
                <Link 
                  href="/login" 
                  className="bg-[#A64029] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#85311e] transition-all shadow-md"
                >
                  Masuk
                </Link>
              </li>
            </>
          ) : (
            <>
              {role === "umkm" && (
                <li><Link href="/umkm" className="text-[#4e5b31] font-bold hover:underline">Dashboard UMKM</Link></li>
              )}
              {role === "admin" && (
                <li><Link href="/admin" className="text-red-600 font-bold hover:underline">Admin Panel</Link></li>
              )}
              <li className="flex items-center gap-4 border-l border-gray-300 pl-6">
                <div className="flex items-center gap-2 text-[#3b2f2f] font-bold">
                  <div className="w-8 h-8 bg-[#dfaf2b] rounded-full flex items-center justify-center text-xs">
                    <UserIcon size={14} />
                  </div>
                  <span className="text-sm">Akun Saya</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}