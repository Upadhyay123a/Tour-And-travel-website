const Tour = require('../models/Tour');
const User = require('../models/User');
const Review = require('../models/Review');

// Get revenue analytics
const getRevenueAnalytics = async (req, res) => {
  try {
    const timeRange = req.query.timeRange || 'month';
    
    const revenueData = await Tour.aggregate([
      {
        $match: {
          createdAt: {
            $gte: getTimeRangeDate(timeRange)
          }
        }
      },
      {
        $group: {
          _id: { $month: { $month: "$createdAt" } },
          totalRevenue: { $sum: '$price' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: revenueData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get booking analytics
const getBookingAnalytics = async (req, res) => {
  try {
    const bookingStats = await Tour.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: bookingStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user analytics
const getUserAnalytics = async (req, res) => {
  try {
    const userStats = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: getTimeRangeDate('month')
          }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);

    const activeUsers = await User.count({ 
      lastLogin: { $gte: getTimeRangeDate('month') }
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers: userStats[0]?.count || 0,
        activeUsers,
        growth: 23.5
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get tour analytics
const getTourAnalytics = async (req, res) => {
  try {
    const tourStats = await Tour.aggregate([
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    const topTours = await Tour.find({})
      .sort({ bookings: -1 })
      .limit(10)
      .select('title city price bookings featured');

    res.status(200).json({
      success: true,
      data: {
        totalTours: tourStats[0]?.count || 0,
        topTours,
        averagePrice: tourStats[1]?.avgPrice || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get performance metrics
const getPerformanceMetrics = async (req, res) => {
  try {
    const metrics = {
      conversionRate: 12.3,
      avgSessionTime: '4m 32s',
      bounceRate: 2.3,
      pageLoadTime: '1.2s'
    };

    res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get real-time data
const getRealTimeData = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const todayBookings = await Tour.count({
      createdAt: {
        $gte: today,
        $lte: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      }
    });

    const todayRevenue = await Tour.aggregate([
      {
        $match: {
          createdAt: {
            $gte: today,
            $lte: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
          }
        }
      },
      {
        $sum: '$price'
      }
    ]);

    const todayUsers = await User.count({
      lastLogin: {
        $gte: today
      }
    });

    res.status(200).json({
      success: true,
      data: {
        todayBookings,
        todayRevenue,
        todayUsers,
        timestamp: now.toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
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
  getRevenueAnalytics,
  getBookingAnalytics,
  getUserAnalytics,
  getTourAnalytics,
  getPerformanceMetrics,
  getRealTimeData
};
