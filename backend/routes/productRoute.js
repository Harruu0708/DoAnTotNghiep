import express from "express";
import productController from "../controllers/productController.js";
import upload from "../middlewares/multer.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route để thêm sản phẩm (có upload ảnh)
router.post("/add", upload.single("image"), productController.createProduct);

// Route lấy danh sách sản phẩm
router.get("/all", productController.getAllProduct);

// Route lấy chi tiết một sản phẩm
router.get("/:id", productController.getProductDetails);

export default router;
