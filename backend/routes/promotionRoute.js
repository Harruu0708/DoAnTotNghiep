import express from "express";
import promotionController from "../controllers/promotionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const promotionRouter = express.Router();

// Route để tạo khuyến mãi
promotionRouter.post('/create', authMiddleware.verifyTokenAndAdmin, promotionController.createPromotion);
promotionRouter.get('/get', authMiddleware.verifyTokenAndAdmin, promotionController.getPromotions);
promotionRouter.delete('/delete/:id', authMiddleware.verifyTokenAndAdmin, promotionController.deletePromotion);

export default promotionRouter;

