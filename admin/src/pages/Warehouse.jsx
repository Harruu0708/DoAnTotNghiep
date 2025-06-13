import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Warehouse = () => {
  const [warehouse, setWarehouse] = useState([]);
  const [filteredWarehouse, setFilteredWarehouse] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    productId: "",
    importPrice: "",
    quantity: "",
    importDate: "",
  });
  const [message, setMessage] = useState("");

  // Thêm phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Số sản phẩm mỗi trang

  const user = useSelector((state) => state.auth.login.currentUser);
  const token = user?.accessToken;

  // Load dữ liệu kho
  const fetchWarehouse = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/warehouse/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWarehouse(res.data.warehouseProducts);
      setFilteredWarehouse(res.data.warehouseProducts);
    } catch (err) {
      console.error("Error fetching warehouse:", err);
    }
  };

  useEffect(() => {
    fetchWarehouse();
  }, []);

  // Xử lý tìm kiếm
  useEffect(() => {
    const filtered = warehouse.filter(item =>
      item.productId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWarehouse(filtered);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  }, [searchTerm, warehouse]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/warehouse/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Thêm vào kho thành công!");
      setFormData({ productId: "", importPrice: "", quantity: "", importDate: "" });
      fetchWarehouse();
    } catch (err) {
      console.error(err);
      setMessage("Thêm thất bại!");
    }
  };

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWarehouse = filteredWarehouse.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredWarehouse.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="w-full p-4 md:p-6">

        {/* Form thêm sản phẩm */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <h3 className="h4 text-gray-800 mb-4">Thêm sản phẩm mới</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              name="productId"
              placeholder="Product ID"
              value={formData.productId}
              onChange={handleChange}
              required
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent regular-14"
            />
            <input
              type="number"
              name="importPrice"
              placeholder="Giá nhập"
              value={formData.importPrice}
              onChange={handleChange}
              required
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent regular-14"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Số lượng"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent regular-14"
            />
            <input
              type="date"
              name="importDate"
              placeholder="Ngày nhập (tùy chọn)"
              value={formData.importDate}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent regular-14"
            />
            <button
              type="submit"
              className="col-span-1 md:col-span-2 lg:col-span-4 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200 text-sm font-medium"
            >
              Thêm sản phẩm vào kho
            </button>
          </form>

          {message && (
            <div className="p-3 bg-green-100 text-green-700 rounded-lg border border-green-300 medium-14">
              {message}
            </div>
          )}
        </div>

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

        {/* Bảng hiển thị dữ liệu kho */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-white px-6 py-4 border-b border-gray-300">
            <h3 className="h5 text-gray-900">Danh sách sản phẩm trong kho</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b-2 border-gray-300">
                <tr>
                  <th className="p-4 text-left medium-14 text-gray-800">Sản phẩm</th>
                  <th className="p-4 text-left medium-14 text-gray-800">Giá nhập</th>
                  <th className="p-4 text-left medium-14 text-gray-800">Số lượng nhập</th>
                  <th className="p-4 text-left medium-14 text-gray-800">Số lượng còn</th>
                  <th className="p-4 text-left medium-14 text-gray-800">Ngày nhập</th>
                  <th className="p-4 text-left medium-14 text-gray-800">Ảnh</th>
                </tr>
              </thead>
              <tbody>
                {currentWarehouse.map((item, index) => (
                  <tr key={item._id} className={`border-b transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="p-4 medium-14 text-gray-900">{item.productId?.name}</td>
                    <td className="p-4 regular-14 text-gray-700">{(item.importPrice * 1000)?.toLocaleString('vi-VN')} đ</td>
                    <td className="p-4 regular-14 text-gray-700">{item.quantity}</td>
                    <td className="p-4 regular-14 text-gray-700">{item.productId?.quantity}</td>
                    <td className="p-4 regular-14 text-gray-700">{new Date(item.importDate).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4">
                      <img 
                        src={item.productId?.image} 
                        alt="Product" 
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm" 
                      />
                    </td>
                  </tr>
                ))}
                {warehouse.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-500">
                      <div className="flexCenter flex-col">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flexCenter mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m2 0h8m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4.01"></path>
                          </svg>
                        </div>
                        <p className="medium-16 font-medium">Không có dữ liệu kho</p>
                        <p className="regular-14 text-gray-400 mt-1">Thêm sản phẩm đầu tiên vào kho</p>
                      </div>
                    </td>
                  </tr>
                ) : currentWarehouse.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-500">
                      <div className="flexCenter flex-col">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flexCenter mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                          </svg>
                        </div>
                        <p className="medium-16 font-medium">Không tìm thấy sản phẩm nào</p>
                        <p className="regular-14 text-gray-400 mt-1">Thử tìm kiếm với từ khóa khác</p>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
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
      </div>
    </div>
  );
};

export default Warehouse;