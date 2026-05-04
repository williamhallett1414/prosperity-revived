import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, MessageCircle, UtensilsCrossed, BookOpen, LogOut, Crown } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { COACHING_PLANS } from '@/components/coaching/planData';

// Read all started coaching plans from localStorage and rank by most progress.
// Returns [{ plan, completedDays, nextDay, pct }, ...] sorted desc by completedDays.
function getStartedCoachingPlans() {
  const started = [];
  try {
    for (const key of Object.keys(localStorage)) {
      if (!key.startsWith('coaching_progress_')) continue;
      let progress = {};
      try { progress = JSON.parse(localStorage.getItem(key)) || {}; } catch (_e) { continue; }
      const completedDays = (progress.completed_days || []).length;
      if (completedDays === 0) continue;
      const planId = key.replace('coaching_progress_', '');
      const plan = COACHING_PLANS.find(p => p.id === planId);
      if (!plan) continue;
      const nextDay = Math.min(completedDays + 1, plan.days_total);
      const pct = Math.round((completedDays / plan.days_total) * 100);
      started.push({ plan, completedDays, nextDay, pct });
    }
  } catch (_e) {}
  return started.sort((a, b) => b.completedDays - a.completedDays);
}

export default function HomeHamburger() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Read started coaching plans only when menu opens (cheap, but no need to recompute on every render)
  const startedPlans = useMemo(() => (open ? getStartedCoachingPlans() : []), [open]);
  const primaryPlan = startedPlans[0] || null;
  const extraPlanCount = Math.max(0, startedPlans.length - 1);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [open]);

  const items = [
    { icon: Bell, label: 'Notifications', action: () => navigate(createPageUrl('Notifications')) },
    { icon: MessageCircle, label: 'Messages', action: () => navigate(createPageUrl('Messages')) },
    { icon: UtensilsCrossed, label: 'Log Food', action: () => navigate(createPageUrl('Nutrition') + '?logFood=true') },
    { icon: BookOpen, label: 'My Plan', action: () => navigate(createPageUrl('Plans')) },
    { icon: LogOut, label: 'Sign Out', action: async () => {
      if (window.confirm('Are you sure you want to sign out?')) {
        try { await base44.auth.signOut(); } catch {}
        window.location.href = '/';
      }
    }, danger: true },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
        style={{
          background: open ? 'rgba(201,162,39,0.15)' : 'transparent',
        }}
      >
        {open ? (
          <X className="w-5 h-5 text-[#0A1A2F] dark:text-white" />
        ) : (
          <Menu className="w-5 h-5 text-[#0A1A2F] dark:text-white" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-12 w-64 bg-white dark:bg-[#1A2540] rounded-2xl shadow-2xl dark:shadow-none border border-gray-100 dark:border-white/10 overflow-hidden z-50"
          >
            {/* My Coaching */}
            {primaryPlan ? (
              <div className="border-b border-gray-100 dark:border-white/8">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setOpen(false);
                    navigate(createPageUrl(`CoachingPlanDetail?id=${primaryPlan.plan.id}&day=${primaryPlan.nextDay}`));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOpen(false);
                      navigate(createPageUrl(`CoachingPlanDetail?id=${primaryPlan.plan.id}&day=${primaryPlan.nextDay}`));
                    }
                  }}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className={`bg-gradient-to-r ${primaryPlan.plan.gradient} px-4 py-2.5 flex items-center gap-2.5`}>
                    <Crown className="w-3.5 h-3.5 text-white/85 flex-shrink-0" />
                    <span className="text-[10px] font-bold text-white tracking-[0.15em] uppercase">My Coaching</span>
                  </div>
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-xl flex-shrink-0">{primaryPlan.plan.cover_emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#0A1A2F] dark:text-white leading-tight truncate">
                          {primaryPlan.plan.title}
                        </p>
                        <p className="text-[11px] text-[#0A1A2F]/55 dark:text-white/55 mt-0.5">
                          Day {primaryPlan.completedDays} of {primaryPlan.plan.days_total} · {primaryPlan.pct}%
                        </p>
                      </div>
                    </div>
                    <div className="h-1 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#3C4E53] to-[#c9a227] rounded-full transition-all"
                        style={{ width: `${primaryPlan.pct}%` }}
                      />
                    </div>
                    {extraPlanCount > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpen(false);
                          navigate(createPageUrl('CoachingPlans'));
                        }}
                        className="mt-2 text-[11px] font-semibold text-[#3C4E53] dark:text-[#FAD98D] hover:opacity-75"
                      >
                        +{extraPlanCount} more {extraPlanCount === 1 ? 'plan' : 'plans'} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setOpen(false); navigate(createPageUrl('CoachingPlans')); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors min-h-[44px] text-[#0A1A2F] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-100 dark:border-white/8"
              >
                <Crown className="w-4.5 h-4.5 text-[#c9a227]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">My Coaching</p>
                  <p className="text-[11px] text-[#0A1A2F]/50 dark:text-white/50 mt-0.5">Browse coaching plans</p>
                </div>
              </button>
            )}

            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={() => { setOpen(false); item.action(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors min-h-[44px] ${
                    item.danger
                      ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/15 border-t border-gray-100 dark:border-white/8'
                      : 'text-[#0A1A2F] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${item.danger ? 'text-red-400' : 'text-[#c9a227]'}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
