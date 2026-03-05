import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useGroceryList } from '@/components/wellness/useGroceryList';
import { ShoppingCart, Dumbbell, Utensils, X, Plus, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const PLANNER_KEY = 'workout_planner_v1';

function loadPlan() {
  try {
    return JSON.parse(localStorage.getItem(PLANNER_KEY) || '{}');
  } catch { return {}; }
}

function savePlan(plan) {
  localStorage.setItem(PLANNER_KEY, JSON.stringify(plan));
}

const EXERCISE_LIBRARY = [
  { id: 'ex-pushups', name: 'Push-Ups', category: 'strength', detail: '3 × 15 reps' },
  { id: 'ex-squats', name: 'Squats', category: 'strength', detail: '3 × 20 reps' },
  { id: 'ex-lunges', name: 'Lunges', category: 'strength', detail: '3 × 12 each' },
  { id: 'ex-plank', name: 'Plank', category: 'core', detail: '3 × 45 sec' },
  { id: 'ex-run', name: '30-min Run', category: 'cardio', detail: '30 min' },
  { id: 'ex-cycling', name: 'Cycling', category: 'cardio', detail: '45 min' },
  { id: 'ex-yoga', name: 'Yoga Flow', category: 'flexibility', detail: '20 min' },
  { id: 'ex-stretch', name: 'Full Stretch', category: 'flexibility', detail: '15 min' },
  { id: 'ex-pullups', name: 'Pull-Ups', category: 'strength', detail: '3 × 8 reps' },
  { id: 'ex-burpees', name: 'Burpees', category: 'cardio', detail: '4 × 10 reps' },
  { id: 'ex-deadlift', name: 'Deadlift', category: 'strength', detail: '4 × 8 reps' },
  { id: 'ex-rest', name: 'Rest Day', category: 'rest', detail: 'Recovery' },
];

const CATEGORY_COLORS = {
  strength: 'bg-blue-100 text-blue-700',
  cardio: 'bg-orange-100 text-orange-700',
  flexibility: 'bg-green-100 text-green-700',
  core: 'bg-purple-100 text-purple-700',
  rest: 'bg-gray-100 text-gray-500',
};

export default function WorkoutPlanner() {
  const [plan, setPlan] = useState(loadPlan);
  const [activePanel, setActivePanel] = useState('exercises'); // 'exercises' | 'recipes'
  const { addRecipe, isRecipeAdded } = useGroceryList();
  const [addedRecipes, setAddedRecipes] = useState({});

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes-planner'],
    queryFn: () => base44.entities.Recipe.list('-created_date', 50),
  });

  useEffect(() => { savePlan(plan); }, [plan]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    // Dropping from library into a day slot
    if (source.droppableId === 'library') {
      const isExercise = draggableId.startsWith('ex-');
      const item = isExercise
        ? EXERCISE_LIBRARY.find(e => e.id === draggableId)
        : recipes.find(r => r.id === draggableId);
      if (!item) return;

      const slot = { ...item, slotId: `${draggableId}-${Date.now()}`, type: isExercise ? 'exercise' : 'meal' };
      setPlan(prev => ({
        ...prev,
        [destination.droppableId]: [...(prev[destination.droppableId] || []), slot],
      }));

      if (!isExercise) {
        addRecipe(item);
        setAddedRecipes(p => ({ ...p, [item.id]: true }));
        toast.success(`🛒 Ingredients added to grocery list`);
      }
      return;
    }

    // Reordering within a day
    if (source.droppableId === destination.droppableId) {
      const dayItems = [...(plan[source.droppableId] || [])];
      const [moved] = dayItems.splice(source.index, 1);
      dayItems.splice(destination.index, 0, moved);
      setPlan(prev => ({ ...prev, [source.droppableId]: dayItems }));
      return;
    }

    // Moving between days
    const srcItems = [...(plan[source.droppableId] || [])];
    const [moved] = srcItems.splice(source.index, 1);
    const dstItems = [...(plan[destination.droppableId] || [])];
    dstItems.splice(destination.index, 0, moved);
    setPlan(prev => ({
      ...prev,
      [source.droppableId]: srcItems,
      [destination.droppableId]: dstItems,
    }));
  };

  const removeSlot = (day, slotId) => {
    setPlan(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(s => s.slotId !== slotId),
    }));
  };

  const clearDay = (day) => {
    setPlan(prev => ({ ...prev, [day]: [] }));
  };

  const totalMeals = Object.values(plan).flat().filter(s => s.type === 'meal').length;
  const totalWorkouts = Object.values(plan).flat().filter(s => s.type === 'exercise').length;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Stats Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-[#38BDF8]">
              <Dumbbell className="w-4 h-4" />
              <span className="font-semibold">{totalWorkouts}</span>
              <span className="text-gray-500">workouts</span>
            </div>
            <div className="flex items-center gap-2 text-[#FD9C2D]">
              <Utensils className="w-4 h-4" />
              <span className="font-semibold">{totalMeals}</span>
              <span className="text-gray-500">meals planned</span>
            </div>
            {totalMeals > 0 && (
              <div className="flex items-center gap-1.5 text-green-600 ml-auto">
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs font-medium">Ingredients auto-added to grocery list</span>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-4 flex gap-4">
          {/* Sidebar Library */}
          <div className="w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-20 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActivePanel('exercises')}
                  className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${activePanel === 'exercises' ? 'text-[#38BDF8] border-b-2 border-[#38BDF8]' : 'text-gray-400'}`}
                >
                  <Dumbbell className="w-3.5 h-3.5 inline mr-1" />Exercises
                </button>
                <button
                  onClick={() => setActivePanel('recipes')}
                  className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${activePanel === 'recipes' ? 'text-[#FD9C2D] border-b-2 border-[#FD9C2D]' : 'text-gray-400'}`}
                >
                  <Utensils className="w-3.5 h-3.5 inline mr-1" />Meals
                </button>
              </div>
              <p className="text-[10px] text-gray-400 text-center py-1.5 bg-gray-50">Drag into any day →</p>

              <Droppable droppableId="library" isDropDisabled={true}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="overflow-y-auto max-h-[calc(100vh-220px)] p-2 space-y-1">
                    {activePanel === 'exercises'
                      ? EXERCISE_LIBRARY.map((ex, idx) => (
                        <Draggable key={ex.id} draggableId={ex.id} index={idx}>
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className={`rounded-xl p-2.5 cursor-grab border transition-shadow ${snap.isDragging ? 'shadow-lg border-[#38BDF8]/40 bg-blue-50' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                            >
                              <p className="text-xs font-semibold text-[#0A1A2F] leading-tight">{ex.name}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${CATEGORY_COLORS[ex.category]}`}>{ex.category}</span>
                                <span className="text-[9px] text-gray-400">{ex.detail}</span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                      : recipes.map((recipe, idx) => (
                        <Draggable key={recipe.id} draggableId={recipe.id} index={idx}>
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className={`rounded-xl p-2.5 cursor-grab border transition-shadow ${snap.isDragging ? 'shadow-lg border-[#FD9C2D]/40 bg-orange-50' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                            >
                              <p className="text-xs font-semibold text-[#0A1A2F] leading-tight line-clamp-2">{recipe.title}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600">{recipe.category || 'meal'}</span>
                                {recipe.calories && <span className="text-[9px] text-gray-400">{recipe.calories} cal</span>}
                              </div>
                              {isRecipeAdded(recipe.id) && (
                                <div className="flex items-center gap-1 mt-1">
                                  <CheckCircle className="w-2.5 h-2.5 text-green-500" />
                                  <span className="text-[9px] text-green-600">In grocery list</span>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))
                    }
                    {provided.placeholder}
                    {activePanel === 'recipes' && recipes.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-4 px-2">No recipes yet. Add some in Discover Recipes!</p>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          {/* Weekly Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {DAYS.map(day => {
              const dayItems = plan[day] || [];
              return (
                <div key={day} className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden min-h-[200px]">
                  {/* Day Header */}
                  <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0A1A2F]">{day.slice(0, 3).toUpperCase()}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-400">{dayItems.length} item{dayItems.length !== 1 ? 's' : ''}</span>
                      {dayItems.length > 0 && (
                        <button onClick={() => clearDay(day)} className="text-[9px] text-red-400 hover:text-red-600 transition-colors">clear</button>
                      )}
                    </div>
                  </div>

                  <Droppable droppableId={day}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 p-2 space-y-1.5 transition-colors min-h-[140px] ${snapshot.isDraggingOver ? 'bg-blue-50/60' : ''}`}
                      >
                        {dayItems.map((slot, idx) => (
                          <Draggable key={slot.slotId} draggableId={slot.slotId} index={idx}>
                            {(prov, snap) => (
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                className={`rounded-lg p-2 border text-xs group relative transition-shadow ${snap.isDragging ? 'shadow-md' : ''} ${slot.type === 'meal' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}`}
                              >
                                <button
                                  onClick={() => removeSlot(day, slot.slotId)}
                                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <div className="flex items-start gap-1 pr-3">
                                  {slot.type === 'meal'
                                    ? <Utensils className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                                    : <Dumbbell className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                  }
                                  <div className="min-w-0">
                                    <p className="font-semibold text-[#0A1A2F] leading-tight line-clamp-2 text-[10px]">{slot.name || slot.title}</p>
                                    {slot.detail && <p className="text-[9px] text-gray-500 mt-0.5">{slot.detail}</p>}
                                    {slot.type === 'meal' && slot.calories && <p className="text-[9px] text-orange-600 mt-0.5">{slot.calories} cal</p>}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {dayItems.length === 0 && !snapshot.isDraggingOver && (
                          <div className="flex items-center justify-center h-20 text-center">
                            <p className="text-[10px] text-gray-300">Drop here</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}