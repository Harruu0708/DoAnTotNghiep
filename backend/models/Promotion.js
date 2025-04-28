import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
    promotion_name: { type: String, required: true },
    discount: { type: Number, required: true, min: 0, max: 100 },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;