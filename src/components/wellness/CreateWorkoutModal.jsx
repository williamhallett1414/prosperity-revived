import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { X, Plus, Dumbbell, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function CreateWorkoutModal({ isOpen, onClose }) {
  const [workout, setWorkout] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    category: 'full_body',
    duration_minutes: 30,
    exercises: []
  });
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
    setWorkout({ 
      ...workout, 
      exercises: [...workout.exercises, { id: `ex-${Date.now()}`, name: '', sets: 3, reps: 10, duration_seconds: 0 }] 
    });
  };

  const removeExercise = (index) => {
    setWorkout({ ...workout, exercises: workout.exercises.filter((_, i) => i !== index) });
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...workout.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setWorkout({ ...workout, exercises: newExercises });
  };

  const handleSubmit = () => {
    if (workout.title.trim() && workout.exercises.length > 0) {
      createWorkout.mutate(workout);
    }
  };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const categoryIcons = {
    cardio: '🏃',
    strength: '💪',
    flexibility: '🧘',
    full_body: '🔥',
    yoga: '🕉️'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-emerald-600" />
            Create Workout Plan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Workout Name *</Label>
              <Input
                placeholder="e.g., Morning Full Body Routine"
                value={workout.title}
                onChange={(e) => setWorkout({ ...workout, title: e.target.value })}
                className="text-base"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Description</Label>
              <Textarea
                placeholder="Add notes about this workout..."
                value={workout.description}
                onChange={(e) => setWorkout({ ...workout, description: e.target.value })}
                className="h-20 resize-none"
              />
            </div>
          </div>

          {/* Workout Details */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Workout Details</Label>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-600 mb-2 block">Difficulty</Label>
                <Select value={workout.difficulty} onValueChange={(v) => setWorkout({ ...workout, difficulty: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        Beginner
                      </div>
                    </SelectItem>
                    <SelectItem value="intermediate">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-yellow-600" />
                        Intermediate
                      </div>
                    </SelectItem>
                    <SelectItem value="advanced">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-red-600" />
                        Advanced
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-2 block">Duration (minutes)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="30"
                    value={workout.duration_minutes}
                    onChange={(e) => setWorkout({ ...workout, duration_minutes: parseInt(e.target.value) || 0 })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-600 mb-2 block">Category</Label>
              <div className="grid grid-cols-5 gap-2">
                {['cardio', 'strength', 'flexibility', 'full_body', 'yoga'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setWorkout({ ...workout, category: cat })}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      workout.category === cat
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{categoryIcons[cat]}</div>
                    <div className="text-xs font-medium capitalize">{cat.replace('_', ' ')}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Exercises */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Exercises *</Label>
                <p className="text-xs text-gray-500 mt-1">Add at least one exercise</p>
              </div>
              <Button onClick={addExercise} size="sm" variant="outline" className="border-emerald-600 text-emerald-600">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            {workout.exercises.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <Dumbbell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No exercises added yet</p>
                <Button onClick={addExercise} size="sm" variant="ghost" className="mt-2">
                  <Plus className="w-4 h-4 mr-1" />
                  Add your first exercise
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {workout.exercises.map((exercise, index) => (
                  <div key={exercise.id || index} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        <Input
                          placeholder="Exercise name (e.g., Push-ups)"
                          value={exercise.name}
                          onChange={(e) => updateExercise(index, 'name', e.target.value)}
                          className="font-medium"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Sets</Label>
                            <Input
                              type="number"
                              placeholder="3"
                              value={exercise.sets || ''}
                              onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                              className="text-center"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Reps</Label>
                            <Input
                              type="number"
                              placeholder="10"
                              value={exercise.reps || ''}
                              onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                              className="text-center"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Seconds</Label>
                            <Input
                              type="number"
                              placeholder="30"
                              value={exercise.duration_seconds || ''}
                              onChange={(e) => updateExercise(index, 'duration_seconds', parseInt(e.target.value) || 0)}
                              className="text-center"
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExercise(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              disabled={!workout.title.trim() || workout.exercises.length === 0 || createWorkout.isPending}
            >
              {createWorkout.isPending ? 'Creating...' : 'Create Workout'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}