import api from './api';

// Get all favorites
export const getFavorites = async () => {
  try {
    const response = await api.get('/favorites');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Check if outfit is favorited
export const checkFavorite = async (outfitId) => {
  try {
    const response = await api.get(`/favorites/check/${outfitId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add outfit to favorites
export const addFavorite = async (outfitId) => {
  try {
    const response = await api.post(`/favorites/${outfitId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Remove outfit from favorites
export const removeFavorite = async (outfitId) => {
  try {
    const response = await api.delete(`/favorites/${outfitId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
