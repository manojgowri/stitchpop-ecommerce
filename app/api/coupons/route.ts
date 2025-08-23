import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function createSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

function createAdminSupabaseClient() {
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get() {
        return undefined
      },
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const adminView = searchParams.get("admin") === "true"

    const supabase = adminView ? createAdminSupabaseClient() : createSupabaseClient()

    if (code) {
      // Validate specific coupon
      const { data: coupon, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("is_active", true)
        .single()

      if (error || !coupon) {
        return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 })
      }

      // Check if coupon is valid (dates and usage)
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

    if (adminView) {
      const authSupabase = createSupabaseClient()
      const {
        data: { user },
        error: authError,
      } = await authSupabase.auth.getUser()

      if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // Check if user is admin
      const isAdmin = user.user_metadata?.is_admin || user.email === "stitchpopclothing@gmail.com"

      if (!isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }

      // Admin view - get all coupons
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

    // Public view - get active coupons only
    const { data: coupons, error } = await supabase
      .from("coupons")
      .select("code, description, discount_type, discount_value, minimum_order_amount")
      .eq("is_active", true)
      .gte("expiry_date", new Date().toISOString())
      .lte("valid_from", new Date().toISOString())

    if (error) {
      console.error("[v0] Error fetching public coupons:", error)
      return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 })
    }

    return NextResponse.json(coupons)
  } catch (error) {
    console.error("Error in coupons API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] POST request started")

    const cookieStore = cookies()
    const allCookies = cookieStore.getAll()
    console.log(
      "[v0] Available cookies:",
      allCookies.map((c) => ({ name: c.name, hasValue: !!c.value })),
    )

    const supabase = createSupabaseClient()
    console.log("[v0] Supabase client created")

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] Auth check result:", {
      hasUser: !!user,
      userEmail: user?.email,
      authError: authError?.message,
      userMetadata: user?.user_metadata,
    })

    if (authError || !user) {
      console.log("[v0] Authentication failed:", authError?.message || "No user found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = user.user_metadata?.is_admin || user.email === "stitchpopclothing@gmail.com"

    if (!isAdmin) {
      console.log("[v0] User is not admin:", user.email)
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    console.log("[v0] API received body:", body)

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

    console.log("[v0] Extracted fields:", {
      code,
      description,
      discount_type,
      discount_value,
      minimum_order_amount,
      maximum_discount_amount,
      usage_limit,
      valid_from,
      expiry_date,
    })

    if (!code || !discount_type || !discount_value || !valid_from || !expiry_date) {
      console.log("[v0] Missing required fields validation failed")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const insertData = {
      code: code.toUpperCase(),
      description,
      discount_type,
      discount_value,
      minimum_order_amount,
      maximum_discount_amount,
      usage_limit,
      valid_from,
      expiry_date,
    }

    console.log("[v0] Data to insert:", insertData)

    const adminSupabase = createAdminSupabaseClient()
    const { data: coupon, error } = await adminSupabase.from("coupons").insert([insertData]).select().single()

    console.log("[v0] Supabase insert result:", { coupon, error })

    if (error) {
      console.log("[v0] Supabase error details:", error)
      if (error.code === "23505") {
        return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 })
      }
      return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 })
    }

    return NextResponse.json(coupon, { status: 201 })
  } catch (error) {
    console.error("Error creating coupon:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
