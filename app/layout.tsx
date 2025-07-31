import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Stitch POP - Premium Fashion & Lifestyle",
  description:
    "Premium fashion and lifestyle brand offering the latest trends in clothing for men and women. Quality, style, and comfort in every piece.",
  keywords: "fashion, clothing, men, women, premium, lifestyle, trendy, quality",
  authors: [{ name: "Stitch POP" }],
  creator: "Stitch POP",
  publisher: "Stitch POP",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://stitchpop.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Stitch POP - Premium Fashion & Lifestyle",
    description: "Premium fashion and lifestyle brand offering the latest trends in clothing for men and women.",
    url: "https://stitchpop.vercel.app",
    siteName: "Stitch POP",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=Stitch+POP",
        width: 1200,
        height: 630,
        alt: "Stitch POP - Premium Fashion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stitch POP - Premium Fashion & Lifestyle",
    description: "Premium fashion and lifestyle brand offering the latest trends in clothing for men and women.",
    images: ["/placeholder.svg?height=630&width=1200&text=Stitch+POP"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "2dIuLHsZ-VrZVK1ZQTAuLFqT7eaP7hameErs36wo7VI",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="2dIuLHsZ-VrZVK1ZQTAuLFqT7eaP7hameErs36wo7VI" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
