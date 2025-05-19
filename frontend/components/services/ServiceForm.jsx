import { useState, useEffect } from "react";
import { Loader2, ImageIcon, XCircle, AlertTriangle } from "lucide-react";

export default function ServiceForm({
  onSubmit,
  categories = [],
  types = [],
  loading = false,
  initialData = null,
  onCategoryChange,
  loadingCategories = false,
  loadingTypes = false,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: "",
    service_categories_id: "",
    type_id: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [newServiceName, setNewServiceName] = useState("");
    const [newServiceDescription, setNewServiceDescription] = useState("");
    const [newServiceBasePrice, setNewServiceBasePrice] = useState("");
    const [newServiceCategoryId, setNewServiceCategoryId] = useState("");
    const [newServiceType, setNewServiceType] = useState("");
    const [newServiceImages, setNewServiceImages] = useState([]);
    

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        base_price: initialData.base_price || "",
        service_categories_id: initialData.service_categories_id || "",
        type_id: initialData.type_id || "",
        images: initialData.images || [],
      });
      setImagePreviews(
        (initialData.images || []).map((img) =>
          typeof img === "string" ? img : URL.createObjectURL(img)
        )
      );
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    console.log("Category selected:", categoryId);
    setFormData((prev) => ({
      ...prev,
      service_categories_id: categoryId,
      type_id: "",
    }));
    if (onCategoryChange) onCategoryChange(categoryId);
  };
  

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const previews = [];

    files.forEach((file) => {
      const isValidImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (isValidImage && isValidSize) {
        validFiles.push(file);
        previews.push(URL.createObjectURL(file));
      }
    });

    if (validFiles.length === 0) {
      setErrorMessage("Please upload valid image files (max 5MB each).");
      return;
    }

    setErrorMessage("");
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleSubmit = async () => {
    if (
      !newServiceName ||
      !newServiceCategoryId ||
      !newServiceBasePrice ||
      !newServiceType ||
      newServiceImages.length === 0
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (isNaN(newServiceBasePrice) || parseFloat(newServiceBasePrice) <= 0) {
      setErrorMessage("Please enter a valid positive price.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newServiceName);
    formData.append("description", newServiceDescription);
    formData.append("service_categories_id", newServiceCategoryId);
    formData.append("base_price", newServiceBasePrice);
    formData.append("type_id", newServiceType);

    newServiceImages.forEach((file, index) => {
      formData.append("images[]", file);
    });

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      resetForm();
      onClose();
    } catch (err) {
      setErrorMessage(err.message || "Failed to add service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 py-2 px-4 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {errorMessage}
        </div>
      )}

      {/* Service Name */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Service Name *
        </label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          placeholder="Enter service name"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          rows={3}
          placeholder="Enter service description"
        />
      </div>

      {/* Category and Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Category *
          </label>
          <select
            name="service_categories_id"
            value={formData.service_categories_id}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            disabled={loadingCategories}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {loadingCategories && (
            <p className="mt-1 text-xs text-gray-500">Loading categories...</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Service Type *
          </label>
          <select
            name="type_id"
            value={formData.type_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            disabled={loadingTypes || !formData.service_categories_id}
            required
          >
            <option value="">Select type</option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {loadingTypes && (
            <p className="mt-1 text-xs text-gray-500">Loading types...</p>
          )}
        </div>
      </div>

      {/* Base Price */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Base Price *
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            $
          </span>
          <input
            type="number"
            name="base_price"
            value={formData.base_price}
            onChange={handleChange}
            className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Service Images *
        </label>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag
              and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG (max 5MB each)
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
            required={formData.images.length === 0}
          />
        </label>

        {/* Previews */}
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="h-24 w-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 -mt-2 -mr-2"
                  aria-label="Remove image"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Add Service
        </button>
      </div>
    </form>
  );
}
