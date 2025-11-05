"use client"

import { useState, useCallback, useEffect } from "react"
import type { KulinerFormData } from "@/lib/types"
import { validateKuliner } from "@/lib/validators"
import { getStorageItems, saveStorageItems, getDraft, saveDraft, clearDraft } from "@/lib/storage"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { kategoriData, provinsiKotaData } from "@/lib/mock-data"
import { RepeatableList } from "@/components/repeatable-list"
import { ImageUploadGrid } from "@/components/image-upload-grid"
import { MapPicker } from "@/components/map-picker"
import { AlertCircle, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface KulinerFormProps {
  editId?: string
}

const initialFormData: KulinerFormData = {
  nama: "",
  kategori: "",
  deskripsi: "",
  provinsi: "",
  kota: "",
  hargaMin: "",
  hargaMax: "",
  bahan: [""],
  langkah: [""],
  foto: [],
  lat: "",
  lng: "",
  status: "draft",
}

export function KulinerForm({ editId }: KulinerFormProps) {
  const [formData, setFormData] = useState<KulinerFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [mounted, setMounted] = useState(false)
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const debouncedSaveDraft = useCallback((data: KulinerFormData) => {
    const timer = setTimeout(() => {
      saveDraft(data)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setMounted(true)

    // Load existing item or draft
    if (editId) {
      const items = getStorageItems()
      const item = items.find((i) => i.id === editId)
      if (item) {
        setFormData({
          nama: item.nama,
          kategori: item.kategori,
          deskripsi: item.deskripsi,
          provinsi: item.provinsi,
          kota: item.kota,
          hargaMin: item.hargaMin?.toString() || "",
          hargaMax: item.hargaMax?.toString() || "",
          bahan: item.bahan,
          langkah: item.langkah,
          foto: item.foto,
          lat: item.lat?.toString() || "",
          lng: item.lng?.toString() || "",
          status: item.status,
        })
      }
    } else {
      // Check for draft on new form
      const draft = getDraft()
      if (draft) {
        const draftForm: KulinerFormData = {
          nama: draft.data.nama || "",
          kategori: draft.data.kategori || "",
          deskripsi: draft.data.deskripsi || "",
          provinsi: draft.data.provinsi || "",
          kota: draft.data.kota || "",
          hargaMin: draft.data.hargaMin?.toString() || "",
          hargaMax: draft.data.hargaMax?.toString() || "",
          bahan: draft.data.bahan || [""],
          langkah: draft.data.langkah || [""],
          foto: draft.data.foto || [],
          lat: draft.data.lat?.toString() || "",
          lng: draft.data.lng?.toString() || "",
          status: draft.data.status || "draft",
        }
        setFormData(draftForm)
        setHasRestoredDraft(true)
      }
    }
  }, [editId])

  useEffect(() => {
    if (mounted && !editId) {
      const cleanup = debouncedSaveDraft(formData)
      return cleanup
    }
  }, [formData, mounted, editId, debouncedSaveDraft])

  const handleInputChange = (field: keyof KulinerFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleBahanChange = (index: number, value: string) => {
    const newBahan = [...formData.bahan]
    newBahan[index] = value
    handleInputChange("bahan", newBahan)
  }

  const handleLangkahChange = (index: number, value: string) => {
    const newLangkah = [...formData.langkah]
    newLangkah[index] = value
    handleInputChange("langkah", newLangkah)
  }

  const handleAddBahan = () => {
    handleInputChange("bahan", [...formData.bahan, ""])
  }

  const handleRemoveBahan = (index: number) => {
    handleInputChange(
      "bahan",
      formData.bahan.filter((_, i) => i !== index),
    )
  }

  const handleAddLangkah = () => {
    handleInputChange("langkah", [...formData.langkah, ""])
  }

  const handleRemoveLangkah = (index: number) => {
    handleInputChange(
      "langkah",
      formData.langkah.filter((_, i) => i !== index),
    )
  }

  const handleSubmit = async (status: "draft" | "published") => {
    setSaving(true)

    const submitData = {
      ...formData,
      status,
      hargaMin: formData.hargaMin ? Number(formData.hargaMin) : undefined,
      hargaMax: formData.hargaMax ? Number(formData.hargaMax) : undefined,
      lat: formData.lat ? Number(formData.lat) : undefined,
      lng: formData.lng ? Number(formData.lng) : undefined,
    }

    const validationErrors = validateKuliner(submitData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setSaving(false)
      return
    }

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Save to storage
    const items = getStorageItems()
    if (editId) {
      const index = items.findIndex((i) => i.id === editId)
      if (index !== -1) {
        items[index] = {
          ...items[index],
          ...submitData,
          updatedAt: new Date().toISOString(),
        }
      }
    } else {
      items.push({
        id: Date.now().toString(),
        ...submitData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any)
    }

    saveStorageItems(items)
    clearDraft()

    // Show success toast
    toast({
      title: "Sukses!",
      description: `Kuliner ${status === "draft" ? "disimpan sebagai draft" : "dipublikasikan"}`,
      action: { label: "Kembali ke Dashboard", onClick: () => router.push("/umkm") },
    })

    setSaving(false)
    setTimeout(() => router.push("/umkm"), 1000)
  }

  const handleReset = () => {
    if (confirm("Hapus semua data form?")) {
      setFormData(initialFormData)
      clearDraft()
      setErrors({})
      toast({ title: "Form direset", description: "Semua data telah dihapus" })
    }
  }

  if (!mounted) return null

  const provinsiOptions = Object.keys(provinsiKotaData).map((key) => ({
    id: key,
    label: key
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  }))

  const kotaOptions = formData.provinsi
    ? provinsiKotaData[formData.provinsi]?.map((kota) => ({ id: kota, label: kota })) || []
    : []

  return (
    <div className="p-6 max-w-4xl">
      <Card className="bg-card rounded-2xl p-6 space-y-8">
        {/* Identitas Kuliner */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Identitas Kuliner</h2>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nama Kuliner <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.nama}
              onChange={(e) => handleInputChange("nama", e.target.value)}
              placeholder="Masukkan nama kuliner"
              className="bg-input text-foreground placeholder:text-muted-foreground"
            />
            {errors.nama && (
              <div className="flex items-center gap-2 mt-2 text-sm text-red-500">
                <AlertCircle size={16} />
                {errors.nama}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.kategori}
                onChange={(e) => handleInputChange("kategori", e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground"
              >
                <option value="">Pilih Kategori</option>
                {kategoriData.map((kat) => (
                  <option key={kat.id} value={kat.id}>
                    {kat.label}
                  </option>
                ))}
              </select>
              {errors.kategori && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-500">
                  <AlertCircle size={16} />
                  {errors.kategori}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-muted-foreground">{formData.deskripsi.length}/600</span>
            </div>
            <Textarea
              value={formData.deskripsi}
              onChange={(e) => handleInputChange("deskripsi", e.target.value)}
              placeholder="Deskripsikan kuliner Anda dengan detail"
              maxLength={600}
              rows={5}
              className="bg-input text-foreground placeholder:text-muted-foreground"
            />
            {errors.deskripsi && (
              <div className="flex items-center gap-2 mt-2 text-sm text-red-500">
                <AlertCircle size={16} />
                {errors.deskripsi}
              </div>
            )}
          </div>
        </section>

        {/* Lokasi & Harga */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Lokasi & Harga</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Provinsi <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.provinsi}
                onChange={(e) => {
                  handleInputChange("provinsi", e.target.value)
                  handleInputChange("kota", "")
                }}
                className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground"
              >
                <option value="">Pilih Provinsi</option>
                {provinsiOptions.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.label}
                  </option>
                ))}
              </select>
              {errors.provinsi && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-500">
                  <AlertCircle size={16} />
                  {errors.provinsi}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Kota <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.kota}
                onChange={(e) => handleInputChange("kota", e.target.value)}
                disabled={!formData.provinsi}
                className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground disabled:opacity-50"
              >
                <option value="">Pilih Kota</option>
                {kotaOptions.map((kota) => (
                  <option key={kota.id} value={kota.label}>
                    {kota.label}
                  </option>
                ))}
              </select>
              {errors.kota && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-500">
                  <AlertCircle size={16} />
                  {errors.kota}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Harga Minimal (Rp)</label>
              <Input
                type="number"
                value={formData.hargaMin}
                onChange={(e) => handleInputChange("hargaMin", e.target.value)}
                placeholder="0"
                min="0"
                className="bg-input text-foreground placeholder:text-muted-foreground"
              />
              {errors.hargaMin && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-500">
                  <AlertCircle size={16} />
                  {errors.hargaMin}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Harga Maksimal (Rp)</label>
              <Input
                type="number"
                value={formData.hargaMax}
                onChange={(e) => handleInputChange("hargaMax", e.target.value)}
                placeholder="0"
                min="0"
                className="bg-input text-foreground placeholder:text-muted-foreground"
              />
              {errors.hargaMax && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-500">
                  <AlertCircle size={16} />
                  {errors.hargaMax}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Bahan */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Bahan <span className="text-red-500">*</span>
            </h2>
            {errors.bahan && (
              <span className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.bahan}
              </span>
            )}
          </div>
          <RepeatableList
            items={formData.bahan}
            onItemChange={handleBahanChange}
            onAdd={handleAddBahan}
            onRemove={handleRemoveBahan}
            placeholder="Masukkan bahan..."
            addButtonLabel="Tambah Bahan"
          />
        </section>

        {/* Langkah */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Langkah <span className="text-red-500">*</span>
            </h2>
            {errors.langkah && (
              <span className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.langkah}
              </span>
            )}
          </div>
          <RepeatableList
            items={formData.langkah}
            onItemChange={handleLangkahChange}
            onAdd={handleAddLangkah}
            onRemove={handleRemoveLangkah}
            placeholder="Masukkan langkah..."
            addButtonLabel="Tambah Langkah"
            ordered
          />
        </section>

        {/* Foto */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Foto</h2>
          <ImageUploadGrid
            images={formData.foto}
            onImagesChange={(newImages) => handleInputChange("foto", newImages)}
          />
        </section>

        {/* Koordinat */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Koordinat (Opsional)</h2>
          <MapPicker
            lat={formData.lat}
            lng={formData.lng}
            onLocationChange={(lat, lng) => {
              handleInputChange("lat", lat)
              handleInputChange("lng", lng)
            }}
          />
        </section>

        {/* Status */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Status</h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={formData.status === "draft"}
                onChange={() => handleInputChange("status", "draft")}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-foreground">Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="published"
                checked={formData.status === "published"}
                onChange={() => handleInputChange("status", "published")}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-foreground">Dipublikasikan</span>
            </label>
          </div>
        </section>

        {/* Buttons */}
        <div className="flex gap-4 pt-6 border-t border-border flex-col sm:flex-row">
          <Button
            onClick={() => handleSubmit(formData.status)}
            disabled={saving}
            className="flex-1 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Check size={18} />
                Simpan {formData.status === "draft" ? "sebagai Draft" : ""}
              </>
            )}
          </Button>
          <Button onClick={handleReset} disabled={saving} variant="outline" className="flex-1 bg-transparent">
            Reset Form
          </Button>
        </div>

        {hasRestoredDraft && (
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 text-sm text-accent">
            ✓ Draft sebelumnya telah dipulihkan
          </div>
        )}
      </Card>
    </div>
  )
}
