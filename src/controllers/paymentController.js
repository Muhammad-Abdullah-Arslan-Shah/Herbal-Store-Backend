// controllers/paymentController.js
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const { JAZZCASH_MERCHANT_ID, JAZZCASH_PASSWORD, JAZZCASH_INTEGRITY_SALT, JAZZCASH_BASE_URL } = process.env;

const getTransactionId = () => new Date().getTime().toString();

const generateSignature = (params) => {
    const sortedKeys = Object.keys(params).sort();
    const signString = sortedKeys.map(key => params[key]).join('&');
    return crypto.createHmac('sha256', JAZZCASH_INTEGRITY_SALT)
                 .update(signString)
                 .digest('hex');
};

export const initiatePayment = async (req, res) => {
    try {
        const { amount, mobileNumber, email } = req.body;

        const transactionId = getTransactionId();
        const dateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

        // JazzCash required parameters
        const payload = {
            pp_Version: '2.0',
            pp_TxnType: 'MWALLET',
            pp_Language: 'EN',
            pp_MerchantID: JAZZCASH_MERCHANT_ID,
            pp_Password: JAZZCASH_PASSWORD,
            pp_TxnRefNo: transactionId,
            pp_Amount: (amount * 100).toString(), // Convert to paisa
            pp_TxnCurrency: 'PKR',
            pp_TxnDateTime: dateTime,
            pp_BillReference: 'billRef',
            pp_Description: 'Payment for herbal store products',
            pp_ReturnURL: 'https://yourdomain.com/payment-response',
            ppmpf_1: mobileNumber,
            ppmpf_2: email
        };

        // Generate SecureHash
        payload.pp_SecureHash = generateSignature(payload);

        // Send request to JazzCash
        const response = await axios.post(JAZZCASH_BASE_URL, payload);

        if (response.data.pp_ResponseCode === '000') {
            return res.status(200).json({
                success: true,
                message: 'Transaction successful',
                data: response.data
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Transaction failed',
                data: response.data
            });
        }
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({ success: false, message: 'Payment failed', error: error.message });
    }
};
