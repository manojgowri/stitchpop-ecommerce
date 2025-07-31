"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Star, Timer, Flame } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Product {
  id: string
  name: string
  price: number
  original_price: number
  images: string[]
  rating: number
  category: string
  gender: string
}

export default function SalePage() {
  const [saleProducts, setSaleProducts] = useState<Product[]>([])
  const [featuredDeals, setFeaturedDeals] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSaleProducts()
  }, [])

  const fetchSaleProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .not("original_price", "is", null)
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (error) throw error

      const products = data || []
      setSaleProducts(products)
      setFeaturedDeals(products.slice(0, 6))
    } catch (error) {
      console.error("Error fetching sale products:", error)
      // Fallback data
      const fallbackProducts = [
        {
          id: "1",
          name: "Premium Cotton T-Shirt",
          price: 599,
          original_price: 999,
          images: ["/placeholder.svg?height=300&width=250&text=Sale+T-Shirt"],
          rating: 4.5,
          category: "t-shirts",
          gender: "men",
        },
        {
          id: "2",
          name: "Designer Jeans",
          price: 1299,
          original_price: 2199,
          images: ["/placeholder.svg?height=300&width=250&text=Sale+Jeans"],
          rating: 4.7,
          category: "jeans",
          gender: "women",
        },
      ]
      setSaleProducts(fallbackProducts)
      setFeaturedDeals(fallbackProducts)
    } finally {
      setLoading(false)
    }
  }

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Flame className="h-8 w-8 text-yellow-300" />
              <h1 className="text-4xl md:text-6xl font-bold">MEGA SALE</h1>
              <Flame className="h-8 w-8 text-yellow-300" />
            </div>
            <p className="text-xl md:text-2xl text-red-100">Up to 70% OFF on selected items</p>
            <div className="flex items-center justify-center space-x-2 text-yellow-300">
              <Timer className="h-5 w-5" />
              <span className="text-lg font-semibold">Limited Time Offer!</span>
            </div>
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-3">
              Shop Now
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Deals Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Deals</h2>
            <p className="text-gray-600 text-lg">Don't miss these incredible offers</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="animate-pulse">
                    <div className="h-64 bg-gray-300"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {featuredDeals.map((product) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative overflow-hidden">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                          {calculateDiscount(product.original_price, product.price)}% OFF
                        </Badge>
                        <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">SALE</Badge>
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg text-red-600">₹{product.price}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.original_price}</span>
                          </div>
                          <Button size="sm" asChild>
                            <Link href={`/product/${product.id}`}>View Deal</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </div>
      </section>

      {/* All Sale Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">All Sale Items</h2>
            <p className="text-gray-600 text-lg">Discover amazing deals across all categories</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="animate-pulse">
                    <div className="h-64 bg-gray-300"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={250}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      {calculateDiscount(product.original_price, product.price)}% OFF
                    </Badge>
                    <Badge className="absolute top-2 right-2 bg-black text-white">{product.gender.toUpperCase()}</Badge>
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
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-red-600">₹{product.price}</span>
                        <span className="text-sm text-gray-500 line-through">₹{product.original_price}</span>
                        <span className="text-xs text-green-600 font-medium">
                          Save ₹{product.original_price - product.price}
                        </span>
                      </div>
                      <Button size="sm" asChild>
                        <Link href={`/product/${product.id}`}>Buy Now</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {saleProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No sale items available at the moment.</p>
              <Button asChild className="mt-4">
                <Link href="/categories">Browse All Products</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Don't Miss Out!</h2>
            <p className="text-red-100">
              Subscribe to our newsletter and be the first to know about flash sales and exclusive discounts.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <Button type="submit" variant="secondary" size="lg">
                Get Deals
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
