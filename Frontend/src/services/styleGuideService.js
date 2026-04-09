/* eslint-disable no-useless-catch */
import api from './api';

// Get all styles with optional filters
export const getStyles = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.tags) params.append('tags', Array.isArray(filters.tags) ? filters.tags.join(',') : filters.tags);
    if (filters.season) params.append('season', filters.season);
    if (filters.occasion) params.append('occasion', filters.occasion);
    if (filters.priceRange) params.append('priceRange', filters.priceRange);
    if (filters.bodyType) params.append('bodyType', filters.bodyType);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.stylePersonality) params.append('stylePersonality', filters.stylePersonality);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    const url = queryString ? `/style-guide?${queryString}` : '/style-guide';

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get trending styles
export const getTrendingStyles = async () => {
  try {
    const response = await api.get('/style-guide/trending');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get single style by ID
export const getStyleById = async (id) => {
  try {
    const response = await api.get(`/style-guide/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Like a style
export const likeStyle = async (id) => {
  try {
    const response = await api.post(`/style-guide/${id}/like`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Save/Bookmark a style
export const saveStyle = async (id) => {
  try {
    const response = await api.post(`/style-guide/${id}/save`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Increment view count
export const incrementView = async (id) => {
  try {
    const response = await api.post(`/style-guide/${id}/view`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add comment to style
export const addComment = async (id, commentData) => {
  try {
    const response = await api.post(`/style-guide/${id}/comment`, commentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get filter options
export const getFilterOptions = async () => {
  try {
    const response = await api.get('/style-guide/filters');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new style (admin/user generated)
export const createStyle = async (styleData) => {
  try {
    const response = await api.post('/style-guide', styleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
