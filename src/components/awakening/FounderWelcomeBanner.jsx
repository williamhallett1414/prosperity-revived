/**
 * FounderWelcomeBanner — home-screen card for Founding Members on July 6–7.
 *
 * What it is: the Founder's launch-week perk. Founders signed up specifically
 * because they were promised early access on July 6 (a day before public
 * launch). The Awakening event was moved to August 10, so this card is what
 * fulfills that launch-week promise — a personal welcome from Gideon and the
 * Spiritual Assessment, which establishes a baseline they'll revisit when the
 * Awakening kicks off a month later.
 *
 * Visibility is governed by lib/founderWelcome.js (see getFounderWelcomeState).
 *
 * Distinct from:
 *   - FounderCelebration: one-time post-onboarding overlay (the gold seal).
 *   - AwakeningBanner: the Aug 10–16 event banner, visible to everyone from
 *     July 27 onward.
 *
 * Tap navigates to /SpiritualAssessment.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { getFounderWelcomeState } from '@/lib/founderWelcome';
import gideonImg from '@/assets/gideon-avatar.png';

export default function FounderWelcomeBanner({ user }) {
  const state = getFounderWelcomeState(user);
  if (state === 'hidden') return null;

  const isPreLaunch = state === 'pre-launch';

  // Copy tuned to each day. Pre-launch frames it as a gift to founders
  // because they're "in early." Launch day frames it as a welcome alongside
  // public release. Both lead to the same destination (Spiritual Assessment).
  const eyebrow = isPreLaunch
    ? 'Founding Member · Day Zero'
    : 'Founding Member · Welcome';

  const headline = isPreLaunch
    ? "Your day is here, before everyone else's."
    : 'Welcome to Prosperity Revived.';

  const body = isPreLaunch
    ? "You're in a day early — that's the founder promise. Gideon has a welcome and a short Spiritual Assessment to mark where you're starting from. You'll come back to this in August."
    : "You're one of the first to walk this with us. Take the Spiritual Assessment to mark your starting point — we'll revisit it together during the Awakening on August 10.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl shadow-lg"
      style={{
        background:
          'linear-gradient(135deg, #1a2540 0%, #2A3A3F 50%, #3a2f10 130%)',
      }}
    >
      {/* Soft gold light leak — heritage feel, not "premium tier" */}
      <div
        className="absolute -top-12 -right-10 w-44 h-44 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(250,217,141,0.22) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-16 -left-8 w-36 h-36 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(253,156,45,0.15) 0%, transparent 70%)' }}
      />

      <Link
        to={createPageUrl('SpiritualAssessment')}
        className="relative block p-5 sm:p-6 active:scale-[0.99] transition-transform"
      >
        <div className="flex items-start gap-4">
          {/* Gideon's avatar with a thin gold border, echoing the founder profile treatment */}
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 border-[2.5px]"
            style={{ borderColor: '#c9a227' }}
          >
            <img
              src={gideonImg}
              alt="Gideon"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-[#FAD98D]" />
              <p
                className="text-[10px] font-bold tracking-[0.28em] uppercase"
                style={{ color: '#FAD98D' }}
              >
                {eyebrow}
              </p>
            </div>
            <h2
              className="text-lg sm:text-xl font-bold text-white leading-snug mb-2"
              style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            >
              {headline}
            </h2>
            <p className="text-sm text-white/75 leading-relaxed">{body}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#FAD98D]">
              Begin with Gideon <span aria-hidden="true">→</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
