import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Target, Dumbbell, Copy, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import StartWorkoutModal from './StartWorkoutModal';

export default function WorkoutDetailModal({ isOpen, onClose, workout, user }) {
  const [showStartModal, setShowStartModal] = useState(false);
  const queryClient = useQueryClient();

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const categoryEmojis = {
    cardio: '🏃',
    strength: '💪',
    flexibility: '🧘',
    full_body: '🔥',
    yoga: '🕉️'
  };

  const copyWorkout = useMutation({
    mutationFn: async () => {
      const workoutCopy = {
        title: workout.title,
        description: workout.description,
        difficulty: workout.difficulty,
        duration_minutes: workout.duration_minutes,
        exercises: workout.exercises,
        category: workout.category,
        image_url: workout.image_url,
        completed_dates: []
      };
      await base44.entities.WorkoutPlan.create(workoutCopy);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['workouts']);
      toast.success('Workout added to your library!');
      onClose();
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">{categoryEmojis[workout?.category]}</span>
            {workout?.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {workout?.image_url && (
            <img 
              src={workout.image_url} 
              alt={workout.title} 
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          <div className="flex items-center gap-3">
            <Badge className={difficultyColors[workout?.difficulty]}>
              {workout?.difficulty}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {workout?.duration_minutes} min
            </Badge>
            <Badge variant="outline">
              {workout?.category}
            </Badge>
          </div>

          <div>
            <p className="text-gray-700 dark:text-gray-300">{workout?.description}</p>
          </div>

          {workout?.exercises && workout.exercises.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                Exercises ({workout.exercises.length})
              </h3>
              <div className="space-y-2">
                {workout.exercises.map((exercise, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-[#1a1a2e] rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[#1a1a2e] dark:text-white">
                        {exercise.name}
                      </h4>
                      <div className="flex gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {exercise.sets && exercise.reps && (
                          <span>{exercise.sets} sets × {exercise.reps} reps</span>
                        )}
                        {exercise.duration_seconds && (
                          <span>{exercise.duration_seconds}s</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={() => {
                setShowStartModal(true);
                onClose();
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Workout
            </Button>
            <Button
              onClick={() => copyWorkout.mutate()}
              variant="outline"
              disabled={copyWorkout.isPending}
            >
              <Copy className="w-4 h-4 mr-2" />
              {copyWorkout.isPending ? 'Adding...' : 'Add to Library'}
            </Button>
          </div>
        </div>

        <StartWorkoutModal
          isOpen={showStartModal}
          onClose={() => setShowStartModal(false)}
          workout={workout}
          user={user}
        />
      </DialogContent>
    </Dialog>
  );
}