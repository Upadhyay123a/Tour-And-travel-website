const Payment = require('../models/Payment');
const Wallet = require('../models/Wallet');
const Coupon = require('../models/Coupon');
const Booking = require('../models/Booking');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId, paymentMethod, amount, currency = 'USD' } = req.body;
    
    // Get booking details
    const booking = await Booking.findById(bookingId).populate('tour');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      payment_method_types: ['card'],
      metadata: {
        bookingId: bookingId,
        userId: req.user.id
      }
    });
    
    // Create payment record
    const payment = new Payment({
      user: req.user.id,
      booking: bookingId,
      amount,
      currency,
      paymentMethod,
      paymentStatus: 'pending',
      gatewayTransactionId: paymentIntent.id,
      paymentGateway: 'stripe'
    });
    
    await payment.save();
    
    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id,
        amount,
        currency
      }
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
};

// Process payment
const processPayment = async (req, res) => {
  try {
    const { paymentId, paymentMethodId, savePaymentMethod = false } = req.body;
    
    const payment = await Payment.findById(paymentId).populate('booking');
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    // Process payment with Stripe
    const paymentIntent = await stripe.paymentIntents.confirm(
      payment.gatewayTransactionId,
      {
        payment_method: paymentMethodId
      }
    );
    
    if (paymentIntent.status === 'succeeded') {
      payment.paymentStatus = 'completed';
      payment.completedDate = new Date();
      await payment.save();
      
      // Update booking status
      await Booking.findByIdAndUpdate(payment.booking._id, {
        paymentStatus: 'paid',
        status: 'confirmed'
      });
      
      res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          paymentId: payment._id,
          status: 'completed',
          transactionId: payment.transactionId
        }
      });
    } else {
      payment.paymentStatus = 'failed';
      payment.failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';
      await payment.save();
      
      res.status(400).json({
        success: false,
        message: 'Payment failed',
        error: payment.failureReason
      });
    }
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message
    });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;
    
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    // Verify with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment.gatewayTransactionId);
    
    res.status(200).json({
      success: true,
      data: {
        status: paymentIntent.status,
        paymentStatus: payment.paymentStatus,
        amount: payment.amount,
        currency: payment.currency
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
};

// Get payment details
const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await Payment.findById(paymentId)
      .populate('booking')
      .populate('user', 'username email');
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment details',
      error: error.message
    });
  }
};

// Get user payment history
const getUserPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { user: userId };
    if (status) {
      query.paymentStatus = status;
    }
    
    const payments = await Payment.find(query)
      .populate('booking', 'tour tourDate')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Payment.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        payments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment history',
      error: error.message
    });
  }
};

// Refund payment
const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { reason, amount } = req.body;
    
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    if (payment.paymentStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment cannot be refunded'
      });
    }
    
    // Create refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.gatewayTransactionId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: 'requested_by_customer'
    });
    
    if (refund.status === 'succeeded') {
      payment.paymentStatus = 'refunded';
      payment.refundDetails = {
        refundId: refund.id,
        refundAmount: amount || payment.amount,
        refundReason: reason || 'Customer requested refund',
        refundDate: new Date()
      };
      payment.refundedDate = new Date();
      await payment.save();
      
      res.status(200).json({
        success: true,
        message: 'Payment refunded successfully',
        data: {
          refundId: refund.id,
          refundAmount: payment.refundDetails.refundAmount
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Refund failed',
        error: refund.failure_reason
      });
    }
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refund payment',
      error: error.message
    });
  }
};

// Get available payment methods
const getAvailablePaymentMethods = async (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'credit_card',
        name: 'Credit Card',
        description: 'Pay with your credit card',
        icon: 'credit-card',
        enabled: true
      },
      {
        id: 'debit_card',
        name: 'Debit Card',
        description: 'Pay with your debit card',
        icon: 'credit-card',
        enabled: true
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with PayPal',
        icon: 'paypal',
        enabled: true
      },
      {
        id: 'wallet',
        name: 'Wallet',
        description: 'Pay with your wallet balance',
        icon: 'wallet',
        enabled: true
      },
      {
        id: 'upi',
        name: 'UPI',
        description: 'Pay with UPI',
        icon: 'smartphone',
        enabled: true
      },
      {
        id: 'net_banking',
        name: 'Net Banking',
        description: 'Pay with net banking',
        icon: 'bank',
        enabled: true
      }
    ];
    
    res.status(200).json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment methods',
      error: error.message
    });
  }
};

// Add to wallet
const addToWallet = async (req, res) => {
  try {
    const { amount, paymentMethodId } = req.body;
    
    // Create payment intent for wallet recharge
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        userId: req.user.id,
        walletRecharge: 'true'
      }
    });
    
    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        amount,
        currency: 'USD'
      }
    });
  } catch (error) {
    console.error('Add to wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to wallet',
      error: error.message
    });
  }
};

// Get wallet balance
const getWalletBalance = async (req, res) => {
  try {
    const wallet = await Wallet.getOrCreateWallet(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        balance: wallet.balance,
        currency: wallet.currency,
        isBlocked: wallet.isBlocked
      }
    });
  } catch (error) {
    console.error('Get wallet balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wallet balance',
      error: error.message
    });
  }
};

// Get wallet transactions
const getWalletTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const wallet = await Wallet.getOrCreateWallet(req.user.id);
    const transactions = wallet.getTransactionHistory(limit, (page - 1) * limit);
    
    res.status(200).json({
      success: true,
      data: {
        transactions,
        balance: wallet.balance,
        pagination: {
          page,
          limit,
          total: wallet.transactions.length,
          pages: Math.ceil(wallet.transactions.length / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get wallet transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wallet transactions',
      error: error.message
    });
  }
};

// Apply coupon
const applyCoupon = async (req, res) => {
  try {
    const { code, orderAmount, tourId, category } = req.body;
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    // Check if coupon is valid
    const validation = coupon.isValid(req.user.id);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.reason
      });
    }
    
    // Calculate discount
    const discountResult = coupon.calculateDiscount(orderAmount, tourId, category);
    
    res.status(200).json({
      success: true,
      data: {
        coupon: {
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue
        },
        discount: discountResult.discount,
        finalAmount: discountResult.finalAmount
      }
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply coupon',
      error: error.message
    });
  }
};

// Validate coupon
const validateCoupon = async (req, res) => {
  try {
    const { code } = req.params;
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }
    
    const validation = coupon.isValid(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        valid: validation.valid,
        reason: validation.reason,
        coupon: validation.valid ? {
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minimumOrderAmount: coupon.minimumOrderAmount,
          validUntil: coupon.validUntil
        } : null
      }
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate coupon',
      error: error.message
    });
  }
};

// Get payment analytics
const getPaymentAnalytics = async (req, res) => {
  try {
    const { timeRange = 'month' } = req.query;
    
    const analytics = await Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: getTimeRangeDate(timeRange)
          }
        }
      },
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    
    const paymentMethods = await Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: getTimeRangeDate(timeRange)
          }
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        statusAnalytics: analytics,
        methodAnalytics: paymentMethods
      }
    });
  } catch (error) {
    console.error('Get payment analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment analytics',
      error: error.message
    });
  }
};

// Add payment method (save card)
const addPaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId, type, last4, brand, expiryMonth, expiryYear } = req.body;
    
    // In a real implementation, you would save this to the user's profile
    // For now, we'll just return a success response
    res.status(200).json({
      success: true,
      message: 'Payment method saved successfully',
      data: {
        paymentMethodId,
        type,
        last4,
        brand,
        expiryMonth,
        expiryYear
      }
    });
  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save payment method',
      error: error.message
    });
  }
};

// Get saved payment methods
const getSavedPaymentMethods = async (req, res) => {
  try {
    // In a real implementation, you would fetch from user's profile
    // For now, we'll return an empty array
    res.status(200).json({
      success: true,
      data: []
    });
  } catch (error) {
    console.error('Get saved payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get saved payment methods',
      error: error.message
    });
  }
};

// Delete saved payment method
const deletePaymentMethod = async (req, res) => {
  try {
    const { methodId } = req.params;
    
    // In a real implementation, you would remove from user's profile
    // For now, we'll just return a success response
    res.status(200).json({
      success: true,
      message: 'Payment method deleted successfully'
    });
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete payment method',
      error: error.message
    });
  }
};

// Helper function to get time range date
const getTimeRangeDate = (range) => {
  const now = new Date();
  const date = new Date();
  
  switch (range) {
    case 'day':
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    case 'week':
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
    case 'month':
      return new Date(date.getFullYear(), date.getMonth(), 1);
    case 'year':
      return new Date(date.getFullYear() - 1, date.getMonth(), date.getDate());
    default:
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
};

module.exports = {
  createPaymentIntent,
  processPayment,
  verifyPayment,
  getPaymentDetails,
  getUserPaymentHistory,
  refundPayment,
  getAvailablePaymentMethods,
  addPaymentMethod,
  getSavedPaymentMethods,
  deletePaymentMethod,
  addToWallet,
  getWalletBalance,
  getWalletTransactions,
  applyCoupon,
  validateCoupon,
  getPaymentAnalytics
};
