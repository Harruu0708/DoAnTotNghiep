import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import Footer from '../components/Footer'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

const PlaceOrder = () => {


    const [method, setMethod] = useState('cod')
    const [userInfo, setUserInfo] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
    })
    const user = useSelector((state) => state.auth.login.currentUser);
    const token = user?.accessToken;

    useEffect(() => {
        const fetchUserInfo = async () => {
          try {
            const res = await axios.get('http://localhost:8000/api/user/info', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            const user = res.data.user
            setUserInfo({
              fullName: user.fullname || '',
              phone: user.phone || '',
              email: user.email || '',
              address: user.address || '',
            })
          } catch (err) {
            console.error('Lỗi khi lấy thông tin người dùng:', err)
          }
        }
      
        if (token) {
          fetchUserInfo()
        }
    }, [token])
      
  return (
    <section className='max-padd-container'>
      <form className='pt-28'>
        <div className='flex flex-col xl:flex-row gap-20 xl:gap-28'>
          {/* Left */}
          <div className='flex flex-1 flex-col gap-3 text-[95%]'>
            <Title title1={'Delivery'} title2={'Information'} title1Styles={'h3'} />

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={userInfo.fullName}
              onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none w-full"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={userInfo.phone}
              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none w-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none w-full"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address (Street, District, City)"
              value={userInfo.address}
              onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none w-full"
              required
            />
          </div>

          {/* Right */}
          <div className='flex flex-1 flex-col'>
            <CartTotal />

            {/* Payment */}
            <div className='my-6'>
              <h3 className='bold-20 mb-5'>
                Payment <span className='text-secondary'>Phương thức</span>
              </h3>
              <div className='flex gap-3'>
                <div
                  onClick={() => setMethod('stripe')}
                  className={`${method === 'stripe' ? 'btn-secondary' : 'btn-white'} !py-1 text-xs cursor-pointer`}
                >
                  Momo
                </div>
                <div
                  onClick={() => setMethod('cod')}
                  className={`${method === 'cod' ? 'btn-secondary' : 'btn-white'} !py-1 text-xs cursor-pointer`}
                >
                  Tiền mặt
                </div>
              </div>
            </div>

            <div>
              <button type="submit" className="btn-secondaryOne">
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </form>
      <Footer />
    </section>
  )
}

export default PlaceOrder
