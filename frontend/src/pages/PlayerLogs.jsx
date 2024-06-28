import React, { useEffect, useState } from "react";
import ClockLoader from 'react-spinners/ClockLoader'
import { useSelector } from "react-redux";

const PlayerLogs = () => {
  const [loading, setLoading] = useState(true);  
  

  // username, name, email
  const userData = useSelector((state) => state.UserDetails);

  useEffect(()=>{
    if(userData){
      setLoading(false);
    }
  },[userData])

  if(loading){
    return <div className="ml-[50%] mt-[25%]"><ClockLoader speedMultiplier={4}/></div>;
  }

  return <div>PlayerLogs</div>;
};

export default PlayerLogs;