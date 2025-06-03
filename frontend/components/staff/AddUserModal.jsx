"use client"

import { useState, useRef } from "react"
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
  Eye,
  EyeOff,
  AlertTriangle,
  Camera,
  UserPlus,
  Mail,
  Lock,
} from "lucide-react"

const AddUserModal = ({
  isOpen,
  onClose,
  onAddUser,
  emailChecking,
  emailAvailable,
  checkEmailAvailability,
  newEmail,
  setNewEmail,
  newFirstName,
  setNewFirstName,
  newLastName,
  setNewLastName,
  newPhone,
  setNewPhone,
  phoneChecking,
  phoneAvailable,
  checkPhoneAvailability,
  newPassword,
  newConfirmPassword,
  handlePasswordChange,
  handleImageChange,
  selectedImage,
  imagePreview,
  errors,
  errorMessage,
  loading,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const validateForm = () => {
    const newErrors = {}

    if (!newFirstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!newLastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!newEmail.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(newEmail)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!newPassword) {
      newErrors.password = "Password is required"
    } else if (newPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (newPassword !== newConfirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (newPhone && !/^\d{6,}$/.test(newPhone)) {
      newErrors.phone = "Phone number must be at least 6 digits"
    }

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm() && emailAvailable !== false && phoneAvailable !== false) {
      onAddUser()
    }
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const handleImageUpload = (file) => {
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, image: "Image size must be less than 5MB" }))
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setFormErrors((prev) => ({ ...prev, image: "Please select a valid image file" }))
        return
      }

      setFormErrors((prev) => ({ ...prev, image: "" }))

      // Create a synthetic event for the existing handler
      const syntheticEvent = {
        target: {
          files: [file],
        },
      }
      handleImageChange(syntheticEvent)
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

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" }

    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    const levels = [
      { strength: 0, label: "Very Weak", color: "bg-red-500" },
      { strength: 1, label: "Weak", color: "bg-red-400" },
      { strength: 2, label: "Fair", color: "bg-yellow-500" },
      { strength: 3, label: "Good", color: "bg-blue-500" },
      { strength: 4, label: "Strong", color: "bg-green-500" },
      { strength: 5, label: "Very Strong", color: "bg-green-600" },
    ]

    return levels[strength] || levels[0]
  }

  const passwordStrength = getPasswordStrength(newPassword)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserPlus className="h-5 w-5 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-gray-900">Add New Staff Member</DialogTitle>
          </div>
          <p className="text-sm text-gray-600">
            Create a new staff account with secure credentials and profile information.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {errorMessage && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
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
                    {newFirstName && newLastName ? (
                      getInitials(newFirstName, newLastName)
                    ) : (
                      <User className="h-8 w-8" />
                    )}
                  </AvatarFallback>
                </Avatar>
                {imagePreview && (
                  <Badge
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 bg-green-100 text-green-800 border-green-200"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Uploaded
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
                    <span>Choose Photo</span>
                  </Button>

                  {imagePreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        handleImageChange({ target: { files: [] } })
                        setFormErrors((prev) => ({ ...prev, image: "" }))
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove
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

                {formErrors.image && (
                  <p className="text-sm text-red-600 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    {formErrors.image}
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
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  className={`transition-all duration-200 ${
                    formErrors.firstName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  placeholder="Enter first name"
                  aria-describedby={formErrors.firstName ? "firstName-error" : undefined}
                />
                {formErrors.firstName && (
                  <p id="firstName-error" className="text-sm text-red-600 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    {formErrors.firstName}
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
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  className={`transition-all duration-200 ${
                    formErrors.lastName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  placeholder="Enter last name"
                  aria-describedby={formErrors.lastName ? "lastName-error" : undefined}
                />
                {formErrors.lastName && (
                  <p id="lastName-error" className="text-sm text-red-600 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    {formErrors.lastName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Mail className="h-5 w-5 text-gray-600" />
              <Label className="text-base font-medium text-gray-900">Contact Information</Label>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => {
                      const value = e.target.value
                      setNewEmail(value)
                      if (value.length >= 4) checkEmailAvailability(value)
                    }}
                    className={`pr-10 transition-all duration-200 ${
                      formErrors.email || emailAvailable === false
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : emailAvailable === true
                          ? "border-green-500 focus:border-green-500 focus:ring-green-200"
                          : "focus:border-blue-500 focus:ring-blue-200"
                    }`}
                    placeholder="Enter email address"
                    aria-describedby="email-status"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {emailChecking && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                    {emailAvailable === true && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {emailAvailable === false && <XCircle className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
                <div id="email-status" className="space-y-1">
                  {formErrors.email && (
                    <p className="text-sm text-red-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {formErrors.email}
                    </p>
                  )}
                  {emailAvailable === false && errors.email && (
                    <p className="text-sm text-red-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {errors.email[0]}
                    </p>
                  )}
                  {emailAvailable === true && (
                    <p className="text-sm text-green-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Email is available
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    value={newPhone}
                    onChange={(e) => {
                      const value = e.target.value
                      setNewPhone(value)
                      if (value.length >= 6) checkPhoneAvailability(value)
                    }}
                    className={`pr-10 transition-all duration-200 ${
                      formErrors.phone || phoneAvailable === false
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : phoneAvailable === true
                          ? "border-green-500 focus:border-green-500 focus:ring-green-200"
                          : "focus:border-blue-500 focus:ring-blue-200"
                    }`}
                    placeholder="Enter phone number (optional)"
                    aria-describedby="phone-status"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {phoneChecking && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                    {phoneAvailable === true && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {phoneAvailable === false && <XCircle className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
                <div id="phone-status" className="space-y-1">
                  {formErrors.phone && (
                    <p className="text-sm text-red-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {formErrors.phone}
                    </p>
                  )}
                  {phoneAvailable === false && errors.phone && (
                    <p className="text-sm text-red-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {errors.phone[0]}
                    </p>
                  )}
                  {phoneAvailable === true && (
                    <p className="text-sm text-green-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Phone number is available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Lock className="h-5 w-5 text-gray-600" />
              <Label className="text-base font-medium text-gray-900">Security Information</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => handlePasswordChange("password", e.target.value)}
                    className={`pr-10 transition-all duration-200 ${
                      formErrors.password || errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : "focus:border-blue-500 focus:ring-blue-200"
                    }`}
                    placeholder="Enter password"
                    aria-describedby="password-strength"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {newPassword && (
                  <div id="password-strength" className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">{passwordStrength.label}</span>
                    </div>
                  </div>
                )}

                {formErrors.password && (
                  <p className="text-sm text-red-600 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    {formErrors.password}
                  </p>
                )}
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    {errors.password[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={newConfirmPassword}
                    onChange={(e) => handlePasswordChange("password_confirmation", e.target.value)}
                    className={`pr-10 transition-all duration-200 ${
                      formErrors.confirmPassword || errors.password_confirmation
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : newPassword && newConfirmPassword && newPassword === newConfirmPassword
                          ? "border-green-500 focus:border-green-500 focus:ring-green-200"
                          : "focus:border-blue-500 focus:ring-blue-200"
                    }`}
                    placeholder="Confirm password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {newPassword && newConfirmPassword && newPassword === newConfirmPassword && (
                  <p className="text-sm text-green-600 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Passwords match
                  </p>
                )}

                {formErrors.confirmPassword && (
                  <p className="text-sm text-red-600 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    {formErrors.confirmPassword}
                  </p>
                )}
                {errors.password_confirmation && (
                  <p className="text-sm text-red-600 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    {errors.password_confirmation[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || emailAvailable === false || phoneAvailable === false}
              className="w-full sm:w-auto min-w-[140px] bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddUserModal
