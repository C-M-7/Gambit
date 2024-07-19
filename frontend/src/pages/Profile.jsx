import React from "react";
import { useSelector } from "react-redux";
// import ProfileNavigator from "../components/ProfileNavigator";

const Profile = () => {
  const userData = useSelector((state) => state.UserDetails);

  return (
    <div>
      <div className="flex justify-evenly mt-36">
        <div className="flex flex-col">
          <span className="text-3xl font-bold">{userData.name}</span>
          <span className="text-gray-400">~{userData.username}</span>
        </div>
        <div>
            <div>Add Image</div>
        </div>
      </div>
      <div className="flex flex-col items-center mt-10">
        {/* <ProfileNavigator/>  */}
      </div>
    </div>
  );
};

export default Profile;
