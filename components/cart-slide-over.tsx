"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

interface CartSlideOverProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSlideOver({ isOpen, onClose }: CartSlideOverProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartItems(cart)
    }

    loadCart()

    // Listen for cart updates
    const handleCartUpdate = () => loadCart()
    window.addEventListener("cartUpdated", handleCartUpdate)

    return () => window.removeEventListener("cartUpdated", handleCartUpdate)
  }, [])

  const updateQuantity = (id: string, size: string, color: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id, size, color)
      return
    }

    const updatedCart = cartItems.map((item) =>
      item.id === id && item.size === size && item.color === color ? { ...item, quantity: newQuantity } : item,
    )

    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const removeItem = (id: string, size: string, color: string) => {
    const updatedCart = cartItems.filter((item) => !(item.id === id && item.size === size && item.color === color))

    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 1000 ? 0 : 100
  const total = subtotal + shipping

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({cartItems.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">Add some items to get started</p>
              <Button onClick={onClose} asChild>
                <Link href="/categories">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex gap-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div>
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {item.size}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.color}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="font-medium text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(item.id, item.size, item.color)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Cart Summary */}
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  {shipping === 0 && <p className="text-xs text-green-600">Free shipping on orders over ₹1,000!</p>}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={onClose} asChild>
                    <Link href="/cart">View Full Cart</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
