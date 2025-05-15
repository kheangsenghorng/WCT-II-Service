"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, CheckCircle, AlertTriangle, UserPlus } from "lucide-react";
import { request } from "@/util/request";  // Correct import of request

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedRole, setEditedRole] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await request("/admin/users", "GET");
      setUsers(data);
    } catch (err) {
      setError(`Error fetching users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (user) => {
    setEditingUserId(user.id);
    setEditedRole(user.role);
    setUserToEdit(user);
    setShowConfirmEdit(true);
  };

  const confirmEditUser = async () => {
    try {
      await request(`/admin/users/${editingUserId}`, "PUT", { role: editedRole });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUserId ? { ...user, role: editedRole } : user
        )
      );

      setSuccessMessage("Role updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(`Error updating role: ${err.message}`);
    } finally {
      setShowConfirmEdit(false);
      setEditingUserId(null);
      setUserToEdit(null);
    }
  };

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setShowConfirmDelete(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await request(`/admin/users/${userToDelete}`, "DELETE");

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete));
      setSuccessMessage("User deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(`Error deleting user: ${err.message}`);
    } finally {
      setShowConfirmDelete(false);
      setUserToDelete(null);
    }
  };

  const handleAddUser = async () => {
    if (newPassword !== newConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await request("/admin/users", "POST", {
        first_name: newFirstName,
        last_name: newLastName,
        email: newEmail,
        password: newPassword,
      });

      await fetchUsers();
      setSuccessMessage("User added successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(`Error adding user: ${err.message}`);
    } finally {
      setShowAddUserModal(false);
      setNewFirstName("");
      setNewLastName("");
      setNewEmail("");
      setNewPassword("");
      setNewConfirmPassword("");
    }
  };
  

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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

  return (
    <motion.div
      className="container mx-auto p-4 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-white">Users</h1>
            {/* <button
                onClick={() => setShowAddUserModal(true)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center mb-4"
            >
                <UserPlus className="h-5 w-5 mr-2" />
                Add User
            </button> */}

      {successMessage && (
        <motion.div
          className="fixed top-4 right-4 bg-green-100 border border-green-500 text-green-700 py-3 px-4 rounded-md shadow-md z-50 flex items-center"
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
          className="fixed top-4 right-4 bg-red-100 border border-red-500 text-red-700 py-3 px-4 rounded-md shadow-md z-50 flex items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300">Loading users...</div>
      ) : (
        <div className="overflow-x-auto mt-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Image</th>
              <th className="py-3 px-6 text-left">First Name</th>
              <th className="py-3 px-6 text-left">Last Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Created At</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400 text-sm font-light">
          {users.length > 0 ? (
        users
          .filter((user) => user.role !== "admin") // ✅ filter out admin users
          .map((user,index) => (
                <motion.tr
                  key={user.id}
                  className="border-b dark:border-gray-700"
                  variants={rowVariants}
                  whileHover="hover"
                >
                  <td className="py-3 px-6">{index + 1}</td>
                  <td className="py-3 px-6">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="py-3 px-6">{user.first_name}</td>
                  <td className="py-3 px-6">{user.last_name}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">{user.phone}</td>
                  <td className="py-3 px-6 capitalize">{user.role}</td>
                  <td className="py-3 px-6">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 whitespace-nowrap">
                    <button
                      onClick={() => handleEditRole(user)}
                      className="text-blue-500 font-bold py-2 px-2 rounded inline-flex items-center"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 font-bold py-2 px-2 rounded inline-flex items-center"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-6">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <motion.div
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete this user?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Edit Role Modal */}
      {showConfirmEdit && userToEdit && (
        <motion.div
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Edit User Role
            </h3>
            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select New Role
              </label>
              <select
                id="role"
                value={editedRole}
                onChange={(e) => setEditedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="user">user</option>
                {/* <option value="admin">admin</option> */}
                <option value="owner">owner</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowConfirmEdit(false);
                  setEditingUserId(null);
                  setUserToEdit(null);
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmEditUser}
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      )}

      
    </motion.div>
  );
};

export default Users;