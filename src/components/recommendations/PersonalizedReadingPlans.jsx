import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import { readingPlans } from '@/components/bible/BibleData';
import ReadingPlanCard from '@/components/home/ReadingPlanCard';

export default function PersonalizedReadingPlans({ user, userProgress = [] }) {
  if (!user) return null;

  // Get user's interests and situations
  const interests = user.spiritual_interests || [];
  const situations = user.life_situation || [];
  
  // Score each plan based on user profile
  const scoredPlans = readingPlans.map(plan => {
    let score = 0;
    const planLower = `${plan.name} ${plan.description} ${plan.category}`.toLowerCase();
    
    // Match spiritual interests
    interests.forEach(interest => {
      if (planLower.includes(interest.toLowerCase())) score += 3;
    });
    
    // Match life situations
    situations.forEach(situation => {
      if (planLower.includes(situation.toLowerCase())) score += 5;
    });
    
    // Boost shorter plans for beginners
    if (plan.duration <= 14) score += 1;
    
    return { plan, score };
  });

  // Sort by score and get top recommendation
  const recommendations = scoredPlans
    .sort((a, b) => b.score - a.score)
    .slice(0, 1)
    .map(s => s.plan);

  // Get ongoing plans
  const activePlanIds = userProgress
    .filter(p => !p.completed_date)
    .map(p => p.plan_id);

  // Filter out already active plans
  const filteredRecommendations = recommendations.filter(
    plan => !activePlanIds.includes(plan.id)
  );

  if (filteredRecommendations.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-[#c9a227]" />
        <h3 className="text-lg font-semibold text-[#1a1a2e] dark:text-white">
          Recommended Plan
        </h3>
      </div>
      <div className="space-y-3">
        {filteredRecommendations.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ReadingPlanCard plan={plan} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}