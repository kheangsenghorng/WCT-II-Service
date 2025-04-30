"use client";

import { useState, useEffect } from "react";
import {
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
  MoreVertical as MoreVerticalIcon,
} from "lucide-react"; // Import lucide-react icons
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import Calendar from "../../../../components/Calander"; // Import Calendar component
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
const HomePage = () => {
  // Sample Data
  const [stats, setStats] = useState([
    { id: "user", label: "Total User", value: "3,843", change: 25, isPositive: true },
    { id: "company", label: "Total Company", value: "1,700", change: -11, isPositive: false },
    { id: "customer", label: "Total Customer", value: "2,420", change: 20, isPositive: true },
    { id: "order", label: "Total Order Customer", value: "2,530", change: 17, isPositive: true },
  ]);

  const [chartOrder, setChartOrder] = useState(["marketing", "sales"]); // Initial chart order

  // Animation Variants for Stats Cards
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.03, transition: { duration: 0.2 } },
  };

  const handleDragEndStats = (result) => {
    if (!result.destination) return;

    const items = Array.from(stats);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setStats(items);
  };

  const handleDragEndCharts = (result) => {
    if (!result.destination) return;

    const items = Array.from(chartOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setChartOrder(items);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Home</h1>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center transition-colors duration-200">
            <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />
            Support
          </button>
        </header>

        {/* Draggable Stats Cards */}
        <DragDropContext onDragEnd={handleDragEndStats}>
          <Droppable droppableId="stats" direction="horizontal" type="STAT">
            {(provided) => (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {stats.map((stat, index) => (
                  <Draggable key={stat.id} draggableId={stat.id} index={index}>
                    {(provided) => (
                      <motion.div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 cursor-move transition-shadow duration-200"
                        variants={itemVariants} // Apply animation variants
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">{stat.label}</h2>
                          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                            <MoreVerticalIcon className="h-5 w-5" />
                          </button>
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                            <div className="flex items-center text-sm">
                              {stat.isPositive ? (
                                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                              ) : (
                                <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              <span className={stat.isPositive ? "text-green-500" : "text-red-500"}>
                                {Math.abs(stat.change)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Marketing and Sales Reports */}
        <DragDropContext onDragEnd={handleDragEndCharts}>
          <Droppable droppableId="charts" direction="horizontal" type="CHART">
            {(provided) => (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"  {...provided.droppableProps}
                ref={provided.innerRef}>
                {chartOrder.map((chart, index) => (
                    <Draggable key={chart} draggableId={chart} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 cursor-move"
                        >
                          {chart === "marketing" && (
                            <>
                              <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">Marketing Report</h2>
                                <div className="flex items-center">
                                  <span className="mr-2 text-gray-500 dark:text-gray-400 text-sm">Order</span>
                                  <span className="mr-4 text-gray-500 dark:text-gray-400 text-sm">Sells</span>
                                  <select className="border rounded-md p-1 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700">
                                    <option>This Month</option>
                                    <option>Last Month</option>
                                  </select>
                                </div>
                              </div>
                              <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-400 dark:text-gray-500">
                                Marketing Chart Placeholder
                              </div>
                            </>
                          )}
                          {chart === "sales" && (
                            <>
                              <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">Sales Report</h2>
                                <select className="border rounded-md p-1 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700">
                                  <option>This Month</option>
                                  <option>Last Month</option>
                                </select>
                              </div>
                              <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-400 dark:text-gray-500">
                                Sales Doughnut Chart Placeholder
                              </div>
                              <div className="flex justify-around mt-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="inline-flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></span> Online Shop</span>
                                <span className="inline-flex items-center"><span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span> Acquisition</span>
                                <span className="inline-flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> Investing</span>
                                <span className="inline-flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span> Subscription</span>
                                <span className="inline-flex items-center"><span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span> Purchase</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
       
          <div className="py-10">
          <Calendar />
          </div>

      </div>
    </div>
  );
};

export default HomePage;