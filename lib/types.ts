export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  size: string[]
  color: string[]
  fit: string
  stock: number
  image_url: string
  category: string
  gender: "men" | "women"
  created_at: string
}

export interface User {
  id: string
  name: string
  email: string
  is_admin: boolean
}

export interface Order {
  id: string
  user_id: string
  status: "pending" | "packed" | "shipped" | "delivered"
  payment_status: "paid" | "unpaid"
  total: number
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
}

export interface Coupon {
  id: string
  code: string
  discount_type: "flat" | "percentage"
  value: number
  expiry_date: string
}

export interface Review {
  id: string
  user_id: string
  product_id: string
  rating: number
  comment: string
  created_at: string
}
