"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import ProductCard from "@/components/product-card"

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
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    original_price: product.original_price,
                    images: product.images,
                    rating: product.rating,
                    is_on_sale: product.is_on_sale,
                  }}
                />
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
