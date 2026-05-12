import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AuthLayout from './AuthLayout';
import { Mail } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('Please enter your email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await base44.auth.resetPasswordRequest(trimmedEmail);
      setSent(true);
    } catch (err) {
      // For security, don't reveal whether the email exists. Show success anyway.
      // Only surface a hard error if it's clearly a network/server problem.
      const msg = err?.response?.data?.message || err?.message || '';
      if (/network|timeout|server|500|503/i.test(msg)) {
        setError("We couldn't send the reset email. Please try again.");
      } else {
        setSent(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout showBack backTo="/login">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FAD98D]/30 dark:bg-[#FAD98D]/15 flex items-center justify-center">
            <Mail className="w-7 h-7 text-[#FD9C2D]" />
          </div>
          <h2
            className="text-2xl text-[#2A3A3F] dark:text-white mb-3 tracking-tight"
            style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}
          >
            Check your email
          </h2>
          <p className="text-sm text-[#2A3A3F]/70 dark:text-white/60 mb-6">
            If an account exists for{' '}
            <span className="font-semibold text-[#2A3A3F] dark:text-white">{email}</span>
            , we've sent reset instructions. The email includes a token you'll enter on the next screen.
          </p>
          <button
            onClick={() => navigate('/reset-password', { state: { email } })}
            className="w-full bg-[#FD9C2D] hover:bg-[#e88d1f] text-white font-bold py-3.5 rounded-xl shadow-md transition-colors min-h-[52px]"
          >
            I have my reset token
          </button>
          <Link
            to="/login"
            className="block mt-4 text-sm text-[#2A3A3F]/70 dark:text-white/60 hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout showBack backTo="/login">
      <div className="mb-8 text-center">
        <h2
          className="text-3xl text-[#2A3A3F] dark:text-white mb-2 tracking-tight"
          style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}
        >
          Reset your password
        </h2>
        <p className="text-sm text-[#2A3A3F]/70 dark:text-white/60">
          Enter your email and we'll send you a token to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-bold text-[#2A3A3F]/70 dark:text-white/70 mb-1.5 uppercase tracking-wider">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A3A3F]/40 dark:text-white/40" />
            <input
              id="email"
              type="email"
              inputMode="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-3 py-3 bg-white dark:bg-white/5 border border-[#2A3A3F]/15 dark:border-white/10 rounded-xl text-[#2A3A3F] dark:text-white placeholder:text-[#2A3A3F]/40 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FD9C2D]/40 focus:border-[#FD9C2D]/40 min-h-[48px]"
              disabled={isSubmitting}
              autoFocus
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2.5">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#FD9C2D] hover:bg-[#e88d1f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-md transition-colors min-h-[52px] flex items-center justify-center"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Send reset email'
          )}
        </button>
      </form>

      <p className="text-center text-sm text-[#2A3A3F]/70 dark:text-white/60 mt-6">
        Remember it?{' '}
        <Link to="/login" className="text-[#FD9C2D] font-bold hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
