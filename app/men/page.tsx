"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import ProductCard from "@/components/product-card"

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
  id: string
  name: string
  image_url?: string
  product_count?: number
}

export default function MenPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchFeaturedProducts()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select(`
        *,
        products!inner(count)
      `)
        .eq("gender", "men")
        .eq("is_active", true)

      if (error) throw error

      // Process the data to get product counts
      const categoriesWithCounts = await Promise.all(
        (data || []).map(async (category) => {
          const { count } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("category_id", category.id)
            .eq("gender", "men")
            .eq("is_active", true)

          return {
            ...category,
            product_count: count || 0,
          }
        }),
      )

      setCategories(categoriesWithCounts)
    } catch (error) {
      console.error("Error fetching categories:", error)
      // Fallback to static categories
      setCategories([
        {
          id: "1",
          name: "T-Shirts",
          image_url: "/placeholder.svg?height=200&width=300&text=T-Shirts",
          product_count: 45,
        },
        {
          id: "2",
          name: "Shirts",
          image_url: "/placeholder.svg?height=200&width=300&text=Shirts",
          product_count: 32,
        },
        {
          id: "3",
          name: "Jeans",
          image_url: "/placeholder.svg?height=200&width=300&text=Jeans",
          product_count: 28,
        },
        {
          id: "4",
          name: "Jackets",
          image_url: "/placeholder.svg?height=200&width=300&text=Jackets",
          product_count: 15,
        },
      ])
    }
  }

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch("/api/products?gender=men&featured=true&limit=8")
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
              <Link key={category.id} href={`/men/${category.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative overflow-hidden">
                    <Image
                      src={
                        category.image_url ||
                        "/placeholder.svg?height=200&width=300&text=" + encodeURIComponent(category.name) ||
                        "/placeholder.svg"
                      }
                      alt={category.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300">
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-white text-xl font-bold">{category.name}</h3>
                        <p className="text-white text-sm">{category.product_count || 0} items</p>
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
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    original_price: product.originalPrice,
                    images: [product.image_url],
                    rating: product.rating,
                    is_on_sale: !!(product.originalPrice && product.originalPrice > product.price),
                  }}
                />
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
