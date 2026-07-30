import React from 'react';
import type { LeadStatus } from '../../types/crm';

interface LeadStatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<
  LeadStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  NEW: {
    label: 'New',
    bg: 'bg-blue-950/60',
    text: 'text-blue-400',
    border: 'border-blue-800/50',
    dot: 'bg-blue-400',
  },
  CONTACTED: {
    label: 'Contacted',
    bg: 'bg-purple-950/60',
    text: 'text-purple-400',
    border: 'border-purple-800/50',
    dot: 'bg-purple-400',
  },
  QUALIFIED: {
    label: 'Qualified',
    bg: 'bg-amber-950/60',
    text: 'text-amber-400',
    border: 'border-amber-800/50',
    dot: 'bg-amber-400',
  },
  PROPOSAL_SENT: {
    label: 'Proposal Sent',
    bg: 'bg-cyan-950/60',
    text: 'text-cyan-400',
    border: 'border-cyan-800/50',
    dot: 'bg-cyan-400',
  },
  WON: {
    label: 'Won',
    bg: 'bg-emerald-950/60',
    text: 'text-emerald-400',
    border: 'border-emerald-800/50',
    dot: 'bg-emerald-400',
  },
  LOST: {
    label: 'Lost',
    bg: 'bg-rose-950/60',
    text: 'text-rose-400',
    border: 'border-rose-800/50',
    dot: 'bg-rose-400',
  },
};

export const LeadStatusBadge: React.FC<LeadStatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = statusConfig[status] || {
    label: status,
    bg: 'bg-slate-900',
    text: 'text-slate-400',
    border: 'border-slate-800',
    dot: 'bg-slate-400',
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
