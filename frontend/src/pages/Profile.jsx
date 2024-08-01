import React from "react";
import { useSelector } from "react-redux";
import ProfileNavigations from "../components/ProfileNavigations";

const Profile = () => {
  const userData = useSelector((state) => state.UserDetails); 

  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="flex justify-evenly mt-36 space-x-96">
          <div>
          <div className="font-bold text-xl">~{userData.username}</div>
          <div>{userData.email}</div>
          </div>
          <div>Add Image</div>
        </div>
        <div className="mt-16">
          <ProfileNavigations />
        </div>
      </div>
    </div>
  );
};

export default Profile;
