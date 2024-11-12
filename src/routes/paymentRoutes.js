// routes/paymentRoutes.js
import express from 'express';
import { initiatePayment } from '../controllers/paymentController.js';

const router = express.Router();
// Define the payment route
router.post('/pay', initiatePayment);

export default router;
