import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import AuthLayout from './AuthLayout';
import { Eye, EyeOff, Mail, Lock, Check } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const { checkAppState } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password || !confirmPassword) {
      setError('Please fill in every field.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (!agreedToTerms) {
      setError('Please accept the Terms and Privacy Policy to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      await base44.auth.register({ email: trimmedEmail, password });
      // Try to log in immediately — if the app doesn't require OTP verification,
      // this works and we skip the verify screen entirely. If it fails (likely
      // because email verification is required first), fall through to OTP.
      try {
        await base44.auth.loginViaEmailPassword(trimmedEmail, password);
        await checkAppState();
        navigate('/', { replace: true });
        return;
      } catch (_loginErr) {
        // Account was created but can't log in yet → email verification needed
        navigate('/verify-email', {
          replace: true,
          state: { email: trimmedEmail, password },
        });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Sign-up failed — please try again.';
      if (/already|exists|taken|registered/i.test(msg)) {
        setError('An account with this email already exists. Try signing in instead.');
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
    <AuthLayout showBack backTo="/login" heroImage="/auth/login-hero.jpg">
      <div className="mb-6 text-center">
        <h2
          className="text-3xl text-[#2A3A3F] dark:text-white mb-1.5 tracking-tight"
          style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}
        >
          Begin your journey
        </h2>
        <p className="text-sm text-[#2A3A3F]/70 dark:text-white/60">
          Create your account in seconds
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
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-bold text-[#2A3A3F]/70 dark:text-white/70 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A3A3F]/40 dark:text-white/40" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            Confirm Password
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

        {/* Terms checkbox */}
        <label className="flex items-start gap-3 cursor-pointer pt-1">
          <button
            type="button"
            onClick={() => setAgreedToTerms(t => !t)}
            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              agreedToTerms
                ? 'bg-[#FD9C2D] border-[#FD9C2D]'
                : 'border-[#2A3A3F]/30 dark:border-white/30 bg-transparent'
            }`}
            aria-checked={agreedToTerms}
            role="checkbox"
          >
            {agreedToTerms && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
          </button>
          <span className="text-xs text-[#2A3A3F]/80 dark:text-white/70 leading-relaxed">
            I agree to the{' '}
            <Link to="/TermsAndConditions" className="text-[#FD9C2D] font-semibold underline">
              Terms
            </Link>
            {' '}and{' '}
            <Link to="/PrivacyPolicy" className="text-[#FD9C2D] font-semibold underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

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
            'Create Account'
          )}
        </button>
      </form>

      <p className="text-center text-sm text-[#2A3A3F]/70 dark:text-white/60 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-[#FD9C2D] font-bold hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
