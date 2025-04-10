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
            const { productId, quantity } = req.body; // quantity ở đây là số cần cộng thêm (có thể âm hoặc dương)
    
            const cart = await Cart.findOne({ userId: req.user.id });
    
            if (!cart) return res.status(404).json({ msg: "Không tìm thấy giỏ hàng." });
    
            const productInCart = cart.products.find(
                (item) => item.productId.toString() === productId
            );
    
            if (!productInCart) {
                if (quantity > 0) {
                    // Nếu sản phẩm chưa có, thêm mới
                    cart.products.push({ productId, quantity });
                } else {
                    return res.status(400).json({ msg: "Không thể giảm số lượng của sản phẩm chưa có trong giỏ." });
                }
            } else {
                productInCart.quantity += quantity;
    
                if (productInCart.quantity <= 0) {
                    // Xóa sản phẩm nếu số lượng mới <= 0
                    cart.products = cart.products.filter(
                        (item) => item.productId.toString() !== productId
                    );
                }
            }
    
            await cart.save();
            await cart.populate('products.productId');
    
            return res.json(cart);
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