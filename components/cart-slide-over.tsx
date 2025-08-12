"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  quantity: number
  size: string | null
  color: string | null
  image: string
}

interface CartSlideOverProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSlideOver({ isOpen, onClose }: CartSlideOverProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (isOpen && user) {
      fetchCartItems()
    }
  }, [isOpen, user])

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    setUser(session?.user || null)
  }

  const fetchCartItems = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("cart")
        .select(
          `
          id,
          product_id,
          quantity,
          size,
          color,
          products (
            name,
            price,
            images
          )
        `,
        )
        .eq("user_id", user.id)

      if (error) throw error

      const formattedItems =
        data?.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          name: item.products?.name || "Unknown Product",
          price: item.products?.price || 0,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.products?.images?.[0] || "/placeholder.svg?height=80&width=80&text=Product",
        })) || []

      setCartItems(formattedItems)
    } catch (error) {
      console.error("Error fetching cart items:", error)
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (!user) return

    try {
      if (newQuantity === 0) {
        await removeItem(cartItemId)
        return
      }

      const { error } = await supabase.from("cart").update({ quantity: newQuantity }).eq("id", cartItemId)

      if (error) throw error

      setCartItems((items) => items.map((item) => (item.id === cartItemId ? { ...item, quantity: newQuantity } : item)))

      toast({
        title: "Updated",
        description: "Cart updated successfully",
      })
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (cartItemId: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("cart").delete().eq("id", cartItemId)

      if (error) throw error

      setCartItems((items) => items.filter((item) => item.id !== cartItemId))

      toast({
        title: "Removed",
        description: "Item removed from cart",
      })
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      const { error } = await supabase.from("cart").delete().eq("user_id", user.id)

      if (error) throw error

      setCartItems([])

      toast({
        title: "Cart Cleared",
        description: "All items removed from cart",
      })
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      })
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 999 ? 0 : 99
  const total = subtotal + shipping

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />

      {/* Slide Over Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold flex items-center text-gray-800">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Shopping Cart ({cartItems.length})
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {!user ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <ShoppingBag className="h-12 w-12 mb-2" />
                <p className="text-center mb-4">Please sign in to view your cart</p>
                <Button className="bg-gray-800 text-white hover:bg-gray-700" onClick={onClose} asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <ShoppingBag className="h-12 w-12 mb-2" />
                <p className="text-center mb-4">Your cart is empty</p>
                <Button className="bg-gray-800 text-white hover:bg-gray-700" onClick={onClose}>
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{cartItems.length} items</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>

                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate text-gray-800">{item.name}</h3>
                      {(item.size || item.color) && (
                        <p className="text-xs text-gray-500">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && " | "}
                          {item.color && `Color: ${item.color}`}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-gray-800">₹{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0 border-gray-300"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0 border-gray-300"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {user && cartItems.length > 0 && (
            <div className="border-t p-4 space-y-4 bg-gray-50">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-gray-800">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded border border-blue-200">
                  Add ₹{(1000 - subtotal).toLocaleString()} more for free shipping!
                </div>
              )}

              <div className="space-y-2">
                <Link href="/cart" onClick={onClose}>
                  <Button variant="outline" className="w-full bg-white border-gray-300 hover:bg-gray-100">
                    View Cart
                  </Button>
                </Link>
                <Link href="/checkout" onClick={onClose}>
                  <Button className="w-full bg-gray-800 text-white hover:bg-gray-700">Checkout</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
