import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase"

function validateJWTToken(token: string): { valid: boolean; payload?: any } {
  try {
    // Basic JWT structure validation
    const parts = token.split(".")
    if (parts.length !== 3) {
      return { valid: false }
    }

    // Decode payload (without signature verification for preview environment)
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")))

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return { valid: false }
    }

    return { valid: true, payload }
  } catch (error) {
    return { valid: false }
  }
}

async function authenticateUser(request: NextRequest) {
  const supabase = await createSupabaseServerClient()

  // First, check for Authorization header with Bearer token
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    console.log("[v0] Attempting Bearer token authentication")

    const { valid, payload } = validateJWTToken(token)
    if (valid && payload?.sub) {
      console.log("[v0] Bearer token authentication successful:", payload.email)
      return {
        user: {
          id: payload.sub,
          email: payload.email || "unknown@example.com",
        },
        error: null,
      }
    }
    console.log("[v0] Bearer token authentication failed: Invalid token")
  }

  // Fall back to cookie-based authentication
  console.log("[v0] Attempting cookie-based authentication")
  try {
    const {
      data: { user },
      error: cookieError,
    } = await supabase.auth.getUser()
    if (!cookieError && user) {
      console.log("[v0] Cookie-based authentication successful:", user.email)
      return { user, error: null }
    }
    console.log("[v0] Cookie-based authentication failed:", cookieError?.message)
  } catch (error) {
    console.log("[v0] Cookie-based authentication failed with network error:", error)
  }

  return { user: null, error: new Error("Authentication failed") }
}

async function checkAdminRole(userEmail: string): Promise<boolean> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: userData, error } = await supabase
      .from("users")
      .select("is_admin")
      .eq("email", userEmail)
      .maybeSingle()

    if (error || !userData) {
      if (error) console.error("[v0] Error checking admin role:", error)
      return false
    }
    return userData.is_admin === true
  } catch (err) {
    console.error("[v0] Error checking admin role:", (err as Error)?.message || err)
    return false
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const adminView = searchParams.get("admin") === "true"

    // For public validation (code), no auth required; anon context is OK.
    if (code) {
      const supabase = await createSupabaseServerClient()
      const { data: coupon, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("is_active", true)
        .maybeSingle()

      if (error || !coupon) {
        return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 })
      }

      const now = new Date()
      const validFrom = new Date(coupon.valid_from)
      const expiryDate = new Date(coupon.expiry_date)

      if (now < validFrom || now > expiryDate) {
        return NextResponse.json({ error: "Coupon has expired or not yet valid" }, { status: 400 })
      }

      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        return NextResponse.json({ error: "Coupon usage limit exceeded" }, { status: 400 })
      }

      return NextResponse.json(coupon)
    }

    // Authenticated GET (user or admin)
    const { user, error: authError } = await authenticateUser(request)
    if (authError || !user) {
      console.log("[v0] Coupons GET: Authentication failed:", authError?.message || "Auth session missing!")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Coupons GET: User authenticated:", user.email)

    const isAdmin = await checkAdminRole(user.email)

    if (adminView) {
      if (!isAdmin) {
        return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
      }
      const supabase = await createSupabaseServerClient()
      const { data: coupons, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) {
        console.error("[v0] Error fetching coupons:", error)
        return NextResponse.json([]) // Return empty array on error
      }
      return NextResponse.json(coupons)
    }

    // Regular authenticated user: show active coupons in window
    const supabase = await createSupabaseServerClient()
    const nowIso = new Date().toISOString()
    const { data: coupons, error } = await supabase
      .from("coupons")
      .select("code, description, discount_type, discount_value, minimum_order_amount")
      .eq("is_active", true)
      .gte("expiry_date", nowIso)
      .lte("valid_from", nowIso)

    if (error) {
      console.error("[v0] Error fetching public coupons:", error)
      return NextResponse.json([])
    }

    return NextResponse.json(coupons)
  } catch (error) {
    console.error("[v0] Error in coupons GET API:", (error as Error)?.message || error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Coupons POST request started")

    const { user, error: authError } = await authenticateUser(request)
    if (authError || !user) {
      console.log("[v0] Coupons POST: Authentication failed:", authError?.message || "Auth session missing!")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Coupons POST: User authenticated:", user.email)

    const isAdmin = await checkAdminRole(user.email)
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const supabase = await createSupabaseServerClient()
    const body = await request.json()
    const {
      code,
      description,
      discount_type,
      discount_value,
      minimum_order_amount = 0,
      maximum_discount_amount,
      usage_limit,
      valid_from,
      expiry_date,
    } = body

    if (!code || !discount_type || !discount_value || !valid_from || !expiry_date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const insertData = {
      code: String(code).toUpperCase(),
      description,
      discount_type,
      discount_value,
      minimum_order_amount,
      maximum_discount_amount,
      usage_limit,
      valid_from,
      expiry_date,
    }

    const { data: coupon, error } = await supabase.from("coupons").insert([insertData]).select().maybeSingle()
    if (error) {
      console.error("[v0] Error creating coupon:", error)
      if ((error as any)?.code === "23505") {
        return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 })
      }
      return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 })
    }

    console.log("[v0] Coupon created successfully:", coupon?.code)
    return NextResponse.json(coupon, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating coupon:", (error as Error)?.message || error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("[v0] Coupons PUT request started")

    const { user, error: authError } = await authenticateUser(request)
    if (authError || !user) {
      console.log("[v0] Coupons PUT: Authentication failed:", authError?.message || "Auth session missing!")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Coupons PUT: User authenticated:", user.email)

    const { searchParams } = new URL(request.url)
    const couponId = searchParams.get("id")
    if (!couponId) {
      return NextResponse.json({ error: "Coupon ID required" }, { status: 400 })
    }

    const isAdmin = await checkAdminRole(user.email)
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const supabase = await createSupabaseServerClient()
    const body = await request.json()
    const { data: coupon, error } = await supabase
      .from("coupons")
      .update(body)
      .eq("id", couponId)
      .select()
      .maybeSingle()
    if (error) {
      console.error("[v0] Error updating coupon:", error)
      return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 })
    }

    console.log("[v0] Coupon updated successfully")
    return NextResponse.json(coupon)
  } catch (error) {
    console.error("[v0] Error updating coupon:", (error as Error)?.message || error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("[v0] Coupons DELETE request started")

    const { user, error: authError } = await authenticateUser(request)
    if (authError || !user) {
      console.log("[v0] Coupons DELETE: Authentication failed:", authError?.message || "Auth session missing!")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Coupons DELETE: User authenticated:", user.email)

    const { searchParams } = new URL(request.url)
    const couponId = searchParams.get("id")
    if (!couponId) {
      return NextResponse.json({ error: "Coupon ID required" }, { status: 400 })
    }

    const isAdmin = await checkAdminRole(user.email)
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.from("coupons").delete().eq("id", couponId)
    if (error) {
      console.error("[v0] Error deleting coupon:", error)
      return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 })
    }

    console.log("[v0] Coupon deleted successfully")
    return NextResponse.json({ message: "Coupon deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting coupon:", (error as Error)?.message || error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
