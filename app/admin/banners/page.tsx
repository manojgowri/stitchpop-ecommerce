"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Plus, Save, X, Upload, LinkIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"

interface Banner {
  id: string
  title: string
  subtitle?: string
  page_type: "home" | "men" | "women"
  desktop_image_url: string
  mobile_image_url?: string
  redirect_url?: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [imageUploadType, setImageUploadType] = useState<"url" | "upload">("url")

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    page_type: "home" as "home" | "men" | "women",
    desktop_image_url: "",
    mobile_image_url: "",
    redirect_url: "",
    is_active: true,
    display_order: 0,
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("page_type", { ascending: true })
        .order("display_order", { ascending: true })

      if (error) throw error
      setBanners(data || [])
    } catch (error) {
      console.error("Error fetching banners:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingBanner) {
        const { error } = await supabase
          .from("banners")
          .update({
            title: formData.title,
            subtitle: formData.subtitle || null,
            page_type: formData.page_type,
            desktop_image_url: formData.desktop_image_url,
            mobile_image_url: formData.mobile_image_url || null,
            redirect_url: formData.redirect_url || null,
            is_active: formData.is_active,
            display_order: formData.display_order,
          })
          .eq("id", editingBanner.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("banners").insert([
          {
            title: formData.title,
            subtitle: formData.subtitle || null,
            page_type: formData.page_type,
            desktop_image_url: formData.desktop_image_url,
            mobile_image_url: formData.mobile_image_url || null,
            redirect_url: formData.redirect_url || null,
            is_active: formData.is_active,
            display_order: formData.display_order,
          },
        ])

        if (error) throw error
      }

      await fetchBanners()
      resetForm()
    } catch (error) {
      console.error("Error saving banner:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return

    try {
      const { error } = await supabase.from("banners").delete().eq("id", id)

      if (error) throw error
      await fetchBanners()
    } catch (error) {
      console.error("Error deleting banner:", error)
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      page_type: banner.page_type,
      desktop_image_url: banner.desktop_image_url,
      mobile_image_url: banner.mobile_image_url || "",
      redirect_url: banner.redirect_url || "",
      is_active: banner.is_active,
      display_order: banner.display_order,
    })
    setIsCreating(true)
  }

  const resetForm = () => {
    setEditingBanner(null)
    setIsCreating(false)
    setFormData({
      title: "",
      subtitle: "",
      page_type: "home",
      desktop_image_url: "",
      mobile_image_url: "",
      redirect_url: "",
      is_active: true,
      display_order: 0,
    })
  }

  const groupedBanners = {
    home: banners.filter((b) => b.page_type === "home"),
    men: banners.filter((b) => b.page_type === "men"),
    women: banners.filter((b) => b.page_type === "women"),
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading banners...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Banner Management</h1>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Banner
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingBanner ? "Edit Banner" : "Create New Banner"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="page_type">Page Type *</Label>
                  <Select
                    value={formData.page_type}
                    onValueChange={(value: "home" | "men" | "women") => setFormData({ ...formData, page_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home Page</SelectItem>
                      <SelectItem value="men">Men's Page</SelectItem>
                      <SelectItem value="women">Women's Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label>Image Input Method:</Label>
                  <Tabs value={imageUploadType} onValueChange={(value: "url" | "upload") => setImageUploadType(value)}>
                    <TabsList>
                      <TabsTrigger value="url" className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        URL
                      </TabsTrigger>
                      <TabsTrigger value="upload" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {imageUploadType === "url" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="desktop_image_url">Desktop Image URL *</Label>
                      <Input
                        id="desktop_image_url"
                        type="url"
                        value={formData.desktop_image_url}
                        onChange={(e) => setFormData({ ...formData, desktop_image_url: e.target.value })}
                        placeholder="https://example.com/desktop-banner.jpg"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="mobile_image_url">Mobile Image URL</Label>
                      <Input
                        id="mobile_image_url"
                        type="url"
                        value={formData.mobile_image_url}
                        onChange={(e) => setFormData({ ...formData, mobile_image_url: e.target.value })}
                        placeholder="https://example.com/mobile-banner.jpg"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="desktop_upload">Desktop Image Upload *</Label>
                      <Input
                        id="desktop_upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            // In a real implementation, you would upload to Vercel Blob or similar
                            console.log("Desktop file selected:", file.name)
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mobile_upload">Mobile Image Upload</Label>
                      <Input
                        id="mobile_upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            console.log("Mobile file selected:", file.name)
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="redirect_url">Redirect URL</Label>
                  <Input
                    id="redirect_url"
                    type="url"
                    value={formData.redirect_url}
                    onChange={(e) => setFormData({ ...formData, redirect_url: e.target.value })}
                    placeholder="/categories"
                  />
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingBanner ? "Update" : "Create"} Banner
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="home" className="space-y-4">
        <TabsList>
          <TabsTrigger value="home">Home Page ({groupedBanners.home.length})</TabsTrigger>
          <TabsTrigger value="men">Men's Page ({groupedBanners.men.length})</TabsTrigger>
          <TabsTrigger value="women">Women's Page ({groupedBanners.women.length})</TabsTrigger>
        </TabsList>

        {(["home", "men", "women"] as const).map((pageType) => (
          <TabsContent key={pageType} value={pageType}>
            <div className="grid gap-4">
              {groupedBanners[pageType].length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center h-32">
                    <p className="text-gray-500">No banners found for {pageType} page</p>
                  </CardContent>
                </Card>
              ) : (
                groupedBanners[pageType].map((banner) => (
                  <Card key={banner.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{banner.title}</h3>
                            <Badge variant={banner.is_active ? "default" : "secondary"}>
                              {banner.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">Order: {banner.display_order}</Badge>
                          </div>
                          {banner.subtitle && <p className="text-gray-600">{banner.subtitle}</p>}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Desktop: {banner.desktop_image_url}</span>
                            {banner.mobile_image_url && <span>Mobile: {banner.mobile_image_url}</span>}
                          </div>
                          {banner.redirect_url && (
                            <p className="text-sm text-blue-600">Redirects to: {banner.redirect_url}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(banner)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(banner.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-gray-500">Desktop Preview</Label>
                          <div className="relative aspect-[3/1] bg-gray-100 rounded-md overflow-hidden">
                            <Image
                              src={banner.desktop_image_url || "/placeholder.svg"}
                              alt={`${banner.title} - Desktop`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        {banner.mobile_image_url && (
                          <div>
                            <Label className="text-xs text-gray-500">Mobile Preview</Label>
                            <div className="relative aspect-[3/1] bg-gray-100 rounded-md overflow-hidden">
                              <Image
                                src={banner.mobile_image_url || "/placeholder.svg"}
                                alt={`${banner.title} - Mobile`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
