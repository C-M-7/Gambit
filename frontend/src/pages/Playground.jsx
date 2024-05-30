import React from 'react'
import { useLocation } from 'react-router-dom'

function Playground() {
  const location = useLocation();
  const {gameId} = location.state || {};

  return (
    <>
        <div>playground</div>
        <div>{gameId}</div>
    </>

  )
}

export default Playground