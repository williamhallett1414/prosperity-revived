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
import ActivityTab from '@/components/profile/facebook/ActivityTab.jsx';

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
    enabled: !!user,
    retry: false
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments'],
    queryFn: () => base44.entities.Comment.list(),
    retry: false
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#D9B878] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F6FA]">
      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isScrolled ? 1 : 0, y: isScrolled ? 0 : -20 }}
        transition={{ duration: 0.3 }}
        className="fixed top-16 left-0 right-0 bg-white shadow-md z-30 pointer-events-none"
        style={{ pointerEvents: isScrolled ? 'auto' : 'none' }}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between pointer-events-auto">
          <h1 className="text-xl font-bold text-[#0A1A2F]">{user.full_name}</h1>
          <Link
            to={createPageUrl('Settings')}
            className="p-2 hover:bg-[#E6EBEF] rounded-full transition"
          >
            <Settings className="w-5 h-5 text-[#0A1A2F]" />
          </Link>
        </div>
      </motion.div>

      <ProfileHeader user={user} friendsCount={friends.length} userProgress={userProgress} />

      <div className="max-w-5xl mx-auto">
        {/* Tabs Navigation - Sticky */}
        <div className={`sticky ${isScrolled ? 'top-28' : 'top-16'} bg-white border-b border-[#E6EBEF] shadow-sm z-20 transition-all`}>
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Content Area */}
        <div className="px-4 py-6">
          {activeTab === 'timeline' && <TimelineTab user={user} posts={posts} comments={comments} />}
          {activeTab === 'about' && <AboutTab user={user} />}
          {activeTab === 'friends' && <FriendsTab friends={friends} user={user} />}
          {activeTab === 'photos' && <PhotosTab user={user} />}
          {activeTab === 'achievements' && <AchievementsTab userProgress={userProgress} />}
          {activeTab === 'activity' && <ActivityTab userProgress={userProgress} />}
        </div>
      </div>
    </div>
  );
}