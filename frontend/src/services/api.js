import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const wizardApi = {
  // Create a new session
  createSession: async (systemDescription) => {
    const response = await api.post('/sessions', { systemDescription });
    return response.data;
  },

  // Get session details
  getSession: async (sessionId) => {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  },

  // Get all sessions
  getSessions: async () => {
    const response = await api.get('/sessions');
    return response.data;
  },

  // Execute a step
  executeStep: async (sessionId, stepIndex, feedback = null) => {
    const response = await api.post(`/sessions/${sessionId}/steps/${stepIndex}`, {
      feedback,
    });
    return response.data;
  },

  // Get step output
  getStepOutput: async (sessionId, stepIndex) => {
    const response = await api.get(`/sessions/${sessionId}/steps/${stepIndex}`);
    return response.data;
  },

  // Download complete documentation
  downloadDocumentation: async (sessionId) => {
    const response = await api.get(`/sessions/${sessionId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Delete session
  deleteSession: async (sessionId) => {
    const response = await api.delete(`/sessions/${sessionId}`);
    return response.data;
  },
};

export default api;