import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.get('/get-all', authMiddleware.verifyToken, userController.getAllUsers);
userRouter.delete('/delete/:id', authMiddleware.verifyTokenAndAdmind, userController.delete);

export default userRouter;