import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import {Toaster} from 'sonner'
import Playground from './pages/Playground.jsx'

const router = createBrowserRouter([
  {
    path : '/',
    element : <App/>
  },
  {
    path : '/signin',
    element : <Login/>
  },
  {
    path : '/signup',
    element : <Signup/>
  },
  {
    path : '/playground',
    element : <Playground/>
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Toaster position="bottom-center"/>
    <RouterProvider router={router} />
  </>
  
)
