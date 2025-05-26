"use client";

import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

const BlogTable = ({ blogs, openDeleteConfirm, openEditForm }) => {
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      variants={tableVariants}
      initial="hidden"
      animate="visible"
    >
      <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
        <thead className="bg-gray-100 dark:bg-gray-700 uppercase text-xs font-semibold tracking-wide text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-6 py-3 w-12">#</th>
            <th className="px-6 py-3 w-20">Image</th>
            <th className="px-6 py-3 max-w-[200px]">Title</th>
            <th className="px-6 py-3 max-w-[350px]">Content</th>
            <th className="px-6 py-3 w-32 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {blogs.map((blog, index) => (
            <motion.tr
              key={blog.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              variants={rowVariants}
              initial="hidden"
              animate="visible"
            >
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{index + 1}</td>

              <td className="px-2 py-4">
                {blog.image_url ? (
                  <Image
                    src={blog.image_url}
                    alt={blog.title}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-md object-cover border border-gray-300 dark:border-gray-600 shadow-sm"
                  />
                ) : (
                  <span className="text-gray-400 italic">No Image</span>
                )}
              </td>

              <td
                className="px-6 py-4 max-w-[200px] truncate text-gray-800 dark:text-white cursor-default"
                title={blog.title}
              >
                {blog.title}
              </td>

              <td
                className="px-6 py-4 max-w-[350px] truncate text-gray-700 dark:text-gray-300 cursor-default"
                title={blog.content}
              >
                {blog.content}
              </td>

              <td className="px-6 py-4 text-center">
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={() => openEditForm(blog)}
                    className="text-blue-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200"
                    aria-label={`Edit blog titled ${blog.title}`}
                  >
                    <Pencil size={24} />
                  </button>

                  <button
                    onClick={() => openDeleteConfirm(blog)}
                    className="text-red-500 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors duration-200"
                    aria-label={`Delete blog titled ${blog.title}`}
                  >
                    <Trash2 size={24} />
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
