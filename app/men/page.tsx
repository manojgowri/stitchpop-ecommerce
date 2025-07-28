"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image_url: string
  rating: number
  category: string
}

interface Category {
  name: string
  slug: string
  image: string
  count: number
}

export default function MenPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const categories: Category[] = [
    {
      name: "T-Shirts",
      slug: "t-shirts",
      image: "/placeholder.svg?height=200&width=300&text=T-Shirts",
      count: 45,
    },
    {
      name: "Shirts",
      slug: "shirts",
      image: "/placeholder.svg?height=200&width=300&text=Shirts",
      count: 32,
    },
    {
      name: "Jeans",
      slug: "jeans",
      image: "/placeholder.svg?height=200&width=300&text=Jeans",
      count: 28,
    },
    {
      name: "Jackets",
      slug: "jackets",
      image: "/placeholder.svg?height=200&width=300&text=Jackets",
      count: 15,
    },
  ]

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(
        "https://stitchpop-ecommerce.onrender.com/api/products?gender=men&featured=true&limit=8",
      )
      if (response.ok) {
        const data = await response.json()
        setFeaturedProducts(data)
      } else {
        // Fallback data
        setFeaturedProducts([
          {
            id: "1",
            name: "Classic Cotton T-Shirt",
            price: 399,
            originalPrice: 899,
            image_url: "/placeholder.svg?height=300&width=250&text=Men's+T-shirt",
            rating: 4.5,
            category: "t-shirts",
          },
          {
            id: "2",
            name: "Denim Casual Shirt",
            price: 799,
            originalPrice: 1299,
            image_url: "/placeholder.svg?height=300&width=250&text=Men's+Shirt",
            rating: 4.3,
            category: "shirts",
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching featured products:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Men's
                <span className="block text-orange-400">Collection</span>
              </h1>
              <p className="text-xl text-gray-300">
                Discover premium fashion for the modern man. From casual wear to formal attire, find your perfect style.
              </p>
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                Shop Now
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=400&text=Men's+Fashion"
                alt="Men's Fashion"
                width={400}
                height={500}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.slug} href={`/men/${category.slug}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300">
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-white text-xl font-bold">{category.name}</h3>
                        <p className="text-white text-sm">{category.count} items</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 text-lg">Handpicked favorites from our men's collection</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="animate-pulse">
                    <div className="h-64 bg-gray-300"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      width={250}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 ml-1">({product.rating})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <Button size="sm" asChild>
                        <Link href={`/product/${product.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/men/all">View All Men's Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
