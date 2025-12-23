"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { KulinerForm } from "../kuliner-form"

// Halaman tambah kuliner untuk UMKM, menggunakan header & footer umum
export default function TambahPage() {
  const router = useRouter()

  // Pastikan hanya user dengan role umkm yang bisa mengakses halaman ini
  useEffect(() => {
    const auth = localStorage.getItem("authUser")
    if (!auth) {
      router.push("/login")
      return
    }
    const user = JSON.parse(auth)
    if (user.userType !== "umkm") {
      // redirect ke landing jika bukan UMKM
      router.push("/")
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Tambah Kuliner</h1>
        <KulinerForm />
      </main>
      <Footer />
    </div>
  )
}
