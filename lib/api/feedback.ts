import apiClient from './axios';

export interface FeedbackEntry {
  id: string;
  comment: string;
  user_email: string;
  created_at: string;
}

function getUserAuthHeader() {
  const token = localStorage.getItem('user_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const feedbackApi = {
  submit: async (projectId: string, comment: string): Promise<{ message: string }> => {
    const response = await apiClient.post(
      `/feedback/${projectId}`,
      { comment },
      { headers: getUserAuthHeader() },
    );
    return response.data;
  },

  getForProject: async (projectId: string): Promise<FeedbackEntry[]> => {
    const response = await apiClient.get(`/feedback/${projectId}`);
    return response.data;
  },
};
