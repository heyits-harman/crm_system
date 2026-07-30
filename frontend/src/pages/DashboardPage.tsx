import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { leadService } from '../services/leadService';
import type { DashboardStats, Lead } from '../types/crm';
import { LoadingState, ErrorState } from '../components/ui/States';
import { LeadStatusBadge } from '../components/ui/LeadStatusBadge';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  TrendingUp,
  Target,
  ArrowRight,
  Sparkles,
  Clock,
  Briefcase,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, leadsResponse] = await Promise.all([
        dashboardService.getStats(),
        leadService.getLeads({ limit: 5, sortBy: 'createdAt', order: 'desc' }),
      ]);
      setStats(statsData);
      setRecentLeads(leadsResponse.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) return <LoadingState message="Loading dashboard statistics..." />;
  if (error) return <ErrorState message={error} onRetry={fetchDashboardData} />;

  const total = stats?.totalLeads || 0;
  const newCount = stats?.new || 0;
  const contactedCount = stats?.contacted || 0;
  const qualifiedCount = stats?.qualified || 0;
  const proposalCount = stats?.proposal_sent || 0;
  const wonCount = stats?.won || 0;
  const lostCount = stats?.lost || 0;

  const winRate = total > 0 ? ((wonCount / total) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Overview
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Welcome back, <span className="text-slate-200 font-medium">{user?.name || user?.email}</span> ({isAdmin ? 'Admin View' : 'My Leads View'})
          </p>
        </div>
        <Link
          to="/leads"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          View All Leads <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Leads</span>
            <div className="p-2 bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-100">{total}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Total active entries in CRM</p>
        </div>

        {/* New & In Pipeline */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">New Leads</span>
            <div className="p-2 bg-blue-950/60 border border-blue-800/40 text-blue-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-100">{newCount}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Pending initial outreach</p>
        </div>

        {/* Won Deals */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Deals Won</span>
            <div className="p-2 bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-emerald-400">{wonCount}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Successfully converted</p>
        </div>

        {/* Win Rate */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-5 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Win Rate</span>
            <div className="p-2 bg-amber-950/60 border border-amber-800/40 text-amber-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-amber-400">{winRate}%</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Conversion efficiency ratio</p>
        </div>
      </div>

      {/* Status Breakdown Bar & Grid */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" /> Pipeline Status Distribution
          </h2>
          <span className="text-xs text-slate-400 font-mono">{total} Total</span>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex">
          <div style={{ width: `${total ? (newCount / total) * 100 : 0}%` }} className="bg-blue-500 transition-all" title={`New: ${newCount}`} />
          <div style={{ width: `${total ? (contactedCount / total) * 100 : 0}%` }} className="bg-purple-500 transition-all" title={`Contacted: ${contactedCount}`} />
          <div style={{ width: `${total ? (qualifiedCount / total) * 100 : 0}%` }} className="bg-amber-500 transition-all" title={`Qualified: ${qualifiedCount}`} />
          <div style={{ width: `${total ? (proposalCount / total) * 100 : 0}%` }} className="bg-cyan-500 transition-all" title={`Proposal Sent: ${proposalCount}`} />
          <div style={{ width: `${total ? (wonCount / total) * 100 : 0}%` }} className="bg-emerald-500 transition-all" title={`Won: ${wonCount}`} />
          <div style={{ width: `${total ? (lostCount / total) * 100 : 0}%` }} className="bg-rose-500 transition-all" title={`Lost: ${lostCount}`} />
        </div>

        {/* Status Pill Counts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
            <span className="text-xs text-slate-400 block mb-1">New</span>
            <span className="text-lg font-bold text-blue-400">{newCount}</span>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
            <span className="text-xs text-slate-400 block mb-1">Contacted</span>
            <span className="text-lg font-bold text-purple-400">{contactedCount}</span>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
            <span className="text-xs text-slate-400 block mb-1">Qualified</span>
            <span className="text-lg font-bold text-amber-400">{qualifiedCount}</span>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
            <span className="text-xs text-slate-400 block mb-1">Proposal</span>
            <span className="text-lg font-bold text-cyan-400">{proposalCount}</span>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
            <span className="text-xs text-slate-400 block mb-1">Won</span>
            <span className="text-lg font-bold text-emerald-400">{wonCount}</span>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
            <span className="text-xs text-slate-400 block mb-1">Lost</span>
            <span className="text-lg font-bold text-rose-400">{lostCount}</span>
          </div>
        </div>
      </div>

      {/* Recent Leads Quick View Table */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" /> Recent Leads
          </h2>
          <Link to="/leads" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">No leads available yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium">Company</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Created</th>
                  <th className="py-3 px-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-medium text-slate-100">{lead.name}</td>
                    <td className="py-3 px-4 text-slate-400">{lead.company || '—'}</td>
                    <td className="py-3 px-4">
                      <LeadStatusBadge status={lead.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/leads/${lead.id}`}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Details &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
