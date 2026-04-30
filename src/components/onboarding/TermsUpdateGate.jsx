import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, ChevronDown, AlertTriangle, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

// ─── The date when legal docs were materially updated ─────────────────────────
const TERMS_UPDATE_DATE = '2026-03-12T00:00:00.000Z';

// ─── Key disclosures to show in the update gate ───────────────────────────────
const DISCLOSURES = [
  {
    icon: '🤖',
    heading: 'AI Disclosure Update',
    body: 'All five chatbot characters (Gideon, Hannah, Coach David, Chef Daniel, Coach Paul) are AI-generated. None are licensed professionals. AI responses may be inaccurate.',
    warning: true,
  },
  {
    icon: '🆘',
    heading: 'Crisis Resources',
    body: 'This app is NOT a crisis service. For mental health emergencies call/text 988, text HOME to 741741, or call 911.',
    emergency: true,
  },
  {
    icon: '💪',
    heading: 'Health & Fitness Risk',
    body: 'Consult a physician before starting any workout or nutrition plan. Physical exercise carries inherent risks including serious injury.',
    warning: true,
  },
  {
    icon: '💳',
    heading: 'Subscription Auto-Renewal',
    body: 'Subscriptions renew automatically. Cancel through your app store before the renewal date to avoid charges. Deleting the app does NOT cancel.',
    highlight: true,
  },
  {
    icon: '💰',
    heading: 'Financial Content Disclaimer',
    body: 'Financial coaching content is for educational purposes only — not financial, investment, tax, or legal advice. Consult a licensed financial advisor.',
    highlight: true,
  },
  {
    icon: '🔒',
    heading: 'Your Data',
    body: 'Health data, journals, mood check-ins, and prayer logs are private — never shared, never used for ads, never used to train AI. You may request or delete your data at any time via Settings.',
    highlight: true,
  },
];

// ─── Scroll-to-read mini doc ───────────────────────────────────────────────────
function DisclosureScroll({ onReady }) {
  const ref = useRef(null);
  const [pct, setPct] = useState(0);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const p = Math.min(100, Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100));
    setPct(p);
    if (p >= 85) onReady();
  }, [onReady]);

  return (
    <div className="flex flex-col" style={{ maxHeight: '46vh' }}>
      {/* Progress bar */}
      <div className="h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden mx-5 mb-1">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#C9A227] to-[#FD9C2D]"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div
        ref={ref}
        onScroll={onScroll}
        className="overflow-y-auto px-5 py-3 space-y-3 flex-1"
      >
        {DISCLOSURES.map((d, i) => (
          <div
            key={i}
            className={`rounded-2xl p-3.5 ${
              d.emergency
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200'
                : d.warning
                ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30'
                : 'bg-[#F2F6FA] dark:bg-[#0A1A2F] border border-gray-200 dark:border-white/10 dark:border-white/10'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <span className="text-lg flex-shrink-0 mt-0.5">{d.icon}</span>
              <div>
                <p className={`text-xs font-bold mb-1 ${
                  d.emergency ? 'text-red-700' : d.warning ? 'text-amber-700' : 'text-[#0A1A2F] dark:text-white dark:text-white'
                }`}>{d.heading}</p>
                <p className={`text-xs leading-relaxed ${
                  d.emergency ? 'text-red-800' : d.warning ? 'text-amber-800' : 'text-gray-600 dark:text-gray-300'
                }`}>{d.body}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="h-2" />
      </div>

      {pct < 85 && (
        <div className="flex items-center justify-center gap-1.5 py-2 text-gray-400 dark:text-gray-300">
          <motion.div animate={{ y: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
          <span className="text-xs font-medium">Scroll to read — {pct}% complete</span>
        </div>
      )}
    </div>
  );
}

// ─── Main Gate ────────────────────────────────────────────────────────────────
export default function TermsUpdateGate({ user, onAccepted }) {
  const [scrollReady, setScrollReady] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAccept = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        terms_accepted_at: new Date().toISOString(),
        terms_version: '2026-03-12',
      });
      setAccepted(true);
      setTimeout(onAccepted, 400);
    } catch {
      toast.error('Something went wrong. Please try again.');
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[300] bg-[#0A1A2F]/80 backdrop-blur-sm flex items-end sm:items-center justify-center"
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260, delay: 0.05 }}
        className="w-full max-w-lg bg-white dark:bg-white/5 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
        style={{ maxHeight: '94vh' }}
      >
        {/* Header */}
        <div className="bg-[#0A1A2F] px-5 py-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#C9A227]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Shield className="w-5 h-5 text-[#C9A227]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-base leading-tight">We've updated our terms</p>
            <p className="text-white/55 text-xs mt-0.5 leading-relaxed">
              We added important AI safety disclosures and updated our health, financial, and subscription policies.
              Please review and re-accept to continue.
            </p>
          </div>
        </div>

        {/* Update badge */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800/30">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <p className="text-xs text-amber-800 font-semibold">
            Effective 12 March 2026 — acceptance required to continue using Prosperity Revived
          </p>
        </div>

        {/* Scrollable disclosures */}
        <DisclosureScroll onReady={() => setScrollReady(true)} />

        {/* Accept area */}
        <div className="px-5 pb-6 pt-3 border-t border-gray-100 dark:border-white/10 space-y-3">
          {scrollReady && !accepted && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* Document links row */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Terms', href: '/TermsAndConditions' },
                  { label: 'Privacy', href: '/PrivacyPolicy' },
                  { label: 'Waiver', href: '/HealthWellnessWaiver' },
                  { label: 'Subscriptions', href: '/SubscriptionTerms' },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#C9A227]/40 text-[#C9A227] text-xs font-semibold hover:bg-[#C9A227]/8 transition-colors"
                  >
                    <FileText className="w-3 h-3" />
                    {label}
                  </a>
                ))}
              </div>

              <button
                onClick={handleAccept}
                disabled={saving}
                className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #C9A227, #FD9C2D)' }}
              >
                {saving ? (
                  <motion.div
                    className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <Check className="w-4 h-4" strokeWidth={3} />
                )}
                I agree to the updated Terms & Policies
              </button>

              <p className="text-[10px] text-center text-gray-400 dark:text-gray-300 leading-relaxed">
                By accepting, you confirm you are 13+ (or have parental consent if 13–17) and agree to the
                Terms & Conditions, Privacy Policy, Health & Wellness Waiver, and Subscription Terms.
              </p>
            </motion.div>
          )}

          {accepted && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-2 py-4"
            >
              <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/200 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
              <span className="text-sm font-bold text-green-700">Thank you — all set!</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Hook: should we show the gate? ──────────────────────────────────────────
export function needsTermsUpdate(user) {
  if (!user) return false;
  if (!user.onboarding_completed) return false; // Handled by full onboarding flow
  if (!user.terms_accepted_at) return true;     // Never accepted
  // Re-gate if accepted before the update date
  return new Date(user.terms_accepted_at) < new Date(TERMS_UPDATE_DATE);
}
