import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, BookOpen, Dumbbell, Utensils, Brain, Calendar, CheckCircle2, ChevronRight, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COACHING_PLANS, WEEK_THEMES } from '@/components/coaching/planData';
import { base44 } from '@/api/base44Client';

function getPlanProgress(planId) {
  try {
    const raw = localStorage.getItem(`coaching_progress_${planId}`);
    return raw ? JSON.parse(raw) : { completed_days: [] };
  } catch { return { completed_days: [] }; }
}

export default function CoachingPlans() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F8F0] pb-28">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#0D4F3C]/10 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link to={createPageUrl('ProgressDashboard')}
            className="w-9 h-9 rounded-full bg-[#E8F0E8] hover:bg-[#D8E8D8] flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#0D4F3C]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#0A1A2F]">Coaching Plans</h1>
            <p className="text-xs text-[#0A1A2F]/55">8-week whole-life transformation programs</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6">

        {/* Hero intro */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0D4F3C] to-[#1a6b50] rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a227]/10 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#c9a227] flex items-center justify-center text-2xl shadow-lg">👑</div>
              <div>
                <h2 className="text-xl font-bold">Prosperity Coaching</h2>
                <p className="text-white/65 text-sm">Whole-life transformation plans</p>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Each 8-week plan weaves together daily Scripture, progressive workouts, intentional nutrition, and journaling prompts — all connected to the tools already in your app.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: BookOpen, label: 'Daily Bible', color: 'bg-[#c9a227]/20 text-[#FAD98D]' },
                { icon: Dumbbell, label: 'Workouts', color: 'bg-white/10 text-white/80' },
                { icon: Utensils, label: 'Nutrition', color: 'bg-white/10 text-white/80' },
                { icon: Brain, label: 'Journaling', color: 'bg-white/10 text-white/80' },
              ].map(({ icon: Icon, label, color }) => (
                <span key={label} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${color}`}>
                  <Icon className="w-3 h-3" /> {label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Plans list */}
        <div className="space-y-4">
          {(COACHING_PLANS || []).filter(Boolean).map((plan, idx) => {
            const progress = getPlanProgress(plan.id);
            const completedDays = progress.completed_days?.length || 0;
            const pct = Math.round((completedDays / plan.days_total) * 100);
            const currentDay = completedDays + 1;
            const isStarted = completedDays > 0;

            return (
              <motion.div key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white rounded-2xl overflow-hidden border border-[#0D4F3C]/10 shadow-sm hover:shadow-md transition-all"
              >
                {/* Plan header */}
                <div className={`bg-gradient-to-r ${plan.gradient} p-5`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{plan.cover_emoji}</span>
                        <span className="text-xs font-bold text-white/70 uppercase tracking-widest bg-white/15 px-2.5 py-1 rounded-full">
                          {plan.weeks} Weeks
                        </span>
                        <span className="text-xs font-bold text-white/70 uppercase tracking-widest bg-white/15 px-2.5 py-1 rounded-full">
                          {plan.difficulty}
                        </span>
                      </div>
                      <h3 className="text-white font-bold text-xl leading-tight mb-1">{plan.title}</h3>
                      <p className="text-white/65 text-sm">{plan.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Plan body */}
                <div className="p-5">
                  <p className="text-[#0A1A2F]/65 text-sm leading-relaxed mb-4">{plan.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {plan.tags.map(tag => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-[#F5F8F0] text-[#0D4F3C] font-medium border border-[#0D4F3C]/15">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Week themes */}
                  <div className="mb-4">
                    <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-wider mb-2">8 Week Journey</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {plan.week_themes.map(wt => (
                        <div key={wt.week} className={`rounded-lg p-2 text-center bg-gradient-to-br ${wt.color} bg-opacity-10`}>
                          <p className="text-base mb-0.5">{wt.emoji}</p>
                          <p className="text-white text-[9px] font-bold leading-tight">{wt.theme}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress (if started) */}
                  {isStarted && (
                    <div className="mb-4 p-3 bg-[#F5F8F0] rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#0D4F3C]">Your Progress</span>
                        <span className="text-xs font-bold text-[#0D4F3C]">Day {completedDays}/{plan.days_total}</span>
                      </div>
                      <div className="h-2 bg-[#0D4F3C]/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#0D4F3C] to-[#c9a227] rounded-full transition-all"
                          style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-[#0A1A2F]/40">{pct}% complete</span>
                        <span className="text-[10px] font-semibold text-[#0D4F3C]">{plan.days_total - completedDays} days remaining</span>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <Button
                    onClick={() => navigate(createPageUrl(`CoachingPlanDetail?id=${plan.id}&day=${isStarted ? currentDay : 1}`))}
                    className="w-full bg-gradient-to-r from-[#0D4F3C] to-[#22856A] hover:opacity-90 text-white font-bold py-3 rounded-xl shadow-md"
                  >
                    {isStarted ? (
                      <>Continue Day {currentDay} <ChevronRight className="w-4 h-4 ml-1" /></>
                    ) : (
                      <>Begin the Journey <ChevronRight className="w-4 h-4 ml-1" /></>
                    )}
                  </Button>

                  {isStarted && (
                    <button
                      onClick={() => navigate(createPageUrl(`CoachingPlanDetail?id=${plan.id}&day=1`))}
                      className="w-full mt-2 text-xs text-[#0A1A2F]/40 hover:text-[#0D4F3C] transition-colors py-1">
                      View from Day 1
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Coming soon placeholder */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-4 border-2 border-dashed border-[#0D4F3C]/20 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#0D4F3C]/8 flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-[#0D4F3C]/40" />
          </div>
          <h3 className="font-bold text-[#0A1A2F]/60 text-sm mb-1">More Plans Coming</h3>
          <p className="text-xs text-[#0A1A2F]/40">New coaching plans are in development — focused on weight loss, mental health, spiritual deepening, and athletic performance.</p>
        </motion.div>
      </div>
    </div>
  );
}