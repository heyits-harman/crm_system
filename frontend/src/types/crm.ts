export type Role = 'ADMIN' | 'MEMBER';

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'PROPOSAL_SENT'
  | 'WON'
  | 'LOST';

export type ActivityType =
  | 'CREATED'
  | 'UPDATED'
  | 'ASSIGNED'
  | 'STATUS_CHANGED'
  | 'NOTE_ADDED'
  | 'DELETED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
  status: LeadStatus;
  assignedToId?: string | null;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  content: string;
  leadId: string;
  authorId: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  leadId: string;
  userId: string;
  user?: {
    name: string;
  };
  createdAt: string;
}

export interface DashboardStats {
  totalLeads: number;
  new?: number;
  contacted?: number;
  qualified?: number;
  proposal_sent?: number;
  won?: number;
  lost?: number;
  [key: string]: number | undefined;
}

export interface GetLeadsParams {
  page?: number;
  limit?: number;
  status?: LeadStatus | '';
  search?: string;
  assignedToId?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'status' | 'name';
  order?: 'asc' | 'desc';
}

export interface GetLeadsResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Lead[];
}

export interface AuthUser {
  id: string;
  role: Role;
  email?: string;
  name?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}
