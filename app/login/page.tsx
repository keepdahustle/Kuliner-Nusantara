"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Footer } from "@/components/footer"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  // we use a username field for id (e.g. user, umkm, admin) or email for new users
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // basic validation
      if (!email || !password) {
        setError("ID/Username dan password harus diisi")
        return
      }

      let role: string = "user"
      const username = email.trim().toLowerCase()
      // check predefined accounts
      if (username === "admin" && password === "admin123") {
        role = "admin"
      } else if (username === "umkm" && password === "umkm123") {
        role = "umkm"
      } else if (username === "user" && password === "user123") {
        role = "user"
      } else {
        // for any other login attempt, just treat as normal user
        role = "user"
      }

      const userData: any = {
        email: username,
        name: username,
        avatar: "/logo-kuliner.jpg",
        bio: "",
        province: "",
        userType: role,
      }

      localStorage.setItem("authUser", JSON.stringify(userData))

      if (rememberMe) {
        localStorage.setItem("rememberEmail", email)
      }

      // Redirect based on role
      setTimeout(() => {
        if (role === "admin") {
          router.push("/admin")
        } else if (role === "umkm") {
          router.push("/umkm")
        } else {
          router.push("/")
        }
      }, 500)
    } catch (err) {
      setError("Terjadi kesalahan, silakan coba lagi")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f4e8d1" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between gap-4 container mx-auto my-9 px-4 py-3 rounded-2xl"
        style={{
          maxWidth: "1000px",
          background: "rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <Image src="/logo-kuliner.jpg" alt="logo" width={48} height={48} className="rounded" />
          <div className="text-lg font-bold" style={{ color: "#a64029" }}>
            Kuliner Nusantara
          </div>
        </div>
        <nav className="flex gap-3">
          <Link href="/" className="font-semibold no-underline" style={{ color: "#3b2f2f" }}>
            Beranda
          </Link>
          <Link href="/register" className="font-semibold no-underline" style={{ color: "#3b2f2f" }}>
            Daftar
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main
        className="container mx-auto px-4 py-8 rounded-2xl"
        style={{
          maxWidth: "1000px",
          background: "rgba(244, 232, 209, 0.92)",
          boxShadow: "0 8px 30px rgba(23, 18, 12, 0.08)",
        }}
      >
        <h2 className="text-2xl font-bold mb-8" style={{ color: "#a64029" }}>
          Masuk
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          {/* Error Message */}
          {error && (
            <div className="p-3 rounded text-white text-sm" style={{ backgroundColor: "#a64029" }}>
              {error}
            </div>
          )}

          {/* Username / ID Field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="loginEmail" className="font-semibold text-sm" style={{ color: "#6e5849" }}>
              ID / Username
            </label>
            <input
              id="loginEmail"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2.5 rounded border text-sm"
              style={{
                borderColor: "#ddd",
                fontSize: "0.95rem",
              }}
              onFocus={(e) => {
                e.target.style.outline = "3px solid rgba(226, 144, 58, 0.14)"
                e.target.style.outlineOffset = "2px"
              }}
              onBlur={(e) => {
                e.target.style.outline = "none"
              }}
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="loginPassword" className="font-semibold text-sm" style={{ color: "#6e5849" }}>
              Password
            </label>
            <div className="flex gap-2 items-center">
              <input
                id="loginPassword"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="flex-1 p-2.5 rounded border text-sm"
                style={{
                  borderColor: "#ddd",
                  fontSize: "0.95rem",
                }}
                onFocus={(e) => {
                  e.target.style.outline = "3px solid rgba(226, 144, 58, 0.14)"
                  e.target.style.outlineOffset = "2px"
                }}
                onBlur={(e) => {
                  e.target.style.outline = "none"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 py-1.5 rounded border text-sm font-semibold"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "rgba(0, 0, 0, 0.06)",
                  borderRadius: "8px",
                }}
              >
                {showPassword ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe" className="font-semibold text-sm" style={{ color: "#6e5849" }}>
              Ingat saya
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2.5 rounded font-bold text-white"
              style={{ backgroundColor: "#a64029" }}
            >
              {isLoading ? "Masuk..." : "Masuk"}
            </button>
            <Link href="/forgot-password" className="text-sm no-underline" style={{ color: "#6e5849" }}>
              Lupa sandi?
            </Link>
          </div>
        </form>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
