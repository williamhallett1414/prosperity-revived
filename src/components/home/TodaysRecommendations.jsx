import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Dumbbell, Apple, Heart, Droplets, Brain, Zap, Activity } from 'lucide-react';

export default function TodaysRecommendations({ user, mealLogs, workoutSessions, waterLogs, meditationSessions }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!user) return;
    
    const signupAnswers = user.signup_answers || {};
    const healthGoals = signupAnswers.health_goals || [];
    const fitnessLevel = signupAnswers.fitness_level || 'intermediate';
    const nutritionPrefs = signupAnswers.nutrition_preferences || [];
    const stressLevel = signupAnswers.stress_level || 'moderate';
    const spiritualGoals = signupAnswers.spiritual_goals || [];
    const timeAvailable = signupAnswers.time_availability || 'moderate';

    // Get today's activity
    const today = new Date().toISOString().split('T')[0];
    const todayMeals = mealLogs.filter(m => m.date === today) || [];
    const todayWorkouts = workoutSessions.filter(w => w.date === today) || [];
    const todayMeditations = meditationSessions.filter(m => m.date === today) || [];
    const todayWater = waterLogs.filter(w => w.date === today).reduce((sum, w) => sum + (w.glasses || 0), 0) || 0;

    const recs = [];

    // HEALTH RECOMMENDATIONS
    if (healthGoals.includes('weight_loss') || healthGoals.includes('wellness')) {
      if (todayWater < 8) {
        recs.push({
          category: 'health',
          icon: '💧',
          title: 'Hydration Check-in',
          description: `You've had ${todayWater} glasses of water. Aim for 8+ glasses today.`,
          action: () => window.location.href = createPageUrl('Wellness?tab=nutrition'),
          color: 'from-blue-50 to-cyan-50'
        });
      }
    }

    if (healthGoals.includes('sleep') || stressLevel === 'high') {
      recs.push({
        category: 'health',
        icon: '😴',
        title: 'Sleep Optimization',
        description: 'Getting 7-9 hours of quality sleep improves recovery and mood.',
        action: () => window.location.href = createPageUrl('Wellness?tab=mind'),
        color: 'from-purple-50 to-pink-50'
      });
    }

    if (stressLevel === 'high' || stressLevel === 'moderate') {
      recs.push({
        category: 'health',
        icon: '🧘',
        title: 'Stress Relief Session',
        description: 'Try a 5-10 minute meditation to reduce stress and improve focus.',
        action: () => window.location.href = createPageUrl('Wellness?tab=mind'),
        color: 'from-green-50 to-emerald-50'
      });
    }

    // FITNESS RECOMMENDATIONS
    if (todayWorkouts.length === 0 && (healthGoals.includes('fitness') || healthGoals.includes('strength'))) {
      const workoutSuggestion = fitnessLevel === 'beginner' ? '20-minute beginner routine' : 
                               fitnessLevel === 'intermediate' ? '30-minute full body workout' : 
                               '45-minute advanced strength session';
      recs.push({
        category: 'fitness',
        icon: '💪',
        title: 'Today\'s Workout',
        description: `${workoutSuggestion} to keep your momentum going.`,
        action: () => window.location.href = createPageUrl('Wellness?tab=workouts'),
        color: 'from-orange-50 to-red-50'
      });
    }

    if (todayWorkouts.length > 0 && healthGoals.includes('flexibility')) {
      recs.push({
        category: 'fitness',
        icon: '🤸',
        title: 'Recovery & Stretching',
        description: 'Follow up your workout with 10 minutes of stretching to improve flexibility.',
        action: () => window.location.href = createPageUrl('Wellness?tab=workouts'),
        color: 'from-yellow-50 to-orange-50'
      });
    }

    if (fitnessLevel === 'beginner') {
      recs.push({
        category: 'fitness',
        icon: '🚶',
        title: 'Daily Movement Goal',
        description: 'Aim for 7,000-10,000 steps today to build endurance gradually.',
        action: () => window.location.href = createPageUrl('Wellness?tab=workouts'),
        color: 'from-teal-50 to-cyan-50'
      });
    }

    // NUTRITION RECOMMENDATIONS
    if (todayMeals.length === 0) {
      recs.push({
        category: 'nutrition',
        icon: '🍎',
        title: 'Breakfast Suggestion',
        description: 'Start your day with a protein-rich breakfast to boost energy and metabolism.',
        action: () => window.location.href = createPageUrl('Wellness?tab=nutrition'),
        color: 'from-amber-50 to-orange-50'
      });
    }

    if (healthGoals.includes('weight_loss')) {
      const mealGoal = nutritionPrefs.includes('vegan') ? 'Plant-based balanced meal' :
                       nutritionPrefs.includes('low_carb') ? 'Low-carb, high-protein option' :
                       'Balanced macro meal';
      recs.push({
        category: 'nutrition',
        icon: '🥗',
        title: 'Lunch Recommendation',
        description: `Try a ${mealGoal} focused on your health goals.`,
        action: () => window.location.href = createPageUrl('DiscoverRecipes'),
        color: 'from-green-50 to-lime-50'
      });
    }

    if (nutritionPrefs.includes('macro_tracking')) {
      recs.push({
        category: 'nutrition',
        icon: '📊',
        title: 'Macro Balance Check',
        description: 'Review today\'s nutrition to ensure balanced carbs, protein, and healthy fats.',
        action: () => window.location.href = createPageUrl('Wellness?tab=nutrition'),
        color: 'from-indigo-50 to-blue-50'
      });
    }

    // Shuffle and limit to 5 recommendations
    const shuffled = recs.sort(() => Math.random() - 0.5);
    setRecommendations(shuffled.slice(0, 5));
  }, [user, mealLogs, workoutSessions, waterLogs, meditationSessions]);

  if (!recommendations.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#3C4E53] mb-4 px-4">Today's Recommendations</h2>
      <div className="space-y-3 px-4">
        {recommendations.map((rec, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={rec.action}
            className={`w-full text-left bg-gradient-to-r ${rec.color} rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100/50`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-1">{rec.icon}</span>
              <div className="flex-1">
                <p className="font-bold text-[#3C4E53] text-sm">{rec.title}</p>
                <p className="text-[#3C4E53]/70 text-xs mt-1">{rec.description}</p>
              </div>
              <Zap className="w-4 h-4 text-[#FD9C2D] mt-1 flex-shrink-0" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}