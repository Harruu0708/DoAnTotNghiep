import React, {useState} from 'react'
import upload_icon from '../assets/upload_icon.png'
import {TbTrash} from 'react-icons/tb'
import {FaPlus} from 'react-icons/fa6'
import axios from 'axios'

const Add = () => {
    const [image, setImage] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('Fiction')
    const [popular, setPopular] = useState()

    const handleChangeImage = (e) => {
        setImage(e.target.files[0])
    }
  return (
    <div className='px-2 sm:px-8 sm:mt-14 pb-16'>
      <form className='flex flex-col gap-y-3 medium-14 lg:w-[777px]'>
        <div className='w-full'>
            <h5>Product Name</h5>
            <input type="text" placeholder='Write here...' className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full max-w-lg' />
        </div>
        <div className='w-full'>
            <h5 className='h5'>Product description</h5>
            <textarea type="text" placeholder='Write here...' className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full max-w-lg' />
        </div>
        {/* category */}
        <div className='flex items-end gap-x-6'>
            <div>
                <h5 className='h5'>Category</h5>
                <select className='px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white mt-1 sm:w-full text-gray-30'>
                    <option value="Fiction">Fiction</option>
                    <option value="Children">Children</option>
                    <option value="Health">Health</option>
                    <option value="Business">Business</option>
                    <option value="Academic">Academic</option>
                    <option value="Religious">Religious</option>
                </select>
            </div>
            <div className='flex gap-x-2 pt-2'>
                <label htmlFor="image">
                    <img src={image ? URL.createObjectURL(image): upload_icon} alt="" className='w-14 h-14 aspect-square object-cover ring-1 ring-slate-900/5 bg-white rounded-lg' />
                    <input type="file" onChange={handleChangeImage} name='image' id='image' hidden />
                </label>
            </div>
        </div>
        <div>
            <h5 className='h5'>Price</h5>
            <input type="number" placeholder='Price' min={0} className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white w-20' />
        </div>

        <div className='flexStart gap-2 my-2'>
            <input type="checkbox" checked={popular} value="true" id='popular' />
            <label htmlFor="popular" className='cursor-pointer'>Add to Popular</label>
        </div>

        <button type='submit' className='btn-dark mt-3 max-w-44 sm:w-full'>Add Product</button>
      </form>
    </div>
  )
}

export default Add
