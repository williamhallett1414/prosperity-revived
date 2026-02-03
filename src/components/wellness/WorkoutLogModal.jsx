import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle } from 'lucide-react';
import { awardPoints, checkAndAwardBadges } from '@/components/gamification/ProgressManager';

export default function WorkoutLogModal({ isOpen, onClose, workout, user }) {
  const [session, setSession] = useState({
    workout_plan_id: workout?.id || '',
    workout_title: workout?.title || '',
    date: new Date().toISOString().split('T')[0],
    duration_minutes: workout?.duration_minutes || 0,
    exercises_performed: (workout?.exercises || []).map(ex => ({
      name: ex.name,
      sets_completed: ex.sets || 0,
      reps_completed: ex.reps || 0,
      weight_used: 0,
      duration_seconds: ex.duration_seconds || 0,
      notes: ''
    })),
    overall_feeling: 'moderate',
    notes: ''
  });

  const queryClient = useQueryClient();

  const logWorkout = useMutation({
    mutationFn: async (data) => {
      const result = await base44.entities.WorkoutSession.create(data);
      
      // Award points and update progress
      const allProgress = await base44.entities.UserProgress.list();
      const userProgress = allProgress.find(p => p.created_by === user?.email);
      const workoutCount = (userProgress?.workouts_completed || 0) + 1;
      
      await awardPoints(user?.email, 15, { workouts_completed: workoutCount });
      await checkAndAwardBadges(user?.email);
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['workout-sessions']);
      queryClient.invalidateQueries(['workouts']);
      onClose();
    }
  });

  const updateExercise = (index, field, value) => {
    const updated = [...session.exercises_performed];
    updated[index] = { ...updated[index], [field]: value };
    setSession({ ...session, exercises_performed: updated });
  };

  const handleSubmit = () => {
    logWorkout.mutate(session);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Workout: {workout?.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              value={session.date}
              onChange={(e) => setSession({ ...session, date: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Duration (min)"
              value={session.duration_minutes}
              onChange={(e) => setSession({ ...session, duration_minutes: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Exercises Performed</h3>
            {session.exercises_performed.map((exercise, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <p className="font-medium text-sm">{exercise.name}</p>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Sets"
                    value={exercise.sets_completed}
                    onChange={(e) => updateExercise(index, 'sets_completed', parseInt(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    placeholder="Reps"
                    value={exercise.reps_completed}
                    onChange={(e) => updateExercise(index, 'reps_completed', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Weight (lbs)"
                    value={exercise.weight_used}
                    onChange={(e) => updateExercise(index, 'weight_used', parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    placeholder="Duration (sec)"
                    value={exercise.duration_seconds}
                    onChange={(e) => updateExercise(index, 'duration_seconds', parseInt(e.target.value) || 0)}
                  />
                </div>
                <Input
                  placeholder="Notes (optional)"
                  value={exercise.notes}
                  onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">How did it feel?</label>
            <Select value={session.overall_feeling} onValueChange={(v) => setSession({ ...session, overall_feeling: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="challenging">Challenging</SelectItem>
                <SelectItem value="very_hard">Very Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Overall session notes (optional)"
            value={session.notes}
            onChange={(e) => setSession({ ...session, notes: e.target.value })}
            className="h-20"
          />

          <Button
            onClick={handleSubmit}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Save Workout Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}