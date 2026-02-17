import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { UtensilsCrossed, Dumbbell, Heart, Trophy, Target } from 'lucide-react';
import MealSuggestions from '@/components/nutrition/MealSuggestions';
import TrendingNutritionArticles from '@/components/nutrition/TrendingNutritionArticles';
import WorkoutCard from '@/components/wellness/WorkoutCard';
import { PREMADE_WORKOUTS } from '@/components/wellness/WorkoutLibrary';

export default function WellnessRecommendations({ user }) {
  const navigate = useNavigate();

  const { data: mealLogs = [] } = useQuery({
    queryKey: ['mealLogs'],
    queryFn: () => base44.entities.MealLog.list('-date', 100),
    initialData: [],
    enabled: !!user
  });

  const { data: workouts = [] } = useQuery({
    queryKey: ['workoutPlans'],
    queryFn: () => base44.entities.WorkoutPlan.list('-created_date'),
    initialData: []
  });

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      try {
        return await base44.entities.Challenge.filter({});
      } catch (error) {
        return [];
      }
    },
    retry: false
  });

  const { data: challengeParticipants = [] } = useQuery({
    queryKey: ['challengeParticipants'],
    queryFn: async () => {
      try {
        return await base44.entities.ChallengeParticipant.filter({ user_email: user?.email });
      } catch (error) {
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

  const myWorkouts = workouts.filter(w => w.created_by === user?.email);
  const allWorkouts = [...PREMADE_WORKOUTS, ...myWorkouts];

  return (
    <div className="space-y-8">
      {/* Suggested Meals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <MealSuggestions />
      </motion.div>

      {/* Trending Nutrition Articles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TrendingNutritionArticles />
      </motion.div>

      {/* Discover Recipes Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link to={createPageUrl('DiscoverRecipes')}>
          <div className="bg-gradient-to-br from-[#D9B878] to-[#AFC7E3] rounded-2xl p-5 text-[#0A1A2F] cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <UtensilsCrossed className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Discover Recipes</h3>
            </div>
            <p className="text-[#0A1A2F]/70 text-sm">Browse and create delicious recipes</p>
          </div>
        </Link>
      </motion.div>

      {/* New Workouts to Try */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-bold text-[#0A1A2F] mb-3">New Workouts to Try</h3>
        <div className="space-y-3">
          {PREMADE_WORKOUTS.slice(0, 3).map((workout, index) => (
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
      </motion.div>

      {/* Workout Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-bold text-[#0A1A2F] mb-3">Workout Challenges</h3>
        <div className="grid grid-cols-2 gap-3">
          {challenges.slice(0, 4).map((challenge, index) => {
            const userParticipation = challengeParticipants.find(p => p.challenge_id === challenge.id);
            const isParticipating = !!userParticipation;
            const progress = userParticipation?.progress || 0;

            const iconColors = [
              { bg: 'bg-yellow-100', icon: 'text-yellow-600', Icon: Trophy },
              { bg: 'bg-red-100', icon: 'text-red-600', Icon: Dumbbell },
              { bg: 'bg-blue-100', icon: 'text-blue-600', Icon: Heart },
              { bg: 'bg-purple-100', icon: 'text-purple-600', Icon: Target }
            ];
            const colorSet = iconColors[index % iconColors.length];
            const Icon = colorSet.Icon;

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate(createPageUrl(`ChallengeDetailPage?id=${challenge.id}`))}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className={`w-10 h-10 ${colorSet.bg} rounded-full flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${colorSet.icon}`} />
                  </div>
                  <div className="w-full">
                    <h4 className="font-bold text-[#0A1A2F] text-xs mb-1 line-clamp-2">{challenge.title}</h4>
                    <p className="text-[10px] text-[#0A1A2F]/60 mb-2">{challenge.duration_days} Days</p>
                    {isParticipating ? (
                      <div className="w-full">
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#D9B878] rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-[10px] text-[#0A1A2F]/60 mt-1">{progress}%</p>
                      </div>
                    ) : (
                      <div className="text-[10px] text-emerald-600 font-semibold">
                        Join Now
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}