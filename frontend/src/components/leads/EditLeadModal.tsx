import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Modal } from '../ui/Modal';
import { leadService, type UpdateLeadPayload } from '../../services/leadService';
import type { Lead, LeadStatus } from '../../types/crm';
import { Spinner } from '../ui/States';
import { useAuth } from '../../context/AuthContext';
import { userService, type UserOption } from '../../services/userService';

interface EditLeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const statusOptions: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'PROPOSAL_SENT',
  'WON',
  'LOST',
];

export const EditLeadModal: React.FC<EditLeadModalProps> = ({
  lead,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const { isAdmin } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateLeadPayload>();

  // Fetch users list when modal opens (admin only)
  useEffect(() => {
    if (isOpen && isAdmin) {
      setUsersLoading(true);
      userService.getUsers()
        .then(setUsers)
        .catch(() => setUsers([]))
        .finally(() => setUsersLoading(false));
    }
  }, [isOpen, isAdmin]);

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        company: lead.company || '',
        message: lead.message || '',
        status: lead.status,
        assignedToId: lead.assignedToId || '',
      });
    }
  }, [lead, reset]);

  const onSubmit = async (data: UpdateLeadPayload) => {
    if (!lead) return;
    setIsSubmitting(true);
    try {
      const payload: UpdateLeadPayload = { ...data };
      // Remove empty assignedToId so it doesn't override existing assignment
      if (!payload.assignedToId) {
        delete payload.assignedToId;
      }
      await leadService.updateLead(lead.id, payload);
      toast.success('Lead updated successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to update lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Lead: ${lead?.name || ''}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Full Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
          />
          {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Email Address <span className="text-rose-400">*</span>
          </label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
          />
          {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Phone</label>
            <input
              type="text"
              {...register('phone')}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Company</label>
            <input
              type="text"
              {...register('company')}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Admin: assign lead by member name via dropdown */}
          {isAdmin && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Assign To Member
              </label>
              {usersLoading ? (
                <div className="flex items-center gap-2 h-9 text-xs text-slate-400">
                  <Spinner size="sm" /> Loading members...
                </div>
              ) : (
                <select
                  {...register('assignedToId')}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="">— Unassigned —</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Message / Notes</label>
          <textarea
            rows={3}
            {...register('message')}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {isSubmitting ? <Spinner size="sm" /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
