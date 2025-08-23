"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Category {
  id: string
  name: string
  description: string
}

export default function KidsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch kids categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .eq("gender", "kids")
          .eq("is_active", true)
          .order("name")

        if (categoriesError) throw categoriesError

        // Fetch featured kids products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("gender", "kids")
          .eq("is_active", true)
          .eq("is_featured", true)
          .limit(8)

        if (productsError) throw productsError

        setCategories(categoriesData || [])
        setFeaturedProducts(productsData || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading kids collection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-100 to-gray-200 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-4">Kids Collection</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comfortable and stylish clothing for your little ones
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Find exactly what you're looking for</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/kids/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group"
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={`/placeholder_image.png?height=300&width=400&text=${category.name}`}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold">{category.name}</h3>
                        <p className="text-white/90">{category.description}</p>
                        <Button variant="secondary" className="mt-4">
                          Shop Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
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
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Featured Products</h2>
              <p className="text-gray-600 text-lg">Popular items for kids</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`} className="group">
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                    <div className="relative aspect-square">
                      <Image
                        src={product.images?.[0] || "/placeholder.svg?height=300&width=300&text=Product"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.is_on_sale && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-semibold group-hover:text-gray-800 transition-colors">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">₹{product.price?.toLocaleString()}</span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-sm text-gray-600 line-through">
                            ₹{product.original_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
