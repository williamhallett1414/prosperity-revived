import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import WellnessRecommendations from '@/components/wellness/WellnessRecommendations';
import { useQuery } from '@tanstack/react-query';
import { COACHING_PLANS } from '@/components/coaching/planData';
import { Crown, ChevronRight } from 'lucide-react';

export default function Wellness() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const { data: mealLogs = [] } = useQuery({
    queryKey: ['mealLogs'],
    queryFn: () => base44.entities.MealLog.list('-date', 100),
    enabled: !!user
  });

  const { data: workoutSessions = [] } = useQuery({
    queryKey: ['workoutSessions'],
    queryFn: () => base44.entities.WorkoutSession.list('-date', 100),
    enabled: !!user
  });

  const { data: waterLogs = [] } = useQuery({
    queryKey: ['waterLogs'],
    queryFn: () => base44.entities.WaterLog.list('-date', 100),
    enabled: !!user
  });

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <div className="px-4 pt-6 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#FD9C2D]">
                {mealLogs.filter(m => m.date === today).length}
              </p>
              <p className="text-xs text-gray-500">Meals today</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#3C4E53]">
                {workoutSessions.filter(w => w.date === today).length}
              </p>
              <p className="text-xs text-gray-500">Workouts today</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#FD9C2D]">
                {(() => {
                  const total = waterLogs.filter(w => w.date === today).reduce((sum, w) => sum + (w.amount_ml || 0), 0);
                  return total > 0 ? `${total}ml` : '—';
                })()}
              </p>
              <p className="text-xs text-gray-500">Water today</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Nutrition Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}>
              <Link to={createPageUrl('Nutrition')}>
                <div
                  className="relative rounded-2xl overflow-hidden h-40 group cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white font-bold text-lg text-center px-3">Nutrition</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Personal Growth Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}>
              <Link to={createPageUrl('PersonalGrowth')}>
                <div
                  className="relative rounded-2xl overflow-hidden h-40 group cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white font-bold text-lg text-center px-3">Personal Growth</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Workouts Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}>
              <Link to={createPageUrl('Workouts')}>
                <div
                  className="relative rounded-2xl overflow-hidden h-40 group cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white font-bold text-lg text-center px-3">Workouts</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Bible Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}>
              <Link to={createPageUrl('Bible')}>
                <div
                  className="relative rounded-2xl overflow-hidden h-40 group cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&h=300&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white font-bold text-lg text-center px-3">Bible</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Coaching Programs Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D4F3C] to-[#22856A] flex items-center justify-center shadow-sm">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0A1A2F]">Coaching Programs</h2>
                  <p className="text-xs text-[#0A1A2F]/50">8-week whole-life transformation plans</p>
                </div>
              </div>
              <Link to={createPageUrl('CoachingPlans')} className="flex items-center gap-1 text-xs font-semibold text-[#0D4F3C] hover:opacity-75">
                Browse All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {(() => {
                // Show started plans first, then fill with featured unstarted ones up to 3 total
                const withProgress = COACHING_PLANS.map(plan => {
                  let progress = {};
                  try { progress = JSON.parse(localStorage.getItem(`coaching_progress_${plan.id}`)) || {}; } catch {}
                  const completedDays = (progress.completed_days || []).length;
                  return { plan, completedDays, isStarted: completedDays > 0 };
                });
                const started = withProgress.filter(p => p.isStarted);
                const featured = withProgress.filter(p => !p.isStarted).slice(0, Math.max(0, 3 - started.length));
                return [...started, ...featured].slice(0, 3).map(({ plan, completedDays, isStarted }) => {
                  const pct = Math.round((completedDays / plan.days_total) * 100);
                  return (
                    <Link key={plan.id} to={createPageUrl(`CoachingPlanDetail?id=${plan.id}&day=${isStarted ? completedDays + 1 : 1}`)}>
                      <motion.div
                        whileHover={{ y: -1 }}
                        className="bg-white rounded-2xl border border-[#0D4F3C]/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className={`bg-gradient-to-r ${plan.gradient} px-4 py-3 flex items-center gap-3`}>
                          <span className="text-2xl">{plan.cover_emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-bold text-sm leading-tight">{plan.title}</p>
                            <p className="text-white/65 text-xs truncate">{plan.subtitle}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/50 flex-shrink-0" />
                        </div>
                        {isStarted ? (
                          <div className="px-4 py-2.5">
                            <div className="flex items-center justify-between text-[10px] text-[#0A1A2F]/45 mb-1.5">
                              <span>Day {completedDays} of {plan.days_total}</span>
                              <span className="font-semibold text-[#0D4F3C]">{pct}% complete</span>
                            </div>
                            <div className="h-1.5 bg-[#F2F6FA] rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#0D4F3C] to-[#c9a227] rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        ) : (
                          <div className="px-4 py-2.5 flex items-center gap-2">
                            <div className="flex gap-1 flex-wrap">
                              {plan.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 bg-[#F5F8F0] text-[#0D4F3C] rounded-full font-medium">{tag}</span>
                              ))}
                            </div>
                            <span className="ml-auto text-[10px] font-semibold text-[#0D4F3C] whitespace-nowrap">Start →</span>
                          </div>
                        )}
                      </motion.div>
                    </Link>
                  );
                });
              })()}
            </div>
          </div>

          {/* My Recommendations Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-[#0A1A2F] mb-6">My Recommendations</h2>
            <WellnessRecommendations user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}