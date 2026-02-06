import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { X, Plus, Dumbbell, Clock, TrendingUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const POPULAR_EXERCISES = {
  strength: [
    { name: 'Push-ups', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Pull-ups', sets: 3, reps: 8, duration_seconds: 0 },
    { name: 'Squats', sets: 3, reps: 15, duration_seconds: 0 },
    { name: 'Lunges', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Bicep Curls', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Tricep Dips', sets: 3, reps: 10, duration_seconds: 0 },
    { name: 'Bench Press', sets: 4, reps: 10, duration_seconds: 0 },
    { name: 'Deadlifts', sets: 4, reps: 8, duration_seconds: 0 },
    { name: 'Shoulder Press', sets: 3, reps: 10, duration_seconds: 0 },
    { name: 'Dumbbell Rows', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Leg Press', sets: 4, reps: 12, duration_seconds: 0 },
    { name: 'Chest Flyes', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Lateral Raises', sets: 3, reps: 15, duration_seconds: 0 },
    { name: 'Front Raises', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Hammer Curls', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Overhead Tricep Extension', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Calf Raises', sets: 4, reps: 20, duration_seconds: 0 },
    { name: 'Bulgarian Split Squats', sets: 3, reps: 10, duration_seconds: 0 },
    { name: 'Hip Thrusts', sets: 4, reps: 12, duration_seconds: 0 },
    { name: 'Face Pulls', sets: 3, reps: 15, duration_seconds: 0 },
    { name: 'Barbell Squat', sets: 4, reps: 10, duration_seconds: 0 },
    { name: 'Romanian Deadlift', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Incline Bench Press', sets: 3, reps: 10, duration_seconds: 0 },
    { name: 'Cable Crossover', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Preacher Curls', sets: 3, reps: 10, duration_seconds: 0 },
    { name: 'Skull Crushers', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Arnold Press', sets: 3, reps: 10, duration_seconds: 0 },
    { name: 'Upright Rows', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Shrugs', sets: 4, reps: 15, duration_seconds: 0 },
    { name: 'Leg Curls', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Leg Extensions', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Goblet Squats', sets: 3, reps: 15, duration_seconds: 0 },
    { name: 'Reverse Lunges', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Step-Ups', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Glute Bridges', sets: 3, reps: 15, duration_seconds: 0 },
  ],
  cardio: [
    { name: 'Running', sets: 1, reps: 0, duration_seconds: 1800 },
    { name: 'Jump Rope', sets: 3, reps: 0, duration_seconds: 120 },
    { name: 'Burpees', sets: 3, reps: 15, duration_seconds: 0 },
    { name: 'Mountain Climbers', sets: 3, reps: 20, duration_seconds: 0 },
    { name: 'High Knees', sets: 3, reps: 0, duration_seconds: 60 },
    { name: 'Jumping Jacks', sets: 3, reps: 30, duration_seconds: 0 },
    { name: 'Cycling', sets: 1, reps: 0, duration_seconds: 2400 },
    { name: 'Sprints', sets: 5, reps: 0, duration_seconds: 30 },
    { name: 'Box Jumps', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Rowing Machine', sets: 1, reps: 0, duration_seconds: 1200 },
    { name: 'Stair Climbing', sets: 1, reps: 0, duration_seconds: 900 },
    { name: 'Jump Squats', sets: 3, reps: 15, duration_seconds: 0 },
    { name: 'Battle Ropes', sets: 3, reps: 0, duration_seconds: 45 },
    { name: 'Elliptical', sets: 1, reps: 0, duration_seconds: 1800 },
    { name: 'Swimming', sets: 1, reps: 0, duration_seconds: 1200 },
    { name: 'Dancing', sets: 1, reps: 0, duration_seconds: 1800 },
    { name: 'Shadow Boxing', sets: 3, reps: 0, duration_seconds: 180 },
    { name: 'Kickboxing', sets: 3, reps: 0, duration_seconds: 180 },
    { name: 'Tuck Jumps', sets: 3, reps: 10, duration_seconds: 0 },
    { name: 'Lateral Shuffles', sets: 3, reps: 0, duration_seconds: 45 },
    { name: 'Skaters', sets: 3, reps: 20, duration_seconds: 0 },
    { name: 'Ice Skaters', sets: 3, reps: 20, duration_seconds: 0 },
    { name: 'Butt Kicks', sets: 3, reps: 0, duration_seconds: 60 },
    { name: 'Speed Skaters', sets: 3, reps: 15, duration_seconds: 0 },
    { name: 'Plyometric Lunges', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Broad Jumps', sets: 3, reps: 10, duration_seconds: 0 },
  ],
  core: [
    { name: 'Plank', sets: 3, reps: 0, duration_seconds: 60 },
    { name: 'Crunches', sets: 3, reps: 20, duration_seconds: 0 },
    { name: 'Russian Twists', sets: 3, reps: 25, duration_seconds: 0 },
    { name: 'Leg Raises', sets: 3, reps: 15, duration_seconds: 0 },
    { name: 'Bicycle Crunches', sets: 3, reps: 20, duration_seconds: 0 },
    { name: 'Side Plank', sets: 3, reps: 0, duration_seconds: 45 },
    { name: 'Dead Bug', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Bird Dog', sets: 3, reps: 10, duration_seconds: 0 },
    { name: 'Mountain Climbers', sets: 3, reps: 20, duration_seconds: 0 },
    { name: 'Flutter Kicks', sets: 3, reps: 0, duration_seconds: 45 },
    { name: 'Scissor Kicks', sets: 3, reps: 20, duration_seconds: 0 },
    { name: 'V-Ups', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Hollow Body Hold', sets: 3, reps: 0, duration_seconds: 30 },
    { name: 'Sit-Ups', sets: 3, reps: 20, duration_seconds: 0 },
    { name: 'Toe Touches', sets: 3, reps: 15, duration_seconds: 0 },
    { name: 'Windshield Wipers', sets: 3, reps: 10, duration_seconds: 0 },
    { name: 'Ab Wheel Rollouts', sets: 3, reps: 10, duration_seconds: 0 },
    { name: 'L-Sits', sets: 3, reps: 0, duration_seconds: 20 },
    { name: 'Cable Woodchoppers', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Reverse Crunches', sets: 3, reps: 15, duration_seconds: 0 },
    { name: 'Plank Jacks', sets: 3, reps: 15, duration_seconds: 0 },
    { name: 'Spiderman Planks', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Dragon Flags', sets: 3, reps: 6, duration_seconds: 0 },
    { name: 'Hanging Knee Raises', sets: 3, reps: 12, duration_seconds: 0 },
    { name: 'Pallof Press', sets: 3, reps: 10, duration_seconds: 0 },
  ],
  flexibility: [
    { name: 'Downward Dog', sets: 1, reps: 0, duration_seconds: 60 },
    { name: 'Child\'s Pose', sets: 1, reps: 0, duration_seconds: 90 },
    { name: 'Cat-Cow Stretch', sets: 3, reps: 10, duration_seconds: 0 },
    { name: 'Standing Forward Bend', sets: 1, reps: 0, duration_seconds: 60 },
    { name: 'Butterfly Stretch', sets: 1, reps: 0, duration_seconds: 60 },
    { name: 'Cobra Stretch', sets: 3, reps: 0, duration_seconds: 30 },
    { name: 'Pigeon Pose', sets: 1, reps: 0, duration_seconds: 90 },
    { name: 'Seated Spinal Twist', sets: 2, reps: 0, duration_seconds: 60 },
    { name: 'Hip Flexor Stretch', sets: 2, reps: 0, duration_seconds: 45 },
    { name: 'Hamstring Stretch', sets: 2, reps: 0, duration_seconds: 60 },
    { name: 'Quad Stretch', sets: 2, reps: 0, duration_seconds: 45 },
    { name: 'Shoulder Stretch', sets: 2, reps: 0, duration_seconds: 30 },
    { name: 'Tricep Stretch', sets: 2, reps: 0, duration_seconds: 30 },
    { name: 'Neck Rolls', sets: 2, reps: 10, duration_seconds: 0 },
    { name: 'Arm Circles', sets: 2, reps: 15, duration_seconds: 0 },
    { name: 'Ankle Circles', sets: 2, reps: 15, duration_seconds: 0 },
    { name: 'Figure 4 Stretch', sets: 2, reps: 0, duration_seconds: 60 },
    { name: 'Lizard Pose', sets: 1, reps: 0, duration_seconds: 60 },
    { name: 'Thread the Needle', sets: 2, reps: 0, duration_seconds: 45 },
    { name: 'Frog Stretch', sets: 1, reps: 0, duration_seconds: 90 },
    { name: 'Reclined Spinal Twist', sets: 2, reps: 0, duration_seconds: 60 },
    { name: 'Sphinx Pose', sets: 2, reps: 0, duration_seconds: 45 },
    { name: 'Low Lunge', sets: 2, reps: 0, duration_seconds: 60 },
    { name: 'Wide-Legged Forward Fold', sets: 1, reps: 0, duration_seconds: 60 },
    { name: 'Side Bend Stretch', sets: 2, reps: 0, duration_seconds: 45 },
    { name: 'Chest Opener Stretch', sets: 2, reps: 0, duration_seconds: 45 },
    { name: 'Wrist Circles', sets: 2, reps: 15, duration_seconds: 0 },
    { name: 'Knee to Chest', sets: 2, reps: 0, duration_seconds: 45 },
  ],
};

export default function CreateWorkoutModal({ isOpen, onClose }) {
  const [workout, setWorkout] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    category: 'full_body',
    duration_minutes: 30,
    exercises: []
  });
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [libraryCategory, setLibraryCategory] = useState('strength');
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

  const addExerciseFromLibrary = (exercise) => {
    setWorkout({ 
      ...workout, 
      exercises: [...workout.exercises, { ...exercise, id: `ex-${Date.now()}` }] 
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

  const filteredLibraryExercises = POPULAR_EXERCISES[libraryCategory]?.filter(ex =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Dumbbell className="w-6 h-6 text-emerald-600" />
            Create Workout Plan
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-6 space-y-8">
          {/* Basic Info */}
          <div className="space-y-5">
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2.5 block">Workout Name *</Label>
              <Input
                placeholder="e.g., Morning Full Body Routine"
                value={workout.title}
                onChange={(e) => setWorkout({ ...workout, title: e.target.value })}
                className="text-base h-11"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2.5 block">Description</Label>
              <Textarea
                placeholder="Add notes about this workout..."
                value={workout.description}
                onChange={(e) => setWorkout({ ...workout, description: e.target.value })}
                className="h-24 resize-none"
              />
            </div>
          </div>

          {/* Workout Details */}
          <div className="space-y-5 pt-2">
            <Label className="text-base font-semibold text-gray-900">Workout Details</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2.5 block">Difficulty</Label>
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
                <Label className="text-sm font-medium text-gray-700 mb-2.5 block">Duration (minutes)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="30"
                    value={workout.duration_minutes}
                    onChange={(e) => setWorkout({ ...workout, duration_minutes: parseInt(e.target.value) || 0 })}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Category</Label>
              <div className="grid grid-cols-5 gap-3">
                {['cardio', 'strength', 'flexibility', 'full_body', 'yoga'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setWorkout({ ...workout, category: cat })}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      workout.category === cat
                        ? 'border-emerald-600 bg-emerald-50 shadow-sm'
                        : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mb-1.5">{categoryIcons[cat]}</div>
                    <div className="text-xs font-semibold capitalize">{cat.replace('_', ' ')}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Exercises */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold text-gray-900">Exercises *</Label>
                <p className="text-sm text-gray-500 mt-1">Add at least one exercise</p>
              </div>
              <div className="flex gap-2.5">
                <Button 
                  onClick={() => setShowExerciseLibrary(!showExerciseLibrary)} 
                  size="sm" 
                  variant={showExerciseLibrary ? "default" : "outline"}
                  className={showExerciseLibrary ? "bg-emerald-600" : "border-emerald-600 text-emerald-600"}
                >
                  <Dumbbell className="w-4 h-4 mr-1" />
                  Library
                </Button>
                <Button onClick={addExercise} size="sm" variant="outline" className="border-emerald-600 text-emerald-600">
                  <Plus className="w-4 h-4 mr-1" />
                  Custom
                </Button>
              </div>
            </div>

            {/* Exercise Library */}
            {showExerciseLibrary && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200 shadow-sm">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search exercises..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white"
                    />
                  </div>

                  <Tabs value={libraryCategory} onValueChange={setLibraryCategory}>
                    <TabsList className="grid w-full grid-cols-4 bg-white p-1">
                      <TabsTrigger value="strength" className="text-sm">💪 Strength</TabsTrigger>
                      <TabsTrigger value="cardio" className="text-sm">🏃 Cardio</TabsTrigger>
                      <TabsTrigger value="core" className="text-sm">🎯 Core</TabsTrigger>
                      <TabsTrigger value="flexibility" className="text-sm">🧘 Flexibility</TabsTrigger>
                    </TabsList>

                    <TabsContent value={libraryCategory} className="mt-4">
                      <div className="grid grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-2">
                        {filteredLibraryExercises.map((exercise, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => addExerciseFromLibrary(exercise)}
                            className="p-3 bg-white rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group"
                          >
                            <div className="font-medium text-sm mb-1 group-hover:text-emerald-700">{exercise.name}</div>
                            <div className="text-xs text-gray-500">
                              {exercise.sets > 0 && `${exercise.sets} sets`}
                              {exercise.reps > 0 && ` × ${exercise.reps} reps`}
                              {exercise.duration_seconds > 0 && ` ${exercise.duration_seconds}s`}
                            </div>
                          </button>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}

            {workout.exercises.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Dumbbell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-1">No exercises added yet</p>
                <p className="text-xs text-gray-400 mb-4">Use the library or add custom exercises</p>
                <Button onClick={addExercise} size="sm" variant="outline" className="border-emerald-600 text-emerald-600">
                  <Plus className="w-4 h-4 mr-1" />
                  Add your first exercise
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
                {workout.exercises.map((exercise, index) => (
                  <div key={exercise.id || index} className="p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-emerald-200 transition-all shadow-sm">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-3.5">
                        <Input
                          placeholder="Exercise name (e.g., Push-ups)"
                          value={exercise.name}
                          onChange={(e) => updateExercise(index, 'name', e.target.value)}
                          className="font-medium h-10"
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <Label className="text-xs font-medium text-gray-600 mb-1.5 block">Sets</Label>
                            <Input
                              type="number"
                              placeholder="3"
                              value={exercise.sets || ''}
                              onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                              className="text-center"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-600 mb-1.5 block">Reps</Label>
                            <Input
                              type="number"
                              placeholder="10"
                              value={exercise.reps || ''}
                              onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                              className="text-center h-10"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-600 mb-1.5 block">Seconds</Label>
                            <Input
                              type="number"
                              placeholder="30"
                              value={exercise.duration_seconds || ''}
                              onChange={(e) => updateExercise(index, 'duration_seconds', parseInt(e.target.value) || 0)}
                              className="text-center h-10"
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExercise(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-6 border-t-2 border-gray-100">
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-sm"
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