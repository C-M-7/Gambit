import { useEffect, useState } from "react"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

function App() {
  const [message, setMessage] = useState('');
  
  useEffect(()=>{
    fetch('/api/hello')
    .then(response => response.json())
    .then(data => setMessage(data.message));
  },[])

  return (
    <>
      <div>{message}</div>
    </>
  )
}

export default App
