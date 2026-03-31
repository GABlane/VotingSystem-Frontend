import apiClient from './axios';

export interface UserAuthResponse {
  user: {
    id: string;
    email: string;
    votes_remaining: number;
  };
  access_token: string;
}

export interface UserProfile {
  id: string;
  email: string;
  votes_remaining: number;
}

export const usersApi = {
  register: async (email: string, password: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/users/register', { email, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<UserAuthResponse> => {
    const response = await apiClient.post('/users/login', { email, password });
    return response.data;
  },

  getMe: async (): Promise<UserProfile> => {
    const token = localStorage.getItem('user_token');
    const response = await apiClient.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
