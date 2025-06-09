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
  UsersIcon,
  Mail,
  Phone,
  Calendar,
  Shield,
} from "lucide-react"
import { request } from "@/util/request"

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [editingUserId, setEditingUserId] = useState(null)
  const [editedRole, setEditedRole] = useState("")
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [showConfirmEdit, setShowConfirmEdit] = useState(false)
  const [userToEdit, setUserToEdit] = useState(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")

  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [newFirstName, setNewFirstName] = useState("")
  const [newLastName, setNewLastName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newConfirmPassword, setNewConfirmPassword] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await request("/admin/users", "GET")
      setUsers(data)
    } catch (err) {
      setError(`Error fetching users: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEditRole = (user) => {
    setEditingUserId(user.id)
    setEditedRole(user.role)
    setUserToEdit(user)
    setShowConfirmEdit(true)
  }

  const confirmEditUser = async () => {
    try {
      await request(`/admin/users/${editingUserId}`, "PUT", { role: editedRole })

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === editingUserId ? { ...user, role: editedRole } : user)),
      )

      setSuccessMessage("Role updated successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(`Error updating role: ${err.message}`)
    } finally {
      setShowConfirmEdit(false)
      setEditingUserId(null)
      setUserToEdit(null)
    }
  }

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId)
    setShowConfirmDelete(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    try {
      await request(`/admin/users/${userToDelete}`, "DELETE")

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete))
      setSuccessMessage("User deleted successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(`Error deleting user: ${err.message}`)
    } finally {
      setShowConfirmDelete(false)
      setUserToDelete(null)
    }
  }

  const handleAddUser = async () => {
    if (newPassword !== newConfirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      await request("/admin/users", "POST", {
        first_name: newFirstName,
        last_name: newLastName,
        email: newEmail,
        password: newPassword,
      })

      await fetchUsers()
      setSuccessMessage("User added successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(`Error adding user: ${err.message}`)
    } finally {
      setShowAddUserModal(false)
      setNewFirstName("")
      setNewLastName("")
      setNewEmail("")
      setNewPassword("")
      setNewConfirmPassword("")
    }
  }

  // Filter users based on search term and role
  const filteredUsers = users
    .filter((user) => user.role !== "admin")
    .filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase()
      const matchesSearch = searchTerm
        ? fullName.includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())
        : true
      const matchesRole = roleFilter ? user.role === roleFilter : true
      return matchesSearch && matchesRole
    })

  const getRoleColor = (role) => {
    switch (role) {
      case "staff":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "owner":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "user":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      
    }
  }

  const stats = {
    total: filteredUsers.length,
    owners: filteredUsers.filter((u) => u.role === "owner").length,
    users: filteredUsers.filter((u) => u.role === "user").length,
    staff: filteredUsers.filter((u) => u.role === "staff").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">User Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage and organize your users efficiently</p>
            </div>

            {/* <button
              onClick={() => setShowAddUserModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <UserPlus className="h-5 w-5" />
              Add New User
            </button> */}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Owners</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.owners}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Regular Users</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.users}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Role Filter */}
              <div className="flex gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Roles</option>
                  <option value="user">Users</option>
                  <option value="owner">Owners</option>
                  <option value="staff">Staff</option>
                </select>

                {/* Clear Filters */}
                {(searchTerm || roleFilter) && (
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setRoleFilter("")
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
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

          {error && (
            <motion.div
              className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 py-2 px-4 rounded-lg shadow-md z-[100] flex items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AlertTriangle className="w-5 h-5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {loading ? (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Loading users...</p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                <UsersIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No users found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchTerm || roleFilter ? "Try adjusting your filters" : "Get started by adding your first user"}
              </p>
              {/* <button
                onClick={() => setShowAddUserModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200"
              >
                Add New User
              </button> */}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
                    {[
                      { key: "ID", label: "ID" },
                      { key: "User", label: "User" },
                      { key: "Contact", label: "Contact" },
                      { key: "Role", label: "Role" },
                      { key: "Created", label: "Created" },
                      { key: "Actions", label: "Actions" },
                    ].map((header) => (
                      <th
                        key={header.key}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {header.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200"
                    >
                      {/* ID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-full">
                          <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{index + 1}</span>
                        </div>
                      </td>

                      {/* User Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={user.image || "/default-avatar.png"}
                              alt={`${user.first_name} ${user.last_name}`}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                              width={48}
                              height={48}
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                              {user.first_name} {user.last_name}
                            </h3>
                            {/* <p className="text-xs text-gray-500 dark:text-gray-400">ID: {user.id}</p> */}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[200px]">{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <Phone className="h-3 w-3" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditRole(user)}
                            className="group/edit p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-all duration-200 hover:shadow-md"
                          >
                            <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover/edit:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
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
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showConfirmDelete && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Delete</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteUser}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Role Modal */}
        <AnimatePresence>
          {showConfirmEdit && userToEdit && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Edit className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit User Role</h3>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select New Role
                  </label>
                  <select
                    value={editedRole}
                    onChange={(e) => setEditedRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowConfirmEdit(false)
                      setEditingUserId(null)
                      setUserToEdit(null)
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmEditUser}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Users
