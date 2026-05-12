import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import AuthLayout from './AuthLayout';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAppState, markInstallSeen } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fromPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await base44.auth.loginViaEmailPassword(email.trim().toLowerCase(), password);
      // Mark this install as having gone through our auth flow — locks in the
      // token so it survives subsequent cold-starts as a trusted session.
      markInstallSeen();
      // SDK has set the token automatically. Re-run AuthContext bootstrap so
      // user is loaded and isAuthenticated flips to true.
      await checkAppState();
      navigate(fromPath, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message
        || err?.message
        || 'Login failed — please check your email and password.';
      // Surface a friendlier message for the most common error
      if (/invalid|incorrect|wrong|not found|404|401/i.test(msg)) {
        setError("That email and password don't match. Try again or reset your password.");
      } else {
        setError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout heroImage="/auth/login-hero.jpg">
      <div className="mb-6 text-center">
        <h2
          className="text-3xl text-[#2A3A3F] dark:text-white mb-1.5 tracking-tight"
          style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}
        >
          Welcome back
        </h2>
        <p className="text-sm text-[#2A3A3F]/70 dark:text-white/60">
          Sign in to continue your journey
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
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-xs font-bold text-[#2A3A3F]/70 dark:text-white/70 uppercase tracking-wider">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-[#FD9C2D] hover:underline font-semibold"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A3A3F]/40 dark:text-white/40" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
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
            'Sign In'
          )}
        </button>
      </form>

      <p className="text-center text-sm text-[#2A3A3F]/70 dark:text-white/60 mt-6">
        New to Prosperity Revived?{' '}
        <Link to="/signup" className="text-[#FD9C2D] font-bold hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
