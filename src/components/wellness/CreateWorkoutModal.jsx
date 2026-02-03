import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomWorkoutBuilder from './CustomWorkoutBuilder';

export default function CreateWorkoutModal({ isOpen, onClose }) {
  const [builderMode, setBuilderMode] = useState('builder');
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
      setBuilderMode('builder');
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Workout Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Workout title (e.g., Morning Full Body)"
            value={workout.title}
            onChange={(e) => setWorkout({ ...workout, title: e.target.value })}
          />

          <Textarea
            placeholder="Description"
            value={workout.description}
            onChange={(e) => setWorkout({ ...workout, description: e.target.value })}
            className="h-20"
          />

          <div className="grid grid-cols-3 gap-3">
            <Select value={workout.difficulty} onValueChange={(v) => setWorkout({ ...workout, difficulty: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={workout.category} onValueChange={(v) => setWorkout({ ...workout, category: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="flexibility">Flexibility</SelectItem>
                <SelectItem value="full_body">Full Body</SelectItem>
                <SelectItem value="yoga">Yoga</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Duration (min)"
              value={workout.duration_minutes}
              onChange={(e) => setWorkout({ ...workout, duration_minutes: parseInt(e.target.value) || 0 })}
            />
          </div>

          {/* Exercise Builder */}
          <Tabs value={builderMode} onValueChange={setBuilderMode}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="builder">Drag & Drop Builder</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>

            <TabsContent value="builder" className="mt-4">
              <CustomWorkoutBuilder 
                exercises={workout.exercises}
                onChange={(exercises) => setWorkout({ ...workout, exercises })}
              />
            </TabsContent>

            <TabsContent value="manual" className="mt-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Exercises</h3>
                  <Button onClick={addExercise} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Exercise
                  </Button>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {workout.exercises.map((exercise, index) => (
                    <div key={exercise.id || index} className="flex gap-2 items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Exercise name"
                          value={exercise.name}
                          onChange={(e) => updateExercise(index, 'name', e.target.value)}
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            type="number"
                            placeholder="Sets"
                            value={exercise.sets || ''}
                            onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                          />
                          <Input
                            type="number"
                            placeholder="Reps"
                            value={exercise.reps || ''}
                            onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                          />
                          <Input
                            type="number"
                            placeholder="Seconds"
                            value={exercise.duration_seconds || ''}
                            onChange={(e) => updateExercise(index, 'duration_seconds', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExercise(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button 
            onClick={handleSubmit} 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={!workout.title.trim() || workout.exercises.length === 0}
          >
            Create Workout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}