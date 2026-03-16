import { create } from 'zustand';
import { User } from '@/types/user';
import api from '@/services/api';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('chatly_token') : null,
  user: null,
  isAuthenticated: !!(typeof window !== 'undefined' && localStorage.getItem('chatly_token')),
  isLoading: false,

  setToken: (token: string) => {
    localStorage.setItem('chatly_token', token);
    set({ token, isAuthenticated: true });
  },

  login: (token: string) => {
    localStorage.setItem('chatly_token', token);
    set({ token, isAuthenticated: true });
    get().fetchCurrentUser();
  },

  logout: () => {
    localStorage.removeItem('chatly_token');
    set({ token: null, user: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  fetchCurrentUser: async () => {
    const { token } = get();
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await api.get<User>('/users/me');
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch current user', error);
      localStorage.removeItem('chatly_token');
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

// Auto-fetch user if token exists on initial load (handles page refreshes)
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('chatly_token');
  if (token) {
    useAuthStore.getState().fetchCurrentUser();
  }
}
