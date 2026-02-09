import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import ProfileHeader from '@/components/profile/facebook/ProfileHeader';
import ProfileTabs from '@/components/profile/facebook/ProfileTabs';
import TimelineTab from '@/components/profile/facebook/TimelineTab';
import AboutTab from '@/components/profile/facebook/AboutTab';
import FriendsTab from '@/components/profile/facebook/FriendsTab';
import PhotosTab from '@/components/profile/facebook/PhotosTab';
import AchievementsTab from '@/components/profile/facebook/AchievementsTab';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const { data: userProgress = null } = useQuery({
    queryKey: ['userProgress'],
    queryFn: () => base44.entities.UserProgress.list().then(list => list[0] || null),
    enabled: !!user
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments'],
    queryFn: () => base44.entities.Comment.list()
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isScrolled ? 1 : 0, y: isScrolled ? 0 : -20 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40 pointer-events-none"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between pointer-events-auto">
          <h1 className="text-xl font-bold text-gray-900">{user.full_name}</h1>
          <Link
            to={createPageUrl('Settings')}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </Link>
        </div>
      </motion.div>

      <ProfileHeader user={user} friendsCount={friends.length} userProgress={userProgress} />

      <div className="max-w-6xl mx-auto">
        {/* Tabs Navigation */}
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Area */}
        <div className="grid grid-cols-3 gap-6 px-4 py-6 lg:grid-cols-3 md:grid-cols-1">
          {/* Main Content */}
          <div className="lg:col-span-2 col-span-1">
            {activeTab === 'timeline' && <TimelineTab user={user} posts={posts} comments={comments} />}
            {activeTab === 'about' && <AboutTab user={user} />}
            {activeTab === 'friends' && <FriendsTab friends={friends} user={user} />}
            {activeTab === 'photos' && <PhotosTab user={user} />}
            {activeTab === 'achievements' && <AchievementsTab userProgress={userProgress} />}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block space-y-4">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Friends</span>
                  <span className="font-semibold text-gray-900">{friends.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Posts</span>
                  <span className="font-semibold text-gray-900">{posts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Level</span>
                  <span className="font-semibold text-blue-600">{userProgress?.level || 1}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Points</span>
                  <span className="font-semibold text-gray-900">{userProgress?.total_points || 0}</span>
                </div>
              </div>
            </div>

            {/* Badges Preview */}
            {userProgress?.badges?.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Badges</h3>
                <div className="grid grid-cols-3 gap-2">
                  {userProgress.badges.slice(0, 6).map((badge, idx) => (
                    <div key={idx} className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center text-xl">
                      🏅
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}