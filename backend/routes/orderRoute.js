import express from 'express';
import orderController from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/my-order', authMiddleware.verifyToken, orderController.getUserOrders); // Lấy danh sách đơn hàng của người dùng
router.get('/count', authMiddleware.verifyTokenAndAdmin, orderController.countOrders); // Lấy số lượng đơn hàng của người dùng
router.get('/weekly', authMiddleware.verifyTokenAndAdmin, orderController.getWeeklyRevenue); // Lấy đơn hàng theo tuần
router.get('/monthly', authMiddleware.verifyTokenAndAdmin, orderController.getMonthlyRevenue); // Lấy đơn hàng theo tháng
router.get('/yearly', authMiddleware.verifyTokenAndAdmin, orderController.getYearlyRevenue); // Lấy đơn hàng theo năm
router.post('/create', authMiddleware.verifyToken, orderController.createOrder); // Tạo đơn hàng mới
router.get('/all', authMiddleware.verifyTokenAndAdmin, orderController.getAllOrders); // Lấy danh sách tất cả đơn hàng (admin)
router.put('/update-status/:id', authMiddleware.verifyTokenAndAdmin, orderController.updateOrderStatus);

export default router;