"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, AlertTriangle, Package, ShoppingCart, TrendingUp, Upload } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price: number | null
  stock: number
  category_id: string
  theme_id: string | null
  gender: string
  is_active: boolean
  is_featured: boolean
  is_on_sale: boolean
  images: string[]
  sizes: string[]
  colors: string[]
  fabric_composition?: string
  care_instructions?: string
  size_chart?: string
  manufacturer?: string
  created_at: string
  categories?: {
    name: string
  }
  themes?: {
    name: string
  }
}

interface Theme {
  id: string
  name: string
  description: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
}

interface Category {
  id: string
  name: string
  description: string | null
  gender: string
  is_active: boolean
  image_url: string | null
  created_at: string
}

interface Order {
  id: string
  user_id: string
  total: number
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [uploadingImages, setUploadingImages] = useState<File[]>([])
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockCount: 0,
  })

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    category_id: "",
    theme_id: "",
    gender: "",
    sizes: "",
    colors: "",
    stock: "",
    images: "",
    fabric_composition: "",
    care_instructions: "",
    size_chart: "",
    manufacturer: "",
    is_on_sale: false,
    is_featured: false,
  })

  const [newTheme, setNewTheme] = useState({
    name: "",
    description: "",
    image_url: "",
  })

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    gender: "",
    image_url: "",
  })

  const [fabricTemplates, setFabricTemplates] = useState<any[]>([])
  const [careTemplates, setCareTemplates] = useState<any[]>([])
  const [sizeChartTemplates, setSizeChartTemplates] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("active")

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user?.user_metadata?.is_admin) {
        router.push("/")
        return
      }

      setUser(session.user)
      await Promise.all([
        fetchProducts(),
        fetchThemes(),
        fetchCategories(),
        fetchOrders(),
        fetchStats(),
        fetchTemplates(),
      ])
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const fetchTemplates = async () => {
    try {
      const [fabricRes, careRes, sizeRes] = await Promise.all([
        supabase.from("fabric_templates").select("*").order("name"),
        supabase.from("care_templates").select("*").order("name"),
        supabase.from("size_chart_templates").select("*").order("manufacturer, category"),
      ])

      if (fabricRes.data) setFabricTemplates(fabricRes.data)
      if (careRes.data) setCareTemplates(careRes.data)
      if (sizeRes.data) setSizeChartTemplates(sizeRes.data)
    } catch (error) {
      console.error("Error fetching templates:", error)
    }
  }

  const checkAdminAccess = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push("/auth/login")
        return
      }

      // Check if user is admin in the users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", session.user.email)
        .single()

      if (userError || !userData?.is_admin) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges. Contact support if you believe this is an error.",
          variant: "destructive",
        })
        router.push("/")
        return
      }

      setUser(session.user)
      await Promise.all([fetchProducts(), fetchThemes(), fetchCategories(), fetchOrders(), fetchStats()])
      setLoading(false)
    } catch (error) {
      console.error("Error checking admin access:", error)
      router.push("/")
    }
  }

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            name
          ),
          themes (
            name
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase.from("themes").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setThemes(data || [])
    } catch (error) {
      console.error("Error fetching themes:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("gender", { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const fetchStats = async () => {
    try {
      // Get product count
      const { count: productCount } = await supabase.from("products").select("*", { count: "exact", head: true })

      // Get order count and revenue
      const { data: orderData } = await supabase.from("orders").select("total")
      const totalRevenue = orderData?.reduce((sum, order) => sum + order.total, 0) || 0

      // Get low stock count
      const { count: lowStockCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .lte("stock", 5)

      setStats({
        totalProducts: productCount || 0,
        totalOrders: orderData?.length || 0,
        totalRevenue,
        lowStockCount: lowStockCount || 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Check file size (500KB = 500 * 1024 bytes)
      if (file.size > 500 * 1024) {
        throw new Error("Image size must be less than 500KB")
      }

      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("product-images").getPublicUrl(filePath)

      return data.publicUrl
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return

    const validFiles: File[] = []
    const maxSize = 500 * 1024 // 500KB in bytes

    for (let i = 0; i < Math.min(files.length, 3); i++) {
      const file = files[i]
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 500KB. Please choose a smaller image.`,
          variant: "destructive",
        })
        continue
      }
      validFiles.push(file)
    }

    if (validFiles.length > 0) {
      setUploadingImages(validFiles)
      // Here you would typically upload to a service like Cloudinary or Supabase Storage
      // For now, we'll show a message about manual URL entry
      toast({
        title: "Image Upload",
        description:
          "Please upload your images to Imgur or Cloudinary and paste the URLs in the Image URLs field below.",
      })
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: Number.parseFloat(newProduct.price),
        original_price: newProduct.original_price ? Number.parseFloat(newProduct.original_price) : null,
        category_id: newProduct.category_id,
        theme_id: newProduct.theme_id || null,
        gender: newProduct.gender,
        stock: Number.parseInt(newProduct.stock),
        sizes: newProduct.sizes.split(",").map((s) => s.trim()),
        colors: newProduct.colors.split(",").map((c) => c.trim()),
        images: newProduct.images
          .split(",")
          .map((i) => i.trim())
          .filter((url) => url.length > 0),
        is_active: true,
        is_featured: newProduct.is_featured,
        is_on_sale: newProduct.is_on_sale, // Sale toggle controls whether product appears on sale page
        fabric_composition: newProduct.fabric_composition,
        care_instructions: newProduct.care_instructions,
        size_chart: newProduct.size_chart,
        manufacturer: newProduct.manufacturer,
      }

      const { error } = await supabase.from("products").insert([productData])

      if (error) throw error

      toast({
        title: "Success",
        description: `Product added successfully${newProduct.is_on_sale ? " and added to sale page" : ""}`,
      })

      setNewProduct({
        name: "",
        description: "",
        price: "",
        original_price: "",
        category_id: "",
        theme_id: "",
        gender: "",
        sizes: "",
        colors: "",
        stock: "",
        images: "",
        fabric_composition: "",
        care_instructions: "",
        size_chart: "",
        manufacturer: "",
        is_on_sale: false,
        is_featured: false,
      })

      fetchProducts()
      fetchStats()
    } catch (error: any) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add product",
        variant: "destructive",
      })
    }
  }

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          original_price: editingProduct.original_price,
          stock: editingProduct.stock,
          is_on_sale: editingProduct.is_on_sale,
          is_featured: editingProduct.is_featured,
        })
        .eq("id", editingProduct.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Product updated successfully",
      })

      setEditingProduct(null)
      fetchProducts()
    } catch (error: any) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      })
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const categoryData = {
        name: newCategory.name,
        description: newCategory.description,
        gender: newCategory.gender,
        is_active: true,
      }

      const { error } = await supabase.from("categories").insert([categoryData])

      if (error) throw error

      toast({
        title: "Success",
        description: "Category added successfully",
      })

      setNewCategory({
        name: "",
        description: "",
        gender: "",
      })

      fetchCategories()
    } catch (error: any) {
      console.error("Error adding category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add category",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const { error } = await supabase.from("categories").update({ is_active: false }).eq("id", categoryId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Category deleted successfully",
      })

      fetchCategories()
    } catch (error: any) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const handleAddTheme = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const themeData = {
        name: newTheme.name,
        description: newTheme.description,
        image_url: newTheme.image_url,
        is_active: true,
      }

      const { error } = await supabase.from("themes").insert([themeData])

      if (error) throw error

      toast({
        title: "Success",
        description: "Theme added successfully",
      })

      setNewTheme({
        name: "",
        description: "",
        image_url: "",
      })

      fetchThemes()
    } catch (error: any) {
      console.error("Error adding theme:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add theme",
        variant: "destructive",
      })
    }
  }

  const handleEditTheme = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTheme) return

    try {
      const { error } = await supabase
        .from("themes")
        .update({
          name: editingTheme.name,
          description: editingTheme.description,
          image_url: editingTheme.image_url,
        })
        .eq("id", editingTheme.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Theme updated successfully",
      })

      setEditingTheme(null)
      fetchThemes()
    } catch (error: any) {
      console.error("Error updating theme:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update theme",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTheme = async (themeId: string) => {
    if (!confirm("Are you sure you want to delete this theme?")) return

    try {
      const { error } = await supabase.from("themes").update({ is_active: false }).eq("id", themeId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Theme deleted successfully",
      })

      fetchThemes()
    } catch (error: any) {
      console.error("Error deleting theme:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete theme",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", productId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Product deleted successfully",
      })

      fetchProducts()
      fetchStats()
    } catch (error: any) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your Stitch POP store</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.lowStockCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {stats.lowStockCount > 0 && (
          <Alert className="mb-8 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>{stats.lowStockCount} products</strong> are running low on stock (≤5 items remaining).
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="coupons">Coupons</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Products</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Create a new product for your store. For image URLs, use direct links to images (e.g., from Imgur,
                      Cloudinary, or your own server).
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={newProduct.gender}
                          onValueChange={(value) => setNewProduct({ ...newProduct, gender: value, category_id: "" })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="men">Men</SelectItem>
                            <SelectItem value="women">Women</SelectItem>
                            <SelectItem value="kids">Kids</SelectItem>
                            <SelectItem value="couple">Couple</SelectItem>
                            <SelectItem value="unisex">Unisex</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newProduct.category_id}
                          onValueChange={(value) => setNewProduct({ ...newProduct, category_id: value })}
                          disabled={!newProduct.gender}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .filter((cat) => cat.gender === newProduct.gender && cat.is_active)
                              .map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="theme">Theme (Optional)</Label>
                        <Select
                          value={newProduct.theme_id}
                          onValueChange={(value) =>
                            setNewProduct({ ...newProduct, theme_id: value === "none" ? "" : value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Theme</SelectItem>
                            {themes
                              .filter((theme) => theme.is_active)
                              .map((theme) => (
                                <SelectItem key={theme.id} value={theme.id}>
                                  {theme.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Describe the product, fabric, care instructions, etc."
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="fabric_composition">Fabric Composition</Label>
                      <div className="flex space-x-2">
                        <Select
                          onValueChange={(value) => {
                            const template = fabricTemplates.find((t) => t.id === value)
                            if (template) {
                              setNewProduct({ ...newProduct, fabric_composition: template.composition })
                            }
                          }}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Use template" />
                          </SelectTrigger>
                          <SelectContent>
                            {fabricTemplates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Textarea
                          id="fabric_composition"
                          value={newProduct.fabric_composition}
                          onChange={(e) => setNewProduct({ ...newProduct, fabric_composition: e.target.value })}
                          placeholder="e.g., 100% Cotton - Soft, breathable, and comfortable"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="care_instructions">Care Instructions</Label>
                      <div className="flex space-x-2">
                        <Select
                          onValueChange={(value) => {
                            const template = careTemplates.find((t) => t.id === value)
                            if (template) {
                              setNewProduct({ ...newProduct, care_instructions: template.instructions })
                            }
                          }}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Use template" />
                          </SelectTrigger>
                          <SelectContent>
                            {careTemplates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Textarea
                          id="care_instructions"
                          value={newProduct.care_instructions}
                          onChange={(e) => setNewProduct({ ...newProduct, care_instructions: e.target.value })}
                          placeholder="e.g., Machine wash cold, tumble dry low"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="manufacturer">Manufacturer</Label>
                        <Input
                          id="manufacturer"
                          value={newProduct.manufacturer}
                          onChange={(e) => setNewProduct({ ...newProduct, manufacturer: e.target.value })}
                          placeholder="e.g., Standard, Premium, Custom"
                        />
                      </div>
                      <div>
                        <Label htmlFor="size_chart">Size Chart</Label>
                        <Select
                          onValueChange={(value) => {
                            const template = sizeChartTemplates.find((t) => t.id === value)
                            if (template) {
                              setNewProduct({ ...newProduct, size_chart: JSON.stringify(template.chart_data) })
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select size chart template" />
                          </SelectTrigger>
                          <SelectContent>
                            {sizeChartTemplates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.manufacturer} - {template.category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sizes">Sizes (comma separated)</Label>
                        <Input
                          id="sizes"
                          placeholder="S, M, L, XL"
                          value={newProduct.sizes}
                          onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="colors">Colors (comma separated)</Label>
                        <Input
                          id="colors"
                          placeholder="Black, White, Gray"
                          value={newProduct.colors}
                          onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Image Upload Section */}
                    <div className="space-y-4">
                      <Label>Product Images</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-4">
                            <Label htmlFor="image-upload" className="cursor-pointer">
                              <span className="mt-2 block text-sm font-medium text-gray-900">
                                Upload up to 3 images (max 500KB each)
                              </span>
                              <Input
                                id="image-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e.target.files)}
                                className="hidden"
                              />
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>Alternative:</strong> You can also paste image URLs directly below.
                        </p>
                        <p>
                          <strong>How to get image URLs:</strong>
                        </p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>
                            Upload to{" "}
                            <a
                              href="https://imgur.com"
                              target="_blank"
                              className="text-blue-600 hover:underline"
                              rel="noreferrer"
                            >
                              Imgur
                            </a>{" "}
                            and copy the direct link
                          </li>
                          <li>
                            Use{" "}
                            <a
                              href="https://cloudinary.com"
                              target="_blank"
                              className="text-blue-600 hover:underline"
                              rel="noreferrer"
                            >
                              Cloudinary
                            </a>{" "}
                            for professional image hosting
                          </li>
                          <li>
                            Right-click any web image and select "Copy image address" (ensure you have permission)
                          </li>
                        </ul>
                      </div>

                      <div>
                        <Label htmlFor="images">Image URLs (comma separated)</Label>
                        <Textarea
                          id="images"
                          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg, https://example.com/image3.jpg"
                          value={newProduct.images}
                          onChange={(e) => setNewProduct({ ...newProduct, images: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Toggle Switches */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_on_sale"
                          checked={newProduct.is_on_sale}
                          onCheckedChange={(checked) => setNewProduct({ ...newProduct, is_on_sale: checked })}
                        />
                        <Label htmlFor="is_on_sale">Add to Sale Page</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_featured"
                          checked={newProduct.is_featured}
                          onCheckedChange={(checked) => setNewProduct({ ...newProduct, is_featured: checked })}
                        />
                        <Label htmlFor="is_featured">Featured Product</Label>
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Add Product
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Theme</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Sale</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.categories?.name || "N/A"}</TableCell>
                        <TableCell>{product.themes?.name || "No Theme"}</TableCell>
                        <TableCell className="capitalize">{product.gender}</TableCell>
                        <TableCell>₹{product.price}</TableCell>
                        <TableCell>
                          <span className={product.stock <= 5 ? "text-red-600 font-medium" : ""}>{product.stock}</span>
                        </TableCell>
                        <TableCell>
                          {product.is_on_sale ? (
                            <Badge className="bg-red-500">On Sale</Badge>
                          ) : (
                            <Badge variant="outline">Regular</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {product.stock === 0 ? (
                            <Badge variant="destructive">Out of Stock</Badge>
                          ) : product.stock <= 5 ? (
                            <Badge variant="secondary">Low Stock</Badge>
                          ) : (
                            <Badge variant="default">In Stock</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Categories</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>Create a new product category</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <div>
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        placeholder="e.g., T-Shirts, Dresses, Jeans"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoryGender">Gender</Label>
                      <Select
                        value={newCategory.gender}
                        onValueChange={(value) => setNewCategory({ ...newCategory, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="men">Men</SelectItem>
                          <SelectItem value="women">Women</SelectItem>
                          <SelectItem value="kids">Kids</SelectItem>
                          <SelectItem value="unisex">Unisex</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="categoryDescription">Description</Label>
                      <Textarea
                        id="categoryDescription"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        placeholder="Category description"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Add Category
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="active">Active Categories</TabsTrigger>
                <TabsTrigger value="inactive">Inactive Categories</TabsTrigger>
              </TabsList>

              <TabsContent value="active">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categories
                          .filter((cat) => cat.is_active)
                          .map((category) => (
                            <TableRow key={category.id}>
                              <TableCell className="font-medium">{category.name}</TableCell>
                              <TableCell className="capitalize">{category.gender}</TableCell>
                              <TableCell>{category.description || "No description"}</TableCell>
                              <TableCell>
                                <Badge variant="default">Active</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => setEditingCategory(category)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inactive">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categories
                          .filter((cat) => !cat.is_active)
                          .map((category) => (
                            <TableRow key={category.id}>
                              <TableCell className="font-medium">{category.name}</TableCell>
                              <TableCell className="capitalize">{category.gender}</TableCell>
                              <TableCell>{category.description || "No description"}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">Inactive</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => setEditingCategory(category)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="themes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Themes</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Theme
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Theme</DialogTitle>
                    <DialogDescription>Create a new themed collection</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddTheme} className="space-y-4">
                    <div>
                      <Label htmlFor="themeName">Theme Name</Label>
                      <Input
                        id="themeName"
                        value={newTheme.name}
                        onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
                        placeholder="e.g., Summer Collection, Vintage Style"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="themeDescription">Description</Label>
                      <Textarea
                        id="themeDescription"
                        value={newTheme.description}
                        onChange={(e) => setNewTheme({ ...newTheme, description: e.target.value })}
                        placeholder="Theme description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="themeImage">Theme Image URL</Label>
                      <Input
                        id="themeImage"
                        value={newTheme.image_url}
                        onChange={(e) => setNewTheme({ ...newTheme, image_url: e.target.value })}
                        placeholder="https://example.com/theme-image.jpg"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Add Theme
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="active">Active Themes</TabsTrigger>
                <TabsTrigger value="inactive">Inactive Themes</TabsTrigger>
              </TabsList>

              <TabsContent value="active">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Image</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {themes
                          .filter((theme) => theme.is_active)
                          .map((theme) => (
                            <TableRow key={theme.id}>
                              <TableCell className="font-medium">{theme.name}</TableCell>
                              <TableCell>{theme.description || "No description"}</TableCell>
                              <TableCell>
                                {theme.image_url ? (
                                  <img
                                    src={theme.image_url || "/placeholder.svg"}
                                    alt={theme.name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                    <Package className="h-4 w-4 text-gray-400" />
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="default">Active</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => setEditingTheme(theme)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleDeleteTheme(theme.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inactive">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Image</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {themes
                          .filter((theme) => !theme.is_active)
                          .map((theme) => (
                            <TableRow key={theme.id}>
                              <TableCell className="font-medium">{theme.name}</TableCell>
                              <TableCell>{theme.description || "No description"}</TableCell>
                              <TableCell>
                                {theme.image_url ? (
                                  <img
                                    src={theme.image_url || "/placeholder.svg"}
                                    alt={theme.name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                    <Package className="h-4 w-4 text-gray-400" />
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">Inactive</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => setEditingTheme(theme)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleDeleteTheme(theme.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="coupons" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Coupon Management</h2>
              <Button onClick={() => router.push("/admin/coupons")}>
                <Plus className="h-4 w-4 mr-2" />
                Manage Coupons
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Manage discount coupons for your store</p>
                  <Button onClick={() => router.push("/admin/coupons")}>Go to Coupon Management</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banners">
            <Card>
              <CardHeader>
                <CardTitle>Banner Management</CardTitle>
                <CardDescription>Manage banner images for Home, Men, and Women pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Use the dedicated banner management page for full functionality
                  </p>
                  <Button asChild>
                    <Link href="/admin/banners">Go to Banner Management</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                        <TableCell>{order.user_id.slice(0, 8)}</TableCell>
                        <TableCell>₹{order.total}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "delivered"
                                ? "default"
                                : order.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">Analytics charts will be implemented here</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">Top products list will be implemented here</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Product Dialog */}
        {editingProduct && (
          <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>Update product information</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditProduct} className="space-y-4">
                <div>
                  <Label htmlFor="editName">Product Name</Label>
                  <Input
                    id="editName"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editDescription">Description</Label>
                  <Textarea
                    id="editDescription"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editPrice">Price (₹)</Label>
                    <Input
                      id="editPrice"
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: Number.parseFloat(e.target.value) })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editStock">Stock</Label>
                    <Input
                      id="editStock"
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number.parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="editSale"
                      checked={editingProduct.is_on_sale}
                      onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, is_on_sale: checked })}
                    />
                    <Label htmlFor="editSale">Add to Sale Page</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="editFeatured"
                      checked={editingProduct.is_featured}
                      onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, is_featured: checked })}
                    />
                    <Label htmlFor="editFeatured">Featured Product</Label>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Update Product
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Theme Dialog */}
        {editingTheme && (
          <Dialog open={!!editingTheme} onOpenChange={() => setEditingTheme(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Theme</DialogTitle>
                <DialogDescription>Update theme information</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditTheme} className="space-y-4">
                <div>
                  <Label htmlFor="editThemeName">Theme Name</Label>
                  <Input
                    id="editThemeName"
                    value={editingTheme.name}
                    onChange={(e) => setEditingTheme({ ...editingTheme, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editThemeDescription">Description</Label>
                  <Textarea
                    id="editThemeDescription"
                    value={editingTheme.description || ""}
                    onChange={(e) => setEditingTheme({ ...editingTheme, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editThemeImage">Image URL</Label>
                  <Input
                    id="editThemeImage"
                    value={editingTheme.image_url || ""}
                    onChange={(e) => setEditingTheme({ ...editingTheme, image_url: e.target.value })}
                    placeholder="https://example.com/theme-image.jpg"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Update Theme
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Category Dialog */}
        {editingCategory && (
          <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogDescription>Update category information</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditCategoryForm} className="space-y-4">
                <div>
                  <Label htmlFor="editCategoryName">Category Name</Label>
                  <Input
                    id="editCategoryName"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editCategoryGender">Gender</Label>
                  <Select
                    value={editingCategory.gender}
                    onValueChange={(value) => setEditingCategory({ ...editingCategory, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="kids">Kids</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editCategoryDescription">Description</Label>
                  <Textarea
                    id="editCategoryDescription"
                    value={editingCategory.description || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Update Category
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )

  async function handleEditCategoryForm(e: React.FormEvent) {
    e.preventDefault()
    if (!editingCategory) return

    try {
      const { error } = await supabase
        .from("categories")
        .update({
          name: editingCategory.name,
          description: editingCategory.description,
          gender: editingCategory.gender,
        })
        .eq("id", editingCategory.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Category updated successfully",
      })

      setEditingCategory(null)
      fetchCategories()
    } catch (error: any) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive",
      })
    }
  }
}
