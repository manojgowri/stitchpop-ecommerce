"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Edit, Save, X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface Collection {
  id: string
  name: string
  category: string
  description: string
  image_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function CollectionsManagement() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    image_url: "",
    is_active: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase.from("collections").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setCollections(data || [])
    } catch (error) {
      console.error("Error fetching collections:", error)
      toast({
        title: "Error",
        description: "Failed to load collections",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingId) {
        // Update existing collection
        const { error } = await supabase
          .from("collections")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId)

        if (error) throw error

        toast({
          title: "Success",
          description: "Collection updated successfully",
        })
      } else {
        // Create new collection
        const { error } = await supabase.from("collections").insert([
          {
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])

        if (error) throw error

        toast({
          title: "Success",
          description: "Collection created successfully",
        })
      }

      setFormData({
        name: "",
        category: "",
        description: "",
        image_url: "",
        is_active: true,
      })
      setEditingId(null)
      fetchCollections()
    } catch (error) {
      console.error("Error saving collection:", error)
      toast({
        title: "Error",
        description: "Failed to save collection",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (collection: Collection) => {
    setFormData({
      name: collection.name,
      category: collection.category,
      description: collection.description,
      image_url: collection.image_url,
      is_active: collection.is_active,
    })
    setEditingId(collection.id)
  }

  const handleCancel = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      image_url: "",
      is_active: true,
    })
    setEditingId(null)
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("collections")
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq("id", id)

      if (error) throw error

      setCollections((prev) =>
        prev.map((collection) => (collection.id === id ? { ...collection, is_active: isActive } : collection)),
      )

      toast({
        title: "Success",
        description: `Collection ${isActive ? "activated" : "deactivated"}`,
      })
    } catch (error) {
      console.error("Error updating collection status:", error)
      toast({
        title: "Error",
        description: "Failed to update collection status",
        variant: "destructive",
      })
    }
  }

  if (loading && collections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Collection Cover Photos</h1>
          <p className="text-gray-300">Manage cover images for Men's and Women's collections</p>
        </div>

        {/* Form */}
        <Card className="mb-8 bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">{editingId ? "Edit Collection" : "Add New Collection"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300">
                    Collection Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Men's Collection"
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-gray-300">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., men, women"
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Collection description"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="image_url" className="text-gray-300">
                  Cover Image URL
                </Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <Image
                      src={formData.image_url || "/placeholder.svg"}
                      alt="Preview"
                      width={200}
                      height={120}
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active" className="text-gray-300">
                  Active
                </Label>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-gray-200"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? "Update" : "Create"} Collection
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Collections List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Card key={collection.id} className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="relative aspect-[3/2] mb-4">
                  {collection.image_url ? (
                    <Image
                      src={collection.image_url || "/placeholder.svg"}
                      alt={collection.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 rounded-md flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={collection.is_active ? "default" : "secondary"}>
                      {collection.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-white">{collection.name}</h3>
                  <p className="text-sm text-gray-400">{collection.category}</p>
                  {collection.description && (
                    <p className="text-sm text-gray-300 line-clamp-2">{collection.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={collection.is_active}
                      onCheckedChange={(checked) => toggleActive(collection.id, checked)}
                    />
                    <span className="text-sm text-gray-400">Active</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(collection)}
                    className="border-gray-600 text-white hover:bg-gray-800"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {collections.length === 0 && !loading && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No collections found</h3>
            <p className="text-gray-500">Create your first collection to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
