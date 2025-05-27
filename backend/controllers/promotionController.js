import Promotion from '../models/Promotion.js';
import Product from '../models/Product.js';
import promotionService from '../services/promotionService.js';

const promotionController = {
    createPromotion: async (req, res) => {
        try {
            // Lấy dữ liệu từ body request
            const { promotion_name, discount, start_date, end_date, description, isActive } = req.body;

            // Kiểm tra nếu có thông tin cần thiết
            if (!promotion_name || !discount || !start_date || !end_date) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            // Kiểm tra nếu discount nằm trong khoảng hợp lệ
            if (discount < 0 || discount > 100) {
                return res.status(400).json({ message: "Discount must be between 0 and 100" });
            }

            // Kiểm tra nếu start_date lớn hơn end_date
            if (new Date(start_date) > new Date(end_date)) {
                return res.status(400).json({ message: "Start date cannot be after end date" });
            }

            // Tạo đối tượng promotion mới
            const newPromotion = new Promotion({
                promotion_name,
                discount,
                start_date,
                end_date,
                description,
                isActive,
            });

            // Lưu vào cơ sở dữ liệu
            const savedPromotion = await newPromotion.save();

            // Trả về phản hồi khi tạo thành công
            res.status(201).json({ message: "Promotion created successfully", promotion: savedPromotion });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error", error });
        }
    },

    // Controller để lấy danh sách khuyến mãi
    getPromotions: async (req, res) => {
        try {
            const promotions = await Promotion.find(); // Lấy tất cả các khuyến mãi
            res.status(200).json({ promotions });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error", error });
        }
    },

    // Controller để xóa khuyến mãi
    deletePromotion: async (req, res) => {
        try {
            const { id } = req.params; // Lấy promotionId từ params

            // Tìm và xóa promotion theo id
            const deletedPromotion = await Promotion.findByIdAndDelete(id);

            // Nếu không tìm thấy promotion, trả về lỗi
            if (!deletedPromotion) {
                return res.status(404).json({ message: "Promotion not found" });
            }

            res.status(200).json({ message: "Promotion deleted successfully", promotion: deletedPromotion });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error", error });
        }
    },
};

export default promotionController;