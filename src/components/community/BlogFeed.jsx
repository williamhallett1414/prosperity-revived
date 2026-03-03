import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { formatDistanceToNow } from 'date-fns';

const TOPIC_COLORS = {
  faith:           'bg-purple-100 text-purple-700',
  fitness:         'bg-blue-100 text-blue-700',
  nutrition:       'bg-green-100 text-green-700',
  mental_health:   'bg-teal-100 text-teal-700',
  personal_growth: 'bg-amber-100 text-amber-700',
  relationships:   'bg-pink-100 text-pink-700',
  general:         'bg-gray-100 text-gray-700',
};

const TOPIC_LABELS = {
  faith:           '✝️ Faith',
  fitness:         '💪 Fitness',
  nutrition:       '🥗 Nutrition',
  mental_health:   '🧘 Mental Health',
  personal_growth: '🌱 Personal Growth',
  relationships:   '💕 Relationships',
  general:         '✨ General',
};

function BlogCard({ post, user }) {
  const [expanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => base44.entities.BlogPost.update(post.id, { likes: (post.likes || 0) + 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogPosts'] }),
  });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          {/* Meta */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3C4E53] to-[#5a7480] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {(post.author_name || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{post.author_name || 'Community Member'}</p>
              <p className="text-xs text-gray-400">{formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}</p>
            </div>
            <Badge className={`text-xs ${TOPIC_COLORS[post.topic] || TOPIC_COLORS.general}`}>
              {TOPIC_LABELS[post.topic] || '✨ General'}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug">{post.title}</h3>

          {/* Excerpt / expanded */}
          <AnimatePresence initial={false}>
            {!expanded ? (
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{post.excerpt || post.content?.substring(0, 150) + '...'}</p>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="prose prose-sm max-w-none text-gray-700"
              >
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => likeMutation.mutate()}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <Heart className={`w-4 h-4 ${(post.likes || 0) > 0 ? 'fill-red-400 text-red-400' : ''}`} />
              <span>{post.likes || 0}</span>
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm text-[#3C4E53] hover:opacity-70 transition-opacity ml-auto font-medium"
            >
              {expanded ? (
                <><ChevronUp className="w-4 h-4" /> Show less</>
              ) : (
                <><BookOpen className="w-4 h-4" /> Read more</>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function BlogFeed({ user }) {
  const [filterTopic, setFilterTopic] = useState('all');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.filter({ is_published: true }, '-created_date', 30),
  });

  const filtered = filterTopic === 'all' ? posts : posts.filter(p => p.topic === filterTopic);

  return (
    <div className="space-y-4">
      {/* Topic filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setFilterTopic('all')}
          className={`text-xs px-3 py-1.5 rounded-full border flex-shrink-0 transition-colors ${filterTopic === 'all' ? 'bg-[#3C4E53] text-white border-[#3C4E53]' : 'bg-white text-gray-600 border-gray-200'}`}
        >
          All
        </button>
        {Object.entries(TOPIC_LABELS).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilterTopic(val)}
            className={`text-xs px-3 py-1.5 rounded-full border flex-shrink-0 transition-colors ${filterTopic === val ? 'bg-[#3C4E53] text-white border-[#3C4E53]' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="text-center py-10 text-gray-400 text-sm">Loading posts...</div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No blog posts yet</p>
          <p className="text-sm mt-1">Be the first to share something inspiring!</p>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map(post => (
          <BlogCard key={post.id} post={post} user={user} />
        ))}
      </div>
    </div>
  );
}