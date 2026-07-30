import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Spinner } from '../components/ui/States';
import { LogIn, Shield, User, KeyRound, Sparkles } from 'lucide-react';

interface LoginFormInput {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormInput>();

  const onSubmit = async (data: LoginFormInput) => {
    setIsSubmitting(true);
    try {
      const res = await authService.login(data.email, data.password);
      login(res.token);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo & Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 font-bold text-white text-xl mb-3 shadow-lg shadow-indigo-500/25">
          C
        </div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">CRM Nexus</h1>
        <p className="text-sm text-slate-400 mt-1">Sign in to access your dashboard</p>
      </div>

      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" /> Email Address
            </label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              placeholder="user@example.com"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" /> Password
            </label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/25 transition disabled:opacity-50 mt-2"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" /> Authenticating...
              </>
            ) : (
              <>
                Sign In <LogIn className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper Box */}
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Quick Demo Accounts
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('admin@example.com', 'admin123')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-800/40 text-indigo-300 rounded-lg text-xs font-medium transition"
            >
              <Shield className="w-3 h-3 text-indigo-400" /> Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('member1@example.com', 'member123')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 rounded-lg text-xs font-medium transition"
            >
              <User className="w-3 h-3 text-slate-400" /> Member
            </button>
          </div>
        </div>

        <div className="text-center pt-2 border-t border-slate-800/80">
          <Link to="/submit" className="text-xs text-slate-400 hover:text-slate-200 transition">
            Looking for public lead submission? <span className="text-indigo-400 underline">Click here</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
