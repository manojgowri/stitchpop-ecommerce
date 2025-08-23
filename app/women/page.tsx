"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import ProductCard from "@/components/product-card"

interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  images: string[]
  rating: number
  category: string
}

interface Category {
  id: string
  name: string
  slug: string
  image: string
  count: number
}

export default function WomenPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select(`
          id,
          name
        `)
        .eq("gender", "women")
        .eq("is_active", true)

      if (categoriesError) throw categoriesError

      // Get product counts for each category separately
      const categoriesWithCounts = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const { count } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("gender", "women")
            .eq("is_active", true)
            .in("category_id", [category.id])

          return {
            id: category.id,
            name: category.name,
            slug: category.name.toLowerCase().replace(/\s+/g, "-"),
            image: `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(category.name)}`,
            count: count || 0,
          }
        }),
      )

      setCategories(categoriesWithCounts)

      // Fetch featured products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("gender", "women")
        .eq("is_active", true)
        .limit(8)

      if (productsError) throw productsError

      setFeaturedProducts(productsData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      // Fallback data
      setCategories([
        {
          id: "1",
          name: "Dresses",
          slug: "dresses",
          image: "/placeholder.svg?height=200&width=300&text=Dresses",
          count: 1,
        },
        {
          id: "2",
          name: "Tops",
          slug: "tops",
          image: "/placeholder.svg?height=200&width=300&text=Tops",
          count: 0,
        },
        {
          id: "3",
          name: "Jeans",
          slug: "jeans",
          image: "/placeholder.svg?height=200&width=300&text=Women's+Jeans",
          count: 0,
        },
        {
          id: "4",
          name: "Jackets",
          slug: "jackets",
          image: "/placeholder.svg?height=200&width=300&text=Women's+Jackets",
          count: 0,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to add items to cart",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      })

      if (response.ok) {
        toast({
          title: "Added to cart",
          description: "Item has been added to your cart",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  const handleAddToWishlist = async (productId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to add items to wishlist",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Added to wishlist",
        description: "Item has been added to your wishlist",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-800 to-gray-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Women's
                <span className="block text-gray-300">Collection</span>
              </h1>
              <p className="text-xl text-gray-200">
                Embrace your style with our curated collection of women's fashion. From elegant dresses to casual wear.
              </p>
              <Button size="lg" className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                Shop Now
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=400&text=Women's+Fashion"
                alt="Women's Fashion"
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
              <Link key={category.slug} href={`/women/${category.slug}`}>
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
            <p className="text-gray-600 text-lg">Handpicked favorites from our women's collection</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    original_price: product.original_price,
                    images: product.images,
                    rating: product.rating,
                    is_on_sale: !!(product.original_price && product.original_price > product.price),
                  }}
                />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/women/all">View All Women's Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
