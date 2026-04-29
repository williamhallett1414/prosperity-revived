import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Target, Dumbbell, Copy, Play, Timer } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import StartWorkoutModal from './StartWorkoutModal';

const DIFFICULTY_STYLES = {
  beginner:     'bg-[#38BDF8]/12 text-[#38BDF8]',
  intermediate: 'bg-[#FD9C2D]/12 text-[#FD9C2D]',
  advanced:     'bg-[#0A1A2F]/8 text-[#0A1A2F] dark:text-white font-bold',
};

const CATEGORY_EMOJI = {
  cardio: '🏃', strength: '💪', flexibility: '🧘', full_body: '🔥', yoga: '🕉️',
};

export default function WorkoutDetailModal({ isOpen, onClose, workout, user, onStartWorkout }) {
  const [showStartModal, setShowStartModal] = useState(false);
  const queryClient = useQueryClient();

  const copyWorkout = useMutation({
    mutationFn: async () => {
      await base44.entities.WorkoutPlan.create({
        title: workout.title,
        description: workout.description,
        difficulty: workout.difficulty,
        duration_minutes: workout.duration_minutes,
        exercises: workout.exercises,
        category: workout.category,
        image_url: workout.image_url,
        completed_dates: [],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['workouts']);
      toast.success('Workout added to your library!');
      onClose();
    },
  });

  function handleStart() {
    // Use callback if provided (avoids modal flash), otherwise open our own modal
    if (onStartWorkout) {
      onClose();
      onStartWorkout(workout);
    } else {
      setShowStartModal(true);
      onClose();
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-white/5 border-[#BAE6FD]/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-[#0A1A2F] dark:text-white dark:text-white">
              <span className="text-2xl">{CATEGORY_EMOJI[workout?.category] || '💪'}</span>
              {workout?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {workout?.image_url && (
              <img src={workout.image_url} alt={workout.title}
                className="w-full h-44 object-cover rounded-xl" />
            )}

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {workout?.difficulty && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${DIFFICULTY_STYLES[workout.difficulty] || 'bg-[#BAE6FD]/20 text-[#0A1A2F]/60 dark:text-white/60'}`}>
                  {workout.difficulty}
                </span>
              )}
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#BAE6FD]/15 text-[#0A1A2F]/60 dark:text-white/60 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {workout?.duration_minutes} min
              </span>
              {workout?.exercises?.length && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#BAE6FD]/15 text-[#0A1A2F]/60 dark:text-white/60 flex items-center gap-1">
                  <Dumbbell className="w-3 h-3" /> {workout.exercises.length} exercises
                </span>
              )}
            </div>

            <p className="text-sm text-[#0A1A2F]/60 dark:text-white/60 leading-relaxed">{workout?.description}</p>

            {/* Exercise list */}
            {workout?.exercises?.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm text-[#0A1A2F] dark:text-white mb-2.5 flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#FD9C2D]" />
                  Exercises ({workout.exercises.length})
                </h3>
                <div className="space-y-2">
                  {workout.exercises.map((ex, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl border border-[#BAE6FD]/25">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FD9C2D] to-[#E89020] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#0A1A2F] dark:text-white truncate">{ex.name}</p>
                        <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45 mt-0.5">
                          {ex.duration_seconds > 0 && ex.reps === 0
                            ? <><Timer className="w-3 h-3 inline mr-0.5" />{ex.sets}×{ex.duration_seconds}s</>
                            : `${ex.sets} sets × ${ex.reps} reps`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-3 border-t border-[#BAE6FD]/20">
              <Button onClick={handleStart}
                className="flex-1 bg-gradient-to-r from-[#FD9C2D] to-[#E89020] hover:opacity-90 text-white font-semibold">
                <Play className="w-4 h-4 mr-2" /> Start Workout
              </Button>
              <Button onClick={() => copyWorkout.mutate()} variant="outline"
                disabled={copyWorkout.isPending}
                className="border-[#BAE6FD]/40 text-[#0A1A2F]/60 dark:text-white/60 hover:bg-[#F2F6FA] dark:bg-[#0A1A2F]">
                <Copy className="w-4 h-4 mr-1.5" />
                {copyWorkout.isPending ? 'Adding…' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Only used if onStartWorkout callback not provided */}
      <StartWorkoutModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        workout={workout}
        user={user}
      />
    </>
  );
}
