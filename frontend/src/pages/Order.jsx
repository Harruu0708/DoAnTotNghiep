import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Footer from "../components/Footer";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from "react-router-dom";



const Order = () => {
  const { currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("Tất cả");
  const [reviewingProduct, setReviewingProduct] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    image: ""
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu có query params thì xóa nó
    if (location.search) {
      navigate('/order', { replace: true });
    }
  }, []);


  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const token = currentUser?.accessToken;

  const statuses = ["Tất cả", "Đang xử lý", "Đang vận chuyển", "Hủy", "Đã giao"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/order/my-order", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Lỗi khi fetch đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitReview = async () => {
    if (!token) return;

    try {
      const formData = new FormData();
      formData.append("product", reviewingProduct._id);
      formData.append("rating", newReview.rating);
      formData.append("comment", newReview.comment);
      if (newReview.image) formData.append("image", newReview.image);

      await axios.post("http://localhost:8000/api/review/create", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Reset form và đóng popup review
      setNewReview({ rating: 0, comment: "", image: "" });
      setReviewingProduct(null);
      toast.success("Đánh giá thành công!");
      
      // Có thể thêm thông báo thành công ở đây
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message) {
        toast.error(error.response.data.message);
        setNewReview({ rating: 0, comment: "", image: "" });
        setReviewingProduct(null);
      } else {
        toast.error('Có lỗi xảy ra khi gửi đánh giá!');
      }
    
    }
  };

  const convertStatus = (status) => {
    switch (status) {
      case "pending":
        return "Đang xử lý";
      case "shipping":
        return "Đang vận chuyển";
      case "cancelled":
        return "Hủy";
      case "delivered":
        return "Đã giao";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "shipping":
        return "text-blue-500";
      case "delivered":
        return "text-green-600";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const filteredOrders =
    filter === "Tất cả"
      ? orders
      : orders.filter((order) => convertStatus(order.status) === filter);
      

  return (
    <section className="max-padd-container py-10">
      <h2 className="h2 pt-28">Danh sách đơn hàng</h2>

      <div className="flex gap-4 mb-6">
        {statuses.map((status) => (
          <button
            key={status}
            className={`btn-secondaryOne ${filter === status ? "btn-secondary" : ""}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

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
                const totalQuantity = order.products.reduce(
                  (acc, item) => acc + item.quantity,
                  0
                );

                return (
                  <tr
                    key={order._id}
                    className="border-b last:border-b-0 cursor-pointer hover:bg-gray-10"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="p-3 bold-16">{order.order_id}</td>
                    <td className="p-3 regular-16">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className={`p-3 medium-16 ${getStatusColor(order.status)}`}>
                      {convertStatus(order.status)}
                    </td>
                    <td className="p-3 regular-16">{totalQuantity}</td>
                    <td className="p-3 bold-16">
                      {order.total_price} 000 {currency}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flexCenter z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-[600px] mx-2 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedOrder(null)}
            >
              Đóng
            </button>

            <h3 className="h3 mb-4">
              Chi tiết đơn hàng: <span className="bold-16">{selectedOrder.order_id}</span>
            </h3>

            <div className="mb-4">
              <p className="regular-16">
                Ngày đặt:{" "}
                <span className="bold-16">
                  {new Date(selectedOrder.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </p>
              <p className={`medium-16 ${getStatusColor(selectedOrder.status)}`}>
                Trạng thái: {convertStatus(selectedOrder.status)}
              </p>
              <p className="regular-16">
                Tổng tiền:{" "}
                <span className="bold-16">
                  {selectedOrder.total_price} 000 {currency}
                </span>
              </p>
              <p className="regular-16">
                Địa chỉ giao hàng:{" "}
                <span className="bold-16">{selectedOrder.shipping_info?.address}</span>
              </p>
              <p className="regular-16">
                Phương thức thanh toán:{" "}
                <span className="bold-16">{selectedOrder.payment_method}</span>
              </p>
            </div>

            <div>
              <h4 className="h4 mb-2">Danh sách sản phẩm</h4>
              <ul>
                {selectedOrder.products.map((item) => (
                  <li
                    key={item._id}
                    className="flexBetween mb-2 py-2 px-2 rounded hover:bg-gray-10"
                  >
                    <div>
                      <span className="bold-16">{item.product_id.name}</span>
                      <p className="regular-14 text-gray-600">
                        Thể loại: {item.product_id.category}
                      </p>
                    </div>
                    <div className="medium-16">
                      x<span className="bold-16">{item.quantity}</span>
                      {/* Chỉ hiển thị nút review nếu đơn hàng đã giao */}
                      {selectedOrder.status === "delivered" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReviewingProduct(item.product_id);
                          }}
                          className="ml-2 btn-secondary text-sm py-0.5 px-2"
                        >
                          Đánh giá
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* Popup đánh giá sản phẩm */}
      {reviewingProduct && (
        <div className="fixed inset-0 bg-black/50 flexCenter z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-[500px] mx-2 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setReviewingProduct(null)}
            >
              Đóng
            </button>

            <h3 className="h3 mb-4">Đánh giá sản phẩm: {reviewingProduct.name}</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="rating" className="block text-lg font-medium">
                  Đánh giá (1 - 5 sao)
                </label>
                <input
                  type="number"
                  name="rating"
                  min="1"
                  max="5"
                  value={newReview.rating}
                  onChange={handleReviewChange}
                  className="mt-2 w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="comment" className="block text-lg font-medium">
                  Bình luận
                </label>
                <textarea
                  name="comment"
                  value={newReview.comment}
                  onChange={handleReviewChange}
                  className="mt-2 w-full px-4 py-2 border rounded-md"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-lg font-medium">
                  Hình ảnh (nếu có)
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={(e) => setNewReview(prev => ({
                    ...prev,
                    image: e.target.files[0]
                  }))}
                  className="mt-2 w-full px-4 py-2 border rounded-md"
                />
              </div>

              <button
                onClick={handleSubmitReview}
                className="btn-secondary w-full mt-4"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </section>
  );
};

export default Order;
