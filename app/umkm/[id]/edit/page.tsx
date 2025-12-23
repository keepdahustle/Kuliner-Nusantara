"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { KulinerForm } from "../../kuliner-form"

// Halaman edit kuliner untuk UMKM
export default function EditPage() {
  const params = useParams()
  const id = params.id as string
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
      router.push("/")
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Edit Kuliner</h1>
        <KulinerForm editId={id} />
      </main>
      <Footer />
    </div>
  )
}
