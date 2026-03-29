import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Play, Pause, CheckCircle, ChevronRight, ChevronLeft,
  SkipForward, Timer, Dumbbell, Zap, Trophy, Flame,
  RotateCcw, X, List, Plus, Minus
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { awardPoints, checkAndAwardBadges } from '@/components/gamification/ProgressManager';

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────────────────────

const BODYWEIGHT_KEYWORDS = [
  'jumping jack','burpee','mountain climber','high knee','jump squat',
  'plank','push-up','push up','wall push','sit-up','sit up','crunch','bicycle',
  'russian twist','leg raise','leg swing','hip circle','arm circle',
  "child's pose",'downward dog','warrior','cat-cow','sun salutation',
  'pigeon pose','tree pose','seated forward fold','spinal twist','legs up wall',
  'neck roll','shoulder shrug','wrist circle','sprint','box jump','lunge',
  'squat','step-up','inchworm','bear crawl','flutter kick','scissor kick',
  'v-up','superman','wall sit','glute bridge','fire hydrant','donkey kick',
  'calf raise','hip thrust','jumping','bodyweight','run','walk','skip',
];

const WEIGHTED_KEYWORDS = [
  'dumbbell','barbell','kettlebell','band','cable','machine',
  'bench press','deadlift','row','curl','press','pulldown',
  'fly','extension','lateral raise','goblet','swing','snatch',
  'clean','get-up','slam','medicine ball','turkish',
];

// MET values for calorie estimation
const MET_MAP = [
  { keywords: ['yoga','child','downward','warrior','pigeon','tree pose'], met: 2.5 },
  { keywords: ['stretch','flexibility','mobility','foam roll','neck roll'], met: 2.0 },
  { keywords: ['walk','desk'], met: 3.0 },
  { keywords: ['squat','lunge','push','plank','crunch','glute','bridge','dip','row'], met: 5.0 },
  { keywords: ['deadlift','bench','overhead press','barbell','dumbbell','kettlebell'], met: 6.0 },
  { keywords: ['jumping jack','high knee','mountain climber','burpee','jump','sprint'], met: 8.5 },
  { keywords: ['hiit','tabata','interval'], met: 10.0 },
];

// Brief form cues for common exercises
const FORM_CUES = {
  'plank': 'Straight line head to heels. Squeeze core & glutes. Breathe steadily.',
  'push-up': 'Hands shoulder-width. Elbows 45° from body. Lower chest to floor.',
  'push up': 'Hands shoulder-width. Elbows 45° from body. Lower chest to floor.',
  'squat': 'Feet shoulder-width, toes slightly out. Knees track over toes. Chest up.',
  'lunge': 'Step forward, back knee toward floor. Keep front shin vertical.',
  'deadlift': 'Hips back, neutral spine. Drive through heels. Bar stays close to body.',
  'burpee': 'Jump up explosively, land soft. Plank position, chest to floor, back up.',
  'mountain climber': 'High plank position. Drive knees to chest alternately. Hips stay level.',
  'jumping jack': 'Land soft on toes. Arms fully overhead. Keep core engaged.',
  'high knee': 'Drive knees to hip height. Pump arms. Stay on balls of feet.',
  'crunch': 'Hands lightly behind head. Exhale on the way up. Lower slowly.',
  'bicycle crunch': 'Opposite elbow to knee. Fully extend the other leg. Slow and controlled.',
  'russian twist': 'Lean back 45°. Rotate through torso, not arms. Control the movement.',
  'glute bridge': 'Feet hip-width, flat. Drive hips up, squeeze at top. Lower slowly.',
  'dumbbell row': 'Flat back, core tight. Pull elbow past your hip. Squeeze at top.',
  'shoulder press': "Core tight. Press directly overhead. Don't flare the elbows.",
  'bench press': 'Retract shoulder blades. Lower to chest. Drive through the full range.',
  'goblet squat': 'Hold weight at chest. Elbows inside knees at bottom. Chest tall.',
  'kettlebell swing': 'Hinge at hips, not squat. Drive with glutes. Arms guide, hips power.',
  'turkish get-up': 'Keep eyes on the weight at all times. Move slowly through each position.',
  'cat-cow': 'Inhale on cow (belly drops). Exhale on cat (spine rounds). Move slowly.',
  'downward dog': 'Press through palms, heels toward floor. Pedal feet to warm up.',
  'warrior': 'Front knee directly over ankle. Back foot at 45°. Hips square forward.',
  'child\'s pose': 'Arms extended or by sides. Let gravity sink your hips. Breathe deeply.',
  'side plank': 'Stack feet or stagger. Keep hips elevated. Breathe steadily.',
  'leg raise': "Lower back pressed to floor. Lower legs slowly. Don't let them drop.",
  'step-up': 'Full foot on platform. Drive through heel. Stand tall at top.',
  'calf raise': 'Full range of motion. Pause at top. Lower slowly for best results.',
  'box jump': 'Land soft with bent knees. Full extension at top. Step down, don\'t jump.',
};

function getFormCue(exerciseName) {
  const lower = (exerciseName || '').toLowerCase();
  for (const [key, cue] of Object.entries(FORM_CUES)) {
    if (lower.includes(key)) return cue;
  }
  return null;
}

function getExerciseMET(exercises) {
  if (!exercises?.length) return 4;
  let totalMet = 0;
  for (const ex of exercises) {
    const name = (ex.name || '').toLowerCase();
    let met = 4;
    for (const { keywords, met: m } of MET_MAP) {
      if (keywords.some(k => name.includes(k))) { met = m; break; }
    }
    totalMet += met;
  }
  return totalMet / exercises.length;
}

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

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function CircleTimer({ seconds, total, size = 140, color = '#FD9C2D' }) {
  const r = (size / 2) - 10;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? Math.max(0, seconds / total) : 0;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={8} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
    </svg>
  );
}

function ConfettiCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const COLORS = ['#FD9C2D','#38BDF8','#ffffff','#FAD98D','#0EA5E9','#E89020'];
    const pieces = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: 6 + Math.random() * 8,
      h: 3 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      angle: Math.random() * Math.PI * 2,
      va: (Math.random() - 0.5) * 0.2,
    }));
    let running = true;
    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        p.x += p.vx; p.y += p.vy; p.angle += p.va;
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
        ctx.save();
        ctx.translate(p.x + p.w/2, p.y + p.h/2);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      }
      requestAnimationFrame(draw);
    }
    draw();
    return () => { running = false; };
  }, []);
  return (
    <canvas ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

function ExerciseOverview({ exercises, currentIdx, exerciseStats, onClose, onJump }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute inset-0 bg-[#0A1A2F]/98 backdrop-blur-sm z-20 flex flex-col"
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/8 flex-shrink-0">
        <h3 className="text-white font-bold text-base">Workout Overview</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/15">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
        {exercises.map((ex, i) => {
          const stat = exerciseStats[i];
          const isDone = stat
            ? (stat.type === 'timed'
                ? stat.timed_completed_sets >= stat.target_sets
                : stat.completed_sets?.every(s => s.done))
            : false;
          const isActive = i === currentIdx;
          const isSkipped = stat?.skipped;
          return (
            <button key={i} onClick={() => { onJump(i); onClose(); }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all border ${
                isActive ? 'bg-[#FD9C2D]/15 border-[#FD9C2D]/30' :
                isDone ? 'bg-white/4 border-white/6 opacity-60' :
                'bg-white/4 border-white/6 hover:bg-white/8'
              }`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                isDone ? 'bg-[#FD9C2D] text-white' :
                isSkipped ? 'bg-white/15 text-white/30' :
                isActive ? 'bg-[#FD9C2D]/30 text-[#FD9C2D]' :
                'bg-white/10 text-white/40'
              }`}>
                {isDone ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${isActive ? 'text-[#FD9C2D]' : isDone ? 'text-white/50' : 'text-white'}`}>
                  {ex.name}
                  {isSkipped && <span className="text-white/30 text-xs ml-2">skipped</span>}
                </p>
                <p className="text-white/30 text-xs mt-0.5">
                  {stat?.type === 'timed'
                    ? `${stat.target_sets}×${stat.duration_seconds}s`
                    : `${stat?.target_sets || ex.sets}×${stat?.target_reps || ex.reps} reps`}
                </p>
              </div>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#FD9C2D] flex-shrink-0" />}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO
// ─────────────────────────────────────────────────────────────────────────────

function useAudioBeep() {
  const ctxRef = useRef(null);
  function getCtx() {
    if (!ctxRef.current) {
      try { ctxRef.current = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
    }
    return ctxRef.current;
  }
  function beep(freq = 880, durationMs = 120, vol = 0.3) {
    try {
      const ctx = getCtx(); if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {}
  }
  function countdown321() { beep(660, 100, 0.25); }
  function countdownGo() { beep(880, 200, 0.4); }
  function completionChime() {
    beep(523, 150, 0.3);
    setTimeout(() => beep(659, 150, 0.3), 160);
    setTimeout(() => beep(784, 200, 0.35), 320);
  }
  return { beep, countdown321, countdownGo, completionChime };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function StartWorkoutModal({ isOpen, onClose, workout, user, onComplete }) {
  const [phase, setPhase] = useState('warmup'); // warmup | workout | rest | complete
  const [currentIdx, setCurrentIdx] = useState(0);
  const [exerciseStats, setExerciseStats] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showOverview, setShowOverview] = useState(false);

  // Timed
  const [countdownLeft, setCountdownLeft] = useState(0);
  const [countdownTotal, setCountdownTotal] = useState(0);
  const [countdownRunning, setCountdownRunning] = useState(false);

  // Rest timer (adjustable)
  const DEFAULT_REST = 60;
  const [restDuration, setRestDuration] = useState(DEFAULT_REST);
  const [restLeft, setRestLeft] = useState(DEFAULT_REST);
  const [restRunning, setRestRunning] = useState(true);
  const [restNextIdx, setRestNextIdx] = useState(null);

  // Per-exercise feel ratings
  const [exerciseFeel, setExerciseFeel] = useState([]); // 'easy'|'ok'|'hard'|null

  const queryClient = useQueryClient();
  const warmupTimerRef = useRef(null);
  const audio = useAudioBeep();

  // Draft persistence key
  const draftKey = workout?.id ? `workout_draft_${workout.id}` : null;

  // ── Fetch previous session for "last time" hints ──────────────────────────
  const { data: lastSession } = useQuery({
    queryKey: ['lastWorkoutSession', workout?.id],
    queryFn: async () => {
      if (!workout?.id || workout.id === 'premade') return null;
      const all = await base44.entities.WorkoutSession.list('-date', 10);
      return all.find(s => s.workout_id === workout.id) || null;
    },
    enabled: isOpen && !!workout?.id && workout.id !== 'premade',
  });

  function getLastPerf(exerciseName) {
    if (!lastSession?.exercises_performed) return null;
    const prev = lastSession.exercises_performed.find(
      e => e.name?.toLowerCase() === exerciseName?.toLowerCase()
    );
    if (!prev) return null;
    const sets = prev.sets?.filter(s => s.reps > 0) || [];
    if (!sets.length) return null;
    const maxWeight = Math.max(...sets.map(s => s.weight || 0));
    const avgReps = Math.round(sets.reduce((s, x) => s + x.reps, 0) / sets.length);
    return { sets: prev.sets_completed, reps: avgReps, weight: maxWeight };
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !workout?.exercises) return;

    // Try to restore draft
    let draft = null;
    if (draftKey) {
      try { draft = JSON.parse(localStorage.getItem(draftKey)); } catch {}
    }

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

    if (draft && draft.exerciseStats?.length === stats.length) {
      // Restore draft
      setExerciseStats(draft.exerciseStats);
      setCurrentIdx(draft.currentIdx || 0);
      setElapsedTime(draft.elapsedTime || 0);
      setExerciseFeel(draft.exerciseFeel || Array(stats.length).fill(null));
      setPhase('workout');
      setTimerRunning(true);
      toast.info('Resuming your previous session ↩');
    } else {
      setExerciseStats(stats);
      setCurrentIdx(0);
      setElapsedTime(0);
      setExerciseFeel(Array(stats.length).fill(null));
      setPhase('warmup');
      setTimerRunning(false);
      setCountdownRunning(false);
      warmupTimerRef.current = setTimeout(() => doStartWorkout(stats, 0), 3000);
    }
    return () => clearTimeout(warmupTimerRef.current);
  }, [isOpen, workout]);

  // ── Draft auto-save ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!draftKey || phase === 'warmup' || phase === 'complete') return;
    try {
      localStorage.setItem(draftKey, JSON.stringify({
        exerciseStats, currentIdx, elapsedTime, exerciseFeel
      }));
    } catch {}
  }, [exerciseStats, currentIdx, elapsedTime, exerciseFeel, phase]);

  function clearDraft() {
    if (draftKey) try { localStorage.removeItem(draftKey); } catch {}
  }

  // ── Global timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!timerRunning || !isOpen) return;
    const t = setInterval(() => setElapsedTime(p => p + 1), 1000);
    return () => clearInterval(t);
  }, [timerRunning, isOpen]);

  // ── Countdown + audio beeps ───────────────────────────────────────────────
  useEffect(() => {
    if (!countdownRunning) return;
    if (countdownLeft <= 0) {
      setCountdownRunning(false);
      audio.countdownGo();
      handleTimedSetDone();
      return;
    }
    if (countdownLeft <= 3) audio.countdown321();
    const t = setInterval(() => setCountdownLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [countdownRunning, countdownLeft]);

  // ── Rest timer ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'rest' || !restRunning) return;
    if (restLeft <= 0) { endRest(); return; }
    if (restLeft <= 3) audio.countdown321();
    const t = setInterval(() => setRestLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [phase, restRunning, restLeft]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const currentEx = exerciseStats[currentIdx];

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

  function goToRest(nextIdx) {
    setRestNextIdx(nextIdx);
    setRestLeft(restDuration);
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
      const done = (ex?.timed_completed_sets || 0) + 1;
      if (done >= target) {
        const nextIdx = currentIdx + 1;
        if (nextIdx >= exerciseStats.length) {
          setTimerRunning(false);
          setPhase('complete');
        } else {
          goToRest(nextIdx);
        }
      } else {
        setRestNextIdx(currentIdx);
        setRestLeft(restDuration);
        setRestRunning(true);
        setPhase('rest');
      }
    }, 120);
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
    const nextIdx = currentIdx + 1;
    setExerciseStats(prev => {
      const next = [...prev];
      next[currentIdx] = { ...next[currentIdx], skipped: true };
      return next;
    });
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

  function jumpToExercise(idx) {
    setCountdownRunning(false);
    setCurrentIdx(idx);
    const ex = exerciseStats[idx];
    if (ex?.type === 'timed') {
      setCountdownLeft(ex.duration_seconds);
      setCountdownTotal(ex.duration_seconds);
    }
    setPhase('workout');
  }

  function addSet() {
    setExerciseStats(prev => {
      const next = [...prev];
      const sets = [...next[currentIdx].completed_sets, { reps: '', weight: '', done: false }];
      next[currentIdx] = { ...next[currentIdx], completed_sets: sets };
      return next;
    });
  }

  function setFeel(feel) {
    setExerciseFeel(prev => {
      const next = [...prev];
      next[currentIdx] = prev[currentIdx] === feel ? null : feel;
      return next;
    });
  }

  function adjustRestDuration(delta) {
    const newVal = Math.max(15, Math.min(300, restDuration + delta));
    setRestDuration(newVal);
    if (phase === 'rest') setRestLeft(prev => Math.max(0, prev + delta));
  }

  // ── Next exercise handler (skip rest) ─────────────────────────────────────
  function nextExerciseDirect() {
    setCountdownRunning(false);
    const ni = currentIdx + 1;
    setCurrentIdx(ni);
    const ne = exerciseStats[ni];
    if (ne?.type === 'timed') {
      setCountdownLeft(ne.duration_seconds);
      setCountdownTotal(ne.duration_seconds);
      setCountdownRunning(false);
    }
    setPhase('workout');
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

  const avgMET = getExerciseMET(workout?.exercises);
  const bodyWeightKg = 70; // default estimate
  const estimatedCalories = Math.round(avgMET * bodyWeightKg * (elapsedTime / 3600));

  // ── Save ──────────────────────────────────────────────────────────────────
  const completeWorkout = useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      await base44.entities.WorkoutSession.create({
        workout_id: workout.id || 'premade',
        workout_name: workout.title,
        date: today,
        duration_minutes: Math.max(1, Math.floor(elapsedTime / 60)),
        exercises_performed: exerciseStats.map((stat, i) => ({
          name: stat.name,
          feel: exerciseFeel[i] || null,
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
      clearDraft();
      queryClient.invalidateQueries(['workouts']);
      queryClient.invalidateQueries(['workoutSessions']);
      queryClient.invalidateQueries(['lastWorkoutSession', workout?.id]);
      toast.success('Workout saved! 💪');
      if (onComplete) onComplete(workout);
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-lg p-0 overflow-hidden border-0 bg-transparent shadow-none [&>button]:hidden"
        style={{ maxHeight: '95vh' }}
        onInteractOutside={e => e.preventDefault()}
      >
        <div className="bg-[#0A1A2F] rounded-2xl overflow-hidden flex flex-col relative" style={{ maxHeight: '92vh' }}>

          {/* Close */}
          <button onClick={onClose}
            className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white/60" />
          </button>

          {/* Overview overlay */}
          <AnimatePresence>
            {showOverview && (
              <ExerciseOverview
                exercises={workout?.exercises || []}
                currentIdx={currentIdx}
                exerciseStats={exerciseStats}
                onClose={() => setShowOverview(false)}
                onJump={jumpToExercise}
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">

            {/* ── WARMUP ─────────────────────────────────────────────── */}
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
                {lastSession && (
                  <p className="text-[#38BDF8]/70 text-xs mt-1">
                    Last completed: {new Date(lastSession.date).toLocaleDateString()}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-4 mb-4 px-4 py-2 bg-[#FD9C2D]/10 border border-[#FD9C2D]/20 rounded-full">
                  <span className="text-[#FD9C2D] text-xs font-bold uppercase tracking-widest">🔥 Warm up before you begin</span>
                </div>
                <p className="text-white/30 text-[10px] mb-4 max-w-xs text-center leading-relaxed">
                  By starting, I confirm I am healthy enough for exercise. Consult a physician if unsure.
                </p>
                <Button
                  onClick={() => doStartWorkout(exerciseStats, 0)}
                  className="bg-gradient-to-r from-[#FD9C2D] to-[#E89020] hover:opacity-90 text-white font-bold px-10 py-3 text-base rounded-xl shadow-lg shadow-[#FD9C2D]/30"
                >
                  <Zap className="w-5 h-5 mr-2" /> Start Now
                </Button>
                <p className="text-white/20 text-xs mt-4">Auto-starting in 3 seconds…</p>
              </motion.div>
            )}

            {/* ── REST ───────────────────────────────────────────────── */}
            {phase === 'rest' && (
              <motion.div key="rest"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center px-8 py-10 text-center"
              >
                <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-4">Rest Time</p>

                {/* Adjustable duration */}
                <div className="flex items-center gap-3 mb-4">
                  <button onClick={() => adjustRestDuration(-15)}
                    className="w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/50 transition-colors">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-white/40 text-xs w-16 text-center">
                    {restDuration}s target
                  </span>
                  <button onClick={() => adjustRestDuration(15)}
                    className="w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/50 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="relative flex items-center justify-center mb-5">
                  <CircleTimer seconds={restLeft} total={restDuration} size={160} color="#38BDF8" />
                  <div className="absolute text-center">
                    <p className="text-5xl font-bold text-white tabular-nums">{restLeft}</p>
                    <p className="text-white/30 text-xs mt-1">sec</p>
                  </div>
                </div>

                <p className="text-white/50 text-sm mb-6">
                  {restNextIdx !== null && restNextIdx < exerciseStats.length
                    ? `Up next: ${exerciseStats[restNextIdx]?.name}`
                    : 'Almost there!'}
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

            {/* ── WORKOUT ────────────────────────────────────────────── */}
            {phase === 'workout' && currentEx && (
              <motion.div key={`ex-${currentIdx}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -60 && info.velocity.x < -100) {
                    if (currentIdx < exerciseStats.length - 1) nextExerciseDirect();
                  } else if (info.offset.x > 60 && info.velocity.x > 100) {
                    goBack();
                  }
                }}
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
                    {/* Tappable counter → overview */}
                    <button onClick={() => setShowOverview(true)}
                      className="flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors group">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {currentIdx + 1}/{exerciseStats.length}
                      </span>
                      <List className="w-3.5 h-3.5 group-hover:text-[#FD9C2D] transition-colors" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white/6 rounded-full px-3 py-1.5">
                    <Timer className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span className="text-white font-bold text-sm tabular-nums">{fmt(elapsedTime)}</span>
                    <button onClick={() => setTimerRunning(p => !p)} className="text-white/30 hover:text-white/60 ml-0.5">
                      {timerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>
                  </div>

                  <button onClick={skipExercise}
                    className="text-white/25 hover:text-[#FD9C2D] transition-colors" title="Skip exercise">
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
                  {/* Exercise title + cue */}
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

                    {/* Form cue */}
                    {getFormCue(currentEx.name) && (
                      <div className="mt-3 p-2.5 bg-white/4 border border-white/8 rounded-lg">
                        <p className="text-white/40 text-xs leading-relaxed">
                          💡 {getFormCue(currentEx.name)}
                        </p>
                      </div>
                    )}

                    {/* Last time hint */}
                    {(() => {
                      const last = getLastPerf(currentEx.name);
                      if (!last) return null;
                      return (
                        <div className="mt-2 flex items-center gap-1.5 text-[#38BDF8]/70 text-xs">
                          <span className="opacity-60">Last time:</span>
                          <span className="font-semibold">
                            {last.sets}×{last.reps} reps
                            {last.weight > 0 && ` @ ${last.weight} lbs`}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* TIMED exercise */}
                  {currentEx.type === 'timed' && (
                    <div className="flex flex-col items-center py-2">
                      <div className="flex gap-1.5 mb-5">
                        {Array.from({ length: currentEx.target_sets }, (_, i) => (
                          <div key={i} className={`w-3 h-3 rounded-full transition-all ${
                            i < currentEx.timed_completed_sets ? 'bg-[#FD9C2D] scale-110' : 'bg-white/12'
                          }`} />
                        ))}
                      </div>
                      <div className="relative flex items-center justify-center mb-5">
                        <CircleTimer
                          seconds={countdownLeft > 0 ? countdownLeft : currentEx.duration_seconds}
                          total={currentEx.duration_seconds}
                          size={180}
                          color={countdownRunning ? '#FD9C2D' : '#38BDF8'}
                        />
                        <div className="absolute text-center">
                          <p className="text-6xl font-bold text-white tabular-nums">{countdownLeft}</p>
                          <p className="text-white/25 text-xs mt-1">sec</p>
                        </div>
                      </div>
                      <p className="text-white/40 text-sm mb-5">
                        Set {currentEx.timed_completed_sets + 1} of {currentEx.target_sets}
                      </p>
                      <div className="flex gap-3">
                        {!countdownRunning && countdownLeft === currentEx.duration_seconds ? (
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
                            set.done ? 'bg-[#FD9C2D]/12 border-[#FD9C2D]/30' : 'bg-white/4 border-white/6'
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
                              set.done ? 'bg-[#FD9C2D] text-white' : 'bg-white/8 text-white/30 hover:bg-white/15 hover:text-white'
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

                  {/* Per-exercise feel rating */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-white/25 text-xs mr-1">Feeling:</span>
                    {[
                      { val: 'easy', icon: '😊', label: 'Easy' },
                      { val: 'ok', icon: '😐', label: 'OK' },
                      { val: 'hard', icon: '😓', label: 'Hard' },
                    ].map(({ val, icon, label }) => (
                      <button key={val} onClick={() => setFeel(val)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all border ${
                          exerciseFeel[currentIdx] === val
                            ? 'bg-white/15 border-white/30 text-white'
                            : 'bg-transparent border-white/8 text-white/30 hover:border-white/20 hover:text-white/50'
                        }`}>
                        <span>{icon}</span>
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    ))}
                  </div>

                  <p className="text-white/15 text-[10px] text-center mt-3">← swipe to navigate →</p>
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
                        Rest {restDuration}s
                      </Button>
                      <Button
                        onClick={() => { setCountdownRunning(false); nextExerciseDirect(); }}
                        className="flex-1 bg-gradient-to-r from-[#FD9C2D] to-[#E89020] text-white font-bold">
                        Done — Next <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => { setCountdownRunning(false); setTimerRunning(false); audio.completionChime(); setPhase('complete'); }}
                      className="flex-1 bg-gradient-to-r from-[#FD9C2D] to-[#E89020] text-white font-bold">
                      <CheckCircle className="w-4 h-4 mr-2" /> Finish Workout
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── COMPLETE ───────────────────────────────────────────── */}
            {phase === 'complete' && (
              <motion.div key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20 }}
                className="flex flex-col items-center px-6 py-8 text-center relative overflow-hidden"
              >
                <ConfettiCanvas />

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2, damping: 12 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FD9C2D] to-[#38BDF8] flex items-center justify-center mb-4 shadow-2xl shadow-[#FD9C2D]/40 relative z-10"
                >
                  <Trophy className="w-12 h-12 text-white" />
                </motion.div>

                <h2 className="text-3xl font-bold text-white mb-1 relative z-10">Crushed it! 💪</h2>
                <p className="text-white/40 text-sm mb-6 relative z-10">{workout?.title} complete</p>

                {/* Stats grid */}
                <div className="grid grid-cols-4 gap-2 w-full mb-4 relative z-10">
                  {[
                    { label: 'Time', value: fmt(elapsedTime), icon: Timer, color: '#38BDF8' },
                    { label: 'Done', value: `${completedCount}/${exerciseStats.length}`, icon: Dumbbell, color: '#FD9C2D' },
                    { label: 'Sets', value: totalSets, icon: Flame, color: '#FD9C2D' },
                    { label: 'Kcal', value: `~${estimatedCalories}`, icon: Zap, color: '#38BDF8' },
                  ].map(({ label, value, icon: Icon, color }, i) => (
                    <motion.div key={label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.07 }}
                      className="bg-white/5 rounded-xl p-3 border border-white/8"
                    >
                      <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
                      <p className="text-lg font-bold text-white leading-tight">{value}</p>
                      <p className="text-white/30 text-[10px] mt-0.5">{label}</p>
                    </motion.div>
                  ))}
                </div>

                {totalVolume > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                    className="w-full bg-white/5 rounded-xl p-3 border border-white/8 mb-3 relative z-10">
                    <p className="text-white/30 text-xs uppercase tracking-wider mb-0.5">Total Volume</p>
                    <p className="text-2xl font-bold text-[#FD9C2D]">{totalVolume.toLocaleString()} <span className="text-sm text-white/30">lbs</span></p>
                  </motion.div>
                )}

                {/* Feel summary */}
                {exerciseFeel.some(f => f !== null) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                    className="w-full bg-white/4 rounded-xl p-3 border border-white/6 mb-3 relative z-10">
                    <p className="text-white/25 text-xs uppercase tracking-wider mb-2">How it felt</p>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {exerciseFeel.map((feel, i) => feel && (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-white/50">
                          {feel === 'easy' ? '😊' : feel === 'ok' ? '😐' : '😓'} {exerciseStats[i]?.name}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                  className="w-full bg-[#FD9C2D]/10 border border-[#FD9C2D]/20 rounded-xl p-2.5 mb-4 relative z-10">
                  <p className="text-[#FD9C2D] text-sm font-semibold">+15 points earned 🏆</p>
                </motion.div>

                <Button
                  onClick={() => { completeWorkout.mutate(); onClose(); }}
                  disabled={completeWorkout.isPending}
                  className="w-full bg-gradient-to-r from-[#FD9C2D] to-[#E89020] text-white font-bold py-3 text-base rounded-xl shadow-lg shadow-[#FD9C2D]/30 relative z-10"
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