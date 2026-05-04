import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, BookOpen, Trophy, Users, MessageCircle,
  Flame, ChevronRight, UserPlus, Crown, Sparkles
} from 'lucide-react';

const CommunityFeed = React.lazy(() => import('@/components/community/CommunityFeed'));
const GroupChallenges = React.lazy(() => import('@/components/community/GroupChallenges'));
const AIBlogWriter = React.lazy(() => import('@/components/community/AIBlogWriter'));
const BlogFeed = React.lazy(() => import('@/components/community/BlogFeed'));
const ModerationPanel = React.lazy(() => import('@/components/community/ModerationPanel'));

const TABS = [
  { id: 'feed', label: 'Feed', icon: MessageCircle },
  { id: 'groups', label: 'Groups', icon: Users },
  { id: 'challenges', label: 'Challenges', icon: Trophy },
  { id: 'blog', label: 'Blog', icon: BookOpen }
];

// ─── Stat tile ───
function StatTile({ icon: Icon, value, label, color }) {
  return (
    <div className="flex-1 bg-white dark:bg-white/5 rounded-2xl p-3 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none flex flex-col items-center gap-1.5 min-w-0">
      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: color + '22' }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <p className="text-xl font-bold text-[#0A1A2F] dark:text-white leading-none">{value}</p>
      <p className="text-[10px] font-semibold text-[#0A1A2F]/45 dark:text-white/45 uppercase tracking-widest">{label}</p>
    </div>
  );
}

// ─── Groups tab content ───
function GroupsSection({ user }) {
  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: () => base44.entities.StudyGroup.list('-created_date')
  });

  const myGroups = groups.filter((g) =>
    g.created_by === user?.email || (g.members || []).includes(user?.email)
  );
  const otherGroups = groups.filter((g) =>
    g.created_by !== user?.email && !(g.members || []).includes(user?.email)
  );

  return (
    <div className="space-y-4">
      {myGroups.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest">My Groups</p>
            <span className="text-xs text-[#7C3AED] font-semibold">{myGroups.length} joined</span>
          </div>
          <div className="space-y-2">
            {myGroups.map((group) => (
              <Link key={group.id} to={createPageUrl(`GroupDetail?id=${group.id}`)}>
                <motion.div whileTap={{ scale: 0.98 }}
                  className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#0A1A2F] dark:text-white truncate">{group.name}</p>
                    <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">{(group.members || []).length + 1} members · {group.category || 'General'}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#0A1A2F]/20 dark:text-white/20 flex-shrink-0" />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest">
            {myGroups.length > 0 ? 'Discover More' : 'Join a Group'}
          </p>
        </div>
        {otherGroups.length > 0 ? (
          <div className="space-y-2">
            {otherGroups.slice(0, 5).map((group) => (
              <Link key={group.id} to={createPageUrl(`GroupDetail?id=${group.id}`)}>
                <motion.div whileTap={{ scale: 0.98 }}
                  className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#AFC7E3] to-[#3C4E53] flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#0A1A2F] dark:text-white truncate">{group.name}</p>
                    <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">{(group.members || []).length + 1} members · {group.category || 'General'}</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20 flex-shrink-0">Join</span>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10 text-center">
            <Users className="w-8 h-8 text-[#0A1A2F]/15 dark:text-white/15 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#0A1A2F]/60 dark:text-white/60">No groups yet</p>
            <p className="text-xs text-[#0A1A2F]/35 dark:text-white/35 mt-1">Be the first to create a group!</p>
          </div>
        )}
      </div>

      <Link to={createPageUrl('Groups')}>
        <motion.div whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] rounded-2xl p-4 flex items-center gap-3 shadow-md dark:shadow-none">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Create or Browse Groups</p>
            <p className="text-xs text-white/60">Bible study · Workout · Prayer · Accountability</p>
          </div>
          <ChevronRight className="w-4 h-4 text-white/50 flex-shrink-0" />
        </motion.div>
      </Link>
    </div>
  );
}

// ─── Leaderboard widget ───
function LeaderboardWidget() {
  const { data: progress = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => base44.entities.UserProgress.list('-total_points', 10)
  });

  const top5 = progress.slice(0, 5);
  if (top5.length === 0) return null;

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none overflow-hidden">
      <div className="px-4 py-3 bg-gradient-to-r from-[#FAD98D]/30 to-[#c9a227]/10 border-b border-[#FAD98D]/30 dark:border-[#FAD98D]/10 flex items-center gap-2">
        <Crown className="w-4 h-4 text-[#c9a227]" />
        <p className="text-xs font-bold text-[#0A1A2F] dark:text-white uppercase tracking-widest">Top Members</p>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-white/5">
        {top5.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3 px-4 py-2.5">
            <span className="text-base w-6 text-center">
              {i < 3 ? medals[i] : <span className="text-xs text-[#0A1A2F]/30 dark:text-white/30 font-bold">{i + 1}</span>}
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#AFC7E3] to-[#3C4E53] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{(p.created_by || '?')[0].toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white truncate">{p.created_by?.split('@')[0] || 'Member'}</p>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-[#FD9C2D]" />
              <span className="text-xs font-bold text-[#0A1A2F]/60 dark:text-white/60">{p.total_points || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-4 border-[#7C3AED]/30 border-t-[#7C3AED] rounded-full animate-spin" />
    </div>
  );
}

class PageErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex flex-col items-center justify-center p-6 text-center">
          <p className="text-lg font-bold text-[#0A1A2F] dark:text-white mb-2">Something went wrong</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This page encountered an error.</p>
          <button onClick={() => this.setState({ error: null })} className="px-4 py-2 bg-[#c9a227] text-white rounded-xl text-sm font-bold">Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function CommunityInner() {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [showBlogWriter, setShowBlogWriter] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['feed', 'groups', 'challenges', 'blog'].includes(tab)) setActiveTab(tab);
  }, [searchParams]);

  const { data: posts = [] } = useQuery({
    queryKey: ['communityPosts'],
    queryFn: () => base44.entities.CommunityShare.list('-created_date', 50),
    enabled: !!user
  });
  const { data: groups = [] } = useQuery({
    queryKey: ['groupCount'],
    queryFn: () => base44.entities.StudyGroup.list(),
    enabled: !!user
  });

  const myGroupCount = groups.filter((g) =>
    g.created_by === user?.email || (g.members || []).includes(user?.email)
  ).length;

  const tabsToRender = user?.role === 'admin'
    ? [...TABS, { id: 'moderation', label: 'Mod', icon: Sparkles }]
    : TABS;

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">

      {/* ═══ HERO HEADER — gradient band ═══ */}
      <div className="relative bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] dark:from-[#5B21B6] dark:via-[#6D28D9] dark:to-[#7C3AED] px-5 pt-4 pb-7 text-white overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-[#FD9C2D]/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-lg mx-auto flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight tracking-tight">Grow together</h1>
            <p className="text-sm text-white/80 mt-0.5">Connect, share, and grow in faith</p>
          </div>
          <button onClick={() => setShowBlogWriter(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white text-xs font-bold flex-shrink-0 transition-colors"
            aria-label="Write blog post">
            <Sparkles className="w-3.5 h-3.5" />
            Write
          </button>
        </div>
      </div>

      {/* ═══ ACTION NAV BAR — flush against header (negative margin pulls it up) ═══ */}
      <div className="bg-white dark:bg-[#0A1A2F] border-b border-gray-100 dark:border-white/8 -mt-3 rounded-t-3xl relative z-10">
        <div className="max-w-lg mx-auto px-3 py-2.5 flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {tabsToRender.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isMod = tab.id === 'moderation';
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold flex-shrink-0 rounded-xl transition-all ${
                  isActive
                    ? isMod
                      ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                      : 'bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] text-white shadow-md shadow-[#7C3AED]/25'
                    : 'text-[#0A1A2F]/55 dark:text-white/55 hover:bg-[#0A1A2F]/5 dark:hover:bg-white/5'
                }`}>
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="max-w-lg mx-auto px-4 pt-4">

        {activeTab === 'feed' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 mb-4">
            <StatTile icon={MessageCircle} value={posts.length} label="Posts" color="#7C3AED" />
            <StatTile icon={Users} value={myGroupCount} label="My Groups" color="#3B82F6" />
            <StatTile icon={Flame} value={groups.length} label="All Groups" color="#FD9C2D" />
          </motion.div>
        )}

        {activeTab === 'feed' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="mb-4">
            <LeaderboardWidget />
          </motion.div>
        )}

        {activeTab === 'feed' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-4">
            <Link to={createPageUrl('Friends')}>
              <motion.div whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-[#EC4899]/8 to-[#F472B6]/8 dark:from-[#EC4899]/12 dark:to-[#F472B6]/12 rounded-2xl p-4 border border-[#EC4899]/20 dark:border-[#EC4899]/15 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EC4899] to-[#F472B6] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#EC4899]/25">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#0A1A2F] dark:text-white">Find Friends</p>
                  <p className="text-xs text-[#0A1A2F]/55 dark:text-white/55">Connect with others on the same journey</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#EC4899] flex-shrink-0" />
              </motion.div>
            </Link>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'feed' && (
            <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <React.Suspense fallback={<TabSpinner />}><CommunityFeed user={user} /></React.Suspense>
            </motion.div>
          )}
          {activeTab === 'groups' && (
            <motion.div id="tour-community-groups" key="groups" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <React.Suspense fallback={<TabSpinner />}><GroupsSection user={user} /></React.Suspense>
            </motion.div>
          )}
          {activeTab === 'challenges' && (
            <motion.div key="challenges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <React.Suspense fallback={<TabSpinner />}><GroupChallenges user={user} /></React.Suspense>
            </motion.div>
          )}
          {activeTab === 'blog' && (
            <motion.div key="blog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <React.Suspense fallback={<TabSpinner />}><BlogFeed user={user} onWriteWithAI={() => setShowBlogWriter(true)} /></React.Suspense>
            </motion.div>
          )}
          {activeTab === 'moderation' && user?.role === 'admin' && (
            <motion.div key="mod" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <React.Suspense fallback={<TabSpinner />}><ModerationPanel user={user} /></React.Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showBlogWriter && (
        <React.Suspense fallback={null}>
          <AIBlogWriter user={user} onClose={() => setShowBlogWriter(false)}
            onPublished={() => { setShowBlogWriter(false); queryClient.invalidateQueries({ queryKey: ['blogPosts'] }); setActiveTab('blog'); }} />
        </React.Suspense>
      )}
    </div>
  );
}

export default function Community(props) {
  return <PageErrorBoundary><CommunityInner {...props} /></PageErrorBoundary>;
}
