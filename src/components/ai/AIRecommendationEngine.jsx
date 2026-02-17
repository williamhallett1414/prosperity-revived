import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, BookOpen, UtensilsCrossed, Dumbbell, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function AIRecommendationEngine({ user, type = 'general' }) {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: userProgress = [] } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      const all = await base44.entities.UserProgress.list();
      return all.filter(p => p.created_by === user?.email);
    },
    enabled: !!user
  });

  const { data: readingProgress = [] } = useQuery({
    queryKey: ['readingProgress', user?.email],
    queryFn: async () => {
      const all = await base44.entities.ReadingPlanProgress.list();
      return all.filter(p => p.created_by === user?.email);
    },
    enabled: !!user
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['userPosts', user?.email],
    queryFn: async () => {
      const all = await base44.entities.Post.list('-created_date', 100);
      return all.filter(p => p.created_by === user?.email);
    },
    enabled: !!user
  });

  useEffect(() => {
    if (user && !recommendations && !loading) {
      generateRecommendations();
    }
  }, [user]);

  const generateRecommendations = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const userActivitySummary = {
        spiritual_interests: user.spiritual_interests || [],
        life_situations: user.life_situation || [],
        spiritual_goal: user.spiritual_goal || '',
        fitness_level: user.fitness_level || 'beginner',
        health_goals: user.health_goals || [],
        dietary_preferences: user.dietary_preferences || [],
        completed_plans: readingProgress.filter(p => p.completed_date).length,
        active_plans: readingProgress.filter(p => !p.completed_date).length,
        current_streak: userProgress[0]?.current_streak || 0,
        community_posts: userProgress[0]?.community_posts || 0,
        workouts_completed: userProgress[0]?.workouts_completed || 0,
        recent_post_topics: posts.slice(0, 5).map(p => p.topic || p.content.substring(0, 50))
      };

      const prompt = buildPrompt(type, userActivitySummary);

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            recommendations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  type: { type: 'string' },
                  reason: { type: 'string' },
                  action_label: { type: 'string' },
                  priority: { type: 'number' }
                }
              }
            }
          }
        }
      });

      setRecommendations(result.recommendations.sort((a, b) => b.priority - a.priority));
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildPrompt = (type, activity) => {
    const baseContext = `
User Profile:
- Spiritual Interests: ${activity.spiritual_interests.join(', ') || 'Not specified'}
- Life Situations: ${activity.life_situations.join(', ') || 'None'}
- Spiritual Goal: ${activity.spiritual_goal || 'Not set'}
- Fitness Level: ${activity.fitness_level}
- Health Goals: ${activity.health_goals.join(', ') || 'Not specified'}
- Dietary Preferences: ${activity.dietary_preferences.join(', ') || 'No restrictions'}

User Activity:
- Completed Reading Plans: ${activity.completed_plans}
- Active Reading Plans: ${activity.active_plans}
- Current Streak: ${activity.current_streak} days
- Community Posts: ${activity.community_posts}
- Workouts Completed: ${activity.workouts_completed}
- Recent Discussion Topics: ${activity.recent_post_topics.join('; ')}
`;

    switch (type) {
      case 'reading':
        return `${baseContext}

Based on this user's spiritual journey, life situations, and engagement patterns, suggest 3-4 specific reading plan topics or Bible study focuses that would deeply resonate with them right now. Consider their current life situations and spiritual interests.

For each recommendation:
- title: A compelling name for the reading plan
- description: What they'll learn (2 sentences max)
- type: "reading_plan"
- reason: Why this is perfect for them right now (1 sentence)
- action_label: "Start Plan"
- priority: 1-10 score`;

      case 'nutrition':
        return `${baseContext}

Based on this user's health goals, dietary preferences, and fitness level, suggest 3-4 specific recipe ideas or meal approaches that align with their wellness journey.

For each recommendation:
- title: Specific recipe or meal prep idea
- description: What it includes and nutritional benefits (2 sentences max)
- type: "recipe"
- reason: Why this supports their health goals (1 sentence)
- action_label: "View Recipe Ideas"
- priority: 1-10 score`;

      case 'fitness':
        return `${baseContext}

Based on this user's fitness level, health goals, and workout history, suggest 3-4 specific workout programs or exercise focuses that will help them progress.

For each recommendation:
- title: Specific workout program name
- description: What it involves and expected benefits (2 sentences max)
- type: "workout"
- reason: Why this matches their current fitness journey (1 sentence)
- action_label: "Try Workout"
- priority: 1-10 score`;

      case 'community':
        return `${baseContext}

Based on this user's spiritual interests, life situations, and recent community engagement, suggest 3-4 discussion topics or conversation starters they might want to post or engage with in the community.

For each recommendation:
- title: Discussion topic or question
- description: What this conversation could explore (2 sentences max)
- type: "discussion"
- reason: Why this topic is relevant to them (1 sentence)
- action_label: "Start Discussion"
- priority: 1-10 score`;

      default:
        return `${baseContext}

Analyze this user's complete profile and activity. Suggest 4 diverse, actionable next steps across different areas (reading, wellness, community, spiritual practices) that would most impact their journey right now.

For each recommendation:
- title: Clear action or content suggestion
- description: What it offers (2 sentences max)
- type: One of "reading_plan", "recipe", "workout", "discussion", "spiritual_practice"
- reason: Why this matters for them now (1 sentence)
- action_label: Appropriate action text
- priority: 1-10 score`;
    }
  };

  if (!user?.onboarding_completed) return null;
  if (loading) {
    return (
      <div style={{ background: 'var(--color-background)' }} className="rounded-2xl p-6 mb-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-spin" />
          <p className="text-sm" style={{ color: 'var(--color-text)' }}>Discovering personalized recommendations...</p>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) return null;

  const getIcon = (recType) => {
    switch (recType) {
      case 'reading_plan': return BookOpen;
      case 'recipe': return UtensilsCrossed;
      case 'workout': return Dumbbell;
      case 'discussion': return MessageCircle;
      default: return Sparkles;
    }
  };

  const getColor = (recType) => {
    switch (recType) {
      case 'reading_plan': return 'indigo';
      case 'recipe': return 'orange';
      case 'workout': return 'emerald';
      case 'discussion': return 'purple';
      default: return 'purple';
    }
  };

  const getActionUrl = (recType) => {
    switch (recType) {
      case 'reading_plan': return 'Plans';
      case 'recipe': return 'Wellness';
      case 'workout': return 'Wellness';
      case 'discussion': return 'Groups';
      default: return 'Discover';
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
            AI Recommendations
          </h3>
        </div>
        <Button
          onClick={generateRecommendations}
          variant="ghost"
          size="sm"
          className="text-purple-600 dark:text-purple-400"
        >
          Refresh
        </Button>
      </div>

      <div className="space-y-3">
        {recommendations.slice(0, 3).map((rec, index) => {
          const Icon = getIcon(rec.type);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{ background: 'var(--color-background)' }}
              className="rounded-xl p-4 border border-purple-200 dark:border-purple-800 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                    {rec.title}
                  </h4>
                  <p className="text-sm opacity-80 mb-2" style={{ color: 'var(--color-text)' }}>
                    {rec.description}
                  </p>
                  <p className="text-xs opacity-70 italic mb-3" style={{ color: 'var(--color-text)' }}>
                    💡 {rec.reason}
                  </p>
                  <Link to={createPageUrl(getActionUrl(rec.type))}>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-800"
                    >
                      {rec.action_label}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs opacity-60 mt-4 text-center" style={{ color: 'var(--color-text)' }}>
        ✨ Powered by AI • Personalized based on your journey
      </p>
    </div>
  );
}