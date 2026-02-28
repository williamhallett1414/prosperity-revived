import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { TrendingUp, Heart, MessageCircle, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function TrendingContent({ user }) {
  const { data: posts = [] } = useQuery({
    queryKey: ['allPosts'],
    queryFn: () => base44.entities.Post.list('-created_date', 100)
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments'],
    queryFn: () => base44.entities.Comment.list()
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: () => base44.entities.StudyGroup.list()
  });

  // Calculate trending scores
  const trendingPosts = posts
    .map(post => {
      const postComments = comments.filter(c => c.post_id === post.id);
      const engagementScore = (post.likes || 0) * 2 + postComments.length * 3;
      const recencyScore = (Date.now() - new Date(post.created_date).getTime()) / (1000 * 60 * 60);
      const trendingScore = engagementScore / Math.max(1, recencyScore / 24);
      
      return { ...post, trendingScore, commentCount: postComments.length };
    })
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, 10);

  const trendingGroups = groups
    .sort((a, b) => (b.member_count || 0) - (a.member_count || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Trending Posts */}
      <div>
        <h2 className="text-lg font-semibold text-[#1a1a2e] dark:text-white mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          Trending Posts
        </h2>
        <div className="space-y-3">
          {trendingPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={createPageUrl('Community')}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl font-bold text-orange-500">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1a1a2e] dark:text-white mb-2 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.likes || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post.commentCount}
                        </span>
                        <span className="text-gray-400">
                          by {post.user_name || 'Anonymous'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Active Groups */}
      <div>
        <h2 className="text-lg font-semibold text-[#1a1a2e] dark:text-white mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#AFC7E3]" />
          Most Active Groups
        </h2>
        <div className="space-y-3">
          {trendingGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={createPageUrl(`GroupDetail?id=${group.id}`)}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                      {group.cover_image ? (
                        <img 
                          src={group.cover_image} 
                          alt={group.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          👥
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1a1a2e] dark:text-white">
                        {group.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {group.member_count || 0} members
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}