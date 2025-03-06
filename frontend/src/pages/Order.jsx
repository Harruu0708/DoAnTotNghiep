import React, { useState, useContext } from "react";
import { orders } from "../assets/data"; // Giả sử file data này chứa cả orders & books
import { ShopContext } from "../context/ShopContext";
import Footer from "../components/Footer";
const Order = () => {
  const { currency } = useContext(ShopContext);

  // Lấy màu chữ cho từng trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "Đang xử lý":
        return "text-yellow-500";
      case "Đang vận chuyển":
        return "text-blue-500";
      case "Hủy":
        return "text-red-500";
      case "Đã giao":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  // Danh sách trạng thái hiển thị trên thanh filter
  const statuses = ["Tất cả", "Đang xử lý", "Đang vận chuyển", "Hủy", "Đã giao"];
  const [filter, setFilter] = useState("Tất cả");

  // State lưu đơn hàng được click để hiển thị modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Lọc đơn hàng theo trạng thái
  const filteredOrders =
    filter === "Tất cả"
      ? orders
      : orders.filter((order) => order.status === filter);

  return (
    <section className="max-padd-container py-10">
      <h2 className="h2 pt-28">Danh sách đơn hàng</h2>

      {/* Thanh Filter trạng thái */}
      <div className="flex gap-4 mb-6">
        {statuses.map((status) => (
          <button
            key={status}
            className={`btn-secondaryOne ${
              filter === status ? "btn-secondary" : ""
            }`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bảng đơn hàng */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="h4 py-2">Mã đơn hàng</th>
              <th className="h4 py-2">Ngày đặt</th>
              <th className="h4 py-2">Trạng thái</th>
              <th className="h4 py-2">Số lượng</th>
              <th className="h4 py-2">Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-3 italic text-center">
                  Không có đơn hàng nào
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                // Tính tổng số lượng sách trong đơn
                const totalQuantity = order.items.reduce(
                  (acc, item) => acc + item.quantity,
                  0
                );

                return (
                  <tr
                    key={order._id}
                    className="border-b last:border-b-0 cursor-pointer hover:bg-gray-10"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="p-3 bold-16">{order._id}</td>
                    <td className="p-3 regular-16">
                      {new Date(order.date).toLocaleDateString("vi-VN")}
                    </td>
                    <td
                      className={`p-3 medium-16 ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </td>
                    <td className="p-3 regular-16">{totalQuantity}</td>
                    <td className="p-3 bold-16">
                      {order.total} 000 {currency}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flexCenter z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-[600px] mx-2 relative">
            {/* Nút đóng modal */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedOrder(null)}
            >
              Đóng
            </button>

            {/* Tiêu đề */}
            <h3 className="h3 mb-4">
              Chi tiết đơn hàng: <span className="bold-16">{selectedOrder._id}</span>
            </h3>

            {/* Thông tin chung */}
            <div className="mb-4">
              <p className="regular-16">
                Ngày đặt:{" "}
                <span className="bold-16">
                  {new Date(selectedOrder.date).toLocaleDateString("vi-VN")}
                </span>
              </p>
              <p className={`medium-16 ${getStatusColor(selectedOrder.status)}`}>
                Trạng thái: {selectedOrder.status}
              </p>
              <p className="regular-16">
                Tổng tiền:{" "}
                <span className="bold-16">
                  {selectedOrder.total} 000 {currency}
                </span>
              </p>

              <p className="regular-16">
                Địa chỉ giao hàng:{" "}
                <span className="bold-16">{selectedOrder.address}</span>
              </p>
              <p className="regular-16">
                Phương thức thanh toán:{" "}
                <span className="bold-16">{selectedOrder.paymentMethod}</span>
              </p>
            </div>

            {/* Danh sách sách trong đơn hàng */}
            <div>
              <h4 className="h4 mb-2">Danh sách sản phẩm</h4>
              <ul>
                {selectedOrder.items.map((item) => (
                  <li
                    key={item._id}
                    className="flexBetween mb-2 py-2 px-2 rounded hover:bg-gray-10"
                  >
                    <div>
                      <span className="bold-16">{item.name}</span>
                      <p className="regular-14 text-gray-600">
                        Thể loại: {item.category}
                      </p>
                    </div>
                    <div className="medium-16">
                      x<span className="bold-16">{item.quantity}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </section>
  );
};

export default Order;
