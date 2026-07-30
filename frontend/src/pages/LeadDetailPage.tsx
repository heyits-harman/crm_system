import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { leadService } from '../services/leadService';
import type { Lead, Note, Activity, LeadStatus } from '../types/crm';
import { LeadStatusBadge } from '../components/ui/LeadStatusBadge';
import { LoadingState, ErrorState } from '../components/ui/States';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  User,
  Calendar,
  MessageSquare,
  Clock,
  Send,
  Trash2,
  Activity as ActivityIcon,
  CheckCircle,
  UserPlus,
  RefreshCw,
  PlusCircle,
  FileText,
} from 'lucide-react';

const statusOptions: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'PROPOSAL_SENT',
  'WON',
  'LOST',
];

export const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();

  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchAllData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      // Fetch lead from getLeads filtered by search or direct query
      const [leadsRes, notesData, activityData] = await Promise.all([
        leadService.getLeads({ limit: 100 }), // Get lead list to find matching ID
        leadService.getNotes(id).catch(() => []),
        leadService.getActivity(id).catch(() => []),
      ]);

      const foundLead = leadsRes.data?.find((l) => l.id === id);
      if (!foundLead) {
        setError('Lead not found or permission denied.');
      } else {
        setLead(foundLead);
        setNotes(notesData);
        setActivities(activityData);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load lead details');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await leadService.updateLead(lead.id, { status: newStatus });
      setLead(updated);
      toast.success(`Status updated to ${newStatus}`);
      // Refresh activities to see STATUS_CHANGED log
      const updatedActivity = await leadService.getActivity(lead.id);
      setActivities(updatedActivity);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newNoteContent.trim()) return;
    setIsAddingNote(true);
    try {
      await leadService.createNote(id, newNoteContent.trim());
      toast.success('Note added');
      setNewNoteContent('');
      const [updatedNotes, updatedActivity] = await Promise.all([
        leadService.getNotes(id),
        leadService.getActivity(id),
      ]);
      setNotes(updatedNotes);
      setActivities(updatedActivity);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.response?.data || 'Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await leadService.deleteNote(noteId);
      toast.success('Note deleted');
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete note');
    }
  };

  if (isLoading) return <LoadingState message="Loading lead profile..." />;
  if (error || !lead) return <ErrorState message={error || 'Lead not found'} onRetry={fetchAllData} />;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <Link
          to="/leads"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Leads
        </Link>
        <span className="text-xs text-slate-500 font-mono">ID: {lead.id}</span>
      </div>

      {/* Main Lead Header Banner */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">{lead.name}</h1>
              <LeadStatusBadge status={lead.status} />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> {lead.email}
              </span>
              {lead.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" /> {lead.phone}
                </span>
              )}
              {lead.company && (
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-400" /> {lead.company}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />{' '}
                Created {new Date(lead.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Quick Status Change Selector */}
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400 whitespace-nowrap flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" /> Change Status:
            </span>
            <select
              value={lead.status}
              disabled={isUpdatingStatus}
              onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lead Message / Requirements */}
        {lead.message && (
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Initial Inquiry / Notes:
            </span>
            <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
              {lead.message}
            </p>
          </div>
        )}

        {/* Assignee Information */}
        <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
          <User className="w-4 h-4 text-slate-500" />
          <span>Assigned Representative:</span>
          {lead.assignedTo ? (
            <span className="font-semibold text-slate-200 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {lead.assignedTo.name} ({lead.assignedTo.email})
            </span>
          ) : (
            <span className="italic text-slate-500">Unassigned</span>
          )}
        </div>
      </div>

      {/* Grid: Left Column (Notes) & Right Column (Activity Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes Section */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" /> Notes ({notes.length})
              </h2>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-3 mb-6">
              <textarea
                rows={3}
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Type a new internal note or call update..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isAddingNote || !newNoteContent.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" /> Post Note
                </button>
              </div>
            </form>

            {/* Notes List */}
            {notes.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center italic">
                No notes posted for this lead yet.
              </p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-indigo-300 font-medium">
                        <User className="w-3 h-3" /> Author ID: {note.authorId.substring(0, 8)}...
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                        <Clock className="w-3 h-3" /> {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </p>

                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity Timeline Section */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <ActivityIcon className="w-4 h-4 text-indigo-400" /> Activity Timeline
            </h2>
            <span className="text-xs text-slate-500">{activities.length} Events</span>
          </div>

          {activities.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center italic">
              No activity logs recorded.
            </p>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {activities.map((act) => {
                let IconComponent = ActivityIcon;
                let iconColor = 'text-indigo-400 bg-indigo-950/80 border-indigo-800';

                if (act.type === 'CREATED') {
                  IconComponent = PlusCircle;
                  iconColor = 'text-blue-400 bg-blue-950/80 border-blue-800';
                } else if (act.type === 'STATUS_CHANGED') {
                  IconComponent = CheckCircle;
                  iconColor = 'text-amber-400 bg-amber-950/80 border-amber-800';
                } else if (act.type === 'ASSIGNED') {
                  IconComponent = UserPlus;
                  iconColor = 'text-purple-400 bg-purple-950/80 border-purple-800';
                }

                return (
                  <div key={act.id} className="relative group">
                    <div
                      className={`absolute -left-6 top-0.5 p-1.5 rounded-full border ${iconColor} z-10`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>

                    <div className="bg-slate-950/50 border border-slate-800/60 p-3 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200">
                          {act.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(act.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{act.description}</p>
                      {act.user?.name && (
                        <p className="text-[11px] text-slate-500">
                          by <span className="text-slate-400 font-medium">{act.user.name}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
