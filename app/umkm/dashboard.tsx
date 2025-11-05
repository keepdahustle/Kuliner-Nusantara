"use client"

import { useState, useMemo } from "react"
import type { Kuliner } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { saveStorageItems } from "@/lib/storage"
import { StatusBadge } from "@/components/status-badge"
import Image from "next/image"
import { useMedia } from "@/lib/use-media"

interface UmkmDashboardProps {
  initialItems: Kuliner[]
  onItemsChange: (items: Kuliner[]) => void
}

export function UmkmDashboard({ initialItems, onItemsChange }: UmkmDashboardProps) {
  const [items, setItems] = useState(initialItems)
  const [search, setSearch] = useState("")
  const [filterKategori, setFilterKategori] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string>("")
  const isMobile = useMedia("(max-width: 768px)")

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.nama.toLowerCase().includes(search.toLowerCase())
      const matchesKategori = !filterKategori || item.kategori === filterKategori
      const matchesStatus = !filterStatus || item.status === filterStatus
      return matchesSearch && matchesKategori && matchesStatus
    })
  }, [items, search, filterKategori, filterStatus])

  const handleDelete = (id: string) => {
    if (confirm("Hapus kuliner ini?")) {
      const updated = items.filter((item) => item.id !== id)
      setItems(updated)
      saveStorageItems(updated)
      onItemsChange(updated)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="w-32 h-32 opacity-20 mb-6">
          <Image src="/Logo-Kuliner-Nusantara.png" alt="Logo" width={128} height={128} className="w-full" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Belum ada kuliner</h2>
        <p className="text-muted-foreground mb-6 text-center">
          Mulai dengan menambahkan kuliner pertama Anda ke portal
        </p>
        <Link href="/umkm/tambah">
          <Button className="bg-primary text-primary-foreground">Tambah Kuliner Pertama</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Cari kuliner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-card border-border"
          />
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="px-3 py-2 rounded-md bg-card border border-border text-foreground"
          >
            <option value="">Semua Kategori</option>
            <option value="makanan-utama">Makanan Utama</option>
            <option value="makanan-ringan">Makanan Ringan</option>
            <option value="minuman">Minuman</option>
            <option value="dessert">Dessert</option>
            <option value="bumbu-saus">Bumbu & Saus</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-md bg-card border border-border text-foreground"
          >
            <option value="">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="published">Dipublikasikan</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Tidak ada kuliner yang sesuai dengan filter</div>
      ) : isMobile ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((item) => (
            <Card key={item.id} className="rounded-2xl p-4 bg-card hover:shadow-lg transition-shadow">
              {item.foto[0] && (
                <div className="relative h-40 mb-3 rounded-lg overflow-hidden">
                  <Image src={item.foto[0] || "/placeholder.svg"} alt={item.nama} fill className="object-cover" />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground text-sm line-clamp-2">{item.nama}</h3>
                  <StatusBadge status={item.status} />
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">{item.deskripsi}</p>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="line-clamp-1">
                    <strong>📍</strong> {item.kota}
                  </p>
                  {item.hargaMin && item.hargaMax && (
                    <p>
                      <strong>💰</strong> Rp{item.hargaMin.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex gap-1 pt-2">
                  <Link href={`/umkm/${item.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                      <Edit size={14} />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 text-destructive text-xs"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Nama</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Kategori</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Lokasi</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Harga</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={item.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground font-medium">{item.nama}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.kategori.replace(/-/g, " ")}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.kota}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {item.hargaMin && item.hargaMax
                      ? `Rp${item.hargaMin.toLocaleString()} - Rp${item.hargaMax.toLocaleString()}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/umkm/${item.id}/edit`}>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
