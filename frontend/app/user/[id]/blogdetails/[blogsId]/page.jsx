"use client";

import BlogDetails from "@/components/BlogDetails";
import React from "react";
import { useParams } from "next/navigation";

export default function DetailsBlog() {
  const { id } = useParams(); // ✅ safely extract id from route

  if (!id) {
    return <div className="text-red-500 text-center py-10">Blog ID is missing</div>;
  }

  return (
    <div>
      <BlogDetails id={id} /> {/* ✅ pass just the ID */}
    </div>
  );
}
