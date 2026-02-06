import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Search, Heart, TrendingUp, Copy, Check, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import WorkoutCard from './WorkoutCard';
import { PREMADE_WORKOUTS } from './WorkoutLibrary';
import PersonalizedWorkouts from '@/components/recommendations/PersonalizedWorkouts';

export default function DiscoverWorkouts({ user, myWorkouts, completeWorkout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const queryClient = useQueryClient();

  const { data: sharedWorkouts = [] } = useQuery({
    queryKey: ['sharedWorkouts'],
    queryFn: async () => {
      const all = await base44.entities.WorkoutPlan.list('-created_date', 50);
      return all.filter(w => w.is_shared && w.created_by !== user?.email);
    },
    enabled: !!user
  });

  const copyWorkout = useMutation({
    mutationFn: async (workout) => {
      const workoutCopy = {
        title: `${workout.title} (Copy)`,
        description: workout.description,
        difficulty: workout.difficulty,
        duration_minutes: workout.duration_minutes,
        exercises: workout.exercises,
        category: workout.category,
        completed_dates: []
      };
      
      await base44.entities.WorkoutPlan.create(workoutCopy);
      
      // Increment times_copied
      if (workout.id) {
        await base44.entities.WorkoutPlan.update(workout.id, {
          times_copied: (workout.times_copied || 0) + 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['workouts']);
      queryClient.invalidateQueries(['sharedWorkouts']);
      toast.success('Workout added to your library!');
    }
  });

  const filteredWorkouts = sharedWorkouts.filter(w => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      w.title?.toLowerCase().includes(search) ||
      w.description?.toLowerCase().includes(search) ||
      w.category?.toLowerCase().includes(search)
    );
  });

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

  // Filter premade workouts by search
  const filteredPremade = PREMADE_WORKOUTS.filter(w => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      w.title?.toLowerCase().includes(search) ||
      w.description?.toLowerCase().includes(search) ||
      w.category?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Discover Workouts</h3>
        </div>
        <p className="text-white/90 text-sm">Find workouts shared by the community and our library</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search workouts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {!searchQuery && (
        <div className="space-y-4">
          {/* Recommended For You */}
          <PersonalizedWorkouts 
            user={user} 
            userWorkouts={myWorkouts}
            onComplete={(workout) => completeWorkout.mutate({ id: workout.id, workout })}
          />

          {/* Pre-Made Workouts */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Pre-Made Workouts</h3>
            <div className="space-y-3">
              {PREMADE_WORKOUTS.slice(0, 5).map((workout, index) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onComplete={() => {}}
                  index={index}
                  isPremade
                  user={user}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {searchQuery && filteredPremade.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Pre-Made Workouts ({filteredPremade.length})
          </h3>
          <div className="space-y-3 mb-6">
            {filteredPremade.map((workout, index) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onComplete={() => {}}
                index={index}
                isPremade
                user={user}
              />
            ))}
          </div>
        </div>
      )}

      {searchQuery && filteredWorkouts.length === 0 && filteredPremade.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#2d2d4a] rounded-2xl">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            No workouts match your search
          </p>
        </div>
      ) : searchQuery && filteredWorkouts.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Community Workouts ({filteredWorkouts.length})
          </h3>
          <div className="space-y-3">
          {filteredWorkouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{categoryEmojis[workout.category]}</span>
                    <h3 className="font-semibold text-[#1a1a2e] dark:text-white">
                      {workout.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {workout.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    by {workout.creator_name || 'Anonymous'}
                  </p>
                </div>
                <Badge className={difficultyColors[workout.difficulty]}>
                  {workout.difficulty}
                </Badge>
              </div>

              <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                <span>{workout.duration_minutes} min</span>
                <span>•</span>
                <span>{workout.exercises?.length || 0} exercises</span>
                {workout.times_copied > 0 && (
                  <>
                    <span>•</span>
                    <span>{workout.times_copied} copies</span>
                  </>
                )}
              </div>

              {workout.exercises && workout.exercises.length > 0 && (
                <div className="mb-3 text-sm">
                  <p className="text-gray-500 dark:text-gray-400 mb-1 font-medium">Preview:</p>
                  <div className="space-y-1">
                    {workout.exercises.slice(0, 3).map((ex, i) => (
                      <div key={i} className="text-gray-700 dark:text-gray-300">
                        • {ex.name} {ex.sets && ex.reps && `- ${ex.sets}x${ex.reps}`}
                      </div>
                    ))}
                    {workout.exercises.length > 3 && (
                      <p className="text-gray-500 dark:text-gray-400">
                        +{workout.exercises.length - 3} more exercises
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Button
                onClick={() => {
                  copyWorkout.mutate(workout);
                  setCopiedId(workout.id);
                  setTimeout(() => setCopiedId(null), 2000);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={copyWorkout.isPending && copiedId === workout.id}
              >
                {copiedId === workout.id ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Added!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Add to My Workouts
                  </>
                )}
              </Button>
            </motion.div>
          ))}
          </div>
        </div>
      ) : !searchQuery && filteredWorkouts.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Community Workouts</h3>
          <div className="space-y-3">
            {filteredWorkouts.slice(0, 5).map((workout, index) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{categoryEmojis[workout.category]}</span>
                      <h3 className="font-semibold text-[#1a1a2e] dark:text-white">
                        {workout.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {workout.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      by {workout.creator_name || 'Anonymous'}
                    </p>
                  </div>
                  <Badge className={difficultyColors[workout.difficulty]}>
                    {workout.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                  <span>{workout.duration_minutes} min</span>
                  <span>•</span>
                  <span>{workout.exercises?.length || 0} exercises</span>
                  {workout.times_copied > 0 && (
                    <>
                      <span>•</span>
                      <span>{workout.times_copied} copies</span>
                    </>
                  )}
                </div>

                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="mb-3 text-sm">
                    <p className="text-gray-500 dark:text-gray-400 mb-1 font-medium">Preview:</p>
                    <div className="space-y-1">
                      {workout.exercises.slice(0, 3).map((ex, i) => (
                        <div key={i} className="text-gray-700 dark:text-gray-300">
                          • {ex.name} {ex.sets && ex.reps && `- ${ex.sets}x${ex.reps}`}
                        </div>
                      ))}
                      {workout.exercises.length > 3 && (
                        <p className="text-gray-500 dark:text-gray-400">
                          +{workout.exercises.length - 3} more exercises
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => {
                    copyWorkout.mutate(workout);
                    setCopiedId(workout.id);
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={copyWorkout.isPending && copiedId === workout.id}
                >
                  {copiedId === workout.id ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Added!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Add to My Workouts
                    </>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}