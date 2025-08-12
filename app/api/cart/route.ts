import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { data: cartItems, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        product_id,
        quantity,
        size,
        color,
        products (
          id,
          name,
          price,
          sale_price,
          images
        )
      `)
      .eq("user_id", userId)

    if (error) {
      console.error("Error fetching cart items:", error)
      return NextResponse.json({ error: "Failed to fetch cart items" }, { status: 500 })
    }

    // Transform the data to match the expected format
    const transformedItems =
      cartItems?.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.products?.name || "Unknown Product",
        product_image: item.products?.images?.[0] || "/placeholder.svg",
        price: item.products?.sale_price || item.products?.price || 0,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      })) || []

    return NextResponse.json(transformedItems)
  } catch (error) {
    console.error("Error in cart API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, product_id, quantity = 1, size, color } = body

    if (!user_id || !product_id) {
      return NextResponse.json({ error: "User ID and Product ID are required" }, { status: 400 })
    }

    // Check if item already exists in cart
    const { data: existingItem, error: checkError } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user_id)
      .eq("product_id", product_id)
      .eq("size", size || "")
      .eq("color", color || "")
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing cart item:", checkError)
      return NextResponse.json({ error: "Failed to check cart" }, { status: 500 })
    }

    if (existingItem) {
      // Update existing item quantity
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id)

      if (updateError) {
        console.error("Error updating cart item:", updateError)
        return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
      }
    } else {
      // Add new item to cart
      const { error: insertError } = await supabase.from("cart_items").insert([
        {
          user_id,
          product_id,
          quantity,
          size: size || "",
          color: color || "",
        },
      ])

      if (insertError) {
        console.error("Error adding to cart:", insertError)
        return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in cart POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
