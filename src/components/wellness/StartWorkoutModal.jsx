import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Play, Pause, CheckCircle, ChevronRight, ChevronLeft,
  SkipForward, Timer, Dumbbell, Zap, Trophy, Flame,
  RotateCcw, X
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { awardPoints, checkAndAwardBadges } from '@/components/gamification/ProgressManager';

// ── Helpers ──────────────────────────────────────────────────────────────────

const BODYWEIGHT_KEYWORDS = [
  'jumping jack','burpee','mountain climber','high knee','jump squat',
  'plank','push-up','push up','sit-up','sit up','crunch','bicycle',
  'russian twist','leg raise','leg swing','hip circle','arm circle',
  "child's pose",'downward dog','warrior','cat-cow','sun salutation',
  'pigeon pose','tree pose','seated forward fold','spinal twist','legs up wall',
  'neck roll','shoulder shrug','wrist circle','sprint','box jump','lunge',
  'squat','step-up','inchworm','bear crawl','flutter kick','scissor kick',
  'v-up','superman','wall sit','glute bridge','fire hydrant','donkey kick',
  'calf raise','hip thrust','jumping','bodyweight',
];

const WEIGHTED_KEYWORDS = [
  'dumbbell','barbell','kettlebell','band','cable','machine',
  'bench press','deadlift','row','curl','press','pulldown',
  'fly','extension','lateral raise','goblet','swing','snatch',
  'clean','get-up','slam','medicine ball',
];

function classifyExercise(ex) {
  if (!ex) return 'bodyweight';
  const name = (ex.name || '').toLowerCase();
  if (ex.duration_seconds > 0 && (!ex.reps || ex.reps === 0)) return 'timed';
  if (WEIGHTED_KEYWORDS.some(k => name.includes(k))) return 'weighted';
  if (BODYWEIGHT_KEYWORDS.some(k => name.includes(k))) return 'bodyweight';
  return 'weighted';
}

const fmt = s =>
  `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

function CircleTimer({ seconds, total, size = 140, color = '#FD9C2D' }) {
  const r = (size / 2) - 10;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? Math.max(0, seconds / total) : 0;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={8} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function StartWorkoutModal({ isOpen, onClose, workout, user, onComplete }) {
  const [phase, setPhase] = useState('warmup'); // warmup | workout | rest | complete
  const [currentIdx, setCurrentIdx] = useState(0);
  const [exerciseStats, setExerciseStats] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Timed exercise state
  const [countdownLeft, setCountdownLeft] = useState(0);
  const [countdownTotal, setCountdownTotal] = useState(0);
  const [countdownRunning, setCountdownRunning] = useState(false);

  // Rest timer
  const REST_SECONDS = 60;
  const [restLeft, setRestLeft] = useState(REST_SECONDS);
  const [restRunning, setRestRunning] = useState(true);
  const [restNextIdx, setRestNextIdx] = useState(null);

  const queryClient = useQueryClient();
  const warmupTimerRef = useRef(null);
  const statsRef = useRef([]);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen && workout?.exercises) {
      const stats = workout.exercises.map(ex => {
        const type = classifyExercise(ex);
        const targetSets = ex.sets || (type === 'timed' ? 2 : 3);
        return {
          name: ex.name,
          type,
          target_sets: targetSets,
          target_reps: ex.reps || 10,
          duration_seconds: ex.duration_seconds || 30,
          timed_completed_sets: 0,
          completed_sets: type === 'timed'
            ? []
            : Array.from({ length: targetSets }, () => ({ reps: '', weight: '', done: false })),
          skipped: false,
        };
      });
      statsRef.current = stats;
      setExerciseStats(stats);
      setCurrentIdx(0);
      setElapsedTime(0);
      setPhase('warmup');
      setTimerRunning(false);
      setCountdownRunning(false);

      warmupTimerRef.current = setTimeout(() => doStartWorkout(stats, 0), 3000);
    }
    return () => clearTimeout(warmupTimerRef.current);
  }, [isOpen, workout]);

  function doStartWorkout(stats, idx) {
    clearTimeout(warmupTimerRef.current);
    setPhase('workout');
    setTimerRunning(true);
    const ex = stats[idx];
    if (ex?.type === 'timed') {
      setCountdownLeft(ex.duration_seconds);
      setCountdownTotal(ex.duration_seconds);
      setCountdownRunning(false);
    }
  }

  // ── Global timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!timerRunning || !isOpen) return;
    const t = setInterval(() => setElapsedTime(p => p + 1), 1000);
    return () => clearInterval(t);
  }, [timerRunning, isOpen]);

  // ── Countdown ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!countdownRunning) return;
    if (countdownLeft <= 0) {
      setCountdownRunning(false);
      handleTimedSetDone();
      return;
    }
    const t = setInterval(() => setCountdownLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [countdownRunning, countdownLeft]);

  // ── Rest timer ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'rest' || !restRunning) return;
    if (restLeft <= 0) { endRest(); return; }
    const t = setInterval(() => setRestLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [phase, restRunning, restLeft]);

  // ── Exercise helpers ──────────────────────────────────────────────────────
  const currentEx = exerciseStats[currentIdx];

  function goToRest(nextIdx) {
    setRestNextIdx(nextIdx);
    setRestLeft(REST_SECONDS);
    setRestRunning(true);
    setPhase('rest');
  }

  function endRest() {
    const next = restNextIdx;
    if (next === null || next === undefined) return;
    if (next >= exerciseStats.length) {
      setTimerRunning(false);
      setPhase('complete');
      return;
    }
    setCurrentIdx(next);
    const nextEx = exerciseStats[next];
    if (nextEx?.type === 'timed') {
      setCountdownLeft(nextEx.duration_seconds);
      setCountdownTotal(nextEx.duration_seconds);
      setCountdownRunning(false);
    }
    setPhase('workout');
  }

  function handleTimedSetDone() {
    let newCompleted = 0;
    setExerciseStats(prev => {
      const next = [...prev];
      newCompleted = next[currentIdx].timed_completed_sets + 1;
      next[currentIdx] = { ...next[currentIdx], timed_completed_sets: newCompleted };
      return next;
    });
    setTimeout(() => {
      const ex = exerciseStats[currentIdx];
      const target = ex?.target_sets || 1;
      const done = ex?.timed_completed_sets + 1;
      if (done >= target) {
        const nextIdx = currentIdx + 1;
        if (nextIdx >= exerciseStats.length) {
          setTimerRunning(false);
          setPhase('complete');
        } else {
          goToRest(nextIdx);
        }
      } else {
        // more sets: rest then come back to same exercise
        setRestNextIdx(currentIdx);
        setRestLeft(REST_SECONDS);
        setRestRunning(true);
        setPhase('rest');
      }
    }, 100);
  }

  function startTimedSet() {
    setCountdownLeft(currentEx.duration_seconds);
    setCountdownTotal(currentEx.duration_seconds);
    setCountdownRunning(true);
  }

  function updateSet(setIdx, field, value) {
    setExerciseStats(prev => {
      const next = [...prev];
      const sets = [...next[currentIdx].completed_sets];
      sets[setIdx] = { ...sets[setIdx], [field]: value };
      next[currentIdx] = { ...next[currentIdx], completed_sets: sets };
      return next;
    });
  }

  function markSetDone(setIdx) {
    let allNowDone = false;
    setExerciseStats(prev => {
      const next = [...prev];
      const sets = [...next[currentIdx].completed_sets];
      sets[setIdx] = { ...sets[setIdx], done: !sets[setIdx].done };
      next[currentIdx] = { ...next[currentIdx], completed_sets: sets };
      allNowDone = sets.every(s => s.done);
      return next;
    });
    setTimeout(() => {
      if (allNowDone) {
        const nextIdx = currentIdx + 1;
        if (nextIdx >= exerciseStats.length) {
          setTimerRunning(false);
          setPhase('complete');
        } else {
          goToRest(nextIdx);
        }
      }
    }, 300);
  }

  function skipExercise() {
    setCountdownRunning(false);
    setExerciseStats(prev => {
      const next = [...prev];
      next[currentIdx] = { ...next[currentIdx], skipped: true };
      return next;
    });
    const nextIdx = currentIdx + 1;
    if (nextIdx >= exerciseStats.length) {
      setTimerRunning(false);
      setPhase('complete');
    } else {
      setCurrentIdx(nextIdx);
      const nextEx = exerciseStats[nextIdx];
      if (nextEx?.type === 'timed') {
        setCountdownLeft(nextEx.duration_seconds);
        setCountdownTotal(nextEx.duration_seconds);
        setCountdownRunning(false);
      }
      setPhase('workout');
    }
  }

  function goBack() {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      setCountdownRunning(false);
      const prevEx = exerciseStats[prevIdx];
      if (prevEx?.type === 'timed') {
        setCountdownLeft(prevEx.duration_seconds);
        setCountdownTotal(prevEx.duration_seconds);
      }
      setPhase('workout');
    }
  }

  function addSet() {
    setExerciseStats(prev => {
      const next = [...prev];
      const sets = [...next[currentIdx].completed_sets, { reps: '', weight: '', done: false }];
      next[currentIdx] = { ...next[currentIdx], completed_sets: sets };
      return next;
    });
  }

  // ── Summary stats ─────────────────────────────────────────────────────────
  const completedCount = exerciseStats.filter(ex => {
    if (ex.skipped) return false;
    if (ex.type === 'timed') return ex.timed_completed_sets > 0;
    return ex.completed_sets.some(s => s.done || s.reps);
  }).length;

  const totalSets = exerciseStats.reduce((sum, ex) => {
    if (ex.type === 'timed') return sum + ex.timed_completed_sets;
    return sum + ex.completed_sets.filter(s => s.done || s.reps).length;
  }, 0);

  const totalVolume = exerciseStats.reduce((sum, ex) => {
    if (ex.type !== 'weighted') return sum;
    return sum + ex.completed_sets
      .filter(s => s.done || s.reps)
      .reduce((s2, set) =>
        s2 + ((parseInt(set.reps) || 0) * (parseFloat(set.weight) || 0)), 0);
  }, 0);

  // ── Save ──────────────────────────────────────────────────────────────────
  const completeWorkout = useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      await base44.entities.WorkoutSession.create({
        workout_id: workout.id || 'premade',
        workout_name: workout.title,
        date: today,
        duration_minutes: Math.max(1, Math.floor(elapsedTime / 60)),
        exercises_performed: exerciseStats.map(stat => ({
          name: stat.name,
          sets_completed: stat.type === 'timed'
            ? stat.timed_completed_sets
            : stat.completed_sets.filter(s => s.done || s.reps).length,
          sets: stat.type === 'timed' ? [] : stat.completed_sets
            .filter(s => s.done || s.reps)
            .map(s => ({ reps: parseInt(s.reps) || 0, weight: parseFloat(s.weight) || 0 })),
        })),
        overall_feeling: 'good',
      });
      if (workout.id && workout.id !== 'premade') {
        await base44.entities.WorkoutPlan.update(workout.id, {
          completed_dates: [...(workout.completed_dates || []), today],
        });
      }
      try {
        const allProgress = await base44.entities.UserProgress.list();
        const userProgress = allProgress.find(p => p.created_by === user?.email);
        const wc = (userProgress?.workouts_completed || 0) + 1;
        await awardPoints(user?.email, 15, { workouts_completed: wc });
        await checkAndAwardBadges(user?.email);
      } catch {}
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['workouts']);
      queryClient.invalidateQueries(['workoutSessions']);
      toast.success('Workout saved! 💪');
      if (onComplete) onComplete(workout);
    },
  });

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-lg p-0 overflow-hidden border-0 bg-transparent shadow-none [&>button]:hidden"
        style={{ maxHeight: '95vh' }}
        onInteractOutside={e => e.preventDefault()}
      >
        <div className="bg-[#0A1A2F] rounded-2xl overflow-hidden flex flex-col relative" style={{ maxHeight: '92vh' }}>
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>

          <AnimatePresence mode="wait">

            {/* ── WARMUP ───────────────────────────────────────────────── */}
            {phase === 'warmup' && (
              <motion.div key="warmup"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="flex flex-col items-center justify-center px-8 py-16 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FD9C2D] to-[#38BDF8] flex items-center justify-center mb-6 shadow-xl shadow-[#FD9C2D]/30">
                  <Dumbbell className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{workout?.title}</h2>
                <p className="text-white/40 text-sm mb-1">
                  {workout?.exercises?.length} exercises · {workout?.duration_minutes} min
                </p>
                <div className="flex items-center gap-2 mt-4 mb-8 px-4 py-2 bg-[#FD9C2D]/10 border border-[#FD9C2D]/20 rounded-full">
                  <span className="text-[#FD9C2D] text-xs font-bold uppercase tracking-widest">🔥 Warm up before you begin</span>
                </div>
                <Button
                  onClick={() => doStartWorkout(exerciseStats, 0)}
                  className="bg-gradient-to-r from-[#FD9C2D] to-[#E89020] hover:opacity-90 text-white font-bold px-10 py-3 text-base rounded-xl shadow-lg shadow-[#FD9C2D]/30"
                >
                  <Zap className="w-5 h-5 mr-2" /> Start Now
                </Button>
                <p className="text-white/20 text-xs mt-4">Auto-starting in 3 seconds…</p>
              </motion.div>
            )}

            {/* ── REST ─────────────────────────────────────────────────── */}
            {phase === 'rest' && (
              <motion.div key="rest"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center px-8 py-12 text-center"
              >
                <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-6">Rest Time</p>
                <div className="relative flex items-center justify-center mb-6">
                  <CircleTimer seconds={restLeft} total={REST_SECONDS} size={160} color="#38BDF8" />
                  <div className="absolute text-center">
                    <p className="text-5xl font-bold text-white tabular-nums">{restLeft}</p>
                    <p className="text-white/30 text-xs mt-1">sec</p>
                  </div>
                </div>
                <p className="text-white/50 text-sm mb-8">
                  {restNextIdx !== null && restNextIdx < exerciseStats.length
                    ? `Up next: ${exerciseStats[restNextIdx]?.name}`
                    : 'Final stretch!'}
                </p>
                <div className="flex gap-3">
                  <Button onClick={() => setRestRunning(p => !p)} variant="outline"
                    className="border-white/15 text-white/60 hover:bg-white/8 bg-transparent">
                    {restRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                    {restRunning ? 'Pause' : 'Resume'}
                  </Button>
                  <Button onClick={endRest}
                    className="bg-gradient-to-r from-[#FD9C2D] to-[#E89020] text-white font-bold px-6">
                    Skip Rest <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── WORKOUT ──────────────────────────────────────────────── */}
            {phase === 'workout' && currentEx && (
              <motion.div key={`ex-${currentIdx}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="flex flex-col"
                style={{ maxHeight: '92vh' }}
              >
                {/* Top bar */}
                <div className="px-5 pt-5 pb-3 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <button onClick={goBack} disabled={currentIdx === 0}
                      className="text-white/30 hover:text-white/60 disabled:opacity-15 transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-white/30 text-xs font-bold uppercase tracking-wider">
                      {currentIdx + 1}/{exerciseStats.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/6 rounded-full px-3 py-1.5">
                    <Timer className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span className="text-white font-bold text-sm tabular-nums">{fmt(elapsedTime)}</span>
                    <button onClick={() => setTimerRunning(p => !p)} className="text-white/30 hover:text-white/60 ml-0.5">
                      {timerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>
                  </div>
                  <button onClick={skipExercise}
                    className="text-white/25 hover:text-[#FD9C2D] transition-colors" title="Skip">
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress track */}
                <div className="px-5 mb-4 flex-shrink-0">
                  <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#FD9C2D] to-[#38BDF8] rounded-full"
                      animate={{ width: `${(currentIdx / exerciseStats.length) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-5 pb-4">
                  {/* Exercise title */}
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      {currentEx.type === 'timed' && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#38BDF8] bg-[#38BDF8]/12 rounded-full px-2.5 py-1">Timed</span>
                      )}
                      {currentEx.type === 'bodyweight' && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#FD9C2D]/80 bg-[#FD9C2D]/10 rounded-full px-2.5 py-1">Bodyweight</span>
                      )}
                      {currentEx.type === 'weighted' && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/35 bg-white/6 rounded-full px-2.5 py-1">Weighted</span>
                      )}
                    </div>
                    <h2 className="text-[1.6rem] font-bold text-white leading-tight">{currentEx.name}</h2>
                    <p className="text-white/35 text-sm mt-1">
                      {currentEx.type === 'timed'
                        ? `${currentEx.target_sets} sets × ${currentEx.duration_seconds}s`
                        : `${currentEx.target_sets} sets × ${currentEx.target_reps} reps`}
                    </p>
                  </div>

                  {/* TIMED exercise */}
                  {currentEx.type === 'timed' && (
                    <div className="flex flex-col items-center py-3">
                      <div className="flex gap-1 mb-5">
                        {Array.from({ length: currentEx.target_sets }, (_, i) => (
                          <div key={i} className={`w-3 h-3 rounded-full transition-all ${
                            i < currentEx.timed_completed_sets ? 'bg-[#FD9C2D] scale-110' : 'bg-white/12'
                          }`} />
                        ))}
                      </div>
                      <div className="relative flex items-center justify-center mb-6">
                        <CircleTimer
                          seconds={countdownLeft > 0 ? countdownLeft : currentEx.duration_seconds}
                          total={currentEx.duration_seconds}
                          size={180}
                          color={countdownRunning ? '#FD9C2D' : '#38BDF8'}
                        />
                        <div className="absolute text-center">
                          <p className="text-6xl font-bold text-white tabular-nums">
                            {countdownLeft}
                          </p>
                          <p className="text-white/25 text-xs mt-1">sec</p>
                        </div>
                      </div>
                      <p className="text-white/40 text-sm mb-5">
                        Set {currentEx.timed_completed_sets + 1} of {currentEx.target_sets}
                      </p>
                      <div className="flex gap-3">
                        {!countdownRunning && countdownLeft === (currentEx.duration_seconds) ? (
                          <Button onClick={startTimedSet}
                            className="bg-gradient-to-r from-[#FD9C2D] to-[#E89020] text-white font-bold px-8 py-2.5 rounded-xl shadow-lg shadow-[#FD9C2D]/25">
                            <Play className="w-4 h-4 mr-2" /> Start Set
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button onClick={() => setCountdownRunning(p => !p)} variant="outline"
                              className="border-white/15 text-white/60 hover:bg-white/8 bg-transparent">
                              {countdownRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                              {countdownRunning ? 'Pause' : 'Resume'}
                            </Button>
                            <Button onClick={() => { setCountdownLeft(currentEx.duration_seconds); setCountdownRunning(false); }}
                              variant="outline" className="border-white/15 text-white/60 hover:bg-white/8 bg-transparent">
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* REPS exercise */}
                  {(currentEx.type === 'weighted' || currentEx.type === 'bodyweight') && (
                    <div className="space-y-2.5">
                      {/* Headers */}
                      <div className="flex items-center gap-2 px-1 pb-1">
                        <div className="w-12 text-[10px] font-bold uppercase text-white/25 text-center">Set</div>
                        <div className="flex-1 text-[10px] font-bold uppercase text-white/25 text-center">Reps</div>
                        {currentEx.type === 'weighted' && (
                          <div className="flex-1 text-[10px] font-bold uppercase text-white/25 text-center">lbs</div>
                        )}
                        <div className="w-10" />
                      </div>
                      {Array.isArray(currentEx.completed_sets) && currentEx.completed_sets.map((set, si) => (
                        <motion.div key={si}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: si * 0.04 }}
                          className={`flex items-center gap-2 rounded-xl p-3 transition-all border ${
                            set.done
                              ? 'bg-[#FD9C2D]/12 border-[#FD9C2D]/30'
                              : 'bg-white/4 border-white/6'
                          }`}
                        >
                          <div className={`w-10 text-center text-sm font-bold ${set.done ? 'text-[#FD9C2D]' : 'text-white/35'}`}>
                            {si + 1}
                          </div>
                          <input type="number" inputMode="numeric"
                            placeholder={String(currentEx.target_reps)}
                            value={set.reps}
                            onChange={e => updateSet(si, 'reps', e.target.value)}
                            disabled={set.done}
                            className="flex-1 bg-transparent border-0 outline-none text-white placeholder:text-white/18 text-center text-base font-semibold min-w-0"
                          />
                          {currentEx.type === 'weighted' && (
                            <input type="number" inputMode="decimal"
                              placeholder="0"
                              value={set.weight}
                              onChange={e => updateSet(si, 'weight', e.target.value)}
                              disabled={set.done}
                              className="flex-1 bg-transparent border-0 outline-none text-white placeholder:text-white/18 text-center text-base font-semibold min-w-0"
                            />
                          )}
                          <button onClick={() => markSetDone(si)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                              set.done
                                ? 'bg-[#FD9C2D] text-white'
                                : 'bg-white/8 text-white/30 hover:bg-white/15 hover:text-white'
                            }`}>
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        </motion.div>
                      ))}
                      {Array.isArray(currentEx.completed_sets) && currentEx.completed_sets.length < 10 && (
                        <button onClick={addSet}
                          className="w-full py-2.5 rounded-xl border border-dashed border-white/12 text-white/25 hover:text-white/50 hover:border-white/25 text-sm transition-all mt-1">
                          + Add Set
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer nav */}
                <div className="px-5 pb-5 pt-3 border-t border-white/6 flex gap-2.5 flex-shrink-0">
                  <Button onClick={skipExercise} variant="outline"
                    className="border-white/12 text-white/35 hover:bg-white/6 hover:text-white/60 bg-transparent text-sm px-4">
                    Skip
                  </Button>
                  {currentIdx < exerciseStats.length - 1 ? (
                    <div className="flex flex-1 gap-2">
                      <Button
                        onClick={() => { setCountdownRunning(false); goToRest(currentIdx + 1); }}
                        variant="outline"
                        className="border-white/15 text-white/60 hover:bg-white/8 bg-transparent text-sm px-3 whitespace-nowrap flex-shrink-0">
                        Rest 60s
                      </Button>
                      <Button
                        onClick={() => { setCountdownRunning(false); const ni = currentIdx + 1; setCurrentIdx(ni); const ne = exerciseStats[ni]; if (ne?.type === 'timed') { setCountdownLeft(ne.duration_seconds); setCountdownTotal(ne.duration_seconds); setCountdownRunning(false); } setPhase('workout'); }}
                        className="flex-1 bg-gradient-to-r from-[#FD9C2D] to-[#E89020] text-white font-bold">
                        Done — Next <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => { setCountdownRunning(false); setTimerRunning(false); setPhase('complete'); }}
                      className="flex-1 bg-gradient-to-r from-[#FD9C2D] to-[#E89020] text-white font-bold">
                      <CheckCircle className="w-4 h-4 mr-2" /> Finish Workout
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── COMPLETE ─────────────────────────────────────────────── */}
            {phase === 'complete' && (
              <motion.div key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20 }}
                className="flex flex-col items-center px-6 py-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2, damping: 12 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FD9C2D] to-[#38BDF8] flex items-center justify-center mb-5 shadow-2xl shadow-[#FD9C2D]/40"
                >
                  <Trophy className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-1">Crushed it! 💪</h2>
                <p className="text-white/40 text-sm mb-7">{workout?.title} complete</p>

                <div className="grid grid-cols-3 gap-3 w-full mb-5">
                  {[
                    { label: 'Time', value: fmt(elapsedTime), icon: Timer, color: '#38BDF8' },
                    { label: 'Exercises', value: `${completedCount}/${exerciseStats.length}`, icon: Dumbbell, color: '#FD9C2D' },
                    { label: 'Sets', value: totalSets, icon: Flame, color: '#FD9C2D' },
                  ].map(({ label, value, icon: Icon, color }, i) => (
                    <motion.div key={label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="bg-white/5 rounded-xl p-3.5 border border-white/8"
                    >
                      <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color }} />
                      <p className="text-xl font-bold text-white">{value}</p>
                      <p className="text-white/30 text-[11px] mt-0.5">{label}</p>
                    </motion.div>
                  ))}
                </div>

                {totalVolume > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                    className="w-full bg-white/5 rounded-xl p-3.5 border border-white/8 mb-4">
                    <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Total Volume</p>
                    <p className="text-2xl font-bold text-[#FD9C2D]">{totalVolume.toLocaleString()} <span className="text-sm text-white/30">lbs</span></p>
                  </motion.div>
                )}

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                  className="w-full bg-[#FD9C2D]/10 border border-[#FD9C2D]/20 rounded-xl p-3 mb-5">
                  <p className="text-[#FD9C2D] text-sm font-semibold">+15 points earned 🏆</p>
                </motion.div>

                <Button
                  onClick={() => { completeWorkout.mutate(); onClose(); }}
                  disabled={completeWorkout.isPending}
                  className="w-full bg-gradient-to-r from-[#FD9C2D] to-[#E89020] text-white font-bold py-3 text-base rounded-xl shadow-lg shadow-[#FD9C2D]/30"
                >
                  {completeWorkout.isPending ? 'Saving…' : 'Save & Close'}
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
