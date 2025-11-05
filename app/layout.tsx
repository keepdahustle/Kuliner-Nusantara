import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kuliner Nusantara Indonesia - Portal UMKM",
  description: "Portal UMKM untuk mengelola dan mempromosikan kuliner Indonesia",
  generator: "v0.app",
  openGraph: {
    title: "Kuliner Nusantara Indonesia - Portal UMKM",
    description: "Portal UMKM untuk mengelola dan mempromosikan kuliner Indonesia",
    images: [
      {
        url: "/Logo-Kuliner-Nusantara.png",
        width: 1200,
        height: 1200,
        alt: "Kuliner Nusantara Logo",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
