import apiClient from './axios';

export const votesApi = {
  cast: async (projectId: string, fingerprintData: string) => {
    const response = await apiClient.post(`/votes/${projectId}`, {
      fingerprintData,
    });
    return response.data;
  },

  checkIfVoted: async (projectId: string, fingerprintData: string): Promise<{ hasVoted: boolean }> => {
    const response = await apiClient.get(`/votes/${projectId}/check`, {
      params: { fingerprint: fingerprintData },
    });
    return response.data;
  },
};
