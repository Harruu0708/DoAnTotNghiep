import React from 'react'

import Title from './Title'
import { TbTruckReturn } from 'react-icons/tb'
import about from '../assets/book_5.png'
const About = () => {
  return (
    <section className='max-padd-container py-12 xl:py-24 '>
      {/* <!-- container --> */}
      <div className='flexCenter flex-col gap-16 xl:gap-8 xl:flex-row'>
        {/*left side */}
        <div>
          <Title title1={"Các tính năng chính"} title2={"của chúng tôi"} titleStyles={'pb-10'} paraStyles={'!block'} />
          <div className='flex flex-col items-start gap-y-4' >
            <div className='flexCenter gap-x-4'>
              <div className='h-16 min-w-16 bg-secondaryOne flexCenter rounded-md'>
                <TbTruckReturn className='text-2xl'/>
              </div>
              <div>
                <h4 className='medium-18'>Tùy chọn thanh toán an toàn</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  ultrices, lacus vitae varius.
                </p>
              </div>
            </div>
            <div className='flexCenter gap-x-4'>
              <div className='h-16 min-w-16 bg-secondaryOne flexCenter rounded-md'>
                <TbTruckReturn className='text-2xl'/>
              </div>
              <div>
                <h4 className='medium-18'>Tùy chọn thanh toán an toàn</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  ultrices, lacus vitae varius.
                </p>
              </div>
            </div>
            <div className='flexCenter gap-x-4'>
              <div className='h-16 min-w-16 bg-secondaryOne flexCenter rounded-md'>
                <TbTruckReturn className='text-2xl'/>
              </div>
              <div>
                <h4 className='medium-18'>Tùy chọn thanh toán an toàn</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  ultrices, lacus vitae varius.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/*right side */}
        <div className='flex-1 flexCenter'>
          <div className='bg-secondaryOne flexCenter p-24 max-h-[33rem] max-w-[33rem] rounded-3xl'>
            <img src={about} alt="aboutImg" height={244} width={244} className='shadow-2xl shadow-slate-900/50 rounded-lg' />
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
