import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching banners:", error)
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, subtitle, image_url, redirect_url, display_order } = body

    const { data, error } = await supabase
      .from("banners")
      .insert([
        {
          title,
          subtitle,
          image_url,
          redirect_url,
          display_order: display_order || 0,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error creating banner:", error)
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 })
  }
}
