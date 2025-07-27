import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Stitch POP - Modern Clothing Brand",
  description:
    "Discover trendy t-shirts, pants, and baggy pants at Stitch POP. Premium quality clothing for men and women.",
  keywords: "clothing, fashion, t-shirts, pants, baggy pants, streetwear, men, women",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
