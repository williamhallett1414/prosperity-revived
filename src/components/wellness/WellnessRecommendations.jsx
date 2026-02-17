import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, Dumbbell, Utensils, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WellnessRecommendations({ user }) {
  const queryClient = useQueryClient();

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      try {
        return await base44.entities.Recipe.list('-created_date', 10);
      } catch {
        return [];
      }
    }
  });

  const { data: workouts = [] } = useQuery({
    queryKey: ['workoutPlans'],
    queryFn: async () => {
      try {
        return await base44.entities.WorkoutPlan.list('-created_date', 10);
      } catch {
        return [];
      }
    }
  });

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      try {
        return await base44.entities.Challenge.list('-created_date', 5);
      } catch {
        return [];
      }
    }
  });

  const recommendedRecipes = recipes.slice(0, 3);
  const recommendedWorkouts = workouts.slice(0, 3);
  const activeWorkoutChallenges = challenges.filter(c => c.category === 'workout').slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Recommended Recipes */}
      {recommendedRecipes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-[#0A1A2F] flex items-center gap-2">
              <Utensils className="w-5 h-5" />
              Recommended Recipes
            </h3>
            <Link to={createPageUrl('DiscoverRecipes')} className="text-sm text-[#D9B878] font-semibold">
              See All
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {recommendedRecipes.map((recipe, idx) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-[#0A1A2F]">{recipe.title}</p>
                <p className="text-xs text-[#0A1A2F]/60 mt-1">
                  {recipe.prep_time_minutes && recipe.cook_time_minutes 
                    ? `${recipe.prep_time_minutes + recipe.cook_time_minutes}m`
                    : `${recipe.calories || 0} cal`}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommended Workouts */}
      {recommendedWorkouts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-[#0A1A2F] flex items-center gap-2">
              <Dumbbell className="w-5 h-5" />
              Recommended Workouts
            </h3>
            <Link to={createPageUrl('Workouts')} className="text-sm text-[#D9B878] font-semibold">
              See All
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {recommendedWorkouts.map((workout, idx) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-[#0A1A2F]">{workout.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-[#0A1A2F]/60">
                    {workout.duration_minutes}m • {workout.difficulty}
                  </p>
                  {workout.likes > 0 && (
                    <span className="text-xs text-[#D9B878] font-semibold">{workout.likes} likes</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Nutrition Guides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-[#0A1A2F] flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Nutrition Guidance
          </h3>
          <Link to={createPageUrl('Nutrition')} className="text-sm text-[#D9B878] font-semibold">
            Learn
          </Link>
        </div>
        <div className="bg-gradient-to-br from-[#D9B878]/20 to-[#AFC7E3]/20 rounded-xl p-4 border border-[#D9B878]/30">
          <p className="text-[#0A1A2F] text-sm leading-relaxed">
            Track your daily nutrition, log meals, and get personalized recommendations to support your wellness goals.
          </p>
        </div>
      </motion.div>

      {/* Workout Challenges */}
      {activeWorkoutChallenges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-[#0A1A2F] flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Workout Challenges
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {activeWorkoutChallenges.map((challenge, idx) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-[#0A1A2F]">{challenge.title}</p>
                <p className="text-xs text-[#0A1A2F]/60 mt-2">{challenge.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}