import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase.from("themes").select("*").eq("is_active", true).order("name")

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch themes" }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching themes:", error)
    return NextResponse.json({ error: "Failed to fetch themes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { data, error } = await supabase.from("themes").insert([body]).select().single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error creating theme:", error)
    return NextResponse.json({ error: "Failed to create theme" }, { status: 500 })
  }
}
