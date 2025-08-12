import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { quantity } = body
    const itemId = params.id

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Valid quantity is required" }, { status: 400 })
    }

    const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId)

    if (error) {
      console.error("Error updating cart item:", error)
      return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in cart PUT API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const itemId = params.id

    const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

    if (error) {
      console.error("Error deleting cart item:", error)
      return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in cart DELETE API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
