import axios from "axios";
import crypto from "crypto";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js"; 

const paymentController = {
    createMoMoPayment : async (req, res) => {
        //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
        //parameters
        const userId = req.body.userId;
        const shippingAddress = req.body.shippingAddress;
        var accessKey = 'F8BBA842ECF85';
        var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        var orderInfo = 'pay with MoMo';
        var partnerCode = 'MOMO';
        var redirectUrl = 'http://localhost:5173/payment-result';
        var ipnUrl = 'https://1bed-117-6-160-164.ngrok-free.app/api/payment/momo/notify';
        var requestType = "payWithMethod";
        var amount = req.body.amount?.toString() || '50000';;
        var orderId = partnerCode + new Date().getTime();
        var requestId = orderId;
        const extraData = Buffer.from(JSON.stringify({ userId, shippingAddress })).toString("base64"); // 👈 encode userId
    
        // var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
        var orderGroupId ='';
        var autoCapture =true;
        var lang = 'vi';
    
        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
        //puts raw signature
        //signature
        var signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
    
        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode : partnerCode,
            partnerName : "Test",
            storeId : "MomoTestStore",
            requestId : requestId,
            amount : amount,
            orderId : orderId,
            orderInfo : orderInfo,
            redirectUrl : redirectUrl,
            ipnUrl : ipnUrl,
            lang : lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData : extraData,
            orderGroupId: orderGroupId,
            signature : signature
        });
        
        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Length': Buffer.byteLength(requestBody),
            },
            data: requestBody,
        };
    
        let result;
    
        try {
            result = await axios.request(options);
            return res.status(200).json({
                success: true,
                message: "Payment created successfully!",
                data: result.data,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "An error occurred while creating the payment.",
                error: error.message,
            });
        }
    },

    handleMoMoNotify: async (req, res) => {
        try {
            const { orderId, resultCode, extraData } = req.body;
            console.log("Raw extraData:", extraData);
            if (!extraData) {
                console.log("extraData not found");
                return res.status(400).json({ success: false, message: "extraData is missing" });
            }

            // Kiểm tra nếu thanh toán thành công (resultCode === 0)
            if (resultCode !== 0) {
                return res.status(400).json({ success: false, message: "Payment failed from MoMo" });
            }

            // Tách userId từ orderId: "MOMO_<userId>_<timestamp>"

            // Giải mã extraData
            const decoded = JSON.parse(Buffer.from(extraData, 'base64').toString());
            const userId = decoded.userId;
            const shippingAddress = decoded.shippingAddress;

            // Lấy giỏ hàng của người dùng
            const cart = await Cart.findOne({ userId }).populate("products.productId");

            if (!cart || cart.products.length === 0) {
                return res.status(404).json({ success: false, message: "Cart is empty or not found" });
            }

            // Tính tổng tiền
            let totalPrice = 0;
            const orderProducts = [];

            for (const item of cart.products) {
                const product = item.productId;
                const quantity = item.quantity;
            
                if (!product) {
                    return res.status(404).json({ success: false, message: "Product not found" });
                }
            
                if (product.quantity < quantity) {
                    return res.status(400).json({ success: false, message: `Product ${product.name} is out of stock` });
                }
            
                product.quantity -= quantity;
                await product.save();
            
                orderProducts.push({
                    product_id: product._id,
                    quantity,
                });
            
                totalPrice += (product.discount_price || product.price) * quantity;
            }
            totalPrice+= 20; // Thêm phí vận chuyển (30.000đ)
            

            // Tạo đơn hàng
            const newOrder = new Order({
                user_id: userId,
                order_id: orderId,
                products: orderProducts,
                total_price: totalPrice,
                status: "pending",
                shipping_info: {
                    fullname: shippingAddress.name,
                    address: shippingAddress.address,
                    phone: shippingAddress.phone
                },
                payment_method: "MoMo",
                isPaid: true,
                paidAt: new Date(),
            });

            await newOrder.save();

            // Xoá giỏ hàng
            await Cart.findOneAndDelete({ userId });

            return res.status(200).json({ success: true, message: "Order created successfully", order: newOrder });

        } catch (error) {
            console.error("MoMo notify error:", error);
            return res.status(500).json({ success: false, message: "Server error", error: error.message });
        }
    },


}

export default paymentController;