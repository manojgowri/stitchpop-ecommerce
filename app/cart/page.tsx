"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { fetchWithAuth } from "@/lib/fetch-with-auth"

interface CartItem {
  id: string
  product_id: string
  product_name: string
  product_image: string
  price: number
  size: string
  color: string
  quantity: number
}

interface Coupon {
  id: string
  code: string
  description: string
  discount_type: "percentage" | "fixed"
  discount_value: number
  minimum_order_amount: number
  maximum_discount_amount?: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([])
  const [showCoupons, setShowCoupons] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkUserAndFetchCart = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push("/auth/login")
        return
      }

      setUser(session.user)
      await fetchCartItems()
      await fetchAvailableCoupons()
    }

    checkUserAndFetchCart()
  }, [router])

  const fetchAvailableCoupons = async () => {
    try {
      const data = await fetchWithAuth("/api/coupons")
      setAvailableCoupons(data)
    } catch (error) {
      console.error("Error fetching available coupons:", error)
    }
  }

  const fetchCartItems = async () => {
    try {
      const data = await fetchWithAuth("/api/cart")
      setCartItems(data)
    } catch (error: any) {
      console.error("Error fetching cart items:", error)
      if (error.message.includes("not authenticated")) {
        console.error("Authentication failed, redirecting to login")
        router.push("/auth/login")
        return
      }
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      await fetchWithAuth(`/api/cart/${itemId}`, {
        method: "PUT",
        body: { quantity: newQuantity },
      })

      setCartItems((items) => items.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
      toast({
        title: "Success",
        description: "Quantity updated",
      })
    } catch (error: any) {
      console.error("Error updating quantity:", error)
      if (error.message.includes("not authenticated")) {
        router.push("/auth/login")
        return
      }
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await fetchWithAuth(`/api/cart/${itemId}`, { method: "DELETE" })

      setCartItems((items) => items.filter((item) => item.id !== itemId))
      toast({
        title: "Success",
        description: "Item removed from cart",
      })
    } catch (error: any) {
      console.error("Error removing item:", error)
      if (error.message.includes("not authenticated")) {
        router.push("/auth/login")
        return
      }
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  const applyCoupon = async (couponToApply?: Coupon) => {
    const codeToApply = couponToApply ? couponToApply.code : couponCode.trim()
    if (!codeToApply) return

    setCouponLoading(true)
    try {
      const response = await fetch(`/api/coupons?code=${codeToApply.toUpperCase()}`)

      if (response.ok) {
        const coupon = await response.json()
        const subtotal = calculateSubtotal()

        if (coupon.minimum_order_amount > subtotal) {
          toast({
            title: "Invalid Coupon",
            description: `Minimum order amount of ₹${coupon.minimum_order_amount} required`,
            variant: "destructive",
          })
          return
        }

        setAppliedCoupon(coupon)
        setCouponCode(coupon.code)
        setShowCoupons(false)
        toast({
          title: "Coupon Applied",
          description: `${coupon.description}`,
        })
      } else {
        const error = await response.json()
        toast({
          title: "Invalid Coupon",
          description: error.error || "Coupon code is invalid",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply coupon",
        variant: "destructive",
      })
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your order",
    })
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0

    const subtotal = calculateSubtotal()
    let discount = 0

    if (appliedCoupon.discount_type === "percentage") {
      discount = (subtotal * appliedCoupon.discount_value) / 100
    } else {
      discount = appliedCoupon.discount_value
    }

    if (appliedCoupon.maximum_discount_amount && discount > appliedCoupon.maximum_discount_amount) {
      discount = appliedCoupon.maximum_discount_amount
    }

    return Math.min(discount, subtotal)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discount = calculateDiscount()
    const shipping = subtotal > 999 ? 0 : 99
    const tax = Math.round((subtotal - discount) * 0.18)
    return subtotal - discount + shipping + tax
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <Button onClick={() => router.push("/")} size="lg">
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-gray-600">{cartItems.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={item.product_image || "/placeholder.svg"}
                      alt={item.product_name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.product_name}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline">Size: {item.size}</Badge>
                        <Badge variant="outline">Color: {item.color}</Badge>
                      </div>
                      <p className="text-lg font-bold mt-2">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="mb-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      disabled={!!appliedCoupon}
                    />
                    <Button
                      variant="outline"
                      onClick={() => applyCoupon()}
                      disabled={couponLoading || !!appliedCoupon || !couponCode.trim()}
                    >
                      <Tag className="h-4 w-4 mr-1" />
                      Apply
                    </Button>
                  </div>

                  {!appliedCoupon && availableCoupons.length > 0 && (
                    <div className="mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCoupons(!showCoupons)}
                        className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                      >
                        {showCoupons ? "Hide" : "View"} available coupons ({availableCoupons.length})
                      </Button>

                      {showCoupons && (
                        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                          {availableCoupons.map((coupon) => {
                            const subtotal = calculateSubtotal()
                            const isEligible = subtotal >= coupon.minimum_order_amount

                            return (
                              <div
                                key={coupon.id}
                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                  isEligible
                                    ? "border-green-200 bg-green-50 hover:bg-green-100"
                                    : "border-gray-200 bg-gray-50 opacity-60"
                                }`}
                                onClick={() => isEligible && applyCoupon(coupon)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-sm">{coupon.code}</p>
                                    <p className="text-xs text-gray-600">{coupon.description}</p>
                                    {!isEligible && (
                                      <p className="text-xs text-red-500 mt-1">
                                        Min. order: ₹{coupon.minimum_order_amount}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-medium text-green-600">
                                      {coupon.discount_type === "percentage"
                                        ? `${coupon.discount_value}% OFF`
                                        : `₹${coupon.discount_value} OFF`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-green-800">Coupon Applied: {appliedCoupon.code}</p>
                          <p className="text-xs text-green-600">{appliedCoupon.description}</p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={removeCoupon}>
                          ×
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{calculateSubtotal()}</span>
                  </div>

                  {appliedCoupon && calculateDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₹{calculateDiscount()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{calculateSubtotal() > 999 ? "Free" : "₹99"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{Math.round((calculateSubtotal() - calculateDiscount()) * 0.18)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
                <Button className="w-full mt-6" size="lg">
                  Proceed to Checkout
                </Button>
                <Button variant="outline" className="w-full mt-2 bg-transparent" onClick={() => router.push("/")}>
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
