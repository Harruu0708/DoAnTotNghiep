import express from "express";
import productController from "../controllers/productController.js";
import {uploadImage} from "../middlewares/multer.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route để thêm sản phẩm (có upload ảnh)
router.post("/add",authMiddleware.verifyTokenAndAdmin, uploadImage.single("image"), productController.createProduct);

// Route lấy danh sách sản phẩm
router.get("/all", productController.getAllProduct);

router.get("/latest", productController.getLatestProducts);

router.get("/popular", productController.getPopularProducts);

// Route để cập nhật sản phẩm (có upload ảnh)
router.patch("/update/:id", authMiddleware.verifyTokenAndAdmin, productController.updateProduct);

//Route để đếm số sản phẩm
router.get("/count",authMiddleware.verifyTokenAndAdmin, productController.countProducts);

// Route lấy chi tiết một sản phẩm
router.get("/:id", productController.getProductDetails);

// Route để áp dụng mã giảm giá cho sản phẩm (có thể tùy chỉnh điều kiện)
// router.post("/apply/:promotionId", productController.applyPromotionToProducts);


export default router;
