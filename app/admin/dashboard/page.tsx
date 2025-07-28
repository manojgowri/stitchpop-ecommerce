"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, AlertTriangle, Package, ShoppingCart, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
  gender: string
  created_at: string
}

interface Collection {
  id: string
  name: string
  description: string
  image_url: string
  created_at: string
}

interface Order {
  id: string
  user_email: string
  total_amount: number
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
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
    originalPrice: "",
    category: "",
    gender: "",
    sizes: "",
    colors: "",
    stock: "",
    images: "",
  })

  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    image_url: "",
  })

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAdminAccess = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push("/auth/login")
        return
      }

      // Check if user is admin (you can implement this check based on your user metadata)
      if (!session.user.user_metadata?.is_admin) {
        router.push("/")
        return
      }

      setUser(session.user)
      await Promise.all([fetchProducts(), fetchCollections(), fetchOrders(), fetchStats()])
      setLoading(false)
    }

    checkAdminAccess()
  }, [router])

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://stitchpop-ecommerce.onrender.com/api/admin/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        const lowStock = data.filter((product: Product) => product.stock <= 5)
        setLowStockProducts(lowStock)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const fetchCollections = async () => {
    try {
      const response = await fetch("https://stitchpop-ecommerce.onrender.com/api/admin/collections")
      if (response.ok) {
        const data = await response.json()
        setCollections(data)
      }
    } catch (error) {
      console.error("Error fetching collections:", error)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch("https://stitchpop-ecommerce.onrender.com/api/admin/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("https://stitchpop-ecommerce.onrender.com/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("https://stitchpop-ecommerce.onrender.com/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newProduct,
          price: Number.parseFloat(newProduct.price),
          originalPrice: newProduct.originalPrice ? Number.parseFloat(newProduct.originalPrice) : null,
          stock: Number.parseInt(newProduct.stock),
          sizes: newProduct.sizes.split(",").map((s) => s.trim()),
          colors: newProduct.colors.split(",").map((c) => c.trim()),
          images: newProduct.images.split(",").map((i) => i.trim()),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product added successfully",
        })
        setNewProduct({
          name: "",
          description: "",
          price: "",
          originalPrice: "",
          category: "",
          gender: "",
          sizes: "",
          colors: "",
          stock: "",
          images: "",
        })
        fetchProducts()
        fetchStats()
      } else {
        throw new Error("Failed to add product")
      }
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      })
    }
  }

  const handleAddCollection = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("https://stitchpop-ecommerce.onrender.com/api/admin/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCollection),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Collection added successfully",
        })
        setNewCollection({
          name: "",
          description: "",
          image_url: "",
        })
        fetchCollections()
      } else {
        throw new Error("Failed to add collection")
      }
    } catch (error) {
      console.error("Error adding collection:", error)
      toast({
        title: "Error",
        description: "Failed to add collection",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`https://stitchpop-ecommerce.onrender.com/api/admin/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
        fetchProducts()
        fetchStats()
      } else {
        throw new Error("Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCollection = async (collectionId: string) => {
    try {
      const response = await fetch(`https://stitchpop-ecommerce.onrender.com/api/admin/collections/${collectionId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Collection deleted successfully",
        })
        fetchCollections()
      } else {
        throw new Error("Failed to delete collection")
      }
    } catch (error) {
      console.error("Error deleting collection:", error)
      toast({
        title: "Error",
        description: "Failed to delete collection",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
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
        {lowStockProducts.length > 0 && (
          <Alert className="mb-8 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>{lowStockProducts.length} products</strong> are running low on stock (≤5 items remaining).
              Consider restocking:{" "}
              {lowStockProducts
                .slice(0, 3)
                .map((p) => p.name)
                .join(", ")}
              {lowStockProducts.length > 3 && ` and ${lowStockProducts.length - 3} more`}.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
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
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>Create a new product for your store</DialogDescription>
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
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newProduct.category}
                          onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="t-shirts">T-Shirts</SelectItem>
                            <SelectItem value="shirts">Shirts</SelectItem>
                            <SelectItem value="jeans">Jeans</SelectItem>
                            <SelectItem value="dresses">Dresses</SelectItem>
                            <SelectItem value="tops">Tops</SelectItem>
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
                          value={newProduct.originalPrice}
                          onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
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
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={newProduct.gender}
                          onValueChange={(value) => setNewProduct({ ...newProduct, gender: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="men">Men</SelectItem>
                            <SelectItem value="women">Women</SelectItem>
                            <SelectItem value="unisex">Unisex</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
                    <div>
                      <Label htmlFor="images">Image URLs (comma separated)</Label>
                      <Input
                        id="images"
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        value={newProduct.images}
                        onChange={(e) => setNewProduct({ ...newProduct, images: e.target.value })}
                        required
                      />
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
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="capitalize">{product.category}</TableCell>
                        <TableCell>₹{product.price}</TableCell>
                        <TableCell>
                          <span className={product.stock <= 5 ? "text-red-600 font-medium" : ""}>{product.stock}</span>
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
                            <Button variant="outline" size="sm">
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

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Collections</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Collection
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Collection</DialogTitle>
                    <DialogDescription>Create a new collection for your store</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddCollection} className="space-y-4">
                    <div>
                      <Label htmlFor="collectionName">Collection Name</Label>
                      <Input
                        id="collectionName"
                        value={newCollection.name}
                        onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="collectionDescription">Description</Label>
                      <Textarea
                        id="collectionDescription"
                        value={newCollection.description}
                        onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="collectionImage">Image URL</Label>
                      <Input
                        id="collectionImage"
                        value={newCollection.image_url}
                        onChange={(e) => setNewCollection({ ...newCollection, image_url: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Add Collection
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <Card key={collection.id}>
                  <CardContent className="p-4">
                    <img
                      src={collection.image_url || "/placeholder.svg"}
                      alt={collection.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold text-lg mb-2">{collection.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{collection.description}</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteCollection(collection.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                        <TableCell>{order.user_email}</TableCell>
                        <TableCell>₹{order.total_amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "completed"
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
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
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
                  <CardDescription>Monthly sales performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">Analytics charts will be implemented here</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Best selling products this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">Top products list will be implemented here</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
