import api from './api';

export const analyzeOutfit = async (imageBase64, userProfile = {}) => {
  const response = await api.post(
    '/outfit-analyzer/analyze',
    {
      image: imageBase64,
      gender: userProfile.gender,
      bodyType: userProfile.bodyType,
      stylePersonality: userProfile.stylePersonality,
    },
    { timeout: 60000 } // 60s — Gemini Vision can take a moment
  );
  return response.data;
};
