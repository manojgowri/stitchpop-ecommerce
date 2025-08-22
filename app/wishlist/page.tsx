"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/cart-context"

interface WishlistItem {
  id: string
  created_at: string
  product: {
    id: string
    name: string
    price: number
    original_price?: number
    images: string[]
    rating: number
    is_on_sale: boolean
    sizes: string[]
    colors: string[]
    stock: number
    is_active: boolean
  }
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { addToCart } = useCart()

  useEffect(() => {
    const checkUserAndFetchWishlist = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push("/auth/login")
        return
      }

      setUser(session.user)
      await fetchWishlistItems(session.user.id)
    }

    checkUserAndFetchWishlist()
  }, [router])

  const fetchWishlistItems = async (userId: string) => {
    try {
      const { data: wishlistData, error: wishlistError } = await supabase
        .from("wishlist")
        .select("id, created_at, product_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (wishlistError) throw wishlistError

      if (!wishlistData || wishlistData.length === 0) {
        setWishlistItems([])
        return
      }

      const productIds = wishlistData.map((item) => item.product_id)

      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select(`
          id,
          name,
          price,
          original_price,
          images,
          rating,
          is_on_sale,
          sizes,
          colors,
          stock,
          is_active
        `)
        .in("id", productIds)

      if (productsError) throw productsError

      const transformedData = wishlistData
        .map((wishlistItem) => {
          const product = productsData?.find((p) => p.id === wishlistItem.product_id)
          if (!product) return null

          return {
            id: wishlistItem.id,
            created_at: wishlistItem.created_at,
            product: product,
          }
        })
        .filter((item) => item !== null) as WishlistItem[]

      setWishlistItems(transformedData)
    } catch (error) {
      console.error("Error fetching wishlist items:", error)
      toast({
        title: "Error",
        description: "Failed to load wishlist items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (wishlistItemId: string, productName: string) => {
    try {
      const { error } = await supabase.from("wishlist").delete().eq("id", wishlistItemId)

      if (error) throw error

      setWishlistItems((items) => items.filter((item) => item.id !== wishlistItemId))
      toast({
        title: "Removed from wishlist",
        description: `${productName} has been removed from your wishlist`,
      })
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      })
    }
  }

  const handleAddToCart = async (product: WishlistItem["product"]) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      })
      return
    }

    if (product.stock === 0) {
      toast({
        title: "Out of stock",
        description: "This item is currently out of stock",
        variant: "destructive",
      })
      return
    }

    try {
      await addToCart(product.id, 1, product.sizes?.[0] || "", product.colors?.[0] || "")
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const clearWishlist = async () => {
    if (!user || wishlistItems.length === 0) return

    if (!confirm("Are you sure you want to clear your entire wishlist?")) return

    try {
      const { error } = await supabase.from("wishlist").delete().eq("user_id", user.id)

      if (error) throw error

      setWishlistItems([])
      toast({
        title: "Wishlist cleared",
        description: "All items have been removed from your wishlist",
      })
    } catch (error) {
      console.error("Error clearing wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to clear wishlist",
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

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-gray-600">Save your favorite items for later</p>
          </div>

          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-6">
              <Heart className="h-24 w-24 text-gray-300 mx-auto" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                <p className="text-gray-600 mb-6">Start adding items you love to your wishlist</p>
                <Button onClick={() => router.push("/")} size="lg">
                  Start Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Wishlist</h1>
              <p className="text-gray-600">{wishlistItems.length} items in your wishlist</p>
            </div>
            {wishlistItems.length > 0 && (
              <Button
                variant="outline"
                onClick={clearWishlist}
                className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white"
            >
              <Link href={`/product/${item.product.id}`}>
                <div className="relative aspect-square bg-gray-200">
                  {item.product.images?.[0] ? (
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {item.product.is_on_sale && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}

                  {item.product.stock === 0 && (
                    <Badge className="absolute top-2 right-2 bg-gray-500">Out of Stock</Badge>
                  )}

                  {/* Remove from wishlist button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeFromWishlist(item.id, item.product.name)
                    }}
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </Button>
                </div>
              </Link>

              <CardContent className="p-4 space-y-3">
                <Link href={`/product/${item.product.id}`}>
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
                    {item.product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(item.product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({item.product.rating || 4.4})</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-gray-900">₹{item.product.price?.toLocaleString()}</span>
                  {item.product.original_price && item.product.original_price > item.product.price && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.product.original_price.toLocaleString()}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        {Math.round(
                          ((item.product.original_price - item.product.price) / item.product.original_price) * 100,
                        )}
                        % OFF
                      </Badge>
                    </>
                  )}
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                    onClick={(e) => {
                      e.preventDefault()
                      handleAddToCart(item.product)
                    }}
                    disabled={item.product.stock === 0 || !item.product.is_active}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    {item.product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => {
                      e.preventDefault()
                      removeFromWishlist(item.id, item.product.name)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-xs text-gray-500">Added {new Date(item.created_at).toLocaleDateString()}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
