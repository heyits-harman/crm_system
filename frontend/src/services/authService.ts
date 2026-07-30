import api from '../api/axios';
import type { AuthUser, LoginResponse, Role } from '../types/crm';

export function parseJwt(token: string): AuthUser | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return {
      id: decoded.id,
      role: decoded.role as Role,
    };
  } catch (e) {
    console.error('Failed to parse JWT token', e);
    return null;
  }
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/users/login', { email, password });
    return response.data;
  },

  signup: async (name: string, email: string, password: string, role: Role = 'MEMBER') => {
    const response = await api.post('/users/signup', { name, email, password, role });
    return response.data;
  },
};
