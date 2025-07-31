"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase"
import { CartSlideOver } from "@/components/cart-slide-over"

interface UserInterface {
  id: string
  email: string
  is_admin?: boolean
}

export function Header() {
  const [user, setUser] = useState<UserInterface | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        // Get user details including admin status
        const { data: userData } = await supabase
          .from("users")
          .select("id, email, is_admin")
          .eq("id", session.user.id)
          .single()

        setUser(userData || { id: session.user.id, email: session.user.email || "" })
      }
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: userData } = await supabase
          .from("users")
          .select("id, email, is_admin")
          .eq("id", session.user.id)
          .single()

        setUser(userData || { id: session.user.id, email: session.user.email || "" })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    // Get cart count
    const getCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      const count = cart.reduce((total: number, item: any) => total + item.quantity, 0)
      setCartCount(count)
    }

    getCartCount()

    // Listen for cart updates
    const handleCartUpdate = () => getCartCount()
    window.addEventListener("cartUpdated", handleCartUpdate)

    return () => window.removeEventListener("cartUpdated", handleCartUpdate)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const navigation = [
    { name: "Men", href: "/men" },
    { name: "Women", href: "/women" },
    { name: "Categories", href: "/categories" },
    { name: "Collections", href: "/collections" },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link href="/sale" className="text-lg font-medium text-red-600 transition-colors hover:text-red-700">
                    Sale
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/logo.png" alt="Stitch POP Logo" width={32} height={32} className="h-8 w-8" />
                <span className="font-bold text-xl">Stitch POP</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/sale" className="text-sm font-medium text-red-600 transition-colors hover:text-red-700">
                Sale
              </Link>
            </nav>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-sm mx-6">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Cart */}
              <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
                <span className="sr-only">Shopping cart</span>
              </Button>

              {/* User menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                      <span className="sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">Orders</Link>
                    </DropdownMenuItem>
                    {user.is_admin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard">Admin Dashboard</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/auth/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>
      </header>

      {/* Cart Slide Over */}
      <CartSlideOver isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
