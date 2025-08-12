"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, Truck, Shield, Headphones, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface Banner {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  redirect_url: string | null
  is_active: boolean
  display_order: number
}

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from("banners")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true })

        if (error) throw error
        setBanners(data || [])
      } catch (error) {
        console.error("Error fetching banners:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBanners()
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [banners.length])

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const featuredProducts = [
    {
      id: "1",
      name: "Premium Cotton T-Shirt",
      price: 899,
      originalPrice: 1299,
      image: "/placeholder.svg?height=300&width=300&text=T-Shirt",
      rating: 4.5,
      reviews: 128,
      badge: "Best Seller",
    },
    {
      id: "2",
      name: "Casual Denim Jeans",
      price: 1999,
      originalPrice: 2499,
      image: "/placeholder.svg?height=300&width=300&text=Jeans",
      rating: 4.3,
      reviews: 89,
      badge: "New",
    },
    {
      id: "3",
      name: "Summer Floral Dress",
      price: 1599,
      originalPrice: 2199,
      image: "/placeholder.svg?height=300&width=300&text=Dress",
      rating: 4.7,
      reviews: 156,
      badge: "Sale",
    },
    {
      id: "4",
      name: "Classic Polo Shirt",
      price: 1299,
      originalPrice: 1699,
      image: "/placeholder.svg?height=300&width=300&text=Polo",
      rating: 4.4,
      reviews: 92,
      badge: "Popular",
    },
  ]

  const categories = [
    {
      name: "Men's Collection",
      href: "/men",
      image: "/placeholder.svg?height=400&width=600&text=Men's+Fashion",
      description: "Discover premium men's clothing",
    },
    {
      name: "Women's Collection",
      href: "/women",
      image: "/placeholder.svg?height=400&width=600&text=Women's+Fashion",
      description: "Explore elegant women's fashion",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[70vh] overflow-hidden bg-gray-100">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading banners...</div>
          </div>
        ) : banners.length > 0 ? (
          <>
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentBanner ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="relative h-full">
                  <Image
                    src={banner.image_url || "/placeholder.svg"}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white max-w-4xl px-4">
                      <h1 className="text-4xl lg:text-6xl font-bold mb-4">{banner.title}</h1>
                      {banner.subtitle && <p className="text-lg lg:text-xl mb-8 text-white/90">{banner.subtitle}</p>}
                      {banner.redirect_url && (
                        <Button size="lg" asChild className="bg-white text-black hover:bg-gray-100">
                          <Link href={banner.redirect_url}>
                            Explore Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Controls */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={prevBanner}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextBanner}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBanner(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentBanner ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center text-gray-600">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                Welcome to <span className="text-gray-800">Stitch POP</span>
              </h1>
              <p className="text-lg lg:text-xl mb-8">Premium fashion and lifestyle brand</p>
              <Button size="lg" asChild>
                <Link href="/categories">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over ₹1,000</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">Secure Payment</h3>
              <p className="text-gray-600">100% secure payment processing</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                <Headphones className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">24/7 Support</h3>
              <p className="text-gray-600">Round the clock customer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our curated collections designed for every style and occasion
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category) => (
              <Link key={category.name} href={category.href} className="group">
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="relative aspect-[3/2]">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                      <div className="space-y-2">
                        <h3 className="text-2xl lg:text-3xl font-bold">{category.name}</h3>
                        <p className="text-white/90">{category.description}</p>
                        <Button variant="secondary" className="mt-4">
                          Shop Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular items loved by customers worldwide
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group">
                <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="relative aspect-square">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 left-2" variant="secondary">
                      {product.badge}
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold group-hover:text-gray-800 transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-600 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/categories">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Stay in Style</h2>
            <p className="text-white/90">
              Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and style
              tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md text-white bg-gray-700"
              />
              <Button variant="secondary" className="bg-gray-700 text-white hover:bg-gray-600">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
