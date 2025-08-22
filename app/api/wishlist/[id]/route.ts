import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const wishlistItemId = params.id

    const { error } = await supabase.from("wishlist").delete().eq("id", wishlistItemId)

    if (error) {
      return NextResponse.json({ error: "Failed to remove item from wishlist" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
