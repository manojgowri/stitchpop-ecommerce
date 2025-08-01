"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface Theme {
  id: string
  name: string
  description: string | null
  image_url: string | null
  product_count: number
}

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchThemes()
  }, [])

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from("themes")
        .select(`
          *,
          products!inner(id)
        `)
        .eq("is_active", true)

      if (error) throw error

      // Count products for each theme
      const themesWithCount =
        data?.map((theme) => ({
          ...theme,
          product_count: theme.products?.length || 0,
        })) || []

      setThemes(themesWithCount)
    } catch (error) {
      console.error("Error fetching themes:", error)
    } finally {
      setLoading(false)
    }
  }

  const ThemeSkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-6">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ThemeSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Themed Collections</h1>
          <p className="text-gray-600">Discover our curated themed merchandise collections</p>
        </div>

        {/* Themes Grid */}
        {themes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No themes available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme) => (
              <Card key={theme.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={
                      theme.image_url || "/placeholder.svg?height=200&width=400&text=" + encodeURIComponent(theme.name)
                    }
                    alt={theme.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 right-2 bg-black/70 text-white">{theme.product_count} items</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">{theme.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {theme.description || "Explore this amazing collection"}
                  </p>
                  <Link href={`/themes/${theme.id}`}>
                    <Button className="w-full">Explore Collection</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
