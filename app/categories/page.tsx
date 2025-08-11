"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Star, Filter, Search } from "lucide-react"
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

export default function CategoriesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedGender, setSelectedGender] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
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
    filterAndSortProducts()
  }, [products, searchTerm, selectedCategory, selectedGender, sortBy])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
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
            images: ["/placeholder.svg?height=300&width=250&text=T-shirt"],
            rating: 4.5,
            sizes: ["S", "M", "L", "XL"],
            colors: ["Black", "White", "Gray"],
            stock: 50,
            category: "t-shirts",
            gender: "men",
          },
          {
            id: "2",
            name: "Floral Summer Dress",
            description: "Beautiful floral dress perfect for summer",
            price: 599,
            originalPrice: 1199,
            images: ["/placeholder.svg?height=300&width=250&text=Dress"],
            rating: 4.6,
            sizes: ["XS", "S", "M", "L"],
            colors: ["Pink", "Blue", "White"],
            stock: 30,
            category: "dresses",
            gender: "women",
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([
        {
          id: "1",
          name: "Classic Cotton T-Shirt",
          description: "Comfortable cotton t-shirt perfect for everyday wear",
          price: 399,
          originalPrice: 899,
          images: ["/placeholder.svg?height=300&width=250&text=T-shirt"],
          rating: 4.5,
          sizes: ["S", "M", "L", "XL"],
          colors: ["Black", "White", "Gray"],
          stock: 50,
          category: "t-shirts",
          gender: "men",
        },
        {
          id: "2",
          name: "Floral Summer Dress",
          description: "Beautiful floral dress perfect for summer",
          price: 599,
          originalPrice: 1199,
          images: ["/placeholder.svg?height=300&width=250&text=Dress"],
          rating: 4.6,
          sizes: ["XS", "S", "M", "L"],
          colors: ["Pink", "Blue", "White"],
          stock: 30,
          category: "dresses",
          gender: "women",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Gender filter
    if (selectedGender !== "all") {
      filtered = filtered.filter((product) => product.gender === selectedGender)
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
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

    setFilteredProducts(filtered)
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
      const response = await fetch("/api/cart/add", {
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
          <h1 className="text-3xl font-bold mb-2">All Categories</h1>
          <p className="text-gray-600">Discover our complete collection of premium fashion</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="t-shirts">T-Shirts</SelectItem>
                <SelectItem value="shirts">Shirts</SelectItem>
                <SelectItem value="jeans">Jeans</SelectItem>
                <SelectItem value="dresses">Dresses</SelectItem>
                <SelectItem value="tops">Tops</SelectItem>
                <SelectItem value="jackets">Jackets</SelectItem>
              </SelectContent>
            </Select>

            {/* Gender Filter */}
            <Select value={selectedGender} onValueChange={setSelectedGender}>
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="unisex">Unisex</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
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

            {/* Results Count */}
            <div className="flex items-center text-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              <span>{filteredProducts.length} products</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div
                className="relative overflow-hidden cursor-pointer"
                onClick={() => router.push(`/product/${product.id}`)}
              >
                <Image
                  src={product.images[0] || "/placeholder.svg"}
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
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs">
                    {(product.category || "uncategorized").replace("-", " ").toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-xs ml-2">
                    {(product.gender || "unisex").toUpperCase()}
                  </Badge>
                </div>
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found matching your criteria</p>
            <Button
              className="mt-4"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setSelectedGender("all")
                setSortBy("featured")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
