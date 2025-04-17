import express from 'express';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.post('/momo', paymentController.createMoMoPayment);
router.post('/momo/notify', paymentController.handleMoMoNotify);

export default router;

