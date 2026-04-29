import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import {
  ArrowLeft, Lock, Globe, UserPlus, Plus,
  Loader2, Trophy, MessageSquare, ChevronDown, ChevronUp,
  Crown, Clock, Zap, Users} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PostCard from '@/components/community/PostCard';
import CreatePostModal from '@/components/community/CreatePostModal';
import MemberManagement from '@/components/groups/MemberManagement';
import CreateChallengeModal from '@/components/challenges/CreateChallengeModal';
import ChallengeCard from '@/components/challenges/ChallengeCard';

// ─── Category config ────────────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  bible_study: { emoji: '📖', label: 'Bible Study',  gradient: 'from-[#c9a227] to-[#FAD98D]' },
  workout:     { emoji: '💪', label: 'Workout',       gradient: 'from-[#0A1A2F] to-[#0A1A2F]' },
  cooking:     { emoji: '🍳', label: 'Cooking',       gradient: 'from-[#FAD98D] to-[#FAD98D]' },
  prayer:      { emoji: '🙏', label: 'Prayer',        gradient: 'from-[#AFC7E3] to-[#3C4E53]' },
  wellness:    { emoji: '🧘', label: 'Wellness',      gradient: 'from-[#3C4E53] to-[#AFC7E3]' },
  youth:       { emoji: '👥', label: 'Youth',         gradient: 'from-[#c9a227] to-[#AFC7E3]' },
  parents:     { emoji: '👨‍👩‍👧‍👦', label: 'Parents',  gradient: 'from-[#FAD98D] to-[#AFC7E3]' },
  marriage:    { emoji: '💑', label: 'Marriage',      gradient: 'from-[#c9a227] to-[#0A1A2F]' },
  other:       { emoji: '💬', label: 'Community',     gradient: 'from-[#3C4E53] to-[#FAD98D]' },
};

function getCat(category) {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other;
}

function timeAgo(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── Member avatar strip ─────────────────────────────────────────────────────
function MemberAvatarStrip({ memberships, totalCount }) {
  const visible = memberships.slice(0, 5);
  const overflow = totalCount > 5 ? totalCount - 5 : 0;
  const COLORS = [
    'from-[#c9a227] to-[#FAD98D]', 'from-[#AFC7E3] to-[#3C4E53]',
    'from-[#FD9C2D] to-[#c9a227]', 'from-[#AFC7E3] to-[#AFC7E3]',
    'from-[#3C4E53] to-[#FAD98D]'
  ];
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {visible.map((m, i) => (
          <div key={m.id}
            className={`w-8 h-8 rounded-full bg-gradient-to-br ${COLORS[i % COLORS.length]} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
            {(m.user_email || '?').charAt(0).toUpperCase()}
          </div>
        ))}
        {overflow > 0 && (
          <div className="w-8 h-8 rounded-full bg-[#F2F6FA] dark:bg-[#0A1A2F] border-2 border-white flex items-center justify-center text-[#0A1A2F]/50 dark:text-white/50 text-[10px] font-bold">
            +{overflow}
          </div>
        )}
      </div>
      <span className="text-xs text-[#0A1A2F]/50 dark:text-white/50 font-medium">
        {totalCount} {totalCount === 1 ? 'member' : 'members'}
      </span>
    </div>
  );
}

// ─── Join CTA card ───────────────────────────────────────────────────────────
function JoinCard({ group, onJoin, joining, cat }) {
  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#FAD98D]/20 overflow-hidden">
      <div className={`bg-gradient-to-r ${cat.gradient} p-4 flex items-center gap-3`}>
        <span className="text-3xl">{cat.emoji}</span>
        <div>
          <p className="text-white font-bold text-sm">Join this group</p>
          <p className="text-white/70 text-xs">Connect with {group.member_count || 0} members</p>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          {['Post updates and encourage others', 'Join group challenges', 'See all member activity'].map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FAD98D]/20 flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
              </div>
              <p className="text-xs text-[#0A1A2F]/60 dark:text-white/60">{b}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onJoin}
          disabled={joining}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
          {joining ? 'Joining…' : 'Join Group'}
        </button>
      </div>
    </div>
  );
}

// ─── Empty states ─────────────────────────────────────────────────────────────
function EmptyFeed({ isMember, onPost }) {
  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#AFC7E3]/20 p-8 text-center">
      <div className="w-14 h-14 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-2xl flex items-center justify-center mx-auto mb-4">
        <MessageSquare className="w-7 h-7 text-[#AFC7E3]" />
      </div>
      <h3 className="font-bold text-[#0A1A2F] dark:text-white mb-1">No posts yet</h3>
      <p className="text-sm text-[#0A1A2F]/40 dark:text-white/40 leading-relaxed mb-4">
        {isMember ? 'Be the first to share something with the group.' : 'Join the group to see posts and share your own.'}
      </p>
      {isMember && (
        <button onClick={onPost}
          className="px-5 py-2.5 rounded-xl bg-[#0A1A2F] text-white font-bold text-sm hover:bg-[#0A1A2F]/85 transition-colors">
          Share the First Post
        </button>
      )}
    </div>
  );
}

function EmptyChallenges({ isMember, onCreate }) {
  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#FAD98D]/20 p-8 text-center">
      <div className="w-14 h-14 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Trophy className="w-7 h-7 text-[#FAD98D]" />
      </div>
      <h3 className="font-bold text-[#0A1A2F] dark:text-white mb-1">No challenges yet</h3>
      <p className="text-sm text-[#0A1A2F]/40 dark:text-white/40 leading-relaxed mb-4">
        {isMember ? 'Create a group challenge to build momentum together.' : 'Join to participate in challenges.'}
      </p>
      {isMember && (
        <button onClick={onCreate}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white font-bold text-sm hover:opacity-90 transition-opacity">
          Create First Challenge
        </button>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function GroupDetail() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const groupId = params.get('id');
  const [user, setUser] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [showChallenges, setShowChallenges] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: group, isLoading: groupLoading } = useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      try { const groups = await base44.entities.StudyGroup.list(); return groups.find(g => g.id === groupId); }
      catch { return null; }
    },
    retry: false,
  });

  const { data: memberships = [] } = useQuery({
    queryKey: ['groupMemberships', groupId],
    queryFn: async () => {
      try { const all = await base44.entities.GroupMember.list(); return all.filter(m => m.group_id === groupId); }
      catch { return []; }
    },
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['groupPosts', groupId],
    queryFn: async () => {
      try { return await base44.entities.Post.filter({ group_id: groupId }, '-created_date'); }
      catch { return []; }
    },
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      try { return await base44.entities.Comment.list('-created_date', 200); }
      catch { return []; }
    },
  });

  const { data: challenges = [] } = useQuery({
    queryKey: ['groupChallenges', groupId],
    queryFn: async () => {
      try { const all = await base44.entities.Challenge.list('-created_date'); return all.filter(c => c.group_id === groupId); }
      catch { return []; }
    },
  });

  const { data: challengeParticipants = [] } = useQuery({
    queryKey: ['challengeParticipants', groupId],
    queryFn: async () => {
      try { const all = await base44.entities.ChallengeParticipant.list(); return all.filter(p => challenges.some(c => c.id === p.challenge_id)); }
      catch { return []; }
    },
    enabled: challenges.length > 0
  });

  const joinGroup = useMutation({
    mutationFn: () => base44.entities.GroupMember.create({
      group_id: groupId,
      user_email: user.email,
      role: 'member'
    }),
    onSuccess: async () => {
      await base44.entities.StudyGroup.update(groupId, {
        member_count: (group?.member_count || 0) + 1
      });
      queryClient.invalidateQueries(['groupMemberships']);
      queryClient.invalidateQueries(['group']);
    },
    onError: () => toast.error('Failed to join group'),
  });

  const createPost = useMutation({
    mutationFn: (data) => base44.entities.Post.create({
      ...data,
      group_id: groupId,
      user_name: user?.full_name || user?.email || 'Anonymous'
    }),
    onSuccess: () => queryClient.invalidateQueries(['groupPosts']),
    onError: () => toast.error('Failed to create post'),
  });

  const updatePost = useMutation({
    mutationFn: ({ id, likes }) => base44.entities.Post.update(id, { likes }),
    onSuccess: () => queryClient.invalidateQueries(['groupPosts']),
    onError: () => {},
  });

  const createComment = useMutation({
    mutationFn: ({ postId, content }) => base44.entities.Comment.create({
      post_id: postId,
      content,
      user_name: user?.full_name || user?.email || 'Anonymous'
    }),
    onSuccess: () => queryClient.invalidateQueries(['comments']),
    onError: () => toast.error('Failed to post comment'),
  });

  const createChallenge = useMutation({
    mutationFn: (data) => base44.entities.Challenge.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['groupChallenges']);
      setShowCreateChallenge(false);
    },
    onError: () => toast.error('Failed to create challenge'),
  });

  const joinChallenge = useMutation({
    mutationFn: async (challengeId) => {
      await base44.entities.ChallengeParticipant.create({
        challenge_id: challengeId,
        user_email: user.email,
        user_name: user.full_name || user.email,
        current_progress: 0,
        progress_percentage: 0,
        progress_logs: []
      });
      const challenge = challenges.find(c => c.id === challengeId);
      await base44.entities.Challenge.update(challengeId, {
        participant_count: (challenge?.participant_count || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['groupChallenges']);
      queryClient.invalidateQueries(['challengeParticipants']);
    },
    onError: () => toast.error('Failed to join challenge'),
  });

  if (groupLoading) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center">

      {/* ── Standard Header ── */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#FAD98D]/20 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white dark:text-white">Group</h1>
            <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">Study & share together</p>
          </div>
        </div>
      </div>

        <Loader2 className="w-8 h-8 animate-spin text-[#c9a227]" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex flex-col items-center justify-center gap-4">
        <p className="text-[#0A1A2F]/50 dark:text-white/50 font-medium">Group not found</p>
        <button onClick={() => navigate(-1)} className="text-sm text-[#c9a227] font-bold">← Go back</button>
      </div>
    );
  }

  const isMember = user && memberships.some(m => m.user_email === user.email);
  const isAdmin  = user && memberships.some(m => m.user_email === user.email && m.role === 'admin');
  const cat      = getCat(group.category);
  const lastPost = posts[0]?.created_date;
  const activeChallenges = challenges.filter(c => c.status !== 'completed');

  const handleLike = (postId, isLiked) => {
    const post = posts.find(p => p.id === postId);
    if (post) updatePost.mutate({ id: postId, likes: (post.likes || 0) + (isLiked ? 1 : -1) });
  };

  const handleComment = (postId, content) => createComment.mutate({ postId, content });

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">

      {/* ── Hero ── */}
      <div className="relative h-52 overflow-hidden">
        {group.cover_image ? (
          <img src={group.cover_image} alt={group.name}
            className="w-full h-full object-cover"
            onError={e => { e.target.style.display = 'none'; }} />
        ) : null}
        {/* Always-on gradient overlay (also acts as full bg if no image) */}
        <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} ${group.cover_image ? 'opacity-75' : 'opacity-100'}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Back button */}
        <button onClick={() => window.history.back()}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Member + create actions for members */}
        {isMember && (
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => setShowCreatePost(true)}
              className="h-9 px-3 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5 hover:bg-white/30 transition-colors border border-white/20">
              <Plus className="w-3.5 h-3.5" /> Post
            </button>
            <button onClick={() => setShowCreateChallenge(true)}
              className="h-9 px-3 rounded-full bg-[#c9a227]/80 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#c9a227] transition-colors">
              <Trophy className="w-3.5 h-3.5" /> Challenge
            </button>
          </div>
        )}

        {/* Group identity */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-2xl">{cat.emoji}</span>
            <span className="text-white/70 text-xs font-semibold bg-black/20 px-2 py-0.5 rounded-full">
              {cat.label}
            </span>
            {group.is_private
              ? <span className="flex items-center gap-1 text-white/60 text-xs"><Lock className="w-3 h-3" /> Private</span>
              : <span className="flex items-center gap-1 text-white/60 text-xs"><Globe className="w-3 h-3" /> Public</span>}
            {isAdmin && (
              <span className="flex items-center gap-1 text-[#FAD98D] text-xs font-bold bg-black/20 px-2 py-0.5 rounded-full">
                <Crown className="w-3 h-3" /> Admin
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-white leading-tight">{group.name}</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">

        {/* ── Group info strip ── */}
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#AFC7E3]/20 p-4 space-y-3">
          {group.description && (
            <p className="text-sm text-[#0A1A2F]/65 dark:text-white/65 leading-relaxed">{group.description}</p>
          )}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <MemberAvatarStrip memberships={memberships} totalCount={group.member_count || memberships.length} />
            <div className="flex items-center gap-3 text-[10px] text-[#0A1A2F]/35 dark:text-white/35 font-semibold">
              {lastPost && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {timeAgo(lastPost)}
                </span>
              )}
              {activeChallenges.length > 0 && (
                <span className="flex items-center gap-1 text-[#c9a227]">
                  <Zap className="w-3 h-3" /> {activeChallenges.length} active challenge{activeChallenges.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Member management for members */}
          {isMember && <MemberManagement groupId={groupId} isAdmin={isAdmin} />}
        </div>

        {/* ── Join CTA for non-members ── */}
        {!isMember && user && (
          <JoinCard group={group} onJoin={() => joinGroup.mutate()} joining={joinGroup.isPending} cat={cat} />
        )}

        {/* ── Challenges (collapsible, always first) ── */}
        {(challenges.length > 0 || isMember) && (
          <div>
            <button onClick={() => setShowChallenges(s => !s)}
              className="w-full flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-[#FAD98D]" />
              <span className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">
                Challenges
                {challenges.length > 0 && <span className="text-[#0A1A2F]/30 dark:text-white/30 font-normal ml-1">({challenges.length})</span>}
              </span>
              {activeChallenges.length > 0 && (
                <span className="text-[10px] font-bold text-[#c9a227] bg-white dark:bg-white/5 border border-[#FAD98D]/30 px-2 py-0.5 rounded-full">
                  {activeChallenges.length} active
                </span>
              )}
              {showChallenges
                ? <ChevronUp className="w-4 h-4 text-[#0A1A2F]/25 dark:text-white/25 ml-auto" />
                : <ChevronDown className="w-4 h-4 text-[#0A1A2F]/25 dark:text-white/25 ml-auto" />}
            </button>

            <AnimatePresence>
              {showChallenges && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-3">
                  {challenges.length === 0
                    ? <EmptyChallenges isMember={isMember} onCreate={() => setShowCreateChallenge(true)} />
                    : challenges.map((challenge, index) => {
                        const participation = challengeParticipants.find(
                          p => p.challenge_id === challenge.id && p.user_email === user?.email
                        );
                        return (
                          <ChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            participation={participation}
                            onJoin={() => joinChallenge.mutate(challenge.id)}
                            onClick={() => navigate(createPageUrl(`ChallengeDetailPage?id=${challenge.id}`))}
                            index={index}
                          />
                        );
                      })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── Feed ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-[#AFC7E3]" />
            <h2 className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">
              Group Feed
              {posts.length > 0 && <span className="text-[#0A1A2F]/30 dark:text-white/30 font-normal ml-1">({posts.length})</span>}
            </h2>
            {isMember && (
              <button onClick={() => setShowCreatePost(true)}
                className="ml-auto flex items-center gap-1 text-xs font-bold text-[#AFC7E3] hover:text-[#0A1A2F]/60 dark:text-white/60 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Post
              </button>
            )}
          </div>

          {posts.length === 0
            ? <EmptyFeed isMember={isMember} onPost={() => setShowCreatePost(true)} />
            : (
              <div className="space-y-4">
                {posts.map((post, index) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    comments={comments}
                    onLike={handleLike}
                    onComment={handleComment}
                    index={index}
                    user={user}
                  />
                ))}
              </div>
            )}
        </div>

      </div>

      {/* ── Modals ── */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={(data) => createPost.mutate(data)}
      />
      <CreateChallengeModal
        isOpen={showCreateChallenge}
        onClose={() => setShowCreateChallenge(false)}
        onSubmit={(data) => createChallenge.mutate(data)}
        groupId={groupId}
      />
    </div>
  );
}

