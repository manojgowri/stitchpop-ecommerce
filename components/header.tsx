"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, ShoppingCart, Menu, LogOut, Settings, Package, User } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { CartSlideOver } from "@/components/cart-slide-over"

interface AppUser {
  id: string
  email: string
  name: string
  is_admin: boolean
}

export function Header() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await checkUser()
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setCartCount(0)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      fetchCartCount()
    }
  }, [user])

  const checkUser = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (authUser) {
        // Fetch user details from our users table
        const { data: userData, error } = await supabase.from("users").select("*").eq("id", authUser.id).single()

        if (userData && !error) {
          setUser(userData)
        } else {
          // Create user if doesn't exist
          const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert({
              id: authUser.id,
              email: authUser.email || "",
              name: authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
              is_admin: false,
            })
            .select()
            .single()

          if (newUser && !insertError) {
            setUser(newUser)
          }
        }
      }
    } catch (error) {
      console.error("Error checking user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCartCount = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from("cart").select("quantity").eq("user_id", user.id)

      if (!error && data) {
        const total = data.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(total)
      }
    } catch (error) {
      console.error("Error fetching cart count:", error)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setCartCount(0)
      router.push("/")
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/men" className="text-sm font-medium hover:text-primary transition-colors">
                Men
              </Link>
              <Link href="/women" className="text-sm font-medium hover:text-primary transition-colors">
                Women
              </Link>
              <Link href="/sale" className="text-sm font-medium hover:text-primary transition-colors text-red-600">
                Sale
              </Link>
            </nav>

            {/* Centered Logo */}
            <Link href="/" className="flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
              <Image src="/logo.png" alt="Stitch POP" width={32} height={32} className="h-8 w-8" />
              <span className="font-bold text-xl">Stitch POP</span>
            </Link>

            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </form>

              {/* Cart */}
              <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              {!isLoading && (
                <>
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                            <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <div className="flex items-center justify-start gap-2 p-2">
                          <div className="flex flex-col space-y-1 leading-none">
                            <p className="font-medium">{user.name}</p>
                            <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/orders" className="cursor-pointer">
                            <Package className="mr-2 h-4 w-4" />
                            Orders
                          </Link>
                        </DropdownMenuItem>
                        {user.is_admin && (
                          <DropdownMenuItem asChild>
                            <Link href="/admin/dashboard" className="cursor-pointer">
                              <Settings className="mr-2 h-4 w-4" />
                              Admin Dashboard
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" asChild>
                        <Link href="/auth/login">Sign In</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/auth/register">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-4">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          type="search"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </form>

                    {/* Mobile Navigation */}
                    <nav className="flex flex-col space-y-2">
                      <Link href="/men" className="text-lg font-medium hover:text-primary transition-colors py-2">
                        Men
                      </Link>
                      <Link href="/women" className="text-lg font-medium hover:text-primary transition-colors py-2">
                        Women
                      </Link>
                      <Link
                        href="/categories"
                        className="text-lg font-medium hover:text-primary transition-colors py-2"
                      >
                        Categories
                      </Link>
                      <Link
                        href="/collections"
                        className="text-lg font-medium hover:text-primary transition-colors py-2"
                      >
                        Collections
                      </Link>
                      <Link
                        href="/sale"
                        className="text-lg font-medium hover:text-primary transition-colors py-2 text-red-600"
                      >
                        Sale
                      </Link>
                    </nav>

                    {/* Mobile User Actions */}
                    {user ? (
                      <div className="flex flex-col space-y-2 pt-4 border-t">
                        <div className="flex items-center space-x-2 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                            <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Button variant="ghost" asChild className="justify-start">
                          <Link href="/profile">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Link>
                        </Button>
                        <Button variant="ghost" asChild className="justify-start">
                          <Link href="/orders">
                            <Package className="mr-2 h-4 w-4" />
                            Orders
                          </Link>
                        </Button>
                        {user.is_admin && (
                          <Button variant="ghost" asChild className="justify-start">
                            <Link href="/admin/dashboard">
                              <Settings className="mr-2 h-4 w-4" />
                              Admin Dashboard
                            </Link>
                          </Button>
                        )}
                        <Button variant="ghost" onClick={handleSignOut} className="justify-start">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2 pt-4 border-t">
                        <Button variant="ghost" asChild>
                          <Link href="/auth/login">Sign In</Link>
                        </Button>
                        <Button asChild>
                          <Link href="/auth/register">Sign Up</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Slide Over */}
      <CartSlideOver open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  )
}
