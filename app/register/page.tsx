"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Footer } from "@/components/footer"
import { useRouter } from "next/navigation"

type UserType = "user" | "umkm" | ""

export default function RegisterPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<UserType>("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [umkmData, setUmkmData] = useState({
    businessName: "",
    category: "",
    phone: "",
    address: "",
    province: "",
    description: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleUmkmChange = (field: string, value: string) => {
    setUmkmData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validasi
      if (!userType) {
        setError("Pilih jenis pendaftaran terlebih dahulu")
        return
      }

      if (!formData.name || !formData.email || !formData.password) {
        setError("Nama, Email, dan Password harus diisi")
        return
      }

      if (formData.password.length < 6) {
        setError("Password minimal 6 karakter")
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Password dan konfirmasi password tidak sama")
        return
      }

      if (userType === "umkm") {
        if (!umkmData.businessName || !umkmData.category || !umkmData.phone) {
          setError("Data UMKM: nama bisnis, kategori, dan telepon harus diisi")
          return
        }
      }

      // Simpan ke localStorage
      const userData: any = {
        name: formData.name,
        email: formData.email,
        avatar: "/profile-avatar.png",
        bio: "",
        province: userType === "umkm" ? umkmData.province : "",
        userType,
      }

      if (userType === "umkm") {
        userData.umkm = umkmData
      }

      localStorage.setItem("authUser", JSON.stringify(userData))

      // Redirect berdasarkan jenis akun
      setTimeout(() => {
        if (userType === "umkm") {
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
          Daftar
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          {/* Error Message */}
          {error && (
            <div className="p-3 rounded text-white text-sm" style={{ backgroundColor: "#a64029" }}>
              {error}
            </div>
          )}

          {/* User Type Selection */}
          <div className="space-y-3">
            <label className="font-semibold text-sm" style={{ color: "#6e5849" }}>
              Jenis Pendaftaran
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="user"
                  checked={userType === "user"}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                />
                <span style={{ color: "#3b2f2f" }}>User Biasa</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="umkm"
                  checked={userType === "umkm"}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                />
                <span style={{ color: "#3b2f2f" }}>Daftar UMKM</span>
              </label>
            </div>
          </div>

          {/* Data Diri Section */}
          <div className="p-4 rounded" style={{ backgroundColor: "rgba(78, 91, 49, 0.05)" }}>
            <h3 className="font-bold mb-4" style={{ color: "#a64029" }}>
              Data Diri
            </h3>

            {/* Name */}
            <div className="flex flex-col gap-1.5 mb-4">
              <label htmlFor="regName" className="font-semibold text-sm" style={{ color: "#6e5849" }}>
                Nama Lengkap
              </label>
              <input
                id="regName"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
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

            {/* Email */}
            <div className="flex flex-col gap-1.5 mb-4">
              <label htmlFor="regEmail" className="font-semibold text-sm" style={{ color: "#6e5849" }}>
                Email
              </label>
              <input
                id="regEmail"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
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

            {/* Password */}
            <div className="flex flex-col gap-1.5 mb-4">
              <label htmlFor="regPassword" className="font-semibold text-sm" style={{ color: "#6e5849" }}>
                Password
              </label>
              <input
                id="regPassword"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                minLength={6}
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

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="regConfirm" className="font-semibold text-sm" style={{ color: "#6e5849" }}>
                Konfirmasi Password
              </label>
              <input
                id="regConfirm"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
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
          </div>

          {/* UMKM Data Section - Only show if UMKM selected */}
          {userType === "umkm" && (
            <div className="p-4 rounded" style={{ backgroundColor: "rgba(226, 144, 58, 0.05)" }}>
              <h3 className="font-bold mb-4" style={{ color: "#a64029" }}>
                Data UMKM
              </h3>

              {/* Business Name */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label htmlFor="businessName" className="font-semibold text-sm" style={{ color: "#6e5849" }}>
                  Nama Bisnis
                </label>
                <input
                  id="businessName"
                  type="text"
                  value={umkmData.businessName}
                  onChange={(e) => handleUmkmChange("businessName", e.target.value)}
                  required={userType === "umkm"}
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

              {/* Category */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label htmlFor="category" className="font-semibold text-sm" style={{ color: "#6e5849" }}>
                  Kategori Bisnis
                </label>
                <select
                  id="category"
                  value={umkmData.category}
                  onChange={(e) => handleUmkmChange("category", e.target.value)}
                  required={userType === "umkm"}
                  className="p-2.5 rounded border text-sm"
                  style={{ borderColor: "#ddd" }}
                  onFocus={(e) => {
                    e.target.style.outline = "3px solid rgba(226, 144, 58, 0.14)"
                    e.target.style.outlineOffset = "2px"
                  }}
                  onBlur={(e) => {
                    e.target.style.outline = "none"
                  }}
                >
                  <option value="">Pilih Kategori</option>
                  <option value="makanan">Makanan</option>
                  <option value="minuman">Minuman</option>
                  <option value="jajanan">Jajanan</option>
                  <option value="restoran">Restoran</option>
                  <option value="catering">Catering</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label htmlFor="phone" className="font-semibold text-sm" style={{ color: "#6e5849" }}>
                  Nomor Telepon
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={umkmData.phone}
                  onChange={(e) => handleUmkmChange("phone", e.target.value)}
                  required={userType === "umkm"}
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

              {/* Address */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label htmlFor="address" className="font-semibold text-sm" style={{ color: "#6e5849" }}>
                  Alamat
                </label>
                <input
                  id="address"
                  type="text"
                  value={umkmData.address}
                  onChange={(e) => handleUmkmChange("address", e.target.value)}
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

              {/* Province */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label htmlFor="province" className="font-semibold text-sm" style={{ color: "#6e5849" }}>
                  Provinsi
                </label>
                <select
                  id="province"
                  value={umkmData.province}
                  onChange={(e) => handleUmkmChange("province", e.target.value)}
                  className="p-2.5 rounded border text-sm"
                  style={{ borderColor: "#ddd" }}
                  onFocus={(e) => {
                    e.target.style.outline = "3px solid rgba(226, 144, 58, 0.14)"
                    e.target.style.outlineOffset = "2px"
                  }}
                  onBlur={(e) => {
                    e.target.style.outline = "none"
                  }}
                >
                  <option value="">Pilih Provinsi</option>
                  <option value="Jawa Barat">Jawa Barat</option>
                  <option value="Jawa Tengah">Jawa Tengah</option>
                  <option value="Jawa Timur">Jawa Timur</option>
                  <option value="DKI Jakarta">DKI Jakarta</option>
                  <option value="Yogyakarta">Yogyakarta</option>
                  <option value="Sumatra Utara">Sumatra Utara</option>
                  <option value="Bali">Bali</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="description" className="font-semibold text-sm" style={{ color: "#6e5849" }}>
                  Deskripsi Bisnis
                </label>
                <textarea
                  id="description"
                  value={umkmData.description}
                  onChange={(e) => handleUmkmChange("description", e.target.value)}
                  rows={4}
                  maxLength={300}
                  className="p-2.5 rounded border text-sm"
                  style={{ borderColor: "#ddd" }}
                  placeholder="Ceritakan tentang bisnis Anda (max 300 karakter)"
                  onFocus={(e) => {
                    e.target.style.outline = "3px solid rgba(226, 144, 58, 0.14)"
                    e.target.style.outlineOffset = "2px"
                  }}
                  onBlur={(e) => {
                    e.target.style.outline = "none"
                  }}
                />
                <span className="text-xs" style={{ color: "#6e5849" }}>
                  {umkmData.description.length}/300 karakter
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={isLoading || !userType}
              className="px-4 py-2.5 rounded font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: "#a64029" }}
            >
              {isLoading ? "Mendaftar..." : "Daftar"}
            </button>
            <Link href="/login" className="text-sm no-underline" style={{ color: "#6e5849" }}>
              Sudah punya akun?
            </Link>
          </div>
        </form>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
