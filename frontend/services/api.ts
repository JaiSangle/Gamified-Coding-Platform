import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// API response and request types
interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  content?: string;
  category?: string;
}

interface Submission {
  id?: string;
  challengeId: string;
  code: string;
  language: string;
  isCorrect?: boolean;
  score?: number;
  feedback?: string;
  submittedAt?: string;
}

interface LeaderboardUser {
  id: string;
  username: string;
  score: number;
  rank: number;
  avatar?: string;
}

interface UserCredentials {
  email: string;
  password: string;
}

interface UserData {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    fullName?: string;
    role?: string;
  };
  token: string;
}

// Get base API URL from environment variables or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth tokens
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Get token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // If token exists, add to headers
    if (token && config.headers) {
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
    getAll: async (filters: Record<string, string | number> = {}): Promise<Challenge[]> => {
      try {
        const queryParams = new URLSearchParams();
        
        // Add any filters to query params
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
        
        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const response = await apiClient.get<Challenge[]>(`/api/challenges${query}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching challenges:', error);
        throw error;
      }
    },
    
    // Get a specific challenge by ID
    getById: async (id: string): Promise<Challenge> => {
      try {
        const response = await apiClient.get<Challenge>(`/api/challenges/${id}`);
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
    submit: async (challengeId: string, code: string, language: string): Promise<Submission> => {
      try {
        const response = await apiClient.post<Submission>('/api/submissions', {
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
    getUserSubmissions: async (userId: string = 'me'): Promise<Submission[]> => {
      try {
        const response = await apiClient.get<Submission[]>(`/api/submissions/user/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching user submissions:', error);
        throw error;
      }
    },
    
    // Get submissions for a specific challenge
    getChallengeSubmissions: async (challengeId: string): Promise<Submission[]> => {
      try {
        const response = await apiClient.get<Submission[]>(`/api/submissions/challenge/${challengeId}`);
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
    getAll: async (period: string = 'all'): Promise<LeaderboardUser[]> => {
      try {
        const response = await apiClient.get<LeaderboardUser[]>(`/api/leaderboard?period=${period}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        throw error;
      }
    },
    
    // Get user ranking
    getUserRanking: async (userId: string = 'me'): Promise<LeaderboardUser> => {
      try {
        const response = await apiClient.get<LeaderboardUser>(`/api/leaderboard/user/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching user ranking:', error);
        throw error;
      }
    },
  },
  
  // Auth related endpoints
  auth: {
    login: async (credentials: UserCredentials): Promise<AuthResponse> => {
      try {
        const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
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
    
    register: async (userData: UserData): Promise<AuthResponse> => {
      try {
        const response = await apiClient.post<AuthResponse>('/api/auth/register', userData);
        return response.data;
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },
    
    logout: (): void => {
      localStorage.removeItem('token');
    },
    
    getCurrentUser: async (): Promise<AuthResponse['user']> => {
      try {
        const response = await apiClient.get<AuthResponse['user']>('/api/auth/profile');
        return response.data;
      } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
      }
    },
  },
};

export default api;