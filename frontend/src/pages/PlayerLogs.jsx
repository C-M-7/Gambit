import React, { useEffect, useState } from "react";
import ClockLoader from 'react-spinners/ClockLoader'
import { useSelector } from "react-redux";
import LogDiv from "../components/LogDiv";
import api from "../api";

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
          const logsRes = await api.post('/gambit/getlogs/',{
            email : userData.email
          })
          if(logsRes.data.status){
            setLogs(logsRes.data.logs);  
          }
          else{
            setnoLogs(true);  
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
    return <div className="ml-[50%] mt-[25%]"><ClockLoader speedMultiplier={3}/></div>;
  }

  if(noLogs){
    return <div>Logs not available at the moment...</div>
  }

  return(
  <>
    <div className="flex flex-col items-start ml-[20%] space-y-10 mb-10">
      <div className="font-bold text-4xl my-10">Logs</div>
      {
        logs.length > 0 &&
        logs.reverse() &&
        logs.map((item, index)=>{
          return <LogDiv key={index} data={item} user={userData}/>
        })
      }
    </div>
  </>
  );
};

export default PlayerLogs;