import api from './api';

export const chatWithStylist = async (message, history = []) => {
  const response = await api.post('/chatbot/chat', { message, history }, {
    timeout: 30000
  });
  return response.data;
};
