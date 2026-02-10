import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import ProfileHeader from '@/components/profile/facebook/ProfileHeader.jsx';
import ProfileTabs from '@/components/profile/facebook/ProfileTabs.jsx';
import TimelineTab from '@/components/profile/facebook/TimelineTab.jsx';
import AboutTab from '@/components/profile/facebook/AboutTab.jsx';
import FriendsTab from '@/components/profile/facebook/FriendsTab.jsx';
import PhotosTab from '@/components/profile/facebook/PhotosTab.jsx';
import AchievementsTab from '@/components/profile/facebook/AchievementsTab.jsx';

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
      return await base44.entities.Post.filter({ created_by: user?.email });
    },
    enabled: !!user
  });

  const { data: friends = [] } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const userFriends = await base44.entities.Friend.filter({ 
        user_email: user?.email, 
        status: 'accepted' 
      });
      const friendOf = await base44.entities.Friend.filter({ 
        friend_email: user?.email, 
        status: 'accepted' 
      });
      return [...userFriends, ...friendOf];
    },
    enabled: !!user
  });

  const { data: userProgress = null } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const list = await base44.entities.UserProgress.filter({ created_by: user.email });
      return list[0] || null;
    },
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
        className="fixed top-16 left-0 right-0 bg-white shadow-md z-30 pointer-events-none"
        style={{ pointerEvents: isScrolled ? 'auto' : 'none' }}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between pointer-events-auto">
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

      <div className="max-w-5xl mx-auto">
        {/* Tabs Navigation - Sticky */}
        <div className={`sticky ${isScrolled ? 'top-28' : 'top-16'} bg-white border-b border-gray-200 shadow-sm z-20 transition-all`}>
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 py-6">
          {/* Main Content */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {activeTab === 'timeline' && <TimelineTab user={user} posts={posts} comments={comments} />}
            {activeTab === 'about' && <AboutTab user={user} />}
            {activeTab === 'friends' && <FriendsTab friends={friends} user={user} />}
            {activeTab === 'photos' && <PhotosTab user={user} />}
            {activeTab === 'achievements' && <AchievementsTab userProgress={userProgress} />}
          </div>

          {/* Sidebar */}
          <div className="order-1 lg:order-2 space-y-4">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-600 font-medium">Friends</span>
                  <span className="font-bold text-blue-600 text-lg">{friends.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-600 font-medium">Posts</span>
                  <span className="font-bold text-gray-900 text-lg">{posts.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-600 font-medium">Level</span>
                  <span className="font-bold text-blue-600 text-lg">{userProgress?.level || 1}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600 font-medium">Points</span>
                  <span className="font-bold text-amber-600 text-lg">{userProgress?.total_points || 0}</span>
                </div>
              </div>
            </div>

            {/* Badges Preview */}
            {userProgress?.badges?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Badges</h3>
                <div className="grid grid-cols-3 gap-3">
                  {userProgress.badges.slice(0, 6).map((badge, idx) => (
                    <div key={idx} className="aspect-square bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-xl flex items-center justify-center text-2xl shadow-md hover:scale-105 transition-transform cursor-pointer">
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