import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { v4 as uuidv4 } from 'uuid';

const orderController = {
    createOrder: async (req, res) => {
        try {
            const userId = req.user.id;
    
            const cart = await Cart.findOne({ userId }).populate('products.productId');
            if (!cart || cart.products.length === 0) {
                return res.status(400).json({ message: 'Cart is empty' });
            }
    
            let total_price = 0;
            const orderProducts = cart.products.map((item) => {
                const productPrice = item.productId.discount_price || item.productId.price;
                total_price += productPrice * item.quantity;
    
                return {
                    product_id: item.productId._id,
                    quantity: item.quantity,
                };
            });
    
            const newOrder = new Order({
                user_id: userId,
                order_id: uuidv4(),
                products: orderProducts,
                total_price,
                shipping_info: req.body.shipping_info,
                payment_method: req.body.payment_method,
                isPaid: false,
            });
    
            await newOrder.save();
            await Cart.findOneAndDelete({ userId });
    
            res.status(201).json({ message: 'Order created successfully', order: newOrder });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ message: 'Server error' });
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
      
          const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
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
};

export default orderController;