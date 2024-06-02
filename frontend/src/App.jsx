import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Playground from "./pages/Playground.jsx";
import Home from "./pages/Home.jsx";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const router = createBrowserRouter([
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/signin",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/playground",
    element: <Playground />,
  },
]);

function App() {
  console.log("app");
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);

  useEffect(()=>{
    const token = Cookies.get('token');
    if(token){
      const socketInstance = io('http://localhost:7000',{
        auth: {
          token: token,
        }
      })
      
    }
    else{
      toast.warning('Please SignIn before accessing Gambit!');
      navigate('/signin');
    }
  })

  return <RouterProvider router={router} />;
}

export default App;
