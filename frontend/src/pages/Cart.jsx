import React, { useContext } from 'react'
import {TbTrash} from 'react-icons/tb'
import {FaMinus, FaPlus} from 'react-icons/fa6'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import CartTotal from '../components/CartTotal'
import Footer from '../components/Footer'

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Cart = () => {
  const {books, navigate, currency, cartItems, removeFromCart, updateQuantity, checkProductAvailabilityBeforeCheckout } = useContext(ShopContext)
   // Tính tổng số sản phẩm thật sự trong tất cả cart
  const totalProductCount = cartItems.reduce((acc, cart) => acc + cart.products.length, 0);

  return (
    <section className='max-padd-container'>
      <div className='pt-28'>
        {/* <!-- Title --> */}
        <Title title1='Danh sách' title2={'Giỏ hàng'} title1Styles={'h3'}  />
        {/* <!-- Cart Items --> */}
        {/* Cart Items */}
        <div className='mt-6'>
          {totalProductCount === 0 ? (
            <p className='text-center text-lg mt-10'>Giỏ hàng của bạn đang trống.</p>
          ) : (
            cartItems.map((cart) => (
              <div key={cart._id} className='bg-white p-2 mt-3 rounded-lg'>
                {cart.products.map((item) => (
                  <div key={item._id} className='flex gap-x-3 mb-4'>
                    <div className='flex items-start gap-6'>
                      <img src={item.productId.image} alt="itemImg" className='w-16 h-16 object-cover rounded' />
                    </div>
                    <div className='flex flex-col w-full'>
                      <h5 className='h5 !my-0 line-clamp-1'>{item.productId.name}</h5>
                      <div className='flex items-start justify-between'>
                        <div>
                          <p className='mb-1.5'>{item.productId.category}</p>
                          <div className='flex items-center ring-1 ring-slate-900/5 rounded-full overflow-hidden bg-primary'>
                            <button
                              onClick={() => updateQuantity(item.productId._id, -1)}
                              className='p-1.5 bg-white rounded-full shadow-md'>
                              <FaMinus className='text-xs' />
                            </button>
                            <p className='px-2'>{item.quantity}</p>
                            <button
                              onClick={() => updateQuantity(item.productId._id, 1)}
                              className='p-1.5 bg-white rounded-full shadow-md'>
                              <FaPlus className='text-xs' />
                            </button>
                          </div>
                        </div>
                        <h4 className='h4'>{((item.productId.discount_price > 0 ? item.productId.discount_price : item.productId.price) * 1000).toLocaleString('vi-VN')} {currency}</h4>
                        <TbTrash
                          onClick={() => removeFromCart(item.productId)}
                          className='cursor-pointer text-xl text-secondary' />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Total + Button */}
        {totalProductCount > 0 && (
          <div className='flex mt-20'>
            <div className='w-full sm:w-[450px]'>
              <CartTotal />
              <button onClick={async () => {
                const result = await checkProductAvailabilityBeforeCheckout();
                  if (result.success) {
                    navigate('/place-order');
                  } else {
                    toast.error(result.message + (result.insufficientProducts?.length
                      ? `\nChi tiết: ${result.insufficientProducts.map(p => `${p.name || 'SP'} (còn: ${p.available}, yêu cầu: ${p.requested})`).join(', ')}`
                      : '')
                    );
                  }
                  }}
                 className='btn-secondaryOne mt-7'>
                Thanh toán
              </button>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </section>
  )
}

export default Cart
