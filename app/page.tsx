import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, Truck, Shield, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const featuredProducts = [
    {
      id: "1",
      name: "Premium Cotton T-Shirt",
      price: 899,
      originalPrice: 1299,
      image: "/placeholder.svg?height=300&width=300&text=T-Shirt",
      rating: 4.5,
      reviews: 128,
      badge: "Best Seller",
    },
    {
      id: "2",
      name: "Casual Denim Jeans",
      price: 1999,
      originalPrice: 2499,
      image: "/placeholder.svg?height=300&width=300&text=Jeans",
      rating: 4.3,
      reviews: 89,
      badge: "New",
    },
    {
      id: "3",
      name: "Summer Floral Dress",
      price: 1599,
      originalPrice: 2199,
      image: "/placeholder.svg?height=300&width=300&text=Dress",
      rating: 4.7,
      reviews: 156,
      badge: "Sale",
    },
    {
      id: "4",
      name: "Classic Polo Shirt",
      price: 1299,
      originalPrice: 1699,
      image: "/placeholder.svg?height=300&width=300&text=Polo",
      rating: 4.4,
      reviews: 92,
      badge: "Popular",
    },
  ]

  const categories = [
    {
      name: "Men's Collection",
      href: "/men",
      image: "/placeholder.svg?height=400&width=600&text=Men's+Fashion",
      description: "Discover premium men's clothing",
    },
    {
      name: "Women's Collection",
      href: "/women",
      image: "/placeholder.svg?height=400&width=600&text=Women's+Fashion",
      description: "Explore elegant women's fashion",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Discover Your <span className="text-yellow-300">Perfect Style</span>
                </h1>
                <p className="text-lg lg:text-xl text-white/90 max-w-lg">
                  Premium fashion and lifestyle brand offering the latest trends in clothing for men and women. Quality,
                  style, and comfort in every piece.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
                >
                  View Collections
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=500&width=500&text=Fashion+Hero"
                  alt="Fashion Hero"
                  width={500}
                  height={500}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Truck className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-muted-foreground">Free shipping on orders over ₹1,000</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold">Secure Payment</h3>
              <p className="text-muted-foreground">100% secure payment processing</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Headphones className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-muted-foreground">Round the clock customer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collections designed for every style and occasion
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category) => (
              <Link key={category.name} href={category.href} className="group">
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="relative aspect-[3/2]">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                      <div className="space-y-2">
                        <h3 className="text-2xl lg:text-3xl font-bold">{category.name}</h3>
                        <p className="text-white/90">{category.description}</p>
                        <Button variant="secondary" className="mt-4">
                          Shop Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular items loved by customers worldwide
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group">
                <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="relative aspect-square">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 left-2" variant="secondary">
                      {product.badge}
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/categories">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Stay in Style</h2>
            <p className="text-primary-foreground/90">
              Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and style
              tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md text-foreground"
              />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
