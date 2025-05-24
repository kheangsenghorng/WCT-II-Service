"use client";

import { useEffect, useState } from "react";
import { useTypeStore } from "@/store/useTypeStore";
import { useCategoryStore } from "@/store/useCateroyStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Trash2,
  Plus,
  AlertTriangle,
  X,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.05 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  hover: {
    backgroundColor: "rgba(59, 130, 246, 0.05)",
    transition: { duration: 0.2 },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.8, y: 20, transition: { duration: 0.2 } },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const AddTypeModal = ({
  isOpen,
  onClose,
  onAddType,
  initialValues = {},
  isEditing = false,
  imagePreview,
  handleImageChange,
}) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [serviceCategoryId, setServiceCategoryId] = useState(
    initialValues?.categoryId || ""
  );
  const [errorMessage, setErrorMessage] = useState(null);

  const { categories: serviceCategories } = useCategoryStore();

  useEffect(() => {
    setName(initialValues?.name || "");
    setServiceCategoryId(initialValues?.categoryId || "");
  }, [initialValues]);

  const handleSubmit = () => {
    if (!name.trim() || !serviceCategoryId) {
      setErrorMessage("Both name and category are required.");
      return;
    }
    setErrorMessage(null);
    onAddType(name.trim(), Number(serviceCategoryId));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl max-w-lg w-full mx-4 border border-gray-200 dark:border-gray-700"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditing ? "Edit Type" : "Add New Type"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {errorMessage && (
              <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-950/20">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 dark:text-red-400">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Type Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter type name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                </Label>
                <Select
                  value={serviceCategoryId.toString()}
                  onValueChange={setServiceCategoryId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-medium">
                  Upload Image
                </Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                    )}
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isEditing ? "Update" : "Add"} Type
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border border-gray-200 dark:border-gray-700"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {message}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                variant="destructive"
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Type() {
  const {
    userTypes,
    fetchAllUserTypes,
    addUserType,
    updateUserType,
    deleteUserType,
    loading,
    error,
  } = useTypeStore();

  const { categories: serviceCategories, fetchCategories } = useCategoryStore();

  const [showModal, setShowModal] = useState(false);
  const [editValues, setEditValues] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Keep your original useEffect exactly as it was
  useEffect(() => {
    fetchAllUserTypes();
    fetchCategories();
  }, [fetchAllUserTypes, fetchCategories]);

  console.log(userTypes);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddType = async (name, serviceCategoryId) => {
    try {
      if (editValues) {
        await updateUserType(editValues.id, name, serviceCategoryId, image);
        setSuccessMessage("Type updated successfully!");
      } else {
        await addUserType(name, serviceCategoryId, image);
        setSuccessMessage("Type added successfully!");
      }
      fetchAllUserTypes();
      setEditValues(null);
      setImage(null);
      setImagePreview(null);
      setShowModal(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleEdit = (type) => {
    const catId = Array.isArray(type.service_categories_id)
      ? type.service_categories_id[0]
      : type.service_categories_id;

    setEditValues({
      id: type.id,
      name: type.name,
      categoryId: catId,
    });

    if (type.imageUrl) {
      setImagePreview(type.imageUrl);
    }

    setShowModal(true);
  };

  const handleDelete = (id) => setConfirmDeleteId(id);
  const handleConfirmDelete = async () => {
    await deleteUserType(confirmDeleteId);
    setConfirmDeleteId(null);
    fetchAllUserTypes();
  };
  const handleCancelDelete = () => setConfirmDeleteId(null);

  const getServiceCategoryName = (id) =>
    serviceCategories.find((cat) => cat.id === id)?.name || id;

  // Filter logic for search and category
  const filteredTypes = userTypes.filter((type) => {
    const matchesSearch = type.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filterCategory ||
      type.service_categories_id.toString() === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            User Type Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and organize your user types efficiently
          </p>
        </div>

        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-950/20">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <AlertDescription className="text-green-700 dark:text-green-400">
                {successMessage}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {serviceCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                setEditValues(null);
                setImage(null);
                setImagePreview(null);
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Type
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <TableHead className="w-16 text-center font-semibold">
                  #
                </TableHead>
                <TableHead className="w-24 text-center font-semibold">
                  Image
                </TableHead>
                <TableHead className="font-semibold">Type Name</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Created</TableHead>
                <TableHead className="font-semibold">Updated</TableHead>
                <TableHead className="w-20 text-center font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredTypes.map((type, index) => (
                  <motion.tr
                    key={type.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    whileHover="hover"
                    className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <TableCell className="text-center font-medium text-gray-600 dark:text-gray-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Avatar className="h-12 w-12 border-2 border-gray-200 dark:border-gray-600">
                          <AvatarImage
                            src={type.image_url || "/placeholder.svg"}
                            alt={type.name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                            {type.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {type.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        {Array.isArray(type.service_categories_id)
                          ? type.service_categories_id
                              .map(getServiceCategoryName)
                              .join(", ")
                          : getServiceCategoryName(type.service_categories_id)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {new Date(type.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {new Date(type.updated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() => handleEdit(type)}
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(type.id)}
                            className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>

          {filteredTypes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <Plus className="h-16 w-16 mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No types found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || filterCategory
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first user type"}
              </p>
              {!searchTerm && !filterCategory && (
                <Button
                  onClick={() => {
                    setEditValues(null);
                    setImage(null);
                    setImagePreview(null);
                    setShowModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Type
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <AddTypeModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditValues(null);
          setImage(null);
          setImagePreview(null);
        }}
        onAddType={handleAddType}
        initialValues={editValues}
        isEditing={!!editValues}
        imagePreview={imagePreview}
        handleImageChange={handleImageChange}
      />

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="Are you sure you want to delete this user type?"
      />
    </motion.div>
  );
}
