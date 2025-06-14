import React from 'react'
import { books } from '../assets/data'
import { TbEdit } from 'react-icons/tb'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS để sử dụng Toast

const List = () => {
  const List = books
  const [products, setProducts] = useState([]) // Danh sách sản phẩm
  const [filteredProducts, setFilteredProducts] = useState([]) // Danh sách sản phẩm đã lọc
  const [searchTerm, setSearchTerm] = useState('') // Từ khóa tìm kiếm
  const [currentPage, setCurrentPage] = useState(1) // Trang hiện tại
  const [itemsPerPage] = useState(10) // Số sản phẩm mỗi trang
  const [editingProductId, setEditingProductId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const user = useSelector((state) => state.auth.login.currentUser);
  const token = user?.accessToken;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/product/all')
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data) // Khởi tạo danh sách đã lọc
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error)
      }
    }

    fetchProducts()
  }, [])

  // Xử lý tìm kiếm
  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset về trang đầu khi tìm kiếm
  }, [searchTerm, products])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditClick = (product) => {
    setEditingProductId(product._id)
    setEditForm({
      name: product.name,
      price: product.price,
      author: product.author,
    })
  }

  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/product/update/${editingProductId}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật cả danh sách gốc và danh sách đã lọc
      const updatedProduct = response.data;
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === editingProductId ? updatedProduct : product
        )
      );
      setFilteredProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === editingProductId ? updatedProduct : product
        )
      );
      
      toast.success("Sản phẩm đã được cập nhật thành công!");
      setEditingProductId(null);
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
      toast.error("Có lỗi xảy ra khi cập nhật sản phẩm.");
    }
  };

  const indexOfLastProduct = currentPage * itemsPerPage
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  return (
    <div className='px-2 sm:px-8 mt-4 sm:mt-14'>
      <ToastContainer /> {/* Thêm ToastContainer để hiển thị toast */}

      {/* Thanh tìm kiếm */}
      <div className='mb-6'>
        <input
          type="text"
          placeholder="Tìm kiếm tên sản phẩm..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className='flex flex-col gap-2'>
        {/* Tiêu đề bảng */}
        <div className='grid grid-cols-1 sm:grid-cols-[150px_120px_1fr_1fr_100px_60px] items-center py-1 px-2 bg-white bold-14 sm:bold-15 mb-1 rounded'>
          <h5>ID</h5>
          <h5>Ảnh</h5>
          <h5>Tên</h5>
          <h5>Thể loại</h5>
          <h5>Giá</h5>
          <h5>Sửa</h5>
        </div>

        {currentProducts.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            {searchTerm ? 'Không tìm thấy sản phẩm nào phù hợp' : 'Không có sản phẩm nào'}
          </div>
        ) : (
          currentProducts.map((product) => (
            <div
              key={product._id}
              className='grid grid-cols-1 sm:grid-cols-[150px_120px_1fr_1fr_100px_60px] gap-4 p-1 py-1 px-2 bg-white rounded-xl items-center'
            >
              {/* ID sản phẩm */}
              <p className='text-sm font-mono break-all'>{product._id}</p>

              {/* Ảnh */}
              <img
                src={product.image}
                alt=""
                className='w-16 sm:w-20 md:w-20 h-24 object-cover rounded-lg'
              />

              {/* Tên sản phẩm */}
              {editingProductId === product._id ? (
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="border px-1 py-0.5 text-sm"
                />
              ) : (
                <h5 className='text-sm font-semibold'>{product.name}</h5>
              )}

              {/* Thể loại */}
              <p className='font-semibold'>{product.category}</p>

              {/* Giá */}
              {editingProductId === product._id ? (
                <input
                  name="price"
                  type="number"
                  value={editForm.price}
                  onChange={handleEditChange}
                  className="border px-1 py-0.5 text-sm"
                />
              ) : (
                <div className='text-sm font-semibold'>{(product.price *1000)?.toLocaleString('vi-VN')} đ</div>
              )}

              {/* Nút Edit hoặc Save */}
              <div className='text-right md:text-center cursor-pointer text-lg'>
                {editingProductId === product._id ? (
                  <div className="flex gap-2 justify-end text-sm">
                    <button
                      onClick={handleSave}
                      className="text-blue-600 underline"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => setEditingProductId(null)}
                      className="text-gray-500 underline"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <TbEdit onClick={() => handleEditClick(product)} />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className='flex justify-center mt-14 mb-10 gap-4'>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`btn-secondary !py-1 !px-3 ${currentPage === 1 && "opacity-50 cursor-not-allowed"}`}
          >
            Trước
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`btn-light !py-1 !px-3 ${currentPage === index + 1 && "!bg-secondaryOne"}`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`btn-secondary !py-1 !px-3 ${currentPage === totalPages && "opacity-50 cursor-not-allowed"}`}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  )
}

export default List