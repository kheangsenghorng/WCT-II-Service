"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Edit, Trash2, CheckCircle, AlertTriangle, UserPlus } from "lucide-react"
import { useUserStore } from "@/store/useUserStore"
import { useParams } from "next/navigation"
import EditUserModal from "@/components/staff/EditUserModal"
import { request } from "@/util/request"
import AddUserModal from "@/components/staff/AddUserModal"
import ConfirmDeleteUserModal from "@/components/staff/ConfirmDeleteUserModal"

const Users = () => {
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
  const [viewMode, setViewMode] = useState("table"); // Default view mode

  useEffect(() => {
    if (ownerId) fetchUsersByOwner(ownerId)
  }, [ownerId])

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



  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          {viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-md p-6 animate-pulse"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            <h3 className="font-semibold mb-2">Error Loading Guest Data</h3>
            <p>{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="container mx-auto p-6" variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Staff Management</h1>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg inline-flex items-center transition-colors"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add Staff Member
        </button>
      </div>

      {successMessage && (
        <motion.div
          className="fixed top-4 right-4 bg-green-100 border border-green-500 text-green-700 py-3 px-4 rounded-md shadow-lg z-50 flex items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          {successMessage}
        </motion.div>
      )}

      {error && (
        <motion.div
          className="fixed top-4 right-4 bg-red-100 border border-red-500 text-red-700 py-3 px-4 rounded-md shadow-lg z-50 flex items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    #
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      variants={rowVariants}
                      whileHover="hover"
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={user?.image || "/default-avatar.png"}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.first_name} {user.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.phone || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Edit user"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="text-gray-500 dark:text-gray-400">
                        <UserPlus className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No staff members found</p>
                        <p className="text-sm">Get started by adding your first staff member.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

      {showConfirmDelete && (
        <ConfirmDeleteUserModal
          isOpen={showConfirmDelete}
          onClose={cancelDelete}
          onConfirm={confirmDeleteUser}
          user={userToDelete}
        />
      )}
    </motion.div>
  )
}

export default Users
