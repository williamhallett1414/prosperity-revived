import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Heart, BookOpen, ChevronDown, ChevronUp, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { formatDistanceToNow } from 'date-fns';

// App-palette topic chips
const TOPICS = {
  faith:           { label: '✝️ Faith',           bg: 'bg-[#FAD98D]/30 text-[#c9a227]'     },
  fitness:         { label: '💪 Fitness',          bg: 'bg-[#AFC7E3]/30 text-[#3C4E53]'     },
  nutrition:       { label: '🥗 Nutrition',        bg: 'bg-[#D9B878]/25 text-[#0A1A2F]/70'  },
  mental_health:   { label: '🧘 Mental Health',    bg: 'bg-[#AFC7E3]/25 text-[#0A1A2F]/70'  },
  personal_growth: { label: '🌱 Personal Growth',  bg: 'bg-[#FAD98D]/20 text-[#c9a227]'     },
  relationships:   { label: '💕 Relationships',    bg: 'bg-[#D9B878]/20 text-[#0A1A2F]/70'  },
  general:         { label: '✨ General',           bg: 'bg-[#F2F6FA] text-[#0A1A2F]/50'     },
};

function BlogCard({ post }) {
  const [expanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => base44.entities.BlogPost.update(post.id, { likes: (post.likes || 0) + 1 }),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['blogPosts'] }),
  });

  const topic = TOPICS[post.topic] || TOPICS.general;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#D9B878]/20 overflow-hidden">
      <div className="p-4">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3C4E53] to-[#AFC7E3] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {(post.author_name || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#0A1A2F] truncate">{post.author_name || 'Community Member'}</p>
            <p className="text-xs text-[#0A1A2F]/35">{formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}</p>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${topic.bg}`}>
            {topic.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-[#0A1A2F] text-sm leading-snug mb-2">{post.title}</h3>

        {/* Content */}
        <AnimatePresence initial={false}>
          {!expanded ? (
            <p className="text-sm text-[#0A1A2F]/60 leading-relaxed line-clamp-3">
              {post.excerpt || post.content?.substring(0, 150) + '…'}
            </p>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="prose prose-sm max-w-none text-[#0A1A2F]/75 text-sm">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#D9B878]/15">
          <button onClick={() => likeMutation.mutate()}
            className="flex items-center gap-1.5 text-xs text-[#0A1A2F]/40 hover:text-red-400 transition-colors">
            <Heart className={`w-3.5 h-3.5 ${(post.likes || 0) > 0 ? 'fill-red-400 text-red-400' : ''}`} />
            <span>{post.likes || 0}</span>
          </button>
          <button onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-xs text-[#c9a227] hover:opacity-70 transition-opacity ml-auto font-semibold">
            {expanded
              ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
              : <><BookOpen className="w-3.5 h-3.5" /> Read more</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function BlogFeed({ user, onWriteWithAI }) {
  const [filterTopic, setFilterTopic] = useState('all');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn:  () => base44.entities.BlogPost.filter({ is_published: true }, '-created_date', 30),
  });

  const filtered = filterTopic === 'all' ? posts : posts.filter(p => p.topic === filterTopic);

  return (
    <div className="space-y-4">
      {/* Write CTA */}
      {onWriteWithAI && (
        <button onClick={onWriteWithAI}
          className="w-full flex items-center gap-3 bg-gradient-to-r from-[#3C4E53] to-[#AFC7E3] text-white rounded-2xl p-4 hover:opacity-90 transition-opacity">
          <Wand2 className="w-5 h-5 flex-shrink-0" />
          <div className="text-left">
            <p className="font-bold text-sm">Write with AI</p>
            <p className="text-xs text-white/70">Share your story with the community</p>
          </div>
        </button>
      )}

      {/* Topic chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <FilterChip active={filterTopic === 'all'} onClick={() => setFilterTopic('all')}>All</FilterChip>
        {Object.entries(TOPICS).map(([val, { label }]) => (
          <FilterChip key={val} active={filterTopic === val} onClick={() => setFilterTopic(val)}>
            {label}
          </FilterChip>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1,2].map(i => <div key={i} className="bg-white rounded-2xl p-4 animate-pulse border border-[#D9B878]/20 h-24" />)}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-8 h-8 mx-auto mb-3 text-[#0A1A2F]/15" />
          <p className="text-sm font-semibold text-[#0A1A2F]/40">No posts yet</p>
          <p className="text-xs text-[#0A1A2F]/30 mt-1">Be the first to share something inspiring!</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(post => <BlogCard key={post.id} post={post} user={user} />)}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border flex-shrink-0 font-semibold transition-colors ${
        active
          ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]'
          : 'bg-white text-[#0A1A2F]/50 border-[#D9B878]/30 hover:border-[#c9a227]/40'
      }`}>
      {children}
    </button>
  );
}
