import express from 'express';
import orderController from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/my-order', authMiddleware.verifyToken, orderController.getUserOrders); // Lấy danh sách đơn hàng của người dùng
router.post('/create', authMiddleware.verifyToken, orderController.createOrder); // Tạo đơn hàng mới
router.get('/all', authMiddleware.verifyTokenAndAdmin, orderController.getAllOrders); // Lấy danh sách tất cả đơn hàng (admin)
router.put('/update-status/:id', authMiddleware.verifyTokenAndAdmin, orderController.updateOrderStatus);

export default router;