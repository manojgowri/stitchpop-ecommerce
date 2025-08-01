"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, Filter } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price: number | null
  images: string[]
  sizes: string[]
  colors: string[]
  stock: number
  rating: number
  is_on_sale: boolean
  theme: {
    name: string
  } | null
}

export default function MenShirtsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("featured")
  const [filterByTheme, setFilterByTheme] = useState("all")
  const [themes, setThemes] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    fetchProducts()
    fetchThemes()
  }, [sortBy, filterByTheme])

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase.from("themes").select("id, name").eq("is_active", true)

      if (error) throw error
      setThemes(data || [])
    } catch (error) {
      console.error("Error fetching themes:", error)
    }
  }

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from("products")
        .select(`
          *,
          categories!inner(name),
          themes(name)
        `)
        .eq("gender", "men")
        .eq("categories.name", "Shirts")
        .eq("is_active", true)

      if (filterByTheme !== "all") {
        query = query.eq("theme_id", filterByTheme)
      }

      // Apply sorting
      switch (sortBy) {
        case "price-low":
          query = query.order("price", { ascending: true })
          break
        case "price-high":
          query = query.order("price", { ascending: false })
          break
        case "rating":
          query = query.order("rating", { ascending: false })
          break
        case "newest":
          query = query.order("created_at", { ascending: false })
          break
        default:
          query = query.order("is_featured", { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const ProductSkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="h-64 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/4" />
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Men's Shirts</h1>
          <p className="text-gray-600">Discover our collection of premium shirts for every occasion</p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={filterByTheme} onValueChange={setFilterByTheme}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Themes</SelectItem>
                {themes.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No shirts found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={product.images[0] || "/placeholder.svg?height=300&width=250"}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.is_on_sale && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
                  {product.theme && (
                    <Badge variant="secondary" className="absolute top-2 right-2">
                      {product.theme.name}
                    </Badge>
                  )}
                  {product.stock <= 5 && product.stock > 0 && (
                    <Badge variant="destructive" className="absolute bottom-2 left-2">
                      Only {product.stock} left
                    </Badge>
                  )}
                  {product.stock === 0 && (
                    <Badge variant="destructive" className="absolute bottom-2 left-2">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>

                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold">₹{product.price}</span>
                    {product.original_price && product.is_on_sale && (
                      <span className="text-sm text-gray-500 line-through">₹{product.original_price}</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.sizes.slice(0, 4).map((size) => (
                      <Badge key={size} variant="outline" className="text-xs">
                        {size}
                      </Badge>
                    ))}
                    {product.sizes.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{product.sizes.length - 4}
                      </Badge>
                    )}
                  </div>

                  <Link href={`/product/${product.id}`}>
                    <Button className="w-full" disabled={product.stock === 0}>
                      {product.stock === 0 ? "Out of Stock" : "View Details"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
