import api from './api';

export const reviewService = {
  // Get all reviews
  getAllReviews: async () => {
    const response = await api.get('/reviews');
    return response.data;
  },

  // Get reviews for a specific tour
  getTourReviews: async (tourId) => {
    const response = await api.get(`/reviews/tour/${tourId}`);
    return response.data;
  },

  // Create new review
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Update review
  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  // Delete review
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};
