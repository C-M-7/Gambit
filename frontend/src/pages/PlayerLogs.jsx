import React, { useEffect, useState } from "react";
import ClockLoader from 'react-spinners/ClockLoader'
import { useSelector } from "react-redux";
import LogDiv from "../components/LogDiv";
import api from "../api";
import nextPage from '../utils/next-page-svg.svg';
import prevPage from '../utils/prev-page-repo.svg';

const PlayerLogs = () => {
  const [loading, setLoading] = useState(true);  
  const [logs, setLogs] = useState([]);
  const [noLogs, setnoLogs] = useState(false);
  const [pageNum, setPageNum] = useState(1);

  // username, name, email
  const userData = useSelector((state) => state.UserDetails);

  useEffect(()=>{
    if(userData){
      const getLogs = async () => {
        try{
          setLoading(true);
          const logsRes = await api.post('/gambit/getlogs/',{
            email : userData.email, 
            pageNum : pageNum
          })
          if(logsRes.data.status){
            setnoLogs(false);
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
  },[pageNum])

  const handlePageDecrease = () =>{
    if(pageNum > 1){
      setPageNum(pageNum-1);
    }
  }

  const handlePageIncrease = () =>{
    if(!noLogs){
      setPageNum(pageNum+1);
    }
  }

  if(loading){
    return <div className="ml-[50%] mt-[25%]"><ClockLoader speedMultiplier={3}/></div>;
  }

  return(
  <>
    <div className="flex -ml-24 justify-around font-bold mb-3">
      <div>Result</div>
      <div>Opponent</div>
      <div>GameId</div>
      <div>PlayedAt</div>
    </div>
    {
      loading 
      ?
      <div className="ml-[50%] mt-[25%]"><ClockLoader speedMultiplier={3}/></div>
      :
      <div className="flex flex-col items-center space-y-2 mb-7">
        {
          logs.length > 0 &&
          logs.reverse() &&
          logs.map((item, index)=>{
            return <LogDiv key={index} data={item} user={userData}/>
          })
        }
      </div>
    }
    <div className="flex justify-center items-center space-x-3 mb-10">
      <img src={prevPage} className="w-4 h-4 cursor-pointer" onClick={handlePageDecrease}/>
      <div className="font-bold">PageNumber : {pageNum}</div>
      <img src={nextPage} className="w-4 h-4 cursor-pointer" onClick={handlePageIncrease}/>
    </div>
  </>
  );
};

export default PlayerLogs;