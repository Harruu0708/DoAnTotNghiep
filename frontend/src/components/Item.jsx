import React ,{useContext} from 'react'
import {TbShoppingBagPlus} from 'react-icons/tb'
import { ShopContext } from '../context/ShopContext'

const Item = ({book}) => {

  const {currency, addToCart, navigate} = useContext(ShopContext)

  const handleNavigate = () => {
    navigate(`/shop/${book._id}`);
  };
  return (
    <div onClick={handleNavigate} className="cursor-pointer transition-transform duration-300 hover:scale-105">
      <div className='flexCenter bg-primary p-6 rounded-3xl overflow-hidden relative group'>
        <img src={book.image} alt="bookImg" className='w-40 h-60 object-cover shadow-xl shadow-slate-900/30 rounded-lg'/>
      </div>
      <div className='p-3'>
        <div className='flexBetween'>
            <h4 className='h4 line-clamp-1 !my-0'>{book.name}</h4>
            <span onClick={(e) => {
              e.stopPropagation(); // Ngăn chặn sự kiện click lan sang div cha
              addToCart(book);
            }}  className='flexCenter h-8 w-8 rounded cursor-pointer hover:bg-primary'><TbShoppingBagPlus className='text-lg'/></span>
        </div>
        <div className='flexBetween pt-1'>
            <p className='font-bold capitalize'>{book.category}</p>
            <h5 className='h5 text-secondaryOne pr-2'>{book.price} 000{currency}</h5>
        </div>
        <p className='line-clamp-2 py-1'>{book.description}</p>
      </div>
    </div>
  )
}

export default Item
