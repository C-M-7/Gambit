import React, { useState } from 'react';
import history_logs from '../utils/history-logs.svg'
import PlayerLogs from '../pages/PlayerLogs';

const ProfileNavigations = () =>{
    const [navigate, setnavigate] = useState('logs');

    return(
        <div className='flex flex-col items-center'>
            <div className='flex'>
                <button className='border p-3 flex items-center' onClick={() => {setnavigate('logs')}}><img className='h-6 w-6 mr-1' src={history_logs}/> Logs</button>
                <button className='border p-2' onClick={() =>{setnavigate('profile')}}>Profile</button>
            </div>
            {
                navigate === 'logs'
                ?
                <div className='mt-10'><PlayerLogs/></div>
                :
                <div className='mt-10'>Profile</div>
            }           
        </div>
    )
}

export default ProfileNavigations;