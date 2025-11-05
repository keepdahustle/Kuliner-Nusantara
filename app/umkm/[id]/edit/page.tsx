"use client"

import { UmkmShell } from "@/components/umkm-shell"
import { KulinerForm } from "../../kuliner-form"
import { useParams } from "next/navigation"

export default function EditPage() {
  const params = useParams()
  const id = params.id as string

  return (
    <UmkmShell title="Edit Kuliner">
      <KulinerForm editId={id} />
    </UmkmShell>
  )
}
