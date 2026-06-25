/**
 * CoachedWorkouts — selection page for Coach Led signature sessions.
 *
 * Route: /CoachedWorkouts
 *
 * Lists the 5 curated coached-audio sessions (filtered from PREMADE_WORKOUTS
 * by coached_featured: true). Each card routes to /CoachedWorkout?id=<id>
 * which loads the existing player. This page exists so the Coach Led
 * entry point on the Workouts page surfaces real choice instead of routing
 * to a random recommendedWorkout.
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Headphones, Clock, ChevronRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { PREMADE_WORKOUTS } from '@/components/wellness/WorkoutLibrary';

// Color accent per difficulty — subtle visual differentiation without
// becoming a noisy palette.
const DIFFICULTY_ACCENT = {
  beginner: { bg: 'rgba(56, 189, 248, 0.10)', text: '#0EA5E9', label: 'Beginner' },
  intermediate: { bg: 'rgba(201, 162, 39, 0.12)', text: '#c9a227', label: 'Intermediate' },
  advanced: { bg: 'rgba(253, 156, 45, 0.12)', text: '#FD9C2D', label: 'Advanced' },
};

export default function CoachedWorkouts() {
  const navigate = useNavigate();

  // The five featured sessions, in the order they appear in WorkoutLibrary.
  const sessions = PREMADE_WORKOUTS.filter((w) => w.coached_featured);

  return (
    <div className="min-h-screen bg-[#FBF6EC] dark:bg-[#0A1A2F] pb-28">
      <div className="max-w-2xl mx-auto px-4 pt-5">

        {/* Top bar */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white dark:bg-white/5 hover:bg-gray-100 flex items-center justify-center shadow-sm dark:shadow-none transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white" />
          </button>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-1.5 mb-2">
            <Headphones className="w-3.5 h-3.5 text-[#c9a227]" />
            <span className="text-[10px] tracking-[0.32em] font-bold uppercase text-[#c9a227]">Coach Led</span>
          </div>
          <h1
            className="text-[28px] sm:text-[32px] leading-tight text-[#0A1A2F] dark:text-white mb-2"
            style={{ fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 }}
          >
            <span style={{ fontStyle: 'italic' }}>Pick a session.</span>
          </h1>
          <p className="text-[14px] text-[#3C4E53]/70 dark:text-white/70 leading-relaxed max-w-md">
            Coach David in your ear. Scripture and prayer woven through the rest periods. Five sessions, each with a clear purpose.
          </p>
        </motion.div>

        {/* Sessions */}
        <div className="space-y-3">
          {sessions.map((session, index) => {
            const accent = DIFFICULTY_ACCENT[session.difficulty] || DIFFICULTY_ACCENT.beginner;
            const exerciseCount = Array.isArray(session.exercises) ? session.exercises.length : 0;
            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 + 0.1 }}
              >
                <Link
                  to={createPageUrl(`CoachedWorkout?id=${session.id}`)}
                  className="block group"
                >
                  <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-[#FAD98D]/30 dark:border-white/10 hover:border-[#c9a227]/50 hover:shadow-md dark:shadow-none transition-all overflow-hidden">
                    <div className="p-5">
                      {/* Header row: title + chevron */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0 flex-1">
                          <h2
                            className="text-[20px] text-[#0A1A2F] dark:text-white leading-tight mb-0.5"
                            style={{ fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 }}
                          >
                            {session.title}
                          </h2>
                          {session.coached_subtitle && (
                            <p
                              className="text-[13px] text-[#3C4E53]/65 dark:text-white/65 leading-snug"
                              style={{ fontStyle: 'italic' }}
                            >
                              {session.coached_subtitle}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#3C4E53]/30 dark:text-white/30 flex-shrink-0 mt-1 group-hover:text-[#c9a227] transition-colors" />
                      </div>

                      {/* Description */}
                      {session.description && (
                        <p className="text-[13px] text-[#3C4E53]/80 dark:text-white/80 leading-relaxed mt-3 mb-4">
                          {session.description}
                        </p>
                      )}

                      {/* Footer row: badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
                          style={{ background: accent.bg, color: accent.text }}
                        >
                          <Clock className="w-3 h-3" />
                          {session.duration_minutes} min
                        </span>
                        <span
                          className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                          style={{ background: accent.bg, color: accent.text }}
                        >
                          {accent.label}
                        </span>
                        {exerciseCount > 0 && (
                          <span className="text-[11px] text-[#3C4E53]/55 dark:text-white/55">
                            {exerciseCount} exercise{exerciseCount === 1 ? '' : 's'}
                          </span>
                        )}
                      </div>

                      {/* Verse anchor — small and quiet, just the citation */}
                      {session.coached_verse && (
                        <p className="text-[11px] text-[#c9a227]/80 mt-3 font-medium tracking-wide">
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
        <p className="text-center text-[11px] text-[#3C4E53]/40 dark:text-white/40 mt-8 leading-relaxed px-4">
          Each session weaves form cues, Scripture, and a closing prayer. Best with headphones.
        </p>
      </div>
    </div>
  );
}
