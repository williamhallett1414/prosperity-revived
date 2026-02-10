import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export default function WorkoutSession() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  // Get workoutId from URL parameters
  const params = new URLSearchParams(window.location.search);
  const workoutId = params.get('workoutId');

  const { data: workout, isLoading } = useQuery({
    queryKey: ['workout', workoutId],
    queryFn: async () => {
      if (!workoutId) return null;
      try {
        const result = await base44.entities.WorkoutPlan.filter({ id: workoutId });
        return result[0] || null;
      } catch (error) {
        return null;
      }
    },
    enabled: !!workoutId
  });

  const completeWorkoutMutation = useMutation({
    mutationFn: async (workoutData) => {
      const dates = workoutData.completed_dates || [];
      const today = new Date().toISOString().split('T')[0];
      if (!dates.includes(today)) {
        dates.push(today);
      }
      return base44.entities.WorkoutPlan.update(workoutId, { completed_dates: dates });
    },
    onSuccess: () => {
      setIsCompleted(true);
      queryClient.invalidateQueries(['workout', workoutId]);
      toast.success('Workout completed! Great job! 💪');
    }
  });

  const handleCompleteWorkout = () => {
    if (workout) {
      completeWorkoutMutation.mutate(workout);
    }
  };

  const exercises = workout?.exercises || [];
  const currentExercise = exercises[currentExerciseIndex];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D9B878] border-t-[#AFC7E3] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#0A1A2F]">Loading workout...</p>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-[#0A1A2F] mb-4">Workout not found</p>
          <Link to={createPageUrl('Wellness')}>
            <Button className="bg-[#D9B878] hover:bg-[#D9B878]/90">Back to Wellness</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2F6FA] to-[#E6EBEF] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            to={createPageUrl('Wellness')}
            className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
          </Link>
          <h1 className="text-lg font-bold text-[#0A1A2F]">Workout Session</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Workout Title & Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-3xl font-bold text-[#0A1A2F] mb-2">{workout.title}</h2>
          <p className="text-[#0A1A2F]/70 mb-4">{workout.description}</p>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-lg p-3 text-center border border-[#E6EBEF]">
              <p className="text-2xl font-bold text-[#D9B878]">{workout.duration_minutes}</p>
              <p className="text-xs text-[#0A1A2F]/60">Minutes</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center border border-[#E6EBEF]">
              <p className="text-2xl font-bold text-[#AFC7E3]">{exercises.length}</p>
              <p className="text-xs text-[#0A1A2F]/60">Exercises</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center border border-[#E6EBEF]">
              <p className="text-2xl font-bold text-[#0A1A2F]">{workout.difficulty || 'N/A'}</p>
              <p className="text-xs text-[#0A1A2F]/60">Difficulty</p>
            </div>
          </div>
        </motion.div>

        {/* Current Exercise */}
        {exercises.length > 0 ? (
          <motion.div
            key={currentExerciseIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-br from-[#D9B878] to-[#AFC7E3] rounded-2xl p-6 text-white shadow-lg">
              <div className="text-center mb-4">
                <p className="text-sm opacity-90 mb-2">Exercise {currentExerciseIndex + 1} of {exercises.length}</p>
                <h3 className="text-2xl font-bold mb-2">{currentExercise.name}</h3>
                {currentExercise.reps && (
                  <p className="text-lg">{currentExercise.reps} reps</p>
                )}
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-white hover:bg-white/90 text-[#0A1A2F] shadow-lg flex items-center justify-center"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8" />
                  )}
                </Button>
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
                  disabled={currentExerciseIndex === 0}
                  variant="outline"
                  className="flex-1 border-white text-white hover:bg-white/20"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => {
                    if (currentExerciseIndex < exercises.length - 1) {
                      setCurrentExerciseIndex(currentExerciseIndex + 1);
                    } else {
                      handleCompleteWorkout();
                    }
                  }}
                  className="flex-1 bg-white text-[#0A1A2F] hover:bg-white/90"
                >
                  {currentExerciseIndex === exercises.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#0A1A2F]/70 mb-4">No exercises in this workout</p>
          </div>
        )}

        {/* Completion State */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#0A1A2F] mb-2">Workout Complete!</h3>
            <p className="text-[#0A1A2F]/70 mb-6">You crushed it! Keep up the great work.</p>
            <Link to={createPageUrl('Wellness')}>
              <Button className="bg-[#D9B878] hover:bg-[#D9B878]/90">Back to Wellness</Button>
            </Link>
          </motion.div>
        )}

        {/* Exercise List */}
        {exercises.length > 0 && !isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h3 className="text-lg font-bold text-[#0A1A2F] mb-4">Exercises</h3>
            <div className="space-y-2">
              {exercises.map((exercise, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentExerciseIndex(idx)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    idx === currentExerciseIndex
                      ? 'bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] text-white'
                      : 'bg-white text-[#0A1A2F] border border-[#E6EBEF] hover:border-[#D9B878]'
                  }`}
                >
                  <p className="font-semibold">{exercise.name}</p>
                  {exercise.reps && <p className="text-sm opacity-70">{exercise.reps} reps</p>}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}