"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

interface CartItem {
  id: string
  product_id: string
  quantity: number
  size: string | null
  color: string | null
  product: {
    id: string
    name: string
    price: number
    images: string[]
  }
}

interface CartSlideOverProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSlideOver({ open, onOpenChange }: CartSlideOverProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user && open) {
      fetchCartItems()
    }
  }, [user, open])

  const checkUser = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    setUser(authUser)
  }

  const fetchCartItems = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("cart")
        .select(`
          *,
          product:products(*)
        `)
        .eq("user_id", user.id)

      if (!error && data) {
        setCartItems(data)
      }
    } catch (error) {
      console.error("Error fetching cart items:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(itemId)
      return
    }

    try {
      const { error } = await supabase.from("cart").update({ quantity: newQuantity }).eq("id", itemId)

      if (!error) {
        setCartItems((items) => items.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase.from("cart").delete().eq("id", itemId)

      if (!error) {
        setCartItems((items) => items.filter((item) => item.id !== itemId))
        toast({
          title: "Item removed",
          description: "Item has been removed from your cart",
        })
      }
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  if (!user) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <p className="text-lg font-medium">Please sign in to view your cart</p>
            <Button asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Shopping Cart
            {cartItems.length > 0 && <Badge variant="secondary">{getTotalItems()} items</Badge>}
          </SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 space-y-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground text-center">Add some items to your cart to get started</p>
            <Button onClick={() => onOpenChange(false)}>Continue Shopping</Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex space-x-4 py-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-medium text-sm leading-tight">{item.product.name}</h3>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">₹{item.product.price}</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-700"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between text-lg font-medium">
                <span>Total</span>
                <span>₹{getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="space-y-2">
                <Button className="w-full" size="lg">
                  Checkout
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => onOpenChange(false)}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
