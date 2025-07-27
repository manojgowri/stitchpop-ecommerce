"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedColor, setSelectedColor] = useState("sage")
  const [selectedSize, setSelectedSize] = useState("S")
  const [showCharacteristics, setShowCharacteristics] = useState(true)
  const [showPayment, setShowPayment] = useState(false)

  const colors = [
    { name: "sage", color: "bg-green-200" },
    { name: "pink", color: "bg-pink-200" },
  ]

  const sizes = ["XS", "S", "M", "L", "XL"]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/women" className="text-sm font-medium hover:text-gray-600">
              WOMEN
            </Link>
            <Link href="/men" className="text-sm font-medium hover:text-gray-600">
              MEN
            </Link>
            <Link href="/kids" className="text-sm font-medium hover:text-gray-600">
              KIDS
            </Link>
            <Link href="/brands" className="text-sm font-medium hover:text-gray-600">
              BRANDS
            </Link>
          </div>
          <Link href="/" className="text-xl font-bold">
            STITCH POP
          </Link>
          <div className="flex items-center space-x-4">
            <Heart className="w-5 h-5" />
            <div className="relative">
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xs">4</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Stitch Pop Logo-Print Crew-Neck Sweatshirt"
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square overflow-hidden rounded-lg">
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Back view"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg">
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Model wearing sweatshirt"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">STITCH POP LOGO-PRINT CREW-NECK SWEATSHIRT</h1>
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-red-600">£595.00</span>
                <span className="text-lg text-gray-500 line-through">£670.00</span>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Hinting at the brand's penchant for logomania, Stitch Pop presents this sweatshirt as part of its SS23
              offering. Crafted from cotton, the long-sleeved design is adorned with a contrasting logo print at the
              chest.
            </p>

            {/* Color Selection */}
            <div>
              <h3 className="font-medium mb-3">Color</h3>
              <div className="flex space-x-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full ${color.color} border-2 ${
                      selectedColor === color.name ? "border-black" : "border-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Size</h3>
                <Link href="#" className="text-sm text-gray-600 underline">
                  What's my size?
                </Link>
              </div>
              <div className="flex space-x-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button className="flex-1 bg-black text-white hover:bg-gray-800 py-3">ADD TO CART</Button>
              <Button variant="outline" className="px-6 py-3 bg-transparent">
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Characteristics */}
            <div className="border-t pt-6">
              <button
                onClick={() => setShowCharacteristics(!showCharacteristics)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="font-medium">Characteristics</h3>
                {showCharacteristics ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showCharacteristics && (
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand</span>
                    <span>Stitch Pop</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Collection</span>
                    <span>2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item no.</span>
                    <span>21324862</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material</span>
                    <span>Cotton 100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Care recommendations</span>
                    <span>Machine wash</span>
                  </div>
                </div>
              )}
            </div>

            {/* Payment & Delivery */}
            <div className="border-t pt-6">
              <button
                onClick={() => setShowPayment(!showPayment)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="font-medium">Payment & Delivery</h3>
                {showPayment ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showPayment && (
                <div className="mt-4 text-sm text-gray-600">
                  <p>Free delivery on orders over £200</p>
                  <p>Express delivery available</p>
                  <p>30-day return policy</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
