import React from 'react';
import { Loader2, AlertCircle, FolderOpen } from 'lucide-react';

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };
  return <Loader2 className={`animate-spin text-indigo-500 ${sizeMap[size]}`} />;
};

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
    <Spinner size="lg" />
    <p className="text-sm">{message}</p>
  </div>
);

export const EmptyState: React.FC<{ title?: string; message?: string; action?: React.ReactNode }> = ({
  title = 'No data found',
  message = 'There are no records matching your criteria.',
  action,
}) => (
  <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 rounded-xl text-center">
    <div className="p-3 bg-slate-900 border border-slate-800 rounded-full mb-3 text-slate-400">
      <FolderOpen className="w-6 h-6" />
    </div>
    <h3 className="text-base font-semibold text-slate-200">{title}</h3>
    <p className="text-sm text-slate-400 mt-1 max-w-sm">{message}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center p-8 bg-rose-950/30 border border-rose-900/50 rounded-xl text-rose-300 text-center gap-3">
    <AlertCircle className="w-8 h-8 text-rose-400" />
    <p className="text-sm font-medium">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-3 py-1.5 bg-rose-900/50 hover:bg-rose-900 border border-rose-700/50 text-white rounded-md text-xs font-medium transition"
      >
        Try Again
      </button>
    )}
  </div>
);
