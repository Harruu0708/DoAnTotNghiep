import React from 'react'
import filter from '../assets/features/filter.png'
import rating from '../assets/features/rating.png'
import wishlist from '../assets/features/wishlist.png'
import secure from '../assets/features/secure.png'

const Features = () => {
  return (
    <section className='max-padd-container py-16'>
      <div className='max-padd-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 '>
        <div className='flexCenter flex-col gap-3'>
          <img src={filter} alt="featuresIcon" height={44} width={44} className=''/>
          <div className='flexCenter flex-col'>
            <h5>Advance Search and Filters</h5>
            <hr className='w-8 bg-secondary h-1 rounded-full'/>
          </div>
          <p className='text-center'>Effortlessly search books by title, author, genre, or price range.</p>
        </div>

        <div className='flexCenter flex-col gap-3'>
          <img src={rating} alt="featuresIcon" height={44} width={44} className=''/>
          <div className='flexCenter flex-col'>
            <h5>User Reviews and Ratings</h5>
            <hr className='w-8 bg-secondary h-1 rounded-full'/>
          </div>
          <p className='text-center'>Customers can share reviews, rate books, and guide future readers</p>
        </div>

        <div className='flexCenter flex-col gap-3'>
          <img src={wishlist} alt="featuresIcon" height={44} width={44} className=''/>
          <div className='flexCenter flex-col'>
            <h5>Wishlist and Favorites</h5>
            <hr className='w-8 bg-secondary h-1 rounded-full'/>
          </div>
          <p className='text-center'>Effortlessly search books by title, author, genre, or price range.</p>
        </div>

        <div className='flexCenter flex-col gap-3'>
          <img src={secure} alt="featuresIcon" height={44} width={44} className=''/>
          <div className='flexCenter flex-col'>
            <h5>Secure Online Payments</h5>
            <hr className='w-8 bg-secondary h-1 rounded-full'/>
          </div>
          <p className='text-center'>Effortlessly search books by title, author, genre, or price range.</p>
        </div>
      </div>
    </section>
  )
}

export default Features
