import { create } from 'zustand';
import { usersApi } from '@/lib/api/users';

interface VoterUser {
  id: string;
  email: string;
  votes_remaining: number;
}

interface UserAuthState {
  user: VoterUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  refreshVotesRemaining: () => Promise<void>;
}

export const useUserAuthStore = create<UserAuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const { user, access_token } = await usersApi.login(email, password);
    localStorage.setItem('user_token', access_token);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  register: async (email, password) => {
    // Registration sends a verification email; no token returned until email is confirmed.
    await usersApi.register(email, password);
    set({ isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('user_token');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const profile = await usersApi.getMe();
      set({ user: profile, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('user_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  refreshVotesRemaining: async () => {
    try {
      const profile = await usersApi.getMe();
      set((state) => ({
        user: state.user ? { ...state.user, votes_remaining: profile.votes_remaining } : null,
      }));
    } catch {
      // ignore refresh errors
    }
  },
}));
