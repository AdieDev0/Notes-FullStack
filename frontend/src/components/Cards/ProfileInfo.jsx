import React from "react";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    <div className="flex gap-4">
      <div className="h-10 w-10 md:w-12 md:h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {getInitials(userInfo?.fullName)}
      </div>
      <div>
        <p className="text-sm font-semibold font-Parkinsans">
          {userInfo?.fullName}
        </p>
        <button className="text-sm font-Parkinsans text-slate-700 underline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
