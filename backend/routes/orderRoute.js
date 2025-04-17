import express from 'express';
import orderController from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/my-order', authMiddleware.verifyToken, orderController.getUserOrders); // Lấy danh sách đơn hàng của người dùng

export default router;