import api from './api';

export const generateAIOutfits = async (payload) => {
  const response = await api.post('/ai/generate-outfits', payload, {
    timeout: 120000
  });
  return response.data;
};

export const remixOutfit = async (prompt) => {
  const response = await api.post('/ai/remix-outfit', { prompt }, {
    timeout: 60000
  });
  return response.data;
};
