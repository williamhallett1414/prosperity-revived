import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Send, X, ChevronRight, Loader2, MessageCircle,
  Plus, Shield, ArrowLeft, Trash2, CheckCircle2, RefreshCw,
  Lock, Flame
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ShareToFeedButton from '@/components/community/ShareToFeedButton';
import { getDisplayName, getDisplayNameFromString } from '@/lib/userName';

// ─── Constants ────────────────────────────────────────────────────────────────
const SPOTLIGHT_DURATION = 30;
const CATEGORIES = ['All', 'Healing', 'Family', 'Finances', 'Guidance', 'Praise', 'Relationships', 'Other'];
const CATEGORY_COLORS = {
  Healing:       'bg-rose-50 dark:bg-rose-900/200/20 text-rose-300 border-rose-500/30',
  Family:        'bg-amber-50 dark:bg-amber-900/200/20 text-amber-300 border-amber-500/30',
  Finances:      'bg-emerald-50 dark:bg-emerald-900/200/20 text-emerald-300 border-emerald-500/30',
  Guidance:      'bg-sky-50 dark:bg-sky-900/200/20 text-sky-300 border-sky-500/30',
  Praise:        'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
  Relationships: 'bg-pink-50 dark:bg-pink-900/200/20 text-pink-300 border-pink-500/30',
  Other:         'bg-slate-500/20 text-slate-300 border-slate-500/30',
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function initials(name) {
  return (name || 'A').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function requireAuth(user, action) {
  if (!user) { toast.error('Please sign in to ' + action); return false; }
  return true;
}

// ─── Streak helpers ───────────────────────────────────────────────────────────
const STREAK_KEY = 'prayer_streak_v1';
const MY_PRAYERS_KEY = 'my_prayers_v1';

function loadStreak() {
  try { return JSON.parse(localStorage.getItem(STREAK_KEY) || '{"lastDate":null,"streak":0}'); }
  catch { return { lastDate: null, streak: 0 }; }
}
function localDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function markPrayedToday() {
  const today = localDateKey(new Date());
  const s = loadStreak();
  if (s.lastDate === today) return s;
  const yesterday = localDateKey(new Date(Date.now() - 86400000));
  const streak = s.lastDate === yesterday ? s.streak + 1 : 1;
  const updated = { lastDate: today, streak };
  localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
  return updated;
}
function loadMyPrayers() {
  try { return JSON.parse(localStorage.getItem(MY_PRAYERS_KEY) || '[]'); } catch { return []; }
}
function saveMyPrayers(p) { localStorage.setItem(MY_PRAYERS_KEY, JSON.stringify(p)); }

// ─── Countdown Ring ───────────────────────────────────────────────────────────
function CountdownRing({ seconds, total }) {
  const r = 18, circ = 2 * Math.PI * r;
  const progress = (seconds / total) * circ;
  return (
    <svg width="44" height="44" className="rotate-[-90deg]">
      <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(60,78,83,0.15)" strokeWidth="2.5" />
      <circle cx="22" cy="22" r={r} fill="none" stroke="#c9a227" strokeWidth="2.5"
        strokeDasharray={circ} strokeDashoffset={circ - progress} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s linear' }} />
    </svg>
  );
}

// ─── Spotlight Card ───────────────────────────────────────────────────────────
function SpotlightCard({ request, countdown, total, onPray, onNext, onClick, hasPrayed }) {
  const prayerCount = request?.prayer_count || 0;
  return (
    <div className="relative rounded-3xl overflow-hidden cursor-pointer"
      style={{ background: 'linear-gradient(135deg, #0f2027 0%, #1a3a4a 50%, #203a43 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)' }}
      onClick={onClick}>
      <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(201,162,39,0.3) 0%, transparent 70%)' }} />
      {request?.is_answered && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/200/25 border border-emerald-400/40 rounded-full px-2 py-0.5 z-10">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-wide">Answered</span>
        </div>
      )}
      <div className="relative p-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#c9a227] rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-[#c9a227] uppercase tracking-widest">Praying for {getDisplayNameFromString(request?.user_name, '...')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40 font-medium">Next in</span>
            <div className="relative flex items-center justify-center w-11 h-11">
              <CountdownRing seconds={countdown} total={total} />
              <span className="absolute text-[10px] font-bold text-white tabular-nums">
                {String(Math.floor(countdown / 60)).padStart(1,'0')}:{String(countdown % 60).padStart(2,'0')}
              </span>
            </div>
          </div>
        </div>
        <p className="text-[#3C4E53] font-semibold text-[15px] leading-relaxed mb-5 line-clamp-4" style={{ fontFamily: 'Georgia, serif' }}>
            {request?.prayer_text || 'Loading prayers...'}
          </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🙏</span>
            <span className="text-xs font-semibold text-[#3C4E53]/70">
                <span className="text-[#3C4E53] font-bold">{prayerCount.toLocaleString()}</span> praying
              </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={e => { e.stopPropagation(); onPray(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-bold ${
                hasPrayed ? 'bg-[#c9a227]/40 border-[#c9a227] text-[#c9a227]' : 'bg-[#c9a227]/20 border-[#c9a227]/40 hover:bg-[#c9a227]/30 text-[#c9a227]'
              }`}>
              <Heart className={`w-3.5 h-3.5 ${hasPrayed ? 'fill-[#c9a227]' : ''}`} />
              {hasPrayed ? 'Prayed ✓' : 'I Prayed'}
            </button>
            <button onClick={e => { e.stopPropagation(); onNext(); }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
              <ChevronRight className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Prayer Row ───────────────────────────────────────────────────────────────
function PrayerRow({ request, index, onOpen, user }) {
  const catColor = CATEGORY_COLORS[request.category] || CATEGORY_COLORS.Other;
  const hasPrayed = (request.prayed_by || []).includes(user?.email);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.04, 0.4) }}
      onClick={() => onOpen(request)} className="group cursor-pointer"
      style={{ background: request.is_answered ? 'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(52,211,153,0.03))' : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', border: request.is_answered ? '1px solid rgba(52,211,153,0.2)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '16px', backdropFilter: 'blur(10px)' }}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-[#F5F5F5]"
          style={{ background: request.is_answered ? 'linear-gradient(135deg, #065f46, #059669)' : 'linear-gradient(135deg, #1a3a4a, #2d5a70)' }}>
          {initials(getDisplayNameFromString(request.user_name, ''))}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#3C4E53] text-sm">{getDisplayNameFromString(request.user_name, 'Anonymous')}</span>
              {request.is_answered && (
                <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-50 dark:bg-emerald-900/200/15 border border-emerald-500/25 rounded-full px-1.5 py-0.5 uppercase tracking-wide">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Answered
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {request.category && request.category !== 'All' && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-bold uppercase tracking-wide ${catColor}`}>{request.category}</span>
              )}
              <span className="text-[10px] text-[#3C4E53]/40">{timeAgo(request.created_date)}</span>
            </div>
          </div>
          <p className="text-[#3C4E53]/60 text-xs leading-relaxed line-clamp-2">{request.prayer_text}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-[11px] text-[#3C4E53]/40"><span>🙏</span> {request.prayer_count || 0}</span>
             <span className="flex items-center gap-1 text-[11px] text-[#3C4E53]/40"><MessageCircle className="w-3 h-3" /> {(request.comments || []).length}</span>
            {hasPrayed && <span className="text-[11px] text-[#c9a227] font-semibold">✓ You prayed</span>}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#3C4E53]/20 flex-shrink-0 mt-1 group-hover:text-[#3C4E53]/50 transition-colors" />
      </div>
    </motion.div>
  );
}

// ─── Prayer Drawer ────────────────────────────────────────────────────────────
function PrayerDrawer({ request, user, onClose, onPray, onComment, onDelete, onMarkAnswered }) {
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const catColor = CATEGORY_COLORS[request?.category] || CATEGORY_COLORS.Other;
  const comments = request?.comments || [];
  const hasPrayed = (request?.prayed_by || []).includes(user?.email);
  const isOwner = user?.email && (
    request?.created_by === user.email ||
    request?.user_email === user.email ||
    // Fallback string-equality ownership check for legacy records that have
    // user_name but no user_email. Both sides intentionally use the RAW
    // user.full_name (not getDisplayName), because the stored record was
    // written with raw full_name and we'd lose ownership detection if we
    // cleaned only one side. Don't "fix" this without also rewriting the
    // existing PrayerRequest records.
    (!request?.is_anonymous && request?.user_name === user?.full_name)
  );

  const handleComment = async () => {
    if (!commentText.trim() || submitting) return;
    if (!requireAuth(user, 'leave a comment')) return;
    setSubmitting(true);
    await onComment(commentText);
    setCommentText('');
    setSubmitting(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(5,15,25,0.97)', backdropFilter: 'blur(20px)' }}>
      <div className="flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-3">
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#3C4E53]/10 flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-[#3C4E53]" />
        </button>
        <div className="w-10 h-1 rounded-full bg-[#3C4E53]/20" />
        {isOwner ? (
          <button onClick={() => setConfirmDelete(true)} className="w-9 h-9 rounded-full bg-red-50 dark:bg-red-900/200/15 border border-red-500/25 flex items-center justify-center">
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        ) : <div className="w-9" />}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-[#F5F5F5]"
            style={{ background: request?.is_answered ? 'linear-gradient(135deg, #065f46, #059669)' : 'linear-gradient(135deg, #1a3a4a, #2d5a70)' }}>
            {initials(getDisplayNameFromString(request?.user_name, ''))}
          </div>
          <div>
            <p className="font-bold text-[#3C4E53]">{getDisplayNameFromString(request?.user_name, 'Anonymous')}</p>
             <p className="text-xs text-[#3C4E53]/50">{timeAgo(request?.created_date)}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {request?.is_answered && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-50 dark:bg-emerald-900/200/15 border border-emerald-500/30 rounded-full px-2 py-1 uppercase tracking-wide">
                <CheckCircle2 className="w-3 h-3" /> Answered
              </span>
            )}
            {request?.category && request.category !== 'All' && (
              <span className={`text-[10px] px-2 py-1 rounded-full border font-bold uppercase tracking-wide ${catColor}`}>{request.category}</span>
            )}
          </div>
        </div>

        <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, rgba(201,162,39,0.08), rgba(201,162,39,0.03))', border: '1px solid rgba(201,162,39,0.2)' }}>
          <p className="text-[#3C4E53] leading-relaxed text-[15px]" style={{ fontFamily: 'Georgia, serif' }}>{request?.prayer_text}</p>
        </div>

        <div className="flex gap-3 mb-3">
          <button onClick={() => { if (requireAuth(user, 'record a prayer')) onPray(); }}
            disabled={hasPrayed}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all ${hasPrayed ? 'opacity-60 cursor-default' : 'hover:opacity-90'}`}
            style={{ background: 'linear-gradient(135deg, #c9a227, #C9A227)', color: '#3C4E53' }}>
            <span>🙏</span>
            {hasPrayed ? `Prayed (${request?.prayer_count || 0}) ✓` : `I Prayed (${request?.prayer_count || 0})`}
          </button>
        </div>

        {isOwner && !request?.is_answered && (
          <button onClick={onMarkAnswered}
            className="w-full flex items-center justify-center gap-2 min-h-[44px] min-w-[44px] py-2.5 rounded-2xl font-bold text-sm mb-5 transition-all bg-emerald-50 dark:bg-emerald-900/200/12 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-50 dark:bg-emerald-900/200/20">
            <CheckCircle2 className="w-4 h-4" /> Mark as Answered 🙌
          </button>
        )}

        <div>
          <p className="text-[11px] font-bold text-[#3C4E53]/50 uppercase tracking-widest mb-4">
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </p>
          {comments.length === 0 && (
            <div className="text-center py-6">
              <p className="text-[#3C4E53]/50 text-sm">Be the first to leave a word of encouragement</p>
            </div>
          )}
          <div className="space-y-3 mb-6">
            {[...comments].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map(comment => (
              <div key={comment.comment_id} className="rounded-xl p-4"
              style={{ background: 'rgba(60,78,83,0.04)', border: '1px solid rgba(60,78,83,0.08)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-[#3C4E53]">{getDisplayNameFromString(comment.user_name, 'Anonymous')}</span>
                <span className="text-[10px] text-[#3C4E53]/40">{timeAgo(comment.timestamp)}</span>
                </div>
                <p className="text-sm text-[#3C4E53]/65 leading-relaxed">{comment.comment_text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!user ? (
        <div className="flex-shrink-0 px-5 py-4 border-t border-[#3C4E53]/10 text-center"
          style={{ background: 'rgba(255,247,238,0.95)' }}>
          <p className="text-[#3C4E53]/50 text-sm">Sign in to leave encouragement</p>
        </div>
      ) : (
        <div className="flex-shrink-0 px-5 py-4 border-t border-[#3C4E53]/10"
          style={{ background: 'rgba(255,247,238,0.95)', backdropFilter: 'blur(20px)' }}>
          <div className="flex gap-2">
            <input value={commentText} onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleComment()}
              maxLength={500}
              placeholder="Share a word of encouragement…"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm text-[#3C4E53] placeholder-[#3C4E53]/40 outline-none border border-[#3C4E53]/15"
              style={{ background: 'rgba(60,78,83,0.06)' }} />
            <button onClick={handleComment} disabled={!commentText.trim() || submitting}
              className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #c9a227, #C9A227)' }}>
              {submitting ? <Loader2 className="w-4 h-4 text-[#3C4E53] animate-spin" /> : <Send className="w-4 h-4 text-[#3C4E53]" />}
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-end justify-center pb-8 px-5 z-60"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
            <div className="rounded-3xl p-6 w-full max-w-sm" style={{ background: '#FEF7EE', border: '1px solid rgba(201,162,39,0.2)' }}>
              <p className="font-bold text-[#3C4E53] text-center mb-1">Delete prayer request?</p>
              <p className="text-[#3C4E53]/60 text-sm text-center mb-5">This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-3 rounded-2xl border border-[#3C4E53]/20 text-[#3C4E53]/60 font-semibold text-sm">Cancel</button>
                <button onClick={() => { onDelete(); setConfirmDelete(false); }}
                  className="flex-1 py-3 rounded-2xl bg-red-50 dark:bg-red-900/200/80 text-[#3C4E53] font-bold text-sm">Delete</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── New Prayer Modal ─────────────────────────────────────────────────────────
function NewPrayerModal({ user, onClose, onSubmit }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Other');
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewing, setReviewing] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    await onSubmit({ text, category, anonymous });
    setSubmitting(false);
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
       className="fixed inset-0 z-50 flex flex-col justify-end"
       style={{ background: 'rgba(60,78,83,0.3)', backdropFilter: 'blur(16px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="rounded-t-3xl px-5 pt-5 pb-8"
        style={{ background: 'linear-gradient(180deg, #FEF7EE 0%, #FDF3E6 100%)', border: '1px solid rgba(201,162,39,0.2)', borderBottom: 'none' }}>
        <div className="w-10 h-1 rounded-full bg-[#3C4E53]/20 mx-auto mb-5" />

        {!reviewing ? (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#3C4E53]" style={{ fontFamily: 'Georgia, serif' }}>Share Prayer Request</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#3C4E53]/10 flex items-center justify-center">
                <X className="w-4 h-4 text-[#3C4E53]" />
              </button>
            </div>
            <div className="flex gap-2 flex-wrap mb-4">
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                 <button key={cat} onClick={() => setCategory(cat)}
                   className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${category === cat ? 'bg-[#c9a227] border-[#c9a227] text-[#3C4E53]' : 'bg-[#3C4E53]/5 border-[#3C4E53]/10 text-[#3C4E53]/50 hover:border-[#3C4E53]/30'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)}
              placeholder="Share what's on your heart…"
              maxLength={1000}
              className="w-full rounded-2xl px-4 py-3 min-h-[120px] mb-4 resize-none text-sm text-[#3C4E53] placeholder-[#3C4E53]/40 outline-none"
              style={{ background: 'rgba(60,78,83,0.06)', border: '1px solid rgba(60,78,83,0.15)', fontFamily: 'Georgia, serif', lineHeight: '1.7' }} />
            <button onClick={() => setAnonymous(p => !p)}
              className={`flex items-center gap-2 text-sm mb-5 transition-colors ${anonymous ? 'text-[#c9a227]' : 'text-[#3C4E53]/50'}`}>
              <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${anonymous ? 'bg-[#c9a227] border-[#c9a227]' : 'border-[#3C4E53]/25'}`}>
                {anonymous && <Shield className="w-2.5 h-2.5 text-white" />}
              </div>
              Post anonymously
            </button>
            <button onClick={() => text.trim() && setReviewing(true)} disabled={!text.trim()}
              className="w-full py-4 rounded-2xl font-bold text-[#3C4E53] text-sm disabled:opacity-40 transition-all"
              style={{ background: 'linear-gradient(135deg, #c9a227, #C9A227)' }}>
              Review Before Posting →
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <button onClick={() => setReviewing(false)} className="flex items-center gap-1.5 text-[#3C4E53]/60 text-sm font-semibold">
                <ArrowLeft className="w-4 h-4" /> Edit
              </button>
              <h2 className="text-sm font-bold text-[#3C4E53]/60 uppercase tracking-wide">Review</h2>
              <div className="w-14" />
            </div>
            <div className="rounded-2xl p-4 mb-3" style={{ background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-[#F5F5F5]" style={{ background: 'linear-gradient(135deg, #1a3a4a, #2d5a70)' }}>
                    {initials(anonymous ? 'Anonymous' : getDisplayName(user, ''))}
                  </div>
                  <div>
                    <p className="text-[#3C4E53] text-sm font-semibold">{anonymous ? 'Anonymous' : getDisplayName(user, 'Anonymous')}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-bold uppercase tracking-wide ${CATEGORY_COLORS[category] || CATEGORY_COLORS.Other}`}>{category}</span>
                </div>
              </div>
              <p className="text-[#3C4E53]/80 text-sm leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>{text}</p>
            </div>
            <p className="text-[#3C4E53]/50 text-xs text-center mb-5">This will be visible to everyone on the prayer wall.</p>
            <button onClick={handleSubmit} disabled={submitting}
              className="w-full py-4 rounded-2xl font-bold text-[#3C4E53] text-sm disabled:opacity-40 transition-all flex items-center justify-center gap-2 min-h-[44px] min-w-[44px]"
              style={{ background: submitting ? '#d9d9d9' : 'linear-gradient(135deg, #c9a227, #C9A227)' }}>
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <>🙏 Submit Prayer Request</>}
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── ACTS Guided Prayer ───────────────────────────────────────────────────────
const ACTS_STEPS = [
  { key: 'adoration',    label: 'Adoration',    emoji: '✨', color: '#c9a227',
    prompt: 'Praise God for who He is — His holiness, goodness, faithfulness. Not what He has done, but His character.',
    placeholder: 'Lord, I praise You because You are…' },
  { key: 'confession',   label: 'Confession',   emoji: '🕊️', color: '#60a5fa',
    prompt: 'Honestly name anything between you and God — a failing, a grudge, something you\'re carrying. He already knows and He already forgives. This isn\'t about shame — it\'s about freedom. "If we confess our sins, he is faithful and righteous to forgive us the sins." (1 John 1:9). Who do you also need to extend grace to — including yourself?',
    placeholder: 'Father, I release to You…' },
  { key: 'thanksgiving', label: 'Thanksgiving', emoji: '🙏', color: '#34d399',
    prompt: 'Thank God specifically — for what He has done, what He prevented, who He placed in your life.',
    placeholder: 'Thank You, Lord, for…' },
  { key: 'supplication', label: 'Supplication', emoji: '💫', color: '#a78bfa',
    prompt: 'Bring your requests — for yourself, for others, for the world. Be specific. He invites it.',
    placeholder: 'Lord, I ask You for…' },
];

function ActsGuidedPrayer({ onComplete, user }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ adoration: '', confession: '', thanksgiving: '', supplication: '' });
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const current = ACTS_STEPS[step];

  const finish = async () => {
    setSaving(true);
    const content = ACTS_STEPS.map(s => `${s.label.toUpperCase()}:\n${answers[s.key]}`).join('\n\n');
    try {
      await base44.entities.JournalEntry.create({ entry_type: 'prayer', content });
      onComplete();
    } catch {}
    setSaving(false);
    setDone(true);
  };

  if (done) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl p-6 text-center" style={{ background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)' }}>
      <div className="text-4xl mb-3">🙏</div>
      <p className="font-bold text-[#3C4E53] text-lg mb-1" style={{ fontFamily: 'Georgia, serif' }}>Prayer complete</p>
      <p className="text-[#3C4E53]/60 text-sm mb-4">He heard every word.</p>
      <div className="flex justify-center my-3">
        <ShareToFeedButton
          type="spiritual_insight"
          title="Completed guided ACTS prayer 🙏"
          content={`Just worked through a full ACTS prayer — Adoration, Confession, Thanksgiving, Supplication. Taking every concern to God. 'Do not be anxious about anything, but in every situation, present your requests to God.' — Phil 4:6`}
          source="Gideon"
          label="Share to Community"
          color="#C9A227"
          user={user}
        />
      </div>
      <button onClick={() => { setStep(0); setAnswers({ adoration: '', confession: '', thanksgiving: '', supplication: '' }); setDone(false); }}
        className="text-xs font-bold text-[#3C4E53]/50 hover:text-[#3C4E53]/70 transition-colors">Pray again →</button>
    </motion.div>
  );

  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: 'rgba(232,112,31,0.06)', border: '1px solid rgba(232,112,31,0.15)' }}>
      <div className="px-5 pt-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold text-[#3C4E53]/50 uppercase tracking-widest">Guided Prayer</p>
            <p className="text-[#3C4E53] font-bold mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>ACTS Model</p>
          </div>
          <div className="flex gap-2">
            {ACTS_STEPS.map((s, i) => (
              <div key={s.key} className="flex flex-col items-center gap-1">
                <div className="w-7 h-1 rounded-full transition-all duration-300" style={{ background: i <= step ? s.color : 'rgba(60,78,83,0.1)' }} />
                <span className="text-[8px] text-[#3C4E53]/40 font-bold uppercase">{s.label.slice(0, 1)}</span>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.18 }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{current.emoji}</span>
              <span className="text-sm font-bold" style={{ color: current.color }}>{current.label}</span>
            </div>
            <p className="text-[#3C4E53]/60 text-xs leading-relaxed mb-3">{current.prompt}</p>
            <textarea
              value={answers[current.key]}
              onChange={e => setAnswers(a => ({ ...a, [current.key]: e.target.value }))}
              placeholder={current.placeholder}
              maxLength={1000}
              rows={4} autoFocus
              className="w-full rounded-2xl px-4 py-3 text-sm leading-relaxed resize-none outline-none text-[#3C4E53] placeholder-[#3C4E53]/30"
              style={{ background: 'rgba(60,78,83,0.05)', border: `1px solid ${current.color}30`, caretColor: current.color }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 px-5 py-4">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-[#3C4E53]/50 border border-[#3C4E53]/15 hover:border-[#3C4E53]/30 transition-colors">
            ← Back
          </button>
        )}
        {step < 3 ? (
          <button onClick={() => answers[current.key].trim() && setStep(s => s + 1)}
            disabled={!answers[current.key].trim()}
            className="flex-1 py-2.5 rounded-2xl text-xs font-bold text-[#3C4E53] transition-all disabled:opacity-30"
            style={{ background: answers[current.key].trim() ? `linear-gradient(135deg, ${current.color}, ${current.color}99)` : 'rgba(60,78,83,0.08)' }}>
            Next: {ACTS_STEPS[step + 1].label} →
          </button>
        ) : (
          <button onClick={finish} disabled={!answers.supplication.trim() || saving}
            className="flex-1 py-2.5 rounded-2xl text-xs font-bold text-[#3C4E53] transition-all disabled:opacity-30"
            style={{ background: 'linear-gradient(135deg, #c9a227, #C9A227)' }}>
            {saving ? 'Saving…' : '🙏 Complete Prayer'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── My Prayers (private) ─────────────────────────────────────────────────────
function MyPrayers() {
  const [prayers, setPrayers] = useState(loadMyPrayers);
  const [text, setText] = useState('');
  const [adding, setAdding] = useState(false);

  const add = () => {
    if (!text.trim()) return;
    const p = { id: Date.now(), text: text.trim(), ts: Date.now(), answered: false };
    const updated = [p, ...prayers];
    setPrayers(updated);
    saveMyPrayers(updated);
    setText('');
    setAdding(false);
  };

  const toggleAnswered = (id) => {
    const updated = prayers.map(p => p.id === id ? { ...p, answered: !p.answered } : p);
    setPrayers(updated);
    saveMyPrayers(updated);
  };

  const remove = (id) => {
    const updated = prayers.filter(p => p.id !== id);
    setPrayers(updated);
    saveMyPrayers(updated);
  };

  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: 'rgba(232,112,31,0.06)', border: '1px solid rgba(232,112,31,0.15)' }}>
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <Lock className="w-3.5 h-3.5 text-[#3C4E53]/50" />
          <div>
            <p className="text-[10px] font-bold text-[#3C4E53]/50 uppercase tracking-widest">My Prayers</p>
            <p className="text-[#3C4E53] font-bold mt-0.5 text-sm" style={{ fontFamily: 'Georgia, serif' }}>Private — just you and God</p>
          </div>
        </div>
        <button onClick={() => setAdding(a => !a)}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ background: adding ? 'rgba(201,162,39,0.3)' : 'rgba(60,78,83,0.08)' }}>
          <Plus className="w-4 h-4 text-[#3C4E53]" />
        </button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-5 pb-3">
            <textarea value={text} onChange={e => setText(e.target.value)}
              placeholder="Bring your request to God…"
              maxLength={500}
              rows={3} autoFocus
              className="w-full rounded-2xl px-4 py-3 text-sm resize-none outline-none text-[#3C4E53] placeholder-[#3C4E53]/40 mb-2"
              style={{ background: 'rgba(60,78,83,0.06)', border: '1px solid rgba(201,162,39,0.2)' }}
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) add(); }} />
            <div className="flex gap-2">
              <button onClick={() => setAdding(false)} className="flex-1 py-2 rounded-xl text-xs font-bold text-[#3C4E53]/50 border border-[#3C4E53]/15">Cancel</button>
              <button onClick={add} disabled={!text.trim()}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-[#3C4E53] disabled:opacity-30"
                style={{ background: 'linear-gradient(135deg, #c9a227, #C9A227)' }}>Add Prayer</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-5 pb-5 space-y-2">
        {prayers.length === 0 && !adding && (
          <div className="text-center py-5">
            <p className="text-[#3C4E53]/50 text-xs">Your private prayers live here — only you can see them</p>
            <button onClick={() => setAdding(true)} className="mt-3 text-xs font-bold text-[#c9a227]/70 hover:text-[#c9a227] transition-colors">
              + Add your first prayer
            </button>
          </div>
        )}
        {prayers.map(p => (
          <div key={p.id} className="rounded-2xl p-3.5 flex items-start gap-3 group"
            style={{ background: p.answered ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.04)', border: p.answered ? '1px solid rgba(52,211,153,0.2)' : '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => toggleAnswered(p.id)} className="mt-0.5 flex-shrink-0">
              {p.answered
                ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                : <div className="w-4 h-4 rounded-full border border-[#3C4E53]/30 hover:border-[#3C4E53]/50 transition-colors" />}
            </button>
            <p className={`text-sm flex-1 leading-relaxed ${p.answered ? 'text-[#3C4E53]/50 line-through' : 'text-[#3C4E53]/75'}`}
              style={{ fontFamily: 'Georgia, serif' }}>{p.text}</p>
            <button onClick={() => remove(p.id)} className="flex-shrink-0 text-[#3C4E53]/0 group-hover:text-[#3C4E53]/30 hover:!text-red-500 transition-all">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Prayer() {
  const [user, setUser]                   = useState(null);
  const [spotlightIdx, setSpotlightIdx]   = useState(0);
  const [countdown, setCountdown]         = useState(SPOTLIGHT_DURATION);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showNewPrayer, setShowNewPrayer] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isRefreshing, setIsRefreshing]   = useState(false);
  const [streak, setStreak]               = useState(loadStreak);
  const queryClient = useQueryClient();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const refetchInterval = selectedRequest ? 10_000 : 30_000;

  const { data: prayerRequests = [], isLoading: prayersLoading } = useQuery({
    queryKey: ['prayerRequests'],
    queryFn: () => base44.entities.PrayerRequest.list('-created_date', 100),
    refetchInterval,
  });

  const filtered = activeCategory === 'All' ? prayerRequests : prayerRequests.filter(r => r.category === activeCategory);
  const spotlightRequests = prayerRequests.slice(0, 10);

  useEffect(() => {
    if (spotlightRequests.length > 0 && spotlightIdx >= spotlightRequests.length) setSpotlightIdx(0);
  }, [spotlightRequests.length, spotlightIdx]);

  useEffect(() => {
    if (spotlightRequests.length === 0) return;
    const tick = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setSpotlightIdx(i => (i + 1) % Math.max(spotlightRequests.length, 1));
          return SPOTLIGHT_DURATION;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [spotlightRequests.length]);

  const currentSpotlight = spotlightRequests[spotlightIdx] || null;
  const totalPraying = prayerRequests.reduce((sum, r) => sum + (r.prayer_count || 0), 0);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries(['prayerRequests']);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const recordPrayer = useMutation({
    mutationFn: async (request) => {
      const fresh = await base44.entities.PrayerRequest.get(request.id);
      const prayedBy = fresh?.prayed_by || [];
      if (prayedBy.includes(user?.email)) return;
      return base44.entities.PrayerRequest.update(request.id, {
        prayed_by: [...prayedBy, user?.email],
        prayer_count: (fresh?.prayer_count || 0) + 1,
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['prayerRequests']),
    onError: () => toast.error('Failed to record prayer'),
  });

  const addComment = useMutation({
    mutationFn: async ({ requestId, commentText }) => {
      if (!user?.email) throw new Error('Not authenticated');
      const fresh = await base44.entities.PrayerRequest.get(requestId);
      const newComment = {
        comment_id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        user_email: user.email,
        user_name: getDisplayName(user, 'Anonymous'),
        comment_text: commentText,
        timestamp: new Date().toISOString(),
      };
      return base44.entities.PrayerRequest.update(requestId, { comments: [...(fresh?.comments || []), newComment] });
    },
    onSuccess: () => { queryClient.invalidateQueries(['prayerRequests']); toast.success('Encouragement sent 🙏'); },
    onError: () => toast.error('Failed to send — please try again'),
  });

  const deleteRequest = useMutation({
    mutationFn: (id) => base44.entities.PrayerRequest.delete(id),
    onSuccess: () => { queryClient.invalidateQueries(['prayerRequests']); setSelectedRequest(null); toast.success('Prayer request removed'); },
    onError: () => toast.error('Failed to delete prayer request'),
  });

  const markAnswered = useMutation({
    mutationFn: (id) => base44.entities.PrayerRequest.update(id, { is_answered: true }),
    onSuccess: () => { queryClient.invalidateQueries(['prayerRequests']); toast.success('🙌 Praise God — marked as answered!'); },
    onError: () => toast.error('Failed to update — please try again'),
  });

  const createRequest = useMutation({
    mutationFn: ({ text, category, anonymous }) => base44.entities.PrayerRequest.create({
      user_name: anonymous ? 'Anonymous' : getDisplayName(user, 'Anonymous'),
      user_email: anonymous ? null : user?.email,
      prayer_text: text,
      category,
      is_anonymous: anonymous,
      prayer_count: 0,
      prayed_by: [],
      comments: [],
      is_answered: false,
    }),
    onSuccess: () => { queryClient.invalidateQueries(['prayerRequests']); toast.success('Your prayer has been shared 🙏'); },
    onError: () => toast.error('Failed to share prayer — please try again'),
  });

  const handlePray = useCallback((request) => {
    if (!requireAuth(user, 'record a prayer')) return;
    const hasPrayed = (request.prayed_by || []).includes(user?.email);
    if (hasPrayed) { toast.info('You\'ve already prayed for this request', { duration: 1500 }); return; }
    recordPrayer.mutate(request);
    toast.success('🙏 Prayer recorded', { duration: 1500 });
  }, [user, recordPrayer]);

  const handleActsComplete = useCallback(() => {
    const updated = markPrayedToday();
    setStreak(updated);
    if (updated.streak > 1) toast.success(`🔥 ${updated.streak}-day prayer streak!`);
  }, []);

  const freshSelected = selectedRequest
    ? prayerRequests.find(r => r.id === selectedRequest.id) || selectedRequest
    : null;

  const [crisisExpanded, setCrisisExpanded] = useState(false);

  return (
    <div className="min-h-screen pb-28" style={{ background: 'linear-gradient(180deg, #FEF7EE 0%, #FDF3E6 50%, #FCE8D6 100%)' }}>

      {/* ── Sticky sub-bar (page title is in Layout's UniversalHeader) ── */}
      <div className="sticky top-14 z-30 flex items-center justify-between px-5 py-2.5"
        style={{ background: 'rgba(255,247,238,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(201,162,39,0.15)' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[11px] text-[#3C4E53]/50 font-medium">{prayerRequests.length} requests</span>
          </div>
          {streak.streak > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ color: '#c9a227', background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.2)' }}>
              <Flame className="w-3 h-3" />{streak.streak}d
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleRefresh}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isRefreshing ? 'opacity-40' : 'hover:bg-[#FAD98D]/20'}`}
            style={{ background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.15)' }}>
            <RefreshCw className={`w-4 h-4 text-[#c9a227]/60 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => { if (requireAuth(user, 'share a prayer request')) setShowNewPrayer(true); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-white text-xs shadow-lg dark:shadow-none transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #E8701F, #F5985D)' }}>
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            Share Prayer
          </button>
        </div>
      </div>

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden px-4 pt-6 pb-5">
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(232,112,31,0.4) 0%, transparent 70%)' }} />
        <div className="relative text-center">
          <div className="text-5xl mb-3">🙏</div>
          <h2 className="text-2xl font-black text-[#3C4E53] mb-1" style={{ fontFamily: 'Georgia, serif' }}>Prayer Wall</h2>
          <p className="text-[#3C4E53]/60 text-sm">Lift each other up in prayer</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="text-center">
              <p className="text-lg font-black text-[#E8701F]">{prayerRequests.length}</p>
              <p className="text-[10px] text-[#3C4E53]/40 uppercase tracking-wide">Requests</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-lg font-black text-[#E8701F]">{totalPraying.toLocaleString()}</p>
              <p className="text-[10px] text-[#3C4E53]/40 uppercase tracking-wide">Prayers Sent</p>
            </div>
            {streak.streak > 0 && (
              <>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-lg font-black text-[#E8701F]">{streak.streak}</p>
                  <p className="text-[10px] text-[#3C4E53]/40 uppercase tracking-wide">Day Streak 🔥</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 space-y-16">

        {/* ── Crisis Resources (collapsible) ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(201,162,39,0.2)' }}>
          <button onClick={() => setCrisisExpanded(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 min-h-[44px]">
            <div className="flex items-center gap-2">
              <span className="text-sm">🆘</span>
              <span className="text-xs font-bold text-[#3C4E53]/50 uppercase tracking-widest">Crisis Resources</span>
            </div>
            <span className="text-[#3C4E53]/30 text-xs">{crisisExpanded ? '▲' : '▼'}</span>
          </button>
          <AnimatePresence>
            {crisisExpanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden">
                <div className="px-4 pb-4 space-y-2">
                  <a href="tel:988" className="flex items-center gap-3 p-3 rounded-xl min-h-[44px]" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                    <span className="text-lg">📞</span>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-[#3C4E53]">988 Suicide & Crisis Lifeline</p>
                       <p className="text-[11px] text-[#3C4E53]/60">Call or text 988 — free, confidential, 24/7</p>
                     </div>
                  </a>
                  <a href="tel:18006624357" className="flex items-center gap-3 p-3 rounded-xl min-h-[44px]" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
                    <span className="text-lg">💙</span>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-[#3C4E53]">SAMHSA National Helpline</p>
                       <p className="text-[11px] text-[#3C4E53]/60">1-800-662-4357 — free referrals & support, 24/7</p>
                     </div>
                  </a>
                  <a href="sms:741741&body=HELLO" className="flex items-center gap-3 p-3 rounded-xl min-h-[44px]" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <span className="text-lg">💬</span>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-[#3C4E53]">Crisis Text Line</p>
                       <p className="text-[11px] text-[#3C4E53]/60">Text HELLO to 741741 — free, confidential, 24/7</p>
                     </div>
                  </a>
                  <p className="text-[10px] text-[#3C4E53]/50 leading-relaxed pt-1">You are never alone. God loves you and so does this community.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Spotlight ── */}
        {currentSpotlight && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-[#E8701F]" />
              <p className="text-[11px] font-bold text-[#E8701F]/70 uppercase tracking-widest">Spotlight Prayer</p>
            </div>
            <SpotlightCard
              request={currentSpotlight}
              countdown={countdown}
              total={SPOTLIGHT_DURATION}
              hasPrayed={(currentSpotlight.prayed_by || []).includes(user?.email)}
              onPray={() => handlePray(currentSpotlight)}
              onNext={() => { setSpotlightIdx(i => (i + 1) % Math.max(spotlightRequests.length, 1)); setCountdown(SPOTLIGHT_DURATION); }}
              onClick={() => setSelectedRequest(currentSpotlight)}
            />
            <div className="flex justify-center gap-1.5 mt-3">
              {spotlightRequests.map((_, i) => (
                <button key={i} onClick={() => { setSpotlightIdx(i); setCountdown(SPOTLIGHT_DURATION); }}>
                  <div className={`rounded-full transition-all duration-300 ${i === spotlightIdx ? 'w-5 h-1.5 bg-[#E8701F]' : 'w-1.5 h-1.5 bg-[#3C4E53]/15'}`} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Scripture card ── */}
        <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(232,112,31,0.08), rgba(245,152,93,0.04))', border: '1px solid rgba(232,112,31,0.2)' }}>
          <div className="absolute top-2 left-4 text-[80px] leading-none font-serif text-[#E8701F]/8 select-none pointer-events-none">"</div>
          <div className="relative">
            <p className="text-[10px] font-bold text-[#E8701F]/60 uppercase tracking-widest mb-3">Before You Pray</p>
            <p className="text-[#3C4E53]/80 text-sm leading-relaxed italic" style={{ fontFamily: 'Georgia, serif' }}>
              Don't be anxious for anything, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts.
            </p>
            <p className="text-[#E8701F]/50 text-xs font-semibold mt-3">Philippians 4:6–7</p>
          </div>
        </div>

        {/* ── ACTS Guided Prayer ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-[#E8701F]/30" />
            <p className="text-[11px] font-bold text-[#3C4E53]/40 uppercase tracking-widest">Guided Prayer</p>
          </div>
          <ActsGuidedPrayer onComplete={handleActsComplete} user={user} />
        </div>

        {/* ── Private prayer list ── */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-[#E8701F]/30" />
            <p className="text-[11px] font-bold text-[#3C4E53]/40 uppercase tracking-widest">My Private Prayers</p>
          </div>
          <MyPrayers />
        </div>

        {/* ── Talk to Hannah ── */}
        <Link to={createPageUrl('ChatScreen?bot=Hannah')}>
          <div className="rounded-2xl p-4 flex items-center gap-4 transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(14,165,233,0.08))', border: '1px solid rgba(56,189,248,0.25)' }}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg dark:shadow-none"
              style={{ background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)', boxShadow: '0 4px 12px rgba(56,189,248,0.25)' }}>
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
               <p className="font-bold text-[#3C4E53] text-sm">Talk to Hannah</p>
               <p className="text-xs text-[#3C4E53]/60 mt-0.5">Need to process something? She listens without judgment.</p>
             </div>
             <ChevronRight className="w-4 h-4 text-sky-400/60 flex-shrink-0" />
          </div>
        </Link>

        {/* ── Prayer Wall ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-[#E8701F]" />
              <p className="text-[11px] font-bold text-[#E8701F]/70 uppercase tracking-widest">Prayer Wall</p>
            </div>
            <span className="text-[10px] font-bold text-[#3C4E53]/30 bg-[#3C4E53]/5 px-2 py-0.5 rounded-full">{filtered.length} requests</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${activeCategory === cat ? 'border-[#E8701F] text-[#E8701F]' : 'bg-[#3C4E53]/5 border-[#3C4E53]/10 text-[#3C4E53]/40 hover:border-[#3C4E53]/25'}`}
                style={activeCategory === cat ? { background: 'rgba(232,112,31,0.12)' } : {}}>
                {cat}
              </button>
            ))}
          </div>

          {prayersLoading ? (
            <div className="flex flex-col items-center py-12 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#E8701F]" />
              <p className="text-[#3C4E53]/50 text-sm">Loading prayers...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🙏</div>
              <p className="text-[#3C4E53]/50 text-sm">No prayer requests yet.</p>
              <button onClick={() => setShowNewPrayer(true)}
                className="mt-4 px-5 py-2.5 rounded-full text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #E8701F, #F5985D)' }}>
                Be the first to share
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((req, i) => (
                <PrayerRow key={req.id} request={req} index={i} onOpen={setSelectedRequest} user={user} />
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedRequest && freshSelected && (
          <PrayerDrawer
            request={freshSelected}
            user={user}
            onClose={() => setSelectedRequest(null)}
            onPray={() => handlePray(freshSelected)}
            onComment={text => addComment.mutate({ requestId: freshSelected.id, commentText: text })}
            onDelete={() => deleteRequest.mutate(freshSelected.id)}
            onMarkAnswered={() => markAnswered.mutate(freshSelected.id)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewPrayer && (
          <NewPrayerModal user={user} onClose={() => setShowNewPrayer(false)} onSubmit={createRequest.mutateAsync} />
        )}
      </AnimatePresence>
    </div>
  );
}