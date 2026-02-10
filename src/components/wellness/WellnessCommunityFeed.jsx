import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function WellnessCommunityFeed({ 
  posts, 
  meditations, 
  recipes, 
  workouts,
  comments 
}) {
  // Aggregate trending content from all sources
  const trendingContent = useMemo(() => {
    const allContent = [];

    // Add posts
    if (posts && posts.length > 0) {
      allContent.push(
        ...posts.map(p => ({
          id: p.id,
          type: 'post',
          title: p.content?.slice(0, 60) || 'Community Post',
          author: p.user_name || 'Anonymous',
          likes: p.likes || 0,
          comments: comments?.filter(c => c.post_id === p.id)?.length || 0,
          engagement: (p.likes || 0) + (comments?.filter(c => c.post_id === p.id)?.length || 0),
          created_date: p.created_date,
          content: p.content,
          link: createPageUrl('Community')
        }))
      );
    }

    // Add recipes
    if (recipes && recipes.length > 0) {
      allContent.push(
        ...recipes.map(r => ({
          id: r.id,
          type: 'recipe',
          title: r.name || 'New Recipe',
          author: r.created_by?.split('@')[0] || 'Anonymous',
          likes: r.likes || 0,
          comments: r.comments || 0,
          engagement: (r.likes || 0) + (r.comments || 0),
          created_date: r.created_date,
          content: r.description,
          link: createPageUrl('DiscoverRecipes')
        }))
      );
    }

    // Add meditations
    if (meditations && meditations.length > 0) {
      allContent.push(
        ...meditations.map(m => ({
          id: m.id,
          type: 'meditation',
          title: m.title || 'New Meditation',
          author: 'Meditation Guide',
          likes: m.likes || 0,
          comments: 0,
          engagement: m.likes || 0,
          created_date: m.created_date,
          content: m.description,
          link: createPageUrl('DiscoverMeditations')
        }))
      );
    }

    // Add workouts
    if (workouts && workouts.length > 0) {
      allContent.push(
        ...workouts.slice(0, 5).map(w => ({
          id: w.id,
          type: 'workout',
          title: w.title || 'New Workout',
          author: w.creator_name || 'Anonymous',
          likes: w.times_copied || 0,
          comments: 0,
          engagement: w.times_copied || 0,
          created_date: w.created_date,
          content: w.description,
          link: createPageUrl('DiscoverWorkouts')
        }))
      );
    }

    // Sort by engagement
    return allContent.sort((a, b) => b.engagement - a.engagement).slice(0, 8);
  }, [posts, recipes, meditations, workouts, comments]);

  const typeColors = {
    post: { bg: 'from-[#D9B878] to-[#D9B878]/50', icon: '💬' },
    recipe: { bg: 'from-[#FD9C2D] to-[#FD9C2D]/50', icon: '🍳' },
    meditation: { bg: 'from-[#AFC7E3] to-[#AFC7E3]/50', icon: '🧘' },
    workout: { bg: 'from-[#0A1A2F] to-[#0A1A2F]/50', icon: '💪' }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-[#D9B878]" />
        <h2 className="text-xl font-bold text-[#0A1A2F]">Trending from Community</h2>
      </div>

      {trendingContent.length === 0 ? (
        <div className="text-center py-8 bg-[#E6EBEF] rounded-xl">
          <p className="text-[#0A1A2F]/60">No trending content yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trendingContent.map((item, index) => {
            const typeInfo = typeColors[item.type];
            return (
              <Link key={item.id} to={item.link}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className={`bg-gradient-to-br ${typeInfo.bg} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-lg`}>
                      {typeInfo.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#0A1A2F] line-clamp-1">{item.title}</h3>
                          <p className="text-xs text-[#0A1A2F]/60 mt-1">by {item.author}</p>
                        </div>
                        <span className="text-xs bg-[#E6EBEF] text-[#0A1A2F] px-2 py-1 rounded-full whitespace-nowrap">
                          {item.type}
                        </span>
                      </div>
                      
                      {item.content && (
                        <p className="text-xs text-[#0A1A2F]/70 line-clamp-1 mt-2">{item.content}</p>
                      )}
                      
                      <div className="flex items-center gap-4 mt-3 text-xs text-[#0A1A2F]/60">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {item.likes}
                        </div>
                        {item.comments > 0 && (
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {item.comments}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}