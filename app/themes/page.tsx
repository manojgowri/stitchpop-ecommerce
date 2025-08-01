"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase"

interface Theme {
  id: string
  name: string
  description: string | null
  image_url: string | null
  is_active: boolean
  product_count?: number
}

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchThemes()
  }, [])

  const fetchThemes = async () => {
    try {
      // Fetch themes with product count
      const { data: themesData, error } = await supabase
        .from("themes")
        .select(`
          *,
          products!inner(count)
        `)
        .eq("is_active", true)

      if (error) throw error

      // Process the data to get product counts
      const themesWithCounts = await Promise.all(
        (themesData || []).map(async (theme) => {
          const { count } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("theme_id", theme.id)
            .eq("is_active", true)

          return {
            ...theme,
            product_count: count || 0,
          }
        }),
      )

      setThemes(themesWithCounts)
    } catch (error) {
      console.error("Error fetching themes:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Themed Collections</h1>
        <p className="text-muted-foreground">
          Discover our curated themed collections featuring the latest trends and styles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <Link key={theme.id} href={`/themes/${theme.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-video relative bg-gradient-to-br from-primary/20 to-primary/5">
                {theme.image_url ? (
                  <img
                    src={theme.image_url || "/placeholder.svg"}
                    alt={theme.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary/30">{theme.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{theme.name}</h3>
                  <Badge variant="secondary">{theme.product_count} items</Badge>
                </div>
                {theme.description && <p className="text-sm text-muted-foreground line-clamp-2">{theme.description}</p>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {themes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No themes available at the moment.</p>
        </div>
      )}
    </div>
  )
}
