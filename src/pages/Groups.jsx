import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import {
  Plus, Search, ArrowLeft, X, Users, Lock, Globe,
  ChevronRight, Loader2, Star, SlidersHorizontal
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import GroupCard from '@/components/groups/GroupCard';
import { toast } from 'sonner';
import { SEED_GROUPS } from '@/components/groups/GroupSeed';

// ─── Category config ─────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: 'all',         label: 'All',         emoji: '✨' },
  { value: 'bible_study', label: 'Bible Study',  emoji: '📖' },
  { value: 'prayer',      label: 'Prayer',       emoji: '🙏' },
  { value: 'wellness',    label: 'Wellness',     emoji: '🧘' },
  { value: 'workout',     label: 'Workout',      emoji: '💪' },
  { value: 'cooking',     label: 'Cooking',      emoji: '🍳' },
  { value: 'marriage',    label: 'Marriage',     emoji: '💑' },
  { value: 'parents',     label: 'Parents',      emoji: '👨‍👩‍👧‍👦' },
  { value: 'youth',       label: 'Youth',        emoji: '👥' },
  { value: 'other',       label: 'Other',        emoji: '💬' },
];

const CAT_GRADIENT = {
  bible_study: 'from-[#c9a227] to-[#FAD98D]',
  workout:     'from-[#0A1A2F] to-[#0A1A2F]',
  cooking:     'from-[#FAD98D] to-[#FAD98D]',
  prayer:      'from-[#AFC7E3] to-[#3C4E53]',
  wellness:    'from-[#3C4E53] to-[#AFC7E3]',
  youth:       'from-[#c9a227] to-[#AFC7E3]',
  parents:     'from-[#FAD98D] to-[#AFC7E3]',
  marriage:    'from-[#c9a227] to-[#0A1A2F]',
  other:       'from-[#3C4E53] to-[#FAD98D]',
};

const SORT_OPTIONS = [
  { value: 'popular',  label: 'Most Popular' },
  { value: 'newest',   label: 'Newest' },
  { value: 'members',  label: 'Most Members' },
];

// ─── Create group slide-up panel ─────────────────────────────────────────────
function CreateGroupPanel({ isOpen, onClose, onSubmit, creating }) {
  const [form, setForm] = useState({ name: '', description: '', category: 'other', is_private: false });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const canSubmit = form.name.trim().length > 0;

  const handleSubmit = () => {
    if (canSubmit) {
      onSubmit(form);
      setForm({ name: '', description: '', category: 'other', is_private: false });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
          <motion.div key="panel"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-white/5 rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto"
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-full" />
            </div>
            <div className="px-5 pb-10 pt-3 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#0A1A2F] dark:text-white dark:text-white">Create a Group</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center">
                  <X className="w-4 h-4 text-[#0A1A2F]/50 dark:text-white/50" />
                </button>
              </div>

              <div>
                <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-1.5">Group Name *</p>
                <input type="text" placeholder="e.g., Morning Prayer Warriors"
                  value={form.name} onChange={e => set('name', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#F2F6FA] bg-[#F2F6FA] dark:bg-[#0A1A2F] text-sm text-[#0A1A2F] dark:text-white placeholder-[#0A1A2F]/25 focus:outline-none focus:border-[#FAD98D]/60 transition-colors" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-1.5">Description</p>
                <textarea placeholder="What is this group about? Who should join?"
                  value={form.description} onChange={e => set('description', e.target.value)}
                  rows={3}
                  className="w-full resize-none px-3 py-2.5 rounded-xl border border-[#F2F6FA] bg-[#F2F6FA] dark:bg-[#0A1A2F] text-sm text-[#0A1A2F] dark:text-white placeholder-[#0A1A2F]/25 focus:outline-none focus:border-[#FAD98D]/60 transition-colors leading-relaxed" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.filter(c => c.value !== 'all').map(cat => (
                    <button key={cat.value} onClick={() => set('category', cat.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                        form.category === cat.value
                          ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]'
                          : 'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border-[#F2F6FA] hover:border-[#FAD98D]/40 dark:border-[#FAD98D]/15 dark:border-[#FAD98D]/8'
                      }`}>
                      <span>{cat.emoji}</span> {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {form.name.trim() && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl overflow-hidden border border-[#F2F6FA]">
                  <div className={`h-16 bg-gradient-to-br ${CAT_GRADIENT[form.category] || CAT_GRADIENT.other} flex items-center justify-center`}>
                    <span className="text-3xl opacity-70">{CATEGORIES.find(c => c.value === form.category)?.emoji || '💬'}</span>
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">{form.name}</p>
                    {form.description && <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45 mt-0.5 line-clamp-1">{form.description}</p>}
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-between bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl p-3.5">
                <div className="flex items-center gap-2.5">
                  {form.is_private ? <Lock className="w-4 h-4 text-[#0A1A2F]/50 dark:text-white/50" /> : <Globe className="w-4 h-4 text-[#0A1A2F]/50 dark:text-white/50" />}
                  <div>
                    <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white dark:text-white">{form.is_private ? 'Private Group' : 'Public Group'}</p>
                    <p className="text-xs text-[#0A1A2F]/40 dark:text-white/40">{form.is_private ? 'Only invited members can join' : 'Anyone can discover and join'}</p>
                  </div>
                </div>
                <Switch checked={form.is_private} onCheckedChange={v => set('is_private', v)} />
              </div>

              <button onClick={handleSubmit} disabled={!canSubmit || creating}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white font-bold text-sm disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 min-h-[44px] min-w-[44px]">
                {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : <><Plus className="w-4 h-4" /> Create Group</>}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── My group compact row ─────────────────────────────────────────────────────
function MyGroupRow({ group, onClick, index }) {
  const gradient = CAT_GRADIENT[group.category] || CAT_GRADIENT.other;
  const cat = CATEGORIES.find(c => c.value === group.category) || CATEGORIES[0];
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-white dark:bg-white/5 rounded-2xl border border-[#AFC7E3]/20 p-3.5 hover:border-[#FAD98D]/40 dark:border-[#FAD98D]/15 dark:border-[#FAD98D]/8 hover:shadow-sm dark:shadow-none transition-all text-left"
    >
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
        <span className="text-xl">{cat.emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#0A1A2F] dark:text-white truncate">{group.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-[#0A1A2F]/35 dark:text-white/35 flex items-center gap-1">
            <Users className="w-3 h-3" /> {(group.member_count || 0).toLocaleString()}
          </span>
          {group.is_private && (
            <span className="text-[10px] text-[#0A1A2F]/30 dark:text-white/30 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Private
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-[#0A1A2F]/20 dark:text-white/20 flex-shrink-0" />
    </motion.button>
  );
}

// ─── Featured spotlight card ──────────────────────────────────────────────────
function FeaturedCard({ group, onClick }) {
  const gradient = CAT_GRADIENT[group.category] || CAT_GRADIENT.other;
  const cat = CATEGORIES.find(c => c.value === group.category);
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative flex-shrink-0 w-56 bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 hover:shadow-md dark:shadow-none transition-all text-left"
    >
      <div className={`h-20 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <span className="text-3xl opacity-60">{cat?.emoji || '💬'}</span>
      </div>
      <div className="absolute top-2 left-2">
        <span className="flex items-center gap-1 bg-[#FAD98D] text-[#0A1A2F] dark:text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
          <Star className="w-2.5 h-2.5" /> Featured
        </span>
      </div>
      <div className="p-3">
        <p className="text-xs font-bold text-[#0A1A2F] dark:text-white line-clamp-1 mb-0.5">{group.name}</p>
        <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40 flex items-center gap-1">
          <Users className="w-2.5 h-2.5" /> {(group.member_count || 0).toLocaleString()} members
        </p>
      </div>
    </motion.button>
  );
}

// ─── Seeding banner ───────────────────────────────────────────────────────────
function SeedBanner({ onSeed, seeding }) {
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#0A1A2F] to-[#0A1A2F] rounded-2xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 rounded-xl flex items-center justify-center flex-shrink-0">
        <Users className="w-5 h-5 text-[#FAD98D]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white">Populate the community</p>
        <p className="text-xs text-white/45">Add 32 starter groups across all categories</p>
      </div>
      <button onClick={onSeed} disabled={seeding}
        className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-[#FAD98D] text-[#0A1A2F] dark:text-white text-xs font-bold disabled:opacity-50 hover:bg-[#c9a227] transition-colors flex items-center gap-1.5 min-h-[44px] min-w-[44px]">
        {seeding ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Adding…</> : 'Add Groups'}
      </button>
    </motion.div>
  );
}

// ─── Sort dropdown ────────────────────────────────────────────────────────────
function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find(o => o.value === value);
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xs font-bold text-[#0A1A2F]/50 dark:text-white/50 hover:text-[#0A1A2F]/80 dark:text-white/80 transition-colors">
        <SlidersHorizontal className="w-3.5 h-3.5" />
        {current?.label}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 top-6 z-20 bg-white dark:bg-white/5 rounded-xl shadow-lg dark:shadow-none border border-[#F2F6FA] overflow-hidden min-w-[140px]">
              {SORT_OPTIONS.map(opt => (
                <button key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors ${
                    opt.value === value ? 'bg-white dark:bg-white/5 text-[#c9a227]' : 'text-[#0A1A2F]/60 dark:text-white/60 hover:bg-[#F2F6FA] dark:bg-[#0A1A2F]'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Groups() {
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sort, setSort] = useState('popular');
  const [seeding, setSeeding] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const searchRef = useRef(null);

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  // ── Seed 32 starter groups ─────────────────────────────────────────────────
  const handleSeed = async () => {
    if (seeding) return;
    setSeeding(true);
    let created = 0;
    for (const g of SEED_GROUPS) {
      try {
        await base44.entities.StudyGroup.create(g);
        created++;
      } catch (e) {
        console.error('Failed to create group:', g.name, e);
      }
    }
    setSeeding(false);
    queryClient.invalidateQueries(['groups']);
    if (created > 0) toast.success(`${created} groups added!`);
    else toast.error('No groups were created — check console for errors');
  };

  const { data: groups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: () => base44.entities.StudyGroup.list('-created_date')
  });



  const { data: memberships = [] } = useQuery({
    queryKey: ['memberships'],
    queryFn: () => base44.entities.GroupMember.list(),
    enabled: !!user
  });

  const createGroup = useMutation({
    mutationFn: async (data) => {
      const group = await base44.entities.StudyGroup.create(data);
      await base44.entities.GroupMember.create({ group_id: group.id, user_email: user.email, role: 'admin' });
      return group;
    },
    onSuccess: (group) => {
      queryClient.invalidateQueries(['groups']);
      queryClient.invalidateQueries(['memberships']);
      setShowCreate(false);
      toast.success('Group created!');
      navigate(createPageUrl(`GroupDetail?id=${group.id}`));
    },
    onError: () => toast.error('Failed to create group')
  });

  const myGroupIds = new Set(memberships.map(m => m.group_id));
  const myGroups = groups.filter(g => myGroupIds.has(g.id));
  const discoverGroups = groups.filter(g => !g.is_private && !myGroupIds.has(g.id));

  // Sorting
  const sortGroups = (list) => {
    if (sort === 'members')  return [...list].sort((a, b) => (b.member_count || 0) - (a.member_count || 0));
    if (sort === 'newest')   return [...list]; // already sorted by created_date desc from API
    // popular: member_count weighted + recency
    return [...list].sort((a, b) => (b.member_count || 0) - (a.member_count || 0));
  };

  const applyFilters = (list) => {
    let out = list;
    if (categoryFilter !== 'all') out = out.filter(g => g.category === categoryFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(g => g.name?.toLowerCase().includes(q) || g.description?.toLowerCase().includes(q));
    }
    return sortGroups(out);
  };

  const filteredMyGroups = applyFilters(myGroups);
  const filteredDiscover = applyFilters(discoverGroups);
  const isFiltering = search.trim() || categoryFilter !== 'all';

  // Featured: top 3 by member_count from discover
  const featured = [...discoverGroups]
    .sort((a, b) => (b.member_count || 0) - (a.member_count || 0))
    .slice(0, 3);

    if (!user) {
      return (
        <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#c9a227] border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#AFC7E3]/20 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to={createPageUrl('Community')}
            className="w-9 h-9 rounded-full bg-[#F2F6FA] dark:bg-[#0A1A2F] hover:bg-white dark:bg-white/5 flex items-center justify-center transition-colors flex-shrink-0">
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white dark:text-white" />
          </Link>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A1A2F]/30 dark:text-white/30" />
            <input ref={searchRef} type="text" placeholder="Search groups…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#F2F6FA] dark:bg-[#0A1A2F] border border-[#F2F6FA] text-sm text-[#0A1A2F] dark:text-white placeholder-[#0A1A2F]/30 focus:outline-none focus:border-[#FAD98D]/50 dark:border-[#FAD98D]/20 transition-colors" />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-[#0A1A2F]/30 dark:text-white/30" />
              </button>
            )}
          </div>
          <button onClick={() => setShowCreate(true)}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FAD98D] to-[#c9a227] flex items-center justify-center shadow-sm dark:shadow-none hover:opacity-90 transition-opacity flex-shrink-0">
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* ── Category chips ── */}
      <div className="bg-white dark:bg-white/5 border-b border-[#AFC7E3]/10 px-4 py-3">
        <div className="max-w-lg mx-auto overflow-x-auto scrollbar-none">
          <div className="flex gap-2 w-max">
            {CATEGORIES.map(cat => (
              <button key={cat.value} onClick={() => setCategoryFilter(cat.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === cat.value
                    ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]'
                    : 'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border-[#F2F6FA] hover:border-[#FAD98D]/40 dark:border-[#FAD98D]/15 dark:border-[#FAD98D]/8'
                }`}>
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-6">

        {/* ── Seed groups banner ── */}
        <SeedBanner onSeed={handleSeed} seeding={seeding} />

        {/* ── Featured spotlight (only when no filters, groups exist) ── */}
        {!isFiltering && featured.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-[#FAD98D]" />
              <h2 className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">Featured Groups</h2>
            </div>
            <div className="overflow-x-auto scrollbar-none -mx-4 px-4">
              <div className="flex gap-3 w-max pb-1">
                {featured.map(group => (
                  <FeaturedCard key={group.id} group={group}
                    onClick={() => navigate(createPageUrl(`GroupDetail?id=${group.id}`))} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── My Groups ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">
              My Groups
              {myGroups.length > 0 && <span className="text-[#0A1A2F]/30 dark:text-white/30 font-normal ml-1">({myGroups.length})</span>}
            </h2>
            {myGroups.length > 0 && (
              <button onClick={() => setShowCreate(true)}
                className="text-xs font-bold text-[#c9a227] hover:text-[#C9A227] transition-colors flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> New
              </button>
            )}
          </div>

          {myGroups.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-white/5 rounded-2xl border border-[#AFC7E3]/20 p-6 text-center">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-bold text-[#0A1A2F] dark:text-white mb-1">Grow together</h3>
              <p className="text-sm text-[#0A1A2F]/45 dark:text-white/45 leading-relaxed mb-4">
                Join a group to share your journey, stay accountable, and encourage others on the same path.
              </p>
              <div className="flex gap-2">
                <button onClick={() => { setCategoryFilter('all'); searchRef.current?.focus(); }}
                  className="flex-1 py-2.5 rounded-xl bg-[#F2F6FA] dark:bg-[#0A1A2F] text-[#0A1A2F]/60 dark:text-white/60 font-semibold text-sm hover:bg-white dark:bg-white/5 transition-colors">
                  Browse Below
                </button>
                <button onClick={() => setShowCreate(true)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white font-bold text-sm hover:opacity-90 transition-opacity">
                  Create One
                </button>
              </div>
            </motion.div>
          ) : filteredMyGroups.length === 0 ? (
            <p className="text-sm text-[#0A1A2F]/40 dark:text-white/40 text-center py-4">No groups match your filter</p>
          ) : (
            <div className="space-y-2">
              {filteredMyGroups.map((group, i) => (
                <MyGroupRow key={group.id} group={group} index={i}
                  onClick={() => navigate(createPageUrl(`GroupDetail?id=${group.id}`))} />
              ))}
            </div>
          )}
        </div>

        {/* ── Discover ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">
              {isFiltering ? 'Results' : 'Discover Groups'}
              {filteredDiscover.length > 0 && <span className="text-[#0A1A2F]/30 dark:text-white/30 font-normal ml-1">({filteredDiscover.length})</span>}
            </h2>
            {filteredDiscover.length > 0 && (
              <SortDropdown value={sort} onChange={setSort} />
            )}
          </div>

          {filteredDiscover.length === 0 ? (
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#AFC7E3]/20 p-8 text-center">
              <div className="w-12 h-12 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-[#AFC7E3]" />
              </div>
              <h3 className="font-bold text-[#0A1A2F] dark:text-white mb-1">
                {isFiltering ? 'No groups found' : 'No public groups yet'}
              </h3>
              <p className="text-sm text-[#0A1A2F]/40 dark:text-white/40 leading-relaxed mb-4">
                {isFiltering ? 'Try a different category or search term.' : 'Be the first to start a community group.'}
              </p>
              {isFiltering ? (
                <button onClick={() => { setSearch(''); setCategoryFilter('all'); }}
                  className="px-5 py-2.5 rounded-xl bg-[#F2F6FA] dark:bg-[#0A1A2F] text-[#0A1A2F]/60 dark:text-white/60 font-semibold text-sm hover:bg-white dark:bg-white/5 transition-colors">
                  Clear Filters
                </button>
              ) : (
                <button onClick={() => setShowCreate(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white font-bold text-sm hover:opacity-90 transition-opacity">
                  Create the First Group
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredDiscover.map((group, index) => (
                <GroupCard key={group.id} group={group}
                  onClick={() => navigate(createPageUrl(`GroupDetail?id=${group.id}`))}
                  index={index} isMember={false} />
              ))}
            </div>
          )}
        </div>

      </div>

      <CreateGroupPanel isOpen={showCreate} onClose={() => setShowCreate(false)}
        onSubmit={(data) => createGroup.mutate(data)} creating={createGroup.isPending} />
    </div>
  );
}
