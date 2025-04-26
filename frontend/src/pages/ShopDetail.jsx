import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {books} from "../assets/data";
import { useSelector } from "react-redux";

import Footer from "../components/Footer";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const ShopDetails = () => {
  const { id} = useParams();
  const { addToCart, updateQuantity, navigate } = useContext(ShopContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // Mặc định 1 sản phẩm
  const [reviews, setReviews] = useState([]); // Lưu trữ đánh giá sản phẩm
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    image: ""
  });

  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const token = currentUser?.accessToken;

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/product/${id}`);
        setBook(res.data);
      } catch (err) {
        setError("Không tìm thấy sách");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/review/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Không thể lấy đánh giá sản phẩm", err);
      }
    };

    fetchBookDetails();
    fetchReviews();
  }, [id]);

  const handleIncrease = () => {
    if (book && quantity < book.quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
  
    try {
      await updateQuantity(book._id, quantity); // Cập nhật số lượng sản phẩm trong giỏ hàng
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  if (loading) {
    return <h2 className="pt-28 text-center text-black-500 medium-24 pt-28">Đang tải...</h2>;
  }

  if (error || !book) {
    return <h2 className="pt-28 text-center text-black-500 medium-24 pt-28">{error || "Không tìm thấy sách"}</h2>;
  }

  return (
    <div className="max-padd-container py-10">
     <div className="pt-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hình ảnh sách (giả sử có book.image) */}
            <div className="flexCenter bg-white p-6 rounded-3xl overflow-hidden">
            <img src={book.image} alt={book.name} className="w-full max-w-[400px] rounded-xl shadow-lg shadow-slate-900/30" />
            </div>

            {/* Chi tiết sách */}
            <div className="bg-white p-2 mt-3 rounded-lg">
            <h1 className="bold-32">{book.name}</h1>
            <p className="medium-18 text-gray-600">Tác giả: {book.author}</p>
            <p className="medium-18 text-gray-600">Thể loại: {book.category}</p>
            <p className="medium-18 text-gray-600">Nhà xuất bản: {book.publisher}</p>
            <p className="medium-18 text-gray-600">Số lượng còn lại: {book.quantity}</p>
            <p className="medium-20 text-secondary mt-4">Giá: {book.price} 000 VND</p>
            <p className="regular-16 text-gray-700 mt-6">{book.description}</p>

            {/* Tăng giảm số lượng */}
            <div className="flex items-center gap-4 mt-6">
              <button onClick={handleDecrease} className="bg-gray-200 px-3 py-1 rounded text-lg font-bold">-</button>
              <span className="text-lg font-medium">{quantity}</span>
              <button onClick={handleIncrease} className="bg-gray-200 px-3 py-1 rounded text-lg font-bold">+</button>
            </div>

            {/* Nút mua hàng */}
            <button onClick={handleAddToCart} className="btn-secondary mt-6">Thêm vào giỏ hàng</button>
            </div>
        </div>

        {/* Hiển thị các đánh giá */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Đánh giá sản phẩm</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="bg-white p-4 mb-4 rounded-lg shadow-md">
                <div className="flex items-center gap-3">
                  <img
                    src={review.image}
                    alt={review.user.username}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold">{review.user.username}</p>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-yellow-500 font-bold">{review.rating} ★</span>
                </div>
              </div>
            ))
          ) : (
            <p>Chưa có đánh giá nào.</p>
          )}
        </div>       
      </div>
        <Footer />
    </div>
  );
};

export default ShopDetails;
