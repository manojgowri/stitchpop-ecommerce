import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function createSupabaseClient(request?: NextRequest) {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        const cookieValue = cookieStore.get(name)?.value
        if (cookieValue) return cookieValue

        // Fallback to reading from request headers if available
        if (request) {
          const cookieHeader = request.headers.get("cookie")
          if (cookieHeader) {
            const cookies = cookieHeader.split(";").map((c) => c.trim())
            const targetCookie = cookies.find((c) => c.startsWith(`${name}=`))
            if (targetCookie) {
              return targetCookie.split("=")[1]
            }
          }
        }

        return undefined
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({
          name,
          value,
          ...options,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        })
      },
      remove(name: string, options: any) {
        cookieStore.set({
          name,
          value: "",
          ...options,
          maxAge: 0,
        })
      },
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Cart GET request started")

    const supabase = createSupabaseClient(request)

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] Cart GET: Authentication failed:", authError?.message)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Cart GET: User authenticated:", user.email)

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
          original_price,
          is_on_sale,
          images
        )
      `)
      .eq("user_id", user.id)

    if (error) {
      console.error("[v0] Error fetching cart items:", error)
      return NextResponse.json({ error: "Failed to fetch cart items" }, { status: 500 })
    }

    console.log("[v0] Cart items fetched:", cartItems?.length || 0)

    const transformedItems =
      cartItems?.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.products?.name || "Unknown Product",
        product_image: item.products?.images?.[0] || "/placeholder.svg",
        price: item.products?.is_on_sale ? item.products?.original_price : item.products?.price || 0,
        original_price: item.products?.original_price || item.products?.price || 0,
        is_on_sale: item.products?.is_on_sale || false,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      })) || []

    return NextResponse.json(transformedItems)
  } catch (error) {
    console.error("[v0] Error in cart GET API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Cart POST request started")

    const supabase = createSupabaseClient(request)

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] Cart POST: Authentication failed:", authError?.message)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Cart POST: User authenticated:", user.email)

    const body = await request.json()
    console.log("[v0] Cart POST: Request body:", body)

    const { product_id, quantity = 1, size, color } = body

    if (!product_id) {
      console.log("[v0] Cart POST: Missing product_id")
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(product_id)) {
      console.error("[v0] Invalid product ID format:", product_id)
      return NextResponse.json({ error: "Invalid product ID format" }, { status: 400 })
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, name")
      .eq("id", product_id)
      .single()

    if (productError || !product) {
      console.error("[v0] Product not found:", product_id, productError)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    console.log("[v0] Product found:", product.name)

    const { data: existingItem, error: checkError } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", product_id)
      .eq("size", size || "")
      .eq("color", color || "")
      .maybeSingle()

    if (checkError) {
      console.error("[v0] Error checking existing cart item:", checkError)
      return NextResponse.json({ error: "Failed to check cart" }, { status: 500 })
    }

    if (existingItem) {
      console.log("[v0] Updating existing cart item:", existingItem.id)
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id)

      if (updateError) {
        console.error("[v0] Error updating cart item:", updateError)
        return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
      }

      console.log("[v0] Cart item updated successfully")
    } else {
      console.log("[v0] Adding new cart item")
      const { error: insertError } = await supabase.from("cart_items").insert([
        {
          user_id: user.id,
          product_id,
          quantity,
          size: size || "",
          color: color || "",
        },
      ])

      if (insertError) {
        console.error("[v0] Error adding to cart:", insertError)
        return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
      }

      console.log("[v0] Cart item added successfully")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in cart POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("[v0] Cart DELETE request started")

    const supabase = createSupabaseClient(request)

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] Cart DELETE: Authentication failed:", authError?.message)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cartItemId = searchParams.get("id")

    if (!cartItemId) {
      return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId).eq("user_id", user.id) // Ensure user can only delete their own items

    if (error) {
      console.error("[v0] Error deleting cart item:", error)
      return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 })
    }

    console.log("[v0] Cart item deleted successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in cart DELETE API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
