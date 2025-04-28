import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { v4 as uuidv4 } from 'uuid';

const orderController = {
    createOrder: async (req, res) => {
        try {
            const userId = req.user.id;
            const { shipping_info, payment_method } = req.body;
    
            // Kiểm tra phương thức thanh toán phải là COD
            if (payment_method !== 'COD') {
                return res.status(400).json({ message: 'Phương thức thanh toán không hợp lệ cho đơn hàng COD' });
            }
    
            // Lấy giỏ hàng của người dùng
            const cart = await Cart.findOne({ userId }).populate('products.productId');
            if (!cart || cart.products.length === 0) {
                return res.status(400).json({ message: 'Giỏ hàng trống' });
            }
    
            // Kiểm tra số lượng sản phẩm và tính tổng tiền
            let total_price = 0;
            const orderProducts = [];
            
            for (const item of cart.products) {
                const product = item.productId;
                const quantity = item.quantity;
    
                // Kiểm tra số lượng tồn kho
                if (product.quantity < quantity) {
                    return res.status(400).json({ 
                        message: `Sản phẩm ${product.name} không đủ số lượng tồn kho` 
                    });
                }
    
                // Cập nhật số lượng tồn kho
                product.quantity -= quantity;
                await product.save();
    
                // Thêm vào danh sách sản phẩm đơn hàng
                orderProducts.push({
                    product_id: product._id,
                    quantity: quantity,
                });
    
                // Tính tổng tiền (ưu tiên giá khuyến mãi nếu có)
                const productPrice = product.discount_price || product.price;
                total_price += productPrice * quantity;
            }
    
            // Thêm phí vận chuyển (nếu có)
            total_price += 20; // 20.000đ phí vận chuyển
    
            // Tạo đơn hàng mới
            const newOrder = new Order({
                user_id: userId,
                order_id: uuidv4(),
                products: orderProducts,
                total_price: total_price,
                status: 'pending',
                shipping_info: shipping_info,
                payment_method: payment_method,
                isPaid: false, // COD nên chưa thanh toán
                paidAt: null,
            });
    
            // Lưu đơn hàng
            await newOrder.save();
            
            // Xóa giỏ hàng sau khi tạo đơn hàng thành công
            await Cart.findOneAndDelete({ userId });
    
            res.status(201).json({ 
                message: 'Tạo đơn hàng COD thành công', 
                order: newOrder 
            });
    
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng COD:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    },
    getUserOrders: async (req, res) => {
        try {
            const userId = req.user.id;
            const orders = await Order.find({ user_id: userId }).populate('products.product_id');
            res.status(200).json(orders);
        } catch (error) {
            console.error('Error fetching user orders:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    getAllOrders: async (req, res) => {
        try {
            // Admin có quyền truy cập tất cả đơn hàng, không cần phải lọc theo user_id
            const orders = await Order.find()
                .populate('products.product_id')  // Dùng populate để lấy thông tin sản phẩm từ các sản phẩm trong đơn hàng
                .sort({ createdAt: -1 });  // Sắp xếp đơn hàng theo thời gian tạo, từ mới nhất đến cũ nhất
            
            res.status(200).json(orders);
        } catch (error) {
            console.error('Error fetching all orders:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    updateOrderStatus: async (req, res) => {
        try {
          const orderId = req.params.id; // lấy ID từ URL
          const { status } = req.body; // trạng thái mới
      
          // Kiểm tra trạng thái hợp lệ
          const validStatuses = ['pending', 'shipping', 'delivered', 'cancelled'];
          if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
          }
          const updateData = { status };
      
          // Nếu trạng thái là 'delivered', tự động set isPaid: true và paidAt: thời gian hiện tại
          if (status === 'delivered') {
            updateData.isPaid = true;
            updateData.paidAt = new Date();
          }
      
          const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
          ).populate('products.product_id'); // populate nếu cần
      
          if (!updatedOrder) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
          }
      
          res.status(200).json({ message: 'Cập nhật trạng thái thành công', order: updatedOrder });
        } catch (error) {
          console.error('Error updating order status:', error);
          res.status(500).json({ message: 'Lỗi server' });
        }
    },
    countOrders: async (req, res) => {
        try {
            const totalOrders = await Order.countDocuments();
            res.status(200).json({ totalOrders });
        } catch (error) {
            console.error('Error counting orders:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    getWeeklyRevenue: async (req, res) => {
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
            // Tính doanh thu cho từng tuần trong tháng
            const weeks = [];
            let startOfWeek = startOfMonth;
            let endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); // Tính 7 ngày tiếp theo
            
            while (startOfWeek <= endOfMonth) {
                // Tính doanh thu cho mỗi tuần
                const revenueWeek = await Order.aggregate([
                    {
                        $match: {
                            createdAt: { $gte: startOfWeek, $lte: endOfWeek },
                            isPaid: true
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$total_price" }
                        }
                    }
                ]);
                
                weeks.push({
                    startOfWeek,
                    endOfWeek,
                    total: revenueWeek[0]?.total || 0
                });
                
                // Tiến đến tuần tiếp theo
                startOfWeek = new Date(endOfWeek);
                startOfWeek.setDate(startOfWeek.getDate() + 1);
                endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
            }
            
            res.status(200).json({ weeklyRevenue: weeks });
        } catch (error) {
            console.error('Error calculating weekly revenue in month:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    
    getMonthlyRevenue: async (req, res) => {
        try {
            const now = new Date();
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const endOfYear = new Date(now.getFullYear(), 12, 0);
    
            // Tính doanh thu cho từng tháng trong năm
            const months = [];
            let startOfMonth = startOfYear;
            let endOfMonth = new Date(startOfMonth);
            endOfMonth.setMonth(startOfMonth.getMonth() + 1);
            
            for (let month = 0; month < 12; month++) {
                // Tính doanh thu cho mỗi tháng
                const revenueMonth = await Order.aggregate([
                    {
                        $match: {
                            createdAt: { $gte: startOfMonth, $lt: endOfMonth },
                            isPaid: true
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$total_price" }
                        }
                    }
                ]);
                
                months.push({
                    month: startOfMonth.getMonth() + 1, // Tháng trong năm (1-12)
                    total: revenueMonth[0]?.total || 0
                });
                
                // Tiến đến tháng tiếp theo
                startOfMonth = new Date(endOfMonth);
                endOfMonth = new Date(startOfMonth);
                endOfMonth.setMonth(startOfMonth.getMonth() + 1);
            }
            
            res.status(200).json({ monthlyRevenue: months });
        } catch (error) {
            console.error('Error calculating monthly revenue in year:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    
    getYearlyRevenue: async (req, res) => {
        try {
            const now = new Date();
            const startOfYear = new Date(now.getFullYear(), 0, 1);
    
            const revenueYear = await Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startOfYear },
                        isPaid: true
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$total_price" }
                    }
                }
            ]);
    
            res.status(200).json({ revenueYear: revenueYear[0]?.total || 0 });
        } catch (error) {
            console.error('Error calculating yearly revenue:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
};

export default orderController;