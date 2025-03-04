import React from 'react'
import { books } from '../assets/data'
import {TbTrash} from 'react-icons/tb'

const List = () => {

  const List = books
  return (
    <div className='px-2 sm:px-8 mt-4 sm:mt-14'>
      <div className='flex flex-col gap-2'>
        <div className='grid grid-cols-[1fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3.5fr_1.5fr_1fr_1fr] items-center py-1 px-2 bg-white bold-14 sm:bold-15 mb-1 rounded'>
          <h5>Ảnh</h5>
          <h5>Tên</h5>
          <h5>Thể loại</h5>
          <h5>Giá</h5>
          <h5>Xóa</h5>
        </div>
        {/* product list */}
        {List.map((item) =>(
          <div key={item._id} className='grid grid-cols-[1fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3.5fr_1.5fr_1fr_1fr] items-center gap-2 p-1 py-1 px-2 bg-white rounded-xl' >
            <img src={item.image} alt="" className='w-12 rounded-lg' />
            <h5 className='text-sm font-semibold'>{item.name}</h5>
            <p className='font-semibold' >{item.category}</p>
            <div className='text-sm font-semibold'>{item.price} 000 đ</div>
            <div className='text-right md:text-center cursor-pointer text-lg'><TbTrash/></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default List
