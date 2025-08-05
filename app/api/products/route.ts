import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const gender = searchParams.get("gender")
    const theme = searchParams.get("theme")
    const featured = searchParams.get("featured")
    const sale = searchParams.get("sale")
    const limit = searchParams.get("limit")

    let query = supabase
      .from("products")
      .select(`
        *,
        categories (
          id,
          name,
          gender
        ),
        themes (
          id,
          name
        )
      `)
      .eq("is_active", true)

    // Filter by category name if provided
    if (category) {
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("name", category)
        .eq("gender", gender || "men")
        .single()

      if (categoryData) {
        query = query.eq("category_id", categoryData.id)
      }
    }

    // Filter by gender
    if (gender) {
      query = query.eq("gender", gender)
    }

    // Filter by theme
    if (theme) {
      query = query.eq("theme_id", theme)
    }

    // Filter featured products
    if (featured === "true") {
      query = query.eq("is_featured", true)
    }

    // Filter sale products
    if (sale === "true") {
      query = query.eq("is_on_sale", true)
    }

    // Apply limit
    if (limit) {
      query = query.limit(parseInt(limit))
    }

    // Order by created_at
    query = query.order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from("products")
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
