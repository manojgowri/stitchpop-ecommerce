"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, Edit, Trash2, AlertTriangle, Package, ShoppingCart, TrendingUp, Upload, X } from 'lucide-react'
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

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

  // Form states
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

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAdminAccess()
  }, [])

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

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

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

    const fileArray = Array.from(files)
    if (fileArray.length > 3) {
      toast({
        title: "Too many files",
        description: "Please select maximum 3 images",
        variant: "destructive",
      })
      return
    }

    try {
      const uploadPromises = fileArray.map(uploadImage)
      const imageUrls = await Promise.all(uploadPromises)
      
      setNewProduct(prev => ({
        ...prev,
        images: imageUrls.join(", ")
      }))

      toast({
        title: "Success",
        description: "Images uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading images:", error)
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
        images: newProduct.images.split(",").map((i) => i.trim()),
        is_active: true,
        is_featured: newProduct.is_featured,
        is_on_sale: newProduct.is_on_sale,
      }

      const { error } = await supabase.from("products").insert([productData])

      if (error) throw error

      toast({
        title: "Success",
        description: "Product added successfully",
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

  const handleAddTheme = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { error } = await supabase.from("themes").insert([newTheme])

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

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { error } = await supabase.from("categories").insert([{
        ...newCategory,
        is_active: true
      }])

      if (error) throw error

      toast({
        title: "Success",
        description: "Category added successfully",
      })

      setNewCategory({
        name: "",
        description: "",
        gender: "",
        image_url: "",
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

  const handleDeleteTheme = async (themeId: string) => {
    try {
      const { error } = await supabase.from("themes").delete().eq("id", themeId)

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

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", categoryId)

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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
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
                      Create a new product for your store. For image URLs, use direct links to images (e.g., from Imgur, Cloudinary, or your own server).
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
                          onValueChange={(value) => setNewProduct({ ...newProduct, theme_id: value === "none" ? "" : value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Theme</SelectItem>
                            {themes.filter(theme => theme.is_active).map((theme) => (
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

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="originalPrice">Original Price (₹)</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          value={newProduct.original_price}
                          onChange={(e) => setNewProduct({ ...newProduct, original_price: e.target.value })}
                          placeholder="Leave empty if no discount"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                          required
                        />
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
                        <p><strong>Alternative:</strong> You can also paste image URLs directly below.</p>
                        <p><strong>How to get image URLs:</strong></p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Upload to <a href="https://imgur.com" target="_blank" className="text-blue-600 hover:underline">Imgur</a> and copy the direct link</li>
                          <li>Use <a href="https://cloudinary.com" target="_blank" className="text-blue-600 hover:underline">Cloudinary</a> for professional image hosting</li>
                          <li>Right-click any web image and select "Copy image address" (ensure you have permission)</li>
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
                        <TableCell>{product.categories?.name || 'N/A'}</TableCell>
                        <TableCell>{product.themes?.name || 'No Theme'}</TableCell>
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
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingProduct(product)}
                            >
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

          {/* Themes Tab */}
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
                    <DialogDescription>Create a new theme for your products</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddTheme} className="space-y-4">
                    <div>
                      <Label htmlFor="themeName">Theme Name</Label>
                      <Input
                        id="themeName"
                        value={newTheme.name}
                        onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="themeDescription">Description</Label>
                      <Textarea
                        id="themeDescription"
                        value={newTheme.description}
                        onChange={(e) => setNewTheme({ ...newTheme, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="themeImage">Image URL</Label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme) => (
                <Card key={theme.id}>
                  <CardContent className="p-4">
                    <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      {theme.image_url ? (
                        <img 
                          src={theme.image_url || "/placeholder.svg"} 
                          alt={theme.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">{theme.name}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{theme.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{theme.description}</p>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setEditingTheme(theme)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteTheme(theme.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories Tab */}
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
                    <DialogDescription>Create a new category for your products</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <div>
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
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
                          <SelectItem value="couple">Couple</SelectItem>
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoryImage">Image URL</Label>
                      <Input
                        id="categoryImage"
                        value={newCategory.image_url}
                        onChange={(e) => setNewCategory({ ...newCategory, image_url: e.target.value })}
                        placeholder="https://example.com/category-image.jpg"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Add Category
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
                      <TableHead>Gender</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="capitalize">{category.gender}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>
                          <Badge variant={category.is_active ? "default" : "secondary"}>
                            {category.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingCategory(category)}
                            >
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
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number.parseFloat(e.target.value) })}
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
      </div>
    </div>
  )
}
