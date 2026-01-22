const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Analytics routes
router.get('/revenue', analyticsController.getRevenueAnalytics);
router.get('/bookings', analyticsController.getBookingAnalytics);
router.get('/users', analyticsController.getUserAnalytics);
router.get('/tours', analyticsController.getTourAnalytics);
router.get('/performance', analyticsController.getPerformanceMetrics);
router.get('/realtime', analyticsController.getRealTimeData);

module.exports = router;
