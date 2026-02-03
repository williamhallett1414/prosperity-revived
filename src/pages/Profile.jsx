import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, BookOpen, CheckCircle, TrendingUp, Calendar, Edit2, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { readingPlans } from '@/components/bible/BibleData';
import ReadingPlanCard from '@/components/home/ReadingPlanCard';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editingStatus, setEditingStatus] = useState(false);
  const [status, setStatus] = useState('');

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: progress = [] } = useQuery({
    queryKey: ['planProgress'],
    queryFn: () => base44.entities.ReadingPlanProgress.list()
  });

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => base44.entities.Bookmark.list()
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['myPosts'],
    queryFn: async () => {
      const allPosts = await base44.entities.Post.list();
      return allPosts.filter(p => p.created_by === user?.email);
    },
    enabled: !!user
  });

  const { data: friends = [] } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const all = await base44.entities.Friend.list();
      return all.filter(f => 
        (f.user_email === user?.email || f.friend_email === user?.email) && f.status === 'accepted'
      );
    },
    enabled: !!user
  });

  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pendingRequests'],
    queryFn: async () => {
      const all = await base44.entities.Friend.list();
      return all.filter(f => f.friend_email === user?.email && f.status === 'pending');
    },
    enabled: !!user
  });

  const updateUser = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      base44.auth.me().then(setUser);
      setEditingStatus(false);
    }
  });

  const activePlans = progress.filter(p => !p.completed_date);
  const completedPlans = progress.filter(p => p.completed_date);
  
  const totalDaysRead = progress.reduce((sum, p) => sum + (p.completed_days?.length || 0), 0);
  const longestStreak = Math.max(...progress.map(p => p.longest_streak || 0), 0);

  const handleStatusUpdate = () => {
    updateUser.mutate({ status_message: status });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#c9a227] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4a] text-white px-4 pt-4 pb-24">
        <Link
          to={createPageUrl('Home')}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#c9a227] to-[#8fa68a] flex items-center justify-center text-3xl font-bold">
              {user.full_name?.charAt(0) || user.email.charAt(0)}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4 text-[#1a1a2e]" />
            </button>
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.full_name || 'User'}</h1>
            <p className="text-white/70 text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-16 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 shadow-lg"
          >
            <BookOpen className="w-6 h-6 text-[#c9a227] mb-2" />
            <p className="text-2xl font-bold text-[#1a1a2e]">{totalDaysRead}</p>
            <p className="text-xs text-gray-500">Days Read</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-lg"
          >
            <TrendingUp className="w-6 h-6 text-[#8fa68a] mb-2" />
            <p className="text-2xl font-bold text-[#1a1a2e]">{longestStreak}</p>
            <p className="text-xs text-gray-500">Longest Streak</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 shadow-lg"
          >
            <CheckCircle className="w-6 h-6 text-[#c9a227] mb-2" />
            <p className="text-2xl font-bold text-[#1a1a2e]">{bookmarks.length}</p>
            <p className="text-xs text-gray-500">Saved Verses</p>
          </motion.div>
        </div>
      </div>

      {/* Friends Quick Actions */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Link to={createPageUrl('Friends')}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative"
            >
              <Users className="w-5 h-5 text-[#c9a227] mb-2" />
              <p className="text-sm text-gray-600">Friends</p>
              <p className="text-2xl font-bold text-[#1a1a2e]">{friends.length}</p>
              {pendingRequests.length > 0 && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {pendingRequests.length}
                </div>
              )}
            </motion.div>
          </Link>

          <Link to={createPageUrl('Friends')}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <MessageCircle className="w-5 h-5 text-[#8fa68a] mb-2" />
              <p className="text-sm text-gray-600">Messages</p>
              <p className="text-lg font-semibold text-[#1a1a2e]">Connect</p>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Status Update */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#1a1a2e]">Status</h3>
            {!editingStatus && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingStatus(true);
                  setStatus(user.status_message || '');
                }}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {editingStatus ? (
            <div className="space-y-3">
              <Textarea
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Share what you're learning..."
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleStatusUpdate}
                  className="bg-[#1a1a2e] hover:bg-[#2d2d4a]"
                  disabled={updateUser.isPending}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingStatus(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 italic">
              {user.status_message || 'No status yet. Share what you\'re learning!'}
            </p>
          )}
        </div>
      </div>

      {/* Current Plans */}
      {activePlans.length > 0 && (
        <div className="px-4 mb-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Current Plans</h2>
          <div className="space-y-3">
            {activePlans.map(p => {
              const plan = p.is_custom 
                ? { id: p.plan_id, name: p.plan_name, duration: p.total_days, description: `${p.total_days} days of custom readings`, category: 'Custom', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400' }
                : readingPlans.find(rp => rp.id === p.plan_id);
              return plan ? <ReadingPlanCard key={p.id} plan={plan} progress={p} /> : null;
            })}
          </div>
        </div>
      )}

      {/* Completed Plans */}
      {completedPlans.length > 0 && (
        <div className="px-4 mb-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-[#8fa68a]" />
            Completed Plans ({completedPlans.length})
          </h2>
          <div className="space-y-3">
            {completedPlans.map(p => {
              const plan = p.is_custom 
                ? { id: p.plan_id, name: p.plan_name, duration: p.total_days, description: `${p.total_days} days of custom readings`, category: 'Custom', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400' }
                : readingPlans.find(rp => rp.id === p.plan_id);
              return plan ? (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-[#8fa68a]"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-[#8fa68a]" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1a1a2e]">{plan.name}</h3>
                      <p className="text-sm text-gray-500">
                        Completed {new Date(p.completed_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#8fa68a]">100%</p>
                    </div>
                  </div>
                </motion.div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Activity Summary */}
      <div className="px-4 mb-6">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Activity</h2>
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Community Posts</span>
            <span className="font-semibold text-[#1a1a2e]">{posts.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Active Plans</span>
            <span className="font-semibold text-[#1a1a2e]">{activePlans.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Plans Completed</span>
            <span className="font-semibold text-[#8fa68a]">{completedPlans.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}