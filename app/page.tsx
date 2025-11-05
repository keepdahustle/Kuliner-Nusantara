import Header from "@/components/header"
import Breadcrumb from "@/components/breadcrumb"
import KulinerDetail from "@/components/kuliner-detail"
import ReviewsSection from "@/components/reviews-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Breadcrumb nama="Rendang Sapi Asli Padang" />
        <KulinerDetail />
        <ReviewsSection />
      </main>
      <Footer />
    </>
  )
}
