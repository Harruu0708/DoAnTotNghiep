import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import Navbar from './Navbar'
import { CgMenuLeft } from 'react-icons/cg'
import {TbUserCircle} from 'react-icons/tb'
import {RiUserLine, RiShoppingBag4Line} from 'react-icons/ri'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { logoutUser } from '../../redux/apiRequest'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'


const Header = () => {
    
    const {navigate, getCartCount} = useContext(ShopContext)
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.login.currentUser);
    const token = user?.accessToken;
    const [active, setActive] = useState(false)
    const [menuOpened, setMenuOpened] = useState(false)
    const toggleMenu = () => {
        setMenuOpened((prev) => !prev)
    }

    const handleLogout = () => {
        logoutUser(dispatch, navigate, token);
    };

    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > 10){
                if(menuOpened){
                    setMenuOpened(false)
                }
            }

            setActive(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [menuOpened])

  return (
    <header className='fixed top-0 w-full left-0 right-0 z-50'>
        <div className={`${active ? 'bg-white py-2.5':'bg-primary py-3'} max-padd-container flexBetween border-b border-slate-900/10 rounded transition-all duration-300`}>
            {/* Logo */}
            <Link to={'/'} className='flex-1 flex items-center justify-start '>
              <img src={logo} alt="" height={36} width={36} className='hidden sm:flex mr-2' />
              <h4 className='bold-24'>Haru</h4>
            </Link>

            {/* Navbar */}
            <div className='flex-1 '>
                <Navbar menuOpened={menuOpened} toggleMenu={toggleMenu} containerStyles={`${menuOpened? "flex flex-col gap-y-16 h-screen w-[222px] absolute left-0 top-0 bg-white z-50 px-10 py-4 shadow-x1" : "hidden xl:flex justify-center gap-x-8 xl:gap-x-14 medium-15 px-2 py-1"}`} />
            </div>

            <div className='flex-1 flex items-center justify-end gap-x-3 sm:gap-x-10 '>
                <CgMenuLeft onClick={toggleMenu} className='text-2xl xl:hidden cursor-pointer' />
                <Link
                    to={token ? 'cart' : '#'}
                    onClick={(e) => {
                        if (!token) {
                        e.preventDefault(); // Ngăn chuyển hướng nếu chưa đăng nhập
                        navigate('/login');
                        }
                    }}
                    className='flex relative'
                >
                    <RiShoppingBag4Line className='text-[33px] bg-secondary text-primary p-1.5 rounded-full ' />
                    <span className='bg-primary ring-1 ring-slate-900/5 medium-14 absolute left-5 -top-2.5 flexCenter w-5 h-5 rounded-full shadow-md '>
                        {getCartCount()}
                    </span>
                </Link>

                <div className='relative group'>
                    <div onClick={() => !token && navigate('/login')}  className=''>
                        {token ? (
                            <div><TbUserCircle className='text-[29px] cursor-pointer'/>Xin chào, <span>{user.others.username}</span> </div>
                        ):(
                        <button className='btn-outline flexCenter gap-x-2'>Đăng nhập <RiUserLine/></button>
                        )}
                    </div>

                    {token && <>
                    <ul className='bg-white p-1 w-32 ring-1 ring-slate-900/5 rounded absolute right-0 top-7 hidden group-hover:flex flex-col regular-14 shadow-md'>
                        <li onClick={() => navigate("/profile")} className='p-2 text-tertiary rounded-md hover:bg-primary cursor-pointer'>Hồ sơ</li>
                        <li onClick={() => navigate("/order")} className='p-2 text-tertiary rounded-md hover:bg-primary cursor-pointer'>Đơn hàng</li>
                        <li onClick={handleLogout} className='p-2 text-tertiary rounded-md hover:bg-primary cursor-pointer'>Đăng xuất</li>
                    </ul>
                    </>}
                </div>
            </div>
        </div>
    </header>
  )
}

export default Header
