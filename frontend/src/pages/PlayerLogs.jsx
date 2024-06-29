import React, { useEffect, useState } from "react";
import ClockLoader from 'react-spinners/ClockLoader'
import { useSelector } from "react-redux";
import axios from "axios";

const PlayerLogs = () => {
  const [loading, setLoading] = useState(true);  
  const [logs, setLogs] = useState([]);
  const [noLogs, setnoLogs] = useState(false);

  // username, name, email
  const userData = useSelector((state) => state.UserDetails);

  useEffect(()=>{
    if(userData){
      const getLogs = async () => {
        try{
          const logsRes = await axios.post('/gambit/getlogs/',{
            email : userData.email
          })
          console.log(logsRes);
          if(logsRes.data.logs){
            setLogs(logsRes.data.logs);  
            console.log(logsRes.data.logs);
          }
          setLoading(false);
        }
        catch(err){
          setnoLogs(true);
        }
      }
      getLogs();
    }
  },[])

  if(loading){
    return <div className="ml-[50%] mt-[25%]"><ClockLoader speedMultiplier={4}/></div>;
  }

  if(noLogs){
    return <div>Logs not available at the moment...</div>
  }

  return <div>PlayerLogs</div>;
};

export default PlayerLogs;