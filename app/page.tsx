"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Star, Truck, Shield, Headphones, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  images: string[]
  rating: number
  category: string
  gender: string
}

interface Collection {
  id: string
  name: string
  description: string
  image_url: string
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      // Fetch featured products
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .eq("is_active", true)
        .limit(8)

      if (productsError) throw productsError

      // Fetch collections
      const { data: collectionsData, error: collectionsError } = await supabase
        .from("collections")
        .select("*")
        .eq("is_active", true)
        .limit(4)

      if (collectionsError) throw collectionsError

      setFeaturedProducts(products || [])
      setCollections(collectionsData || [])
    } catch (error) {
      console.error("Error fetching home data:", error)
      // Fallback data
      setFeaturedProducts([
        {
          id: "1",
          name: "Premium Cotton T-Shirt",
          price: 599,
          original_price: 999,
          images: ["/placeholder.svg?height=300&width=250&text=T-Shirt"],
          rating: 4.5,
          category: "t-shirts",
          gender: "men",
        },
        {
          id: "2",
          name: "Designer Jeans",
          price: 1299,
          original_price: 2199,
          images: ["/placeholder.svg?height=300&width=250&text=Jeans"],
          rating: 4.7,
          category: "jeans",
          gender: "women",
        },
      ])
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
      <section className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Fashion That
                <span className="block text-purple-200">Speaks You</span>
              </h1>
              <p className="text-xl text-purple-100">
                Discover premium quality clothing that combines style, comfort, and affordability. Express your unique
                personality with our curated collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
                >
                  Explore Collections
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=400&text=Fashion+Hero"
                alt="Fashion Hero"
                width={400}
                height={500}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Free Shipping</h3>
              <p className="text-muted-foreground">Free shipping on orders above ₹999</p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Secure Payment</h3>
              <p className="text-muted-foreground">100% secure payment processing</p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">24/7 Support</h3>
              <p className="text-muted-foreground">Round the clock customer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Discover our wide range of fashion categories</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/men">
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=200&width=300&text=Men's+Fashion"
                    alt="Men's Fashion"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300">
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white text-xl font-bold">Men's Collection</h3>
                      <p className="text-white text-sm">Explore now</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/women">
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=200&width=300&text=Women's+Fashion"
                    alt="Women's Fashion"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300">
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white text-xl font-bold">Women's Collection</h3>
                      <p className="text-white text-sm">Explore now</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/sale">
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=200&width=300&text=Sale+Items"
                    alt="Sale Items"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-red-600 bg-opacity-60 group-hover:bg-opacity-50 transition-all duration-300">
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white text-xl font-bold">Sale</h3>
                      <p className="text-white text-sm">Up to 70% OFF</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/categories">
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=200&width=300&text=All+Categories"
                    alt="All Categories"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300">
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white text-xl font-bold">All Categories</h3>
                      <p className="text-white text-sm">View all</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 text-lg">Handpicked favorites from our collection</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
                {featuredProducts.map((product) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
                    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative overflow-hidden">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          width={250}
                          height={300}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.original_price && (
                          <Badge className="absolute top-2 left-2 bg-red-500">
                            {calculateDiscount(product.original_price, product.price)}% OFF
                          </Badge>
                        )}
                        <Badge className="absolute top-2 right-2 bg-black text-white">
                          {product.gender.toUpperCase()}
                        </Badge>
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
                            <span className="font-bold text-lg">₹{product.price}</span>
                            {product.original_price && (
                              <span className="text-sm text-gray-500 line-through">₹{product.original_price}</span>
                            )}
                          </div>
                          <Button size="sm" asChild>
                            <Link href={`/product/${product.id}`}>View</Link>
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

      {/* Collections Section */}
      {collections.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Collections</h2>
              <p className="text-gray-600 text-lg">Curated collections for every style</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collections.map((collection) => (
                <Card
                  key={collection.id}
                  className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={collection.image_url || "/placeholder.svg?height=300&width=500&text=Collection"}
                      alt={collection.name}
                      width={500}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300">
                      <div className="absolute bottom-6 left-6">
                        <h3 className="text-white text-2xl font-bold mb-2">{collection.name}</h3>
                        <p className="text-white text-sm mb-4">{collection.description}</p>
                        <Button variant="secondary" size="sm">
                          Explore Collection
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Stay in Style</h2>
            <p className="text-primary-foreground/80">
              Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and fashion
              tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <Button type="submit" variant="secondary" size="lg">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
