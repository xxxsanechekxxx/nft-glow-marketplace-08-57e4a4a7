import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  login: string;
  nickname: string;
  birthDate: string;
  country: string;
  balance: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    login: string;
    nickname: string;
    birthDate: string;
    country: string;
  }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

const API_URL = 'http://localhost:5000/api';

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
      toast.success('Successfully logged in');
    } catch (error: any) {
      set({ isLoading: false });
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
      toast.success('Successfully registered');
    } catch (error: any) {
      set({ isLoading: false });
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
    toast.success('Successfully logged out');
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      set({ isLoading: true });
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      set({ user: response.data, isLoading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isLoading: false });
    }
  },
}));