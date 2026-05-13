import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AuthLayout from './AuthLayout';
import { Eye, EyeOff, Lock } from 'lucide-react';

// Common parameter names email systems use to carry reset tokens. We check
// all of them since we don't know which Base44's tracking-redirect chain
// preserves through to our app.
const TOKEN_PARAM_NAMES = ['token', 'resetToken', 'reset_token', 'code', 't', 'key', 'auth', 'access_token'];

// Try to extract a reset token from anywhere it might be hiding:
//   1. Standard URL query string (?token=xyz)
//   2. URL hash fragment (#token=xyz — some platforms put auth tokens here)
//   3. React Router location's search and hash
//   4. Full window URL as a last resort (catches odd deep-link encodings)
// Returns {token, source} or {token: '', source: ''} if nothing found.
function extractTokenFromUrl(locationSearch, locationHash) {
  if (typeof window === 'undefined') return { token: '', source: '' };

  const tryParams = (queryStr) => {
    if (!queryStr) return null;
    const cleaned = queryStr.startsWith('?') || queryStr.startsWith('#') ? queryStr.slice(1) : queryStr;
    try {
      const params = new URLSearchParams(cleaned);
      for (const name of TOKEN_PARAM_NAMES) {
        const val = params.get(name);
        if (val && val.length > 6) return { token: val, source: name };
      }
    } catch (_e) {}
    return null;
  };

  // Try React Router's parsed location first
  const fromSearch = tryParams(locationSearch);
  if (fromSearch) return fromSearch;
  const fromHash = tryParams(locationHash);
  if (fromHash) return fromHash;

  // Fall back to window.location directly (in case the router missed it)
  const fromWindowSearch = tryParams(window.location.search);
  if (fromWindowSearch) return fromWindowSearch;
  const fromWindowHash = tryParams(window.location.hash);
  if (fromWindowHash) return fromWindowHash;

  return { token: '', source: '' };
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [resetToken, setResetToken] = useState('');
  const [tokenAutoFilled, setTokenAutoFilled] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ── DEBUG (disabled) ────────────────────────────────────────────────────
  // The diagnostic strip below was used to confirm that Base44's password-
  // reset email link delivers the token through to /reset-password as a URL
  // param. Commented out — uncomment all 4 DEBUG blocks (state, useEffect
  // capture, and the two yellow JSX strips below) if the reset flow ever
  // misbehaves and we need visibility again.
  // const [debugInfo, setDebugInfo] = useState(null);

  // On mount, try to auto-extract the reset token from the URL.
  useEffect(() => {
    const { token, source } = extractTokenFromUrl(location.search, location.hash);

    // DEBUG (disabled): capture URL info for the diagnostic strip.
    // const info = {
    //   pathname: location.pathname || '(none)',
    //   search: location.search || '(empty)',
    //   hash: location.hash || '(empty)',
    //   fullHref: typeof window !== 'undefined' ? window.location.href : '(no window)',
    //   tokenFound: token ? `${token.slice(0, 8)}…(len=${token.length})` : '(none)',
    //   tokenSource: source || '(none)',
    // };
    // setDebugInfo(info);
    // Suppress unused-variable lint warning for `source` while debug capture is off.
    void source;

    if (token) {
      setResetToken(token);
      setTokenAutoFilled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // If no token was found in the URL, this isn't a valid reset link. Show
  // a clear error UI rather than a confusing 'paste your token' fallback.
  if (!tokenAutoFilled) {
    return (
      <AuthLayout showBack backTo="/forgot-password">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center">
            <span className="text-3xl" aria-hidden="true">⚠️</span>
          </div>
          <h2
            className="text-2xl text-[#2A3A3F] dark:text-white mb-3 tracking-tight"
            style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}
          >
            This reset link isn't valid
          </h2>
          <p className="text-sm text-[#2A3A3F]/70 dark:text-white/60 mb-6 leading-relaxed">
            It may have expired, already been used, or been opened incorrectly. Request a fresh reset link and try again.
          </p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full bg-[#FD9C2D] hover:bg-[#e88d1f] text-white font-bold py-3.5 rounded-xl shadow-md transition-colors min-h-[52px]"
          >
            Request a new reset link
          </button>
          <Link
            to="/login"
            className="block mt-4 text-sm text-[#2A3A3F]/70 dark:text-white/60 hover:underline"
          >
            Back to sign in
          </Link>

          {/* DEBUG (disabled): diagnostic URL strip — uncomment along with the
              debugInfo state and useEffect capture block above to re-enable.
          {debugInfo && (
            <div className="mt-6 p-2 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-300/50 dark:border-yellow-500/30 rounded text-[10px] font-mono leading-tight text-yellow-900 dark:text-yellow-200 break-all text-left">
              <div className="font-bold mb-1">🔍 URL debug (temp — remove before launch)</div>
              <div>path: {debugInfo.pathname}</div>
              <div>search: {debugInfo.search}</div>
              <div>hash: {debugInfo.hash}</div>
              <div>found token: {debugInfo.tokenFound}</div>
              <div>from param: {debugInfo.tokenSource}</div>
              <div className="mt-1 opacity-70">full url: {debugInfo.fullHref}</div>
            </div>
          )}
          */}
        </div>
      </AuthLayout>
    );
  }

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
          Almost done. Just choose a new password below.
        </p>
      </div>

      {/* DEBUG (disabled): diagnostic URL strip — uncomment along with the
          debugInfo state and useEffect capture block above to re-enable.
      {debugInfo && (
        <div className="mb-4 p-2 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-300/50 dark:border-yellow-500/30 rounded text-[10px] font-mono leading-tight text-yellow-900 dark:text-yellow-200 break-all">
          <div className="font-bold mb-1">🔍 URL debug (temp — remove before launch)</div>
          <div>path: {debugInfo.pathname}</div>
          <div>search: {debugInfo.search}</div>
          <div>hash: {debugInfo.hash}</div>
          <div>found token: {debugInfo.tokenFound}</div>
          <div>from param: {debugInfo.tokenSource}</div>
          <div className="mt-1 opacity-70">full url: {debugInfo.fullHref}</div>
        </div>
      )}
      */}

      <form onSubmit={handleSubmit} className="space-y-4">
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
