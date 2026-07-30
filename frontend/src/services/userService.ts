import api from '../api/axios';
import type { Role } from '../types/crm';

export interface UserOption {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export const userService = {
  getUsers: async (): Promise<UserOption[]> => {
    const response = await api.get<{ success: boolean; users: UserOption[] }>('/users');
    return response.data.users || [];
  },
};
