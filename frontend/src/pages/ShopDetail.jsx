import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {books} from "../assets/data";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';

import "swiper/css";
import "swiper/css/pagination";
import {Autoplay, Pagination} from 'swiper/modules';

import Footer from "../components/Footer";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Item from "../components/Item";
import axios from "axios";

const ShopDetails = () => {
  const { id } = useParams();
  const { addToCart, updateQuantity, navigate } = useContext(ShopContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [relatedBooks, setRelatedBooks] = useState([]);

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

     // Fetch gợi ý sản phẩm từ hệ gợi ý
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/recommend`, {
          params: {
            product_id: id,  // sản phẩm đang xem
            user_id: currentUser?.others?._id || null   // có thể undefined nếu chưa đăng nhập
          }
        });
        setRelatedBooks(res.data); // Giả sử API trả về danh sách các sách liên quan
      } catch (err) {
        console.error("Không thể lấy sản phẩm gợi ý", err);
      }
    };

    fetchBookDetails();
    fetchReviews();
    fetchRecommendations();
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
      await updateQuantity(book._id, quantity);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  // Format thời gian
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render sao đánh giá
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span 
        key={index} 
        className={`text-xl ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  // Tính trung bình rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return <h2 className="pt-28 text-center text-black-500 medium-24 pt-28">Đang tải...</h2>;
  }

  if (error || !book) {
    return <h2 className="pt-28 text-center text-black-500 medium-24 pt-28">{error || "Không tìm thấy sách"}</h2>;
  }

  const displayPrice = book.discount_price > 0 ? book.discount_price : book.price;

  return (
    <div className="max-padd-container py-10">
      <div className="pt-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hình ảnh sách */}
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

            {/* Giá sản phẩm */}
            <div className="flex items-center gap-2 mt-4">
              {book.discount_price > 0 && (
                <p className="text-gray-500 line-through">
                  {(book.price * 1000).toLocaleString('vi-VN')} đ
                </p>
              )}
              <p className="text-secondary font-bold">
                {(displayPrice * 1000).toLocaleString('vi-VN')} đ
              </p>
            </div>

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

        {/* Đánh giá sản phẩm */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-5 mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Đánh giá sản phẩm</h2>
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(Math.round(averageRating))}</div>
                <span className="text-xl font-bold text-gray-900">{averageRating}</span>
                <span className="text-gray-500">({reviews.length} đánh giá)</span>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={review.user.avatar || review.image || '/default-avatar.png'}
                          alt={review.user.username}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{review.user.username}</h4>
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                        )}
                        {review.image && (
                          <img 
                            src={review.image} 
                            alt="Review" 
                            className="w-24 h-24 rounded-lg shadow-md"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <p className="text-gray-500 text-lg">Chưa có đánh giá nào cho sản phẩm này</p>
                <p className="text-gray-400 text-sm mt-2">Hãy là người đầu tiên đánh giá sản phẩm!</p>
              </div>
            )}
          </div>
        {/* Hiển thị các sản phẩm gợi ý */}
        <div className="mt-8 bg-gray-100 py-8 bg-white">
          <h2 className="text-2xl font-bold">Sản phẩm liên quan</h2>
          <div className="mt-6">
            <Swiper
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              breakpoints={{
                400: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                700: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
              }}
              modules={[Pagination, Autoplay]}
              className="h-[455px] sm:h-[488px] xl:h-[499px]"
            >
              {relatedBooks.length > 0 ? (
                relatedBooks.map((book) => (
                  <SwiperSlide key={book._id}>
                    <Item book={book} />
                  </SwiperSlide>
                ))
              ) : (
                <p className="text-center">Không có sản phẩm liên quan nào.</p>
              )}
            </Swiper>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopDetails;
