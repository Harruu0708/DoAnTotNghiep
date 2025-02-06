import React, { createContext } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {books} from "../assets/data"


export const ShopContext = createContext()

const ShopContextProvider = (props) => {
    const currency = '$'
    const navigate = useNavigate()
    const [token, setToken] = useState("")
    
    const contextValue = {books,currency, navigate, token, setToken}
  return (
    <ShopContext.Provider value={contextValue}>
        {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider
