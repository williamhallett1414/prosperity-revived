import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  Dumbbell, Target, Trophy, ClipboardList, Flame, ChevronRight, Play,
  CheckCircle2, MessageCircle, ArrowRight, Star
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import StartWorkoutModal from '@/components/wellness/StartWorkoutModal';
import ChatButton from '@/components/chatbot/ChatButton';
import PullToRefresh from '@/components/ui/PullToRefresh';
import { PREMADE_WORKOUTS } from '@/components/wellness/WorkoutLibrary';
import { awardPoints, checkAndAwardBadges } from '@/components/gamification/ProgressManager';
import { toast } from 'sonner';

// ── Motivational verses for training ────────────────────────────────────────
const TRAINING_VERSES = [
  { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
  { text: "Do you not know that your bodies are temples of the Holy Spirit? Honor God with your bodies.", ref: "1 Corinthians 6:19-20" },
  { text: "Physical training is of some value, but godliness has value for all things.", ref: "1 Timothy 4:8" },
  { text: "Run in such a way as to get the prize.", ref: "1 Corinthians 9:24" },
  { text: "Be strong and courageous. Do not be afraid; do not be discouraged.", ref: "Joshua 1:9" },
  { text: "The Lord is my strength and my shield; my heart trusts in Him.", ref: "Psalm 28:7" },
  { text: "Let us not become weary in doing good, for at the proper time we will reap a harvest.", ref: "Galatians 6:9" },
];

// ── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: "all",         label: "All",       emoji: "🏋️", grad: "from-[#FD9C2D] to-[#38BDF8]",   desc: "Every workout" },
  { key: "cardio",      label: "Cardio",    emoji: "❤️", grad: "from-rose-500 to-pink-400",     desc: "Get your heart pumping" },
  { key: "strength",    label: "Strength",  emoji: "💪", grad: "from-slate-700 to-slate-500",   desc: "Build muscle & power" },
  { key: "flexibility", label: "Flex",      emoji: "🧘", grad: "from-teal-500 to-emerald-400",  desc: "Stretch & recover" },
  { key: "full_body",   label: "Full Body", emoji: "🏋️", grad: "from-violet-500 to-purple-400", desc: "Total body training" },
  { key: "hiit",        label: "HIIT",      emoji: "⚡", grad: "from-orange-500 to-amber-400",  desc: "High intensity" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getWeekDays() {
  const days = [];
  const today = new Date();
  const dow = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  const todayStr = todayKey();
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    days.push({
      key,
      label: d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1),
      isToday: key === todayStr,
      isFuture: d > today,
    });
  }
  return days;
}

function calcStreak(sessions) {
  const days = new Set(sessions.map(s => (s.date || "").slice(0, 10)).filter(Boolean));
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

function getWeekSessions(sessions) {
  const mon = getWeekDays()[0].key;
  return sessions.filter(s => (s.date || "") >= mon);
}

function getTimeGreeting(name) {
  const h = new Date().getHours();
  const first = name ? name.split(" ")[0] : null;
  const s = first ? `, ${first}` : "";
  if (h < 12) return { text: `Morning${s} 💪`, sub: "Start the day strong." };
  if (h < 17) return { text: `Afternoon${s}`, sub: "Midday session? Let's go." };
  return { text: `Evening${s}`, sub: "End the day right." };
}

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionLabel({ children, action, actionTo }) {
  return (
    <div className="flex items-center justify-between mb-3 px-0.5">
      <span className="text-sm font-bold text-[#0A1A2F]">{children}</span>
      {action && actionTo && (
        <Link to={createPageUrl(actionTo)}
          className="flex items-center gap-1 text-xs font-semibold text-[#38BDF8] hover:text-[#0EA5E9]">
          {action} <ChevronRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}

function StatPill({ value, label, color, sub }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex-1 min-w-0">
      <p className="text-2xl font-black" style={{ color }}>{value}</p>
      <p className="text-xs text-[#0A1A2F]/55 mt-0.5 leading-tight">{label}</p>
      {sub && <p className="text-[10px] text-[#0A1A2F]/35 mt-0.5">{sub}</p>}
    </div>
  );
}

function WorkoutPill({ workout, onStart, done }) {
  if (!workout) return null;
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-3"
      style={{ borderColor: done ? "#BBF7D0" : "#F3F4F6" }}
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        <div className="w-10 h-10 bg-gradient-to-br from-[#FD9C2D] to-[#E89020] rounded-xl flex items-center justify-center flex-shrink-0">
          <Dumbbell className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#0A1A2F] truncate">{workout.title}</p>
          <p className="text-xs text-[#0A1A2F]/50">
            {workout.duration_minutes} min · {workout.difficulty || "All levels"}
          </p>
        </div>
        {done
          ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          : (
            <button
              onClick={() => onStart(workout)}
              className="flex items-center gap-1.5 bg-[#FD9C2D] text-white text-xs font-bold px-3 py-2 rounded-xl flex-shrink-0"
            >
              <Play className="w-3 h-3" /> Start
            </button>
          )
        }
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Workouts() {
  const navigate    = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser]               = useState(null);
  const [showStartWorkout, setShowStartWorkout] = useState(false);
  const [selectedWorkout, setSelectedWorkout]   = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    base44.functions.invoke("ensureChallengesExist", {}).catch(() => {});
    base44.functions.invoke("ensureCategoryWorkouts", {}).catch(() => {});
    const done = localStorage.getItem("workouts_populated");
    if (!done) {
      base44.functions.invoke("populateMissingWorkoutExercises", {}).then(() => {
        localStorage.setItem("workouts_populated", "true");
        queryClient.invalidateQueries(["workoutPlans"]);
      }).catch(() => {});
    }
  }, []);

  const { data: workouts = [] } = useQuery({
    queryKey: ["workouts"],
    queryFn: () => base44.entities.WorkoutPlan.list("-created_date"),
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ["workoutSessions"],
    queryFn: () => base44.entities.WorkoutSession.list("-date", 100),
    enabled: !!user,
    initialData: [],
  });

  const { data: challenges = [] } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => { try { return await base44.entities.Challenge.filter({}); } catch { return []; } },
    retry: false,
  });

  const { data: challengeParticipants = [] } = useQuery({
    queryKey: ["challengeParticipants"],
    queryFn: async () => { try { return await base44.entities.ChallengeParticipant.filter({ user_email: user?.email }); } catch { return []; } },
    enabled: !!user,
    retry: false,
  });

  const completeWorkout = useMutation({
    mutationFn: async ({ id, workout }) => {
      const dates = workout.completed_dates || [];
      const today = todayKey();
      if (!dates.includes(today)) {
        dates.push(today);
        const allProgress = await base44.entities.UserProgress.list();
        const userProgress = allProgress.find(p => p.created_by === user?.email);
        const workoutCount = (userProgress?.workouts_completed || 0) + 1;
        await awardPoints(user?.email, 15, { workouts_completed: workoutCount });
        await checkAndAwardBadges(user?.email);
      }
      return base44.entities.WorkoutPlan.update(id, { completed_dates: dates });
    },
    onSuccess: () => queryClient.invalidateQueries(["workouts"]),
  });

  const handleRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries(["workouts"]),
      queryClient.invalidateQueries(["workoutSessions"]),
      queryClient.invalidateQueries(["challenges"]),
    ]);
  };

  function startWorkout(w) { setSelectedWorkout(w); setShowStartWorkout(true); }

  // ── Derived data ────────────────────────────────────────────────────────────
  const today          = todayKey();
  const myWorkouts     = workouts.filter(w => w.created_by === user?.email);
  const allWorkouts    = [...PREMADE_WORKOUTS, ...myWorkouts];
  const streak         = calcStreak(sessions);
  const weekSessions   = getWeekSessions(sessions);
  const weekDays       = getWeekDays();
  const workedOutToday = sessions.some(s => (s.date || "").startsWith(today));
  const workedOutDays  = new Set(sessions.map(s => (s.date || "").slice(0, 10)));
  const thisWeekMins   = weekSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const totalMins      = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);

  const verse = TRAINING_VERSES[Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 1)) / 86400000 / 7) % TRAINING_VERSES.length];
  const greeting = getTimeGreeting(user?.full_name);

  // Smart recommendation: pick from category not done recently, appropriate duration for time of day
  const recommendedWorkout = useMemo(() => {
    const h = new Date().getHours();
    const maxMin = h < 7 ? 15 : h < 18 ? 45 : 20;
    const recentCats = new Set(sessions.slice(0, 3).map(s => s.category).filter(Boolean));
    const notTodayNotRecent = allWorkouts.filter(w =>
      !w.completed_dates?.includes(today) &&
      !recentCats.has(w.category) &&
      (w.duration_minutes || 30) <= maxMin
    );
    if (notTodayNotRecent.length) return notTodayNotRecent[0];
    const notToday = allWorkouts.filter(w => !w.completed_dates?.includes(today));
    return notToday[0] || allWorkouts[0] || null;
  }, [allWorkouts, sessions, today]);

  const activeChallenge = useMemo(() => {
    const joined = challengeParticipants[0];
    if (!joined) return null;
    const ch = challenges.find(c => c.id === joined.challenge_id);
    return ch ? { ...ch, progress: joined.progress || 0 } : null;
  }, [challenges, challengeParticipants]);

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-28">

      {/* ── Header ── */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#BAE6FD]/40 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-[#0A1A2F] leading-tight">Workouts</h1>
            <p className="text-xs text-[#0A1A2F]/45">{greeting.sub}</p>
          </div>
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-orange-50 border border-orange-100 px-2.5 py-1.5 rounded-full">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-xs font-bold text-orange-600">{streak}d</span>
              </div>
            )}
            <button
              onClick={() => navigate(createPageUrl("FitnessGoalsPage"))}
              className="flex items-center gap-1.5 bg-[#EFF9FF] border border-[#38BDF8]/30 text-[#38BDF8] text-xs font-bold px-3 py-2 rounded-xl"
            >
              <Target className="w-3.5 h-3.5" /> Goals
            </button>
            <button
              onClick={() => navigate(createPageUrl("WorkoutPlanner"))}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#FD9C2D] to-[#E89020] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm"
            >
              <ClipboardList className="w-3.5 h-3.5" /> Planner
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 pb-4">
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="max-w-2xl mx-auto space-y-5">

            {/* ── Greeting + verse ── */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div
                className="rounded-2xl p-5 border border-[#38BDF8]/20"
                style={{ background: "linear-gradient(135deg,#0A1A2F,#0F2540)" }}
              >
                <p className="text-base font-bold text-white mb-3">{greeting.text}</p>
                <div className="flex items-start gap-2">
                  <Star className="w-3.5 h-3.5 text-[#FD9C2D] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-white/75 leading-relaxed italic">"{verse.text}"</p>
                    <p className="text-[10px] text-[#FD9C2D] font-semibold mt-1">{verse.ref}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Fitness Goals card ── */}
            <motion.div id="tour-fitness-goals-entry" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}>
              <Link to={createPageUrl('FitnessGoalsPage')}>
                <div className="rounded-2xl p-4 flex items-center gap-3 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #0A1A2F 0%, #1A3050 70%, #38BDF8 200%)' }}>
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm leading-tight">
                      {user?.fitness_goal ? ({'lose_weight':'Lose Weight','build_muscle':'Build Muscle','general_fitness':'General Fitness','improve_endurance':'Endurance Training','improve_flexibility':'Flexibility'}[user.fitness_goal] || 'My Fitness Goal') : 'My Fitness Goals'}
                    </p>
                    <p className="text-white/55 text-xs mt-0.5">BMI · Calories · Macros · Timeline</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0" />
                </div>
              </Link>
            </motion.div>

            {/* ── Week at a Glance ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-[#0A1A2F]">This Week</span>
                  <Link to={createPageUrl("WorkoutTrends")}
                    className="text-xs font-semibold text-[#38BDF8] flex items-center gap-0.5">
                    Trends <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                {/* 7-day dot row */}
                <div className="flex justify-between mb-3">
                  {weekDays.map(day => {
                    const done = workedOutDays.has(day.key);
                    return (
                      <div key={day.key} className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-bold text-[#0A1A2F]/40">{day.label}</span>
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all"
                          style={{
                            background: done ? "#38BDF8" : day.isToday ? "#EFF9FF" : "transparent",
                            borderColor: done ? "#38BDF8" : day.isToday ? "#38BDF8" : "#E5E7EB",
                          }}
                        >
                          {done
                            ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            : day.isToday
                              ? <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                              : day.isFuture
                                ? null
                                : <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Stat row */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
                  <div className="flex-1 text-center">
                    <p className="text-lg font-black text-[#38BDF8]">{weekSessions.length}</p>
                    <p className="text-[10px] text-[#0A1A2F]/45">sessions</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100" />
                  <div className="flex-1 text-center">
                    <p className="text-lg font-black text-[#FD9C2D]">{thisWeekMins}</p>
                    <p className="text-[10px] text-[#0A1A2F]/45">minutes</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100" />
                  <div className="flex-1 text-center">
                    <p className="text-lg font-black text-[#0A1A2F]">{totalMins}</p>
                    <p className="text-[10px] text-[#0A1A2F]/45">total mins</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100" />
                  <div className="flex-1 text-center">
                    <p className="text-lg font-black text-orange-500">{streak}</p>
                    <p className="text-[10px] text-[#0A1A2F]/45">day streak</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Streak Milestone ── */}
            {[7, 14, 21, 30, 60, 90, 100, 365].includes(streak) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl p-4 text-center shadow-md"
              >
                <p className="text-2xl mb-1">🔥</p>
                <p className="text-white font-black text-lg">{streak}-Day Streak!</p>
                <p className="text-white/80 text-xs mt-1">
                  {streak >= 100 ? "You're a legend. Keep running the race!" :
                   streak >= 30 ? "A full month of consistency. Incredible discipline!" :
                   streak >= 14 ? "Two weeks strong! This is becoming a habit." :
                   "One week down! You're building something powerful."}
                </p>
                <button
                  onClick={async () => {
                    const { shareStreak } = await import('@/utils/sharing');
                    const result = await shareStreak(streak);
                    if (result.method === 'clipboard') toast.success('Copied to clipboard!');
                  }}
                  className="mt-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-full transition-all"
                >
                  Share 🎉
                </button>
              </motion.div>
            )}

            {/* ── Today's Workout ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <SectionLabel action="Progress" actionTo="WorkoutProgress">
                {workedOutToday ? "✅ Today's Workout — Done!" : "Today's Workout"}
              </SectionLabel>
              {recommendedWorkout ? (
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="rounded-2xl overflow-hidden shadow-md mb-3"
                  style={{ background: "linear-gradient(135deg,#FD9C2D,#38BDF8)" }}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-bold text-white/65 uppercase tracking-widest">
                          {workedOutToday ? "Keep Going" : "Recommended"}
                        </span>
                        <h3 className="text-lg font-black text-white leading-tight mt-0.5">
                          {recommendedWorkout.title}
                        </h3>
                        <p className="text-sm text-white/80 mt-0.5">
                          {recommendedWorkout.duration_minutes} min · {recommendedWorkout.difficulty || "All levels"}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Dumbbell className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <button
                      onClick={() => startWorkout(recommendedWorkout)}
                      className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl transition-all text-sm"
                    >
                      <Play className="w-4 h-4" />
                      {workedOutToday ? "Do Another" : "Start Workout"}
                    </button>
                  </div>
                </motion.div>
              ) : null}
              <Link to={createPageUrl("WorkoutCategoryPage")}>
                <div className="flex items-center justify-between px-4 py-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-slate-700 to-slate-500 rounded-xl flex items-center justify-center">
                      <Dumbbell className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0A1A2F]">Browse All Workouts</p>
                      <p className="text-xs text-[#0A1A2F]/50">Cardio, strength, HIIT, home & more</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#0A1A2F]/30" />
                </div>
              </Link>
            </motion.div>

            {/* ── Active Challenge ── */}
            {activeChallenge && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                <SectionLabel action="All challenges" actionTo="Community">
                  Active Challenge
                </SectionLabel>
                <button
                  onClick={() => navigate(createPageUrl(`ChallengeDetailPage?id=${activeChallenge.id}`))}
                  className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FD9C2D] to-[#E89020] rounded-xl flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#0A1A2F] truncate">{activeChallenge.title}</p>
                      <p className="text-xs text-[#0A1A2F]/50">{activeChallenge.duration_days} day challenge</p>
                    </div>
                    <span className="text-sm font-black text-[#FD9C2D]">{activeChallenge.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#FD9C2D] to-[#E89020]"
                      initial={{ width: 0 }}
                      animate={{ width: `${activeChallenge.progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </button>
              </motion.div>
            )}

            {/* ── Quick Start Workouts ── */}
            <motion.div id="tour-quick-start" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <SectionLabel action="View all" actionTo="WorkoutCategoryPage">Quick Start</SectionLabel>
              {PREMADE_WORKOUTS.slice(0, 4).map((workout, i) => {
                const done = workout.completed_dates?.includes(today);
                return (
                  <motion.div
                    key={workout.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.17 + i * 0.04 }}
                  >
                    <WorkoutPill workout={workout} onStart={startWorkout} done={done} />
                  </motion.div>
                );
              })}
            </motion.div>

            {/* ── Browse Categories ── */}
            <motion.div id="tour-categories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
              <SectionLabel>Browse by Category</SectionLabel>
              <div className="grid grid-cols-3 gap-2.5">
                {CATEGORIES.map((cat, i) => (
                  <motion.div
                    key={cat.key}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.30 + i * 0.04 }}
                  >
                    <button
                      onClick={() => navigate(createPageUrl(`WorkoutCategoryPage?category=${cat.key}`))}
                      className={`w-full bg-gradient-to-br ${cat.grad} rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all text-left`}
                    >
                      <span className="text-2xl block mb-1.5">{cat.emoji}</span>
                      <p className="text-xs font-bold text-white leading-tight">{cat.label}</p>
                      <p className="text-[10px] text-white/70 mt-0.5 leading-tight">{cat.desc}</p>
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── Ask Coach David ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.33 }}>
              <Link to={createPageUrl('ChatScreen?bot=CoachDavid')}>
                <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-4 flex items-center gap-3 border border-[#38BDF8]/20">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#0A1A2F] text-sm">Ask Coach David</p>
                    <p className="text-xs text-[#0A1A2F]/50">Need form tips, a custom plan, or motivation?</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
                </div>
              </Link>
            </motion.div>

            {/* ── Challenges ── */}
            {challenges.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
                <SectionLabel action="See all" actionTo="Community">Challenges</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                  {challenges.slice(0, 4).map((challenge, i) => {
                    const joined = challengeParticipants.find(p => p.challenge_id === challenge.id);
                    const prog = joined?.progress || 0;
                    return (
                      <motion.div
                        key={challenge.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.40 + i * 0.04 }}
                        onClick={() => navigate(createPageUrl(`ChallengeDetailPage?id=${challenge.id}`))}
                        className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="w-9 h-9 bg-gradient-to-br from-[#FD9C2D] to-[#E89020] rounded-xl flex items-center justify-center mb-2.5">
                          <Trophy className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
                        </div>
                        <p className="text-xs font-bold text-[#0A1A2F] leading-tight mb-1 line-clamp-2">{challenge.title}</p>
                        <p className="text-[10px] text-[#0A1A2F]/45 mb-2">{challenge.duration_days}d</p>
                        {joined ? (
                          <>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] rounded-full"
                                style={{ width: `${prog}%` }} />
                            </div>
                            <p className="text-[10px] text-[#0A1A2F]/40 mt-1">{prog}%</p>
                          </>
                        ) : (
                          <p className="text-[10px] font-bold text-[#38BDF8]">Join →</p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── Workout Planner CTA ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}>
              <button
                onClick={() => navigate(createPageUrl("WorkoutPlanner"))}
                className="w-full rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all"
                style={{ background: "linear-gradient(135deg,#0A1A2F,#0A1A2F)" }}
              >
                <div className="w-12 h-12 bg-[#FD9C2D]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-6 h-6 text-[#FD9C2D]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-bold text-[#FD9C2D] uppercase tracking-widest mb-0.5">Workout Planner</p>
                  <p className="text-base font-bold text-white">Build Your Custom Plan</p>
                  <p className="text-xs text-white/55 mt-0.5">Schedule sessions, track progress, hit goals</p>
                </div>
                <ArrowRight className="w-5 h-5 text-white/50 flex-shrink-0" />
              </button>
            </motion.div>

            {/* ── My Custom Workouts ── */}
            {myWorkouts.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }}>
                <SectionLabel>My Workouts</SectionLabel>
                {myWorkouts.slice(0, 3).map((workout, i) => (
                  <WorkoutPill key={workout.id} workout={workout} done={workout.completed_dates?.includes(today)}
                    onStart={startWorkout} />
                ))}
              </motion.div>
            )}

            {/* ── Coach David floating button (same style as Gideon / Chef Daniel) ── */}

          </div>
        </PullToRefresh>
      </div>

      {/* Modal */}
      {selectedWorkout && (
        <StartWorkoutModal
          isOpen={showStartWorkout}
          onClose={() => { setShowStartWorkout(false); setSelectedWorkout(null); }}
          workout={selectedWorkout}
          user={user}
        />
      )}

      <ChatButton bot="CoachDavid" id="tour-coach-david-btn" />
    </div>
  );
}
