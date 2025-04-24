import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoute.js'; 
import productRouter from './routes/productRoute.js';
import promotionRouter from './routes/promotionRoute.js';
import cartRouter from './routes/cartRoute.js';
import paymentRouter from './routes/paymentRoute.js';
import orderRouter from './routes/orderRoute.js';
import reviewRouter from './routes/reviewRoute.js';

dotenv.config();
const app = express();
connectDB();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/promotion', promotionRouter);
app.use('/api/cart', cartRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/order', orderRouter);
app.use('/api/review', reviewRouter);

app.listen(8000, () =>{
    console.log('Server is running on port 8000');
})