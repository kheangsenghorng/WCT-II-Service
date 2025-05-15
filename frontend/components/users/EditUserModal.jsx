"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/useUserStore";
import { CheckCircle, AlertTriangle } from "lucide-react";

const EditUser = () => {
  const { id: userId } = useParams();
  const router = useRouter();
  const {
    getUserById,
    updateUser,
    loading,
    error,
  } = useUserStore();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error("User not found");
        const userData = await response.json();
        setUser(userData);
        setFormData({
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          phone: userData.phone || "",
          email: userData.email || "",
          role: userData.role || "",
        });
        if (userData.image) setImagePreview(userData.image);
      } catch (err) {
        console.error(err);
      }
    };
    if (userId) fetchUser();
  }, [userId]);
  

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      data.append(key, value)
    );
    if (selectedImage) data.append("image", selectedImage);

    try {
      await updateUser(userId, data);
      setSuccessMessage("User updated successfully.");
      setTimeout(() => {
        router.push("/dashboard/users"); // Or wherever your user list lives
      }, 1500);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <motion.div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Edit User</h1>

      {successMessage && (
        <motion.div
          className="bg-green-100 text-green-800 border border-green-400 p-4 rounded mb-4 flex items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <CheckCircle className="mr-2" />
          {successMessage}
        </motion.div>
      )}

      {error && (
        <motion.div
          className="bg-red-100 text-red-800 border border-red-400 p-4 rounded mb-4 flex items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <AlertTriangle className="mr-2" />
          {error}
        </motion.div>
      )}

      {!loading && user && (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold">First Name</label>
              <input
                id="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Last Name</label>
              <input
                id="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Phone</label>
              <input
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Role</label>
              <input
                id="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Image</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-20 h-20 object-cover rounded-full"
                />
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default EditUser;
