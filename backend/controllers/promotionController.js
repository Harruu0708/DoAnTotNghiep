import Promotion from '../models/Promotion.js';
import Product from '../models/Product.js';

const promotionController = {
    createPromotion: async (req, res) => {
        try {
            const { promotion_name, discount, start_date, end_date } = req.body;
            const newPromotion = new Promotion({
                promotion_name,
                discount,
                start_date,
                end_date
            });
            await newPromotion.save();

            // Gán promotion_id cho tất cả sản phẩm cần áp dụng mã giảm giá (có thể tùy chỉnh điều kiện)
            // const updatedProducts = await Product.updateMany(
            //     {},  // Điều kiện tìm kiếm các sản phẩm (ở đây là tất cả các sản phẩm)
            //     { 
            //         $set: { promotion_id: newPromotion._id } // Gán promotion_id cho các sản phẩm
            //     }
            // );

            res.json({ msg: "Created a promotion and applied it to products", newPromotion });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
};

export default promotionController;