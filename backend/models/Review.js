import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Tham chiếu đến User
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Tham chiếu đến Product
    rating: { type: Number, required: true, min: 1, max: 5 }, // Đánh giá từ 1 đến 5 sao
    comment: { type: String, default: '' }, // Bình luận của người dùng
    image : { type: String,  default: '' }, // Lưu URL ảnh trên Cloudinary (nếu có)
},
    { timestamps: true } // Tự động thêm trường createdAt và updatedAt
)

const Review = mongoose.model("Review", reviewSchema);

export default Review;