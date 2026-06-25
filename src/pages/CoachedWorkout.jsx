/**
 * CoachedWorkout page
 *
 * Route: /CoachedWorkout?id=<workoutId>
 *
 * Hosts the Coach Led Workouts experience — Coach David verbally leads the user
 * through a workout, weaving form cues with scripture and prayer reflections.
 * Loads the workout by id from the premade library or the user's plans; falls
 * back to the first premade workout if none is specified.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Dumbbell, Clock, ListChecks } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { PREMADE_WORKOUTS } from '@/components/wellness/WorkoutLibrary';
import CoachedWorkoutPlayer from '@/components/wellness/CoachedWorkoutPlayer';

export default function CoachedWorkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workoutId = searchParams.get('id');
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    base44.entities.WorkoutPlan.list('-created_date')
      .then((w) => setUserWorkouts(w || []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const workout = useMemo(() => {
    const all = [...PREMADE_WORKOUTS, ...userWorkouts];
    if (workoutId) {
      const found = all.find((w) => String(w.id) === String(workoutId));
      if (found) return found;
    }
    return PREMADE_WORKOUTS[0] || null;
  }, [workoutId, userWorkouts]);

  const exerciseCount = Array.isArray(workout?.exercises) ? workout.exercises.length : 0;

  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#38BDF8]/30 border-t-[#38BDF8] rounded-full animate-spin" />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-lg font-bold text-[#0A1A2F] dark:text-white mb-2">No workout found</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-[#38BDF8] text-white rounded-xl text-sm font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">
      <div className="max-w-2xl mx-auto px-4 pt-5">

        {/* Health disclaimer */}
        <div className="mb-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2 border border-amber-100 dark:border-amber-800/30">
          <p className="text-[10px] text-amber-700 dark:text-amber-300 text-center">
            Not medical advice. Consult a healthcare professional before starting any new exercise program.
          </p>
        </div>

        {/* Workout header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <div className="rounded-2xl p-5 border border-[#38BDF8]/20"
            style={{ background: 'linear-gradient(135deg,#1e40af,#38BDF8)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Coach Led Workout</span>
            </div>
            <h1 className="text-xl font-black text-white leading-tight">{workout.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              {workout.duration_minutes && (
                <span className="flex items-center gap-1 text-xs text-white/80">
                  <Clock className="w-3.5 h-3.5" /> {workout.duration_minutes} min
                </span>
              )}
              {exerciseCount > 0 && (
                <span className="flex items-center gap-1 text-xs text-white/80">
                  <ListChecks className="w-3.5 h-3.5" /> {exerciseCount} exercises
                </span>
              )}
              {workout.difficulty && (
                <span className="text-xs text-white/80 capitalize">{workout.difficulty}</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Player */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <CoachedWorkoutPlayer workout={workout} coachName="Coach David" />
        </motion.div>

        <p className="text-center text-[11px] text-[#0A1A2F]/40 dark:text-white/40 mt-6 leading-relaxed">
          Coach David leads each move and offers a moment of scripture and prayer during your rest.
        </p>
      </div>
    </div>
  );
}