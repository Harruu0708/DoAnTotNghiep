import React from 'react'
import {Route, Routes} from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'

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
            <Route path="/" element={<Add/>} />
            <Route path="/list" element={<List/>} />
            <Route path="/orders" element={<Orders/>} />
          </Routes>

        </div>
      </div>
    </main>
  )
}

export default App
App