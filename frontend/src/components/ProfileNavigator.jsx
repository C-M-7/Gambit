import React from "react";
import history from '../utils/svgs/history.svg'
import profile from '../utils/svgs/profile.svg'
import { useState } from "react";
import ProfileHistory from "./ProfileHistory";
import ProfileDetails from "./ProfileDetails";

const ProfileNavigator = () => {
  const [selected, setSelected] = useState('hist');

  return (
    <div>
      <div className="flex space-x-10 items-center">
        <button className="flex border-2 p-3 space-x-1 items-center shadow-lg rounded-md" onClick={()=>{setSelected('hist')}}>
          <img src={history} className="w-5 h-5"/>
          <span className="text-lg font-bold ">History</span>
        </button>
        <button className="flex border-2 p-3 space-x-1 items-center shadow-lg rounded-md" onClick={()=>{setSelected('prof')}}>
          <img src={profile} className="w-5 h-5"/>
          <span className="text-lg font-bold ">Profile</span>
        </button>
      </div>
      <div className="flex items-center">
      {
        selected === 'hist' 
        ?
        <ProfileHistory/>
        :
        <ProfileDetails/>
      }
      </div>
    </div>
  );
};

export default ProfileNavigator;
