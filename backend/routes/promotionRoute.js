import express from "express";
import promotionController from "../controllers/promotionController.js";
import { uploadText } from "../middlewares/multer.js";

const promotionRouter = express.Router();

// Route để tạo khuyến mãi
promotionRouter.post("/create",uploadText, promotionController.createPromotion);

export default promotionRouter;

