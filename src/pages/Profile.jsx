import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Settings, Trash2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BackButton from '@/components/navigation/BackButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import ProfileHeader from '@/components/profile/facebook/ProfileHeader.jsx';
import ProfileTabs from '@/components/profile/facebook/ProfileTabs.jsx';
import TimelineTab from '@/components/profile/facebook/TimelineTab.jsx';
import AboutTab from '@/components/profile/facebook/AboutTab.jsx';
import FriendsTab from '@/components/profile/facebook/FriendsTab.jsx';
import PhotosTab from '@/components/profile/facebook/PhotosTab.jsx';
import AchievementsTab from '@/components/profile/facebook/AchievementsTab.jsx';
import ActivityTab from '@/components/profile/facebook/ActivityTab.jsx';
import ProfileStreaks from '@/components/profile/ProfileStreaks';
import ProfileStats from '@/components/profile/ProfileStats';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const { data: meditationSessions = [] } = useQuery({
    queryKey: ['meditationSessions'],
    queryFn: async () => {
      try {
        return await base44.entities.MeditationSession.filter({ created_by: user?.email }, '-created_date', 100);
      } catch {
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

  const { data: workoutSessions = [] } = useQuery({
    queryKey: ['workoutSessions'],
    queryFn: async () => {
      try {
        return await base44.entities.WorkoutSession.filter({ created_by: user?.email }, '-created_date', 100);
      } catch {
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: async () => {
      try {
        return await base44.entities.JournalEntry.filter({ created_by: user?.email }, '-created_date', 100);
      } catch {
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#3C4E53] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#D9B878] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#3C4E53]">
      {/* Back Button */}
      <div className="fixed top-16 left-4 z-50">
        <BackButton />
      </div>

      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isScrolled ? 1 : 0, y: isScrolled ? 0 : -20 }}
        transition={{ duration: 0.3 }}
        className="fixed top-16 left-0 right-0 bg-white dark:bg-[#2d2d4a] shadow-md z-30 pointer-events-none"
        style={{ pointerEvents: isScrolled ? 'auto' : 'none' }}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between pointer-events-auto">
          <h1 className="text-xl font-bold text-[#0A1A2F] dark:text-white">{user.full_name}</h1>
          <div className="flex items-center gap-2">
            <Link
              to={createPageUrl('ProgressDashboard')}
              className="p-2 hover:bg-[#E6EBEF] dark:hover:bg-[#3C4E53] rounded-full transition"
              title="View Progress Dashboard"
            >
              <TrendingUp className="w-5 h-5 text-[#0A1A2F] dark:text-white" />
            </Link>
            <Link
              to={createPageUrl('Settings')}
              className="p-2 hover:bg-[#E6EBEF] dark:hover:bg-[#3C4E53] rounded-full transition"
            >
              <Settings className="w-5 h-5 text-[#0A1A2F] dark:text-white" />
            </Link>
          </div>
        </div>
      </motion.div>

      <ProfileHeader user={user} friendsCount={friends.length} userProgress={userProgress} />

      <div className="max-w-5xl mx-auto">
        {/* Tabs Navigation - Sticky */}
        <div className={`sticky ${isScrolled ? 'top-28' : 'top-16'} bg-white dark:bg-[#2d2d4a] border-b border-[#E6EBEF] dark:border-gray-700 shadow-sm z-20 transition-all`}>
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Content Area */}
        <div className="px-4 py-6 max-w-2xl mx-auto">
          {activeTab === 'timeline' && (
            <>
              <ProfileStreaks
                userProgress={userProgress}
                meditationSessions={meditationSessions}
                workoutSessions={workoutSessions}
                journalEntries={journalEntries}
              />
              <ProfileStats
                userProgress={userProgress}
                meditationSessions={meditationSessions}
                workoutSessions={workoutSessions}
                journalEntries={journalEntries}
              />
              <TimelineTab user={user} posts={posts} comments={comments} />
            </>
          )}
          {activeTab === 'about' && <AboutTab user={user} />}
          {activeTab === 'friends' && <FriendsTab friends={friends} user={user} />}
          {activeTab === 'photos' && <PhotosTab user={user} />}
          {activeTab === 'achievements' && <AchievementsTab userProgress={userProgress} />}
          {activeTab === 'activity' && <ActivityTab userProgress={userProgress} />}

          {/* Delete Account Section */}
          {activeTab === 'about' && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-[#0A1A2F] dark:text-white mb-4">Danger Zone</h3>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 min-h-[44px]"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete My Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="dark:bg-[#2d2d4a]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="dark:text-white">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="dark:text-gray-400">
                      This action cannot be undone. This will permanently delete your account
                      and remove all of your data from our servers, including:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>All your posts and comments</li>
                        <li>Reading plans and progress</li>
                        <li>Workout and meditation logs</li>
                        <li>Journal entries and bookmarks</li>
                        <li>Achievements and points</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="min-h-[44px] dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700 min-h-[44px]"
                      onClick={async () => {
                        setIsDeleting(true);
                        try {
                          await base44.auth.deleteAccount();
                          window.location.href = '/';
                        } catch (error) {
                          console.error('Failed to delete account:', error);
                          setIsDeleting(false);
                        }
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}