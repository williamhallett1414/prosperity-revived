import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Loader2, ExternalLink, Heart, MessageCircle, BookOpen, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AIDiscoveryFeed({ user, refreshKey }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      const all = await base44.entities.UserProgress.list();
      return all.find(p => p.created_by === user?.email);
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
    queryKey: ['userPosts'],
    queryFn: async () => {
      const all = await base44.entities.Post.list('-created_date', 100);
      return all.filter(p => p.created_by === user?.email);
    },
    enabled: !!user
  });

  const { data: allPosts = [] } = useQuery({
    queryKey: ['allPosts'],
    queryFn: () => base44.entities.Post.list('-created_date', 100)
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: () => base44.entities.StudyGroup.list()
  });

  useEffect(() => {
    generateRecommendations();
  }, [user, userProgress, readingProgress, posts, refreshKey]);

  const generateRecommendations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userInterests = user.spiritual_interests || [];
      const lifeSituation = user.life_situation || [];
      const completedPlans = readingProgress.filter(p => p.completed_date).length;
      const activePlans = readingProgress.filter(p => !p.completed_date).length;
      const postTopics = posts.map(p => p.topic).filter(Boolean);
      
      const prompt = `Analyze this user profile and generate personalized content recommendations:

User Profile:
- Spiritual interests: ${userInterests.join(', ') || 'General spirituality'}
- Life situation: ${lifeSituation.join(', ') || 'Not specified'}
- Reading plans completed: ${completedPlans}
- Active reading plans: ${activePlans}
- Workout level: ${user.fitness_level || 'beginner'}
- Health goals: ${user.health_goals?.join(', ') || 'General wellness'}
- Dietary preferences: ${user.dietary_preferences?.join(', ') || 'None specified'}
- Favorite post topics: ${postTopics.join(', ') || 'General'}
- Total points: ${userProgress?.total_points || 0}
- Badges earned: ${userProgress?.badges?.length || 0}

Generate 8 diverse content recommendations including:
- Inspirational articles or blog topics
- Community posts the user might like
- Reading plans aligned with interests
- Groups to join
- Wellness challenges

Return ONLY a JSON array with this exact structure:
[
  {
    "type": "article|post|plan|group|challenge",
    "title": "string",
    "description": "string (max 100 chars)",
    "reason": "Why this matches user interests (max 80 chars)",
    "category": "string",
    "url": "string (if external) or null",
    "difficulty": "beginner|intermediate|advanced (optional)"
  }
]`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  reason: { type: "string" },
                  category: { type: "string" },
                  url: { type: "string" },
                  difficulty: { type: "string" }
                }
              }
            }
          }
        }
      });

      setRecommendations(result.recommendations || []);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'article': return <ExternalLink className="w-5 h-5" />;
      case 'post': return <MessageCircle className="w-5 h-5" />;
      case 'plan': return <BookOpen className="w-5 h-5" />;
      case 'group': return <Users className="w-5 h-5" />;
      case 'challenge': return <Heart className="w-5 h-5" />;
      default: return <Loader2 className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'article': return 'from-blue-500 to-indigo-500';
      case 'post': return 'from-purple-500 to-pink-500';
      case 'plan': return 'from-amber-500 to-orange-500';
      case 'group': return 'from-green-500 to-emerald-500';
      case 'challenge': return 'from-red-500 to-rose-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`h-2 bg-gradient-to-r ${getTypeColor(rec.type)}`} />
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${getTypeColor(rec.type)} text-white flex-shrink-0`}>
                  {getIcon(rec.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      {rec.type}
                    </span>
                    {rec.difficulty && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                        {rec.difficulty}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-1">
                    {rec.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {rec.description}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 text-xs text-purple-600 dark:text-purple-400 italic">
                      💡 {rec.reason}
                    </div>
                  </div>
                  {rec.url ? (
                    <a
                      href={rec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Learn More
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <Link
                      to={
                        rec.type === 'plan' ? createPageUrl('Plans') :
                        rec.type === 'group' ? createPageUrl('Groups') :
                        rec.type === 'challenge' ? createPageUrl('Achievements') :
                        createPageUrl('Community')
                      }
                      className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Explore
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}