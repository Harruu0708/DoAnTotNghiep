import React, { useContext, useState, useEffect } from 'react'
import Title from './Title'
import {ShopContext} from '../context/ShopContext'
import Item from './Item'
import axios from 'axios';
const PopularBooks = () => {
  const [popularBooks, setPopularBooks] = useState([])
  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/product/popular"); 
        setPopularBooks(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sách phổ biến:", error);
      }
    };

    fetchPopularBooks();
  }, []);
  return (
    <section className='max-padd-container py-16 bg-white '>
      <Title title1={"Sách"} title2={"Phổ biến"} titleStyles={'pb-10'} paraStyles={'!block'} />
      {/* <!-- container --> */}
      <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10'>
        {popularBooks.map(book=>(
          <div key={book._id}>
            <Item book={book}/>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PopularBooks
