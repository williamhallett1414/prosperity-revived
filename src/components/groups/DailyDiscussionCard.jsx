import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Heart, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { getDisplayName, getDisplayNameFromString, getInitialFromString } from '@/lib/userName';

/**
 * DailyDiscussionCard
 * ─────────────────────────────────────────────────────────────────────────
 * Renders the group's daily discussion topic with a dedicated UI that's
 * visually distinct from member-authored posts. The topic is stored as a
 * regular Post entity (with is_daily_topic=true and topic_date=YYYY-MM-DD)
 * so it can attach comments through the existing Comment system, but the
 * presentation here is purpose-built — gold accent border, calendar icon,
 * "Today's Discussion" framing, and an inline comment thread.
 *
 * Why a separate component (not a PostCard variant): PostCard already
 * carries friend-request, moderation, and summary logic that doesn't apply
 * to a system-authored prompt. A purpose-built card stays simpler and
 * doesn't bloat PostCard with conditionals.
 *
 * Props:
 *   post     — the daily-topic Post entity (provides id, content, created_date)
 *   comments — full list of comments for this group (filtered internally
 *              to those where comment.post_id === post.id)
 *   user     — current user, used to enable/disable the comment input
 *   onLike   — (postId, isLiked) => void  (same handler as PostCard for
 *              consistency)
 *   onComment — (postId, content) => void
 *   isMember — gate for posting; non-members see the prompt + comments but
 *              can't add their own.
 */
export default function DailyDiscussionCard({
  post,
  comments = [],
  user,
  onLike,
  onComment,
  isMember,
}) {
  const [commentText, setCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Comments belonging to this post, sorted oldest first so the
  // conversation reads chronologically.
  const postComments = comments
    .filter(c => c.post_id === post.id)
    .sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

  // By default we collapse comment threads with more than 3 replies behind
  // a "View all N" toggle, matching standard feed UX.
  const visibleComments = showAllComments ? postComments : postComments.slice(0, 3);
  const hiddenCount = postComments.length - visibleComments.length;

  const handleSubmit = async () => {
    const trimmed = commentText.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    try {
      await onComment(post.id, trimmed);
      setCommentText('');
    } catch (e) {
      console.error('[DailyDiscussionCard] Comment submit failed:', e);
    }
    setSubmitting(false);
  };

  // Format the date the topic was set. We prefer the post's topic_date
  // field (YYYY-MM-DD) so the rendered date matches the discussion's
  // intended day even if a member opens the group at midnight in a
  // different timezone.
  const displayDate = (() => {
    if (post.topic_date) {
      // YYYY-MM-DD → Date
      const [y, m, d] = post.topic_date.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    return post.created_date ? new Date(post.created_date) : new Date();
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative bg-white dark:bg-white/5 rounded-2xl overflow-hidden"
      style={{
        border: '1px solid rgba(201, 162, 39, 0.25)',
        boxShadow: '0 4px 24px -8px rgba(201, 162, 39, 0.15)',
      }}
    >
      {/* Gold accent bar — visual signal that this is the daily prompt,
          not a regular member post */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, #FAD98D, #c9a227, #FAD98D)' }}
      />

      <div className="p-5">

        {/* Header — eyebrow label + date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-base"
              style={{ background: 'rgba(201, 162, 39, 0.12)' }}
            >
              💬
            </div>
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: '#c9a227' }}
              >
                Today's Discussion
              </p>
              <p className="text-[11px] text-[#0A1A2F]/40 dark:text-white/40 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(displayDate, 'EEEE, MMMM d')}
              </p>
            </div>
          </div>
        </div>

        {/* The prompt itself — the most prominent text on the card */}
        <p
          className="text-[#0A1A2F] dark:text-white text-base leading-relaxed mb-4"
          style={{ fontWeight: 500 }}
        >
          {post.content}
        </p>

        {/* Engagement strip — likes + comment count, similar to PostCard */}
        <div className="flex items-center gap-4 pb-3 mb-3 border-b border-[#F2F6FA] dark:border-white/10">
          <button
            onClick={() => onLike?.(post.id, true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#0A1A2F]/55 dark:text-white/55 hover:text-[#c9a227] transition-colors"
          >
            <Heart className="w-3.5 h-3.5" />
            {post.likes || 0}
          </button>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0A1A2F]/55 dark:text-white/55">
            <MessageCircle className="w-3.5 h-3.5" />
            {postComments.length} {postComments.length === 1 ? 'reply' : 'replies'}
          </div>
        </div>

        {/* Comment thread — chronological */}
        {postComments.length > 0 && (
          <div className="space-y-2.5 mb-3">
            <AnimatePresence initial={false}>
              {visibleComments.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-[#F2F6FA] dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-bold text-[#0A1A2F]/65 dark:text-white/65">
                      {getInitialFromString(c.user_name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-[#F2F6FA] dark:bg-white/[0.04] rounded-2xl px-3 py-2">
                      <p className="text-[11px] font-bold text-[#0A1A2F]/75 dark:text-white/75 mb-0.5">
                        {getDisplayNameFromString(c.user_name, 'Member')}
                      </p>
                      <p className="text-[13px] text-[#0A1A2F] dark:text-white leading-relaxed whitespace-pre-wrap break-words">
                        {c.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {hiddenCount > 0 && (
              <button
                onClick={() => setShowAllComments(true)}
                className="text-[11px] font-bold text-[#c9a227] hover:underline ml-9"
              >
                View {hiddenCount} more {hiddenCount === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>
        )}

        {/* Comment input — members only.
            Non-members see the discussion but cannot post (the regular
            join CTA above the daily card already prompts them to join). */}
        {isMember && user && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-[#c9a227]/15 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-bold text-[#c9a227]">
                {getInitialFromString(getDisplayName(user, user.email || ''))}
              </span>
            </div>
            <div className="flex-1 flex items-end gap-2 bg-[#F2F6FA] dark:bg-white/[0.04] rounded-2xl px-3 py-1.5">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts…"
                rows={1}
                className="flex-1 bg-transparent border-0 outline-none resize-none text-[13px] text-[#0A1A2F] dark:text-white placeholder:text-[#0A1A2F]/35 dark:placeholder:text-white/35 leading-relaxed py-1.5"
                style={{ minHeight: 24, maxHeight: 120 }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={!commentText.trim() || submitting}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
                style={{ background: 'rgba(201, 162, 39, 0.15)' }}
                aria-label="Send comment"
              >
                <Send className="w-3.5 h-3.5" style={{ color: '#c9a227' }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
