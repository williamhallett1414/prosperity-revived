import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Lock, ChevronRight, Star, CheckCircle2, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COACHING_PLANS, PLAN_CATEGORIES } from '@/components/coaching/planData';
import PreviewPlanModal from '@/components/coaching/PreviewPlanModal';

function getPlanProgress(planId) {
  try {
    const raw = localStorage.getItem(`coaching_progress_${planId}`);
    return raw ? JSON.parse(raw) : { completed_days: [] };
  } catch { return { completed_days: [] }; }
}

function PlanCard({ plan, idx, onPreview }) {
  const navigate = useNavigate();
  const progress = getPlanProgress(plan.id);
  const completedDays = progress.completed_days?.length || 0;
  const pct = Math.round((completedDays / plan.days_total) * 100);
  const isStarted = completedDays > 0;
  const currentDay = completedDays + 1;

  const handleAbandonPlan = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to abandon this plan? Your progress will be reset.`)) {
      localStorage.removeItem(`coaching_progress_${plan.id}`);
      window.location.reload();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="bg-white rounded-2xl overflow-hidden border border-[#0D4F3C]/10 shadow-sm"
    >
      {/* Header gradient */}
      <div className={`bg-gradient-to-r ${plan.gradient} p-4 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-2xl flex-shrink-0 backdrop-blur-sm">
            {plan.cover_emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest bg-white/15 px-2 py-0.5 rounded-full">
                {plan.weeks} Weeks
              </span>
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest bg-white/15 px-2 py-0.5 rounded-full">
                {plan.difficulty}
              </span>
              {plan.comingSoon && (
                <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Soon
                </span>
              )}
              {isStarted && !plan.comingSoon && (
                <span className="text-[10px] font-bold text-white/90 bg-white/20 px-2 py-0.5 rounded-full">
                  {pct}% done
                </span>
              )}
            </div>
            <h3 className="text-white font-bold text-base leading-tight">{plan.title}</h3>
            <p className="text-white/65 text-xs leading-tight">{plan.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-[#0A1A2F]/60 text-xs leading-relaxed mb-3">{plan.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {plan.tags.slice(0, 4).map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F8F0] text-[#0D4F3C] font-medium border border-[#0D4F3C]/12">
              {tag}
            </span>
          ))}
        </div>

        {/* Week theme pills */}
        {plan.week_themes && plan.week_themes.length > 0 && (
          <div className="flex gap-1 mb-3 overflow-x-auto pb-1 scrollbar-hide">
            {plan.week_themes.map(wt => (
              <div key={wt.week} className={`flex-shrink-0 rounded-lg px-2 py-1.5 bg-gradient-to-br ${wt.color} text-center min-w-[52px]`}>
                <p className="text-xs mb-0.5">{wt.emoji}</p>
                <p className="text-white text-[8px] font-bold leading-tight">{wt.theme}</p>
              </div>
            ))}
          </div>
        )}

        {/* Progress bar if started */}
        {isStarted && !plan.comingSoon && (
          <div className="mb-3 p-2.5 bg-[#F5F8F0] rounded-xl">
            <div className="flex justify-between mb-1.5">
              <span className="text-[10px] font-bold text-[#0D4F3C]">Your Progress</span>
              <span className="text-[10px] font-bold text-[#0D4F3C]">Day {completedDays}/{plan.days_total}</span>
            </div>
            <div className="h-1.5 bg-[#0D4F3C]/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#0D4F3C] to-[#c9a227] rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {/* CTA */}
        {plan.comingSoon ? (
          <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-[#0D4F3C]/20 text-[#0D4F3C]/40">
            <Lock className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Coming Soon</span>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              onClick={() => navigate(createPageUrl(`CoachingPlanDetail?id=${plan.id}&day=${isStarted ? currentDay : 1}`))}
              className="w-full bg-gradient-to-r from-[#0D4F3C] to-[#22856A] hover:opacity-90 text-white font-bold py-2.5 rounded-xl text-sm"
            >
              {isStarted ? <>Continue Day {currentDay} <ChevronRight className="w-3.5 h-3.5 ml-1" /></> : <>Begin Journey <ChevronRight className="w-3.5 h-3.5 ml-1" /></>}
            </Button>
            {!isStarted && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(plan);
                }}
                variant="outline"
                className="w-full border border-[#0D4F3C]/20 text-[#0D4F3C] hover:bg-[#F5F8F0] font-semibold py-2 rounded-xl text-xs"
              >
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                Preview Day 1
              </Button>
            )}
            {isStarted && (
              <Button
                onClick={handleAbandonPlan}
                variant="outline"
                className="w-full border border-red-200 text-red-600 hover:bg-red-50 font-semibold py-2 rounded-xl text-xs"
              >
                <X className="w-3.5 h-3.5 mr-1.5" />
                Abandon Plan
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function CoachingPlans() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [previewPlan, setPreviewPlan] = useState(null);

  const filteredPlans = activeCategory === 'all'
    ? COACHING_PLANS
    : COACHING_PLANS.filter(p => p.category === activeCategory);

  // Group by category for section headers
  const groupedPlans = PLAN_CATEGORIES
    .filter(cat => cat.id !== 'all')
    .map(cat => ({
      ...cat,
      plans: COACHING_PLANS.filter(p => p.category === cat.id),
    }))
    .filter(cat => cat.plans.length > 0);

  const activePlans = COACHING_PLANS.filter(p => !p.comingSoon).length;
  const totalPlans = COACHING_PLANS.length;

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
            <p className="text-xs text-[#0A1A2F]/50">{activePlans} active · {totalPlans - activePlans} coming soon</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0D4F3C] to-[#1a6b50] rounded-2xl p-5 mb-5 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#c9a227]/15 rounded-full -translate-y-6 translate-x-6" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-[#c9a227] flex items-center justify-center text-xl shadow-lg">👑</div>
              <div>
                <h2 className="text-lg font-bold">Prosperity Coaching</h2>
                <p className="text-white/60 text-xs">8-week whole-life transformation programs</p>
              </div>
            </div>
            <p className="text-white/75 text-xs leading-relaxed mb-3">
              Each plan weaves together daily Scripture, purposeful movement, intentional nutrition, and journaling — all connected to the tools in your app. Choose the area of your life you're ready to transform.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { emoji: '💪', label: 'Body', count: COACHING_PLANS.filter(p=>p.category==='body').length },
                { emoji: '🧠', label: 'Mind', count: COACHING_PLANS.filter(p=>p.category==='mind').length },
                { emoji: '❤️', label: 'Relationships', count: COACHING_PLANS.filter(p=>p.category==='relationships').length },
                { emoji: '🎯', label: 'Purpose', count: COACHING_PLANS.filter(p=>p.category==='purpose').length },
              ].map(({ emoji, label, count }) => (
                <div key={label} className="bg-white/10 rounded-xl p-2 text-center">
                  <div className="text-base mb-0.5">{emoji}</div>
                  <div className="text-white font-bold text-sm">{count}</div>
                  <div className="text-white/55 text-[9px] font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Category filter tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          {PLAN_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all border ${
                activeCategory === cat.id
                  ? 'bg-[#0D4F3C] text-white border-[#0D4F3C] shadow-md'
                  : 'bg-white text-[#0A1A2F]/60 border-[#0D4F3C]/15 hover:border-[#0D4F3C]/40'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-[#F5F8F0] text-[#0A1A2F]/40'
              }`}>
                {cat.id === 'all' ? COACHING_PLANS.length : COACHING_PLANS.filter(p => p.category === cat.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Plans — flat filtered list OR grouped by category */}
        <AnimatePresence mode="wait">
          {activeCategory !== 'all' ? (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredPlans.map((plan, idx) => (
                <PlanCard key={plan.id} plan={plan} idx={idx} onPreview={setPreviewPlan} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {groupedPlans.map((cat, catIdx) => (
                <div key={cat.id}>
                  {/* Category header */}
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: catIdx * 0.08 }}
                    className="flex items-center gap-2.5 mb-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#0D4F3C] flex items-center justify-center text-base shadow-sm">
                      {cat.emoji}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-sm font-bold text-[#0A1A2F]">{cat.name}</h2>
                      <p className="text-[10px] text-[#0A1A2F]/40">
                        {cat.plans.filter(p => !p.comingSoon).length} active
                        {cat.plans.filter(p => p.comingSoon).length > 0 && ` · ${cat.plans.filter(p => p.comingSoon).length} coming soon`}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveCategory(cat.id)}
                      className="text-[10px] font-semibold text-[#0D4F3C] bg-[#E8F0E8] px-2.5 py-1 rounded-full hover:bg-[#D8E8D8] transition-colors"
                    >
                      View all
                    </button>
                  </motion.div>

                  <div className="space-y-3">
                    {cat.plans.map((plan, idx) => (
                      <PlanCard key={plan.id} plan={plan} idx={idx} />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer nudge */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="mt-6 border-2 border-dashed border-[#0D4F3C]/15 rounded-2xl p-5 text-center"
        >
          <div className="text-2xl mb-2">🚀</div>
          <h3 className="font-bold text-[#0A1A2F]/60 text-sm mb-1">New Plans in Development</h3>
          <p className="text-xs text-[#0A1A2F]/40 leading-relaxed">
            More plans are being built — covering grief & healing, anxiety, athletic performance, and more. Check back regularly.
          </p>
        </motion.div>

      </div>
    </div>
  );
}