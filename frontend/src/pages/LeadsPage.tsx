import React, { useEffect, useState, useCallback } from 'react';
import { leadService } from '../services/leadService';
import type { Lead, LeadStatus } from '../types/crm';
import { LeadStatusBadge } from '../components/ui/LeadStatusBadge';
import { CreateLeadModal } from '../components/leads/CreateLeadModal';
import { EditLeadModal } from '../components/leads/EditLeadModal';
import { LoadingState, EmptyState, ErrorState } from '../components/ui/States';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building,
} from 'lucide-react';

const statuses: { label: string; value: LeadStatus | '' }[] = [
  { label: 'All Statuses', value: '' },
  { label: 'New', value: 'NEW' },
  { label: 'Contacted', value: 'CONTACTED' },
  { label: 'Qualified', value: 'QUALIFIED' },
  { label: 'Proposal Sent', value: 'PROPOSAL_SENT' },
  { label: 'Won', value: 'WON' },
  { label: 'Lost', value: 'LOST' },
];

export const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | ''>('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'status' | 'name'>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const { isAdmin } = useAuth();

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await leadService.getLeads({
        page,
        limit,
        search: search.trim() || undefined,
        status: selectedStatus || undefined,
        sortBy,
        order,
      });
      setLeads(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, selectedStatus, sortBy, order]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleDelete = async (leadId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete lead "${name}"?`)) return;
    try {
      await leadService.deleteLead(leadId);
      toast.success(`Lead "${name}" deleted`);
      fetchLeads();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete lead');
    }
  };

  const handleSortToggle = (field: 'createdAt' | 'updatedAt' | 'status' | 'name') => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('desc');
    }
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Leads Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Search, filter, track and manage your prospective leads.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Lead
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by lead name, email or company..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as LeadStatus | '');
                setPage(1);
              }}
              className="w-full md:w-48 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [f, o] = e.target.value.split('-') as [any, any];
                setSortBy(f);
                setOrder(o);
                setPage(1);
              }}
              className="w-full md:w-48 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="status-asc">Status (Ascending)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden">
        {isLoading ? (
          <LoadingState message="Fetching leads data..." />
        ) : error ? (
          <div className="p-6">
            <ErrorState message={error} onRetry={fetchLeads} />
          </div>
        ) : leads.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No leads found"
              message="No leads matched your search query or filter criteria."
              action={
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition"
                >
                  Create First Lead
                </button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider bg-slate-950/40">
                  <th
                    onClick={() => handleSortToggle('name')}
                    className="py-3.5 px-4 font-medium cursor-pointer hover:text-slate-200 transition"
                  >
                    Lead Name / Contact
                  </th>
                  <th className="py-3.5 px-4 font-medium">Company</th>
                  <th
                    onClick={() => handleSortToggle('status')}
                    className="py-3.5 px-4 font-medium cursor-pointer hover:text-slate-200 transition"
                  >
                    Status
                  </th>
                  <th className="py-3.5 px-4 font-medium">Assigned To</th>
                  <th
                    onClick={() => handleSortToggle('createdAt')}
                    className="py-3.5 px-4 font-medium cursor-pointer hover:text-slate-200 transition"
                  >
                    Created Date
                  </th>
                  <th className="py-3.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/30 transition group">
                    <td className="py-4 px-4">
                      <Link
                        to={`/leads/${lead.id}`}
                        className="font-semibold text-slate-100 hover:text-indigo-400 transition block"
                      >
                        {lead.name}
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-500" /> {lead.email}
                        </span>
                        {lead.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" /> {lead.phone}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {lead.company ? (
                        <span className="inline-flex items-center gap-1.5 text-slate-300 text-xs">
                          <Building className="w-3.5 h-3.5 text-slate-500" /> {lead.company}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <LeadStatusBadge status={lead.status} />
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-300">
                      {lead.assignedTo ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-950 border border-slate-800 rounded-md">
                          <span className="w-2 h-2 rounded-full bg-indigo-400" />
                          {lead.assignedTo.name}
                        </span>
                      ) : (
                        <span className="text-slate-50 text-xs italic opacity-60">Unassigned</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/leads/${lead.id}`}
                          title="View Details"
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setEditingLead(lead)}
                          title="Edit Lead"
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(lead.id, lead.name)}
                            title="Delete Lead"
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Pagination Footer */}
        {!isLoading && !error && total > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 text-xs text-slate-400 bg-slate-950/40">
            <div>
              Showing <span className="font-semibold text-slate-200">{(page - 1) * limit + 1}</span> to{' '}
              <span className="font-semibold text-slate-200">
                {Math.min(page * limit, total)}
              </span>{' '}
              of <span className="font-semibold text-slate-200">{total}</span> leads
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg disabled:opacity-40 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg disabled:opacity-40 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateLeadModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchLeads}
      />
      <EditLeadModal
        lead={editingLead}
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        onSuccess={fetchLeads}
      />
    </div>
  );
};
