import { useParams } from "react-router-dom";
import {books} from "../assets/data";

import Footer from "../components/Footer";

const ShopDetails = () => {
  const { id} = useParams();
  const book = books.find((b) => b._id.toString() === id);

  if (!book) {
    return <h2 className="text-center text-red-500 medium-24 pt-28">Không tìm thấy sách</h2>;
  }

  return (
    <div className="max-padd-container py-10">
     <div className="pt-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hình ảnh sách (giả sử có book.image) */}
            <div className="flexCenter bg-white p-6 rounded-3xl overflow-hidden">
            <img src={book.image} alt={book.title} className="w-full max-w-[400px] rounded-xl shadow-lg shadow-slate-900/30" />
            </div>

            {/* Chi tiết sách */}
            <div className="bg-white p-2 mt-3 rounded-lg">
                <h1 className="bold-32">{book.title}</h1>
                <p className="medium-18 text-gray-600">Tác giả: {book.author}</p>
                <p className="medium-20 text-secondary mt-4">Giá: {book.price} VND</p>
                <p className="regular-16 text-gray-700 mt-6">{book.description}</p>

            {/* Nút mua hàng */}
            <button className="btn-secondary mt-6">Thêm vào giỏ hàng</button>
            </div>
        </div>
      </div>
        <Footer />
    </div>
  );
};

export default ShopDetails;
