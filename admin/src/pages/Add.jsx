import React, {useState} from 'react'
import upload_icon from '../assets/upload_icon.png'
import {TbTrash} from 'react-icons/tb'
import {FaPlus} from 'react-icons/fa6'
import axios from 'axios'
import { useSelector } from 'react-redux' 
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' // Import CSS của Toastify 

const Add = () => {
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Tiểu thuyết');
    const [popular, setPopular] = useState(false);
    const [publisher, setPublisher] = useState('');
    const [author, setAuthor] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const user = useSelector((state) => state.auth.login.currentUser);
    const token = user?.accessToken;

    const handleChangeImage = (e) => {
        setImage(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
          toast.error("Vui lòng tải lên ảnh sản phẩm");
          return;
        }
    
        setIsLoading(true); // Bắt đầu loading
    
        const formData = new FormData();
        formData.append('image', image);
        formData.append('name', name);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('popular', popular);
        formData.append('publisher', publisher);
        formData.append('author', author);
        formData.append('quantity', quantity);
    
        try {
          const res = await axios.post('http://localhost:8000/api/product/add', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`,
            },
          });
          toast.success('Thêm sản phẩm thành công!');
          console.log(res.data);
          // Reset form inputs
          setImage(null);
          setName('');
          setDescription('');
          setPrice('');
          setCategory('Tiểu thuyết');
          setPopular(false);
          setPublisher('');
          setAuthor('');
          setQuantity(1);
        } catch (err) {
          console.error(err);
          toast.error('Có lỗi xảy ra khi thêm sản phẩm');
        } finally {
          setIsLoading(false); // Kết thúc loading
        }
    };

    return (
        <div className='px-4 sm:px-8 mt-10 pb-16 flex justify-center relative'>
           <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
                        <div className="flex justify-center mb-4">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-800"></div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Đang thêm sản phẩm</h3>
                        <p className="text-gray-600 text-sm">Vui lòng đợi trong giây lát...</p>
                        <div className="mt-4">
                            <div className="bg-gray-200 rounded-full h-2">
                                <div className="bg-gray-800 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form className='flex flex-col gap-y-4 w-full max-w-2xl' onSubmit={handleSubmit}>
                <div className='w-full'>
                    <h5>Tên sản phẩm</h5>
                    <input 
                        onChange={(e) => setName(e.target.value)} 
                        value={name} 
                        type="text" 
                        placeholder='Nhập tên sản phẩm...' 
                        className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full max-w-lg'
                        disabled={isLoading}
                    />
                </div>
                <div className='w-full'>
                    <h5>Mô tả sản phẩm</h5>
                    <textarea 
                        onChange={(e) => setDescription(e.target.value)} 
                        value={description} 
                        placeholder='Nhập mô tả...' 
                        className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full max-w-lg'
                        disabled={isLoading}
                    />
                </div>
                <div className='w-full'>
                    <h5>Nhà xuất bản</h5>
                    <input 
                        onChange={(e) => setPublisher(e.target.value)} 
                        value={publisher} 
                        type="text" 
                        placeholder='Nhập nhà xuất bản...' 
                        className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full max-w-lg'
                        disabled={isLoading}
                    />
                </div>
                <div className='w-full'>
                    <h5>Tác giả</h5>
                    <input 
                        onChange={(e) => setAuthor(e.target.value)} 
                        value={author} 
                        type="text" 
                        placeholder='Nhập tên tác giả...' 
                        className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full max-w-lg'
                        disabled={isLoading}
                    />
                </div>
                <div className='flex items-end gap-x-6'>
                    <div>
                        <h5>Thể loại</h5>
                        <select 
                            onChange={(e) => setCategory(e.target.value)} 
                            value={category} 
                            className='px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white mt-1 sm:w-full text-gray-30'
                            disabled={isLoading}
                        >
                            <option value="Tiểu thuyết">Tiểu thuyết</option>
                            <option value="Thiếu nhi">Thiếu nhi</option>
                            <option value="Sức khỏe">Sức khỏe</option>
                            <option value="Kinh doanh">Kinh doanh</option>
                            <option value="Học thuật">Học thuật</option>
                            <option value="Tôn giáo">Tôn giáo</option>
                        </select>
                    </div>
                    <div className='flex gap-x-2 pt-2'>
                        <label htmlFor="image" className={isLoading ? 'pointer-events-none' : ''}>
                            <img 
                                src={image ? URL.createObjectURL(image) : upload_icon} 
                                alt="" 
                                className={`w-14 h-14 object-cover ring-1 rounded-lg ${isLoading ? 'opacity-50' : ''}`} 
                            />
                            <input 
                                type="file" 
                                onChange={handleChangeImage} 
                                id='image' 
                                hidden 
                                disabled={isLoading}
                            />
                        </label>
                    </div>
                </div>
                <div>
                    <h5>Giá bán</h5>
                    <input 
                        onChange={(e) => setPrice(e.target.value)} 
                        value={price} 
                        type="number" 
                        placeholder='Nhập giá...' 
                        min={0} 
                        className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white w-20'
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <h5>Số lượng</h5>
                    <input
                        onChange={(e) => setQuantity(e.target.value)}
                        value={quantity}
                        type="number"
                        min={1}
                        placeholder='Nhập số lượng...'
                        className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white w-20'
                        disabled={isLoading}
                    />
                </div>
                <div className='flex gap-2 my-2'>
                    <input 
                        type="checkbox" 
                        checked={popular} 
                        onChange={() => setPopular(!popular)} 
                        id='popular'
                        disabled={isLoading}
                    />
                    <label htmlFor="popular" className={isLoading ? 'text-gray-400' : ''}>
                        Đánh dấu là sản phẩm nổi bật
                    </label>
                </div>
                <button 
                    type='submit' 
                    className={`btn-dark mt-3 max-w-44 sm:w-full flex items-center justify-center gap-2 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Đang thêm...
                        </>
                    ) : (
                        'Thêm sản phẩm'
                    )}
                </button>
            </form>
        </div>
    )
}

export default Add