import apiClient from './axios';

function getUserAuthHeader() {
  const token = localStorage.getItem('user_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const votesApi = {
  cast: async (projectId: string) => {
    const response = await apiClient.post(
      `/votes/${projectId}`,
      {},
      { headers: getUserAuthHeader() },
    );
    return response.data;
  },

  checkIfVoted: async (projectId: string): Promise<{ hasVoted: boolean }> => {
    const response = await apiClient.get(`/votes/${projectId}/check`, {
      headers: getUserAuthHeader(),
    });
    return response.data;
  },
};
