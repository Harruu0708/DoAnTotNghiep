import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Tham chiếu đến Product
    importDate: { type: Date, required: true, default: Date.now }, // Ngày nhập kho
    importPrice: { type: Number, required: true, min: 0 }, // Giá nhập kho
    quantity: { type: Number, required: true, min: 0 }, // Số lượng sản phẩm trong kho
},
    { timestamps: true } // Tự động thêm trường createdAt và updatedAt
);

const Warehouse = mongoose.model("Warehouse", warehouseSchema);

export default Warehouse;