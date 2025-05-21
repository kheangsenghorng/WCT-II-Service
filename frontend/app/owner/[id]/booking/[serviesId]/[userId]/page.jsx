import React from "react";
import ProfileDetail from "../../../../../../components/ProfileDetail";
import ImageDetail from "@/components/ImgaeDetail";
import UserTourDetail from "@/components/UserTourDetail";
export default function Profile() {
  return (
   
      <div className="   w-[1200px] mx-auto">
        <div className="w-[1200px] flex mx-auto my-2 rounded-xl">
          <ProfileDetail />
          <ImageDetail />
        </div>
        <UserTourDetail />
      </div>

  );
}
