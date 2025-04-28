import React from 'react'
import {Route, Routes} from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Review from './pages/Review'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const App = () => {
  return (
    <main>
      <ToastContainer />
      <div className='bg-primary text-[#404040]'>
        <div className='mx-auto max-w-[1440px] flex flex-col sm:flex-row'>
          <Sidebar />
          <Routes>
            <Route path="/" element={<PrivateRoute>
                  <Dashboard />
                </PrivateRoute>} />
            <Route path="/add" element={<PrivateRoute>
                  <Add />
                </PrivateRoute>} />
            <Route path="/list" element={ <PrivateRoute>
                  <List />
                </PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute>
                  <Orders />
                </PrivateRoute>} />
            <Route path="/reviews" element={<PrivateRoute>
                  <Review />
                </PrivateRoute>} />
            <Route path="/login" element={<Login/>} />
          </Routes>
        </div>
      </div>
    </main>
  )
}

export default App