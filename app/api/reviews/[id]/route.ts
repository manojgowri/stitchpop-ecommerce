import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { rating, title, comment } = body

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Update the review (RLS will ensure user can only update their own reviews)
    const { data: review, error } = await supabase
      .from("reviews")
      .update({
        rating: rating || undefined,
        title: title || null,
        comment: comment || null,
      })
      .eq("id", id)
      .eq("user_id", session.user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating review:", error)
      return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
    }

    if (!review) {
      return NextResponse.json({ error: "Review not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ review })
  } catch (error) {
    console.error("Error in reviews PUT API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Delete the review (RLS will ensure user can only delete their own reviews)
    const { error } = await supabase.from("reviews").delete().eq("id", id).eq("user_id", session.user.id)

    if (error) {
      console.error("Error deleting review:", error)
      return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
    }

    return NextResponse.json({ message: "Review deleted successfully" })
  } catch (error) {
    console.error("Error in reviews DELETE API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
