"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/cart-context"

interface CartSlideOverProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSlideOver({ isOpen, onClose }: CartSlideOverProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { cartItems, cartCount, updateQuantity, removeFromCart, clearCart, refreshCart } = useCart()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        refreshCart()
      }
    })

    return () => subscription.unsubscribe()
  }, [refreshCart])

  useEffect(() => {
    if (isOpen && user) {
      refreshCart()
    }
  }, [isOpen, user, refreshCart])

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (!user) return

    setLoading(true)
    try {
      await updateQuantity(cartItemId, newQuantity)
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
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (cartItemId: string) => {
    if (!user) return

    setLoading(true)
    try {
      await removeFromCart(cartItemId)
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
    } finally {
      setLoading(false)
    }
  }

  const handleClearCart = async () => {
    if (!user) return

    setLoading(true)
    try {
      await clearCart()
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
    } finally {
      setLoading(false)
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
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
            <h2 className="text-lg font-semibold flex items-center text-white">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Shopping Cart ({cartCount})
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-300 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {!user ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <ShoppingBag className="h-12 w-12 mb-2" />
                <p className="text-center mb-4">Please sign in to view your cart</p>
                <Button
                  className="bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-gray-200"
                  onClick={onClose}
                  asChild
                >
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <ShoppingBag className="h-12 w-12 mb-2" />
                <p className="text-center mb-4">Your cart is empty</p>
                <Button
                  className="bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-gray-200"
                  onClick={onClose}
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{cartItems.length} items</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearCart}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-3 border border-gray-700 rounded-lg hover:bg-gray-800 bg-gray-800/50"
                  >
                    <Image
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate text-white">{item.name}</h3>
                      {(item.size || item.color) && (
                        <p className="text-xs text-gray-400">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && " | "}
                          {item.color && `Color: ${item.color}`}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-white">₹{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0 border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
                        disabled={loading}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center text-white">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0 border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
                        disabled={loading}
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
            <div className="border-t border-gray-700 p-4 space-y-4 bg-gray-800">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex justify-between font-semibold text-white">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="text-xs text-gray-300 bg-blue-900/30 p-2 rounded border border-blue-700">
                  Add ₹{(1000 - subtotal).toLocaleString()} more for free shipping!
                </div>
              )}

              <div className="space-y-2">
                <Link href="/cart" onClick={onClose}>
                  <Button variant="outline" className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                    View Cart
                  </Button>
                </Link>
                <Link href="/checkout" onClick={onClose}>
                  <Button className="w-full bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-gray-200">
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
