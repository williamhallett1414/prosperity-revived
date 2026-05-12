import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import AuthLayout from './AuthLayout';
import {
  getQuizAnswers,
  hasQuizAnswers,
  clearQuizAnswers,
  quizAnswersToUserFields,
} from './quiz/quizStorage';

const CODE_LENGTH = 6;

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAppState, markInstallSeen } = useAuth();

  const passedEmail = location.state?.email || '';
  const passedPassword = location.state?.password || '';

  const [email, setEmail] = useState(passedEmail);
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef([]);

  // If the user landed here directly without an email, send them to signup
  useEffect(() => {
    if (!passedEmail) {
      // Allow staying here if they type an email manually, but warn
      // No auto-redirect — they may have refreshed the page.
    } else {
      // Focus first input on mount
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [passedEmail]);

  // Resend cooldown
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  const code = digits.join('');

  const handleDigitChange = (idx, value) => {
    const clean = value.replace(/\D/g, '').slice(-1); // last numeric char only
    setDigits(prev => {
      const next = [...prev];
      next[idx] = clean;
      return next;
    });
    if (clean && idx < CODE_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = (e.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(CODE_LENGTH).fill('');
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    const focusIdx = Math.min(pasted.length, CODE_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (isSubmitting) return;
    setError(null);

    if (!email.trim()) {
      setError('Please enter the email you signed up with.');
      return;
    }
    if (code.length !== CODE_LENGTH) {
      setError(`Please enter the full ${CODE_LENGTH}-digit code.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await base44.auth.verifyOtp({ email: email.trim().toLowerCase(), otpCode: code });
      // If we have the password from signup, auto-login. Otherwise route to login.
      if (passedPassword) {
        try {
          await base44.auth.loginViaEmailPassword(email.trim().toLowerCase(), passedPassword);
          markInstallSeen();
          // Persist pre-signup quiz answers to the User entity if any are stashed.
          if (hasQuizAnswers()) {
            try {
              const fields = quizAnswersToUserFields(getQuizAnswers());
              await base44.auth.updateMe(fields);
              clearQuizAnswers();
            } catch (_persistErr) {
              // Best-effort. Leave answers in localStorage for retry.
            }
          }
          await checkAppState();
          navigate('/', { replace: true });
          return;
        } catch (_loginErr) {
          // Verification worked but auto-login failed — fall back to manual login.
          navigate('/login', { replace: true, state: { justVerified: true } });
          return;
        }
      }
      navigate('/login', { replace: true, state: { justVerified: true } });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Verification failed.';
      if (/invalid|incorrect|wrong|expired/i.test(msg)) {
        setError("That code didn't work. Double-check it or request a new one.");
      } else {
        setError(msg);
      }
      // Clear the inputs so they can try again
      setDigits(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (isResending || resendCountdown > 0) return;
    if (!email.trim()) {
      setError('Please enter your email first.');
      return;
    }
    setError(null);
    setIsResending(true);
    try {
      await base44.auth.resendOtp(email.trim().toLowerCase());
      setResendCountdown(30);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Couldn't resend code.";
      setError(msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout showBack backTo="/signup">
      <div className="mb-8 text-center">
        <h2
          className="text-3xl text-[#2A3A3F] dark:text-white mb-2 tracking-tight"
          style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}
        >
          Check your email
        </h2>
        <p className="text-sm text-[#2A3A3F]/70 dark:text-white/60">
          We sent a {CODE_LENGTH}-digit code to{' '}
          <span className="font-semibold text-[#2A3A3F] dark:text-white">{email || 'your email'}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email field — only shown editable if user landed without one */}
        {!passedEmail && (
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-[#2A3A3F]/70 dark:text-white/70 mb-1.5 uppercase tracking-wider">
              Email
            </label>
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
              className="w-full px-3 py-3 bg-white dark:bg-white/5 border border-[#2A3A3F]/15 dark:border-white/10 rounded-xl text-[#2A3A3F] dark:text-white placeholder:text-[#2A3A3F]/40 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FD9C2D]/40 focus:border-[#FD9C2D]/40 min-h-[48px]"
              disabled={isSubmitting}
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-[#2A3A3F]/70 dark:text-white/70 mb-3 uppercase tracking-wider text-center">
            Verification Code
          </label>
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {digits.map((d, idx) => (
              <input
                key={idx}
                ref={el => inputRefs.current[idx] = el}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={d}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onFocus={(e) => e.target.select()}
                className="w-12 h-14 text-center text-xl font-bold bg-white dark:bg-white/5 border border-[#2A3A3F]/15 dark:border-white/10 rounded-xl text-[#2A3A3F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FD9C2D]/40 focus:border-[#FD9C2D]/40"
                disabled={isSubmitting}
                aria-label={`Digit ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2.5">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || code.length !== CODE_LENGTH}
          className="w-full bg-[#FD9C2D] hover:bg-[#e88d1f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-md transition-colors min-h-[52px] flex items-center justify-center"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Verify & Continue'
          )}
        </button>
      </form>

      <div className="text-center text-sm text-[#2A3A3F]/70 dark:text-white/60 mt-6 space-y-2">
        <p>
          Didn't receive a code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || resendCountdown > 0}
            className="text-[#FD9C2D] font-bold hover:underline disabled:opacity-60 disabled:no-underline"
          >
            {resendCountdown > 0
              ? `Resend in ${resendCountdown}s`
              : isResending ? 'Sending…' : 'Resend code'}
          </button>
        </p>
        <p>
          <Link to="/login" className="text-[#2A3A3F]/70 dark:text-white/60 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
