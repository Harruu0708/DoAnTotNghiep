import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';
import Promotion from '../models/Promotion.js';

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
            const { name, category, publisher,author, price, description, quantity,popular } = req.body;

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
                author,
                image: imageUrl, // Lưu URL ảnh vào database
                // discount_price: discount_price || null,
                price,
                description,
                quantity,
                popular: popular || false,
                // promotion_id: promotion_id || null,
            });

            await product.save();
            res.json({ msg: "Created a product", product });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
      
            const updatedProduct = await Product.findByIdAndUpdate(
              id,
              { $set: req.body }, // chỉ update các trường có trong req.body
              { new: true }       // trả về bản ghi sau khi cập nhật
            );
      
            if (!updatedProduct) {
              return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            }
      
            res.status(200).json(updatedProduct);
          } catch (err) {
            console.error('Lỗi khi cập nhật sản phẩm:', err);
            res.status(500).json({ message: 'Lỗi server' });
          }
    },

    countProducts: async (req, res) => {
        try {
            const count = await Product.countDocuments();
            res.json({ count });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    // Phương thức tính giá sau khi áp dụng mã giảm giá
    // applyPromotionToProducts: async (req, res) => {
    //     try {
    //         const { promotionId } = req.params;
    //         const promotion = await Promotion.findById(promotionId);
    
    //         if (!promotion) {
    //             return res.status(404).json({ msg: "Promotion not found" });
    //         }
    
    //         // Lấy danh sách sản phẩm cần cập nhật
    //         const products = await Product.find({ promotion_id: promotionId });
    
    //         // Cập nhật từng sản phẩm với giá mới
    //         const updatedProducts = await Promise.all(products.map(async (product) => {
    //             const newDiscountPrice = product.price * (1 - promotion.discount / 100);
    //             return Product.findByIdAndUpdate(product._id, { discount_price: newDiscountPrice }, { new: true });
    //         }));
    
    //         res.json({ msg: "Applied promotion to products", updatedProducts });
    //     } catch (error) {
    //         return res.status(500).json({ msg: error.message });
    //     }
    // },
    getLatestProducts: async (req, res) => {
        try {
            const latestProducts = await Product.find()
                .sort({ createdAt: -1 }) // Sắp xếp giảm dần theo ngày tạo (sản phẩm mới nhất trước)
                .limit(6); // Giới hạn lấy 6 sản phẩm
    
            res.json(latestProducts);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getPopularProducts: async (req, res) => {
        try {
            const products = await Product.find({ popular: true }).limit(5);
            res.json(products);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    checkProductAvailability: async (req, res) => {
        try {
            const { products } = req.body; 
            // products là mảng dạng [{ productId: "...", quantity: ... }, ...]

            if (!products || !Array.isArray(products)) {
                return res.status(400).json({ msg: "Danh sách sản phẩm không hợp lệ." });
            }

            const insufficientProducts = [];

            for (const item of products) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    insufficientProducts.push({ productId: item.productId, reason: "Không tìm thấy sản phẩm." });
                    continue;
                }

                if (product.quantity < item.quantity) {
                    insufficientProducts.push({
                        productId: item.productId,
                        name: product.name,
                        available: product.quantity,
                        requested: item.quantity,
                    });
                }
            }

            if (insufficientProducts.length > 0) {
                return res.status(400).json({
                    msg: "Một số sản phẩm không đủ số lượng.",
                    insufficientProducts,
                });
            }

            return res.json({ msg: "Tất cả sản phẩm đều còn đủ số lượng." });

        } catch (error) {
            console.error("Lỗi kiểm tra tồn kho:", error);
            return res.status(500).json({ msg: "Lỗi server khi kiểm tra tồn kho." });
        }
    },
};

export default productController;