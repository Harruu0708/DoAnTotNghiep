import multer from 'multer';
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from '../config/cloudinary.js';
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products", // Tạo thư mục "products" trên Cloudinary
    format: async (req, file) => "png", // Định dạng ảnh (có thể đổi thành jpg, webp, ...)
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Tạo tên file duy nhất
  },
});

const upload = multer({ storage });

export default upload;