import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order_id: { type: String, unique: true },
    products: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
        },
    ],
    total_price: { type: Number, required: true },
    status: { type: String, enum: ['pending','shipping', 'delivered', 'cancelled'  ], default: 'pending' },
    shipping_info: {
        fullname: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
    },
    payment_method: { type: String,  required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
}
, { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
