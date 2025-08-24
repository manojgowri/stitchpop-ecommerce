"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

interface CartItem {
  id: string
  product_id: string
  product_name: string
  product_image: string
  price: number
  original_price?: number
  is_on_sale?: boolean
  size: string
  color: string
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  cartCount: number
  loading: boolean
  addToCart: (productId: string, quantity?: number, size?: string, color?: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      refreshCart()
      setupRealtimeSubscription(user.id)
    } else {
      setCartItems([])
      setCartCount(0)
    }
  }, [user])

  const setupRealtimeSubscription = useCallback((userId: string) => {
    const channel = supabase
      .channel("cart_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cart",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Refresh cart when changes occur
          refreshCart()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const refreshCart = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const response = await fetch("/api/cart", {
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token && {
            Authorization: `Bearer ${session.access_token}`,
          }),
        },
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setCartItems(data)
        setCartCount(data.reduce((sum: number, item: CartItem) => sum + item.quantity, 0))
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      setLoading(false)
    }
  }, [user])

  const addToCart = async (productId: string, quantity = 1, size = "", color = "") => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      })
      return
    }

    // Optimistic update
    setCartCount((prev) => prev + quantity)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token && {
            Authorization: `Bearer ${session.access_token}`,
          }),
        },
        credentials: "include",
        body: JSON.stringify({
          product_id: productId,
          quantity,
          size,
          color,
        }),
      })

      if (response.ok) {
        toast({
          title: "Added to cart",
          description: "Item added successfully",
        })
        // Real-time subscription will handle the update
      } else {
        throw new Error("Failed to add to cart")
      }
    } catch (error) {
      // Revert optimistic update on error
      setCartCount((prev) => prev - quantity)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    // Optimistic update
    const oldItem = cartItems.find((item) => item.id === itemId)
    if (oldItem) {
      const quantityDiff = newQuantity - oldItem.quantity
      setCartCount((prev) => prev + quantityDiff)
      setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token && {
            Authorization: `Bearer ${session.access_token}`,
          }),
        },
        credentials: "include",
        body: JSON.stringify({ quantity: newQuantity }),
      })

      if (response.ok) {
        toast({
          title: "Updated",
          description: "Quantity updated successfully",
        })
      } else {
        throw new Error("Failed to update quantity")
      }
    } catch (error) {
      // Revert optimistic update on error
      if (oldItem) {
        const quantityDiff = oldItem.quantity - newQuantity
        setCartCount((prev) => prev + quantityDiff)
        setCartItems((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, quantity: oldItem.quantity } : item)),
        )
      }
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (itemId: string) => {
    // Optimistic update
    const itemToRemove = cartItems.find((item) => item.id === itemId)
    if (itemToRemove) {
      setCartCount((prev) => prev - itemToRemove.quantity)
      setCartItems((prev) => prev.filter((item) => item.id !== itemId))
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          ...(session?.access_token && {
            Authorization: `Bearer ${session.access_token}`,
          }),
        },
        credentials: "include",
      })

      if (response.ok) {
        toast({
          title: "Removed",
          description: "Item removed from cart",
        })
      } else {
        throw new Error("Failed to remove item")
      }
    } catch (error) {
      // Revert optimistic update on error
      if (itemToRemove) {
        setCartCount((prev) => prev + itemToRemove.quantity)
        setCartItems((prev) => [...prev, itemToRemove])
      }
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  const clearCart = async () => {
    if (!user) return

    // Optimistic update
    const oldItems = [...cartItems]
    const oldCount = cartCount
    setCartItems([])
    setCartCount(0)

    try {
      const { error } = await supabase.from("cart").delete().eq("user_id", user.id)

      if (error) throw error

      toast({
        title: "Cart cleared",
        description: "All items removed from cart",
      })
    } catch (error) {
      // Revert optimistic update on error
      setCartItems(oldItems)
      setCartCount(oldCount)
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      })
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
