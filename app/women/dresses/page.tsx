"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import ProductCard from "@/components/product-card"

interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  images: string[]
  rating: number
  sizes: string[]
  colors: string[]
  stock: number
  is_on_sale: boolean
  categories: {
    name: string
    gender: string
  }
}

export default function WomenDressesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("featured")

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    sortProducts()
  }, [products, sortBy])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories!inner(name, gender)
        `)
        .eq("categories.name", "Dresses")
        .eq("categories.gender", "women")
        .eq("is_active", true)

      if (error) throw error

      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching dresses:", error)
      setProducts([
        {
          id: "1",
          name: "Floral Summer Dress",
          description: "Beautiful floral print dress perfect for summer occasions",
          price: 1599,
          original_price: 2199,
          images: ["/placeholder.svg?height=400&width=300&text=Floral+Dress"],
          rating: 4.6,
          sizes: ["XS", "S", "M", "L"],
          colors: ["Pink", "Blue", "White"],
          stock: 30,
          is_on_sale: true,
          categories: {
            name: "Dresses",
            gender: "women",
          },
        },
        {
          id: "2",
          name: "Little Black Dress",
          description: "Elegant black dress suitable for formal events",
          price: 2899,
          original_price: 3799,
          images: ["/placeholder.svg?height=400&width=300&text=Black+Dress"],
          rating: 4.8,
          sizes: ["XS", "S", "M", "L"],
          colors: ["Black"],
          stock: 20,
          is_on_sale: true,
          categories: {
            name: "Dresses",
            gender: "women",
          },
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const sortProducts = () => {
    const sorted = [...products]

    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        sorted.sort((a, b) => b.id.localeCompare(a.id))
        break
      default:
        // Keep original order for featured
        break
    }

    setFilteredProducts(sorted)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dresses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">Women's Dresses</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Elegant dresses for every occasion - from casual to formal
            </p>
            <div className="mt-6">
              <nav className="text-sm text-gray-600">
                <Link href="/" className="hover:text-gray-800">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link href="/women" className="hover:text-gray-800">
                  Women
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-800">Dresses</span>
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
              <span className="text-gray-600">{filteredProducts.length} products found</span>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Dresses Available</h2>
              <p className="text-gray-600 mb-8">Check back soon for new arrivals!</p>
              <Button asChild className="bg-gray-800 text-white hover:bg-gray-700">
                <Link href="/women">Browse All Women's Items</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
