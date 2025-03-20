import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

const productController = {
    getAllProduct: async (req, res) => {
        try {
            const products = await Product.find();
            res.json(products);
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    getProductDetails: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            res.json(product);
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    createProduct: async (req, res) => {
        try {
            const { name, category, publisher, discount_price, price, description, quantity,popular } = req.body;

            // Kiểm tra nếu có file ảnh được upload
            let imageUrl = "";
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "products", // Thư mục lưu trên Cloudinary
                    use_filename: true,
                    unique_filename: false,
                });
                imageUrl = result.secure_url; // Lấy URL ảnh từ Cloudinary
            } else {
                return res.status(400).json({ msg: "Vui lòng tải lên ảnh sản phẩm!" });
            }

            const product = new Product({
                name,
                category,
                publisher,
                image: imageUrl, // Lưu URL ảnh vào database
                discount_price,
                price,
                description,
                quantity,
                popular: popular || false,
            });

            await product.save();
            res.json({ msg: "Created a product", product });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

};

export default productController;