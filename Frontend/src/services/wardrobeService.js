import api from './api';

// Get all wardrobe items
export const getWardrobeItems = async () => {
  try {
    const response = await api.get('/wardrobe');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get wardrobe statistics
export const getWardrobeStats = async () => {
  try {
    const response = await api.get('/wardrobe/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get single wardrobe item
export const getWardrobeItemById = async (id) => {
  try {
    const response = await api.get(`/wardrobe/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add item to wardrobe
export const addWardrobeItem = async (itemData) => {
  try {
    const response = await api.post('/wardrobe', itemData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update wardrobe item
export const updateWardrobeItem = async (id, itemData) => {
  try {
    const response = await api.put(`/wardrobe/${id}`, itemData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete wardrobe item
export const deleteWardrobeItem = async (id) => {
  try {
    const response = await api.delete(`/wardrobe/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Toggle favorite status
export const toggleWardrobeFavorite = async (id) => {
  try {
    const response = await api.patch(`/wardrobe/${id}/favorite`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Increment times worn
export const incrementTimesWorn = async (id) => {
  try {
    const response = await api.patch(`/wardrobe/${id}/wear`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Analyze clothing image (AI background removal + auto-tag) and add to wardrobe
export const analyzeClothing = async (base64Image, name) => {
  try {
    const response = await api.post('/wardrobe/analyze', {
      image: base64Image,
      name: name || '',
    }, { timeout: 60000 }); // 60s timeout for AI processing
    return response.data;
  } catch (error) {
    throw error;
  }
};

