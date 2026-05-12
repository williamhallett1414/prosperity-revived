import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AuthLayout from './AuthLayout';
import { Eye, EyeOff, Lock, KeyRound } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();

  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);

    if (!resetToken.trim() || !newPassword || !confirmPassword) {
      setError('Please fill in every field.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await base44.auth.resetPassword({
        resetToken: resetToken.trim(),
        newPassword,
      });
      navigate('/login', { replace: true, state: { passwordReset: true } });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Password reset failed.';
      if (/invalid|expired|not found|404/i.test(msg)) {
        setError('That reset token is invalid or expired. Please request a new one.');
      } else if (/password/i.test(msg)) {
        setError('Password is too weak. Try a longer one with mixed characters.');
      } else {
        setError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout showBack backTo="/forgot-password">
      <div className="mb-8 text-center">
        <h2
          className="text-3xl text-[#2A3A3F] dark:text-white mb-2 tracking-tight"
          style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}
        >
          Set a new password
        </h2>
        <p className="text-sm text-[#2A3A3F]/70 dark:text-white/60">
          Paste the reset token from your email below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="resetToken" className="block text-xs font-bold text-[#2A3A3F]/70 dark:text-white/70 mb-1.5 uppercase tracking-wider">
            Reset Token
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A3A3F]/40 dark:text-white/40" />
            <input
              id="resetToken"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              placeholder="Paste from your email"
              className="w-full pl-10 pr-3 py-3 bg-white dark:bg-white/5 border border-[#2A3A3F]/15 dark:border-white/10 rounded-xl text-[#2A3A3F] dark:text-white placeholder:text-[#2A3A3F]/40 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FD9C2D]/40 focus:border-[#FD9C2D]/40 min-h-[48px]"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-xs font-bold text-[#2A3A3F]/70 dark:text-white/70 mb-1.5 uppercase tracking-wider">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A3A3F]/40 dark:text-white/40" />
            <input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full pl-10 pr-12 py-3 bg-white dark:bg-white/5 border border-[#2A3A3F]/15 dark:border-white/10 rounded-xl text-[#2A3A3F] dark:text-white placeholder:text-[#2A3A3F]/40 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FD9C2D]/40 focus:border-[#FD9C2D]/40 min-h-[48px]"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[#2A3A3F]/50 dark:text-white/50 hover:text-[#2A3A3F] dark:hover:text-white"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-bold text-[#2A3A3F]/70 dark:text-white/70 mb-1.5 uppercase tracking-wider">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A3A3F]/40 dark:text-white/40" />
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full pl-10 pr-3 py-3 bg-white dark:bg-white/5 border border-[#2A3A3F]/15 dark:border-white/10 rounded-xl text-[#2A3A3F] dark:text-white placeholder:text-[#2A3A3F]/40 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FD9C2D]/40 focus:border-[#FD9C2D]/40 min-h-[48px]"
              disabled={isSubmitting}
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
            'Reset Password'
          )}
        </button>
      </form>

      <p className="text-center text-sm text-[#2A3A3F]/70 dark:text-white/60 mt-6">
        <Link to="/login" className="text-[#FD9C2D] font-bold hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
