import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ThumbsUp, MessageCircle, Eye } from 'lucide-react';
import WorkoutCard from './WorkoutCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CommunityWorkoutFeed({ user, onComplete }) {
  const [filter, setFilter] = useState('recent');

  const { data: communityWorkouts = [], isLoading } = useQuery({
    queryKey: ['communityWorkouts', filter],
    queryFn: async () => {
      const all = await base44.entities.WorkoutPlan.list('-created_date', 50);
      const shared = all.filter(w => w.is_shared);
      
      if (filter === 'popular') {
        return shared.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      } else if (filter === 'trending') {
        return shared.sort((a, b) => (b.times_copied || 0) - (a.times_copied || 0));
      }
      return shared;
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-[#AFC7E3] to-[#0A1A2F] rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Community Workouts</h3>
        </div>
        <p className="text-white/90 text-sm">
          Discover and share workout routines with the community
        </p>
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">
            Recent
          </TabsTrigger>
          <TabsTrigger value="popular">
            <ThumbsUp className="w-4 h-4 mr-1" />
            Popular
          </TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="w-4 h-4 mr-1" />
            Trending
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-3 mt-4">
          {communityWorkouts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#2d2d4a] rounded-2xl">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No community workouts yet. Be the first to share!
              </p>
            </div>
          ) : (
            communityWorkouts.map((workout, index) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <WorkoutCard
                  workout={workout}
                  onComplete={() => onComplete(workout)}
                  index={index}
                  user={user}
                  showCommunityStats
                />
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}