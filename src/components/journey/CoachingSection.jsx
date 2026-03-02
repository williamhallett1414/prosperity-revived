import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import {
  BookOpen, Dumbbell, Utensils, Brain,
  ChevronRight, Play, CheckCircle2, Lock,
  Sparkles, Trophy, Calendar, Target, TrendingUp,
  Star
} from 'lucide-react';
import { prosperityRevivedPlan, PLAN_ID } from './CoachingPlanData';

const STORAGE_KEY = `coaching_progress_${PLAN_ID}`;

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}

function saveProgress(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
}

const PILLAR_CONFIG = {
  devotion:  { icon: BookOpen, color: '#c9a227', bg: 'bg-[#c9a227]/15', label: 'Devotion' },
  workout:   { icon: Dumbbell, color: '#38BDF8', bg: 'bg-[#38BDF8]/15', label: 'Workout'  },
  nutrition: { icon: Utensils,  color: '#4ade80', bg: 'bg-[#4ade80]/12',  label: 'Nutrition' },
  growth:    { icon: Brain,     color: '#a78bfa', bg: 'bg-[#a78bfa]/12', label: 'Growth'   },
};

export default function CoachingSection() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(loadProgress);
  const [showAll, setShowAll] = useState(false);

  const plan = prosperityRevivedPlan;

  // Find current day
  const completedDays = Object.keys(progress).filter(k => k.startsWith('day_') && progress[k]?.completed).length;
  const currentDay = Math.min(completedDays + 1, plan.totalDays);
  const currentWeekIndex = Math.floor((currentDay - 1) / 7);
  const currentWeek = plan.weeks[currentWeekIndex];
  const currentDayData = currentWeek?.days.find(d => d.day === currentDay);

  const overallPct = Math.round((completedDays / plan.totalDays) * 100);

  function togglePillar(day, pillar) {
    setProgress(prev => {
      const key = `day_${day}`;
      const existing = prev[key] || {};
      const pillars = existing.pillars || {};
      const newPillars = { ...pillars, [pillar]: !pillars[pillar] };
      const allDone = ['devotion', 'workout', 'nutrition', 'growth'].every(p => newPillars[p]);
      const updated = { ...prev, [key]: { ...existing, pillars: newPillars, completed: allDone } };
      saveProgress(updated);
      return updated;
    });
  }

  const dayKey = `day_${currentDay}`;
  const todayPillars = progress[dayKey]?.pillars || {};
  const pillarsCompleted = Object.values(todayPillars).filter(Boolean).length;

  if (!plan || !currentDayData) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center shadow-sm">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0A1A2F]">Coaching Plan</h2>
            <p className="text-xs text-[#0A1A2F]/50">Prosperity Revived · 8 Weeks</p>
          </div>
        </div>
        <button
          onClick={() => navigate(createPageUrl('CoachingPlanPage'))}
          className="text-xs text-[#c9a227] font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          Full Plan <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Overall Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#D9B878]/25 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-bold text-[#0A1A2F]">
              Week {currentWeekIndex + 1}: <span className="text-[#c9a227]">{currentWeek?.theme}</span>
            </p>
            <p className="text-xs text-[#0A1A2F]/50 mt-0.5">{currentWeek?.subtitle}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#0A1A2F]">{overallPct}<span className="text-sm font-normal text-[#0A1A2F]/40">%</span></p>
            <p className="text-[10px] text-[#0A1A2F]/40">complete</p>
          </div>
        </div>
        <div className="h-2 bg-[#F2F6FA] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#c9a227] to-[#D9B878] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <p className="text-[10px] text-[#0A1A2F]/35">Day {completedDays}/{plan.totalDays}</p>
          <p className="text-[10px] text-[#0A1A2F]/35">{plan.totalDays - completedDays} days remaining</p>
        </div>
      </div>

      {/* Today's Day Card */}
      <div className="bg-gradient-to-br from-[#0A1A2F] to-[#1a3a5c] rounded-2xl p-5 shadow-md mb-4">
        {/* Day label */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#c9a227] uppercase tracking-widest">Day {currentDay}</span>
            <span className="text-white/20 text-xs">·</span>
            <span className="text-white/50 text-xs">{currentWeek?.theme}</span>
          </div>
          {pillarsCompleted === 4 && (
            <div className="flex items-center gap-1 text-[#c9a227]">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold">Complete!</span>
            </div>
          )}
        </div>

        {/* Devotion title */}
        <h3 className="text-white font-bold text-lg leading-tight mb-1">{currentDayData.devotion.title}</h3>
        <p className="text-[#c9a227]/80 text-xs italic mb-1">"{currentDayData.devotion.verse}"</p>
        <p className="text-white/40 text-xs mb-4">— {currentDayData.devotion.ref}</p>

        {/* Daily progress dots */}
        <div className="flex gap-1.5 mb-4">
          {[0,1,2,3].map(i => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i < pillarsCompleted ? 'bg-[#c9a227]' : 'bg-white/12'}`} />
          ))}
        </div>

        {/* Four Pillars */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {Object.entries(PILLAR_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const done = !!todayPillars[key];
            const data = currentDayData[key];
            return (
              <button key={key} onClick={() => togglePillar(currentDay, key)}
                className={`relative flex items-start gap-2.5 p-3 rounded-xl text-left transition-all border ${
                  done ? 'bg-[#c9a227]/15 border-[#c9a227]/30' : 'bg-white/5 border-white/8 hover:bg-white/10'
                }`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${done ? 'bg-[#c9a227]' : 'bg-white/8'}`}>
                  {done ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Icon className="w-4 h-4" style={{ color: cfg.color }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${done ? 'text-[#c9a227]' : 'text-white/40'}`}>{cfg.label}</p>
                  <p className={`text-xs mt-0.5 leading-snug ${done ? 'text-white/70' : 'text-white/50'}`}>
                    {key === 'devotion' && data.ref}
                    {key === 'workout' && `${data.duration}min · ${data.category}`}
                    {key === 'nutrition' && data.focus}
                    {key === 'growth' && 'Journal prompt'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate(createPageUrl('CoachingPlanPage') + `?day=${currentDay}`)}
          className="w-full bg-gradient-to-r from-[#c9a227] to-[#D9B878] text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Play className="w-4 h-4" /> Open Today's Plan
        </button>
      </div>

      {/* Week Overview — mini day grid */}
      <div className="bg-white rounded-2xl p-4 border border-[#E6EBEF] shadow-sm">
        <p className="text-xs font-bold text-[#0A1A2F]/50 uppercase tracking-wider mb-3">This Week</p>
        <div className="grid grid-cols-7 gap-1.5">
          {currentWeek?.days.map(d => {
            const k = `day_${d.day}`;
            const done = progress[k]?.completed;
            const isToday = d.day === currentDay;
            const isPast = d.day < currentDay;
            return (
              <button key={d.day}
                onClick={() => navigate(createPageUrl('CoachingPlanPage') + `?day=${d.day}`)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all ${
                  done ? 'bg-[#c9a227] shadow-sm' :
                  isToday ? 'bg-[#c9a227]/15 border-2 border-[#c9a227]/60' :
                  isPast ? 'bg-[#F2F6FA]' :
                  'bg-[#F2F6FA] opacity-40'
                }`}>
                <span className={`text-[10px] font-bold ${done ? 'text-white' : isToday ? 'text-[#c9a227]' : 'text-[#0A1A2F]/50'}`}>
                  {d.day}
                </span>
                {done && <CheckCircle2 className="w-2.5 h-2.5 text-white mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
