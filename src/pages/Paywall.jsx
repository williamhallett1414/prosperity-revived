/**
 * Paywall — the subscription start screen.
 *
 * Visible to non-Founder users at the end of onboarding, before Home. This
 * file is the static UI (what Apple reviewers screenshot and approve). The
 * real purchase flow is wired in Phase 3 via @revenuecat/purchases-capacitor.
 *
 * Apple App Review requirements addressed here:
 *   - Subscription name visible ("Prosperity Revived Premium")
 *   - Length and price clearly shown ("14 days free, then $12.99/month")
 *   - Auto-renewal terms disclosed
 *   - Restore Purchases button (top-level, not buried)
 *   - Functional links to Terms of Service and Privacy Policy
 *   - "Cancel anytime" path explained
 *   - No pressure tactics, no fake countdowns, no hidden dismiss
 *
 * Brand voice: warm, faith-anchored, "no performance, no shame." Reads more
 * like an invitation than a sales pitch.
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Sparkles, ShieldCheck } from 'lucide-react';
import { createPageUrl } from '@/utils';

// Features deliberately exclude:
//   - "AI" framing — brand voice doesn't lean on AI in spiritual moments;
//     the rest of the app refers to "your coaches," not "your AI coaches."
//   - The 7-Day Awakening — not committed as Premium-locked at this time;
//     listing it here would set an expectation we haven't decided to honor.
const FEATURES = [
  'Five coaches — Gideon, Hannah, Coach David, Chef Daniel, Coach Paul',
  'Daily Scripture, prayer prompts, and devotionals',
  'Personalized workouts, meal plans, and habit tracking',
  'Private community and prayer partners',
];

export default function Paywall() {
  const navigate = useNavigate();

  // Phase 3 will replace this with RevenueCat's Purchases.purchaseProduct().
  // For now it's a no-op so the screen is screenshot-ready without lying
  // to Apple's reviewer about a working purchase flow.
  const handleStartTrial = () => {
    // PHASE_3: wire to RevenueCat purchase. For App Store screenshot
    // submission, the static layout is the deliverable.
    // eslint-disable-next-line no-console
    console.log('[paywall] purchase flow not yet implemented');
  };

  // Phase 3: Purchases.restorePurchases(). Apple requires this button to be
  // visible and functional. For screenshot purposes, the button exists and is
  // positioned where Apple expects it.
  const handleRestore = () => {
    // PHASE_3: wire to RevenueCat restore
    // eslint-disable-next-line no-console
    console.log('[paywall] restore not yet implemented');
  };

  // "Not now" path — Apple requires users be able to dismiss the paywall.
  // For now, this returns to Home; Phase 3 will set the entitlement state
  // and let downstream components decide what's gated.
  const handleDismiss = () => {
    navigate(createPageUrl('Home'));
  };

  return (
    <div className="min-h-screen bg-[#FBF6EC] dark:bg-[#0A1A2F]">
      <div className="max-w-md mx-auto px-5 pt-[max(env(safe-area-inset-top),20px)] pb-[max(env(safe-area-inset-bottom),24px)]">

        {/* Top bar — Restore Purchases lives here (Apple wants it visible) */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleDismiss}
            className="text-sm text-[#3C4E53]/60 dark:text-white/60 hover:text-[#3C4E53] dark:hover:text-white transition-colors"
            aria-label="Not now"
          >
            Not now
          </button>
          <button
            onClick={handleRestore}
            className="text-sm text-[#3C4E53]/60 dark:text-white/60 hover:text-[#3C4E53] dark:hover:text-white transition-colors"
          >
            Restore
          </button>
        </div>

        {/* Hero — brand-voice headline, not "UPGRADE NOW".
            "You weren't meant to carry it in pieces" names the fragmentation
            problem; the subhead names the four pillars and the answer. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#c9a227]" />
            <span className="text-[10px] tracking-[0.32em] font-bold uppercase text-[#c9a227]">
              Prosperity Revived Premium
            </span>
          </div>
          <h1
            className="text-[26px] sm:text-[30px] leading-[1.18] text-[#0A1A2F] dark:text-white mb-3"
            style={{ fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 }}
          >
            You weren't meant to<br />
            <span style={{ fontStyle: 'italic' }}>carry it in pieces.</span>
          </h1>
          <p className="text-[15px] text-[#3C4E53]/70 dark:text-white/70 leading-relaxed max-w-sm mx-auto">
            Faith, body, mind, community — finally held together by five coaches who actually know you. Begin with 14 days, free.
          </p>
        </motion.div>

        {/* Price card — clear, no fine-print games */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="rounded-3xl bg-white dark:bg-white/[0.04] border-2 border-[#c9a227] p-5 mb-5 relative overflow-hidden"
        >
          {/* Subtle gold light leak */}
          <div
            className="absolute -top-12 -right-10 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(250,217,141,0.25) 0%, transparent 70%)' }}
          />

          <div className="relative">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[28px] font-bold text-[#0A1A2F] dark:text-white">14 days free</span>
            </div>
            <p className="text-[13px] text-[#3C4E53]/70 dark:text-white/70 leading-relaxed">
              Then <strong className="text-[#0A1A2F] dark:text-white">$12.99 per month</strong>, billed monthly. Cancel anytime in your iPhone Settings before the trial ends — you won't be charged.
            </p>
          </div>
        </motion.div>

        {/* What's included */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.18 }}
          className="mb-6"
        >
          <p className="text-[10px] tracking-[0.28em] font-bold uppercase text-[#3C4E53]/50 dark:text-white/50 mb-3 px-1">
            Included
          </p>
          <ul className="space-y-2.5">
            {FEATURES.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FAD98D]/30 dark:bg-[#FAD98D]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#c9a227]" strokeWidth={3} />
                </div>
                <span className="text-[14px] text-[#3C4E53] dark:text-white/85 leading-snug">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA — the screenshot's centerpiece */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.26 }}
        >
          <button
            onClick={handleStartTrial}
            className="w-full rounded-2xl bg-gradient-to-br from-[#FD9C2D] to-[#c9a227] text-white font-bold py-4 px-6 text-[16px] shadow-lg active:scale-[0.98] transition-transform"
          >
            Start 14-day free trial
          </button>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-[#3C4E53]/55 dark:text-white/55">
            <ShieldCheck className="w-3 h-3" />
            <span>Manage or cancel anytime in iPhone Settings</span>
          </div>
        </motion.div>

        {/* Required disclosures — Apple wants this clear, not buried */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-7"
        >
          <p className="text-[11px] leading-relaxed text-[#3C4E53]/50 dark:text-white/50 text-center px-2">
            Payment is charged to your Apple ID at confirmation. Subscription auto-renews monthly at $12.99 USD unless cancelled at least 24 hours before the end of the current period. Manage or cancel in your iPhone Settings → [Your Name] → Subscriptions.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link
              to={createPageUrl('TermsAndConditions')}
              className="text-[11px] text-[#3C4E53]/60 dark:text-white/60 hover:text-[#3C4E53] dark:hover:text-white underline underline-offset-2"
            >
              Terms of Service
            </Link>
            <span className="text-[11px] text-[#3C4E53]/30 dark:text-white/30" aria-hidden="true">·</span>
            <Link
              to={createPageUrl('PrivacyPolicy')}
              className="text-[11px] text-[#3C4E53]/60 dark:text-white/60 hover:text-[#3C4E53] dark:hover:text-white underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            <span className="text-[11px] text-[#3C4E53]/30 dark:text-white/30" aria-hidden="true">·</span>
            <Link
              to={createPageUrl('SubscriptionTerms')}
              className="text-[11px] text-[#3C4E53]/60 dark:text-white/60 hover:text-[#3C4E53] dark:hover:text-white underline underline-offset-2"
            >
              Subscription Terms
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
