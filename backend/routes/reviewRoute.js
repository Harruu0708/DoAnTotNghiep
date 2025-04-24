import express from 'express';
import reviewController from '../controllers/reviewController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { uploadReviewImage } from '../middlewares/multer.js';

const router = express.Router();

router.get('/:productId', reviewController.getAllProductReviews); // Lấy tất cả đánh giá của sản phẩm
router.post('/create', authMiddleware.verifyToken, uploadReviewImage.single('image'), reviewController.createReview);// Tạo đánh giá mới

export default router;
