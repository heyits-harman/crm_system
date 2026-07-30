import api, { publicApi } from '../api/axios';
import type {
  GetLeadsParams,
  GetLeadsResponse,
  Lead,
  LeadStatus,
  Note,
  Activity,
} from '../types/crm';

export interface CreateLeadPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  status?: LeadStatus;
}

export interface UpdateLeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  status?: LeadStatus;
  assignedToId?: string;
}

export const leadService = {
  // Uses publicApi (no auth interceptor) — this is a public unauthenticated endpoint
  createLead: async (payload: CreateLeadPayload): Promise<Lead> => {
    const response = await publicApi.post('/leads/create', payload);
    return response.data;
  },

  getLeads: async (params: GetLeadsParams = {}): Promise<GetLeadsResponse> => {
    const response = await api.get<GetLeadsResponse>('/leads/get', { params });
    return response.data;
  },

  updateLead: async (id: string, payload: UpdateLeadPayload): Promise<Lead> => {
    const response = await api.patch<{ success: boolean; data: Lead }>(`/leads/update/${id}`, payload);
    return response.data.data;
  },

  deleteLead: async (id: string): Promise<void> => {
    await api.delete(`/leads/delete/${id}`);
  },

  getNotes: async (leadId: string): Promise<Note[]> => {
    const response = await api.get<{ success: boolean; notes: Note[] }>(`/leads/${leadId}/notes`);
    return response.data.notes || [];
  },

  createNote: async (leadId: string, content: string): Promise<Note> => {
    const response = await api.post(`/leads/${leadId}/notes`, { content });
    return response.data;
  },

  deleteNote: async (noteId: string): Promise<void> => {
    await api.delete(`/leads/${noteId}/notes`);
  },

  getActivity: async (leadId: string): Promise<Activity[]> => {
    const response = await api.get<{ success: boolean; activity: Activity[] }>(`/leads/${leadId}/activity`);
    return response.data.activity || [];
  },
};
