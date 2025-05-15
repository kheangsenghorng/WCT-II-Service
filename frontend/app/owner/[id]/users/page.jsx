"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  UserPlus,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useParams } from "next/navigation";
import EditUserModal from "@/components/users/EditUserModal";
import { request } from "@/util/request";

const Users = () => {
  const { id: ownerId } = useParams();
  const {
    users,
    fetchUsersByOwner,
    createUserUnderOwner,
    loading,
    error,
    deleteUser,
  } = useUserStore();

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const [successMessage, setSuccessMessage] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedRole, setEditedRole] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Add user fields
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhone, setNewPhone] = useState(""); // Add new state for phone number

  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [emailChecking, setEmailChecking] = useState(false);
  const [phoneChecking, setPhoneChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [phoneAvailable, setPhoneAvailable] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (ownerId) fetchUsersByOwner(ownerId);
  }, [ownerId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    hover: { backgroundColor: "#f9f9f9" },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };
  const handleEditUser = (user) => {
    setUserToEdit(user.id);
    setShowEditUserModal(true);
  };

  const handleDeleteUser = (userId) => {
    setDeletingUserId(userId); // store the user to delete
    setShowConfirmDelete(true); // show confirmation modal
  };

  const checkPhoneAvailability = debounce(async (phone) => {
    if (!phone) return;

    setPhoneChecking(true);
    setPhoneAvailable(null);

    try {
      const res = await request(`/check-phone?phone=${phone}`, "GET");

      if (res.available) {
        setPhoneAvailable(true);
        setErrors((prev) => ({ ...prev, phone: null }));
      } else {
        setPhoneAvailable(false);
        setErrors((prev) => ({
          ...prev,
          phone: ["The phone number has already been taken."],
        }));
      }
    } catch (error) {
      console.error("Phone check failed:", error);
    } finally {
      setPhoneChecking(false);
    }
  }, 600);

  const checkEmailAvailability = debounce(async (email) => {
    if (!email) return;

    setEmailChecking(true);
    setEmailAvailable(null);

    try {
      const res = await request(`/check-email?email=${email}`, "GET");

      if (res.available) {
        setEmailAvailable(true);
        setErrors((prev) => ({ ...prev, email: null }));
      } else {
        setEmailAvailable(false);
        setErrors((prev) => ({
          ...prev,
          email: ["The email has already been taken."],
        }));
      }
    } catch (error) {
      console.error("Email check failed:", error);
    } finally {
      setEmailChecking(false);
    }
  }, 600);

  const confirmDeleteUser = async () => {
    if (!deletingUserId) return;

    try {
      await deleteUser(ownerId, deletingUserId); // call your Zustand action or API
      setSuccessMessage("User deleted successfully");
      setShowConfirmDelete(false);
      setDeletingUserId(null);
      await fetchUsersByOwner(ownerId);
      setErrorMessage(""); // clear any previous errors
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete user.");
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeletingUserId(null);
    setErrorMessage("");
  };

  const confirmEditUser = () => {
    // Replace with real update logic
    setSuccessMessage("User role updated successfully");
    setShowConfirmEdit(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handlePasswordChange = (name, value) => {
    if (name === "password") {
      setNewPassword(value);
    } else if (name === "password_confirmation") {
      setNewConfirmPassword(value);
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      const password = name === "password" ? value : newPassword;
      const confirmPassword =
        name === "password_confirmation" ? value : newConfirmPassword;

      // Check for password match
      if (password !== confirmPassword) {
        newErrors.password_confirmation = ["Passwords do not match."];
      } else {
        delete newErrors.password_confirmation;
      }

      // Check for password strength
      if (password.length < 8) {
        newErrors.password = ["Password must be at least 8 characters long."];
      } else {
        delete newErrors.password;
      }

      return newErrors;
    });
  };

  const handleAddUser = async () => {
    if (emailAvailable === false || phoneAvailable === false) {
      setErrorMessage(
        "Please resolve the validation errors before submitting."
      );
      return;
    }
    if (errors.password || errors.password_confirmation) {
      setErrorMessage("Please fix password errors before submitting.");
      return;
    }

    const formData = new FormData();

    // Append form fields to FormData
    formData.append("email", newEmail); // Correcting from userEmail to newEmail
    formData.append("first_name", newFirstName);
    formData.append("last_name", newLastName); // Fixed missing value for last_name
    formData.append("phone", newPhone);
    formData.append("password", newPassword);
    formData.append("password_confirmation", newConfirmPassword);
    // Append image if selected
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    // Send request to create user under owner
    await createUserUnderOwner(formData, ownerId);

    // Fetch updated user list by owner
    await fetchUsersByOwner(ownerId);

    // Show success message
    setSuccessMessage("User added successfully");

    // Reset form fields
    setNewFirstName("");
    setNewLastName("");
    setNewEmail("");
    setNewPassword("");
    setNewConfirmPassword("");
    setNewPhone(""); // Reset phone number
    setSelectedImage(null);
    setImagePreview(null);
    setShowAddUserModal(false);
  };

  const handleCancelDeleteUser = () => {
    setShowConfirmDelete(false);
    setUserToDelete(null);
  };

  return (
    <motion.div
      className="container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-white">
        Staff
      </h1>

      <button
        onClick={() => setShowAddUserModal(true)}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center mb-4"
      >
        <UserPlus className="h-5 w-5 mr-2" />
        Add Staff
      </button>

      {successMessage && (
        <motion.div
          className="fixed top-4 right-4 bg-green-100 border border-green-500 text-green-700 py-3 px-4 rounded-md shadow-md z-50 flex items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          {successMessage}
        </motion.div>
      )}

      {error && (
        <motion.div
          className="fixed top-4 right-4 bg-red-100 border border-red-500 text-red-700 py-3 px-4 rounded-md shadow-md z-50 flex items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300">
          Loading users...
        </div>
      ) : (
        <div className="overflow-x-auto mt-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Image</th>
                <th className="py-3 px-6 text-left text-nowrap">First Name</th>
                <th className="py-3 px-6 text-left text-nowrap">Last Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Role</th>
                <th className="py-3 px-6 text-left text-nowrap">Created At</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400 text-sm font-light">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    className="border-b dark:border-gray-700"
                    variants={rowVariants}
                    whileHover="hover"
                  >
                    <td className="py-3 px-6">{index + 1}</td>
                    <td className="py-3 px-6">
                      <img
                        src={user?.image || "/default-avatar.png"}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="py-3 px-6">{user.first_name}</td>
                    <td className="py-3 px-6">{user.last_name}</td>
                    <td className="py-3 px-6">{user.email}</td>
                    <td className="py-3 px-6">{user.phone}</td>
                    <td className="py-3 px-6 capitalize">{user.role}</td>
                    <td className="py-3 px-6">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-500 font-bold py-2 rounded mr-2 inline-flex items-center"
                      >
                        <Edit className="w-8" />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 font-bold py-2 rounded inline-flex items-center"
                      >
                        <Trash2 className="w-8" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showEditUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6"
          >
            <EditUserModal
              userId={userToEdit}
              onClose={() => setShowEditUserModal(false)}
              onSave={(updatedUser) => {
                setSuccessMessage("User updated successfully");
                setShowEditUserModal(false);
                fetchUsersByOwner(ownerId);
              }}
            />
          </motion.div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg mx-auto w-full">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Add Staff
            </h2>
            <form>
              <div className="mb-4 flex space-x-4">
                <div className="mb-4 ">
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-semibold text-gray-800 dark:text-white"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-semibold text-gray-800 dark:text-white"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-800 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={newEmail}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewEmail(value);
                    checkEmailAvailability(value);
                  }}
                  className="w-full px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {emailChecking && (
                  <p className="text-sm text-gray-500">Checking email...</p>
                )}
                {emailAvailable === false && (
                  <p className="text-sm text-red-500">{errors.email?.[0]}</p>
                )}
                {emailAvailable === true && (
                  <p className="text-sm text-green-500">Email is available.</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-800 dark:text-white"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  value={newPhone}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewPhone(value);
                    checkPhoneAvailability(value);
                  }}
                  className="w-full px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {phoneChecking && (
                  <p className="text-sm text-gray-500">Checking phone...</p>
                )}
                {phoneAvailable === false && (
                  <p className="text-sm text-red-500">{errors.phone?.[0]}</p>
                )}
                {phoneAvailable === true && (
                  <p className="text-sm text-green-500">
                    Phone number is available.
                  </p>
                )}
              </div>
              <div className="mb-4 flex space-x-4">
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-800 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={newPassword}
                    onChange={(e) =>
                      handlePasswordChange("password", e.target.value)
                    }
                    className="w-full px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password[0]}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password_confirmation"
                    className="block text-sm font-semibold text-gray-800 dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={newConfirmPassword}
                    onChange={(e) =>
                      handlePasswordChange(
                        "password_confirmation",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  {errors.password_confirmation && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password_confirmation[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-sm font-semibold text-gray-800 dark:text-white"
                >
                  Profile Image
                </label>
                <input
                  type="file"
                  id="image"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-20 h-20 object-cover rounded-full"
                  />
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddUser}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg shadow-md p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p className="mt-4">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Users;
