const API_BASE_URL = 'http://localhost:8000/api/v1';

const notificationService = {
  // Get notifications for a user
  getUserNotifications: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/notifications/user/${userId}`);
    return response.json();
  },

  // Get unread notifications count
  getUnreadCount: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/notifications/user/${userId}/unread`);
    return response.json();
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
    return response.json();
  },

  // Mark all notifications as read
  markAllAsRead: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/notifications/user/${userId}/read-all`, {
      method: 'PUT',
    });
    return response.json();
  },

  // Create notification
  createNotification: async (notificationData) => {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData),
    });
    return response.json();
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

export default notificationService;
