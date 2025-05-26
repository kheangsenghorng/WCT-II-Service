"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useBlogStore } from "@/store/useBlogStore"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Upload,
  X,
  Save,
  ImageIcon,
  Edit3,
  Loader2,
  AlertCircle,
} from "lucide-react"

export default function BlogForm({ showForm, setShowForm }) {
  const { id: adminId } = useParams()
  const {
    selectedBlog,
    clearSelectedBlog,
    fetchBlogs,
    createBlog,
    updateBlog,
  } = useBlogStore()

  const [formError, setFormError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    previewUrl: null,
    removeImage: false,
  })

  const fileInputRef = useRef(null)

  // Set form data when selectedBlog changes
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

  const handleClose = () => {
    clearSelectedBlog()
    revokePreviewUrl()
    setShowForm(false)
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

      await fetchBlogs(adminId)
      handleClose()
    } catch (error) {
      console.error(error)
      setFormError("Failed to save blog. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (!showForm) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Edit3 className="h-6 w-6 text-primary" />
            <span>{selectedBlog ? "Edit Blog" : "Add New Blog"}</span>
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {formError && (
          <Alert variant="destructive" className="mb-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="font-medium mb-1">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={handleChange("title")}
              placeholder="Enter blog title"
              disabled={submitting}
              required
            />
          </div>

          <div>
            <Label htmlFor="content" className="font-medium mb-1">
              Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              rows={8}
              value={formData.content}
              onChange={handleChange("content")}
              placeholder="Write blog content here..."
              disabled={submitting}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">{formData.content.length} characters</p>
          </div>

          <div>
            <Label className="font-medium mb-1 flex items-center space-x-2">
              <ImageIcon className="h-5 w-5" />
              <span>Featured Image</span>
            </Label>

            <div className="flex items-center space-x-4">
              <div
                className="cursor-pointer border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-1">Click to upload</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={submitting}
                  className="hidden"
                />
              </div>

              {formData.previewUrl && (
                <div className="relative w-48 h-28 rounded-lg overflow-hidden border border-border">
                  <Image
                    src={formData.previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  {selectedBlog && !formData.image && (
                    <div className="absolute bottom-1 right-1 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                      Preview
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedBlog && !formData.image && formData.previewUrl && (
              <div className="mt-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="removeImage"
                  checked={formData.removeImage}
                  onChange={handleRemoveImageToggle}
                  disabled={submitting}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="removeImage" className="cursor-pointer text-sm">
                  Remove current image
                </Label>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={submitting}
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>

            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
