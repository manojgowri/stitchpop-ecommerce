"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"
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

// TEMPLATE PAGE FOR NEW PRODUCT CATEGORIES
// TO ADD A NEW CATEGORY:
// 1. Copy this file to the appropriate folder (e.g., men/new-category/page.tsx or women/new-category/page.tsx)
// 2. Update the category name in the database query (line 45)
// 3. Update the gender in the database query (line 46)
// 4. Update the page title and description (lines 85-88)
// 5. Update the breadcrumb navigation (lines 95-102)
// 6. Update the fallback data category names (lines 60-61, 78-79)
// 7. Update the "No products" section text (lines 140-143)

export default function WomenBaggyPantsPage() {
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
        // CHANGE THIS: Update category name for your new product type
        .eq("categories.name", "Baggy Pants")
        // CHANGE THIS: Update gender (men/women/kids)
        .eq("categories.gender", "women")
        .eq("is_active", true)

      if (error) throw error

      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching baggy pants:", error)
      // FALLBACK DATA - Update this with sample products for your category
      setProducts([
        {
          id: "1",
          name: "Relaxed Fit Baggy Pants",
          description: "Comfortable baggy pants perfect for casual wear",
          price: 1299,
          original_price: 1899,
          images: ["/placeholder.svg?height=400&width=300&text=Baggy+Pants"],
          rating: 4.4,
          sizes: ["XS", "S", "M", "L", "XL"],
          colors: ["Black", "Beige", "Olive"],
          stock: 25,
          is_on_sale: true,
          // UPDATE THESE: Category name and gender
          categories: {
            name: "Baggy Pants",
            gender: "women",
          },
        },
        {
          id: "2",
          name: "Wide Leg Cargo Pants",
          description: "Trendy wide leg cargo pants with multiple pockets",
          price: 1599,
          original_price: 2299,
          images: ["/placeholder.svg?height=400&width=300&text=Cargo+Pants"],
          rating: 4.6,
          sizes: ["XS", "S", "M", "L", "XL"],
          colors: ["Khaki", "Black", "Navy"],
          stock: 18,
          is_on_sale: true,
          // UPDATE THESE: Category name and gender
          categories: {
            name: "Baggy Pants",
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
          {/* UPDATE THIS: Loading text for your category */}
          <p className="mt-4 text-gray-600">Loading baggy pants...</p>
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
            {/* UPDATE THESE: Page title and description */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">Women's Baggy Pants</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comfortable and stylish baggy pants for the modern woman
            </p>
            <div className="mt-6">
              <nav className="text-sm text-gray-600">
                <Link href="/" className="hover:text-gray-800">
                  Home
                </Link>
                <span className="mx-2">/</span>
                {/* UPDATE THIS: Parent category link */}
                <Link href="/women" className="hover:text-gray-800">
                  Women
                </Link>
                <span className="mx-2">/</span>
                {/* UPDATE THIS: Current category name */}
                <span className="text-gray-800">Baggy Pants</span>
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
              <Filter className="h-5 w-5 text-gray-600" />
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

          {/* Products Grid - Uses consistent ProductCard component */}
          {filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              {/* UPDATE THESE: No products message */}
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Baggy Pants Available</h2>
              <p className="text-gray-600 mb-8">Check back soon for new arrivals!</p>
              <Button asChild className="bg-gray-800 text-white hover:bg-gray-700">
                {/* UPDATE THIS: Parent category link */}
                <Link href="/women">Browse All Women's Items</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
