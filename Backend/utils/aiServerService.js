import axios from 'axios';

const AI_SERVER_URL = 'http://127.0.0.1:8000/generate';
const AI_TIMEOUT_MS = 6000;

export const generateAIImage = async (prompt) => {
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return null;
  }

  try {
    const response = await axios.post(
      AI_SERVER_URL,
      { prompt: prompt.trim() },
      {
        timeout: AI_TIMEOUT_MS,
        headers: {
          'Content-Type': 'application/json'
        },
        validateStatus: () => true
      }
    );

    if (response.status < 200 || response.status >= 300) {
      return null;
    }

    const imageBase64 = response?.data?.image_base64;
    return typeof imageBase64 === 'string' && imageBase64.trim() ? imageBase64.trim() : null;
  } catch (error) {
    return null;
  }
};
