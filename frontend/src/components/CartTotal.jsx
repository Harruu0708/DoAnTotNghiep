import React, { useContext } from 'react'
import Title from './Title'
import { ShopContext } from '../context/ShopContext'

const CartTotal = () => {
    const { currency, getCartAmount, delivery_charges } = useContext(ShopContext)

    const formattedAmount = (amount) => (amount * 1000).toLocaleString('vi-VN');

    return (
        <div className='w-full'>
            {/* <!-- Title --> */}
            <Title title1='Tổng' title2={'giỏ hàng'} title1Styles={'h3'} />
            
            <div className='flexBetween pt-3'>
                <h5 className='h5'>Tổng phụ:</h5>
                <p className='h5'>{formattedAmount(getCartAmount())} {currency}</p>
            </div>
            <hr className='mx-auto h-[1px] w-full bg-gray-900/10 my-1 '/>

            <div className='flexBetween pt-3'>
                <h5 className='h5'>Tiền ship:</h5>
                <p className='h5'>{getCartAmount() === 0 ? "0.00 đ" : formattedAmount(delivery_charges)} {currency}</p>
            </div>
            <hr className='mx-auto h-[1px] w-full bg-gray-900/10 my-1 '/>

            <div className='flexBetween pt-3'>
                <h5 className='h5'>Tổng:</h5>
                <p className='h5'>{getCartAmount() === 0 ? "0" : formattedAmount(getCartAmount() + delivery_charges)} {currency}</p>
            </div>
            <hr className='mx-auto h-[1px] w-full bg-gray-900/10 my-1 '/>
        </div>
    )
}

export default CartTotal
