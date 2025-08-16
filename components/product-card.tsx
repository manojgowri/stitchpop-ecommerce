"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  price: number
  original_price?: number | null
  images: string[]
  rating: number
  is_on_sale: boolean
  sizes?: string[]
  colors?: string[]
  stock?: number
}

interface ProductCardProps {
  product: Product
  showActions?: boolean
}

export function ProductCard({ product, showActions = true }: ProductCardProps) {
  const [user, setUser] = useState<any>(null)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }
    getUser()
  }, [])

  useEffect(() => {
    if (user && product) {
      checkWishlistStatus()
    }
  }, [user, product])

  const checkWishlistStatus = async () => {
    if (!user) return

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
      setIsInWishlist(false)
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    try {
      const { error } = await supabase.from("cart").insert([
        {
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
          size: product.sizes?.[0] || null,
          color: product.colors?.[0] || null,
        },
      ])

      if (error) throw error

      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
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

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

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
        const { error } = await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", product.id)

        if (error) throw error

        setIsInWishlist(false)
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist",
        })
      } else {
        const { error } = await supabase.from("wishlist").insert([
          {
            user_id: user.id,
            product_id: product.id,
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

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to purchase items",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    // Add to cart first, then redirect to checkout
    await handleAddToCart(e)
    router.push("/checkout")
  }

  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square bg-gray-200">
          {product.images?.[0] ? (
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
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

          {product.is_on_sale && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}

          {/* Wishlist Heart Icon */}
          {showActions && (
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
              onClick={handleWishlist}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </Button>
          )}
        </div>
      </Link>

      <CardContent className="p-4 space-y-3">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.rating || 4.4})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-gray-900">₹{product.price?.toLocaleString()}</span>
          {product.original_price && product.original_price > product.price && (
            <>
              <span className="text-sm text-gray-500 line-through">₹{product.original_price.toLocaleString()}</span>
              <Badge variant="destructive" className="text-xs">
                {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
              </Badge>
            </>
          )}
        </div>

        {showActions && (
          <div className="flex space-x-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button size="sm" className="flex-1 bg-gray-800 text-white hover:bg-gray-700" onClick={handleBuyNow}>
              Buy Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Default export for compatibility
export default ProductCard
