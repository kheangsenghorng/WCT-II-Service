"use client";

import { useState, useEffect } from "react";
import {
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
  MoreVertical as MoreVerticalIcon,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import Calendar from "../../../../components/Calander";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { useParams } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useCategoryStore } from "@/store/useCateroyStore";
import { useTypeStore } from "@/store/useTypeStore";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const HomePage = () => {
  const { id: ownerId } = useParams();
  const { fetchAdminUsers, count, users } = useUserStore();
  const { fetchCategories, categories } = useCategoryStore();
  const { fetchAllUserTypes, userTypes, loading } = useTypeStore();
  const totalOwners =
    users?.filter((user) => user.role === "owner").length || 0;

  const [chartOrder, setChartOrder] = useState(["marketing", "sales"]);

  const barData = {
    labels: ["Users", "category", "type", "owner"],
    datasets: [
      {
        label: "Total",
        data: [
          count || 0,
          categories?.length || 0,
          userTypes?.length || 0,
          totalOwners || 0,
        ],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  // Doughnut for sales segments
  const doughnutData = {
    labels: [
      "Online Shop",
      "Acquisition",
      "Investing",
      "Subscription",
      "Purchase",
    ],
    datasets: [
      {
        label: "Sales",
        data: [10, 5, 3, 7, 2], // Example values
        backgroundColor: [
          "#facc15", // yellow
          "#f97316", // orange
          "#ef4444", // red
          "#3b82f6", // blue
          "#a855f7", // purple
        ],
      },
    ],
  };

  const doughnutOptions = {
    cutout: "70%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#9ca3af", // gray-400
        },
      },
    },
  };

  // Fetch users on mount or when ownerId changes
  useEffect(() => {
    if (ownerId) {
      fetchAdminUsers();
      fetchCategories();
      fetchAllUserTypes(); // <-- Add this
    }
  }, [fetchAdminUsers, fetchCategories, fetchAllUserTypes]);

  // Stats data (derived from store)
  const [stats, setStats] = useState([
    {
      id: "user",
      label: "Total User",
      value: 0,
      change: 25,
      isPositive: true,
    },
    {
      id: "category",
      label: "Total category",
      value: 0,
      change: 12,
      isPositive: true,
    },
    {
      id: "type",
      label: "Total Type",
      value: 0,
      change: 20,
      isPositive: true,
    },
    {
      id: "owner",
      label: "Total Owners",
      value: 0,
      change: 10,
      isPositive: true,
    },
  ]);

  // Update stats when count changes
  useEffect(() => {
    const totalOwners =
      users?.filter((user) => user.role === "owner").length || 0;
    setStats((prev) =>
      prev.map((stat) => {
        if (stat.id === "user") return { ...stat, value: count || 0 };
        if (stat.id === "category")
          return { ...stat, value: categories?.length || 0 };
        if (stat.id === "type")
          return { ...stat, value: userTypes?.length || 0 };
        if (stat.id === "owner") return { ...stat, value: totalOwners };
        return stat;
      })
    );
  }, [count, categories, userTypes, users]);

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.03, transition: { duration: 0.2 } },
  };

  const handleDragEndStats = (result) => {
    if (!result.destination) return;
    const items = [...stats];
    const [movedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, movedItem);
    setStats(items);
  };

  const handleDragEndCharts = (result) => {
    if (!result.destination) return;
    const items = [...chartOrder];
    const [movedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, movedItem);
    setChartOrder(items);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Home
          </h1>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center transition-colors duration-200">
            <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />
            Support
          </button>
        </header>

        {/* Stats Cards */}
        <DragDropContext onDragEnd={handleDragEndStats}>
          <Droppable droppableId="stats" direction="horizontal" type="STAT">
            {(provided) => (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {stats.map((stat, index) => (
                  <Draggable key={stat.id} draggableId={stat.id} index={index}>
                    {(provided) => (
                      <motion.div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 cursor-move"
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                            {stat.label}
                          </h2>
                          <MoreVerticalIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-3xl font-bold text-gray-800 dark:text-white">
                            {stat.value}
                          </p>
                          <div className="flex items-center text-sm">
                            {stat.isPositive ? (
                              <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                              <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            <span
                              className={`${
                                stat.isPositive
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {Math.abs(stat.change)}%
                            </span>
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

        {/* Chart Components */}
        <DragDropContext onDragEnd={handleDragEndCharts}>
          <Droppable droppableId="charts" direction="horizontal" type="CHART">
            {(provided) => (
              <div
                className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
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
                            <div className="flex justify-between mb-4">
                              <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                                Total Report
                              </h2>
                              <select className="border rounded-md p-1 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700">
                                <option>This Month</option>
                                <option>Last Month</option>
                              </select>
                            </div>
                            <div className="h-64">
                              <Bar data={barData} options={barOptions} />
                            </div>
                          </>
                        )}
                        {chart === "sales" && (
                          <>
                            <div className="flex justify-between mb-4">
                              <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                                Sales Report
                              </h2>
                              <select className="border rounded-md p-1 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700">
                                <option>This Month</option>
                                <option>Last Month</option>
                              </select>
                            </div>
                            <div className="h-64">
                              <Doughnut
                                data={doughnutData}
                                options={doughnutOptions}
                              />
                            </div>

                            <div className="flex justify-around mt-4 text-sm text-gray-600 dark:text-gray-400">
                              {[
                                ["bg-yellow-400", "Online Shop"],
                                ["bg-orange-500", "Acquisition"],
                                ["bg-red-500", "Investing"],
                                ["bg-blue-500", "Subscription"],
                                ["bg-purple-500", "Purchase"],
                              ].map(([color, label]) => (
                                <span
                                  key={label}
                                  className="inline-flex items-center"
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full mr-1 ${color}`}
                                  ></span>
                                  {label}
                                </span>
                              ))}
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

        {/* Calendar Section */}
        {/* <div className="py-10">
          <Calendar />
        </div> */}
      </div>
    </div>
  );
};

export default HomePage;
