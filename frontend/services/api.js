import axios from 'axios';

// Get base API URL from environment variables or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // If token exists, add to headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// API methods
const api = {
  // Challenge related endpoints
  challenges: {
    // Get all challenges with optional filters
    getAll: async (filters = {}) => {
      try {
        const queryParams = new URLSearchParams();
        
        // Add any filters to query params
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value);
          }
        });
        
        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const response = await apiClient.get(`/api/challenges${query}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching challenges:', error);
        throw error;
      }
    },
    
    // Get a specific challenge by ID
    getById: async (id) => {
      try {
        const response = await apiClient.get(`/api/challenges/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching challenge ${id}:`, error);
        throw error;
      }
    },
  },
  
  // Submission related endpoints
  submissions: {
    // Submit code for a challenge
    submit: async (challengeId, code, language) => {
      try {
        const response = await apiClient.post('/api/submissions', {
          challengeId,
          code,
          language,
        });
        return response.data;
      } catch (error) {
        console.error('Error submitting code:', error);
        throw error;
      }
    },
    
    // Get submissions by user
    getUserSubmissions: async (userId = 'me') => {
      try {
        const response = await apiClient.get(`/api/submissions/user/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching user submissions:', error);
        throw error;
      }
    },
    
    // Get submissions for a specific challenge
    getChallengeSubmissions: async (challengeId) => {
      try {
        const response = await apiClient.get(`/api/submissions/challenge/${challengeId}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching submissions for challenge ${challengeId}:`, error);
        throw error;
      }
    },
  },
  
  // Leaderboard related endpoints
  leaderboard: {
    // Get leaderboard data with optional time period filter
    getAll: async (period = 'all') => {
      try {
        const response = await apiClient.get(`/api/leaderboard?period=${period}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        throw error;
      }
    },
    
    // Get user ranking
    getUserRanking: async (userId = 'me') => {
      try {
        const response = await apiClient.get(`/api/leaderboard/user/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching user ranking:', error);
        throw error;
      }
    },
  },
  
  // Hints related endpoints
  hints: {
    // Get a hint for a specific challenge
    getHint: async (challengeId, code, hintLevel = 1, language = 'javascript') => {
      try {
        const response = await apiClient.post('/api/hints', {
          challenge_id: challengeId,
          code,
          hint_level: hintLevel,
          language
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching hint:', error);
        throw error;
      }
    }
  },
  
  // Auth related endpoints
  auth: {
    login: async (credentials) => {
      try {
        const response = await apiClient.post('/api/auth/login', credentials);
        // Store token in localStorage if returned
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        return response.data;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    
    register: async (userData) => {
      try {
        const response = await apiClient.post('/api/auth/register', userData);
        return response.data;
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },
    
    logout: () => {
      localStorage.removeItem('token');
    },
    
    getCurrentUser: async () => {
      try {
        const response = await apiClient.get('/api/auth/profile');
        return response.data;
      } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
      }
    },
  },
};

export default api; 