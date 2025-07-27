"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, User, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200">
      {/* Header */}
      <header className="bg-transparent p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div
              className="relative"
              onMouseEnter={() => setHoveredSection("women")}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <Link href="/women" className="text-lg font-medium hover:text-orange-600 transition-colors">
                WOMEN
              </Link>
              {hoveredSection === "women" && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg p-4 z-50 min-w-[200px]">
                  <div className="space-y-2">
                    <Link href="/women/tops" className="block hover:text-orange-600">
                      Tops
                    </Link>
                    <Link href="/women/bottoms" className="block hover:text-orange-600">
                      Bottoms
                    </Link>
                    <Link href="/women/dresses" className="block hover:text-orange-600">
                      Dresses
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div
              className="relative"
              onMouseEnter={() => setHoveredSection("men")}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <Link href="/men" className="text-lg font-medium hover:text-orange-600 transition-colors">
                MEN
              </Link>
              {hoveredSection === "men" && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg p-4 z-50 min-w-[200px]">
                  <div className="space-y-2">
                    <Link href="/men/t-shirts" className="block hover:text-orange-600">
                      T-Shirts
                    </Link>
                    <Link href="/men/pants" className="block hover:text-orange-600">
                      Pants
                    </Link>
                    <Link href="/men/baggy-pants" className="block hover:text-orange-600">
                      Baggy Pants
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="text-2xl font-bold text-white">
              STITCH POP
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Search className="w-6 h-6 cursor-pointer hover:text-orange-600 transition-colors" />
            <User className="w-6 h-6 cursor-pointer hover:text-orange-600 transition-colors" />
            <div className="relative">
              <ShoppingCart className="w-6 h-6 cursor-pointer hover:text-orange-600 transition-colors" />
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-0 h-[70vh]">
            {/* Women Section */}
            <div className="relative group overflow-hidden">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Women's Collection"
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300">
                <div className="absolute bottom-8 left-8">
                  <h2 className="text-4xl font-bold text-white mb-4">WOMEN</h2>
                  <Link href="/women">
                    <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-full font-medium">
                      SHOP NOW
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Men Section */}
            <div className="relative group overflow-hidden">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Men's Collection"
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300">
                <div className="absolute bottom-8 right-8">
                  <h2 className="text-4xl font-bold text-white mb-4">MEN</h2>
                  <Link href="/men">
                    <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-full font-medium">
                      SHOP NOW
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
