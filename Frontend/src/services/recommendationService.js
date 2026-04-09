import api from './api';

// Get personalized recommendations
export const getRecommendations = async () => {
  try {
    const response = await api.get('/recommendations');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get single outfit by ID
export const getOutfitById = async (id) => {
  try {
    const response = await api.get(`/recommendations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get recommendations by occasion
export const getRecommendationsByOccasion = async (occasion) => {
  try {
    const response = await api.get(`/recommendations/occasion/${occasion}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get recommendations by category
export const getRecommendationsByCategory = async (category) => {
  try {
    const response = await api.get(`/recommendations/category/${category}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Submit feedback for a recommendation
export const submitRecommendationFeedback = async (payload) => {
  try {
    const response = await api.post('/recommendations/feedback', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
