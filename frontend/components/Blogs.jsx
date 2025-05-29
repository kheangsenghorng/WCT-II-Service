"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { FileText, AlignLeft, ArrowRightCircle, CalendarDays } from "lucide-react"
import { format } from "date-fns"
import { useBlogStore } from "@/store/useBlogStore"

    const BlogSection = () => {
    const { id } = useParams()
    const {
        blogs,
        loading,
        error,
        fetchBlogs,
    } = useBlogStore()
    // Simulate loading state
    useEffect(() => {
        fetchBlogs()
      }, [])
      

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.03, transition: { duration: 0.2 } },
  }

  return (
    <motion.div
      className="py-16 px-8 md:px-20 lg:px-26 bg-gray-50 dark:bg-gray-900 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Stay Updated with Our Tips & Service News!
          </h1>
        </div>
        <div className="flex items-center justify-between w-full md:w-auto">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-green-500 dark:text-green-400">Our Blog</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              Stay informed with our latest cleaning tips, service updates, expert advice on maintaining an immaculate
              home
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts Section */}
      <section className="py-8">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl shadow-md bg-white dark:bg-gray-900 overflow-hidden animate-pulse"
                >
                  <div className="w-full h-52 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="p-5 space-y-4">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-red-500 text-lg">{error}</p>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {blogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    className="rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-900 overflow-hidden group"
                    variants={cardVariants}
                    whileHover="hover"
                    custom={index}
                  >
                    {/* Image */}
                    <div className="relative w-full h-52 overflow-hidden">
                      <Image
                        src={blog.image_url || "/placeholder.svg?height=300&width=400"}
                        alt={blog.title || "Blog image"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="line-clamp-2">{blog.title}</span>
                      </h3>

                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <CalendarDays className="w-4 h-4 mr-2 flex-shrink-0" />
                        {format(new Date(blog.created_at), "MMM d, yyyy")}
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex items-start gap-2">
                        <AlignLeft className="w-4 h-4 mt-1 text-blue-400 flex-shrink-0" />
                        <span>{blog.content}</span>
                      </p>

                      <Link
                        href={id ? `/user/${id}/blogdetails/${blog.id}` : `/blog/${blog.id}`}
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:underline group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200"
                      >
                        View Details
                        <ArrowRightCircle className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Blog Stats */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-4 bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {blogs.length} Articles Published
                    </span>
                  </div>
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Updated Weekly</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </motion.div>
  )
}

export default BlogSection
