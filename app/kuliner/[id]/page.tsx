"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Breadcrumb from "@/components/breadcrumb"
import KulinerDetail from "@/components/kuliner-detail"
import ReviewsSection from "@/components/reviews-section"
import { loadAll } from "@/lib/data"

export default function KulinerDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [detailData, setDetailData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await loadAll()
        const item = data.kuliner.find((k: any) => k.id === id)
        if (!item) {
          setLoading(false)
          setDetailData(null)
          return
        }
        // build detail structure
        const harga = item.hargaMin && item.hargaMax
          ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
              item.hargaMin,
            ) +
            " - " +
            new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
              item.hargaMax,
            )
          : "Harga bervariasi"
        const detail = {
          id: item.id,
          nama: item.title,
          daerah: `${item.provinsi}, ${item.kota}`,
          kategori: item.kategori,
          rating_rata_rata: item.rating || 0,
          harga,
          deskripsi: {
            ringkas: `Nikmati kelezatan ${item.title} dari ${item.kota}, ${item.provinsi}.`,
            lengkap: `Kuliner ${item.title} merupakan makanan khas ${item.kota}, ${item.provinsi}. Deskripsi lengkap belum tersedia.`,
          },
          gallery: item.images || [],
          resep: {
            bahan: ["Belum tersedia"],
            langkah: ["Belum tersedia"],
          },
        }
        setDetailData(detail)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat detail kuliner...</p>
      </div>
    )
  }

  if (!detailData) {
    // redirect to home if not found
    if (typeof window !== "undefined") {
      router.push("/")
    }
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Breadcrumb nama={detailData.nama} />
        <KulinerDetail data={detailData} />
        <ReviewsSection kulinerId={id} />
      </main>
      <Footer />
    </div>
  )
}