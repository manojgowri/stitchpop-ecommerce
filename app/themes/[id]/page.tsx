"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, Filter, ArrowLeft } from "lucide-react"
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
  gender: string
  categories: {
    name: string
  }
}

interface Theme {
  id: string
  name: string
  description: string | null
  image_url: string | null
}

export default function ThemeDetailPage() {
  const params = useParams()
  const themeId = params.id as string

  const [theme, setTheme] = useState<Theme | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("featured")
  const [filterByGender, setFilterByGender] = useState("all")
  const [filterByCategory, setFilterByCategory] = useState("all")
  const [categories, setCategories] = useState<{ name: string }[]>([])

  useEffect(() => {
    if (themeId) {
      fetchTheme()
      fetchProducts()
      fetchCategories()
    }
  }, [themeId, sortBy, filterByGender, filterByCategory])

  const fetchTheme = async () => {
    try {
      const { data, error } = await supabase.from("themes").select("*").eq("id", themeId).single()

      if (error) throw error
      setTheme(data)
    } catch (error) {
      console.error("Error fetching theme:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("name").eq("is_active", true)

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from("products")
        .select(`
          *,
          categories!inner(name)
        `)
        .eq("theme_id", themeId)
        .eq("is_active", true)

      if (filterByGender !== "all") {
        query = query.eq("gender", filterByGender)
      }

      if (filterByCategory !== "all") {
        query = query.eq("categories.name", filterByCategory)
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

  if (!theme) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Theme not found.</p>
            <Link href="/themes">
              <Button className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Themes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/themes">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Themes
            </Button>
          </Link>
        </div>

        {/* Theme Header */}
        <div className="mb-8">
          <div className="relative h-64 rounded-lg overflow-hidden mb-6">
            <img
              src={theme.image_url || "/placeholder.svg?height=300&width=800&text=" + encodeURIComponent(theme.name)}
              alt={theme.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-2">{theme.name}</h1>
                <p className="text-lg">{theme.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={filterByGender} onValueChange={setFilterByGender}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="kids">Kids</SelectItem>
                <SelectItem value="couple">Couple</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={filterByCategory} onValueChange={setFilterByCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
            <p className="text-gray-500 text-lg">No products found in this theme matching your criteria.</p>
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
                  <Badge variant="secondary" className="absolute top-2 right-2 capitalize">
                    {product.gender}
                  </Badge>
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
                    <span className="text-xs text-gray-500 ml-2 capitalize">{product.categories.name}</span>
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
