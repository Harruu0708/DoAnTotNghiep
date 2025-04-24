import Warehouse from '../models/Warehouse.js';
import Product from '../models/Product.js';

const warehouseController = {
    // Thêm sản phẩm vào kho
    addProductToWarehouse: async (req, res) => {
        try {
            const { productId, importDate, importPrice, quantity } = req.body;
    
            // Kiểm tra sự tồn tại của productId trong bảng Product
            const existingProduct = await Product.findById(productId);
            if (!existingProduct) {
                return res.status(404).json({ message: "Product not found." });
            }
    
            // Tạo bản ghi mới trong kho
            const warehouseEntry = new Warehouse({
                productId,
                importDate,
                importPrice,
                quantity
            });
    
            await warehouseEntry.save();
    
            res.status(201).json({ message: "Product added to warehouse successfully.", data: warehouseEntry });
        } catch (error) {
            console.error("Error adding product to warehouse:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    },
    getAllWarehouseProducts: async (req, res) => {
        try {
            const warehouseProducts = await Warehouse.find()
                .populate('productId') // Lấy thông tin chi tiết sản phẩm từ bảng Product
                .sort({ createdAt: -1 }); // Sắp xếp mới nhất lên trước (tuỳ chọn)
    
            res.status(200).json({ data: warehouseProducts });
        } catch (error) {
            console.error("Error fetching warehouse products:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    },
};

export default warehouseController;