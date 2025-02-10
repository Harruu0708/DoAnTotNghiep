import React, { createContext, useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {books} from "../assets/data"


export const ShopContext = createContext()

const ShopContextProvider = (props) => {
    const currency = 'đ'
    const delivery_charges = 5
    const navigate = useNavigate()
    const [token, setToken] = useState("")
    const [cartItems, setCartItems] = useState({})

    //Add items to cart
    const addToCart = async (itemId) =>{
      const cartData= {...cartItems}

      if(cartData[itemId]){
        cartData[itemId]+=1;
      }else{
        cartData[itemId] = 1;
      }
      setCartItems(cartData)

    }
    // useEffect(()=>{
    //   console.log(cartItems)
    // },[cartItems])

    //Get total items in cart
    const getCartCount = () =>{
      let totalCount = 0;
      for (const item in cartItems){
        try{
          if(cartItems[item] > 0){
            totalCount += cartItems[item]
          }
        } catch (error){
          console.log(error)
      }
      
    }
    return totalCount;
  }

  //Get total cart amount
  const getCartAmount = () =>{
    let totalAmount = 0;
    for (const item in cartItems){
        if(cartItems[item] > 0){
          let itemInfo =books.find((book)=> book._id === item)
          if(itemInfo){
            totalAmount += itemInfo.price * cartItems[item]
          }
        }
      }
      return totalAmount;
    }

  // Update the quantity of an item in the cart

  const updateQuantity = async (itemId, quantity) =>{
    const cartData ={...cartItems}
    cartData[itemId] = quantity
    setCartItems(cartData)
  }
    
    const contextValue = {books,currency, navigate, token, setToken, cartItems, setCartItems, addToCart, getCartCount, getCartAmount, updateQuantity, delivery_charges}
  return (
    <ShopContext.Provider value={contextValue}>
        {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider
