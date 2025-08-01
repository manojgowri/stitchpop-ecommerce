"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Filter } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  original_price: number | null
  images: string[]
  rating: number
  is_on_sale: boolean
  themes: {
    name: string
  } | null
}

export default function MenJeansPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    fetchProducts()
  }, [sortBy])

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from("products")
        .select(`
          *,
          themes (
            name
          )
        `)
        .eq("gender", "men")
        .eq("is_active", true)

      // Join with categories to filter by jeans
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Jeans")
        .eq("gender", "men")
        .single()

      if (categoryData) {
        query = query.eq("category_id", categoryData.id)
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
        default:
          query = query.order("created_at", { ascending: false })
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Men's Jeans</h1>
        <p className="text-muted-foreground">Premium denim jeans in various fits and washes</p>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-square relative">
                  <img
                    src={product.images[0] || "/placeholder.svg?height=300&width=300&text=Jeans"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.is_on_sale && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
                  {product.themes && <Badge className="absolute top-2 right-2 bg-primary">{product.themes.name}</Badge>}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-2">{product.name}</h3>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">{product.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold">${product.price}</span>
                    {product.is_on_sale && product.original_price && (
                      <span className="text-sm text-muted-foreground line-through">${product.original_price}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No jeans available at the moment.</p>
          <Link href="/men">
            <Button variant="outline" className="mt-4 bg-transparent">
              Browse All Men's Items
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
