"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"

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
}

export default function WomenJacketsPage() {
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
      // First get the category ID for women's jackets
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Jackets")
        .eq("gender", "women")
        .single()

      if (categoryData) {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("category_id", categoryData.id)
          .eq("is_active", true)

        if (error) throw error
        setProducts(data || [])
      }
    } catch (error) {
      console.error("Error fetching jackets:", error)
      // Fallback data
      setProducts([
        {
          id: "1",
          name: "Denim Jacket",
          description: "Classic denim jacket perfect for layering",
          price: 1599,
          original_price: 1999,
          images: ["/placeholder.svg?height=400&width=300&text=Denim+Jacket"],
          rating: 4.3,
          sizes: ["XS", "S", "M", "L", "XL"],
          colors: ["Blue", "Black"],
          stock: 30,
          is_on_sale: true,
        },
        {
          id: "2",
          name: "Leather Biker Jacket",
          description: "Edgy leather biker jacket with modern design",
          price: 2999,
          images: ["/placeholder.svg?height=400&width=300&text=Leather+Jacket"],
          rating: 4.7,
          sizes: ["XS", "S", "M", "L"],
          colors: ["Black", "Brown"],
          stock: 15,
          is_on_sale: false,
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
        break
    }

    setFilteredProducts(sorted)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/women" className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Women's Collection
          </Link>
          <h1 className="text-3xl font-bold mb-2">Women's Jackets</h1>
          <p className="text-gray-600">Stylish outerwear for every season</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-600">Showing {filteredProducts.length} products</div>
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
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={400}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.is_on_sale && product.original_price && (
                  <Badge className="absolute top-2 left-2 bg-red-500">
                    {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                  </Badge>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <Badge className="absolute top-2 right-2 bg-orange-500">Low Stock</Badge>
                )}
                {product.stock === 0 && <Badge className="absolute top-2 right-2 bg-gray-500">Out of Stock</Badge>}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>

                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">₹{product.price}</span>
                    {product.original_price && (
                      <span className="text-sm text-gray-500 line-through">₹{product.original_price}</span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-600 mb-3">
                  {product.sizes.length} sizes • {product.colors.length} colors
                </div>

                <Button className="w-full" size="sm" disabled={product.stock === 0} asChild>
                  <Link href={`/product/${product.id}`}>{product.stock === 0 ? "Out of Stock" : "View Details"}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No jackets found</p>
            <Button className="mt-4" asChild>
              <Link href="/women">Browse All Women's Products</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
