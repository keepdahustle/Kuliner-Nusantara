"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulasi pengiriman email
      await new Promise((resolve) => setTimeout(resolve, 500))
      setSubmitted(true)
      setEmail("")
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
          <Link href="/login" className="font-semibold no-underline" style={{ color: "#3b2f2f" }}>
            Login
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
          Lupa Sandi
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="forgotEmail" className="font-semibold text-sm" style={{ color: "#6e5849" }}>
              Email
            </label>
            <input
              id="forgotEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2.5 rounded border text-sm"
              style={{ borderColor: "#ddd" }}
              onFocus={(e) => {
                e.target.style.outline = "3px solid rgba(226, 144, 58, 0.14)"
                e.target.style.outlineOffset = "2px"
              }}
              onBlur={(e) => {
                e.target.style.outline = "none"
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2.5 rounded font-bold text-white"
            style={{ backgroundColor: "#a64029" }}
          >
            {isLoading ? "Mengirim..." : "Kirim Tautan Reset"}
          </button>

          {/* Success Message */}
          {submitted && (
            <div
              className="p-3 rounded text-sm"
              style={{
                background: "linear-gradient(90deg, rgba(255, 250, 240, 1), rgba(255, 245, 220, 1))",
              }}
            >
              <strong style={{ color: "#a64029" }}>Email terkirim!</strong>
              <p style={{ color: "#6e5849", margin: "0.5rem 0 0 0" }}>
                Periksa kotak masuk Anda untuk tautan reset password.
              </p>
            </div>
          )}
        </form>
      </main>
    </div>
  )
}
