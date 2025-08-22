import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { data: wishlistItems, error } = await supabase
      .from("wishlist")
      .select(`
        id,
        created_at,
        product:products (
          id,
          name,
          price,
          original_price,
          images,
          rating,
          is_on_sale,
          sizes,
          colors,
          stock,
          is_active
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch wishlist items" }, { status: 500 })
    }

    // Filter out items where product is null (deleted products)
    const validItems = wishlistItems?.filter((item) => item.product) || []

    return NextResponse.json(validItems)
  } catch (error) {
    console.error("Error in wishlist API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, productId } = body

    if (!userId || !productId) {
      return NextResponse.json({ error: "User ID and Product ID are required" }, { status: 400 })
    }

    // Check if item already exists in wishlist
    const { data: existingItem } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single()

    if (existingItem) {
      return NextResponse.json({ error: "Item already in wishlist" }, { status: 409 })
    }

    const { data: wishlistItem, error } = await supabase
      .from("wishlist")
      .insert([{ user_id: userId, product_id: productId }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to add item to wishlist" }, { status: 500 })
    }

    return NextResponse.json(wishlistItem, { status: 201 })
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
