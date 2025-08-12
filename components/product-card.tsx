"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Eye } from "lucide-react"
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
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square">
          <Image
            src={product.images?.[0] || "/placeholder.svg?height=300&width=300&text=Product"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.is_on_sale && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}

          {/* Product Actions Overlay */}
          {showActions && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex space-x-2">
                <Button size="sm" variant="secondary" asChild>
                  <Link href={`/product/${product.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleWishlist}
                  className={isInWishlist ? "text-red-500" : ""}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
                </Button>
                <Button size="sm" variant="secondary" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4 space-y-2">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold group-hover:text-gray-800 transition-colors line-clamp-2">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">({product.rating || 0})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">₹{product.price?.toLocaleString()}</span>
          {product.original_price && product.original_price > product.price && (
            <>
              <span className="text-sm text-gray-600 line-through">₹{product.original_price.toLocaleString()}</span>
              <Badge variant="destructive" className="text-xs">
                {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
              </Badge>
            </>
          )}
        </div>

        {showActions && (
          <div className="flex space-x-2 mt-3">
            <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
              <Link href={`/product/${product.id}`}>View</Link>
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
