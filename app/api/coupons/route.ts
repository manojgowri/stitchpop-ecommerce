import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

async function authenticateUser(
  request: NextRequest,
): Promise<{ user: any | null; accessToken: string | null; error: string | null }> {
  const supabase = createRouteHandlerClient({ cookies })

  // 1) Bearer token first
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7)
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token)
      if (user && !error) {
        return { user, accessToken: token, error: null }
      }
    } catch (err) {
      console.error("[v0] Bearer token authentication failed:", (err as Error)?.message || err)
    }
  }

  // 2) Fallback to cookie-based session
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (!user || error) {
    return { user: null, accessToken: null, error: "Unauthorized" }
  }

  return { user, accessToken: null, error: null }
}

async function checkAdminRole(
  supabase: ReturnType<typeof createRouteHandlerClient>,
  userEmail: string,
): Promise<boolean> {
  try {
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
      const supabase = createRouteHandlerClient({ cookies })
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
    const { user, accessToken, error: authError } = await authenticateUser(request)
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createRouteHandlerClient({ cookies })
    if (accessToken) {
      await supabase.auth.setAuth(accessToken)
    }

    const isAdmin = await checkAdminRole(supabase, user.email)

    if (adminView) {
      if (!isAdmin) {
        return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
      }
      const { data: coupons, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) {
        console.error("[v0] Error fetching coupons:", error)
        return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 })
      }
      return NextResponse.json(coupons)
    }

    // Regular authenticated user: show active coupons in window
    const nowIso = new Date().toISOString()
    const { data: coupons, error } = await supabase
      .from("coupons")
      .select("code, description, discount_type, discount_value, minimum_order_amount")
      .eq("is_active", true)
      .gte("expiry_date", nowIso)
      .lte("valid_from", nowIso)

    if (error) {
      console.error("[v0] Error fetching public coupons:", error)
      return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 })
    }

    return NextResponse.json(coupons)
  } catch (error) {
    console.error("Error in coupons GET API:", (error as Error)?.message || error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, accessToken, error: authError } = await authenticateUser(request)
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createRouteHandlerClient({ cookies })
    if (accessToken) {
      await supabase.auth.setAuth(accessToken)
    }

    const isAdmin = await checkAdminRole(supabase, user.email)
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

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

    return NextResponse.json(coupon, { status: 201 })
  } catch (error) {
    console.error("Error creating coupon:", (error as Error)?.message || error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user, accessToken, error: authError } = await authenticateUser(request)
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const couponId = searchParams.get("id")
    if (!couponId) {
      return NextResponse.json({ error: "Coupon ID required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })
    if (accessToken) {
      await supabase.auth.setAuth(accessToken)
    }

    const isAdmin = await checkAdminRole(supabase, user.email)
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

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

    return NextResponse.json(coupon)
  } catch (error) {
    console.error("Error updating coupon:", (error as Error)?.message || error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user, accessToken, error: authError } = await authenticateUser(request)
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const couponId = searchParams.get("id")
    if (!couponId) {
      return NextResponse.json({ error: "Coupon ID required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })
    if (accessToken) {
      await supabase.auth.setAuth(accessToken)
    }

    const isAdmin = await checkAdminRole(supabase, user.email)
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const { error } = await supabase.from("coupons").delete().eq("id", couponId)
    if (error) {
      console.error("[v0] Error deleting coupon:", error)
      return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 })
    }

    return NextResponse.json({ message: "Coupon deleted successfully" })
  } catch (error) {
    console.error("Error deleting coupon:", (error as Error)?.message || error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
