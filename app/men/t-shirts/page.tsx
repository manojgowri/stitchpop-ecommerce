"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Heart, Search, User, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const products = [
  {
    id: 1,
    name: "Men's Graphic Print T-shirt",
    price: 399,
    originalPrice: 899,
    discount: "55% OFF",
    rating: 4.5,
    image: "/placeholder.svg?height=300&width=250",
    fit: "BOYFRIEND FIT",
  },
  {
    id: 2,
    name: "Men's Vintage Graphic Tee",
    price: 499,
    originalPrice: 999,
    discount: "50% OFF",
    rating: 4.3,
    image: "/placeholder.svg?height=300&width=250",
    fit: "OVERSIZED FIT",
  },
  {
    id: 3,
    name: "Men's Street Style Print T-shirt",
    price: 599,
    originalPrice: 1399,
    discount: "57% OFF",
    rating: 4.6,
    image: "/placeholder.svg?height=300&width=250",
    fit: "OVERSIZED FIT",
  },
  {
    id: 4,
    name: "Men's Classic Fit T-shirt",
    price: 399,
    originalPrice: 899,
    discount: "55% OFF",
    rating: 4.5,
    image: "/placeholder.svg?height=300&width=250",
    fit: "BOYFRIEND FIT",
  },
  {
    id: 5,
    name: "Men's Neon Oversized T-shirt",
    price: 499,
    originalPrice: 999,
    discount: "50% OFF",
    rating: 4.4,
    image: "/placeholder.svg?height=300&width=250",
    fit: "OVERSIZED FIT",
  },
  {
    id: 6,
    name: "Men's Urban Print Tee",
    price: 549,
    originalPrice: 1199,
    discount: "54% OFF",
    rating: 4.2,
    image: "/placeholder.svg?height=300&width=250",
    fit: "REGULAR FIT",
  },
]

export default function MenTShirtsPage() {
  const [selectedFilter, setSelectedFilter] = useState("ALL")

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/women" className="text-lg font-medium hover:text-orange-600">
              WOMEN
            </Link>
            <Link href="/men" className="text-lg font-medium text-orange-600">
              MEN
            </Link>
          </div>
          <Link href="/" className="text-2xl font-bold">
            STITCH POP
          </Link>
          <div className="flex items-center space-x-4">
            <Search className="w-6 h-6" />
            <User className="w-6 h-6" />
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <div className="bg-yellow-400 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-8 text-sm font-medium">
            <button
              onClick={() => setSelectedFilter("ALL")}
              className={`px-4 py-2 rounded ${selectedFilter === "ALL" ? "bg-white text-black" : "text-black hover:bg-white hover:bg-opacity-20"}`}
            >
              MEN
            </button>
            <button
              onClick={() => setSelectedFilter("WOMEN")}
              className={`px-4 py-2 rounded ${selectedFilter === "WOMEN" ? "bg-white text-black" : "text-black hover:bg-white hover:bg-opacity-20"}`}
            >
              WOMEN
            </button>
            <span className="text-black">SHOP NOW</span>
            <span className="text-black">LIVE NOW</span>
            <span className="text-black">PLUS SIZE</span>
            <span className="text-black">ACCESSORIES</span>
            <span className="text-black">OFFICIAL MERCH</span>
            <span className="text-black">SNEAKERS</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">NEW ARRIVALS</h1>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-3">
                <Badge className="absolute top-2 left-2 z-10 bg-gray-600 text-white text-xs">{product.fit}</Badge>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={250}
                  height={300}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>

                <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>

                <div className="flex items-center space-x-2">
                  <span className="font-bold">₹{product.price}</span>
                  <span className="text-gray-500 line-through text-sm">₹{product.originalPrice}</span>
                  <span className="text-green-600 text-sm font-medium">{product.discount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
