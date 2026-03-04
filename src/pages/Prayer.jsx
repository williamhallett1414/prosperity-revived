import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Send, X, ChevronRight, Loader2, MessageCircle,
  Plus, Shield, ArrowLeft, Trash2, CheckCircle2, RefreshCw
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import DailyGuidedPrayer from '@/components/prayer/DailyGuidedPrayer';
import CalmingScriptureMeditation from '@/components/prayer/CalmingScriptureMeditation';
import DailyPrayer from '@/components/selfcare/DailyPrayer';
import TakeTimeWithGod from '@/components/selfcare/TakeTimeWithGod';

// ─── Constants ────────────────────────────────────────────────────────────────
const SPOTLIGHT_DURATION = 30;
const CATEGORIES = ['All', 'Healing', 'Family', 'Finances', 'Guidance', 'Praise', 'Relationships', 'Other'];
const CATEGORY_COLORS = {
  Healing:       'bg-rose-500/20 text-rose-300 border-rose-500/30',
  Family:        'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Finances:      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Guidance:      'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Praise:        'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
  Relationships: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
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

// Fix #5 — require auth before interactive actions
function requireAuth(user, action) {
  if (!user) {
    toast.error('Please sign in to ' + action);
    return false;
  }
  return true;
}

// ─── Countdown Ring ───────────────────────────────────────────────────────────
function CountdownRing({ seconds, total }) {
  const r = 18, circ = 2 * Math.PI * r;
  const progress = (seconds / total) * circ;
  return (
    <svg width="44" height="44" className="rotate-[-90deg]">
      <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
      <circle cx="22" cy="22" r={r} fill="none" stroke="#c9a227" strokeWidth="2.5"
        strokeDasharray={circ} strokeDashoffset={circ - progress} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
    </svg>
  );
}

// ─── Spotlight Card ───────────────────────────────────────────────────────────
function SpotlightCard({ request, countdown, total, onPray, onNext, onClick, hasPrayed }) {
  const prayerCount = request?.prayer_count || 0;
  return (
    <div className="relative rounded-3xl overflow-hidden cursor-pointer"
      style={{ background: 'linear-gradient(135deg, #0f2027 0%, #1a3a4a 50%, #203a43 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)' }}
      onClick={onClick}
    >
      <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(201,162,39,0.3) 0%, transparent 70%)' }} />
      {/* Answered badge */}
      {request?.is_answered && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500/25 border border-emerald-400/40 rounded-full px-2 py-0.5 z-10">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-wide">Answered</span>
        </div>
      )}
      <div className="relative p-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#c9a227] rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-[#c9a227] uppercase tracking-widest">Praying for {request?.user_name || '...'}</span>
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
        <p className="text-white font-semibold text-[15px] leading-relaxed mb-5 line-clamp-4" style={{ fontFamily: 'Georgia, serif' }}>
          {request?.prayer_text || 'Loading prayers...'}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🙏</span>
            <span className="text-xs font-semibold text-white/70">
              <span className="text-white font-bold">{prayerCount.toLocaleString()}</span> praying
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Fix #12 — show "Prayed" state if already prayed */}
            <button onClick={e => { e.stopPropagation(); onPray(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-bold ${
                hasPrayed
                  ? 'bg-[#c9a227]/40 border-[#c9a227] text-[#c9a227]'
                  : 'bg-[#c9a227]/20 border-[#c9a227]/40 hover:bg-[#c9a227]/30 text-[#c9a227]'
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
      style={{ background: request.is_answered ? 'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(52,211,153,0.03))' : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', border: request.is_answered ? '1px solid rgba(52,211,153,0.2)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '16px', backdropFilter: 'blur(10px)' }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
          style={{ background: request.is_answered ? 'linear-gradient(135deg, #065f46, #059669)' : 'linear-gradient(135deg, #1a3a4a, #2d5a70)' }}>
          {initials(request.user_name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white text-sm">{request.user_name}</span>
              {/* Fix #10 — answered badge on row */}
              {request.is_answered && (
                <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 rounded-full px-1.5 py-0.5 uppercase tracking-wide">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Answered
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {request.category && request.category !== 'All' && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-bold uppercase tracking-wide ${catColor}`}>{request.category}</span>
              )}
              <span className="text-[10px] text-white/30">{timeAgo(request.created_date)}</span>
            </div>
          </div>
          <p className="text-white/60 text-xs leading-relaxed line-clamp-2">{request.prayer_text}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-[11px] text-white/35"><span>🙏</span> {request.prayer_count || 0}</span>
            <span className="flex items-center gap-1 text-[11px] text-white/35"><MessageCircle className="w-3 h-3" /> {(request.comments || []).length}</span>
            {hasPrayed && <span className="text-[11px] text-[#c9a227] font-semibold">✓ You prayed</span>}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0 mt-1 group-hover:text-white/50 transition-colors" />
      </div>
    </motion.div>
  );
}

// ─── Prayer Detail Drawer ─────────────────────────────────────────────────────
function PrayerDrawer({ request, user, onClose, onPray, onComment, onDelete, onMarkAnswered, refetchInterval }) {
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const catColor = CATEGORY_COLORS[request?.category] || CATEGORY_COLORS.Other;
  const comments = request?.comments || [];

  // Fix #12 — use prayed_by array for per-user guard
  const hasPrayed = (request?.prayed_by || []).includes(user?.email);
  const isOwner = user?.email && (
    request?.created_by === user.email ||
    request?.user_email === user.email ||
    // fallback: name match if not anonymous
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
      style={{ background: 'rgba(5,15,25,0.97)', backdropFilter: 'blur(20px)' }}
    >
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-3">
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <div className="w-10 h-1 rounded-full bg-white/20" />
        {/* Fix #8 — delete button for own requests */}
        {isOwner ? (
          <button onClick={() => setConfirmDelete(true)} className="w-9 h-9 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center">
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        ) : <div className="w-9" />}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {/* Author */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
            style={{ background: request?.is_answered ? 'linear-gradient(135deg, #065f46, #059669)' : 'linear-gradient(135deg, #1a3a4a, #2d5a70)' }}>
            {initials(request?.user_name)}
          </div>
          <div>
            <p className="font-bold text-white">{request?.user_name}</p>
            <p className="text-xs text-white/40">{timeAgo(request?.created_date)}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {request?.is_answered && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-2 py-1 uppercase tracking-wide">
                <CheckCircle2 className="w-3 h-3" /> Answered
              </span>
            )}
            {request?.category && request.category !== 'All' && (
              <span className={`text-[10px] px-2 py-1 rounded-full border font-bold uppercase tracking-wide ${catColor}`}>{request.category}</span>
            )}
          </div>
        </div>

        {/* Prayer text */}
        <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, rgba(201,162,39,0.08), rgba(201,162,39,0.03))', border: '1px solid rgba(201,162,39,0.2)' }}>
          <p className="text-white leading-relaxed text-[15px]" style={{ fontFamily: 'Georgia, serif' }}>{request?.prayer_text}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-3">
          {/* Fix #12 — disable pray button if already prayed */}
          <button onClick={() => { if (requireAuth(user, 'record a prayer')) onPray(); }}
            disabled={hasPrayed}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all ${
              hasPrayed
                ? 'opacity-60 cursor-default'
                : 'hover:opacity-90'
            }`}
            style={{ background: 'linear-gradient(135deg, #c9a227, #92701a)', color: 'white' }}>
            <span>🙏</span>
            {hasPrayed ? `Prayed (${request?.prayer_count || 0}) ✓` : `I Prayed (${request?.prayer_count || 0})`}
          </button>
        </div>

        {/* Fix #10 — mark as answered (owner only, not yet answered) */}
        {isOwner && !request?.is_answered && (
          <button onClick={onMarkAnswered}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl font-bold text-sm mb-5 transition-all bg-emerald-500/12 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" /> Mark as Answered 🙌
          </button>
        )}

        {/* Comments section */}
        <div>
          <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-4">
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </p>
          {comments.length === 0 && (
            <div className="text-center py-6">
              <p className="text-white/30 text-sm">Be the first to leave a word of encouragement</p>
            </div>
          )}
          <div className="space-y-3 mb-6">
            {[...comments].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map(comment => (
              <div key={comment.comment_id} className="rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-white">{comment.user_name}</span>
                  <span className="text-[10px] text-white/30">{timeAgo(comment.timestamp)}</span>
                </div>
                <p className="text-sm text-white/65 leading-relaxed">{comment.comment_text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fix #5 — show sign-in prompt if not authenticated */}
      {!user ? (
        <div className="flex-shrink-0 px-5 py-4 border-t border-white/8 text-center"
          style={{ background: 'rgba(10,20,30,0.98)' }}>
          <p className="text-white/40 text-sm">Sign in to leave encouragement</p>
        </div>
      ) : (
        <div className="flex-shrink-0 px-5 py-4 border-t border-white/8"
          style={{ background: 'rgba(10,20,30,0.98)', backdropFilter: 'blur(20px)' }}>
          <div className="flex gap-2">
            <Input value={commentText} onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleComment()}
              placeholder="Share a word of encouragement…"
              className="flex-1 border-white/12 text-white placeholder:text-white/30 rounded-xl text-sm"
              style={{ background: 'rgba(255,255,255,0.07)' }}
            />
            <button onClick={handleComment} disabled={!commentText.trim() || submitting}
              className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #c9a227, #92701a)' }}>
              {submitting ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
            </button>
          </div>
        </div>
      )}

      {/* Fix #8 — delete confirm overlay */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-end justify-center pb-8 px-5 z-60"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
            <div className="rounded-3xl p-6 w-full max-w-sm" style={{ background: '#0f1f2f', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="font-bold text-white text-center mb-1">Delete prayer request?</p>
              <p className="text-white/40 text-sm text-center mb-5">This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-3 rounded-2xl border border-white/15 text-white/60 font-semibold text-sm">Cancel</button>
                <button onClick={() => { onDelete(); setConfirmDelete(false); }}
                  className="flex-1 py-3 rounded-2xl bg-red-500/80 text-white font-bold text-sm">Delete</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── New Prayer Modal (with review step) ─────────────────────────────────────
function NewPrayerModal({ user, onClose, onSubmit }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Other');
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Fix #13 — review step
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
      style={{ background: 'rgba(5,15,25,0.85)', backdropFilter: 'blur(16px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="rounded-t-3xl px-5 pt-5 pb-8"
        style={{ background: 'linear-gradient(180deg, #0f2027 0%, #0a1520 100%)', border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none' }}
      >
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

        {!reviewing ? (
          // ── Compose step ──
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Share Prayer Request</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex gap-2 flex-wrap mb-4">
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${category === cat ? 'bg-[#c9a227] border-[#c9a227] text-white' : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <Textarea value={text} onChange={e => setText(e.target.value)}
              placeholder="Share what's on your heart…"
              className="border-white/12 text-white placeholder:text-white/30 rounded-2xl min-h-[120px] mb-4 resize-none text-sm"
              style={{ background: 'rgba(255,255,255,0.06)', fontFamily: 'Georgia, serif', lineHeight: '1.7' }}
            />
            <button onClick={() => setAnonymous(p => !p)}
              className={`flex items-center gap-2 text-sm mb-5 transition-colors ${anonymous ? 'text-[#c9a227]' : 'text-white/40'}`}>
              <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${anonymous ? 'bg-[#c9a227] border-[#c9a227]' : 'border-white/25'}`}>
                {anonymous && <Shield className="w-2.5 h-2.5 text-white" />}
              </div>
              Post anonymously
            </button>
            <button onClick={() => text.trim() && setReviewing(true)} disabled={!text.trim()}
              className="w-full py-4 rounded-2xl font-bold text-white text-sm disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #c9a227, #92701a)' }}>
              Review Before Posting →
            </button>
          </>
        ) : (
          // ── Review step (Fix #13) ──
          <>
            <div className="flex items-center justify-between mb-5">
              <button onClick={() => setReviewing(false)} className="flex items-center gap-1.5 text-white/60 text-sm font-semibold">
                <ArrowLeft className="w-4 h-4" /> Edit
              </button>
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wide">Review</h2>
              <div className="w-14" />
            </div>
            <div className="rounded-2xl p-4 mb-3" style={{ background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ background: 'linear-gradient(135deg, #1a3a4a, #2d5a70)' }}>
                  {initials(anonymous ? 'Anonymous' : user?.full_name)}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{anonymous ? 'Anonymous' : user?.full_name}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-bold uppercase tracking-wide ${CATEGORY_COLORS[category] || CATEGORY_COLORS.Other}`}>{category}</span>
                </div>
              </div>
              <p className="text-white/80 text-sm leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>{text}</p>
            </div>
            <p className="text-white/35 text-xs text-center mb-5">This will be visible to everyone on the prayer wall.</p>
            <button onClick={handleSubmit} disabled={submitting}
              className="w-full py-4 rounded-2xl font-bold text-white text-sm disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              style={{ background: submitting ? '#555' : 'linear-gradient(135deg, #c9a227, #92701a)' }}>
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <>🙏 Submit Prayer Request</>}
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Devotional wrapper — Fix #6 dark theme ──────────────────────────────────
function DevotionalSection() {
  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="px-4 pt-4 pb-1">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Daily Practice</p>
      </div>
      <div className="px-3 pb-3 space-y-3 [&_*]:!text-inherit [&_.bg-white]:!bg-white/8 [&_[class*='bg-white']]:!bg-white/8">
        <DailyGuidedPrayer />
        <CalmingScriptureMeditation />
        <DailyPrayer />
        <TakeTimeWithGod />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Prayer() {
  const [user, setUser] = useState(null);
  const [spotlightIdx, setSpotlightIdx] = useState(0);
  const [countdown, setCountdown] = useState(SPOTLIGHT_DURATION);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showNewPrayer, setShowNewPrayer] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => { base44.auth.me().then(setUser); }, []);

  // Fix #4 — faster refetch when drawer is open (10s), otherwise 30s
  const refetchInterval = selectedRequest ? 10_000 : 30_000;

  const { data: prayerRequests = [] } = useQuery({
    queryKey: ['prayerRequests'],
    queryFn: () => base44.entities.PrayerRequest.list('-created_date', 100),
    refetchInterval,
  });

  const filtered = activeCategory === 'All' ? prayerRequests : prayerRequests.filter(r => r.category === activeCategory);
  const spotlightRequests = prayerRequests.slice(0, 10);

  // Fix #2 — clamp spotlightIdx when list shrinks
  useEffect(() => {
    if (spotlightRequests.length > 0 && spotlightIdx >= spotlightRequests.length) {
      setSpotlightIdx(0);
    }
  }, [spotlightRequests.length, spotlightIdx]);

  // Countdown timer
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

  // Fix #11 — manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries(['prayerRequests']);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Fix #12 — use prayed_by array; prevent spam
  const recordPrayer = useMutation({
    mutationFn: async (request) => {
      // Re-fetch fresh copy to avoid race on prayed_by array
      const fresh = await base44.entities.PrayerRequest.get(request.id);
      const prayedBy = fresh?.prayed_by || [];
      if (prayedBy.includes(user?.email)) return; // already prayed
      return base44.entities.PrayerRequest.update(request.id, {
        prayed_by: [...prayedBy, user?.email],
        prayer_count: (fresh?.prayer_count || 0) + 1,
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['prayerRequests']),
  });

  // Fix #1 — re-fetch fresh comments before writing to avoid race condition
  const addComment = useMutation({
    mutationFn: async ({ requestId, commentText }) => {
      if (!user?.email) throw new Error('Not authenticated');
      // Fetch the freshest version of this request first
      const fresh = await base44.entities.PrayerRequest.get(requestId);
      const existingComments = fresh?.comments || [];
      const newComment = {
        comment_id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        user_email: user.email,
        user_name: user.full_name || 'Anonymous',
        comment_text: commentText,
        timestamp: new Date().toISOString(),
      };
      return base44.entities.PrayerRequest.update(requestId, {
        comments: [...existingComments, newComment],
      });
    },
    onSuccess: () => { queryClient.invalidateQueries(['prayerRequests']); toast.success('Encouragement sent 🙏'); },
    onError: () => toast.error('Failed to send — please try again'),
  });

  const deleteRequest = useMutation({
    mutationFn: async (requestId) => base44.entities.PrayerRequest.delete(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries(['prayerRequests']);
      setSelectedRequest(null);
      toast.success('Prayer request removed');
    },
  });

  // Fix #10 — mark as answered
  const markAnswered = useMutation({
    mutationFn: async (requestId) => base44.entities.PrayerRequest.update(requestId, { is_answered: true }),
    onSuccess: () => { queryClient.invalidateQueries(['prayerRequests']); toast.success('🙌 Praise God — marked as answered!'); },
  });

  const createRequest = useMutation({
    mutationFn: async ({ text, category, anonymous }) => base44.entities.PrayerRequest.create({
      user_name: anonymous ? 'Anonymous' : user?.full_name || 'Anonymous',
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
  });

  const handlePray = useCallback((request) => {
    if (!requireAuth(user, 'record a prayer')) return;
    const hasPrayed = (request.prayed_by || []).includes(user?.email);
    if (hasPrayed) { toast.info('You\'ve already prayed for this request', { duration: 1500 }); return; }
    recordPrayer.mutate(request);
    toast.success('🙏 Prayer recorded', { duration: 1500 });
  }, [user, recordPrayer]);

  // freshSelected: always use latest from query for live comment updates
  const freshSelected = selectedRequest
    ? prayerRequests.find(r => r.id === selectedRequest.id) || selectedRequest
    : null;

  return (
    <div className="min-h-screen pb-28" style={{ background: 'linear-gradient(180deg, #050f18 0%, #0a1a2f 40%, #0d1f35 100%)' }}>

      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-5 py-4"
        style={{ background: 'rgba(5,15,24,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Prayer Wall</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            {/* Fix #9 — "requests" not "waiting" */}
            <span className="text-[11px] text-white/40 font-medium">
              {prayerRequests.length} requests · {totalPraying.toLocaleString()} prayers offered
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Fix #11 — manual refresh button */}
          <button onClick={handleRefresh}
            className={`w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center transition-all ${isRefreshing ? 'opacity-50' : 'hover:bg-white/15'}`}>
            <RefreshCw className={`w-4 h-4 text-white/60 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => { if (requireAuth(user, 'share a prayer request')) setShowNewPrayer(true); }}
            className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #c9a227, #92701a)' }}>
            <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">

        {/* Spotlight */}
        {currentSpotlight && (
          <div>
            <SpotlightCard
              request={currentSpotlight}
              countdown={countdown}
              total={SPOTLIGHT_DURATION}
              hasPrayed={(currentSpotlight.prayed_by || []).includes(user?.email)}
              onPray={() => handlePray(currentSpotlight)}
              onNext={() => { setSpotlightIdx(i => (i + 1) % Math.max(spotlightRequests.length, 1)); setCountdown(SPOTLIGHT_DURATION); }}
              onClick={() => setSelectedRequest(currentSpotlight)}
            />
            {/* Fix #7 — dots match spotlight count exactly */}
            <div className="flex justify-center gap-1.5 mt-3">
              {spotlightRequests.map((_, i) => (
                <button key={i} onClick={() => { setSpotlightIdx(i); setCountdown(SPOTLIGHT_DURATION); }}>
                  <div className={`rounded-full transition-all duration-300 ${i === spotlightIdx ? 'w-5 h-1.5 bg-[#c9a227]' : 'w-1.5 h-1.5 bg-white/20'}`} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fix #6 — devotional tools in dark wrapper */}
        <DevotionalSection />

        {/* Prayer Wall list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Prayer Requests</p>
            {/* Fix #9 — accurate label */}
            <span className="text-[11px] text-white/30 font-medium">{filtered.length} requests</span>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${activeCategory === cat ? 'bg-[#c9a227] border-[#c9a227] text-white' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'}`}>
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🙏</div>
              <p className="text-white/30 text-sm">No prayer requests yet.</p>
              <button onClick={() => setShowNewPrayer(true)}
                className="mt-4 px-5 py-2.5 rounded-full text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #c9a227, #92701a)' }}>
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

      {/* Drawer */}
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

      {/* New prayer modal */}
      <AnimatePresence>
        {showNewPrayer && (
          <NewPrayerModal user={user} onClose={() => setShowNewPrayer(false)} onSubmit={createRequest.mutateAsync} />
        )}
      </AnimatePresence>
    </div>
  );
}
