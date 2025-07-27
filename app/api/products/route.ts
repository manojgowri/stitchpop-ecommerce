import { NextResponse } from "next/server"

// Mock product data - in production, this would come from Supabase
const products = [
  {
    id: 1,
    name: "Men's Graphic Print T-shirt",
    description: "Comfortable oversized fit with unique graphic design",
    price: 399,
    originalPrice: 899,
    size: ["S", "M", "L", "XL"],
    color: ["Black", "White", "Gray"],
    fit: "Oversized",
    stock: 50,
    image_url: "/placeholder.svg?height=300&width=250",
    category: "t-shirts",
    gender: "men",
  },
  {
    id: 2,
    name: "Women's Crop Top",
    description: "Stylish crop top perfect for casual wear",
    price: 299,
    originalPrice: 599,
    size: ["XS", "S", "M", "L"],
    color: ["Pink", "Black", "White"],
    fit: "Regular",
    stock: 30,
    image_url: "/placeholder.svg?height=300&width=250",
    category: "tops",
    gender: "women",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const gender = searchParams.get("gender")

    let filteredProducts = products

    if (category) {
      filteredProducts = filteredProducts.filter((p) => p.category === category)
    }

    if (gender) {
      filteredProducts = filteredProducts.filter((p) => p.gender === gender)
    }

    return NextResponse.json(filteredProducts)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // In production, save to Supabase
    const newProduct = {
      id: products.length + 1,
      ...body,
      created_at: new Date().toISOString(),
    }
    products.push(newProduct)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
