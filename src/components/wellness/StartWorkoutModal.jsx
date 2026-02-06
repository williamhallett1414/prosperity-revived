import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, CheckCircle, ChevronRight, Timer, Dumbbell } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function StartWorkoutModal({ isOpen, onClose, workout, user, onComplete }) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseStats, setExerciseStats] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen && workout?.exercises) {
      setExerciseStats(workout.exercises.map(ex => ({
        name: ex.name,
        target_sets: ex.sets || 3,
        target_reps: ex.reps || 10,
        completed_sets: [],
        notes: ''
      })));
      setCurrentExerciseIndex(0);
      setElapsedTime(0);
      setIsRunning(true);
    }
  }, [isOpen, workout]);

  useEffect(() => {
    let interval;
    if (isRunning && isOpen) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isOpen]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addSet = () => {
    const updatedStats = [...exerciseStats];
    updatedStats[currentExerciseIndex].completed_sets.push({
      reps: '',
      weight: ''
    });
    setExerciseStats(updatedStats);
  };

  const updateSet = (setIndex, field, value) => {
    const updatedStats = [...exerciseStats];
    updatedStats[currentExerciseIndex].completed_sets[setIndex][field] = value;
    setExerciseStats(updatedStats);
  };

  const nextExercise = () => {
    if (currentExerciseIndex < exerciseStats.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const completeWorkout = useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Create workout session
      await base44.entities.WorkoutSession.create({
        workout_id: workout.id || 'premade',
        workout_name: workout.title,
        date: today,
        duration_minutes: Math.floor(elapsedTime / 60),
        exercises_performed: exerciseStats.map(stat => ({
          name: stat.name,
          sets_completed: stat.completed_sets.length,
          sets: stat.completed_sets.map(s => ({
            reps: parseInt(s.reps) || 0,
            weight: parseFloat(s.weight) || 0
          }))
        })),
        overall_feeling: 'good'
      });

      // Update workout plan completed dates (only for saved workouts)
      if (workout.id && typeof workout.id === 'string' && workout.id !== 'premade') {
        const updatedDates = [...(workout.completed_dates || []), today];
        await base44.entities.WorkoutPlan.update(workout.id, {
          completed_dates: updatedDates
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['workouts']);
      queryClient.invalidateQueries(['workout-sessions']);
      toast.success('Workout completed! 💪');
      if (onComplete) onComplete(workout);
      onClose();
    }
  });

  const currentExercise = exerciseStats[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / exerciseStats.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{workout?.title}</span>
            <Badge variant="outline" className="flex items-center gap-1">
              <Timer className="w-3 h-3" />
              {formatTime(elapsedTime)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {currentExercise && (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Exercise {currentExerciseIndex + 1} of {exerciseStats.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Stopwatch Controls */}
            <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-[#1a1a2e] rounded-lg">
              <div className="text-3xl font-bold text-emerald-600">
                {formatTime(elapsedTime)}
              </div>
              <Button
                onClick={() => setIsRunning(!isRunning)}
                variant="outline"
                size="icon"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>

            {/* Current Exercise */}
            <div className="border-2 border-emerald-500 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Dumbbell className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-semibold">{currentExercise.name}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Target: {currentExercise.target_sets} sets × {currentExercise.target_reps} reps
              </p>

              {/* Sets Tracking */}
              <div className="space-y-2 mb-3">
                {currentExercise.completed_sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center gap-2">
                    <Badge variant="outline" className="w-16">
                      Set {setIndex + 1}
                    </Badge>
                    <Input
                      type="number"
                      placeholder="Reps"
                      value={set.reps}
                      onChange={(e) => updateSet(setIndex, 'reps', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Weight (lbs)"
                      value={set.weight}
                      onChange={(e) => updateSet(setIndex, 'weight', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>

              <Button
                onClick={addSet}
                variant="outline"
                className="w-full"
                disabled={currentExercise.completed_sets.length >= 10}
              >
                + Add Set
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex gap-2">
              <Button
                onClick={previousExercise}
                variant="outline"
                className="flex-1"
                disabled={currentExerciseIndex === 0}
              >
                Previous
              </Button>
              
              {currentExerciseIndex < exerciseStats.length - 1 ? (
                <Button
                  onClick={nextExercise}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  Next Exercise
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={() => completeWorkout.mutate()}
                  disabled={completeWorkout.isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {completeWorkout.isPending ? 'Saving...' : 'Complete Workout'}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}