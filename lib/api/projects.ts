import apiClient from './axios';

export interface Project {
  id: string;
  title: string;
  description: string;
  is_active: boolean;
  qr_code_url: string;
  logo_url?: string;
  total_votes: number;
  created_at: string;
  updated_at: string;
}

export const projectsApi = {
  // Public endpoints
  getAll: async (): Promise<Project[]> => {
    const response = await apiClient.get('/projects');
    return response.data;
  },

  getOne: async (id: string): Promise<Project> => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  getResults: async (id: string) => {
    const response = await apiClient.get(`/projects/${id}/results`);
    return response.data;
  },

  // Admin endpoints
  create: async (data: { title: string; description?: string; logo_url?: string }): Promise<Project> => {
    const response = await apiClient.post('/projects', data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<Pick<Project, 'title' | 'description' | 'is_active' | 'logo_url'>>
  ): Promise<Project> => {
    const response = await apiClient.patch(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  downloadQR: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(`/projects/${id}/qr/print`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
