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
};

export default orderController;