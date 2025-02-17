import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL); // Loại bỏ các tùy chọn lỗi thời
        console.log("MongoDB connected!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Thoát nếu kết nối thất bại
    }
};

export default connectDB;
