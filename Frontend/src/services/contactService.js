import api from './api';

export const sendContactMessage = async (payload) => {
  const response = await api.post('/contact', payload);
  return response.data;
};
