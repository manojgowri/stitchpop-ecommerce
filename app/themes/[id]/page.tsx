"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Star } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  original_price: number | null
  images: string[]
  rating: number
  is_on_sale: boolean
  categories: {
    name: string
  }
}

interface Theme {
  id: string
  name: string
  description: string | null
  image_url: string | null
}

export default function ThemeDetailPage() {
  const params = useParams()
  const themeId = params.id as string

  const [theme, setTheme] = useState<Theme | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (themeId) {
      fetchThemeAndProducts()
    }
  }, [themeId])

  const fetchThemeAndProducts = async () => {
    try {
      // Fetch theme details
      const { data: themeData, error: themeError } = await supabase
        .from("themes")
        .select("*")
        .eq("id", themeId)
        .eq("is_active", true)
        .single()

      if (themeError) throw themeError

      setTheme(themeData)

      // Fetch products for this theme
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq("theme_id", themeId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (productsError) throw productsError

      setProducts(productsData || [])
    } catch (error) {
      console.error("Error fetching theme and products:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!theme) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Theme Not Found</h1>
          <Link href="/themes">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Themes
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Theme Header */}
      <div className="mb-8">
        <Link href="/themes" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Themes
        </Link>

        <div className="flex flex-col md:flex-row gap-6">
          {theme.image_url && (
            <div className="w-full md:w-64 h-48 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
              <img
                src={theme.image_url || "/placeholder.svg"}
                alt={theme.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{theme.name}</h1>
            {theme.description && <p className="text-muted-foreground mb-4">{theme.description}</p>}
            <Badge variant="secondary">
              {products.length} {products.length === 1 ? "item" : "items"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-square relative">
                  <img
                    src={product.images[0] || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.is_on_sale && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{product.categories?.name}</p>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">{product.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold">${product.price}</span>
                    {product.is_on_sale && product.original_price && (
                      <span className="text-sm text-muted-foreground line-through">${product.original_price}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products available in this theme yet.</p>
        </div>
      )}
    </div>
  )
}
