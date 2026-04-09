import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Settings, Camera, ChevronRight, Trophy, TrendingUp, MessageCircle, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

import AboutTab from '@/components/profile/facebook/AboutTab';
import FriendsTab from '@/components/profile/facebook/FriendsTab';
import PhotosTab from '@/components/profile/facebook/PhotosTab';
import TimelineTab from '@/components/profile/facebook/TimelineTab';
import ChatbotPreferencesTab from '@/components/profile/ChatbotPreferencesTab';

// ─── Tabs ──────────────────────────────────────────────────────────────────────
// Tab definitions for profile sections
const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'about', label: 'About' },
  { id: 'friends', label: 'Friends' },
  { id: 'photos', label: 'Photos' },
  { id: 'ai', label: 'Guides' }
];

// ─── Profile header ────────────────────────────────────────────────────────
function Header({ user, friendsCount, onCoverUpload, onAvatarUpload, uploading }) {
  return (
    <div className="bg-white shadow-sm">
      {/* Cover */}
      <div className="relative h-40 sm:h-52 bg-gradient-to-br from-[#3C4E53] via-[#FD9C2D] to-[#FAD98D] overflow-hidden">
        {user?.cover_image_url ? (
          <img src={user.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#3C4E53] via-[#FD9C2D] to-[#FAD98D]" />
        )}
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
              {user?.profile_image_url ? (
                <img src={user.profile_image_url} alt={user?.full_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                  {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <label className="absolute bottom-0.5 right-0.5 bg-white rounded-full p-1.5 shadow-md cursor-pointer hover:scale-105 transition-transform">
              <Camera className="w-3.5 h-3.5 text-gray-600" />
              <input type="file" accept="image/*" onChange={onAvatarUpload} className="hidden" disabled={uploading.avatar} />
            </label>
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0 pt-10">
            <h1 className="text-[#0A1A2F] py-3 text-base font-bold leading-tight">{user?.full_name || 'Your Profile'}</h1>
            <p className="text-sm text-[#0A1A2F]/50">{friendsCount} {friendsCount === 1 ? 'friend' : 'friends'}</p>
          </div>

          {/* Messages link */}
          <Link to={createPageUrl('Messages')} className="flex-shrink-0 w-9 h-9 rounded-full bg-[#FAD98D]/20 hover:bg-[#FAD98D]/35 flex items-center justify-center transition-colors">
            <MessageCircle className="w-4 h-4 text-[#0A1A2F]" />
          </Link>

          {/* Settings link */}
          <Link to={createPageUrl('Settings')} className="flex-shrink-0 w-9 h-9 rounded-full bg-[#FAD98D]/20 hover:bg-[#FAD98D]/35 flex items-center justify-center transition-colors">
            <Settings className="w-4 h-4 text-[#0A1A2F]" />
          </Link>
        </div>

        {/* 90-day goal / status */}
        {(user?.status_message || user?.goal_90_day || user?.spiritual_goal) && (
          <div className="pb-4 space-y-2">
            {user.status_message && (
              <p className="text-sm text-[#0A1A2F]/70 italic">"{user.status_message}"</p>
            )}
            {(user.goal_90_day || user.spiritual_goal) && (
              <div className="flex items-start gap-2 bg-[#FAD98D]/15 border border-[#FAD98D]/30 rounded-xl p-3 text-sm">
                <span className="text-base leading-none mt-0.5">🌟</span>
                <p className="text-[#0A1A2F]/80"><span className="font-semibold text-[#0A1A2F]">90-day goal:</span> {user.goal_90_day || user.spiritual_goal}</p>
              </div>
            )}
            {/* Profile pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {user.fitness_level && <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-[#38BDF8]/15 text-[#38BDF8]">💪 {user.fitness_level}</span>}
              {user.diet_type && user.diet_type !== 'no_restrictions' && <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E]">🥗 {user.diet_type}</span>}
              {user.bible_level && <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-[#FAD98D]/40 text-[#0A1A2F]">📖 {user.bible_level} reader</span>}
              {user.coaching_style && <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-[#AFC7E3]/40 text-[#0A1A2F]">🧭 {user.coaching_style}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab bar ───────────────────────────────────────────────────────────────────
function TabBar({ activeTab, onChange }) {
  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-lg mx-auto px-3 py-2 flex gap-1 overflow-x-auto scrollbar-none">
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => onChange(id)}
            className={`relative px-3.5 py-2 text-xs font-bold flex-shrink-0 rounded-xl transition-all ${
              activeTab === id
                ? 'bg-[#0A1A2F] text-white shadow-sm'
                : 'text-[#0A1A2F]/45 hover:text-[#0A1A2F]/70 hover:bg-[#0A1A2F]/05'
            }`}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────
function SectionHeading({ children, accent }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {accent && <div className="w-1 h-4 rounded-full" style={{ background: accent }} />}
      <p className="text-[11px] font-black text-[#0A1A2F]/40 uppercase tracking-widest">{children}</p>
    </div>
  );
}

// ─── North Star hero card ─────────────────────────────────────────────────────
function NorthStarCard({ user }) {
  const goal = user?.main_goal_text || user?.goal_90_day;
  const firstName = user?.full_name?.split(' ')[0] || 'Friend';

  if (!goal) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl px-5 py-5"
        style={{ background: 'linear-gradient(135deg, #0A1A2F 0%, #0f2744 100%)' }}>
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #C9A227, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className="relative z-10">
          <p className="text-[#C9A227] text-[10px] font-black uppercase tracking-widest mb-2">Welcome back, {firstName}</p>
          <p className="text-white font-black text-lg leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
            "I can do all things through Christ who strengthens me."
          </p>
          <p className="text-white/40 text-xs mt-2">— Philippians 4:13</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl px-5 py-5"
      style={{ background: 'linear-gradient(135deg, #0A1A2F 0%, #0f2744 100%)' }}>
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #C9A227, transparent)', transform: 'translate(35%, -35%)' }} />
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #FD9C2D, transparent)', transform: 'translate(-30%, 30%)' }} />
      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-base">🎯</span>
          <p className="text-[#C9A227] text-[10px] font-black uppercase tracking-widest">Your north star</p>
        </div>
        <p className="text-white/90 text-base leading-relaxed italic font-medium" style={{ fontFamily: 'Georgia, serif' }}>
          "{goal}"
        </p>
        <p className="text-white/30 text-[10px] mt-3 font-semibold">— {firstName}</p>
      </div>
    </motion.div>
  );
}

// ─── Activity stats strip ─────────────────────────────────────────────────────
function ActivityStrip({ meditationSessions, workoutSessions, journalEntries, userProgress }) {
  const stats = [
    {
      emoji: '💪',
      label: 'Workouts',
      value: workoutSessions?.length || 0,
      color: '#38BDF8',
      bg: '#38BDF808',
      border: '#38BDF820',
    },
    {
      emoji: '📓',
      label: 'Journals',
      value: journalEntries?.length || 0,
      color: '#AFC7E3',
      bg: '#AFC7E308',
      border: '#AFC7E320',
    },
    {
      emoji: '🧘',
      label: 'Med. mins',
      value: meditationSessions?.reduce((s, m) => s + (m.duration_minutes || 0), 0) || 0,
      color: '#C9A227',
      bg: '#C9A22708',
      border: '#C9A22720',
    },
    {
      emoji: '🏅',
      label: 'Badges',
      value: userProgress?.badges?.length || 0,
      color: '#FD9C2D',
      bg: '#FD9C2D08',
      border: '#FD9C2D20',
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
      <SectionHeading accent="#C9A227">Activity</SectionHeading>
      <div className="grid grid-cols-4 gap-2">
        {stats.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.04 }}
            className="rounded-2xl px-2 py-3 text-center border"
            style={{ background: s.bg, borderColor: s.border }}>
            <p className="text-xl mb-1">{s.emoji}</p>
            <p className="font-black text-lg leading-none" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[9px] font-semibold text-[#0A1A2F]/40 mt-1 leading-tight">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Streak row ───────────────────────────────────────────────────────────────
function StreakRow({ meditationSessions, workoutSessions, journalEntries }) {
  const calcStreak = (sessions) => {
    if (!sessions?.length) return 0;
    let streak = 0;
    const today = new Date();
    const sorted = [...sessions]
      .map(s => new Date(s.date || s.created_date))
      .sort((a, b) => b - a);
    for (const d of sorted) {
      const diff = Math.floor((today - d) / 86400000);
      if (diff === streak) streak++;
      else break;
    }
    return streak;
  };

  const streaks = [
    { label: 'Workout',    count: calcStreak(workoutSessions),    color: '#38BDF8', emoji: '💪' },
    { label: 'Journaling', count: calcStreak(journalEntries),     color: '#AFC7E3', emoji: '📓' },
    { label: 'Meditation', count: calcStreak(meditationSessions), color: '#C9A227', emoji: '🧘' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <SectionHeading accent="#FD9C2D">Streaks 🔥</SectionHeading>
      <div className="grid grid-cols-3 gap-2.5">
        {streaks.map((s, i) => {
          const active = s.count > 0;
          return (
            <motion.div key={s.label}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-2xl p-3.5 border text-center"
              style={{
                background: active ? `${s.color}10` : '#ffffff',
                borderColor: active ? `${s.color}30` : '#e5e7eb',
              }}>
              <p className="text-2xl mb-1">{s.emoji}</p>
              <p className="font-black text-2xl leading-none" style={{ color: active ? s.color : '#CBD5E1' }}>{s.count}</p>
              <p className="text-[9px] text-[#0A1A2F]/40 font-bold uppercase tracking-wide mt-1">{s.label}</p>
              <p className="text-[9px] font-semibold mt-1" style={{ color: active ? s.color : '#CBD5E1' }}>
                {active ? `${s.count === 1 ? '1 day' : `${s.count} days`}` : 'Start today'}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Goal bento grid ──────────────────────────────────────────────────────────
function GoalBento() {
  return (
    <motion.div id="tour-profile-progress" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
      <SectionHeading accent="#0A1A2F">Your Goals</SectionHeading>

      {/* Row 1 — Journey (wide) + Achievements (narrow) */}
      <div className="flex gap-4 mb-6">
        <Link to={createPageUrl('ProgressDashboard')} className="flex-1">
          <div className="relative overflow-hidden rounded-3xl p-3.5 h-full min-h-[80px] hover:opacity-95 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #0A1A2F, #162944)' }}>
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #38BDF8, transparent)', transform: 'translate(30%, -30%)' }} />
            <div className="relative z-10">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="font-black text-white text-xs">My Journey</p>
              <p className="text-white/40 text-[10px] mt-0.5">Progress & guides</p>
            </div>
          </div>
        </Link>
        <Link to={createPageUrl('Achievements')} className="flex-1">
          <div className="relative overflow-hidden rounded-3xl p-3.5 h-full min-h-[80px] flex flex-col justify-between hover:opacity-95 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #C9A227, #FD9C2D)' }}>
            <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #fff, transparent)', transform: 'translate(30%, 30%)' }} />
            <div className="relative z-10">
              <Trophy className="w-4 h-4 text-white mb-2" />
              <p className="font-black text-white text-xs">Achievements</p>
              <p className="text-white/65 text-[10px] mt-0.5">Badges & level</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Row 2 — 3 domain tiles */}
      <div className="grid grid-cols-3 gap-2.5 mb-2.5">
        <Link to={createPageUrl('FitnessGoalsPage')}>
          <div className="rounded-2xl p-3.5 hover:opacity-95 transition-opacity border border-[#38BDF8]/20"
            style={{ background: 'linear-gradient(160deg, #EFF9FF, #dbeeff)' }}>
            <p className="text-xl mb-2">💪</p>
            <p className="font-black text-[#0A1A2F] text-xs leading-tight">Fitness</p>
            <p className="text-[#38BDF8] text-[9px] font-semibold mt-1 uppercase tracking-wide">Goals →</p>
          </div>
        </Link>
        <Link to={createPageUrl('NutritionGoalsPage')}>
          <div className="rounded-2xl p-3.5 hover:opacity-95 transition-opacity border border-[#22C55E]/20"
            style={{ background: 'linear-gradient(160deg, #F0FFF4, #dcfce7)' }}>
            <p className="text-xl mb-2">🥗</p>
            <p className="font-black text-[#0A1A2F] text-xs leading-tight">Nutrition</p>
            <p className="text-[#22C55E] text-[9px] font-semibold mt-1 uppercase tracking-wide">Goals →</p>
          </div>
        </Link>
        <Link to={createPageUrl('BibleGoalsPage')}>
          <div className="rounded-2xl p-3.5 hover:opacity-95 transition-opacity border border-[#C9A227]/20"
            style={{ background: 'linear-gradient(160deg, #FFFDF0, #fef9c3)' }}>
            <p className="text-xl mb-2">📖</p>
            <p className="font-black text-[#0A1A2F] text-xs leading-tight">Bible Study</p>
            <p className="text-[#C9A227] text-[9px] font-semibold mt-1 uppercase tracking-wide">Goals →</p>
          </div>
        </Link>
      </div>

      {/* Row 3 — Growth (full width, editorial) */}
      <Link to={createPageUrl('PersonalGrowthGoalsPage')}>
        <div className="relative overflow-hidden rounded-3xl p-4 hover:opacity-95 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #3C4E53, #2a3840)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #AFC7E3 0%, transparent 60%)' }} />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-[#AFC7E3]" />
            </div>
            <div className="flex-1">
              <p className="font-black text-white text-sm">Personal Growth Goals</p>
              <p className="text-white/40 text-[10px] mt-0.5">Mindset · Values · Coaching style · Tools</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/25 flex-shrink-0" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
// Profile page component for user profile display
export default function Profile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploading, setUploading] = useState({ cover: false, avatar: false });

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  // ── Eager: userProgress + friends (both needed for header/tab content) ──
  const { data: userProgress = null } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      try {
        const list = await base44.entities.UserProgress.filter({ created_by: user.email });
        return list[0] || null;
      } catch { return null; }
    },
    enabled: !!user,
    retry: false
  });

  const { data: friends = [] } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      try {
        const [a, b] = await Promise.all([
          base44.entities.Friend.filter({ user_email: user.email, status: 'accepted' }),
          base44.entities.Friend.filter({ friend_email: user.email, status: 'accepted' })
        ]);
        return [...a, ...b];
      } catch { return []; }
    },
    enabled: !!user
  });

  // ── Lazy: only load when Overview tab is active ──────────────────────────
  const { data: myPosts = [] } = useQuery({
    queryKey: ['myPosts'],
    queryFn: async () => { try { return await base44.entities.Post.filter({ created_by: user?.email }); } catch { return []; } },
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
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setUploading((u) => ({ ...u, cover: true }));
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.auth.updateMe({ cover_image_url: file_url });
      setUser(prev => ({ ...prev, cover_image_url: file_url }));
      toast.success('Cover photo updated!');
    } catch { toast.error('Failed to upload cover photo'); }
    setUploading((u) => ({ ...u, cover: false }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setUploading((u) => ({ ...u, avatar: true }));
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.auth.updateMe({ profile_image_url: file_url });
      setUser(prev => ({ ...prev, profile_image_url: file_url }));
      toast.success('Profile photo updated!');
    } catch { toast.error('Failed to upload profile photo'); }
    setUploading((u) => ({ ...u, avatar: false }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#c9a227] border-t-transparent rounded-full" />
      </div>
    );
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

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <NorthStarCard user={user} />
            <ActivityStrip
              meditationSessions={meditationSessions}
              workoutSessions={workoutSessions}
              journalEntries={journalEntries}
              userProgress={userProgress} />
            <StreakRow
              meditationSessions={meditationSessions}
              workoutSessions={workoutSessions}
              journalEntries={journalEntries} />
            <GoalBento />
            <div>
              <SectionHeading accent="#FAD98D">Recent Posts</SectionHeading>
              {myPosts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#FAD98D]/20 p-6 text-center">
                  <p className="text-2xl mb-2">✍️</p>
                  <p className="text-sm font-semibold text-[#0A1A2F]/50">No posts yet</p>
                  <p className="text-xs text-[#0A1A2F]/30 mt-1">Share your journey with the community!</p>
                </div>
              ) : (
                <TimelineTab user={user} posts={myPosts} comments={[]} />
              )}
            </div>
          </div>
        )}

        {/* ABOUT ── bio editor + account settings */}
        {activeTab === 'about' && (
          <>
            <AboutTab user={user} />

            {/* Account settings — only on About tab */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-[#FAD98D]/25 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-[#FAD98D]/20">
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
                  <AlertDialogContent className="bg-[#F2F6FA] border border-[#FAD98D]/30">
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
                          try { await base44.auth.deleteAccount(); window.location.href = '/'; }
                          catch { toast.error('Failed to delete account — please try again'); setIsDeleting(false); }
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
        )}

        {/* FRIENDS */}
        {activeTab === 'friends' && (
          <FriendsTab friends={friends} user={user} />
        )}

        {/* PHOTOS */}
        {activeTab === 'photos' && (
          <PhotosTab user={user} />
        )}

        {/* AI GUIDES ── chatbot preferences */}
        {activeTab === 'ai' && (
          <ChatbotPreferencesTab user={user} />
        )}

      </div>
    </div>
  );
}