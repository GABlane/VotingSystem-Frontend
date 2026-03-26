import apiClient from './axios';

export interface LoginResponse {
  user: {
    id: string;
    email: string;
  };
  access_token: string;
}

export const authApi = {
  register: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/register', { email, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
};
