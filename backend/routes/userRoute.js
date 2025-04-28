import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { uploadUserImage } from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.get('/get-all', authMiddleware.verifyTokenAndAdmin, userController.getAllUsers);
userRouter.delete('/delete/:id', authMiddleware.verifyTokenAndAdmin, userController.delete);
userRouter.patch('/update-info', authMiddleware.verifyToken, uploadUserImage.single('avatar'), userController.updateUserInfo);
userRouter.get('/info', authMiddleware.verifyToken, userController.getUserInfo);
userRouter.get('/count', authMiddleware.verifyTokenAndAdmin, userController.countUsers);

export default userRouter;