import Product from '../models/Product.js';
import Promotion from '../models/Promotion.js';

const promotionService = {
    applyPromotionToProduct: async () => {
        try {
            // Lấy ngày hôm nay
            const currentDate = new Date();

            // Tìm tất cả promotion có isActive = true và ngày hôm nay nằm trong khoảng start_date và end_date
            const activePromotions = await Promotion.find({
                isActive: true,
                start_date: { $lte: currentDate }, // start_date phải trước hoặc bằng ngày hôm nay
                end_date: { $gte: currentDate },   // end_date phải sau hoặc bằng ngày hôm nay
            });

            // Nếu không có promotion hợp lệ, gán discount_price về 0 cho tất cả sản phẩm
            if (activePromotions.length === 0) {
                const products = await Product.find();

                // Cập nhật discount_price về 0 cho tất cả sản phẩm
                const updatedProducts = [];
                for (let product of products) {
                    product.discount_price = 0;
                    updatedProducts.push(await product.save());
                }

                return { message: "No active promotions found, discount_price set to 0 for all products", updatedProducts };
            }

            // Nếu có promotion hợp lệ, áp dụng cho tất cả sản phẩm
            const updatedProducts = [];
            const products = await Product.find();
            for (let product of products) {
                // Áp dụng tất cả các promotion tìm được (giảm giá cho từng sản phẩm)
                for (let promotion of activePromotions) {
                    const discountAmount = (promotion.discount / 100) * product.price;
                    const newPrice = product.price - discountAmount;

                    // Cập nhật discount_price cho sản phẩm mà không cần promotion_id
                    product.discount_price = newPrice;

                    updatedProducts.push(await product.save());
                }
            }

            return { message: "Promotion applied to products successfully", updatedProducts };

        } catch (error) {
            console.error(error);
            throw new Error(error.message || "An error occurred while applying promotion to products");
        }
    },
};

export default promotionService;