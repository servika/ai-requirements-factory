import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minute timeout for API calls
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error || error.message;

      console.error(`API Error [${status}]:`, message);

      // Create a more descriptive error
      const apiError = new Error(message);
      apiError.status = status;
      apiError.data = error.response.data;

      return Promise.reject(apiError);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.message);

      const networkError = new Error(
        'Unable to connect to the server. Please check your internet connection.'
      );
      networkError.isNetworkError = true;

      return Promise.reject(networkError);
    } else {
      // Something else happened
      console.error('Request Error:', error.message);
      return Promise.reject(error);
    }
  }
);

export const wizardApi = {
  // Create a new session
  createSession: async (systemDescription) => {
    try {
      const response = await api.post('/sessions', { systemDescription });
      return response.data;
    } catch (error) {
      console.error('Failed to create session:', error.message);
      throw new Error(`Failed to create session: ${error.message}`);
    }
  },

  // Get session details
  getSession: async (sessionId) => {
    try {
      const response = await api.get(`/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get session ${sessionId}:`, error.message);
      if (error.status === 404) {
        throw new Error('Session not found. It may have been deleted.');
      }
      throw new Error(`Failed to retrieve session: ${error.message}`);
    }
  },

  // Get all sessions
  getSessions: async () => {
    try {
      const response = await api.get('/sessions');
      return response.data;
    } catch (error) {
      console.error('Failed to get sessions:', error.message);
      throw new Error(`Failed to retrieve sessions: ${error.message}`);
    }
  },

  // Execute a step
  executeStep: async (sessionId, stepIndex, feedback = null) => {
    try {
      const response = await api.post(`/sessions/${sessionId}/steps/${stepIndex}`, {
        feedback,
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to execute step ${stepIndex}:`, error.message);
      throw new Error(`Failed to execute step: ${error.message}`);
    }
  },

  // Get step output
  getStepOutput: async (sessionId, stepIndex) => {
    try {
      const response = await api.get(`/sessions/${sessionId}/steps/${stepIndex}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get step ${stepIndex} output:`, error.message);
      throw new Error(`Failed to retrieve step output: ${error.message}`);
    }
  },

  // Download complete documentation
  downloadDocumentation: async (sessionId) => {
    try {
      const response = await api.get(`/sessions/${sessionId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to download documentation:', error.message);
      throw new Error(`Failed to download documentation: ${error.message}`);
    }
  },

  // Delete session
  deleteSession: async (sessionId) => {
    try {
      const response = await api.delete(`/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete session ${sessionId}:`, error.message);
      if (error.status === 404) {
        throw new Error('Session not found. It may have already been deleted.');
      }
      throw new Error(`Failed to delete session: ${error.message}`);
    }
  },
};

export default api;