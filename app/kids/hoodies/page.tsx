"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import ProductCard from "@/components/product-card"

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

export default function KidsHoodiesPage() {
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
        .eq("name", "Hoodies")
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
          <p className="mt-4 text-gray-600">Loading kids hoodies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-100 to-red-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">Kids Hoodies</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cozy and comfortable hoodies to keep your kids warm and stylish
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
                <span className="text-gray-800">Hoodies</span>
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
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Hoodies Available</h2>
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
