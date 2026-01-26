const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All payment routes require authentication
router.use(authMiddleware.authenticate);

// Create payment intent
router.post('/create-intent', paymentController.createPaymentIntent);

// Process payment
router.post('/process', paymentController.processPayment);

// Verify payment
router.post('/verify', paymentController.verifyPayment);

// Get payment details
router.get('/:paymentId', paymentController.getPaymentDetails);

// Get user payment history
router.get('/user/:userId', paymentController.getUserPaymentHistory);

// Refund payment
router.post('/:paymentId/refund', paymentController.refundPayment);

// Get payment methods
router.get('/methods/available', paymentController.getAvailablePaymentMethods);

// Add payment method (save card)
router.post('/methods/add', paymentController.addPaymentMethod);

// Get saved payment methods
router.get('/methods/saved', paymentController.getSavedPaymentMethods);

// Delete saved payment method
router.delete('/methods/:methodId', paymentController.deletePaymentMethod);

// Wallet operations
router.post('/wallet/add', paymentController.addToWallet);
router.get('/wallet/balance', paymentController.getWalletBalance);
router.get('/wallet/transactions', paymentController.getWalletTransactions);

// Apply coupon
router.post('/coupon/apply', paymentController.applyCoupon);
router.get('/coupon/validate/:code', paymentController.validateCoupon);

// Get payment analytics
router.get('/analytics/summary', paymentController.getPaymentAnalytics);

module.exports = router;
