const API_BASE_URL = 'http://localhost:8000/api/v1';

const analyticsService = {
  // Get revenue analytics
  getRevenueAnalytics: async (timeRange = 'month') => {
    const response = await fetch(`${API_BASE_URL}/analytics/revenue?timeRange=${timeRange}`);
    return response.json();
  },

  // Get booking analytics
  getBookingAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/bookings`);
    return response.json();
  },

  // Get user analytics
  getUserAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/users`);
    return response.json();
  },

  // Get tour analytics
  getTourAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/tours`);
    return response.json();
  },

  // Get performance metrics
  getPerformanceMetrics: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/performance`);
    return response.json();
  },

  // Get real-time data
  getRealTimeData: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/realtime`);
    return response.json();
  },
};

export default analyticsService;
