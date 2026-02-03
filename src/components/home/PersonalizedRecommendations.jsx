import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PersonalizedRecommendations({ 
  progress = [], 
  posts = [], 
  groups = [], 
  memberships = [],
  allGroups = []
}) {
  const recommendations = [];

  // Recommend plans based on completed ones
  if (progress.length > 0) {
    const completedPlans = progress.filter(p => p.completed_date);
    const activeCategories = new Set(
      completedPlans
        .map(p => p.plan_name)
        .map(name => {
          if (name.includes('Gospel')) return 'Gospels';
          if (name.includes('Testament')) return 'Testament';
          if (name.includes('Prayer')) return 'Prayer';
          return 'General';
        })
    );

    if (completedPlans.length > 0) {
      recommendations.push({
        type: 'plan',
        title: 'Continue Your Journey',
        description: `You've completed ${completedPlans.length} plan${completedPlans.length > 1 ? 's' : ''}! Ready for more?`,
        icon: BookOpen,
        color: 'text-[#c9a227]',
        link: 'Plans'
      });
    }
  }

  // Recommend groups based on activity
  if (posts.length > 3 && memberships.length < 3) {
    recommendations.push({
      type: 'group',
      title: 'Join a Study Group',
      description: "You're active in the community! Connect with like-minded believers",
      icon: Users,
      color: 'text-[#8fa68a]',
      link: 'Groups'
    });
  }

  // Recommend community if not active
  if (posts.length === 0 && progress.length > 0) {
    recommendations.push({
      type: 'community',
      title: 'Share Your Journey',
      description: 'Share insights from your reading with the community',
      icon: Sparkles,
      color: 'text-[#c9a227]',
      link: 'Community'
    });
  }

  // Recommend spiritual growth tools
  if (progress.length > 0 || posts.length > 0) {
    recommendations.push({
      type: 'spiritual',
      title: 'Track Your Growth',
      description: 'Use our prayer journal and goal-setting tools',
      icon: TrendingUp,
      color: 'text-[#8fa68a]',
      link: 'SpiritualGrowth'
    });
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-[#c9a227]" />
        For You
      </h2>
      
      <div className="space-y-3">
        {recommendations.slice(0, 2).map((rec, index) => {
          const Icon = rec.icon;
          return (
            <Link key={index} to={createPageUrl(rec.link)}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-white to-[#faf8f5] dark:from-[#2d2d4a] dark:to-[#1a1a2e] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full bg-[#faf8f5] dark:bg-[#1a1a2e] flex items-center justify-center ${rec.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-1">{rec.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{rec.description}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}