import React, { createContext, useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {books} from "../assets/data"
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';


export const ShopContext = createContext()

const ShopContextProvider = (props) => {
    const currency = 'đ'
    const delivery_charges = 20
    const navigate = useNavigate()
    const [cartItems, setCartItems] = useState([]);
    const [token, setToken] = useState('')
    const tokenFromRedux = useSelector((state) => state.auth.login.currentUser?.accessToken);
      // Lấy token từ ReduxS
      useEffect(() => {
        if (tokenFromRedux) {
            setToken(tokenFromRedux);
        }
    }, [tokenFromRedux]); 

  

     // Lấy giỏ hàng từ API
     useEffect(() => {
      if (token) {
          const fetchCart = async () => {
              try {
                  const response = await axios.get('http://localhost:8000/api/cart', {
                      headers: {
                          Authorization: `Bearer ${token}`, // Gửi token trong header
                      },
                  });
                  setCartItems(response.data); // Cập nhật giỏ hàng
              } catch (error) {
                  console.error('Failed to fetch cart:', error);
              }
          };
          fetchCart(); // Gọi API để lấy giỏ hàng
      }
  }, [token]); // Chạy lại mỗi khi token thay đổi
      
      //Add items to cart
      const addToCart = async (book) => {
        try {
            // Gửi yêu cầu tới API để thêm sản phẩm vào giỏ hàng
            const response = await axios.post('http://localhost:8000/api/cart/add', 
            {
                productId: book._id,
                quantity: 1, // Số lượng mặc định là 1 nếu không có
            }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token để xác thực người dùng
                }
            });
            // Cập nhật giỏ hàng trong state
            const updatedCart = await axios.get('http://localhost:8000/api/cart', {
              headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(updatedCart.data); // Cập nhật giỏ hàng từ phản hồi API
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
      };      

    //Get total items in cart
    const getCartCount = () => {
      if (!cartItems || !Array.isArray(cartItems)) return 0; // Kiểm tra cartItems
    
      return cartItems.reduce((total, item) => {
          if (!item.products || !Array.isArray(item.products)) return total; // Kiểm tra item.products
          return total + item.products.reduce((productTotal, product) => productTotal + product.quantity, 0);
      }, 0);
    };
    
    

    //Get total cart amount
    const getCartAmount = () => {
      return cartItems.reduce((total, item) => {
          return total + item.products.reduce((productTotal, product) => 
              productTotal + product.productId.price * product.quantity, 0);
      }, 0);
    };
  

  // Update the quantity of an item in the cart

  const updateQuantity = async (productId, change) => {
    try {
      // Gửi request tới API để cộng/trừ quantity
      await axios.put(
        'http://localhost:8000/api/cart/update',
        {
          productId,
          quantity: change  // Số lượng muốn tăng/giảm
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      // Sau khi update thành công, lấy lại giỏ hàng mới
      const updatedCart = await axios.get('http://localhost:8000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(updatedCart.data);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  

  const removeFromCart = async (productId) => {
    try {
      // Gửi yêu cầu DELETE tới API để xóa sản phẩm khỏi giỏ hàng
      const response = await axios.delete('http://localhost:8000/api/cart/remove', {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header để xác thực người dùng
        },
        data: { productId } // Dữ liệu cần gửi đi (productId của sản phẩm cần xóa)
      });
  
      // Cập nhật giỏ hàng sau khi xóa sản phẩm
       // Cập nhật giỏ hàng trong state
      const updatedCart = await axios.get('http://localhost:8000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(updatedCart.data); // Cập nhật giỏ hàng từ phản hồi API // Cập nhật giỏ hàng từ phản hồi API
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };
    
    const contextValue = {books,currency, navigate, token, setToken,cartItems, setCartItems, addToCart, getCartCount, getCartAmount, updateQuantity, removeFromCart, delivery_charges}
  return (
    <ShopContext.Provider value={contextValue}>
        {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider
