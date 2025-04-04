import Cart from '../models/Cart.js';

const cartController = {
    getUserCart: async (req, res) => {
        try {
            const cart = await Cart.find({ userId: req.user.id }).populate('products.productId');
            res.json(cart);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    addToCart: async (req, res) => {
        try {
            const { productId, quantity } = req.body;
            let cart = await Cart.findOne({ userId: req.user.id });
    
            if (cart) {
                // Tìm sản phẩm trong giỏ hàng
                const existingProduct = cart.products.find(p => p.productId.toString() === productId);
    
                if (existingProduct) {
                    // Nếu sản phẩm đã tồn tại, tăng số lượng
                    existingProduct.quantity += quantity;
                } else {
                    // Nếu sản phẩm chưa tồn tại, thêm vào danh sách sản phẩm
                    cart.products.push({ productId, quantity });
                }
    
                await cart.save();
            } else {
                // Nếu giỏ hàng chưa tồn tại, tạo mới
                cart = await Cart.create({
                    userId: req.user.id,
                    products: [{ productId, quantity }]
                });
            }
    
            // Populate để trả về đầy đủ thông tin sản phẩm
            await cart.populate('products.productId');
    
            res.json(cart);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    
    updateCart: async (req, res) => {
        try {
            const { productId, quantity } = req.body;
    
            if (quantity === 0) {
                return cartController.removeProduct(req, res);  // Xóa sản phẩm nếu quantity = 0
            }
    
            const cart = await Cart.findOneAndUpdate(
                { userId: req.user.id, 'products.productId': productId },
                { $set: { 'products.$.quantity': quantity } },
                { new: true }
            ).populate('products.productId');
    
            res.json(cart);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },    
    removeProduct: async (req, res) => {
        try {
            const { productId } = req.body;
            const cart = await Cart.findOneAndUpdate(
                { userId: req.user.id },
                { $pull: { products: { productId } } },
                { new: true }
            ).populate('products.productId');
            res.json(cart);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    clearCart: async (req, res) => {
        try {
            await Cart.deleteOne({ userId: req.user.id });
            res.json({ msg: "Cart cleared" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
};

export default cartController;