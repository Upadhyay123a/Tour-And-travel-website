const API_BASE_URL = 'http://localhost:8000/api/v1';

const bookingService = {
  // Get all bookings
  getAllBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings`);
    return response.json();
  },

  // Get bookings by user
  getUserBookings: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}`);
    return response.json();
  },

  // Create new booking
  createBooking: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    return response.json();
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
    });
    return response.json();
  },

  // Get booking statistics
  getBookingStats: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings/stats`);
    return response.json();
  },
};

export default bookingService;
