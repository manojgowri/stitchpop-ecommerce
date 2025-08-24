"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import ProductCard from "@/components/product-card"

interface Banner {
  id: string
  title: string
  subtitle: string | null
  desktop_image_url: string
  mobile_image_url?: string
  redirect_url: string | null
  is_active: boolean
  display_order: number
}

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showSlider, setShowSlider] = useState(false)
  const [collections, setCollections] = useState<any[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])

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

    const fetchCollections = async () => {
      try {
        const { data, error } = await supabase.from("collections").select("*").eq("is_active", true).order("name")

        if (error) throw error

        const transformedCollections =
          data?.map((collection: any) => ({
            name: collection.name,
            href: `/${collection.category.toLowerCase()}`,
            image: collection.image_url,
            description: collection.description,
          })) || []

        setCollections(transformedCollections)
      } catch (error) {
        console.error("Error fetching collections:", error)
        setCollections([
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
        ])
      }
    }

    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*").eq("is_featured", true)

        if (error) throw error
        setFeaturedProducts(data || [])
      } catch (error) {
        console.error("Error fetching featured products:", error)
      }
    }

    fetchBanners()
    fetchCollections()
    fetchFeaturedProducts()
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [banners.length])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setShowSlider(scrollPosition > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <div className="min-h-screen bg-black w-full overflow-x-hidden">
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-gray-900/60 to-gray-800/80" />
        <div className="relative z-10 text-center text-white max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
            Premium hoodies
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Discover our exclusive collection of premium fashion pieces crafted for the modern connoisseur
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-gray-200 w-full sm:w-auto"
            >
              <Link href="/categories" className="inline-flex items-center justify-center w-full">
                EXPLORE COLLECTION
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {showSlider && (
        <section className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden bg-gray-900 w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">Loading banners...</div>
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
                      src={banner.desktop_image_url || "/placeholder.svg"}
                      alt={banner.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white max-w-4xl px-4">
                        <h1 className="text-4xl lg:text-6xl font-bold mb-4">{banner.title}</h1>
                        {banner.subtitle && <p className="text-lg lg:text-xl mb-8 text-gray-300">{banner.subtitle}</p>}
                        {banner.redirect_url && (
                          <Button
                            size="lg"
                            className="bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-gray-200"
                          >
                            <Link href={banner.redirect_url} className="inline-flex items-center">
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
          ) : null}
        </section>
      )}

      {/* Categories Section */}
      <section className="py-12 sm:py-16 bg-gray-900 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center space-y-4 mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Shop by Category</h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
              Explore our curated collections designed for every style and occasion
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {collections.map((collection) => (
              <Link key={collection.name} href={collection.href} className="group w-full">
                <Card className="overflow-hidden border-0 bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] w-full">
                  <div className="relative aspect-[3/2] w-full">
                    <Image
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.name.includes("Men") ? "Men's Fashion" : "Women's Fashion"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center text-center text-white p-4">
                      <div className="space-y-2">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">{collection.name}</h3>
                        <p className="text-gray-300 text-sm sm:text-base">{collection.description}</p>
                        <Button className="mt-4 bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-gray-200 text-sm sm:text-base">
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

      {/* Featured Products Section */}
      <section className="py-12 sm:py-16 bg-black w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center space-y-4 mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Featured Products</h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
              Discover our most popular items loved by customers worldwide
            </p>
          </div>
          {featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center mt-8 sm:mt-12">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-gray-200 w-full sm:w-auto"
                >
                  <Link href="/categories" className="inline-flex items-center justify-center w-full">
                    View All Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400">
              <p className="text-sm sm:text-base">No featured products available at the moment.</p>
              <Button
                size="lg"
                className="mt-4 bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-gray-200 w-full sm:w-auto"
              >
                <Link href="/categories" className="inline-flex items-center justify-center w-full">
                  Browse All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 sm:py-16 bg-gray-900 text-white border-t border-gray-800 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-7xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Stay in Style</h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and style
              tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md text-white bg-gray-800 border border-gray-700 focus:border-white placeholder-gray-400 w-full"
              />
              <Button className="bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-gray-200 w-full sm:w-auto">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
