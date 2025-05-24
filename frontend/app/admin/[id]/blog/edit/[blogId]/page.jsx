"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useBlogStore } from "@/store/useBlogStore"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Upload, X, Save, ArrowLeft, ImageIcon, FileText, Edit3, Loader2, AlertCircle } from "lucide-react"

const EditBlogPage = () => {
  const { blogId, id: adminId } = useParams()
  const router = useRouter()

  const { selectedBlog, clearSelectedBlog, fetchBlogById, fetchBlogs, createBlog, updateBlog } = useBlogStore()

  const [formError, setFormError] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    previewUrl: null,
    removeImage: false,
  })

  const fileInputRef = useRef(null)

  useEffect(() => {
    async function loadBlog() {
      setLoading(true)
      try {
        if (blogId) {
          await fetchBlogById(blogId)
        } else {
          clearSelectedBlog()
        }
      } catch (error) {
        setFormError("Failed to load blog data.")
      } finally {
        setLoading(false)
      }
    }
    loadBlog()

    return () => {
      clearSelectedBlog()
      revokePreviewUrl()
    }
  }, [blogId])

  useEffect(() => {
    if (selectedBlog) {
      setFormData({
        title: selectedBlog.title || "",
        content: selectedBlog.content || "",
        image: null,
        previewUrl: selectedBlog.image_url || null,
        removeImage: false,
      })
    } else {
      setFormData({
        title: "",
        content: "",
        image: null,
        previewUrl: null,
        removeImage: false,
      })
    }
  }, [selectedBlog])

  const revokePreviewUrl = () => {
    if (formData.previewUrl && formData.image) {
      URL.revokeObjectURL(formData.previewUrl)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      revokePreviewUrl()
      setFormData((prev) => ({
        ...prev,
        image: file,
        previewUrl: URL.createObjectURL(file),
        removeImage: false,
      }))
    }
  }

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleRemoveImageToggle = () => {
    setFormData((prev) => ({
      ...prev,
      removeImage: !prev.removeImage,
      previewUrl: !prev.removeImage ? null : selectedBlog?.image_url || null,
    }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
    setSubmitting(true)

    if (!formData.title.trim() || !formData.content.trim()) {
      setFormError("Title and content are required.")
      setSubmitting(false)
      return
    }

    try {
      const data = new FormData()
      data.append("title", formData.title)
      data.append("content", formData.content)
      data.append("admin_id", adminId)

      if (formData.image) {
        data.append("image", formData.image)
      } else if (selectedBlog && formData.removeImage) {
        data.append("remove_image", "true")
      }

      if (selectedBlog) {
        await updateBlog(selectedBlog.id, data)
      } else {
        await createBlog(data, adminId)
      }

      await fetchBlogs()
      router.push(`/admin/${adminId}/blog`)
    } catch (error) {
      console.error(error)
      setFormError("Failed to save blog. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    clearSelectedBlog()
    revokePreviewUrl()
    router.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading blog...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Badge variant="secondary" className="text-xs">
              {selectedBlog ? "Edit Mode" : "Create Mode"}
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Edit3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {selectedBlog ? "Edit Blog Post" : "Create New Blog Post"}
              </h1>
              <p className="text-muted-foreground">
                {selectedBlog ? "Update your existing blog post" : "Share your thoughts with the world"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Error Alert */}
        {formError && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Main Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Blog Details</span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-8">
                {/* Title Section */}
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-base font-medium flex items-center space-x-2">
                    <span>Title</span>
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange("title")}
                    placeholder="Enter an engaging title for your blog post..."
                    required
                    disabled={submitting}
                    className="text-lg h-12 border-2 focus:border-primary transition-colors"
                    autoFocus
                  />
                </div>

                <Separator />

                {/* Content Section */}
                <div className="space-y-3">
                  <Label htmlFor="content" className="text-base font-medium flex items-center space-x-2">
                    <span>Content</span>
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    rows={12}
                    value={formData.content}
                    onChange={handleChange("content")}
                    placeholder="Write your blog content here... Share your insights, experiences, and knowledge with your readers."
                    required
                    disabled={submitting}
                    className="resize-none border-2 focus:border-primary transition-colors"
                  />
                  <p className="text-sm text-muted-foreground">{formData.content.length} characters</p>
                </div>

                <Separator />

                {/* Image Section */}
                <div className="space-y-4">
                  <Label className="text-base font-medium flex items-center space-x-2">
                    <ImageIcon className="h-4 w-4" />
                    <span>Featured Image</span>
                  </Label>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upload Area */}
                    <div className="space-y-4">
                      <div
                        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">Click to upload image</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={submitting}
                        className="hidden"
                      />
                    </div>

                    {/* Preview Area */}
                    {formData.previewUrl && (
                      <div className="space-y-4">
                        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-border">
                          <Image
                            src={formData.previewUrl || "/placeholder.svg"}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="text-xs">
                              Preview
                            </Badge>
                          </div>
                        </div>

                        {/* Remove image option for existing blogs */}
                        {selectedBlog && !formData.image && (
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="removeImage"
                              checked={formData.removeImage}
                              onChange={handleRemoveImageToggle}
                              disabled={submitting}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor="removeImage" className="text-sm cursor-pointer">
                              Remove current image
                            </Label>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={submitting}
                    className="sm:w-auto"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {selectedBlog ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {selectedBlog ? "Update Blog" : "Create Blog"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default EditBlogPage
