"use client"

import { useUserStore } from "@/store/useUserStore"
import { useParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  User,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Camera,
  Edit,
  Mail,
  Phone,
  Save,
} from "lucide-react"

const EditUserModal = ({ user, isOpen, onClose }) => {
  const { id: ownerId } = useParams()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isDragOver, setIsDragOver] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const fileInputRef = useRef(null)

  const { updateUserOwner, fetchUsersByOwner } = useUserStore()

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "")
      setLastName(user.last_name || "")
      setPhone(user.phone || "")
      setSelectedImage(null)
      setImagePreview(user.image || null)
      setErrors({})
      setHasChanges(false)
    }
  }, [user])

  // Track changes
  useEffect(() => {
    if (user) {
      const hasFieldChanges =
        firstName !== (user.first_name || "") ||
        lastName !== (user.last_name || "") ||
        phone !== (user.phone || "") ||
        selectedImage !== null

      setHasChanges(hasFieldChanges)
    }
  }, [firstName, lastName, phone, selectedImage, user])

  const handleImageUpload = (file) => {
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Image size must be less than 5MB" }))
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Please select a valid image file" }))
        return
      }

      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
      setErrors((prev) => ({ ...prev, image: "" }))
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const validateForm = () => {
    const newErrors = {}

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (phone && !/^\+?[\d\s\-()]+$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveUser = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("first_name", firstName.trim())
      formData.append("last_name", lastName.trim())
      formData.append("phone", phone.trim() || "")

      if (selectedImage) {
        formData.append("image", selectedImage)
      }

      if (!user?.id) {
        console.error("User ID missing for update.")
        return
      }

      await updateUserOwner(ownerId, user.id, formData)
      await fetchUsersByOwner(ownerId)

      onClose()
    } catch (error) {
      console.error("Update failed:", error)
      setErrors({ general: "Failed to update user. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Edit className="h-5 w-5 text-blue-600" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-gray-900">Edit Staff Member</DialogTitle>
          </div>
          <p className="text-sm text-gray-600">
            Update profile information for{" "}
            <span className="font-medium">
              {user?.first_name} {user?.last_name}
            </span>
          </p>
          {hasChanges && (
            <Badge variant="secondary" className="w-fit bg-yellow-100 text-yellow-800 border-yellow-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Unsaved changes
            </Badge>
          )}
        </DialogHeader>

        <form onSubmit={handleSaveUser} className="space-y-8">
          {errors.general && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-800">{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Profile Image Section */}
          <div className="space-y-4">
            <Label className="text-base font-medium text-gray-900">Profile Picture</Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-gray-200 shadow-lg">
                  <AvatarImage src={imagePreview || undefined} alt="Profile preview" />
                  <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {firstName && lastName ? getInitials(firstName, lastName) : <User className="h-8 w-8" />}
                  </AvatarFallback>
                </Avatar>
                {selectedImage && (
                  <Badge
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 bg-green-100 text-green-800 border-green-200"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Updated
                  </Badge>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={triggerFileSelect}
                    className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Change Photo</span>
                  </Button>

                  {(imagePreview || selectedImage) && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setSelectedImage(null)
                        setImagePreview(user?.image || null)
                        setErrors((prev) => ({ ...prev, image: "" }))
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Reset
                    </Button>
                  )}
                </div>

                <Card
                  className={`border-2 border-dashed transition-all duration-200 cursor-pointer ${
                    isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={triggerFileSelect}
                >
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </CardContent>
                </Card>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-label="Upload profile picture"
                />

                {errors.image && (
                  <p className="text-sm text-red-600 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    {errors.image}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-gray-600" />
              <Label className="text-base font-medium text-gray-900">Personal Information</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`transition-all duration-200 ${
                    errors.firstName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  placeholder="Enter first name"
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                />
                {errors.firstName && (
                  <p id="firstName-error" className="text-sm text-red-600 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`transition-all duration-200 ${
                    errors.lastName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  placeholder="Enter last name"
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                />
                {errors.lastName && (
                  <p id="lastName-error" className="text-sm text-red-600 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Phone className="h-5 w-5 text-gray-600" />
              <Label className="text-base font-medium text-gray-900">Contact Information</Label>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500">Email cannot be changed for security reasons</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`transition-all duration-200 ${
                    errors.phone
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  placeholder="Enter phone number (optional)"
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-sm text-red-600 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !hasChanges}
              className="w-full sm:w-auto min-w-[120px] bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditUserModal
