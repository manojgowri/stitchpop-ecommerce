"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Filter } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  rating: number
  sizes: string[]
  colors: string[]
  stock: number
  category: string
  gender: string
}

export default function MenTShirtsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("featured")
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }
    getUser()
    fetchProducts()
  }, [])

  useEffect(() => {
    if (sortBy) {
      sortProducts(sortBy)
    }
  }, [sortBy])

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://stitchpop-ecommerce.onrender.com/api/products?category=t-shirts&gender=men")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        // Fallback data
        setProducts([
          {
            id: "1",
            name: "Classic Cotton T-Shirt",
            description: "Comfortable cotton t-shirt perfect for everyday wear",
            price: 399,
            originalPrice: 899,
            images: [
              "/placeholder.svg?height=300&width=250&text=T-shirt+Front",
              "/placeholder.svg?height=300&width=250&text=T-shirt+Side",
              "/placeholder.svg?height=300&width=250&text=T-shirt+Back",
            ],
            rating: 4.5,
            sizes: ["S", "M", "L", "XL"],
            colors: ["Black", "White", "Gray"],
            stock: 50,
            category: "t-shirts",
            gender: "men",
          },
          {
            id: "2",
            name: "Graphic Print T-Shirt",
            description: "Trendy graphic print t-shirt with modern design",
            price: 499,
            originalPrice: 999,
            images: [
              "/placeholder.svg?height=300&width=250&text=Graphic+Front",
              "/placeholder.svg?height=300&width=250&text=Graphic+Side",
              "/placeholder.svg?height=300&width=250&text=Graphic+Back",
            ],
            rating: 4.3,
            sizes: ["S", "M", "L", "XL"],
            colors: ["Navy", "Black", "White"],
            stock: 30,
            category: "t-shirts",
            gender: "men",
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const sortProducts = (sortType: string) => {
    const sorted = [...products].sort((a, b) => {
      switch (sortType) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "newest":
          return b.id.localeCompare(a.id)
        default:
          return 0
      }
    })
    setProducts(sorted)
  }

  const handleMouseMove = (e: React.MouseEvent, productId: string) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width
    setMousePosition({ x: x / width, y: 0 })
    setHoveredProduct(productId)
  }

  const getImageIndex = (mouseX: number) => {
    if (mouseX < 0.33) return 0
    if (mouseX < 0.66) return 1
    return 2
  }

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    // For demo, we'll use the first available size and color
    const size = product.sizes[0]
    const color = product.colors[0]

    try {
      const response = await fetch("https://stitchpop-ecommerce.onrender.com/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          product_id: product.id,
          size: size,
          color: color,
          quantity: 1,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Item added to cart",
        })
      } else {
        throw new Error("Failed to add to cart")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Men's T-Shirts</h1>
          <p className="text-gray-600">Discover our collection of premium t-shirts for men</p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <span className="text-gray-600">{products.length} products</span>
          </div>
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div
                className="relative overflow-hidden cursor-pointer"
                onMouseMove={(e) => handleMouseMove(e, product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => router.push(`/product/${product.id}`)}
              >
                <Image
                  src={
                    hoveredProduct === product.id && product.images.length > 1
                      ? product.images[getImageIndex(mousePosition.x)]
                      : product.images[0]
                  }
                  alt={product.name}
                  width={250}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.originalPrice && (
                  <Badge className="absolute top-2 left-2 bg-red-500">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <Badge className="absolute top-2 right-2 bg-orange-500">Low Stock</Badge>
                )}
                {product.stock === 0 && <Badge className="absolute top-2 right-2 bg-gray-500">Out of Stock</Badge>}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 ml-1">({product.rating})</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600">
                    {product.sizes.length} sizes, {product.colors.length} colors
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToCart(product)
                    }}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No t-shirts found</p>
          </div>
        )}
      </div>
    </div>
  )
}
