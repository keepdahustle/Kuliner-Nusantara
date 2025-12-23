"use client"

import { useState, useEffect } from "react"
import RatingStars from "@/components/rating-stars"

interface AdminReview {
  id: string
  kulinerId: string
  restoran: string
  rating: number
  content: string
  time: string
}

// Halaman manajemen ulasan admin
// Menampilkan semua ulasan yang dimasukkan pengguna di seluruh kuliner dari localStorage
// Admin dapat mengedit atau menghapus ulasan. Tidak ada konsep pending/approve pada versi ini.
export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [filteredReviews, setFilteredReviews] = useState<AdminReview[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRating, setEditRating] = useState(0)
  const [editText, setEditText] = useState("")

  // Memuat ulasan dari localStorage dan mapping nama kuliner
  useEffect(() => {
    async function loadData() {
      // load kuliner list to map id -> title
      let kulinerMap: Record<string, string> = {}
      try {
        const res = await fetch("/mock/home/kuliner.json")
        const list = await res.json()
        list.forEach((item: any) => {
          kulinerMap[item.id] = item.title || item.nama || item.title
        })
      } catch (err) {
        console.error("Gagal memuat data kuliner:", err)
      }
      // load reviews from localStorage
      let combined: AdminReview[] = []
      try {
        const allReviews = JSON.parse(localStorage.getItem("kulinerReviews") || "{}")
        Object.keys(allReviews).forEach((kulinerId) => {
          const name = kulinerMap[kulinerId] || kulinerId
          const items: any[] = allReviews[kulinerId]
          items.forEach((r) => {
            combined.push({
              id: r.id || `${kulinerId}-${r.time}`,
              kulinerId,
              restoran: name,
              rating: r.rating,
              content: r.text,
              time: r.time,
            })
          })
        })
      } catch (err) {
        console.error("Gagal memuat ulasan dari localStorage:", err)
      }
      setReviews(combined)
    }
    loadData()
  }, [])

  // Filter & sorting
  useEffect(() => {
    let result = [...reviews]
    // search filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      result = result.filter((r) =>
        r.restoran.toLowerCase().includes(q) || r.content.toLowerCase().includes(q),
      )
    }
    // sort by date
    result.sort((a, b) => {
      const aTime = new Date(a.time).getTime()
      const bTime = new Date(b.time).getTime()
      return sortBy === "newest" ? bTime - aTime : aTime - bTime
    })
    setFilteredReviews(result)
  }, [reviews, searchTerm, sortBy])

  // handle delete review
  const handleDelete = (review: AdminReview) => {
    if (typeof window === "undefined") return
    const allReviews = JSON.parse(localStorage.getItem("kulinerReviews") || "{}")
    const list = allReviews[review.kulinerId] || []
    const updated = list.filter((r: any) => r.id !== review.id)
    allReviews[review.kulinerId] = updated
    localStorage.setItem("kulinerReviews", JSON.stringify(allReviews))
    setReviews((prev) => prev.filter((r) => r.id !== review.id))
  }

  // handle start editing
  const startEdit = (review: AdminReview) => {
    setEditingId(review.id)
    setEditRating(review.rating)
    setEditText(review.content)
  }

  // cancel editing
  const cancelEdit = () => {
    setEditingId(null)
    setEditRating(0)
    setEditText("")
  }

  // save edited review
  const saveEdit = (review: AdminReview) => {
    if (typeof window === "undefined") return
    const allReviews = JSON.parse(localStorage.getItem("kulinerReviews") || "{}")
    const list = allReviews[review.kulinerId] || []
    const updatedList = list.map((r: any) => {
      if (r.id === review.id) {
        return { ...r, rating: editRating, text: editText }
      }
      return r
    })
    allReviews[review.kulinerId] = updatedList
    localStorage.setItem("kulinerReviews", JSON.stringify(allReviews))
    // update state
    setReviews((prev) =>
      prev.map((r) => (r.id === review.id ? { ...r, rating: editRating, content: editText } : r)),
    )
    cancelEdit()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Manajemen Ulasan</h1>
        <p className="text-muted-foreground">Edit atau hapus ulasan pengguna terhadap kuliner</p>
      </div>
      {/* Pencarian dan sorting */}
      <div className="bg-card border border-border rounded-lg p-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-2">Cari Ulasan</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan nama kuliner atau isi ulasan..."
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Urutkan</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
        </div>
      </div>
      {/* List ulasan */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-foreground font-medium mb-2">Tidak ada ulasan</p>
            <p className="text-muted-foreground">Belum ada ulasan yang tersimpan</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{review.restoran}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{new Date(review.time).toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>
              {/* Konten atau form edit */}
              {editingId === review.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Ubah Rating</label>
                    <RatingStars
                      rating={editRating}
                      isInput={true}
                      onRatingChange={(val: number) => setEditRating(val)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Ubah Ulasan</label>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-lg text-foreground"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => saveEdit(review)}
                      className="px-4 py-2 bg-[#4E5B31] hover:bg-[#3a4323] text-white rounded-lg"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-[#A64029] hover:bg-[#8b3220] text-white rounded-lg"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Rating */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-yellow-600">
                        {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                      </span>
                      <span className="text-sm text-muted-foreground">{review.rating}/5</span>
                    </div>
                  </div>
                  {/* Isi ulasan */}
                  <p className="text-foreground text-sm mb-6 leading-relaxed">{review.content}</p>
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <button
                      onClick={() => startEdit(review)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#4E5B31] hover:bg-[#3a4323] text-white rounded-lg transition-colors font-medium shadow-sm hover:shadow-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#A64029] hover:bg-[#8b3220] text-white rounded-lg transition-colors font-medium shadow-sm hover:shadow-md"
                    >
                      Hapus
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
      {/* Info total */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Menampilkan {filteredReviews.length} dari {reviews.length} ulasan
        </span>
      </div>
    </div>
  )
}