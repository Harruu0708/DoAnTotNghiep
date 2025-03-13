import express from "express";
import authController from "../controllers/authControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);

//Refresh
authRouter.post("/refresh", authController.requestRefreshToken);

//Logout
authRouter.post("/logout", authController.logout);
export default authRouter;