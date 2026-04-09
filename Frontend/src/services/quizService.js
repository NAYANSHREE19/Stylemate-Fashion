import api from './api';

// Submit quiz answers
export const submitQuiz = async (answers) => {
  try {
    const response = await api.post('/quiz/submit', answers);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get quiz history
export const getQuizHistory = async () => {
  try {
    const response = await api.get('/quiz/history');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get latest quiz result
export const getLatestQuiz = async () => {
  try {
    const response = await api.get('/quiz/latest');
    return response.data;
  } catch (error) {
    throw error;
  }
};
