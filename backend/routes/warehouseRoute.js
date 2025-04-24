import express from 'express';
import warehouseController from '../controllers/warehouseController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
// Lấy tất cả sản phẩm trong kho
router.get('/', authMiddleware.verifyTokenAndAdmin, warehouseController.getAllWarehouseProducts);
// Thêm sản phẩm vào kho
router.post('/add', authMiddleware.verifyTokenAndAdmin, warehouseController.addProductToWarehouse);

export default router;