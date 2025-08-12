"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Calendar, Shield, Settings, Package, Heart, Crown } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  id: string
  email: string
  name: string
  is_admin: boolean
  created_at: string
  phone?: string
  address?: string
}

interface UserStats {
  totalOrders: number
  totalSpent: number
  wishlistItems: number
  reviewsCount: number
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    reviewsCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  })

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push("/auth/login")
        return
      }

      setUser(session.user)

      // Fetch user profile from database
      const { data: profileData, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", session.user.email)
        .single()

      if (error) {
        console.error("Error fetching profile:", error)
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from("users")
          .insert([
            {
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
              is_admin: false,
            },
          ])
          .select()
          .single()

        if (createError) {
          console.error("Error creating profile:", createError)
        } else {
          setProfile(newProfile)
          setFormData({
            name: newProfile.name || "",
            phone: newProfile.phone || "",
            address: newProfile.address || "",
          })
        }
      } else {
        setProfile(profileData)
        setFormData({
          name: profileData.name || "",
          phone: profileData.phone || "",
          address: profileData.address || "",
        })
      }

      // Fetch user statistics
      await fetchUserStats(session.user.id)
    } catch (error) {
      console.error("Error checking user:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async (userId: string) => {
    try {
      // Fetch orders count and total spent
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("total")
        .eq("user_id", userId)

      // Fetch wishlist count
      const { data: wishlistData, error: wishlistError } = await supabase
        .from("wishlist")
        .select("id")
        .eq("user_id", userId)

      // Fetch reviews count
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("id")
        .eq("user_id", userId)

      if (!ordersError && ordersData) {
        const totalSpent = ordersData.reduce((sum, order) => sum + (order.total || 0), 0)
        setStats((prev) => ({
          ...prev,
          totalOrders: ordersData.length,
          totalSpent,
        }))
      }

      if (!wishlistError && wishlistData) {
        setStats((prev) => ({
          ...prev,
          wishlistItems: wishlistData.length,
        }))
      }

      if (!reviewsError && reviewsData) {
        setStats((prev) => ({
          ...prev,
          reviewsCount: reviewsData.length,
        }))
      }
    } catch (error) {
      console.error("Error fetching user stats:", error)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setUpdating(true)
    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        })
        .eq("id", profile.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      // Refresh profile data
      checkUser()
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h2>
          <Button onClick={() => router.push("/")} size="lg" className="bg-gray-800 text-white hover:bg-gray-700">
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className={`${profile.is_admin ? "border-2 border-gradient-to-r from-purple-500 to-pink-500" : ""}`}>
              <CardHeader className="text-center">
                <div className="relative">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl bg-gray-800 text-white">
                      {profile.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {profile.is_admin && (
                    <div className="absolute -top-2 -right-2">
                      <Crown className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-gray-800">{profile.name}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
                {profile.is_admin && (
                  <Badge className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin Access
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-gray-100 bg-transparent"
                    onClick={() => router.push("/orders")}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    My Orders
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-gray-100 bg-transparent"
                    onClick={() => router.push("/wishlist")}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </Button>

                  {profile.is_admin && (
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-pink-100"
                      onClick={() => router.push("/admin/dashboard")}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Settings className="w-5 h-5 mr-2" />
                  Profile Settings
                </CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                        required
                        className="border-gray-300 focus:border-gray-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" value={profile.email} disabled className="bg-gray-100 border-gray-300" />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      type="tel"
                      className="border-gray-300 focus:border-gray-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter your address"
                      className="border-gray-300 focus:border-gray-500"
                    />
                  </div>

                  <Separator />

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          name: profile.name || "",
                          phone: profile.phone || "",
                          address: profile.address || "",
                        })
                      }}
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={updating} className="bg-gray-800 text-white hover:bg-gray-700">
                      {updating ? "Updating..." : "Update Profile"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Account Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-800">Account Statistics</CardTitle>
                <CardDescription>Your activity summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">₹{stats.totalSpent.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats.wishlistItems}</div>
                    <div className="text-sm text-gray-600">Wishlist Items</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{stats.reviewsCount}</div>
                    <div className="text-sm text-gray-600">Reviews</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
