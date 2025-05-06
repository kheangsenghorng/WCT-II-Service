"use client";

import { useState } from "react";
import { request } from "@/util/request"; // Import the utility function

const AddCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fies, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (fies) formData.append("image", fies);

    try {
      const response = await request("/admin/categories", "POST", formData);
      console.log("Category created:", response);
    } catch (error) {
      setError(error.response?.data?.message || "Error creating category");
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category Name"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      {error && <p>{error}</p>}
      <button type="submit">Create Category</button>
    </form>
  );
};

export default AddCategory;
