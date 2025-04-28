import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String },
  publisher: { type: String },
  image: { type: String }, // Lưu URL ảnh trên Cloudinary
  discount_price: { type: Number },
  price: { type: Number, required: true },
  description: { type: String },
  quantity: { type: Number, required: true },
  popular: { type: Boolean, default: false }, 
}
,{ timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
