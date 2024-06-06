import React, { createContext, useContext, useState } from 'react'

const SocketContext = createContext();

export const SocketProvider = ({children}) => {
  const [socketContext, setSocketContext] = useState(null);
    return(
        <SocketContext.Provider value={{socketContext, setSocketContext}}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext