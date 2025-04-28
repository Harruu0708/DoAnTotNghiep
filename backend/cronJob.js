import cron from 'node-cron';
import promotionService from './services/promotionService.js';

cron.schedule("*/1 * * * *", async () => {
    console.log("Đang cập nhật giá khuyến mãi...");
    await promotionService.applyPromotionToProduct();
    console.log("Cập nhật giá khuyến mãi thành công!");
});

