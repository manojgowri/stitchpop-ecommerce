"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Eye } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Product {
  id: string
  name: string
  price: number
  original_price: number
  images: string[]
  rating: number
  is_on_sale: boolean
}

export default function StitchDropPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_on_sale", true)
          .eq("is_active", true)
          .order("created_at", { ascending: false })

        if (error) throw error
        setProducts(data || [])
      } catch (error) {
        console.error("Error fetching sale products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSaleProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Stitch Drop...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-800 to-gray-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">Stitch Drop</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Exclusive deals and limited-time offers on premium fashion
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="group relative">
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                    <div className="relative aspect-square">
                      <Image
                        src={product.images?.[0] || "/placeholder.svg?height=300&width=300&text=Product"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>

                      {/* Product Actions Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="secondary" asChild>
                            <Link href={`/product/${product.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="secondary">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="secondary">
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-semibold group-hover:text-gray-800 transition-colors">{product.name}</h3>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">({product.rating || 0})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-red-600">₹{product.price?.toLocaleString()}</span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-sm text-gray-600 line-through">
                            ₹{product.original_price.toLocaleString()}
                          </span>
                        )}
                        {product.original_price && product.original_price > product.price && (
                          <Badge variant="destructive" className="text-xs">
                            {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Sale Items Available</h2>
              <p className="text-gray-600 mb-8">Check back soon for amazing deals!</p>
              <Button asChild>
                <Link href="/categories">Browse All Products</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
