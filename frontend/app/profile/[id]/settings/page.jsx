'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Save, ArrowLeft } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';  // Make sure the import path is correct

export default function SettingsPage() {
  const { user, updateUser } = useUserStore();  // Destructure updateUser from the store
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '');
  const [avatarFile, setAvatarFile] = useState(null);

  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAvatarPreview(reader.result); // Set the preview image
        }
      };
      reader.readAsDataURL(file);
      setAvatarFile(file); // Keep track of the file for later use
    }
  };

  const handleSave = async () => {
    // If there's an image file, upload it and get the URL
    let imageUrl = avatarPreview;
    if (avatarFile) {
      imageUrl = await uploadImage(avatarFile);
    }

    // Call updateUser function to update the user profile
    updateUser(user.id, {
      first_name: firstName,
      last_name: lastName,
      avatarUrl: imageUrl, // Updated avatar URL after uploading
    });

    router.push(`/profile/${user.id}`);
  };

  // Image upload function to the backend
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-avatar', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload image');

    const data = await response.json();
    return data.url;  // Assuming your backend returns the image URL
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-black transition flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-3xl font-bold">Edit Profile</h1>
      </div>

      {/* Profile Image Upload */}
      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-md">
          <Image
            src={avatarPreview || '/default-user.svg'}
            alt="Avatar"
            fill
            className="object-cover"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M4 4a2 2 0 012-2h2a2 2 0 012 2H4zm10 0a2 2 0 00-2-2h-2a2 2 0 00-2 2h6zM2 8h16v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" />
            </svg>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Name Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        <Save className="w-4 h-4" />
        Save Changes
      </button>
    </div>
  );
}
