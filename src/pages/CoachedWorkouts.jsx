/**
 * CoachedWorkouts — selection page for Coach Led signature sessions.
 *
 * Route: /CoachedWorkouts
 *
 * REBUILD: previous version was cream + Fraunces serif italic + gold (the
 * devotional / Hallow-like aesthetic — wrong family for fitness). This
 * version matches the actual Workouts pages: cool slate background
 * (#F2F6FA), navy + royal-blue gradient hero, dark navy gradient session
 * cards, bold sans-serif headlines, sky-blue / orange accents.
 *
 * Each card → /CoachedWorkout?id=<id>.
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Headphones, Clock, Dumbbell, ChevronRight, Play } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { PREMADE_WORKOUTS } from '@/components/wellness/WorkoutLibrary';

// Difficulty pill colors that fit the cool-blue palette. Orange reserved
// for CTAs / "go" energy elsewhere on the page.
const DIFFICULTY_STYLE = {
  beginner:     { bg: 'rgba(56, 189, 248, 0.18)', text: '#7DD3FC', label: 'Beginner' },
  intermediate: { bg: 'rgba(253, 156, 45, 0.18)', text: '#FED7A1', label: 'Intermediate' },
  advanced:     { bg: 'rgba(244, 114, 182, 0.18)', text: '#FBCFE8', label: 'Advanced' },
};

// Subtle variation in the card gradient direction/stop so the 5 cards have
// visual rhythm without breaking the palette. Index-based so order is stable.
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #0A1A2F 0%, #1e3a8a 100%)',
  'linear-gradient(135deg, #0A1A2F 0%, #1e40af 100%)',
  'linear-gradient(135deg, #0A1A2F 0%, #1e3a8a 60%, #1e40af 100%)',
  'linear-gradient(135deg, #0A1A2F 0%, #1e40af 100%)',
  'linear-gradient(135deg, #0A1A2F 0%, #1e3a8a 100%)',
];

export default function CoachedWorkouts() {
  const navigate = useNavigate();

  // Featured sessions only, in their declared order from WorkoutLibrary.
  const sessions = PREMADE_WORKOUTS.filter((w) => w.coached_featured);

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">
      <div className="max-w-2xl mx-auto px-4 pt-5">

        {/* Top bar */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white dark:bg-white/5 hover:bg-gray-100 flex items-center justify-center shadow-sm dark:shadow-none transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white" />
          </button>
        </div>

        {/* Hero — big bold gradient card matching the fitness aesthetic */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <div
            className="rounded-2xl p-5 border border-[#38BDF8]/20 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0A1A2F 0%, #1e40af 100%)' }}
          >
            {/* Subtle radial highlight in upper-right for "energy" feel */}
            <div
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.28) 0%, transparent 70%)' }}
            />

            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-bold text-[#7DD3FC] uppercase tracking-widest">Coach Led · Audio Sessions</span>
              </div>
              <h1 className="text-2xl font-black text-white leading-tight mb-1">
                Pick your session.
              </h1>
              <p className="text-sm text-white/75 leading-relaxed">
                Coach David in your ear. Form cues during the work. Scripture and prayer during the rest. Press play and go.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Session list — each card is its own bold thumbnail */}
        <div className="space-y-3">
          {sessions.map((session, index) => {
            const diff = DIFFICULTY_STYLE[session.difficulty] || DIFFICULTY_STYLE.beginner;
            const exerciseCount = Array.isArray(session.exercises) ? session.exercises.length : 0;
            const cardGradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 + 0.08 }}
              >
                <Link
                  to={createPageUrl(`CoachedWorkout?id=${session.id}`)}
                  className="block group active:scale-[0.985] transition-transform"
                >
                  <div
                    className="rounded-2xl p-5 shadow-md dark:shadow-none hover:shadow-lg transition-shadow border border-[#38BDF8]/15 relative overflow-hidden"
                    style={{ background: cardGradient }}
                  >
                    {/* Subtle light leak top-right for depth */}
                    <div
                      className="absolute -top-12 -right-12 w-36 h-36 rounded-full pointer-events-none"
                      style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%)' }}
                    />

                    <div className="relative">
                      {/* Top row: title + play icon */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0 flex-1">
                          <h2 className="text-xl font-black text-white leading-tight mb-1">
                            {session.title}
                          </h2>
                          {session.coached_subtitle && (
                            <p className="text-[13px] text-[#7DD3FC] font-medium leading-snug">
                              {session.coached_subtitle}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#FD9C2D] to-[#E89020] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                          <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                        </div>
                      </div>

                      {/* Description */}
                      {session.description && (
                        <p className="text-[13px] text-white/75 leading-relaxed mt-2 mb-3">
                          {session.description}
                        </p>
                      )}

                      {/* Badges row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#38BDF8]/15 text-[#7DD3FC]">
                          <Clock className="w-3 h-3" />
                          {session.duration_minutes} min
                        </span>
                        <span
                          className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                          style={{ background: diff.bg, color: diff.text }}
                        >
                          {diff.label}
                        </span>
                        {exerciseCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white/55">
                            <Dumbbell className="w-3 h-3" />
                            {exerciseCount}
                          </span>
                        )}
                      </div>

                      {/* Verse line — kept for brand identity but quiet,
                          doesn't compete with the card energy */}
                      {session.coached_verse && (
                        <p className="text-[10px] text-white/45 mt-3 italic leading-relaxed">
                          {session.coached_verse}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footnote */}
        <p className="text-center text-[11px] text-[#3C4E53]/45 dark:text-white/40 mt-7 leading-relaxed px-4">
          Best with headphones. Every session ends in prayer.
        </p>
      </div>
    </div>
  );
}
