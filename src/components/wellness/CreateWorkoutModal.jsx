import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function CreateWorkoutModal({ isOpen, onClose }) {
  const [workout, setWorkout] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    category: 'full_body',
    duration_minutes: 30,
    exercises: []
  });
  const [currentExercise, setCurrentExercise] = useState({ name: '', sets: 3, reps: 10 });
  const queryClient = useQueryClient();

  const createWorkout = useMutation({
    mutationFn: (data) => base44.entities.WorkoutPlan.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['workouts']);
      onClose();
      setWorkout({ title: '', description: '', difficulty: 'beginner', category: 'full_body', duration_minutes: 30, exercises: [] });
    }
  });

  const addExercise = () => {
    if (currentExercise.name.trim()) {
      setWorkout({ ...workout, exercises: [...workout.exercises, currentExercise] });
      setCurrentExercise({ name: '', sets: 3, reps: 10 });
    }
  };

  const removeExercise = (index) => {
    setWorkout({ ...workout, exercises: workout.exercises.filter((_, i) => i !== index) });
  };

  const handleSubmit = () => {
    if (workout.title.trim()) {
      createWorkout.mutate(workout);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Workout Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Title</label>
            <Input
              placeholder="e.g., Morning Full Body"
              value={workout.title}
              onChange={(e) => setWorkout({ ...workout, title: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              placeholder="Brief description of the workout"
              value={workout.description}
              onChange={(e) => setWorkout({ ...workout, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Difficulty</label>
              <Select value={workout.difficulty} onValueChange={(v) => setWorkout({ ...workout, difficulty: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Duration (min)</label>
              <Input
                type="number"
                value={workout.duration_minutes}
                onChange={(e) => setWorkout({ ...workout, duration_minutes: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={workout.category} onValueChange={(v) => setWorkout({ ...workout, category: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="flexibility">Flexibility</SelectItem>
                <SelectItem value="full_body">Full Body</SelectItem>
                <SelectItem value="yoga">Yoga</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Exercises</label>
            <div className="space-y-2 mb-2">
              {workout.exercises.map((ex, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  <span className="text-sm">{ex.name} - {ex.sets}x{ex.reps}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeExercise(i)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Exercise name"
                value={currentExercise.name}
                onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Sets"
                value={currentExercise.sets}
                onChange={(e) => setCurrentExercise({ ...currentExercise, sets: parseInt(e.target.value) })}
                className="w-16"
              />
              <Input
                type="number"
                placeholder="Reps"
                value={currentExercise.reps}
                onChange={(e) => setCurrentExercise({ ...currentExercise, reps: parseInt(e.target.value) })}
                className="w-16"
              />
              <Button variant="outline" onClick={addExercise}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700">
            Create Workout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}