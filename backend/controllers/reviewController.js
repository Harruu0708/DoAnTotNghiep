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
    getReviewStatistics: async (req, res) => {
      try {
        // Kiểm tra quyền admin
        if (!req.user.admin) {
            return res.status(403).json({ message: "Bạn không có quyền truy cập" });
        }

        const stats = await Review.aggregate([
            {
                $group: {
                    _id: "$product",
                    totalReviews: { $sum: 1 },
                    averageRating: { $avg: "$rating" },
                    // Thêm count cho từng rating
                    rating5: {
                        $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] }
                    },
                    rating4: {
                        $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] }
                    },
                    rating3: {
                        $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] }
                    },
                    rating2: {
                        $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] }
                    },
                    rating1: {
                        $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] }
                    }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $project: {
                    productId: "$_id",
                    productName: "$productDetails.name",
                    totalReviews: 1,
                    averageRating: { $round: ["$averageRating", 1] },
                    // Giữ lại các trường rating count
                    ratings: {
                        fiveStars: "$rating5",
                        fourStars: "$rating4",
                        threeStars: "$rating3",
                        twoStars: "$rating2",
                        oneStar: "$rating1"
                    },
                    _id: 0
                }
            },
            {
                $sort: { totalReviews: -1 }
            }
        ]);

        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  },
};

export default reviewController;