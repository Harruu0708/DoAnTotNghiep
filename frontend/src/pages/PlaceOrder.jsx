import React, { useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import Footer from '../components/Footer'

const PlaceOrder = () => {
     const [method, setMethod] = useState('cod')
  return (
    <section className='max-padd-container'>
        {/* <!-- Container --> */}
        <form className='pt-28'>
            <div className='flex flex-col xl:flex-row gap-20 xl:gap-28'>
                {/* <!-- left --> */}
                <div className='flex flex-1 flex-col gap-3 text-[95%]'> 
                    <Title title1={'Delivery'} title2={'Information'} title1Styles={'h3'} />
                    <div className='flex gap-3'>
                        <input type="text" name='firstName' placeholder='First Name' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none w-1/2'/>
                        <input type="text" name='lastName' placeholder='Last Name' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none w-1/2'/>
                    </div>
                    <input type="email" name='email' placeholder='Email' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none w-1/2'/>
                    <input type="text" name='phone' placeholder='Phone Number' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none w-1/2'/>
                    <input type="text" name='street' placeholder='Street' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none w-1/2'/>
                    <div className='flex gap-3'>
                        <input type="text" name='district' placeholder='Dictrict' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none w-1/2'/>
                        <input type="text" name='city' placeholder='City' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none w-1/2'/>
                    </div>
                </div>
                {/* <!-- right --> */}
                <div className='flex flex-1 flex-col'>
                    <CartTotal/>
                    {/* <!-- Payment --> */}
                    <div className='my-6'>
                        <h3 className='bold-20 mb-5'>Payment <span className='text-secondary'>Method</span></h3>
                        <div className='flex gap-3'>
                            <div onClick={() => setMethod('stripe')} className={`${method==='stripe' ? "btn-secondary" : "btn-white" } !py-1 text-xs cursor-pointer`}>Stripe</div>
                            <div onClick={() => setMethod('cod')} className={`${method==='cod' ? "btn-secondary" : "btn-white" } !py-1 text-xs cursor-pointer`}>Cash on Delivery</div>
                        </div>
                    </div>
                    <div>
                        <button type='submit' className='btn-secondaryOne'>Place Order</button>
                    </div>
                </div>
            </div>
        </form>
        <Footer/>
    </section>
  )
}

export default PlaceOrder
