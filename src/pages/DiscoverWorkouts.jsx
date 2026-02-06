import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Copy, Check, Plus, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import WorkoutCard from '@/components/wellness/WorkoutCard';
import { PREMADE_WORKOUTS } from '@/components/wellness/WorkoutLibrary';
import PersonalizedWorkouts from '@/components/recommendations/PersonalizedWorkouts';
import WorkoutDetailModal from '@/components/wellness/WorkoutDetailModal';
import CreateWorkoutModal from '@/components/wellness/CreateWorkoutModal';
import CoachDavid from '@/components/wellness/CoachDavid';

export default function DiscoverWorkoutsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: myWorkouts = [] } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => base44.entities.WorkoutPlan.list('-created_date'),
    enabled: !!user
  });

  const { data: sharedWorkouts = [] } = useQuery({
    queryKey: ['sharedWorkouts'],
    queryFn: async () => {
      const all = await base44.entities.WorkoutPlan.list('-created_date', 50);
      return all.filter(w => w.is_shared && w.created_by !== user?.email);
    },
    enabled: !!user
  });

  const completeWorkout = useMutation({
    mutationFn: async ({ id, workout }) => {
      const completedDates = workout.completed_dates || [];
      const today = new Date().toISOString().split('T')[0];
      
      if (!completedDates.includes(today)) {
        completedDates.push(today);
      }
      
      return base44.entities.WorkoutPlan.update(id, {
        completed_dates: completedDates
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['workouts']);
      toast.success('Workout completed! 🎉');
    }
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

  const filteredPremade = PREMADE_WORKOUTS.filter(w => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1a1a2e] dark:to-[#16213e] p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Link to={createPageUrl('Wellness')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Discover Workouts</h1>
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

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Find Your Perfect Workout</h3>
          </div>
          <p className="text-white/90 text-sm">Browse workouts from the community and our library</p>
        </div>

        <Button
          onClick={() => setShowCreateWorkout(true)}
          className="bg-emerald-600 hover:bg-emerald-700 w-full"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Custom Workout
        </Button>

        {!searchQuery && (
          <div className="space-y-4">
            <PersonalizedWorkouts 
              user={user} 
              userWorkouts={myWorkouts}
              onComplete={(workout) => completeWorkout.mutate({ id: workout.id, workout })}
            />

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
                  onClick={() => setSelectedWorkout(workout)}
                  className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
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
                    onClick={(e) => {
                      e.stopPropagation();
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
                  onClick={() => setSelectedWorkout(workout)}
                  className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
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
                    onClick={(e) => {
                      e.stopPropagation();
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

        {selectedWorkout && (
          <WorkoutDetailModal
            workout={selectedWorkout}
            open={!!selectedWorkout}
            onOpenChange={(open) => !open && setSelectedWorkout(null)}
            user={user}
          />
        )}

        {showCreateWorkout && (
          <CreateWorkoutModal
            open={showCreateWorkout}
            onOpenChange={setShowCreateWorkout}
            user={user}
          />
        )}
      </div>

      {/* Coach David Chatbot */}
      <CoachDavid 
        user={user} 
        userWorkouts={myWorkouts}
        workoutSessions={[]}
      />
    </div>
  );
}