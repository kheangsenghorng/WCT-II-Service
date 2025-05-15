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

const Users = () => {
  const { id: ownerId } = useParams();
  const { users, fetchUsersByOwner, createUserUnderOwner, loading, error } =
    useUserStore();

  const [successMessage, setSuccessMessage] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedRole, setEditedRole] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [cancelDeleteUser, setCancelDeleteUser] = useState(false);




  // Add user fields
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhone, setNewPhone] = useState(""); // Add new state for phone number

  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleEditRole = (user) => {
    setUserToEdit(user);
    setEditedRole(user.role);
    setShowConfirmEdit(true);
  };

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setShowConfirmDelete(true);
  };

  const confirmDeleteUser = () => {
    // Replace with real delete logic
    setSuccessMessage("User deleted successfully");
    setShowConfirmDelete(false);
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

  const handleAddUser = async () => {
    const formData = new FormData();

    // Append form fields to FormData
    formData.append("email", newEmail);  // Correcting from userEmail to newEmail
    formData.append("first_name", newFirstName);
    formData.append("last_name", newLastName);  // Fixed missing value for last_name
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
                        onClick={() => handleEditRole(user)}
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
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
                  id="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
                  id="password_confirmation"
                  value={newConfirmPassword}
                  onChange={(e) => setNewConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCancelDeleteUser}
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
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
