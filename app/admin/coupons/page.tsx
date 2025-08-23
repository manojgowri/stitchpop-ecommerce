"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Coupon {
  id: string
  code: string
  description: string
  discount_type: "percentage" | "fixed"
  discount_value: number
  minimum_order_amount: number
  maximum_discount_amount?: number
  usage_limit?: number
  used_count: number
  valid_from: string
  expiry_date: string
  is_active: boolean
  created_at: string
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: "",
    minimum_order_amount: "",
    maximum_discount_amount: "",
    usage_limit: "",
    valid_from: "",
    expiry_date: "",
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const response = await fetch("/api/coupons?admin=true")
      if (response.ok) {
        const data = await response.json()
        setCoupons(data)
      }
    } catch (error) {
      console.error("Error fetching coupons:", error)
      toast({
        title: "Error",
        description: "Failed to load coupons",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      console.log("[v0] Form data before processing:", formData)

      const processedData = {
        ...formData,
        discount_value: Number.parseFloat(formData.discount_value),
        minimum_order_amount: Number.parseFloat(formData.minimum_order_amount) || 0,
        maximum_discount_amount: formData.maximum_discount_amount
          ? Number.parseFloat(formData.maximum_discount_amount)
          : null,
        usage_limit: formData.usage_limit ? Number.parseInt(formData.usage_limit) : null,
      }

      console.log("[v0] Processed data being sent:", processedData)

      const url = editingCoupon ? `/api/coupons/${editingCoupon.id}` : "/api/coupons"
      const method = editingCoupon ? "PUT" : "POST"

      console.log("[v0] Making request to:", url, "with method:", method)

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processedData),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)

      if (response.ok) {
        const result = await response.json()
        console.log("[v0] Success result:", result)
        toast({
          title: "Success",
          description: `Coupon ${editingCoupon ? "updated" : "created"} successfully`,
        })
        setIsDialogOpen(false)
        resetForm()
        fetchCoupons()
      } else {
        const error = await response.json()
        console.log("[v0] Error response:", error)
        throw new Error(error.error)
      }
    } catch (error: any) {
      console.log("[v0] Catch block error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save coupon",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      minimum_order_amount: coupon.minimum_order_amount.toString(),
      maximum_discount_amount: coupon.maximum_discount_amount?.toString() || "",
      usage_limit: coupon.usage_limit?.toString() || "",
      valid_from: new Date(coupon.valid_from).toISOString().slice(0, 16),
      expiry_date: new Date(coupon.expiry_date).toISOString().slice(0, 16),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return

    try {
      const response = await fetch(`/api/coupons/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Coupon deleted successfully",
        })
        fetchCoupons()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: "",
      minimum_order_amount: "",
      maximum_discount_amount: "",
      usage_limit: "",
      valid_from: "",
      expiry_date: "",
    })
    setEditingCoupon(null)
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Copied",
      description: "Coupon code copied to clipboard",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Coupon Management</h1>
          <p className="text-gray-600">Create and manage discount coupons</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCoupon ? "Edit Coupon" : "Create New Coupon"}</DialogTitle>
              <DialogDescription>
                {editingCoupon ? "Update coupon details" : "Create a new discount coupon"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Coupon Code (UPPERCASE)</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="SAVE20"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discount_type">Discount Type</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value: "percentage" | "fixed") =>
                      setFormData({ ...formData, discount_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the coupon offer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount_value">
                    Discount Value {formData.discount_type === "percentage" ? "(%)" : "(₹)"}
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="minimum_order_amount">Minimum Order Amount (₹)</Label>
                  <Input
                    id="minimum_order_amount"
                    type="number"
                    step="0.01"
                    value={formData.minimum_order_amount}
                    onChange={(e) => setFormData({ ...formData, minimum_order_amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maximum_discount_amount">Maximum Discount Amount (₹)</Label>
                  <Input
                    id="maximum_discount_amount"
                    type="number"
                    step="0.01"
                    value={formData.maximum_discount_amount}
                    onChange={(e) => setFormData({ ...formData, maximum_discount_amount: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="usage_limit">Usage Limit</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valid_from">Valid From</Label>
                  <Input
                    id="valid_from"
                    type="datetime-local"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="expiry_date">Expiry Date</Label>
                  <Input
                    id="expiry_date"
                    type="datetime-local"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingCoupon ? "Update" : "Create"} Coupon</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{coupon.code}</code>
                      <Button size="sm" variant="ghost" onClick={() => copyCode(coupon.code)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{coupon.description}</TableCell>
                  <TableCell>
                    {coupon.discount_type === "percentage" ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                    {coupon.minimum_order_amount > 0 && (
                      <div className="text-xs text-gray-500">Min: ₹{coupon.minimum_order_amount}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {coupon.used_count}
                    {coupon.usage_limit && ` / ${coupon.usage_limit}`}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>{new Date(coupon.valid_from).toLocaleDateString()}</div>
                      <div>to {new Date(coupon.expiry_date).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={coupon.is_active ? "default" : "secondary"}>
                      {coupon.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(coupon)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(coupon.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
