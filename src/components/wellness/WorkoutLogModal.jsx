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
      const allProgress = await base44.entities.UserProgress.list();
      const userProgress = allProgress.find(p => p.created_by === user?.email);
      const workoutCount = (userProgress?.workouts_completed || 0) + 1;
      await awardPoints(user?.email, 15, { workouts_completed: workoutCount });
      await checkAndAwardBadges(user?.email);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['workoutSessions']);
      queryClient.invalidateQueries(['workouts']);
      onClose();
    }
  });

  const updateExercise = (index, field, value) => {
    const updated = [...session.exercises_performed];
    updated[index] = { ...updated[index], [field]: value };
    setSession({ ...session, exercises_performed: updated });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white border-[#BAE6FD]/30">
        <DialogHeader>
          <DialogTitle className="text-[#0A1A2F]">Log Workout: {workout?.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input type="date" value={session.date}
              onChange={e => setSession({ ...session, date: e.target.value })}
              className="border-[#BAE6FD]/40 focus-visible:ring-[#38BDF8]/30" />
            <Input type="number" placeholder="Duration (min)"
              value={session.duration_minutes}
              onChange={e => setSession({ ...session, duration_minutes: parseInt(e.target.value) || 0 })}
              className="border-[#BAE6FD]/40 focus-visible:ring-[#38BDF8]/30" />
          </div>

          <div className="space-y-2.5">
            <h3 className="font-semibold text-sm text-[#0A1A2F]">Exercises Performed</h3>
            {session.exercises_performed.map((exercise, index) => (
              <div key={index} className="border border-[#BAE6FD]/30 rounded-xl p-3 space-y-2 bg-[#F2F6FA]/60">
                <p className="font-semibold text-sm text-[#0A1A2F]">{exercise.name}</p>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="Sets"
                    value={exercise.sets_completed}
                    onChange={e => updateExercise(index, 'sets_completed', parseInt(e.target.value) || 0)}
                    className="border-[#BAE6FD]/40 text-sm" />
                  <Input type="number" placeholder="Reps"
                    value={exercise.reps_completed}
                    onChange={e => updateExercise(index, 'reps_completed', parseInt(e.target.value) || 0)}
                    className="border-[#BAE6FD]/40 text-sm" />
                </div>
                {exercise.duration_seconds === 0 && (
                  <Input type="number" placeholder="Weight (lbs)"
                    value={exercise.weight_used}
                    onChange={e => updateExercise(index, 'weight_used', parseFloat(e.target.value) || 0)}
                    className="border-[#BAE6FD]/40 text-sm" />
                )}
                <Input placeholder="Notes (optional)"
                  value={exercise.notes}
                  onChange={e => updateExercise(index, 'notes', e.target.value)}
                  className="border-[#BAE6FD]/40 text-sm" />
              </div>
            ))}
          </div>

          <div>
            <label className="text-sm font-semibold text-[#0A1A2F] mb-2 block">How did it feel?</label>
            <Select value={session.overall_feeling} onValueChange={v => setSession({ ...session, overall_feeling: v })}>
              <SelectTrigger className="border-[#BAE6FD]/40">
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

          <Textarea placeholder="Overall session notes (optional)"
            value={session.notes}
            onChange={e => setSession({ ...session, notes: e.target.value })}
            className="h-20 border-[#BAE6FD]/40" />

          <Button onClick={() => logWorkout.mutate(session)}
            disabled={logWorkout.isPending}
            className="w-full bg-gradient-to-r from-[#FD9C2D] to-[#E89020] hover:opacity-90 text-white font-semibold">
            <CheckCircle className="w-4 h-4 mr-2" />
            {logWorkout.isPending ? 'Saving…' : 'Save Workout Session'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
