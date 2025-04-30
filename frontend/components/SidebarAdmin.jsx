"use client";

import {
  LayoutGrid,
  List,
  BarChart,
  ShoppingCart,
  Boxes,
  Factory,
  Warehouse,
  FileBarChart,
  ChevronDown,
} from "lucide-react";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

const Sidebar = () => {
    const { id } = useParams();
  const [expanded, setExpanded] = useState({
    Sales: false,
    Purchasing: false,
    Production: false,
    Warehouse: false,
  });

  const toggleExpand = (section) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <aside className="bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 w-64 h-screen py-4 px-3 transition-colors duration-300">
      <nav>
        <motion.a
          className="flex items-center py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
          variants={itemVariants}
        >
          <LayoutGrid className="h-5 w-5 mr-2" />
          Dashboard
        </motion.a>

        <motion.a
          href={`/admin/${id}/dashboard`}
          className="flex items-center py-2 px-3 rounded-md  bg-blue-50 dark:bg-blue-900 text-black hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-200"
          variants={itemVariants}
        >
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Home
        </motion.a>

        <motion.a
          href={`/admin/${id}/users`}
          className="flex items-center py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
          variants={itemVariants}
        >
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
         Users
        </motion.a>

        <motion.a
          href={`/admin/${id}/category`}
          className="flex items-center py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
          variants={itemVariants}
        >
           <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Category
        </motion.a>

        <motion.a
          href={`/admin/${id}/company`}
          className="flex items-center py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
          variants={itemVariants}
        >
        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Company
        </motion.a>

        <motion.a
          href={`/`}
          className="flex items-center py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
          variants={itemVariants}
        >
        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
         Logout
         </motion.a>

        {/* Sales Section */}
        <div className="mt-2">
          <motion.button
            onClick={() => toggleExpand("Sales")}
            className="flex items-center w-full py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 justify-between transition-colors duration-200"
            variants={itemVariants}
          >
            <div className="flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
              Sales
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-200 text-gray-400 dark:text-gray-500 ${
                expanded.Sales ? "rotate-180" : ""
              }`}
            />
          </motion.button>
          {expanded.Sales && (
            <motion.div className="pl-6" variants={itemVariants}>
              <a
                href="#"
                className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
              >
                Overview
              </a>
              <a
                href="#"
                className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
              >
                Orders
              </a>
            </motion.div>
          )}
        </div>

        {/* Purchasing Section */}
        <div className="mt-2">
          <motion.button
            onClick={() => toggleExpand("Purchasing")}
            className="flex items-center w-full py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 justify-between transition-colors duration-200"
            variants={itemVariants}
          >
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
              Purchasing
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-200 text-gray-400 dark:text-gray-500 ${
                expanded.Purchasing ? "rotate-180" : ""
              }`}
            />
          </motion.button>
          {expanded.Purchasing && (
            <motion.div className="pl-6" variants={itemVariants}>
              <a
                href="#"
                className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
              >
                Requests
              </a>
              <a
                href="#"
                className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
              >
                Vendors
              </a>
            </motion.div>
          )}
        </div>

        {/* Production Section */}
        <div className="mt-2">
          <motion.button
            onClick={() => toggleExpand("Production")}
            className="flex items-center w-full py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 justify-between transition-colors duration-200"
            variants={itemVariants}
          >
            <div className="flex items-center">
              <Factory className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
              Production
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-200 text-gray-400 dark:text-gray-500 ${
                expanded.Production ? "rotate-180" : ""
              }`}
            />
          </motion.button>
          {expanded.Production && (
            <motion.div className="pl-6" variants={itemVariants}>
              <a
                href="#"
                className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
              >
                Orders
              </a>
              <a
                href="#"
                className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
              >
                Processes
              </a>
            </motion.div>
          )}
        </div>

        {/* Warehouse Section */}
        <div className="mt-2">
          <motion.button
            onClick={() => toggleExpand("Warehouse")}
            className="flex items-center w-full py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 justify-between transition-colors duration-200"
            variants={itemVariants}
          >
            <div className="flex items-center">
              <Boxes className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
              Warehouse
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-200 text-gray-400 dark:text-gray-500 ${
                expanded.Warehouse ? "rotate-180" : ""
              }`}
            />
          </motion.button>
          {expanded.Warehouse && (
            <motion.div className="pl-6" variants={itemVariants}>
              <a
                href="#"
                className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
              >
                Inventory
              </a>
              <a
                href="#"
                className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
              >
                Locations
              </a>
            </motion.div>
          )}
        </div>

        {/* Reports Section */}
        <motion.a
          href="#"
          className="flex items-center py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
          variants={itemVariants}
        >
          <FileBarChart className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
          Reports
        </motion.a>
      </nav>
    </aside>
  );
};

export default Sidebar;
