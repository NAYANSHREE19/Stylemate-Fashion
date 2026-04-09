import api from './api';

export const generateAIOutfits = async (payload) => {
  const response = await api.post('/ai/generate-outfits', payload, {
    timeout: 120000
  });
  return response.data;
};
