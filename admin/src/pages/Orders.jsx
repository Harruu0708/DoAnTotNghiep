import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';  // Import toast

// Thêm vào nơi đầu của component
import 'react-toastify/dist/ReactToastify.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const user = useSelector((state) => state.auth.login.currentUser);
  const token = user?.accessToken;

  const statuses = ["Tất cả", "Đang xử lý", "Đang vận chuyển", "Đã giao", "Hủy"];
  const statusMap = {
    "Đang xử lý": "pending",
    "Đang vận chuyển": "shipping",
    "Đã giao": "delivered",
    "Hủy": "canceled",
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/order/all', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setOrders(res.data);
        setFilteredOrders(res.data);
      } catch (err) {
        console.error('Không thể tải đơn hàng:', err);
      }
    };
    fetchOrders();
  }, [token]);

  useEffect(() => {
    setCurrentPage(1);
    if (selectedStatus === "Tất cả") {
      setFilteredOrders(orders);
    } else {
      const code = statusMap[selectedStatus];
      setFilteredOrders(orders.filter((order) => order.status === code));
    }
  }, [selectedStatus, orders]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return { text: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-700' };
      case 'shipping': return { text: 'Đang vận chuyển', color: 'bg-blue-100 text-blue-700' };
      case 'delivered': return { text: 'Đã giao', color: 'bg-green-100 text-green-700' };
      case 'canceled': return { text: 'Đã hủy', color: 'bg-red-100 text-red-700' };
      default: return { text: 'Không rõ', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8000/api/order/update-status/${orderId}`,
        { status: statusMap[newStatus] },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
          withCredentials: true,
        }
      );
  
      // Cập nhật lại trạng thái trong danh sách đơn hàng
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: statusMap[newStatus] } : order
        )
      );
      // Cập nhật filteredOrders nếu cần thiết
      setFilteredOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: statusMap[newStatus] } : order
        )
      );

      // Hiển thị thông báo thành công
      toast.success(`Trạng thái đơn hàng đã được cập nhật thành công!`);
    } catch (error) {
      console.error('Không thể cập nhật trạng thái đơn hàng:', error);
      // Hiển thị thông báo lỗi
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.');
    }
  };

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="max-padd-container py-8">
      <h2 className="h2 mb-6">Đơn hàng</h2>

      {/* Bộ lọc trạng thái */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-full border ${
              selectedStatus === status
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
            onClick={() => setSelectedStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {currentOrders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <div className="space-y-6">
          {currentOrders.map((order) => {
            const status = getStatusLabel(order.status);
            return (
              <div key={order._id} className="w-full border p-4 rounded-lg shadow-sm bg-white">
                <div className="flexBetween mb-2">
                  <span className="medium-16 text-gray-600">Mã đơn: {order.order_id}</span>
                  <span className={`bold-14 px-3 py-1 rounded-full ${status.color}`}>
                    {status.text}
                  </span>
                  <select
                    className="ml-4 p-1 border rounded"
                    value={Object.keys(statusMap).find(key => statusMap[key] === order.status) || "Không rõ"}
                    onChange={(e) => handleChangeStatus(order._id, e.target.value)}
                  >
                    {statuses.slice(1).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Ngày đặt: {new Date(order.createdAt).toLocaleString()}
                </p>

                {/* Thông tin người nhận hàng */}
                <div className="text-sm text-gray-600 mb-2">
                  <p><span className="font-semibold">Người nhận:</span> {order.shipping_info?.fullname}</p>
                  <p><span className="font-semibold">Địa chỉ:</span> {order.shipping_info?.address}</p>
                  <p><span className="font-semibold">SĐT:</span> {order.shipping_info?.phone}</p>
                </div>

                <p className="text-sm mb-4 text-gray-600">
                  Phương thức thanh toán: {order.payment_method}
                </p>
                <ul className="pl-5 list-disc text-sm text-gray-700 mb-4">
                  {order.products.map((item) => (
                    <li key={item._id}>
                      {item.product_id?.name || 'Sản phẩm không rõ'} × {item.quantity}
                    </li>
                  ))}
                </ul>
                <p className="font-bold text-right">
                  Tổng cộng: {order.total_price.toLocaleString()} 000 ₫
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-2">
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
  );
};

export default Orders;
