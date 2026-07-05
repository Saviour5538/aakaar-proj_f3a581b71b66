import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

// Request interceptor to add Authorization header
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// TypeScript interfaces for request and response types
export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface Match {
  id: string;
  player1: string;
  player2: string;
  winner: string | null;
  created_at: string;
}

export interface StatsResponse {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
}

// API client functions
export const register = (data: RegisterRequest) => {
  return api.post<void>('/api/auth/register', data);
};

export const login = (data: LoginRequest) => {
  return api.post<LoginResponse>('/api/auth/login', data);
};

export const createMatch = () => {
  return api.post<Match>('/api/matches');
};

export const getMatches = () => {
  return api.get<Match[]>('/api/matches');
};

export const getStats = () => {
  return api.get<StatsResponse>('/api/stats');
};

// Auto-added stubs for functions a page imported but the client omitted.
export const createStat = async (data?: any) => {
  const res = await api.post('/api/stats', data);
  return res.data;
};
export const deleteMatch = async (id: string) => {
  const res = await api.delete(`/api/matchs/${id}`);
  return res.data;
};
export const deleteStat = async (id: string) => {
  const res = await api.delete(`/api/stats/${id}`);
  return res.data;
};
export const getMatch = async (id: string) => {
  const res = await api.get(`/api/matchs/${id}`);
  return res.data;
};
export const getStatById = async (id: string) => {
  const res = await api.get(`/api/statbyids/${id}`);
  return res.data;
};
export const updateMatch = async (id: string, data?: any) => {
  const res = await api.put(`/api/matchs/${id}`, data);
  return res.data;
};
export const updateStat = async (id: string, data?: any) => {
  const res = await api.put(`/api/stats/${id}`, data);
  return res.data;
};
