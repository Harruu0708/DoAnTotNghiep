import Warehouse from '../models/Warehouse.js';
import Product from '../models/Product.js';

const warehouseController = {
    // Thêm sản phẩm vào kho
    addProductToWarehouse: async (req, res) => {
        try {
            const { productId, importPrice, quantity, importDate } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!productId || importPrice == null || quantity == null) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            // Kiểm tra importPrice và quantity có hợp lệ không
            if (importPrice < 0 || quantity < 0) {
                return res.status(400).json({ message: "Import price and quantity must be non-negative" });
            }

            // Kiểm tra xem sản phẩm có tồn tại không
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            // Xử lý ngày nhập kho
            const parsedImportDate = importDate ? new Date(importDate) : new Date();
            if (isNaN(parsedImportDate.getTime())) {
                return res.status(400).json({ message: "Invalid import date format" });
            }

            // Tạo bản ghi warehouse
            const newWarehouseEntry = new Warehouse({
                productId,
                importPrice,
                quantity,
                importDate: parsedImportDate,
            });

            const savedEntry = await newWarehouseEntry.save();

            res.status(201).json({ message: "Product added to warehouse successfully", warehouse: savedEntry });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error", error });
        }
    },

    getAllWarehouseProducts: async (req, res) => {
        try {
            // Lấy danh sách tất cả warehouse, populate thông tin sản phẩm
            const warehouseProducts = await Warehouse.find()
                .populate('productId', 'name price image quantity') // chỉ lấy một số trường cần thiết từ Product
                .sort({ createdAt: -1 }); // mới nhất lên trước
            res.status(200).json({ warehouseProducts });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error", error });
        }
    },
};

export default warehouseController;