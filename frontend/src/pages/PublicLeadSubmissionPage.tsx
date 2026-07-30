import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { leadService, type CreateLeadPayload } from '../services/leadService';
import { Spinner } from '../components/ui/States';
import { Send, CheckCircle2, Building, Mail, User, Phone, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PublicLeadSubmissionPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLeadPayload>();

  const onSubmit = async (data: CreateLeadPayload) => {
    setIsSubmitting(true);
    try {
      await leadService.createLead({ ...data, status: 'NEW' });
      toast.success('Thank you! Your submission has been received.');
      setIsSubmitted(true);
      reset();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Brand & Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-4 shadow-lg shadow-indigo-500/10">
          <Send className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Fill out the form below and our team will get back to you promptly.
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-slate-100">Submission Received!</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Thank you for reaching out. A representative has been notified and will review your inquiry.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition"
            >
              Submit Another Inquiry
            </button>
            <Link
              to="/login"
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition text-center"
            >
              Team Login
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                {...register('name', { required: 'Full name is required' })}
                placeholder="Jane Smith"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
              {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email address is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email' },
                })}
                placeholder="jane@company.com"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
              {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" /> Phone Number
                </label>
                <input
                  type="text"
                  {...register('phone')}
                  placeholder="+1 (555) 012-3456"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-400" /> Company Name
                </label>
                <input
                  type="text"
                  {...register('company')}
                  placeholder="Acme Corp"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Message / Details
              </label>
              <textarea
                rows={4}
                {...register('message')}
                placeholder="Tell us about your requirements or project details..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/25 transition disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" /> Submitting...
                </>
              ) : (
                <>
                  Submit Inquiry <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <Link to="/login" className="text-xs text-slate-400 hover:text-slate-200 transition">
              Are you a team member? <span className="text-indigo-400 underline">Sign in here</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
