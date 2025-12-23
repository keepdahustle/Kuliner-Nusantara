"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Star, 
  MessageSquare, 
  AlertCircle, 
  LogIn, 
  CheckCircle2, 
  Clock,
  User as UserIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import RatingStars from "./rating-stars"
import { fetchFromApi, postToApi } from "@/lib/data"

interface ReviewsSectionProps {
  culinaryId?: string
}

export default function ReviewsSection({ culinaryId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" })

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const role = localStorage.getItem("user_role")
    if (token && (role === "visitor" || role === "member")) setIsLoggedIn(true)
    
    if (culinaryId) {
      loadApprovedReviews()
    } else {
      setLoading(false)
    }
  }, [culinaryId])

  const loadApprovedReviews = async () => {
    setLoading(true)
    const res = await fetchFromApi<any[]>(`/reviews/${culinaryId}`)
    setReviews(res || [])
    setLoading(false) // FIX: Loading dimatikan meskipun data kosong
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setStatusMsg({ type: "error", text: "Pilih rating bintang dahulu." })
      return
    }

    setIsSubmitting(true)
    setStatusMsg({ type: "", text: "" })

    // FIX: Pastikan ID kuliner adalah Angka murni sebelum dikirim ke Laravel
    const payload = {
      culinary_id: parseInt(culinaryId || "0"),
      rating: rating,
      comment: comment
    }

    const res = await postToApi("/reviews", payload)

    if (res.success) {
      setStatusMsg({ type: "success", text: res.message })
      setRating(0)
      setComment("")
    } else {
      setStatusMsg({ type: "error", text: res.message || "Gagal mengirim ulasan." })
    }
    setIsSubmitting(false)
  }

  return (
    <section className="font-sans space-y-10">
      <div className="flex items-center gap-3">
        <MessageSquare className="text-[#a64029] w-8 h-8" />
        <h2 className="font-serif text-3xl text-[#3b2f2f] font-bold">Ulasan Pengunjung</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* INPUT ULASAN */}
        <div className="lg:col-span-1">
          <Card className="p-6 bg-white rounded-[32px] border-none shadow-sm sticky top-24">
            <h3 className="font-bold text-[#3b2f2f] mb-4 text-lg">Berikan Rating Anda</h3>
            {!isLoggedIn ? (
              <div className="bg-[#f4e8d1]/50 p-6 rounded-2xl border border-dashed border-[#a64029]/20 text-center space-y-4">
                <LogIn className="w-10 h-10 text-[#a64029] mx-auto opacity-40" />
                <p className="text-sm text-[#6e5849] font-bold">Masuk sebagai Member untuk mengulas.</p>
                <Link href="/login" className="block w-full py-3 bg-[#a64029] text-white rounded-xl font-bold text-xs no-underline hover:bg-[#85311e]">Masuk Sekarang</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Nilai Rasa</label>
                  <RatingStars rating={rating} isInput={true} onRatingChange={setRating} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Komentar</label>
                  <Textarea placeholder="Tulis pengalaman rasa Anda..." value={comment} onChange={(e) => setComment(e.target.value)} className="min-h-[120px] rounded-xl border-[#ddd] bg-gray-50/50" />
                </div>
                {statusMsg.text && (
                  <div className={`p-4 rounded-xl text-xs font-bold flex gap-2 ${statusMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {statusMsg.type === 'success' ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
                    {statusMsg.text}
                  </div>
                )}
                <Button disabled={isSubmitting} className="w-full py-7 bg-[#a64029] hover:bg-[#85311e] text-white font-bold rounded-2xl shadow-lg transition-all">
                  {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
                </Button>
              </form>
            )}
          </Card>
        </div>

        {/* DAFTAR ULASAN */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="py-20 text-center animate-pulse">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Memuat Data Ulasan...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white/30 p-20 rounded-[48px] text-center border border-dashed border-[#ddd]">
               {/* FIX: Teks saat tidak ada ulasan */}
               <h4 className="font-serif text-2xl text-gray-400 font-bold italic">Belum Ada Ulasan</h4>
               <p className="text-gray-400 text-sm mt-2">Jadilah orang pertama yang memberikan rating untuk menu ini!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((rev: any) => (
                <Card key={rev.id} className="p-8 bg-white border-none rounded-[32px] shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#dfaf2b] rounded-full flex items-center justify-center text-[#3b2f2f] font-bold">{rev.user?.name?.[0]}</div>
                      <div>
                        <h4 className="font-bold text-[#3b2f2f] text-lg">{rev.user?.name}</h4>
                        <p className="text-[10px] text-gray-400"><Clock size={10} className="inline" /> {new Date(rev.created_at).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (<Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} />))}
                    </div>
                  </div>
                  <p className="text-[#3b2f2f] leading-relaxed text-sm italic">"{rev.comment}"</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}