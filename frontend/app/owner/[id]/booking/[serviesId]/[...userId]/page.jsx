"use client";

import React from "react";
import ProfileDetail from "../../../../../../components/ProfileDetail";
import ImageDetail from "@/components/ImgaeDetail";
import UserTourDetail from "@/components/UserTourDetail";
import { useParams } from "next/navigation";
export default function Profile() {
  const { id, serviesId, userId } = useParams();
  const bookingId = userId?.[1];
  // console.log(id);

  // console.log(serviesId);
  // console.log(userId);

  return (
    <div className="   w-[1200px] mx-auto">
      <div className="w-[1200px] flex mx-auto my-2 rounded-xl">
        <ProfileDetail userId={userId?.[1]} />
        <ImageDetail userId={userId?.[1]} />
      </div>
      <UserTourDetail
        userId={userId?.[0]}
        serviesId={serviesId}
        bookingId={bookingId}
      />
    </div>
  );
}
