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
  is_featured?: boolean
  discount_percentage?: number
}

export interface User {
  id: string
  name: string
  email: string
  is_admin: boolean
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  status: "pending" | "packed" | "shipped" | "delivered"
  payment_status: "paid" | "unpaid"
  total: number
  created_at: string
  shipping_address?: string
  tracking_number?: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  size: string
  color: string
}

export interface Collection {
  id: string
  name: string
  description: string
  category: "men" | "women"
  image_url?: string
  is_active: boolean
  created_at: string
}

export interface Coupon {
  id: string
  code: string
  discount_type: "flat" | "percentage"
  value: number
  expiry_date: string
  is_active: boolean
  usage_limit?: number
  used_count: number
}

export interface Review {
  id: string
  user_id: string
  product_id: string
  rating: number
  comment: string
  created_at: string
  is_verified: boolean
}

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  size: string
  color: string
  product: Product
}

export interface LowStockAlert {
  product_id: string
  product_name: string
  current_stock: number
  threshold: number
  created_at: string
}
