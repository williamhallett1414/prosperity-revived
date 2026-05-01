import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import ShareToFeedButton from '@/components/community/ShareToFeedButton';
import {
  Dumbbell, Flame, Award, BarChart3,
  TrendingUp, TrendingDown, Minus,
  MessageCircle, Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';

// ── Helpers ────────────────────────────────────────────────────────────────
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function localDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function calcStreak(sessions) {
  const days = new Set(sessions.map(s => (s.date || '').slice(0, 10)).filter(Boolean));
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (days.has(key)) streak++;
    else if (i > 0) break;
  }
  return streak;
}

function calcLongestStreak(sessions) {
  const days = [...new Set(sessions.map(s => (s.date || '').slice(0, 10)).filter(Boolean))].sort();
  let best = 0, cur = 0;
  for (let i = 0; i < days.length; i++) {
    if (i === 0) { cur = 1; }
    else {
      const diff = (new Date(days[i]) - new Date(days[i - 1])) / 86400000;
      cur = diff <= 1 ? cur + 1 : 1;
    }
    best = Math.max(best, cur);
  }
  return best;
}

function weekLabel(weeksAgo) {
  if (weeksAgo === 0) return 'This week';
  if (weeksAgo === 1) return 'Last week';
  return `${weeksAgo}w ago`;
}

const TABS = [
  { key: 'overview',  label: 'Overview' },
  { key: 'frequency', label: 'Frequency' },
  { key: 'exercises', label: 'Exercises' },
];

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ value, label, color, trend, trendLabel, icon: Icon }) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-gray-400 dark:text-gray-300';
  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none">
      <div className="flex items-start justify-between mb-1">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: color + '22' }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-[10px] font-bold ${trendColor}`}>
            <TrendIcon className="w-3 h-3" /> {trendLabel}
          </div>
        )}
      </div>
      <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">{label}</p>
    </div>
  );
}

// ── Tooltip ──────────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-3 py-2 shadow-lg dark:shadow-none text-xs">
      <p className="font-bold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ navigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-6"
    >
      <div className="w-16 h-16 bg-[#38BDF8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <BarChart3 className="w-8 h-8 text-[#38BDF8]" />
      </div>
      <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-2">No workout data yet</h3>
      <p className="text-sm text-gray-500 dark:text-gray-300 mb-6 leading-relaxed">
        Log your first session to start seeing your trends, streaks, and exercise progress.
      </p>
      <button
        onPointerDown={() => navigate(createPageUrl('WorkoutCategoryPage'))}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FD9C2D] to-[#E89020] text-white font-bold px-6 py-3 rounded-xl text-sm"
      >
        <Dumbbell className="w-4 h-4" /> Start a Workout
      </button>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function WorkoutTrends() {
  const navigate  = useNavigate();
  const [user, setUser]     = useState(null);
  const [tab, setTab]       = useState('overview');
  const [range, setRange]   = useState(30);
  const [selExercise, setSelExercise] = useState('');

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: sessions = [] } = useQuery({
    queryKey: ['workoutSessions'],
    queryFn: () => base44.entities.WorkoutSession.list('-date', 200),
    enabled: !!user,
  });

  // ── Core stats ──────────────────────────────────────────────────────────────
  const streak       = calcStreak(sessions);
  const longestStreak = calcLongestStreak(sessions);
  const totalMins    = sessions.reduce((s, x) => s + (x.duration_minutes || 0), 0);
  const totalSessions = sessions.length;

  const thisWeekCount = useMemo(() => {
    const d = new Date(); const day = d.getDay();
    const mon = new Date(d);
    mon.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
    const monKey = localDateKey(mon);
    return sessions.filter(s => (s.date || '') >= monKey).length;
  }, [sessions]);

  const lastWeekCount = useMemo(() => {
    const d = new Date(); const day = d.getDay();
    const thisMonday = new Date(d);
    thisMonday.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
    const lastMonday = new Date(thisMonday);
    lastMonday.setDate(thisMonday.getDate() - 7);
    const lm = localDateKey(lastMonday);
    const tm = localDateKey(thisMonday);
    return sessions.filter(s => (s.date || '') >= lm && (s.date || '') < tm).length;
  }, [sessions]);

  const weekTrend = thisWeekCount > lastWeekCount ? 'up' : thisWeekCount < lastWeekCount ? 'down' : 'flat';
  const weekTrendLabel = weekTrend === 'up' ? `+${thisWeekCount - lastWeekCount} vs last week`
    : weekTrend === 'down' ? `-${lastWeekCount - thisWeekCount} vs last week`
    : 'Same as last week';

  // ── Daily frequency chart ────────────────────────────────────────────────
  const freqData = useMemo(() => {
    const map = {};
    sessions.forEach(s => { const d = (s.date || '').slice(0, 10); if (d) map[d] = (map[d] || 0) + 1; });
    return Array.from({ length: range }, (_, i) => {
      const d = subDays(new Date(), range - 1 - i);
      const key = localDateKey(d);
      return { date: format(d, range <= 14 ? 'MMM d' : range <= 31 ? 'd' : 'MMM d'), sessions: map[key] || 0 };
    });
  }, [sessions, range]);

  // ── Weekly bar chart ─────────────────────────────────────────────────────
  const weeklyData = useMemo(() => {
    return Array.from({ length: 8 }, (_, weeksAgo) => {
      const end = subDays(new Date(), weeksAgo * 7);
      const start = subDays(end, 6);
      const dates = new Set(eachDayOfInterval({ start, end }).map(d => format(d, 'yyyy-MM-dd')));
      const count = sessions.filter(s => dates.has((s.date || '').slice(0, 10))).length;
      const mins  = sessions.filter(s => dates.has((s.date || '').slice(0, 10)))
        .reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
      return { week: weekLabel(weeksAgo), sessions: count, minutes: mins };
    }).reverse();
  }, [sessions]);

  // ── Exercise list + progress ─────────────────────────────────────────────
  const allExercises = useMemo(() => {
    const freq = {};
    sessions.forEach(s => s.exercises_performed?.forEach(e => {
      freq[e.name] = (freq[e.name] || 0) + 1;
    }));
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
  }, [sessions]);

  useEffect(() => {
    if (allExercises.length && !selExercise) setSelExercise(allExercises[0]?.name || '');
  }, [allExercises]);

  const exerciseData = useMemo(() => {
    if (!selExercise) return [];
    return sessions
      .filter(s => s.exercises_performed?.some(e => e.name === selExercise))
      .map(s => {
        const ex = s.exercises_performed.find(e => e.name === selExercise);
        return {
          date: s.date ? format(new Date(s.date), 'MMM d') : 'Unknown',
          weight: ex?.weight_used || 0,
          reps: ex?.reps_completed || 0,
          sets: ex?.sets_completed || 0,
        };
      })
      .reverse()
      .slice(-20);
  }, [sessions, selExercise]);

  const hasData = sessions.length > 0;

  return (
    <div className="bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">

      <div className="px-4 pt-5 pb-4">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* ── Empty state ── */}
          {!hasData && user && <EmptyState navigate={navigate} />}

          {hasData && <>

            {/* ── Hero stats row ── */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  value={thisWeekCount}
                  label="Sessions this week"
                  color="#38BDF8"
                  icon={Dumbbell}
                  trend={weekTrend}
                  trendLabel={weekTrendLabel}
                />
                <StatCard
                  value={streak}
                  label="Day streak"
                  color="#F97316"
                  icon={Flame}
                  trend={streak > 0 ? 'up' : null}
                  trendLabel={streak > 0 ? `Best: ${longestStreak}d` : null}
                />
                <StatCard
                  value={totalSessions}
                  label="All-time sessions"
                  color="#8B5CF6"
                  icon={Award}
                  trend={null}
                />
                <StatCard
                  value={totalMins}
                  label="Total minutes"
                  color="#22C55E"
                  icon={Target}
                  trend={null}
                />
              </div>
            </motion.div>

            {/* ── Range selector ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.06 }}>
              <div className="flex gap-2">
                {[7, 30, 90].map(r => (
                  <button key={r}
                    onPointerDown={() => setRange(r)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      range === r
                        ? 'bg-[#38BDF8] text-white'
                        : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-white/10 dark:border-white/10'
                    }`}
                  >
                    {r === 7 ? '7 days' : r === 30 ? '30 days' : '90 days'}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* ── Tab bar ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}>
              <div className="bg-white dark:bg-white/5 rounded-2xl p-1 flex gap-1 shadow-sm dark:shadow-none border border-gray-100 dark:border-white/10">
                {TABS.map(t => (
                  <button key={t.key}
                    onPointerDown={() => setTab(t.key)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      tab === t.key ? 'bg-[#0A1A2F] text-white' : 'text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </motion.div>

            <AnimatePresence mode="wait">

              {/* ── OVERVIEW tab ── */}
              {tab === 'overview' && (
                <motion.div key="overview"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Streak history */}
                  <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-5">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100">Streak history</p>
                      <div className="flex items-center gap-2">
                        {streak > 0 && (
                          <ShareToFeedButton
                            type="fitness_goal"
                            title={`${streak}-day workout streak! 💪`}
                            content={`Just checked my workout stats on Prosperity Revived — I'm on a ${streak}-day streak with ${totalSessions} total sessions. Staying consistent and trusting the process. 💪`}
                            source="CoachDavid"
                            label="Share"
                            variant="icon"
                            color="#38BDF8"
                            user={user}
                          />
                        )}
                        <div className="flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="text-xs font-bold text-orange-500">{streak} day current</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 text-center">
                        <p className="text-2xl font-black text-orange-500">{streak}</p>
                        <p className="text-[10px] text-orange-400 font-semibold mt-0.5">Current streak</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-white/5 dark:text-white rounded-xl p-3 text-center">
                        <p className="text-2xl font-black text-gray-700 dark:text-gray-200">{longestStreak}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-300 font-semibold mt-0.5">Best streak</p>
                      </div>
                    </div>
                  </div>

                  {/* Weekly volume */}
                  <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-5">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">Weekly sessions (8 weeks)</p>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={weeklyData} barSize={24}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="#d1d5db" />
                        <YAxis tick={{ fontSize: 11 }} stroke="#d1d5db" allowDecimals={false} width={24} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="sessions" fill="#38BDF8" radius={[6, 6, 0, 0]} name="Sessions" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Most performed */}
                  {allExercises.length > 0 && (
                    <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-5">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">Top exercises</p>
                      <div className="space-y-3">
                        {allExercises.slice(0, 5).map((ex, i) => {
                          const pct = Math.round((ex.count / allExercises[0].count) * 100);
                            if (!user) {
                              return (
                                <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center">
                                  <div className="w-8 h-8 border-4 border-[#c9a227] border-t-transparent rounded-full animate-spin" />
                                </div>
                              );
                            }

                          return (
                            <div key={ex.name}>
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-[#38BDF8]/15 text-[#38BDF8] text-[10px] font-black flex items-center justify-center">{i + 1}</span>
                                  <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">{ex.name}</span>
                                </div>
                                <span className="text-xs text-gray-400 dark:text-gray-300">{ex.count}×</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9]"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.08 }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── FREQUENCY tab ── */}
              {tab === 'frequency' && (
                <motion.div key="frequency"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-5">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">Sessions per day</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={freqData}>
                        <defs>
                          <linearGradient id="freqGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#d1d5db"
                          interval={range <= 14 ? 1 : range <= 31 ? 4 : 9} />
                        <YAxis tick={{ fontSize: 11 }} stroke="#d1d5db" allowDecimals={false} width={24} />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="sessions" stroke="#38BDF8" strokeWidth={2.5}
                          fill="url(#freqGrad)" name="Sessions" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-5">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">Minutes per week</p>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={weeklyData} barSize={24}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="#d1d5db" />
                        <YAxis tick={{ fontSize: 11 }} stroke="#d1d5db" width={30} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="minutes" fill="#FD9C2D" radius={[6, 6, 0, 0]} name="Minutes" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {/* ── EXERCISES tab ── */}
              {tab === 'exercises' && (
                <motion.div key="exercises"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {allExercises.length === 0 ? (
                    <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-8 text-center">
                      <p className="text-gray-500 dark:text-gray-300 text-sm">No exercise data recorded yet.</p>
                      <p className="text-gray-400 dark:text-gray-300 text-xs mt-1">Log sessions with exercises to track progress here.</p>
                    </div>
                  ) : (
                    <>
                      {/* Exercise picker */}
                      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-4">
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest mb-3">Select exercise</p>
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                          {allExercises.map(ex => (
                            <button key={ex.name}
                              onPointerDown={() => setSelExercise(ex.name)}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                selExercise === ex.name
                                  ? 'bg-[#38BDF8] text-white'
                                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300'
                              }`}
                            >
                              {ex.name} <span className="opacity-60">({ex.count})</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Progress chart */}
                      {selExercise && exerciseData.length > 0 && (
                        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-5">
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">{selExercise}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-300 mb-4">Weight used over last {exerciseData.length} sessions</p>
                          <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={exerciseData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#d1d5db" />
                              <YAxis tick={{ fontSize: 11 }} stroke="#d1d5db" width={30} />
                              <Tooltip content={<ChartTooltip />} />
                              <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2.5}
                                dot={{ fill: '#10b981', r: 4 }} name="Weight (lbs)" />
                              <Line type="monotone" dataKey="reps" stroke="#3b82f6" strokeWidth={2.5}
                                dot={{ fill: '#3b82f6', r: 4 }} name="Reps" strokeDasharray="4 2" />
                            </LineChart>
                          </ResponsiveContainer>

                          {/* Exercise stats */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                            {[
                              { label: 'Best weight', value: Math.max(...exerciseData.map(d => d.weight)) + ' lbs', color: '#10b981' },
                              { label: 'Best reps',   value: Math.max(...exerciseData.map(d => d.reps)),          color: '#3b82f6' },
                              { label: 'Sessions',    value: exerciseData.length,                                 color: '#8b5cf6' },
                            ].map(s => (
                              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: s.color + '12' }}>
                                <p className="text-sm font-black" style={{ color: s.color }}>{s.value}</p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-300 mt-0.5">{s.label}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}

            </AnimatePresence>

            {/* ── Coach David nudge ── */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <button
                onPointerDown={() => { window.location.href = createPageUrl('ChatScreen?bot=CoachDavid'); }}
                className="w-full flex items-center justify-between px-5 py-4 bg-white dark:bg-white/5 rounded-2xl border border-[#38BDF8]/25 shadow-sm dark:shadow-none hover:border-[#38BDF8]/55 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#1e40af,#38BDF8)' }}>D</div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">Talk your progress through</p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">Coach David can help you read these numbers</p>
                  </div>
                </div>
                <MessageCircle className="w-4 h-4 text-gray-300 dark:text-gray-400 dark:text-gray-300 flex-shrink-0" />
              </button>
            </motion.div>

          </>}

        </div>
      </div>
    </div>
  );
}