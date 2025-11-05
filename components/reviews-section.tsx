"use client"

import type React from "react"

import { useState, useEffect } from "react"
import RatingStars from "./rating-stars"

interface Review {
  rating: number
  text: string
  time: string
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState(0)
  const [text, setText] = useState("")
  const [averageRating, setAverageRating] = useState(0)

  const kulinerId = "rendang-sapi-padang"

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = () => {
    const allReviews = JSON.parse(localStorage.getItem("kulinerReviews") || "{}")
    const currentReviews = allReviews[kulinerId] || []
    setReviews(currentReviews)
    updateAverageRating(currentReviews)
  }

  const updateAverageRating = (reviewsList: Review[]) => {
    if (reviewsList.length === 0) {
      setAverageRating(0)
      return
    }
    const total = reviewsList.reduce((sum, r) => sum + r.rating, 0)
    setAverageRating(Math.round(total / reviewsList.length))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0 || text.trim() === "") {
      alert("Harap berikan rating bintang dan isi ulasan Anda.")
      return
    }

    const newReview = {
      rating,
      text,
      time: new Date().toISOString(),
    }

    const allReviews = JSON.parse(localStorage.getItem("kulinerReviews") || "{}")
    const currentReviews = allReviews[kulinerId] || []
    currentReviews.unshift(newReview)
    allReviews[kulinerId] = currentReviews
    localStorage.setItem("kulinerReviews", JSON.stringify(allReviews))

    setReviews(currentReviews)
    updateAverageRating(currentReviews)
    setText("")
    setRating(0)
  }

  return (
    <section className="container mx-auto px-5 max-w-6xl mb-12">
      <h2 className="font-serif text-2xl mb-6">Ulasan & Rating Pengguna</h2>

      {/* Form Ulasan */}
      <div className="bg-white p-8 rounded-2xl mb-8">
        <h3 className="font-serif text-lg mb-4">Berikan Ulasan Anda</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <RatingStars rating={rating} isInput={true} onRatingChange={setRating} />
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Bagaimana pengalaman kuliner Anda..."
            rows={4}
            required
            className="w-full rounded-lg p-2.5 font-sans border border-[#ccc]"
          />
          <button
            type="submit"
            className="bg-[#A64029] text-white border-none px-6 py-3 rounded-lg font-medium text-base cursor-pointer transition-colors hover:bg-[#85311e]"
          >
            Kirim Ulasan
          </button>
        </form>
      </div>

      {/* Daftar Ulasan */}
      <div className="space-y-5">
        {reviews.length === 0 ? (
          <p className="text-center text-[#6E5849]">Jadilah yang pertama memberikan ulasan!</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="bg-white p-5 rounded-2xl border-l-4 border-[#DFAF2B]">
              <div className="flex justify-between items-start mb-2">
                <h4 className="m-0">Anonim</h4>
                <RatingStars rating={review.rating} />
              </div>
              <small className="text-[#6E5849]">{new Date(review.time).toLocaleString("id-ID")}</small>
              <p className="text-[#6E5849] mt-2">{review.text}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
