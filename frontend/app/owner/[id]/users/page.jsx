"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  Search,
  Filter,
  Grid3X3,
  List,
  Mail,
  Phone,
  Calendar,
  Shield,
  X,
} from "lucide-react"
import { useUserStore } from "@/store/useUserStore"
import { useParams } from "next/navigation"
import EditUserModal from "@/components/staff/EditUserModal"
import { request } from "@/util/request"
import AddUserModal from "@/components/staff/AddUserModal"
import ConfirmDeleteUserModal from "@/components/staff/ConfirmDeleteUserModal"

const StaffManagement = () => {
  const { id: ownerId } = useParams()
  const { users, fetchUsersByOwner, createUserUnderOwner, loading, error, deleteUser, updateUserOwner } = useUserStore()

  function debounce(fn, delay) {
    let timer
    return (...args) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }
  }

  const [successMessage, setSuccessMessage] = useState(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [userToEdit, setUserToEdit] = useState(null)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // View mode state
  const [viewMode, setViewMode] = useState("table")

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" })
  const [statusFilter, setStatusFilter] = useState("")

  // Add user fields
  const [newFirstName, setNewFirstName] = useState("")
  const [newLastName, setNewLastName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newConfirmPassword, setNewConfirmPassword] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [emailChecking, setEmailChecking] = useState(false)
  const [phoneChecking, setPhoneChecking] = useState(false)
  const [emailAvailable, setEmailAvailable] = useState(null)
  const [phoneAvailable, setPhoneAvailable] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (ownerId) fetchUsersByOwner(ownerId)
  }, [ownerId, fetchUsersByOwner])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    hover: { backgroundColor: "#f9f9f9" },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: { y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" },
  }

  const handleEditUser = (user) => {
    setUserToEdit(user)
    setShowEditUserModal(true)
  }

  const handleDeleteUser = (user) => {
    setUserToDelete(user)
    setShowConfirmDelete(true)
  }

  const isValidPhone = (phone) => {
    return typeof phone === "string" && /^\d{6,}$/.test(phone)
  }

  const checkPhoneAvailability = debounce(async (phone) => {
    if (!isValidPhone(phone)) return

    setPhoneChecking(true)
    setPhoneAvailable(null)

    try {
      const res = await request(`/check-phone?phone=${phone}`, "GET")

      if (res.available) {
        setPhoneAvailable(true)
        setErrors((prev) => ({ ...prev, phone: null }))
      } else {
        setPhoneAvailable(false)
        setErrors((prev) => ({
          ...prev,
          phone: ["The phone number has already been taken."],
        }))
      }
    } catch (error) {
      console.error("Phone check failed:", error)
    } finally {
      setPhoneChecking(false)
    }
  }, 600)

  const checkEmailAvailability = debounce(async (email) => {
    if (!email) return

    setEmailChecking(true)
    setEmailAvailable(null)

    try {
      const res = await request(`/check-email?email=${email}`, "GET")

      if (res.available) {
        setEmailAvailable(true)
        setErrors((prev) => ({ ...prev, email: null }))
      } else {
        setEmailAvailable(false)
        setErrors((prev) => ({
          ...prev,
          email: ["The email has already been taken."],
        }))
      }
    } catch (error) {
      console.error("Email check failed:", error)
    } finally {
      setEmailChecking(false)
    }
  }, 600)

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    try {
      await deleteUser(ownerId, userToDelete.id)
      setSuccessMessage("Staff member deleted successfully")
      setShowConfirmDelete(false)
      setUserToDelete(null)
      await fetchUsersByOwner(ownerId)
      setErrorMessage("")
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete user.")
    }
  }

  const cancelDelete = () => {
    setShowConfirmDelete(false)
    setUserToDelete(null)
    setErrorMessage("")
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handlePasswordChange = (name, value) => {
    if (name === "password") {
      setNewPassword(value)
    } else if (name === "password_confirmation") {
      setNewConfirmPassword(value)
    }

    setErrors((prev) => {
      const newErrors = { ...prev }
      const password = name === "password" ? value : newPassword
      const confirmPassword = name === "password_confirmation" ? value : newConfirmPassword

      if (password !== confirmPassword) {
        newErrors.password_confirmation = ["Passwords do not match."]
      } else {
        delete newErrors.password_confirmation
      }

      if (password.length < 8) {
        newErrors.password = ["Password must be at least 8 characters long."]
      } else {
        delete newErrors.password
      }

      return newErrors
    })
  }

  const handleAddUser = async () => {
    if (emailAvailable === false || phoneAvailable === false) {
      setErrorMessage("Please resolve the validation errors before submitting.")
      return
    }
    if (errors.password || errors.password_confirmation) {
      setErrorMessage("Please fix password errors before submitting.")
      return
    }

    try {
      const formData = new FormData()
      formData.append("email", newEmail)
      formData.append("first_name", newFirstName)
      formData.append("last_name", newLastName)
      formData.append("phone", newPhone)
      formData.append("password", newPassword)
      formData.append("password_confirmation", newConfirmPassword)

      if (selectedImage) {
        formData.append("image", selectedImage)
      }

      await createUserUnderOwner(formData, ownerId)
      await fetchUsersByOwner(ownerId)

      setSuccessMessage("Staff member added successfully")

      // Reset form fields
      setNewFirstName("")
      setNewLastName("")
      setNewEmail("")
      setNewPassword("")
      setNewConfirmPassword("")
      setNewPhone("")
      setSelectedImage(null)
      setImagePreview(null)
      setEmailAvailable(null)
      setPhoneAvailable(null)
      setErrors({})
      setShowAddUserModal(false)
    } catch (error) {
      setErrorMessage(error.message || "Failed to add staff member.")
    }
  }

  // Filter users based on search term, role, date range, and status
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase()

    // Search term filter
    const matchesSearch = searchTerm
      ? fullName.includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      : true

    // Role filter
    const matchesRole = roleFilter ? user.role === roleFilter : true

    // Date filter
    let matchesDate = true
    if (dateFilter.from || dateFilter.to) {
      const userDate = new Date(user.created_at).getTime()
      const fromDate = dateFilter.from ? new Date(dateFilter.from).getTime() : 0
      const toDate = dateFilter.to ? new Date(dateFilter.to).getTime() : Number.POSITIVE_INFINITY
      matchesDate = userDate >= fromDate && userDate <= toDate
    }

    // Status filter
    const matchesStatus = statusFilter ? user.status === statusFilter : true

    return matchesSearch && matchesRole && matchesDate && matchesStatus
  })

  // Get unique roles for filter dropdown
  const availableRoles = [...new Set(users.map((user) => user.role))].filter(Boolean)

  // Get unique statuses for filter dropdown
  const availableStatuses = [...new Set(users.map((user) => user.status))].filter(Boolean)

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setRoleFilter("")
    setDateFilter({ from: "", to: "" })
    setStatusFilter("")
  }

  // Check if any filter is active
  const isFilterActive = searchTerm || roleFilter || dateFilter.from || dateFilter.to || statusFilter

  // Stats for the dashboard
  const stats = {
    total: users.length,
    filtered: filteredUsers.length,
    active: users.filter((u) => u.status === "active").length || 0,
    inactive: users.filter((u) => u.status === "inactive").length || 0,
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-4 sm:px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Staff Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage and organize your staff members efficiently</p>
            </div>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <UserPlus className="h-5 w-5" />
              Add Staff Member
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Staff</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Staff</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Inactive Staff</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.inactive}</p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Filtered Results</p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.filtered}</p>
                </div>
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Filter className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Role Filter */}
              {/* <div className="w-full sm:w-48">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Roles</option>
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* Status Filter */}
              {/* <div className="w-full sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* View Toggle */}
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 ${
                    viewMode === "table"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  } transition-colors`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`p-2 ${
                    viewMode === "cards"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  } transition-colors`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>

              {/* Clear Filters */}
              {isFilterActive && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Date Range Filter */}
            {/* <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Date</label>
                <input
                  type="date"
                  value={dateFilter.from}
                  onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
                <input
                  type="date"
                  value={dateFilter.to}
                  onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div> */}
          </div>
        </div>

        {/* Toast Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 py-2 px-4 rounded-lg shadow-md z-[100] flex items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 py-2 px-4 rounded-lg shadow-md z-[100] flex items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AlertTriangle className="w-5 h-5" />
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Loading staff members...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Table View */}
            {viewMode === "table" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {filteredUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Profile
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Role
                          </th>
                          {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th> */}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredUsers.map((user, index) => (
                          <motion.tr
                            key={user.id}
                            variants={rowVariants}
                            whileHover="hover"
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-full">
                                <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{index + 1}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <img
                                src={user?.image || "/default-avatar.png"}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {user.first_name} {user.last_name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                                <Mail className="h-4 w-4 mr-1 text-gray-400" />
                                <span>{user.email}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                                <Phone className="h-4 w-4 mr-1 text-gray-400" />
                                <span>{user.phone || "N/A"}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                                {user.role}
                              </span>
                            </td>
                            {/* <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.status === "active"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                } capitalize`}
                              >
                                {user.status || "active"}
                              </span>
                            </td> */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                <span>{new Date(user.created_at).toLocaleDateString()}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="group/edit p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-all duration-200 hover:shadow-md"
                                >
                                  <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover/edit:scale-110 transition-transform" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user)}
                                  className="group/delete p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-all duration-200 hover:shadow-md"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400 group-hover/delete:scale-110 transition-transform" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                      <UserPlus className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No staff members found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      {isFilterActive ? "Try adjusting your filters" : "Get started by adding your first staff member"}
                    </p>
                    <button
                      onClick={() => setShowAddUserModal(true)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200"
                    >
                      Add Staff Member
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Card View */}
            {viewMode === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <img
                            src={user?.image || "/placeholder.svg?height=48&width=48"}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {user.first_name} {user.last_name}
                            </h3>
                            <span
                              className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                user.status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              } capitalize`}
                            >
                              {user.status || "active"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{user.phone || "N/A"}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{new Date(user.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                            {user.role}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="group/edit p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-all duration-200 hover:shadow-md"
                            >
                              <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover/edit:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="group/delete p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-all duration-200 hover:shadow-md"
                            >
                              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400 group-hover/delete:scale-110 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full p-12 text-center bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                      <UserPlus className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No staff members found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      {isFilterActive ? "Try adjusting your filters" : "Get started by adding your first staff member"}
                    </p>
                    <button
                      onClick={() => setShowAddUserModal(true)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200"
                    >
                      Add Staff Member
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Modals */}
        <AddUserModal
          isOpen={showAddUserModal}
          onClose={() => {
            setShowAddUserModal(false)
            setNewFirstName("")
            setNewLastName("")
            setNewEmail("")
            setNewPassword("")
            setNewConfirmPassword("")
            setNewPhone("")
            setSelectedImage(null)
            setImagePreview(null)
            setEmailAvailable(null)
            setPhoneAvailable(null)
            setErrors({})
            setErrorMessage("")
          }}
          onAddUser={handleAddUser}
          emailChecking={emailChecking}
          emailAvailable={emailAvailable}
          checkEmailAvailability={checkEmailAvailability}
          newEmail={newEmail}
          setNewEmail={setNewEmail}
          newFirstName={newFirstName}
          setNewFirstName={setNewFirstName}
          newLastName={newLastName}
          setNewLastName={setNewLastName}
          newPhone={newPhone}
          setNewPhone={setNewPhone}
          phoneChecking={phoneChecking}
          phoneAvailable={phoneAvailable}
          checkPhoneAvailability={checkPhoneAvailability}
          newPassword={newPassword}
          newConfirmPassword={newConfirmPassword}
          handlePasswordChange={handlePasswordChange}
          handleImageChange={handleImageChange}
          selectedImage={selectedImage}
          imagePreview={imagePreview}
          errors={errors}
          errorMessage={errorMessage}
          loading={loading}
        />

        <EditUserModal
          user={userToEdit}
          isOpen={showEditUserModal}
          onClose={() => {
            setShowEditUserModal(false)
            setUserToEdit(null)
          }}
        />

        <ConfirmDeleteUserModal
          isOpen={showConfirmDelete}
          onClose={cancelDelete}
          onConfirm={confirmDeleteUser}
          user={userToDelete}
        />
      </div>
    </motion.div>
  )
}

export default StaffManagement
