import Review from '../models/Review.js';
import Product from '../models/Product.js';

const reviewController = {
    getAllProductReviews: async (req, res) => {
        try {
            const productId = req.params.productId;
        
            const reviews = await Review.find({ product: productId })
              .populate("user", "username") // Chỉ lấy tên user
              .sort({ createdAt: -1 }); // Mới nhất lên đầu
        
            res.status(200).json(reviews);
          } catch (err) {
            res.status(500).json({ message: "Lỗi server", error: err.message });
          }
    },
    createReview: async (req, res) => {
        try {
            const { product, rating, comment } = req.body;
            const user = req.user.id;
        
            // Kiểm tra sản phẩm tồn tại
            const existingProduct = await Product.findById(product);
            if (!existingProduct) {
              return res.status(404).json({ message: "Sản phẩm không tồn tại" });
            }
        
            // Kiểm tra đã đánh giá chưa
            const alreadyReviewed = await Review.findOne({ user, product });
            if (alreadyReviewed) {
              return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này rồi" });
            }
        
            // Lấy URL ảnh từ Cloudinary nếu có
            const image = req.file?.path || "";
        
            const review = new Review({
              user,
              product,
              rating,
              comment,
              image,
            });
        
            await review.save();
            res.status(201).json({ message: "Đánh giá đã được tạo", review });
          } catch (err) {
            res.status(500).json({ message: "Lỗi server", error: err.message });
          }
    },
};

export default reviewController;