import express from 'express';
import cartController from '../controllers/cartController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Lấy giỏ hàng của người dùng
router.get('/', authMiddleware.verifyToken, cartController.getUserCart);
// Thêm sản phẩm vào giỏ hàng
router.post('/add', authMiddleware.verifyToken, cartController.addToCart);

//Xóa sản phẩm khỏi giỏ hàng
router.delete('/remove', authMiddleware.verifyToken, cartController.removeProduct);

export default router;