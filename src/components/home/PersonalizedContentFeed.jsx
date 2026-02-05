import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Heart, Users, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PersonalizedContentFeed({ user, userProgress, existingPosts = [] }) {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: allPosts = [] } = useQuery({
    queryKey: ['allPostsForFeed'],
    queryFn: () => base44.entities.Post.list('-created_date', 100)
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ['allUsersForFeed'],
    queryFn: () => base44.entities.User.list()
  });

  const { data: allReadingPlans = [] } = useQuery({
    queryKey: ['allReadingPlansForFeed'],
    queryFn: () => base44.entities.ReadingPlanProgress.list()
  });

  const { data: userActivity = [] } = useQuery({
    queryKey: ['userActivity', user?.email],
    queryFn: async () => {
      const [posts, comments, friends, selfCare] = await Promise.all([
        base44.entities.Post.list('-created_date', 50),
        base44.entities.Comment.list('-created_date', 100),
        base44.entities.Friend.list(),
        base44.entities.SelfCareActivity.list('-date', 50)
      ]);
      return { posts, comments, friends, selfCare };
    },
    enabled: !!user
  });

  useEffect(() => {
    const generateRecommendations = async () => {
      if (!user || !userActivity) return;

      try {
        setLoading(true);
        
        // Build user context
        const userPosts = (userActivity.posts || []).filter(p => p && p.created_by === user.email).length;
        const userComments = (userActivity.comments || []).filter(c => c && c.created_by === user.email).length;
        const userFriends = (userActivity.friends || []).filter(f => 
          f && (f.user_email === user.email || f.friend_email === user.email) && f.status === 'accepted'
        ).length;
        const recentActivities = (userActivity.selfCare || []).filter(a => 
          a && a.created_by === user.email
        ).map(a => a.activity_type).slice(0, 5);

        // Get top posts by engagement
        const topPosts = (allPosts || [])
          .filter(p => p && p.content)
          .sort((a, b) => (b.likes || 0) - (a.likes || 0))
          .slice(0, 10);

        // Get engaging users (by post activity)
        const userPostCounts = new Map();
        (allPosts || []).forEach(post => {
          if (post && post.created_by) {
            userPostCounts.set(post.created_by, (userPostCounts.get(post.created_by) || 0) + 1);
          }
        });
        const topUsers = Array.from(userPostCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([email]) => (allUsers || []).find(u => u && u.email === email))
          .filter(Boolean);

        // Build prompt for AI
        const prompt = `Based on this user's profile and activity, recommend relevant content to boost engagement:

USER PROFILE:
- Name: ${user.full_name}
- Level: ${userProgress?.level || 1}
- Points: ${userProgress?.total_points || 0}
- Posts Created: ${userPosts}
- Comments Made: ${userComments}
- Friends: ${userFriends}
- Recent Activities: ${recentActivities.join(', ') || 'None yet'}

AVAILABLE POSTS (Sample):
${topPosts.slice(0, 5).map(p => `- "${p.content?.substring(0, 50)}..." by ${p.user_name} (${p.likes || 0} likes)`).join('\n')}

TRENDING USERS:
${topUsers.slice(0, 3).map(u => `- ${u.full_name} (${u.email})`).join('\n')}

Please recommend 3-4 highly personalized recommendations that would interest this user. Focus on:
1. Posts from similar-interest users they don't follow yet
2. Users with complementary activity patterns
3. Reading plans aligned with their engagement history

Return as JSON array with objects containing: type (post/user/plan), title, description, reason, and engagement_score (0-100).`;

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
                    type: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    reason: { type: 'string' },
                    engagement_score: { type: 'number' }
                  }
                }
              }
            }
          }
        });

        setRecommendations(result.recommendations || []);
      } catch (error) {
        console.error('Error generating recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    generateRecommendations();
  }, [user, userActivity, userProgress, allPosts, allUsers]);

  if (loading) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#FD9C2D]" />
          <h2 className="text-lg font-semibold text-[#1a1a2e] dark:text-white">For You</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-[#FD9C2D] animate-spin" />
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-[#FD9C2D]" />
        <h2 className="text-lg font-semibold text-[#1a1a2e] dark:text-white">Recommended For You</h2>
      </div>

      <div className="space-y-3">
        {recommendations.slice(0, 4).map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#FD9C2D] to-[#FAD98D]">
                  {rec.type === 'post' && <Heart className="w-5 h-5 text-white" />}
                  {rec.type === 'user' && <Users className="w-5 h-5 text-white" />}
                  {rec.type === 'plan' && <BookOpen className="w-5 h-5 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-[#1a1a2e] dark:text-white text-sm">
                      {rec.title}
                    </h3>
                    <span className="text-xs bg-[#FD9C2D]/20 text-[#FD9C2D] px-2 py-1 rounded-full font-medium">
                      {rec.engagement_score}% match
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {rec.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                    💡 {rec.reason}
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-[#FD9C2D] to-[#FAD98D] hover:from-[#E89020] hover:to-[#F0C847] text-white"
              >
                {rec.type === 'post' && 'View Post'}
                {rec.type === 'user' && 'Visit Profile'}
                {rec.type === 'plan' && 'Start Plan'}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <Link
        to={createPageUrl('Community')}
        className="block mt-4 text-center text-sm font-medium text-[#FD9C2D] hover:underline"
      >
        Discover more content →
      </Link>
    </div>
  );
}