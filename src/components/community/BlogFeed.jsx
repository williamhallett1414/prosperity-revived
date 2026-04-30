import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Heart, BookOpen, Wand2, Clock, Share2, ChevronUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { SEED_POSTS, BLOG_SEED_KEY } from '@/components/community/BlogSeed';

// ─── Topic config ─────────────────────────────────────────────────────────────
const TOPICS = {
  faith:           { label: 'Faith',          emoji: '✝️', bg: 'bg-[#FAD98D]/30 text-[#c9a227]',      accent: '#c9a227' },
  fitness:         { label: 'Fitness',         emoji: '💪', bg: 'bg-[#AFC7E3]/30 text-[#3C4E53]',      accent: '#3C4E53' },
  nutrition:       { label: 'Nutrition',       emoji: '🥗', bg: 'bg-green-50 dark:bg-green-900/20 text-green-700',          accent: '#16a34a' },
  mental_health:   { label: 'Mental Health',   emoji: '🧘', bg: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700',        accent: '#8B5CF6' },
  personal_growth: { label: 'Personal Growth', emoji: '🌱', bg: 'bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 text-[#c9a227]',      accent: '#FD9C2D' },
  relationships:   { label: 'Relationships',   emoji: '💕', bg: 'bg-pink-50 dark:bg-pink-900/20 text-pink-700',            accent: '#db2777' },
  general:         { label: 'General',         emoji: '✨', bg: 'bg-[#F2F6FA] dark:bg-[#0A1A2F] text-[#0A1A2F]/50 dark:text-white/50',     accent: '#AFC7E3' },
};

// Deterministic avatar colour from author name
const AVATAR_GRADIENTS = [
  'from-[#c9a227] to-[#FAD98D]',
  'from-[#3C4E53] to-[#AFC7E3]',
  'from-[#0A1A2F] to-[#0A1A2F]',
  'from-[#FD9C2D] to-[#c9a227]',
  'from-[#AFC7E3] to-[#3C4E53]',
  'from-[#FAD98D] to-[#FAD98D]',
];
function avatarGradient(name = '') {
  const code = [...name].reduce((s, c) => s + c.charCodeAt(0), 0);
  return AVATAR_GRADIENTS[code % AVATAR_GRADIENTS.length];
}

// Rough read-time estimate
function readTime(content = '') {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// ─── Like button with localStorage dedup ─────────────────────────────────────
function LikeButton({ post }) {
  const queryClient = useQueryClient();
  const likedKey = `liked_blog_${post.id}`;
  const [liked, setLiked] = useState(() => !!localStorage.getItem(likedKey));

  const mutation = useMutation({
    mutationFn: (isLiking) =>
      base44.entities.BlogPost.update(post.id, {
        likes: (post.likes || 0) + (isLiking ? 1 : -1),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogPosts'] }),
    onError: () => { /* like failed — UI already toggled optimistically */ },
  });

  const toggle = (e) => {
    e.stopPropagation();
    const next = !liked;
    setLiked(next);
    if (next) localStorage.setItem(likedKey, '1');
    else localStorage.removeItem(likedKey);
    mutation.mutate(next);
  };

  return (
    <button onClick={toggle}
      className={`flex items-center gap-1.5 text-xs font-semibold transition-all ${liked ? 'text-red-400' : 'text-[#0A1A2F]/35 dark:text-white/35 hover:text-red-300'}`}>
      <Heart className={`w-3.5 h-3.5 transition-all ${liked ? 'fill-red-400 scale-110' : ''}`} />
      <span>{post.likes || 0}</span>
    </button>
  );
}

// ─── Share button ─────────────────────────────────────────────────────────────
function ShareButton({ title }) {
  const share = (e) => {
    e.stopPropagation();
    const text = `"${title}" — shared from Prosperity Revived`;
    if (navigator.share) {
      navigator.share({ title, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => toast.success('Copied to clipboard'));
    }
  };
  return (
    <button onClick={share}
      className="flex items-center gap-1.5 text-xs font-semibold text-[#0A1A2F]/35 dark:text-white/35 hover:text-[#c9a227] transition-colors">
      <Share2 className="w-3.5 h-3.5" />
      Share
    </button>
  );
}

// ─── Hero card (first post) ───────────────────────────────────────────────────
function HeroBlogCard({ post }) {
  const [expanded, setExpanded] = useState(false);
  const topic   = TOPICS[post.topic] || TOPICS.general;
  const grad    = avatarGradient(post.author_name);
  const mins    = readTime(post.content);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-white/5 rounded-2xl border border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 overflow-hidden shadow-sm dark:shadow-none">

      {/* Coloured header band */}
      <div className="h-2 w-full" style={{ backgroundColor: topic.accent + '40' }} />

      <div className="p-5">
        {/* Topic + read time */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${topic.bg}`}>
            {topic.emoji} {topic.label}
          </span>
          <span className="text-[10px] text-[#0A1A2F]/30 dark:text-white/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {mins} min read
          </span>
        </div>

        {/* Title — large */}
        <h2 className="font-bold text-[#0A1A2F] dark:text-white text-base leading-snug mb-3">{post.title}</h2>

        {/* Author */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
            {(post.author_name || 'U')[0].toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold text-[#0A1A2F] dark:text-white dark:text-white">{post.author_name || 'Community Member'}</p>
            <p className="text-[10px] text-[#0A1A2F]/30 dark:text-white/30">{formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}</p>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence initial={false}>
          {!expanded ? (
            <p className="text-sm text-[#0A1A2F]/60 dark:text-white/60 leading-relaxed">
              {post.excerpt || post.content?.substring(0, 180) + '…'}
            </p>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="prose prose-sm max-w-none text-[#0A1A2F]/75 dark:text-white/75 prose-headings:text-[#0A1A2F] dark:text-white prose-headings:font-bold prose-strong:text-[#0A1A2F] dark:text-white prose-p:leading-relaxed">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#FAD98D]/10 dark:border-[#FAD98D]/5">
          <LikeButton post={post} />
          <ShareButton title={post.title} />
          <button onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-xs font-bold text-[#c9a227] hover:opacity-70 transition-opacity ml-auto">
            {expanded
              ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
              : <><BookOpen className="w-3.5 h-3.5" /> Read full post</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Standard blog card ───────────────────────────────────────────────────────
function BlogCard({ post, index }) {
  const [expanded, setExpanded] = useState(false);
  const topic = TOPICS[post.topic] || TOPICS.general;
  const grad  = avatarGradient(post.author_name);
  const mins  = readTime(post.content);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
      className="bg-white dark:bg-white/5 rounded-2xl border border-[#FAD98D]/15 dark:border-[#FAD98D]/8 overflow-hidden">
      <div className="p-4">

        {/* Author row */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {(post.author_name || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#0A1A2F] dark:text-white truncate">{post.author_name || 'Community Member'}</p>
            <p className="text-[10px] text-[#0A1A2F]/30 dark:text-white/30">{formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${topic.bg}`}>
              {topic.emoji} {topic.label}
            </span>
            <span className="text-[9px] text-[#0A1A2F]/25 dark:text-white/25 flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" /> {mins}m
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-[#0A1A2F] dark:text-white text-sm leading-snug mb-1.5">{post.title}</h3>

        {/* Excerpt / expanded content */}
        <AnimatePresence initial={false}>
          {!expanded ? (
            <p className="text-xs text-[#0A1A2F]/55 dark:text-white/55 leading-relaxed line-clamp-2">
              {post.excerpt || post.content?.substring(0, 120) + '…'}
            </p>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="prose prose-sm max-w-none text-[#0A1A2F]/70 dark:text-white/70 prose-headings:text-[#0A1A2F] dark:text-white prose-headings:font-bold prose-p:leading-relaxed text-xs">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-[#FAD98D]/10 dark:border-[#FAD98D]/5">
          <LikeButton post={post} />
          <ShareButton title={post.title} />
          <button onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-[11px] font-bold text-[#c9a227] hover:opacity-70 transition-opacity ml-auto">
            {expanded
              ? <><ChevronUp className="w-3 h-3" /> Less</>
              : <><BookOpen className="w-3 h-3" /> Read</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Seed banner ──────────────────────────────────────────────────────────────
function SeedBanner({ onSeed, seeding }) {
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#0A1A2F] to-[#0A1A2F] rounded-2xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 rounded-xl flex items-center justify-center flex-shrink-0">
        <BookOpen className="w-5 h-5 text-[#FAD98D]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white">Populate the Blog</p>
        <p className="text-xs text-white/45">Add 8 starter community posts</p>
      </div>
      <button onClick={onSeed} disabled={seeding}
        className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-[#FAD98D] text-[#0A1A2F] dark:text-white text-xs font-bold disabled:opacity-50 hover:bg-[#c9a227] transition-colors flex items-center gap-1.5">
        {seeding ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Adding…</> : 'Add Posts'}
      </button>
    </motion.div>
  );
}

// ─── Filter chip ──────────────────────────────────────────────────────────────
function FilterChip({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border flex-shrink-0 font-semibold transition-all ${
        active
          ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]'
          : 'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border-[#FAD98D]/25 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 hover:border-[#c9a227]/40'
      }`}>
      {children}
    </button>
  );
}

// ─── Main BlogFeed ────────────────────────────────────────────────────────────
export default function BlogFeed({ user, onWriteWithAI }) {
  const [filterTopic, setFilterTopic] = useState('all');
  const [seeded, setSeeded]           = useState(() => !!localStorage.getItem(BLOG_SEED_KEY));
  const [seeding, setSeeding]         = useState(false);
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.filter({ is_published: true }, '-created_date', 50),
  });

  const handleSeed = async () => {
    setSeeding(true);
    try {
      for (const p of SEED_POSTS) {
        await base44.entities.BlogPost.create(p);
      }
      localStorage.setItem(BLOG_SEED_KEY, '1');
      setSeeded(true);
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast.success(`${SEED_POSTS.length} starter posts added!`);
    } catch (e) {
      console.error(e);
      toast.error('Some posts may not have saved — try again');
    }
    setSeeding(false);
  };

  const filtered = filterTopic === 'all' ? posts : posts.filter(p => p.topic === filterTopic);
  const [hero, ...rest] = filtered;

  // Post count per topic for chip badges
  const topicCounts = Object.fromEntries(
    Object.keys(TOPICS).map(k => [k, posts.filter(p => p.topic === k).length])
  );

  return (
    <div className="space-y-4">

      {/* ── Write CTA ── */}
      {onWriteWithAI && (
        <button onClick={onWriteWithAI}
          className="w-full flex items-center gap-3 bg-gradient-to-r from-[#0A1A2F] to-[#0A1A2F] text-white rounded-2xl p-4 hover:opacity-90 transition-opacity group">
          <div className="w-9 h-9 rounded-xl bg-[#FAD98D]/25 dark:bg-[#FAD98D]/10 dark:bg-[#FAD98D]/5 flex items-center justify-center group-hover:bg-[#FAD98D]/35 transition-colors flex-shrink-0">
            <Wand2 className="w-5 h-5 text-[#FAD98D]" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm">Write with AI</p>
            <p className="text-xs text-white/55">Share your story, faith journey, or insight with the community</p>
          </div>
          <span className="ml-auto text-[#FAD98D]/60 text-xs font-semibold flex-shrink-0">→</span>
        </button>
      )}

      {/* ── Seed banner ── */}
      {!seeded && posts.length === 0 && (
        <SeedBanner onSeed={handleSeed} seeding={seeding} />
      )}

      {/* ── Topic filter chips ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        <FilterChip active={filterTopic === 'all'} onClick={() => setFilterTopic('all')}>
          ✨ All {posts.length > 0 && `(${posts.length})`}
        </FilterChip>
        {Object.entries(TOPICS).map(([val, { label, emoji }]) => {
          const count = topicCounts[val] || 0;
          if (count === 0) return null;
          return (
            <FilterChip key={val} active={filterTopic === val} onClick={() => setFilterTopic(val)}>
              {emoji} {label} {count > 0 && `(${count})`}
            </FilterChip>
          );
        })}
      </div>

      {/* ── Loading skeletons ── */}
      {isLoading && (
        <div className="space-y-3">
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5 animate-pulse border border-[#FAD98D]/15 dark:border-[#FAD98D]/8 h-40" />
          {[1, 2].map(i => <div key={i} className="bg-white dark:bg-white/5 rounded-2xl p-4 animate-pulse border border-[#FAD98D]/15 dark:border-[#FAD98D]/8 h-24" />)}
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoading && filtered.length === 0 && (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#FAD98D]/15 dark:border-[#FAD98D]/8 p-10 text-center">
          <div className="w-14 h-14 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-[#FAD98D]" />
          </div>
          <h3 className="font-bold text-[#0A1A2F] dark:text-white mb-1">
            {filterTopic === 'all' ? 'No posts yet' : `No ${TOPICS[filterTopic]?.label} posts yet`}
          </h3>
          <p className="text-sm text-[#0A1A2F]/40 dark:text-white/40 leading-relaxed mb-4">
            {filterTopic === 'all'
              ? 'Be the first to share something with the community.'
              : 'Try a different topic or be the first to write one.'}
          </p>
          {onWriteWithAI && (
            <button onClick={onWriteWithAI}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white font-bold text-sm hover:opacity-90 transition-opacity">
              Write the First Post
            </button>
          )}
        </div>
      )}

      {/* ── Posts: hero + standard cards ── */}
      {!isLoading && filtered.length > 0 && (
        <div className="space-y-3">
          <HeroBlogCard post={hero} />
          {rest.map((post, i) => <BlogCard key={post.id} post={post} index={i} />)}
        </div>
      )}
    </div>
  );
}
