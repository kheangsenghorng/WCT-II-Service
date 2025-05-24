// BlogTable.jsx
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

const BlogTable = ({ blogs, openEditForm, openDeleteConfirm }) => {
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { backgroundColor: "#f3f4f6" }, // Light gray on hover
  };

  return (
    <motion.div
      className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      variants={tableVariants}
      initial="hidden"
      animate="visible"
    >
      <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
        <thead className="bg-gray-100 dark:bg-gray-700 uppercase text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Image</th>
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Content</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {blogs.map((blog, index) => (
            <motion.tr
              key={blog.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              variants={rowVariants}
              whileHover="hover"
            >
              <td className="px-6 py-4 text-sm font-medium">{index + 1}</td>
              <td className="px-6 py-4">
                {blog.image ? (
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-md object-cover border border-gray-300 dark:border-gray-600 shadow-sm"
                  />
                ) : (
                  <span className="text-gray-400 italic">No Image</span>
                )}
              </td>
              <td className="px-6 py-4 text-gray-700 dark:text-white">
                {blog.title}
              </td>
              <td className="px-6 py-4  text-gray-700 dark:text-white">
                {blog.content}
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={() => openEditForm(blog)}
                    className="text-gray-700 dark:hover:text-blue-400 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={22} />
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(blog)}
                    className="text-red-500 dark:hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default BlogTable;