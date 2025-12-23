"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, BadgeCheck, FileText, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react"
import { postToApi } from "@/lib/data"

export default function UMKMAuthPage() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [fieldErrors, setFieldErrors] = useState<any>({}) // Buat nampung error per kolom
  const router = useRouter()

  const [regData, setRegData] = useState({
    name: "", email: "", password: "",
    nama_usaha: "", nik_ktp: "", npwp: "", kategori_usaha: "Makanan Berat"
  })

  const [loginData, setLoginData] = useState({ email: "", password: "" })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg({ type: "", text: "" })
    setFieldErrors({})

    const res = await postToApi("/register/umkm", regData)
    
    if (res.success) {
      setMsg({ type: "success", text: res.message })
      // Reset form kalau sukses
      setRegData({ name: "", email: "", password: "", nama_usaha: "", nik_ktp: "", npwp: "", kategori_usaha: "Makanan Berat" })
    } else {
      // Jika ada error validasi dari Laravel
      if (res.errors) {
        setFieldErrors(res.errors)
        setMsg({ type: "error", text: "Perbaiki kesalahan pada form di bawah." })
      } else {
        setMsg({ type: "error", text: res.message || "Gagal mendaftar." })
      }
    }
    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg({ type: "", text: "" })
    
    const res = await postToApi("/login", loginData)
    if (res.success) {
      localStorage.setItem("auth_token", res.token)
      localStorage.setItem("user_role", res.role)
      localStorage.setItem("umkm_logged_in", "true")
      router.push("/umkm")
    } else {
      setMsg({ type: "error", text: res.message })
    }
    setLoading(false)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f4e8d1] flex flex-col items-center justify-center p-6 py-20 font-sans">
        <div className="text-center mb-10 max-w-lg">
          <div className="bg-[#4e5b31]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
            <Store className="text-[#4e5b31] w-10 h-10" />
          </div>
          <h1 className="font-serif text-4xl text-[#3b2f2f] font-bold">Portal Mitra UMKM</h1>
        </div>

        {msg.text && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 max-w-xl w-full border ${msg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            <AlertCircle size={20} />
            <p className="font-bold text-sm">{msg.text}</p>
          </div>
        )}

        <Tabs defaultValue="register" className="w-full max-w-xl">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#4e5b31]/10 h-14 p-1 rounded-2xl">
            <TabsTrigger value="login" className="rounded-xl font-bold">Masuk Mitra</TabsTrigger>
            <TabsTrigger value="register" className="rounded-xl font-bold">Daftar Mitra Baru</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="p-8 bg-white rounded-3xl shadow-xl border-none">
              <form onSubmit={handleLogin} className="space-y-5">
                <Input type="email" placeholder="Email Bisnis" className="py-6" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} required />
                <Input type="password" placeholder="Password" className="py-6" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} required />
                <Button disabled={loading} className="w-full py-7 bg-[#4e5b31] text-white font-bold rounded-xl text-lg">
                  {loading ? "Memproses..." : "Buka Dashboard"}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="p-8 bg-white rounded-3xl shadow-xl border-none">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input placeholder="Nama Lengkap" value={regData.name} onChange={(e) => setRegData({...regData, name: e.target.value})} required />
                    {fieldErrors.name && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.name[0]}</p>}
                  </div>
                  <div>
                    <Input placeholder="Nama Usaha" value={regData.nama_usaha} onChange={(e) => setRegData({...regData, nama_usaha: e.target.value})} required />
                    {fieldErrors.nama_usaha && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.nama_usaha[0]}</p>}
                  </div>
                </div>

                <div>
                  <Input type="email" placeholder="Email Aktif" value={regData.email} onChange={(e) => setRegData({...regData, email: e.target.value})} required />
                  {fieldErrors.email && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.email[0]}</p>}
                </div>

                <div>
                  <div className="relative">
                    <BadgeCheck className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <Input placeholder="NIK KTP (16 Digit)" className="pl-10" value={regData.nik_ktp} onChange={(e) => setRegData({...regData, nik_ktp: e.target.value})} required maxLength={16} />
                  </div>
                  {fieldErrors.nik_ktp && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.nik_ktp[0]}</p>}
                </div>

                <div>
                  <div className="relative">
                    <FileText className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <Input placeholder="NPWP Usaha" className="pl-10" value={regData.npwp} onChange={(e) => setRegData({...regData, npwp: e.target.value})} />
                  </div>
                  {fieldErrors.npwp && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.npwp[0]}</p>}
                </div>

                <div>
                  <Input type="password" placeholder="Buat Password (Min. 8 Karakter)" value={regData.password} onChange={(e) => setRegData({...regData, password: e.target.value})} required />
                  {fieldErrors.password && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.password[0]}</p>}
                </div>

                <Button disabled={loading} className="w-full py-7 bg-[#4e5b31] hover:bg-[#3a4323] text-white font-bold rounded-xl text-lg flex gap-2">
                  {loading ? "Mendaftar..." : <>Daftar Mitra <ArrowRight size={20} /></>}
                </Button>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </>
  )
}