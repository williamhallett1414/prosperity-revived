import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import WorkoutCard from '@/components/wellness/WorkoutCard';
import { PREMADE_WORKOUTS } from '@/components/wellness/WorkoutLibrary';

export default function PersonalizedWorkouts({ user, userWorkouts = [], onComplete }) {
  if (!user) return null;

  const fitnessLevel = user.fitness_level || 'beginner';
  const healthGoals = user.health_goals || [];

  // Score workouts based on user profile
  const scoredWorkouts = PREMADE_WORKOUTS.map(workout => {
    let score = 0;

    // Match fitness level
    if (workout.difficulty === fitnessLevel) score += 5;
    if (workout.difficulty === 'beginner' && fitnessLevel === 'intermediate') score += 2;

    // Match health goals
    healthGoals.forEach(goal => {
      const goalLower = goal.toLowerCase();
      const workoutLower = `${workout.title} ${workout.description}`.toLowerCase();
      const category = workout.category?.toLowerCase() || '';

      if (goalLower.includes('weight loss') && category.includes('cardio')) score += 3;
      if (goalLower.includes('muscle gain') && category.includes('strength')) score += 3;
      if (goalLower.includes('flexibility') && category.includes('flexibility')) score += 4;
      if (goalLower.includes('stress relief') && category.includes('yoga')) score += 3;
      if (goalLower.includes('energy') && category.includes('full_body')) score += 2;
    });

    // Prefer shorter duration for beginners
    if (fitnessLevel === 'beginner' && workout.duration_minutes <= 20) score += 1;

    return { workout, score };
  });

  // Get top recommendations
  const recommendations = scoredWorkouts
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.workout);

  if (recommendations.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-[#1a1a2e] dark:text-white">
          Recommended For You
        </h3>
      </div>
      <div className="space-y-3">
        {recommendations.map((workout, index) => (
          <motion.div
            key={workout.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <WorkoutCard 
              workout={workout} 
              onComplete={onComplete} 
              index={index}
              isPremade
              user={user}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}