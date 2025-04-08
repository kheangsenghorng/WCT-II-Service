"use client"; // must be the very first line

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Calendar,
  Globe,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSeoSettingsStore } from "@/store/seoSettingStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SEOPreview() {
  const {
    seoSettings,
    loading,
    error,
    successMessage,
    updateSeoSettings,
    setSeoSettings,
  } = useSeoSettingsStore(); // Use the Zustand store

  const [titleCount, setTitleCount] = useState(0);
  const [descriptionCount, setDescriptionCount] = useState(0);

  // Fetch SEO settings on component mount
  useEffect(() => {
    const fetchSeoSettingsData = async () => {
      try {
        const response = await fetch(`${API_URL}/seo-settings`); // Ensure CORS is enabled on the backend
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSeoSettings(data);
      } catch (err) {
        console.error("Fetch SEO settings error:", err);
      }
    };

    fetchSeoSettingsData();
  }, [setSeoSettings]);

  // Update counts when SEO settings change
  useEffect(() => {
    setTitleCount(seoSettings.title.length);
    setDescriptionCount(seoSettings.description.length);
  }, [seoSettings.title, seoSettings.description]);

  // Auto-generate slug when title changes
  useEffect(() => {
    const newSlug = seoSettings.title.replace(/\s+/g, "-").toLowerCase();
    setSeoSettings((prev: typeof seoSettings) => ({ ...prev, slug: newSlug }));
  }, [seoSettings.title, setSeoSettings]);

  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSeoSettings((prev: typeof seoSettings) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await updateSeoSettings(seoSettings); // This will call the update function in your store
  };

  return (
    <motion.div
      className="container mx-auto p-8 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-xl"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.5, staggerChildren: 0.2 },
        },
      }}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        SEO Preview Tool
      </h1>

      {successMessage && (
        <motion.div
          className="fixed top-4 right-4 bg-green-100 border border-green-500 text-green-700 py-3 px-4 rounded-md shadow-md z-50 flex items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          {successMessage}
        </motion.div>
      )}

      {error && (
        <motion.div
          className="fixed top-4 right-4 bg-red-100 border border-red-500 text-red-700 py-3 px-4 rounded-md shadow-md z-50 flex items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </motion.div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        <motion.div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Edit SEO Details
          </h2>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="title"
                  className="text-gray-700 dark:text-gray-300 font-semibold"
                >
                  Page Title
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      The title that appears in search results. Aim for 50-60
                      characters.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="title"
                name="title"
                value={seoSettings.title}
                onChange={handleInputChange}
                placeholder="Enter page title"
                maxLength={70}
              />
              <p
                className={`text-xs ${
                  titleCount > 60 ? "text-red-500" : "text-gray-500"
                }`}
              >
                {titleCount}/70 characters{" "}
                {titleCount > 60 && "(Recommended: 50-60 characters)"}
              </p>
            </div>

            {/* Slug */}
            <div>
              <Label
                htmlFor="slug"
                className="text-gray-700 dark:text-gray-300 font-semibold"
              >
                URL Slug
              </Label>
              <div className="flex items-center">
                <span className="bg-gray-200 dark:bg-gray-700 px-3 py-2 text-sm border border-r-0 rounded-l-md text-gray-500">
                  {seoSettings.domain}/
                </span>
                <Input
                  id="slug"
                  name="slug"
                  value={seoSettings.slug}
                  onChange={handleInputChange}
                  className="rounded-l-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label
                htmlFor="description"
                className="text-gray-700 dark:text-gray-300 font-semibold"
              >
                Meta Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={seoSettings.description}
                onChange={handleInputChange}
                placeholder="Enter meta description"
                maxLength={160}
                rows={4}
              />
              <p
                className={`text-xs ${
                  descriptionCount > 155 ? "text-red-500" : "text-gray-500"
                }`}
              >
                {descriptionCount}/160 characters{" "}
                {descriptionCount > 155 && "(Recommended: 120-155 characters)"}
              </p>
            </div>

            {/* Domain */}
            <div>
              <Label
                htmlFor="domain"
                className="text-gray-700 dark:text-gray-300 font-semibold"
              >
                Domain
              </Label>
              <Input
                id="domain"
                name="domain"
                value={seoSettings.domain}
                onChange={handleInputChange}
                placeholder="example.com"
              />
            </div>

            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.div>

        {/* Right Preview Column */}
        <motion.div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Search Preview
          </h2>
          <Tabs defaultValue="desktop" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="desktop">Desktop</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>
            <TabsContent value="desktop">
              <Card className="p-6 max-w-[600px] bg-white dark:bg-gray-800 border shadow">
                <div className="space-y-2">
                  <div className="text-sm text-green-500 truncate">
                    {seoSettings.domain}/{seoSettings.slug}
                  </div>
                  <h3 className="text-blue-500 text-xl hover:underline truncate">
                    {seoSettings.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {seoSettings.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1 pt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate()}</span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="mobile">
              <motion.div>
                <Card className="p-6 max-w-[400px] shadow-md border dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="space-y-2">
                    <div className="flex items-center text-xs">
                      <Globe className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
                      <span className="text-green-500 truncate max-w-[350px]">
                        {seoSettings.domain}/{seoSettings.slug}
                      </span>
                    </div>
                    <h3 className="text-blue-500 text-lg hover:underline cursor-pointer truncate max-w-[400px]">
                      {seoSettings.title || "Page Title"}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {seoSettings.description ||
                        "This is where your meta description will appear in search results."}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1 pt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate()}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
}
