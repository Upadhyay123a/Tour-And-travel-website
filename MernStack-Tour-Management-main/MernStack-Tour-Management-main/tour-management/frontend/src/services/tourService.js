import api from './api';

export const tourService = {
  // Get all tours
  getAllTours: async () => {
    const response = await api.get('/tours');
    return response.data;
  },

  // Get featured tours
  getFeaturedTours: async () => {
    const response = await api.get('/tours/featured');
    return response.data;
  },

  // Get tour count
  getTourCount: async () => {
    const response = await api.get('/tours/count');
    return response.data;
  },

  // Get single tour
  getTourById: async (id) => {
    const response = await api.get(`/tours/${id}`);
    return response.data;
  },

  // Create new tour
  createTour: async (tourData) => {
    const response = await api.post('/tours', tourData);
    return response.data;
  },

  // Update tour
  updateTour: async (id, tourData) => {
    const response = await api.put(`/tours/${id}`, tourData);
    return response.data;
  },

  // Delete tour
  deleteTour: async (id) => {
    const response = await api.delete(`/tours/${id}`);
    return response.data;
  },
};
