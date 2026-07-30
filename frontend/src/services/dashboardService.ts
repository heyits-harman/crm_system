import api from '../api/axios';
import type { DashboardStats } from '../types/crm';

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<{ success: boolean; data: DashboardStats }>('/dashboard/stats');
    return response.data.data;
  },
};
