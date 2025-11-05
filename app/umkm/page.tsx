"use client"

import { UmkmShell } from "@/components/umkm-shell"
import { getStorageItems } from "@/lib/storage"
import { useState, useEffect } from "react"
import type { Kuliner } from "@/lib/types"
import { UmkmDashboard } from "./dashboard"

export default function UmkmPage() {
  const [items, setItems] = useState<Kuliner[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = getStorageItems()
    setItems(stored)
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <UmkmShell title="Dashboard UMKM" showAddButton>
      <UmkmDashboard initialItems={items} onItemsChange={setItems} />
    </UmkmShell>
  )
}
