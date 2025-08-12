"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Eye } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  original_price: number | null
  images: string[]
  rating: number
  is_on_sale: boolean
  sizes: string[]
  colors: string[]
}

export default function KidsShirtsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("name")
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Shirts")
        .eq("gender", "kids")
        .single()

      if (categoryError) throw categoryError

      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", categoryData.id)
        .eq("is_active", true)
        .order(sortBy)

      if (productsError) throw productsError

      setProducts(productsData || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to add items to cart",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("cart").insert([
        {
          user_id: session.user.id,
          product_id: productId,
          quantity: 1,
        },
      ])

      if (error) throw error

      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  const addToWishlist = async (productId: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to add items to wishlist",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("wishlist").insert([
        {
          user_id: session.user.id,
          product_id: productId,
        },
      ])

      if (error) throw error

      toast({
        title: "Added to wishlist",
        description: "Item has been added to your wishlist",
      })
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading kids shirts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-100 to-purple-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">Kids Shirts</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comfortable and stylish shirts for your little ones
            </p>
            <div className="mt-6">
              <nav className="text-sm text-gray-600">
                <Link href="/" className="hover:text-gray-800">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link href="/kids" className="hover:text-gray-800">
                  Kids
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-800">Shirts</span>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filter and Sort */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{products.length} products found</span>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="group relative">
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                    <div className="relative aspect-square">
                      <Image
                        src={product.images?.[0] || "/placeholder.svg?height=300&width=300&text=Kids+Shirt"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.is_on_sale && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}

                      {/* Product Actions Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="secondary" asChild>
                            <Link href={`/product/${product.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => addToWishlist(product.id)}>
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => addToCart(product.id)}>
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-semibold group-hover:text-gray-800 transition-colors">{product.name}</h3>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">({product.rating || 0})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">₹{product.price?.toLocaleString()}</span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-sm text-gray-600 line-through">
                            ₹{product.original_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                          <Link href={`/product/${product.id}`}>View</Link>
                        </Button>
                        <Button size="sm" className="flex-1 bg-gray-800 text-white hover:bg-gray-700">
                          Buy Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Shirts Available</h2>
              <p className="text-gray-600 mb-8">Check back soon for new arrivals!</p>
              <Button asChild className="bg-gray-800 text-white hover:bg-gray-700">
                <Link href="/kids">Browse All Kids Items</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
