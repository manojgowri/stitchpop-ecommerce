"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, Share2, Truck, Shield, RefreshCw, Plus, Minus, ShoppingCart } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

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
  gender: string
  is_on_sale: boolean
  categories?: {
    name: string
  }
  themes?: {
    name: string
  }
}

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }
    getUser()

    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  useEffect(() => {
    if (user && product) {
      checkWishlistStatus()
    }
  }, [user, product])

  const fetchProduct = async (productId: string) => {
    try {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(productId)) {
        throw new Error("Invalid product ID format")
      }

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            name
          ),
          themes (
            name
          )
        `)
        .eq("id", productId)
        .eq("is_active", true)
        .single()

      if (error) throw error

      if (data) {
        setProduct(data)
        setSelectedSize(data.sizes[0] || "")
        setSelectedColor(data.colors[0] || "")
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      })
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  const checkWishlistStatus = async () => {
    if (!user || !product) return

    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .single()

      if (!error && data) {
        setIsInWishlist(true)
      }
    } catch (error) {
      // Item not in wishlist
      setIsInWishlist(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    if (!selectedSize || !selectedColor) {
      toast({
        title: "Selection required",
        description: "Please select size and color before adding to cart",
        variant: "destructive",
      })
      return
    }

    try {
      // Check if item already exists in cart
      const { data: existingItem, error: checkError } = await supabase
        .from("cart")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", product!.id)
        .eq("size", selectedSize)
        .eq("color", selectedColor)
        .single()

      if (existingItem) {
        // Update existing item
        const { error } = await supabase
          .from("cart")
          .update({ quantity: existingItem.quantity + quantity })
          .eq("id", existingItem.id)

        if (error) throw error
      } else {
        // Add new item
        const { error } = await supabase.from("cart").insert([
          {
            user_id: user.id,
            product_id: product!.id,
            size: selectedSize,
            color: selectedColor,
            quantity: quantity,
          },
        ])

        if (error) throw error
      }

      toast({
        title: "Added to cart",
        description: `${quantity} item(s) added to cart`,
      })

      // Trigger cart count update
      window.dispatchEvent(new CustomEvent("cartUpdated"))
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  const handleBuyNow = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to purchase items",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    if (!selectedSize || !selectedColor) {
      toast({
        title: "Selection required",
        description: "Please select size and color before purchasing",
        variant: "destructive",
      })
      return
    }

    // Add to cart first, then redirect to checkout
    await handleAddToCart()
    router.push("/checkout")
  }

  const handleWishlist = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to wishlist",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", product!.id)

        if (error) throw error

        setIsInWishlist(false)
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist",
        })
      } else {
        // Add to wishlist
        const { error } = await supabase.from("wishlist").insert([
          {
            user_id: user.id,
            product_id: product!.id,
          },
        ])

        if (error) throw error

        setIsInWishlist(true)
        toast({
          title: "Added to wishlist",
          description: "Item has been added to your wishlist",
        })
      }
    } catch (error) {
      console.error("Error updating wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      })
    }
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <Button onClick={() => router.push("/")} size="lg" className="bg-gray-800 text-white hover:bg-gray-700">
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-50 relative">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg?height=500&width=500&text=Product"}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
              {product.is_on_sale && (
                <Badge className="absolute top-4 left-4 bg-red-500">
                  {product.original_price &&
                    Math.round(((product.original_price - product.price) / product.original_price) * 100)}
                  % OFF
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${
                    selectedImage === index ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg?height=100&width=100&text=Product"}
                    alt={`${product.name} ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-gray-300">
                  {product.categories?.name}
                </Badge>
                {product.themes?.name && (
                  <Badge variant="outline" className="border-gray-300">
                    {product.themes.name}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.rating}) • 127 reviews</span>
              </div>
              <div className="flex items-center space-x-4 mb-6">
                {product.is_on_sale && product.original_price ? (
                  <>
                    <span className="text-3xl font-bold text-red-600">₹{product.price.toLocaleString()}</span>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.original_price.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                )}
              </div>
            </div>

            <Separator />

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="fabric">Fabric & Care</TabsTrigger>
                <TabsTrigger value="sizing">Size Guide</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </TabsContent>

              <TabsContent value="fabric" className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Fabric Composition</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 100% Premium Cotton</li>
                    <li>• Soft and breathable fabric</li>
                    <li>• Pre-shrunk for lasting fit</li>
                    <li>• Fade-resistant colors</li>
                  </ul>

                  <h4 className="font-medium mt-4">Care Instructions</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Machine wash cold with like colors</li>
                    <li>• Use mild detergent</li>
                    <li>• Tumble dry low or hang dry</li>
                    <li>• Iron on medium heat if needed</li>
                    <li>• Do not bleach or dry clean</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="sizing" className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Size Chart</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-3 py-2">Size</th>
                          <th className="border border-gray-300 px-3 py-2">Chest (inches)</th>
                          <th className="border border-gray-300 px-3 py-2">Length (inches)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-3 py-2">S</td>
                          <td className="border border-gray-300 px-3 py-2">36-38</td>
                          <td className="border border-gray-300 px-3 py-2">27</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-3 py-2">M</td>
                          <td className="border border-gray-300 px-3 py-2">38-40</td>
                          <td className="border border-gray-300 px-3 py-2">28</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-3 py-2">L</td>
                          <td className="border border-gray-300 px-3 py-2">40-42</td>
                          <td className="border border-gray-300 px-3 py-2">29</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-3 py-2">XL</td>
                          <td className="border border-gray-300 px-3 py-2">42-44</td>
                          <td className="border border-gray-300 px-3 py-2">30</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-600">*Measurements are approximate and may vary slightly</p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size: {selectedSize}</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full border-gray-300">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color: {selectedColor}</label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="w-full border-gray-300">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="border-gray-300"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="border-gray-300"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex space-x-3">
                <Button
                  size="lg"
                  className="flex-1 bg-gray-800 text-white hover:bg-gray-700"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.stock === 0 ? "Out of Stock" : `Add to Cart`}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWishlist}
                  className={`border-gray-300 ${isInWishlist ? "text-red-500 border-red-300" : "text-gray-600"}`}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="lg" className="border-gray-300 text-gray-600 bg-transparent">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <Button
                size="lg"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                onClick={() => router.push("/cart")}
              >
                View Cart
              </Button>
            </div>

            {product.stock <= 5 && product.stock > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-orange-800 font-medium">Grab before it's gone</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Truck className="h-6 w-6 text-gray-800" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders over ₹999</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="h-6 w-6 text-gray-800" />
                <div>
                  <p className="font-medium text-sm">Secure Payment</p>
                  <p className="text-xs text-gray-600">100% secure</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <RefreshCw className="h-6 w-6 text-gray-800" />
                <div>
                  <p className="font-medium text-sm">Easy Returns</p>
                  <p className="text-xs text-gray-600">30-day policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
