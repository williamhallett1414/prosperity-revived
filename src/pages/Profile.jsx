import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Settings, Camera, Loader2, ChevronRight, Trophy, TrendingUp, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger } from
'@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import AboutTab from '@/components/profile/facebook/AboutTab';
import FriendsTab from '@/components/profile/facebook/FriendsTab';
import PhotosTab from '@/components/profile/facebook/PhotosTab';
import TimelineTab from '@/components/profile/facebook/TimelineTab';
import ProfileStreaks from '@/components/profile/ProfileStreaks';
import ProfileStats from '@/components/profile/ProfileStats';
import ChatbotPreferencesTab from '@/components/profile/ChatbotPreferencesTab';

// ─── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
{ id: 'overview', label: 'Overview' },
{ id: 'about', label: 'About' },
{ id: 'friends', label: 'Friends' },
{ id: 'photos', label: 'Photos' },
{ id: 'ai', label: 'AI Guides' }];


// ─── Profile header ────────────────────────────────────────────────────────────
function Header({ user, friendsCount, onCoverUpload, onAvatarUpload, uploading }) {
  return (
    <div className="bg-white shadow-sm">
      {/* Cover */}
      <div className="relative h-40 sm:h-52 bg-gradient-to-br from-[#3C4E53] via-[#FD9C2D] to-[#FAD98D] overflow-hidden">
        {user?.cover_image_url ?
        <img src={user.cover_image_url} alt="Cover" className="w-full h-full object-cover" /> :
        <div className="w-full h-full bg-gradient-to-br from-[#3C4E53] via-[#FD9C2D] to-[#FAD98D]" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <label className="absolute bottom-3 right-3 bg-white/90 backdrop-blur rounded-lg px-3 py-1.5 shadow-sm cursor-pointer hover:bg-white transition-all flex items-center gap-1.5 text-xs font-semibold text-gray-700">
          <Camera className="w-3.5 h-3.5" />
          {uploading.cover ? 'Uploading…' : 'Edit Cover'}
          <input type="file" accept="image/*" onChange={onCoverUpload} className="hidden" disabled={uploading.cover} />
        </label>
      </div>

      {/* Avatar + name */}
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-end gap-4 -mt-12 pb-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-[#3C4E53] to-[#FD9C2D]">
              {user?.profile_image_url ?
              <img src={user.profile_image_url} alt={user?.full_name} className="w-full h-full object-cover" /> :
              <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                    {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
              }
            </div>
            <label className="absolute bottom-0.5 right-0.5 bg-white rounded-full p-1.5 shadow-md cursor-pointer hover:scale-105 transition-transform">
              <Camera className="w-3.5 h-3.5 text-gray-600" />
              <input type="file" accept="image/*" onChange={onAvatarUpload} className="hidden" disabled={uploading.avatar} />
            </label>
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0 pt-10">
            <h1 className="text-[#0A1A2F] py-3 text-xl font-bold leading-tight truncate">{user?.full_name || 'Your Profile'}</h1>
            <p className="text-sm text-[#0A1A2F]/50">{friendsCount} {friendsCount === 1 ? 'friend' : 'friends'}</p>
          </div>

          {/* Messages link */}
          <Link to={createPageUrl('Messages')}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-[#FAD98D]/20 hover:bg-[#FAD98D]/35 flex items-center justify-center transition-colors">
            <MessageCircle className="w-4 h-4 text-[#0A1A2F]" />
          </Link>

          {/* Settings link */}
          <Link to={createPageUrl('Settings')}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-[#FAD98D]/20 hover:bg-[#FAD98D]/35 flex items-center justify-center transition-colors">
            <Settings className="w-4 h-4 text-[#0A1A2F]" />
          </Link>
        </div>

        {/* Status / spiritual goal */}
        {(user?.status_message || user?.spiritual_goal) &&
        <div className="pb-4 space-y-2">
            {user.status_message &&
          <p className="text-sm text-[#0A1A2F]/70 italic">"{user.status_message}"</p>
          }
            {user.spiritual_goal &&
          <div className="flex items-start gap-2 bg-[#FAD98D]/15 border border-[#D9B878]/30 rounded-xl p-3 text-sm">
                <span className="text-base leading-none mt-0.5">✨</span>
                <p className="text-[#0A1A2F]/80"><span className="font-semibold text-[#0A1A2F]">Goal:</span> {user.spiritual_goal}</p>
              </div>
          }
          </div>
        }
      </div>
    </div>);

}

// ─── Tab bar ───────────────────────────────────────────────────────────────────
function TabBar({ activeTab, onChange }) {
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-[#D9B878]/25 shadow-sm">
      <div className="max-w-lg mx-auto px-4 flex gap-0 overflow-x-auto">
        {TABS.map(({ id, label }) =>
        <button key={id} onClick={() => onChange(id)}
        className={`px-4 py-3.5 text-xs font-semibold flex-shrink-0 relative transition-colors ${
        activeTab === id ? 'text-[#c9a227]' : 'text-[#0A1A2F]/50 hover:text-[#0A1A2F]/70'}`
        }>
            {label}
            {activeTab === id &&
          <motion.div layoutId="profileTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c9a227] to-[#D9B878] rounded-full"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
          }
          </button>
        )}
      </div>
    </div>);

}

// ─── Journey + Achievements quick-links ───────────────────────────────────────
function QuickLinks() {
  return (
    <div className="flex gap-3">
      <Link to={createPageUrl('ProgressDashboard')} className="flex-1">
        <div className="bg-gradient-to-br from-[#0A1A2F] to-[#1a3a5c] rounded-2xl p-4 flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm">Journey</p>
            <p className="text-white/50 text-[11px]">Progress & guides</p>
          </div>
          <ChevronRight className="w-4 h-4 text-white/30" />
        </div>
      </Link>
      <Link to={createPageUrl('Achievements')} className="flex-1">
        <div className="bg-gradient-to-br from-[#c9a227] to-[#D9B878] rounded-2xl p-4 flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm">Achievements</p>
            <p className="text-white/65 text-[11px]">Badges & level</p>
          </div>
          <ChevronRight className="w-4 h-4 text-white/30" />
        </div>
      </Link>
    </div>);

}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function Profile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploading, setUploading] = useState({ cover: false, avatar: false });

  useEffect(() => {base44.auth.me().then(setUser);}, []);

  // ── Eager: userProgress + friends (both needed for header/tab content) ──
  const { data: userProgress = null } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const list = await base44.entities.UserProgress.filter({ created_by: user.email });
      return list[0] || null;
    },
    enabled: !!user,
    retry: false
  });

  const { data: friends = [] } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const [a, b] = await Promise.all([
      base44.entities.Friend.filter({ user_email: user.email, status: 'accepted' }),
      base44.entities.Friend.filter({ friend_email: user.email, status: 'accepted' })]
      );
      return [...a, ...b];
    },
    enabled: !!user
  });

  // ── Lazy: only load when Overview tab is active ──────────────────────────
  const { data: myPosts = [] } = useQuery({
    queryKey: ['myPosts'],
    queryFn: () => base44.entities.Post.filter({ created_by: user?.email }),
    enabled: !!user && activeTab === 'overview'
  });
  const { data: meditationSessions = [] } = useQuery({
    queryKey: ['meditationSessions'],
    queryFn: () => base44.entities.MeditationSession.filter({ created_by: user?.email }, '-created_date', 100).catch(() => []),
    enabled: !!user && activeTab === 'overview',
    retry: false
  });
  const { data: workoutSessions = [] } = useQuery({
    queryKey: ['workoutSessions'],
    queryFn: () => base44.entities.WorkoutSession.filter({ created_by: user?.email }, '-created_date', 100).catch(() => []),
    enabled: !!user && activeTab === 'overview',
    retry: false
  });
  const { data: journalEntries = [] } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: () => base44.entities.JournalEntry.filter({ created_by: user?.email }, '-created_date', 100).catch(() => []),
    enabled: !!user && activeTab === 'overview',
    retry: false
  });

  // ── Photo uploads ─────────────────────────────────────────────────────────
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading((u) => ({ ...u, cover: true }));
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.auth.updateMe({ cover_image_url: file_url });
      window.location.reload();
    } catch {setUploading((u) => ({ ...u, cover: false }));}
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading((u) => ({ ...u, avatar: true }));
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.auth.updateMe({ profile_image_url: file_url });
      window.location.reload();
    } catch {setUploading((u) => ({ ...u, avatar: false }));}
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#c9a227] border-t-transparent rounded-full" />
      </div>);

  }

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-28">
      <Header
        user={user}
        friendsCount={friends.length}
        onCoverUpload={handleCoverUpload}
        onAvatarUpload={handleAvatarUpload}
        uploading={uploading} />


      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* OVERVIEW ── stats → streaks → quick-links → posts */}
        {activeTab === 'overview' &&
        <>
            <ProfileStats
            userProgress={userProgress}
            meditationSessions={meditationSessions}
            workoutSessions={workoutSessions}
            journalEntries={journalEntries} />

            <ProfileStreaks
            userProgress={userProgress}
            meditationSessions={meditationSessions}
            workoutSessions={workoutSessions}
            journalEntries={journalEntries} />

            <QuickLinks />
            <TimelineTab user={user} posts={myPosts} comments={[]} />
          </>
        }

        {/* ABOUT ── bio editor + account settings */}
        {activeTab === 'about' &&
        <>
            <AboutTab user={user} />

            {/* Account settings — only on About tab */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[#D9B878]/25 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-[#D9B878]/20">
                <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest">Account</p>
              </div>
              <div className="p-4 space-y-3">
                <Link to={createPageUrl('Settings')}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#F2F6FA] hover:bg-[#FAD98D]/15 transition-colors">
                  <Settings className="w-4 h-4 text-[#0A1A2F]/60" />
                  <span className="text-sm font-medium text-[#0A1A2F]">App Settings</span>
                  <ChevronRight className="w-4 h-4 text-[#0A1A2F]/30 ml-auto" />
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-left">
                      <span className="text-base">🗑️</span>
                      <span className="text-sm font-medium text-red-500">Delete My Account</span>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#FFFDF7] border border-[#D9B878]/30">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-[#0A1A2F]">Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-[#0A1A2F]/60">
                        This permanently deletes your account and all data — posts, reading plans, workout logs, journal entries, achievements, and points. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="min-h-[44px]">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                      className="bg-[#0A1A2F] hover:bg-[#0A1A2F]/90 min-h-[44px]"
                      onClick={async () => {
                        setIsDeleting(true);
                        try {await base44.auth.deleteAccount();window.location.href = '/';}
                        catch {setIsDeleting(false);}
                      }}
                      disabled={isDeleting}>

                        {isDeleting ? 'Deleting…' : 'Delete Account'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          </>
        }

        {/* FRIENDS */}
        {activeTab === 'friends' &&
        <FriendsTab friends={friends} user={user} />
        }

        {/* PHOTOS */}
        {activeTab === 'photos' &&
        <PhotosTab user={user} />
        }

        {/* AI GUIDES ── chatbot preferences */}
        {activeTab === 'ai' &&
        <ChatbotPreferencesTab user={user} />
        }

      </div>
    </div>);

}