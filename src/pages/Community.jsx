import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AnimatePresence } from 'framer-motion';
import {
  Sparkles, Users, TrendingUp, Plus, Wand2, PenLine,
  Search, MessageCircle, UserPlus
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import CommunityFeed        from '@/components/community/CommunityFeed';
import GroupChallenges       from '@/components/community/GroupChallenges';
import ShareMilestoneModal   from '@/components/community/ShareMilestoneModal';
import AIBlogWriter          from '@/components/community/AIBlogWriter';
import ModerationPanel       from '@/components/community/ModerationPanel';
import BlogFeed              from '@/components/community/BlogFeed';
import GroupCard             from '@/components/groups/GroupCard';

// ── Category chips data ───────────────────────────────────────────────────────
const CATEGORIES = [
  { value: 'all',        label: 'All'        },
  { value: 'bible_study',label: '📖 Bible'   },
  { value: 'prayer',     label: '🙏 Prayer'  },
  { value: 'workout',    label: '💪 Workout' },
  { value: 'wellness',   label: '🧘 Wellness'},
  { value: 'cooking',    label: '🍳 Cooking' },
  { value: 'youth',      label: '👥 Youth'   },
  { value: 'marriage',   label: '💑 Marriage'},
  { value: 'other',      label: '💬 Other'   },
];

// ── Tab bar ───────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'feed',       label: 'Feed',       icon: Sparkles  },
  { id: 'groups',     label: 'Groups',     icon: Users     },
  { id: 'blog',       label: 'Blog',       icon: PenLine   },
  { id: 'challenges', label: 'Challenges', icon: TrendingUp},
];

function TabBar({ active, onChange, isAdmin }) {
  const tabs = isAdmin
    ? [...TABS, { id: 'moderation', label: 'Moderate', icon: Users }]
    : TABS;
  return (
    <div id="tour-community-groups" className="flex gap-1.5">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button key={id} onClick={() => onChange(id)}
          className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-[11px] font-bold transition-all ${
            active === id
              ? 'bg-gradient-to-b from-[#c9a227] to-[#FAD98D] text-white shadow-sm'
              : 'bg-white text-[#0A1A2F]/45 border border-[#FAD98D]/25 hover:text-[#0A1A2F]/65'
          }`}>
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex-shrink-0 transition-colors ${
        active
          ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]'
          : 'bg-white text-[#0A1A2F]/50 border-[#FAD98D]/30 hover:border-[#c9a227]/40'
      }`}>
      {children}
    </button>
  );
}

// ── Groups section (absorbed from Groups page) ────────────────────────────────
function GroupsTab({ user }) {
  const navigate      = useNavigate();
  const queryClient   = useQueryClient();
  const [subTab,      setSubTab]      = useState('my');
  const [search,      setSearch]      = useState('');
  const [category,    setCategory]    = useState('all');
  const [showCreate,  setShowCreate]  = useState(false);
  const [newGroup,    setNewGroup]    = useState({ name: '', description: '', category: 'other', is_private: false });

  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => { try { return await base44.entities.StudyGroup.list('-created_date'); } catch { return []; } },
  });

  // Fixed: filter by user_email, not list() all members
  const { data: memberships = [] } = useQuery({
    queryKey: ['memberships', user?.email],
    queryFn:  () => base44.entities.GroupMember.filter({ user_email: user.email }),
    enabled:  !!user?.email,
  });

  const createGroup = useMutation({
    mutationFn: async (data) => {
      const group = await base44.entities.StudyGroup.create(data);
      await base44.entities.GroupMember.create({ group_id: group.id, user_email: user.email, role: 'admin' });
      return group;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['groups']);
      queryClient.invalidateQueries(['memberships']);
      setShowCreate(false);
      setNewGroup({ name: '', description: '', category: 'other', is_private: false });
    },
    onError: () => toast.error('Failed to create group — please try again'),
  });

  const myGroupIds    = memberships.map(m => m.group_id);
  const myGroups      = groups.filter(g =>  myGroupIds.includes(g.id));
  const publicGroups  = groups.filter(g => !g.is_private && !myGroupIds.includes(g.id));

  const applyFilters = (list) => {
    let out = list;
    if (category !== 'all') out = out.filter(g => g.category === category);
    if (search.trim())      out = out.filter(g =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description?.toLowerCase().includes(search.toLowerCase())
    );
    return out;
  };

  const displayed = applyFilters(subTab === 'my' ? myGroups : publicGroups);

  return (
    <div className="space-y-4">
      {/* My / Discover toggle */}
      <div className="flex gap-2">
        {[['my', `My Groups (${myGroups.length})`], ['discover', 'Discover']].map(([val, label]) => (
          <button key={val} onClick={() => setSubTab(val)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              subTab === val
                ? 'bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white shadow-sm'
                : 'bg-white text-[#0A1A2F]/50 border border-[#FAD98D]/25'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Search + create */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A1A2F]/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search groups…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-[#FAD98D]/25 text-sm text-[#0A1A2F] placeholder-[#0A1A2F]/35 focus:outline-none focus:border-[#c9a227]/50" />
        </div>
        <button onClick={() => setShowCreate(true)}
          className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#FAD98D] flex items-center justify-center text-white shadow-sm hover:opacity-90 flex-shrink-0">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(({ value, label }) => (
          <Chip key={value} active={category === value} onClick={() => setCategory(value)}>{label}</Chip>
        ))}
      </div>

      {/* Grid */}
      {subTab === 'my' && myGroups.length === 0 ? (
        <div className="bg-gradient-to-br from-[#FAD98D]/20 to-[#AFC7E3]/15 border border-[#FAD98D]/25 rounded-2xl p-6 text-center">
          <p className="text-3xl mb-3">🤝</p>
          <h3 className="font-bold text-[#0A1A2F] mb-1">Grow together</h3>
          <p className="text-sm text-[#0A1A2F]/60 mb-4">Join a group to share your journey and encourage others.</p>
          <div className="flex gap-2">
            <button onClick={() => setSubTab('discover')}
              className="flex-1 bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white text-sm font-semibold py-2.5 rounded-xl hover:opacity-90">
              Browse Groups
            </button>
            <button onClick={() => setShowCreate(true)}
              className="flex-1 bg-white text-[#0A1A2F]/70 text-sm font-semibold py-2.5 rounded-xl border border-[#FAD98D]/30 hover:bg-[#FAD98D]/10">
              Create Group
            </button>
          </div>
        </div>
      ) : displayed.length === 0 ? (
        <p className="text-center text-[#0A1A2F]/40 text-sm py-8">No groups match this filter</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {displayed.map((group, i) => (
            <GroupCard key={group.id} group={group} index={i}
              isMember={myGroupIds.includes(group.id)}
              onClick={() => navigate(createPageUrl(`GroupDetail?id=${group.id}`))} />
          ))}
        </div>
      )}

      {/* Create group modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-[#F2F6FA] border border-[#FAD98D]/30">
          <DialogHeader>
            <DialogTitle className="text-[#0A1A2F]">Create Study Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-[#0A1A2F]/70 text-sm">Group Name</Label>
              <input
                placeholder="e.g., Daily Bible Study"
                value={newGroup.name}
                onChange={e => setNewGroup({ ...newGroup, name: e.target.value })}
                maxLength={80}
                className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-[#FAD98D]/30 bg-[#F2F6FA] text-sm text-[#0A1A2F] focus:outline-none focus:border-[#c9a227]/50"
              />
            </div>
            <div>
              <Label className="text-[#0A1A2F]/70 text-sm">Description</Label>
              <Textarea
                placeholder="What is this group about?"
                value={newGroup.description}
                onChange={e => setNewGroup({ ...newGroup, description: e.target.value })}
                maxLength={500}
                className="mt-1.5 min-h-[70px] border-[#FAD98D]/30 bg-[#F2F6FA] text-sm resize-none"
              />
            </div>
            <div>
              <Label className="text-[#0A1A2F]/70 text-sm mb-2 block">Category</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.filter(c => c.value !== 'all').map(({ value, label }) => (
                  <button key={value} onClick={() => setNewGroup({ ...newGroup, category: value })}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      newGroup.category === value
                        ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]'
                        : 'bg-white text-[#0A1A2F]/50 border-[#FAD98D]/30'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-semibold text-[#0A1A2F]">Private Group</p>
                <p className="text-xs text-[#0A1A2F]/45">Only invited members can join</p>
              </div>
              <Switch
                checked={newGroup.is_private}
                onCheckedChange={checked => setNewGroup({ ...newGroup, is_private: checked })}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowCreate(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#FAD98D]/30 text-sm font-semibold text-[#0A1A2F]/60 hover:bg-[#FAD98D]/10">
                Cancel
              </button>
              <button
                onClick={() => newGroup.name.trim() && createGroup.mutate(newGroup)}
                disabled={!newGroup.name.trim() || createGroup.isPending}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                {createGroup.isPending ? 'Creating…' : 'Create Group'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Community() {
  const [user,            setUser]           = useState(null);
  const [activeTab,       setActiveTab]      = useState('feed');
  const [showShareModal,  setShowShareModal]  = useState(false);
  const [showBlogWriter,  setShowBlogWriter]  = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-28">

      {/* ── Header ── */}
      <div className="bg-white border-b border-[#FAD98D]/20 px-4 pt-5 pb-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#FAD98D] flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#0A1A2F]">Community</h1>
                <p className="text-xs text-[#0A1A2F]/45">Grow together, support each other</p>
              </div>
            </div>

            {/* Contextual action button */}
            {activeTab === 'feed' && (
              <button onClick={() => setShowShareModal(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white text-xs font-bold px-3 py-2 rounded-xl hover:opacity-90 shadow-sm">
                <Plus className="w-3.5 h-3.5" /> Share
              </button>
            )}
            {activeTab === 'blog' && (
              <button onClick={() => setShowBlogWriter(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#3C4E53] to-[#AFC7E3] text-white text-xs font-bold px-3 py-2 rounded-xl hover:opacity-90 shadow-sm">
                <Wand2 className="w-3.5 h-3.5" /> Write
              </button>
            )}
          </div>

          {/* Quick links — Friends & Messages */}
          <div className="flex gap-2 mb-3">
            <Link to={createPageUrl('Friends')} className="flex-1">
              <div className="flex items-center gap-2 bg-[#F2F6FA] rounded-xl px-3 py-2.5 border border-[#D9B878]/15 hover:border-[#c9a227]/30 transition-all">
                <UserPlus className="w-4 h-4 text-[#c9a227]" />
                <span className="text-xs font-semibold text-[#0A1A2F]">Friends</span>
              </div>
            </Link>
            <Link to={createPageUrl('Messages')} className="flex-1">
              <div className="flex items-center gap-2 bg-[#F2F6FA] rounded-xl px-3 py-2.5 border border-[#D9B878]/15 hover:border-[#c9a227]/30 transition-all">
                <MessageCircle className="w-4 h-4 text-[#c9a227]" />
                <span className="text-xs font-semibold text-[#0A1A2F]">Messages</span>
              </div>
            </Link>
          </div>

          <TabBar active={activeTab} onChange={setActiveTab} isAdmin={user?.role === 'admin' || user?.is_admin} />

          {/* Community Guidelines */}
          <div className="mt-2 flex items-center justify-center gap-2 py-1.5">
            <Link to={createPageUrl('TermsAndConditions')} className="text-[10px] text-[#0A1A2F]/35 hover:text-[#c9a227] transition-colors font-medium">
              Community Guidelines
            </Link>
            <span className="text-[#0A1A2F]/15">|</span>
            <span className="text-[10px] text-[#0A1A2F]/35">Be kind, be respectful, be Christ-like</span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-lg mx-auto px-4 py-4">
        {activeTab === 'feed'       && <CommunityFeed user={user} />}
        {activeTab === 'groups'     && <GroupsTab user={user} />}
        {activeTab === 'blog'       && <BlogFeed user={user} onWriteWithAI={() => setShowBlogWriter(true)} />}
        {activeTab === 'challenges' && <GroupChallenges user={user} />}
        {activeTab === 'moderation' && <ModerationPanel user={user} />}
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showBlogWriter && (
          <AIBlogWriter user={user} onClose={() => setShowBlogWriter(false)} onPublished={() => setShowBlogWriter(false)} />
        )}
      </AnimatePresence>

      {showShareModal && (
        <ShareMilestoneModal
          user={user}
          onClose={() => setShowShareModal(false)}
          onSuccess={() => {
            setShowShareModal(false);
            queryClient.invalidateQueries({ queryKey: ['communityShares'] });
          }}
        />
      )}
    </div>
  );
}
