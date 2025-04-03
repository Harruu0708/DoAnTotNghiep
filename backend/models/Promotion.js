import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
    promotion_name: { type: String, required: true },
    discount: { type: Number, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
}, { timestamps: true });

const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;