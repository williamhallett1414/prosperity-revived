import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PostCard from '@/components/community/PostCard';

export default function UserProfile() {
  const params = new URLSearchParams(window.location.search);
  const userEmail = params.get('email');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => {});
  }, []);

  const { data: allUsers = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list()
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['userPosts', userEmail],
    queryFn: async () => {
      const allPosts = await base44.entities.Post.list('-created_date');
      return allPosts.filter(p => p.created_by === userEmail);
    },
    enabled: !!userEmail
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments'],
    queryFn: () => base44.entities.Comment.list()
  });

  const { data: memberships = [] } = useQuery({
    queryKey: ['userMemberships', userEmail],
    queryFn: async () => {
      const all = await base44.entities.GroupMember.list();
      return all.filter(m => m.user_email === userEmail);
    },
    enabled: !!userEmail
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: () => base44.entities.StudyGroup.list()
  });

  const user = allUsers.find(u => u.email === userEmail);
  const userGroups = groups.filter(g => memberships.some(m => m.group_id === g.id));

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.email === userEmail;

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4a] text-white px-4 pt-4 pb-24">
        <Link
          to={createPageUrl('Community')}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#c9a227] to-[#8fa68a] flex items-center justify-center text-3xl font-bold">
            {user.profile_image_url ? (
              <img src={user.profile_image_url} alt={user.full_name} className="w-full h-full object-cover" />
            ) : (
              user.full_name?.charAt(0) || user.email.charAt(0)
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.full_name || 'User'}</h1>
            <p className="text-white/70 text-sm">{user.email}</p>
          </div>
        </div>

        {user.bio && (
          <p className="mt-4 text-white/90 text-sm">{user.bio}</p>
        )}
      </div>

      {/* Stats */}
      <div className="px-4 -mt-16 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 shadow-lg text-center"
          >
            <MessageSquare className="w-6 h-6 text-[#c9a227] mb-2 mx-auto" />
            <p className="text-2xl font-bold text-[#1a1a2e]">{posts.length}</p>
            <p className="text-xs text-gray-500">Posts</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-lg text-center"
          >
            <Users className="w-6 h-6 text-[#8fa68a] mb-2 mx-auto" />
            <p className="text-2xl font-bold text-[#1a1a2e]">{userGroups.length}</p>
            <p className="text-xs text-gray-500">Groups</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 shadow-lg text-center"
          >
            <TrendingUp className="w-6 h-6 text-[#c9a227] mb-2 mx-auto" />
            <p className="text-2xl font-bold text-[#1a1a2e]">
              {posts.reduce((sum, p) => sum + (p.likes || 0), 0)}
            </p>
            <p className="text-xs text-gray-500">Likes</p>
          </motion.div>
        </div>
      </div>

      {/* Groups */}
      {userGroups.length > 0 && (
        <div className="px-4 mb-6">
          <h2 className="text-lg font-semibold text-[#1a1a2e] mb-3">Groups</h2>
          <div className="grid grid-cols-2 gap-3">
            {userGroups.map(group => (
              <Link
                key={group.id}
                to={createPageUrl(`GroupDetail?id=${group.id}`)}
                className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-[#1a1a2e] text-sm mb-1">{group.name}</h3>
                <p className="text-xs text-gray-500">{group.member_count} members</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Posts */}
      <div className="px-4">
        <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Recent Posts</h2>
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-500">No posts yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.slice(0, 5).map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                comments={comments}
                onLike={() => {}}
                onComment={() => {}}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}