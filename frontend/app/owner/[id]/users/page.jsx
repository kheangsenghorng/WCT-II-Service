"use client";
import React, { useState, useEffect } from "react";
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
import EditUserModal from "@/components/staff/EditUserModal";
import { request } from "@/util/request";
import AddUserModal from "@/components/staff/AddUserModal"; // Import AddUserModal
import ConfirmDeleteUserModal from "@/components/staff/ConfirmDeleteUserModal"; // Import ConfirmDeleteUserModal

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

  const { updateUserOwner } = useUserStore(); // if it's in Zustand or a similar store

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
    console.log("Editing user:", user); // Debug here
    setUserToEdit(user);
    setShowEditUserModal(true);
  };
  

  const handleDeleteUser = (user) => {
    setUserToDelete(user); // store the user to delete
    setShowConfirmDelete(true); // show confirmation modal
  };

  // Add debounce for phone number checking
  const isValidPhone = (phone) => {
    return typeof phone === "string" && /^\d{6,}$/.test(phone); // adjust length as needed
  };

  const checkPhoneAvailability = debounce(async (phone) => {
    if (!isValidPhone(phone)) return;

    setPhoneChecking(true);
    setPhoneAvailable(null);

    try {
      const res = await request(`/check-phone?phone=${phone}`, "GET");
      await fetchUsersByOwner(ownerId); // If this is required for your flow

      if (res.available) {
        setPhoneAvailable(true);
        setErrors((prev) => ({ ...prev, phone: null }));
      } else {
        setPhoneAvailable(false);
        setErrors((prev) => ({
          ...prev,
          phone: ["The phone number has already."],
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
          email: ["The email has already."],
        }));
      }
    } catch (error) {
      console.error("Email check failed:", error);
    } finally {
      setEmailChecking(false);
    }
  }, 600);

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(ownerId, userToDelete.id); // call your Zustand action or API
      setSuccessMessage("User deleted successfully");
      setShowConfirmDelete(false);
      setUserToDelete(null);
      setDeletingUserId(null)
      await fetchUsersByOwner(ownerId);
      setErrorMessage(""); // clear any previous errors
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete user.");
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setUserToDelete(null);
    setDeletingUserId(null)
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



  const handleSaveUser = async (updatedUser) => {
    try {
      const { id, first_name, last_name, phone, image } = updatedUser;
  
      const formData = new FormData();
      formData.append("first_name", first_name);
      formData.append("last_name", last_name);
      formData.append("phone", phone || "");
  
      // Only append image if it's a new File (not a string URL)
      if (image instanceof File) {
        formData.append("image", image);
      }
  
      await updateUserOwner(ownerId, id, formData); // ← make sure ownerId is in scope
  
      setShowEditUserModal(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
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
                    <td className="py-3 px-6 whitespace-nowrap">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-500 font-bold py-2 rounded mr-2 inline-flex items-center"
                      >
                        <Edit className="w-8" />
                        </button>

                      <button
                        onClick={() => handleDeleteUser(user)}
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

{showEditUserModal && userToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6"
            >
              <EditUserModal
                user={userToEdit}
                onClose={() => setShowEditUserModal(false)}
                onSave={handleSaveUser}
              />
            </motion.div>
          </div>
        )}


      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
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
      />

      <ConfirmDeleteUserModal
        isOpen={showConfirmDelete}
        onClose={handleCancelDeleteUser}
        onConfirm={confirmDeleteUser}
      />
    </motion.div>
  );
};

export default Users;