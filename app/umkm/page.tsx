"use client"

import { UmkmShell } from "@/components/umkm-shell"
import { getStorageItems } from "@/lib/storage"
import { useState, useEffect } from "react"
import type { Kuliner } from "@/lib/types"
import { UmkmDashboard } from "./dashboard"
import { useRouter } from "next/navigation"

export default function UmkmPage() {
  const [items, setItems] = useState<Kuliner[]>([])
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const stored = getStorageItems()
    setItems(stored)
    setMounted(true)
  }, [])

  useEffect(() => {
    // check login and role
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

  if (!mounted) {
    return null
  }

  return (
    <UmkmShell title="Dashboard UMKM" showAddButton>
      <UmkmDashboard initialItems={items} onItemsChange={setItems} />
    </UmkmShell>
  )
}
