import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, X, Plus, Play, Dumbbell, Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EXERCISE_LIBRARY } from './ExerciseLibrary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CustomWorkoutBuilder({ exercises, onChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    if (result.source.droppableId === 'library' && result.destination.droppableId === 'workout') {
      // Adding from library to workout
      const exercise = EXERCISE_LIBRARY.find(e => e.id === result.draggableId);
      const newExercise = {
        id: `${exercise.id}-${Date.now()}`,
        name: exercise.name,
        sets: exercise.default_sets || 3,
        reps: exercise.default_reps || 0,
        duration_seconds: exercise.default_duration_seconds || 0,
        description: exercise.description
      };
      const newExercises = [...exercises];
      newExercises.splice(result.destination.index, 0, newExercise);
      onChange(newExercises);
    } else if (result.source.droppableId === 'workout' && result.destination.droppableId === 'workout') {
      // Reordering within workout
      const newExercises = Array.from(exercises);
      const [removed] = newExercises.splice(result.source.index, 1);
      newExercises.splice(result.destination.index, 0, removed);
      onChange(newExercises);
    }
  };

  const removeExercise = (index) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    onChange(newExercises);
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    onChange(newExercises);
  };

  const filteredLibrary = EXERCISE_LIBRARY.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryIcons = {
    strength: Dumbbell,
    cardio: Heart,
    flexibility: Zap
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid md:grid-cols-2 gap-4 h-[500px]">
        {/* Exercise Library */}
        <div className="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-3">Exercise Library</h3>
          
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-3">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="strength" className="text-xs">Strength</TabsTrigger>
              <TabsTrigger value="cardio" className="text-xs">Cardio</TabsTrigger>
              <TabsTrigger value="flexibility" className="text-xs">Flex</TabsTrigger>
            </TabsList>
          </Tabs>

          <Droppable droppableId="library" isDropDisabled={true}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-1 overflow-y-auto space-y-2"
              >
                {filteredLibrary.map((exercise, index) => {
                  const Icon = categoryIcons[exercise.category];
                  return (
                    <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white dark:bg-[#2d2d4a] rounded-lg p-3 cursor-grab active:cursor-grabbing ${
                            snapshot.isDragging ? 'shadow-lg opacity-80' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                            {Icon && <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-1" />}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-[#1a1a2e] dark:text-white">{exercise.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{exercise.description}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Workout Plan */}
        <div className="flex flex-col bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-3">
            Your Workout ({exercises.length} exercises)
          </h3>

          <Droppable droppableId="workout">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 overflow-y-auto space-y-2 ${
                  snapshot.isDraggingOver ? 'bg-[#F2F6FA] dark:bg-[#0A1A2F]/20' : ''
                } ${exercises.length === 0 ? 'border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg' : ''}`}
              >
                {exercises.length === 0 && (
                  <div className="h-full flex items-center justify-center text-center p-8">
                    <div>
                      <Plus className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Drag exercises here to build your workout
                      </p>
                    </div>
                  </div>
                )}
                
                {exercises.map((exercise, index) => (
                  <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white dark:bg-[#2d2d4a] rounded-lg p-3 ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm text-[#1a1a2e] dark:text-white">{exercise.name}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExercise(index)}
                            className="h-6 w-6"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-2 ml-6">
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400">Sets</label>
                            <Input
                              type="number"
                              min="1"
                              value={exercise.sets || ''}
                              onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400">Reps</label>
                            <Input
                              type="number"
                              min="0"
                              value={exercise.reps || ''}
                              onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400">Sec</label>
                            <Input
                              type="number"
                              min="0"
                              value={exercise.duration_seconds || ''}
                              onChange={(e) => updateExercise(index, 'duration_seconds', parseInt(e.target.value) || 0)}
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
}