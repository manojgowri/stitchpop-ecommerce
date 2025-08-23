"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, Filter } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  sale_price?: number
  image_url?: string
  rating?: number
  is_on_sale: boolean
  category: { name: string }
}

export default function KidsDressesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("name")
  const [filterBy, setFilterBy] = useState("all")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          price,
          sale_price,
          image_url,
          rating,
          is_on_sale,
          category:categories(name)
        `)
        .eq("categories.name", "Dresses")
        .eq("categories.gender", "kids")
        .eq("is_active", true)

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedProducts = products
    .filter((product) => {
      if (filterBy === "sale") return product.is_on_sale
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.sale_price || a.price) - (b.sale_price || b.price)
        case "price-high":
          return (b.sale_price || b.price) - (a.sale_price || a.price)
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        default:
          return a.name.localeCompare(b.name)
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <Link href="/kids" className="hover:text-gray-900">
            Kids
          </Link>
          <span>/</span>
          <span className="text-gray-900">Dresses</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kids Dresses</h1>
            <p className="text-gray-600">Showing {filteredAndSortedProducts.length} products</p>
          </div>

          {/* Filters and Sort */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-32">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="sale">On Sale</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
                <ChevronDown className="w-4 h-4 ml-2" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No dresses found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or check back later for new arrivals.</p>
            <Button asChild>
              <Link href="/kids">Browse All Kids Items</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
