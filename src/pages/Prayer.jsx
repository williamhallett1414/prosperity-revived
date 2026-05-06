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
import SanctuaryBackground from '@/components/prayer/SanctuaryBackground';
import { getDisplayName, getDisplayNameFromString } from '@/lib/userName';

// ─── Constants ────────────────────────────────────────────────────────────────
const SPOTLIGHT_DURATION = 30;
const CATEGORIES = ['All', 'Healing', 'Family', 'Finances', 'Guidance', 'Praise', 'Relationships', 'Other'];

// Calming, restrained palette for the sanctuary aesthetic. Each category
// gets a soft glow rather than a saturated tag — the goal is reverence,
// not visual noise. All colors meet AA contrast against the dark sanctuary
// background (rgba(255,255,255,0.06) glass + ivory text).
const CATEGORY_COLORS = {
  Healing:       { bg: 'rgba(252, 165, 165, 0.10)', border: 'rgba(252, 165, 165, 0.30)', text: '#fca5a5' },
  Family:        { bg: 'rgba(251, 191, 36, 0.10)',  border: 'rgba(251, 191, 36, 0.30)',  text: '#fcd34d' },
  Finances:      { bg: 'rgba(110, 231, 183, 0.10)', border: 'rgba(110, 231, 183, 0.30)', text: '#6ee7b7' },
  Guidance:      { bg: 'rgba(147, 197, 253, 0.10)', border: 'rgba(147, 197, 253, 0.30)', text: '#93c5fd' },
  Praise:        { bg: 'rgba(254, 240, 138, 0.10)', border: 'rgba(254, 240, 138, 0.30)', text: '#fef08a' },
  Relationships: { bg: 'rgba(244, 182, 220, 0.10)', border: 'rgba(244, 182, 220, 0.30)', text: '#f4b6dc' },
  Other:         { bg: 'rgba(214, 200, 168, 0.10)', border: 'rgba(214, 200, 168, 0.30)', text: '#d6c8a8' },
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
    <svg width="44" height="44" className="rotate-[-90deg]" style={{ filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.35))' }}>
      <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(251,191,36,0.12)" strokeWidth="2" />
      <circle cx="22" cy="22" r={r} fill="none" stroke="#fbbf24" strokeWidth="2"
        strokeDasharray={circ} strokeDashoffset={circ - progress} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s linear' }} />
    </svg>
  );
}

// ─── Spotlight Card ───────────────────────────────────────────────────────────
function SpotlightCard({ request, countdown, total, onPray, onNext, onClick, hasPrayed }) {
  const prayerCount = request?.prayer_count || 0;
  return (
    <div
      className="relative rounded-[28px] overflow-hidden cursor-pointer group"
      onClick={onClick}
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(251,191,36,0.18)',
        boxShadow: '0 20px 60px -12px rgba(0,0,0,0.5), 0 0 80px -20px rgba(251,191,36,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      {/* Soft halo behind the card content — like candlelight from within */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(251,191,36,0.18) 0%, transparent 70%)' }}
      />

      {request?.is_answered && (
        <div
          className="absolute top-4 right-4 flex items-center gap-1 rounded-full px-2.5 py-1 z-10"
          style={{ background: 'rgba(110,231,183,0.12)', border: '1px solid rgba(110,231,183,0.35)' }}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-300" />
          <span className="text-[9px] font-semibold text-emerald-200 uppercase tracking-[0.15em]">Answered</span>
        </div>
      )}

      <div className="relative p-6 pb-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-amber-300 opacity-60 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-amber-300" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgba(251,191,36,0.85)' }}>
              Praying for {getDisplayNameFromString(request?.user_name, '...')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-[0.15em] font-medium" style={{ color: 'rgba(245,241,232,0.4)' }}>Next in</span>
            <div className="relative flex items-center justify-center w-11 h-11">
              <CountdownRing seconds={countdown} total={total} />
              <span className="absolute text-[10px] font-semibold tabular-nums" style={{ color: '#f5f1e8' }}>
                {String(Math.floor(countdown / 60)).padStart(1,'0')}:{String(countdown % 60).padStart(2,'0')}
              </span>
            </div>
          </div>
        </div>

        {/* The prayer text — set in serif and given room to breathe */}
        <p
          className="text-[17px] leading-[1.7] mb-6 line-clamp-4"
          style={{
            fontFamily: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
            color: '#f5f1e8',
            fontWeight: 400,
            letterSpacing: '0.005em',
          }}
        >
          {request?.prayer_text || 'Loading prayers...'}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🙏</span>
            <span className="text-xs" style={{ color: 'rgba(245,241,232,0.55)' }}>
              <span style={{ color: '#f5f1e8' }} className="font-semibold">{prayerCount.toLocaleString()}</span>
              {' '}praying
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={e => { e.stopPropagation(); onPray(); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-300 text-xs font-semibold active:scale-[0.97]"
              style={
                hasPrayed
                  ? {
                      background: 'rgba(251,191,36,0.18)',
                      border: '1px solid rgba(251,191,36,0.5)',
                      color: '#fcd34d',
                    }
                  : {
                      background: 'linear-gradient(135deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))',
                      border: '1px solid rgba(251,191,36,0.7)',
                      color: '#0f1729',
                      boxShadow: '0 4px 16px -4px rgba(251,191,36,0.5)',
                    }
              }
            >
              <Heart className={`w-3.5 h-3.5 ${hasPrayed ? 'fill-current' : ''}`} />
              {hasPrayed ? 'Prayed' : 'I Prayed'}
            </button>
            <button
              onClick={e => { e.stopPropagation(); onNext(); }}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/10 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              aria-label="Next prayer"
            >
              <ChevronRight className="w-4 h-4" style={{ color: 'rgba(245,241,232,0.7)' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Prayer Row ───────────────────────────────────────────────────────────────
function PrayerRow({ request, index, onOpen, user }) {
  const cat = CATEGORY_COLORS[request.category] || CATEGORY_COLORS.Other;
  const hasPrayed = (request.prayed_by || []).includes(user?.email);
  const isAnswered = request.is_answered;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen(request)}
      className="group cursor-pointer"
      style={{
        background: isAnswered
          ? 'linear-gradient(135deg, rgba(110,231,183,0.07) 0%, rgba(110,231,183,0.02) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        border: isAnswered
          ? '1px solid rgba(110,231,183,0.22)'
          : '1px solid rgba(251,191,36,0.10)',
        borderRadius: '20px',
        padding: '16px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'border-color 0.3s ease, transform 0.3s ease',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm"
          style={{
            background: isAnswered
              ? 'linear-gradient(135deg, #065f46, #047857)'
              : 'linear-gradient(135deg, #1a2547, #243154)',
            border: '1px solid rgba(251,191,36,0.18)',
            color: '#f5f1e8',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {initials(getDisplayNameFromString(request.user_name, ''))}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-medium text-sm truncate" style={{ color: '#f5f1e8' }}>
                {getDisplayNameFromString(request.user_name, 'Anonymous')}
              </span>
              {isAnswered && (
                <span
                  className="flex items-center gap-0.5 text-[9px] font-semibold rounded-full px-1.5 py-0.5 uppercase tracking-[0.12em] flex-shrink-0"
                  style={{
                    background: 'rgba(110,231,183,0.10)',
                    border: '1px solid rgba(110,231,183,0.30)',
                    color: '#6ee7b7',
                  }}
                >
                  <CheckCircle2 className="w-2.5 h-2.5" /> Answered
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
              {request.category && request.category !== 'All' && (
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-[0.1em]"
                  style={{ background: cat.bg, border: `1px solid ${cat.border}`, color: cat.text }}
                >
                  {request.category}
                </span>
              )}
              <span className="text-[10px]" style={{ color: 'rgba(245,241,232,0.4)' }}>
                {timeAgo(request.created_date)}
              </span>
            </div>
          </div>
          <p
            className="text-[13px] leading-relaxed line-clamp-2"
            style={{
              fontFamily: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
              color: 'rgba(245,241,232,0.72)',
              fontWeight: 400,
            }}
          >
            {request.prayer_text}
          </p>
          <div className="flex items-center gap-3 mt-2.5">
            <span className="flex items-center gap-1 text-[11px]" style={{ color: 'rgba(245,241,232,0.45)' }}>
              <span>🙏</span> {request.prayer_count || 0}
            </span>
            <span className="flex items-center gap-1 text-[11px]" style={{ color: 'rgba(245,241,232,0.45)' }}>
              <MessageCircle className="w-3 h-3" /> {(request.comments || []).length}
            </span>
            {hasPrayed && (
              <span className="text-[11px] font-medium" style={{ color: '#fcd34d' }}>
                ✓ You prayed
              </span>
            )}
          </div>
        </div>
        <ChevronRight
          className="w-4 h-4 flex-shrink-0 mt-1 transition-colors"
          style={{ color: 'rgba(245,241,232,0.20)' }}
        />
      </div>
    </motion.div>
  );
}

// ─── Prayer Drawer ────────────────────────────────────────────────────────────
function PrayerDrawer({ request, user, onClose, onPray, onComment, onDelete, onMarkAnswered }) {
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cat = CATEGORY_COLORS[request?.category] || CATEGORY_COLORS.Other;
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #0a1020 0%, #1a2547 100%)',
      }}
    >
      {/* Subtle radial halo behind content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(251,191,36,0.10) 0%, transparent 70%)' }}
      />

      <div className="relative flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-3">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          aria-label="Close"
        >
          <ArrowLeft className="w-4 h-4" style={{ color: '#f5f1e8' }} />
        </button>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(251,191,36,0.6)' }} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgba(251,191,36,0.8)' }}>
            Prayer Request
          </span>
          <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(251,191,36,0.6)' }} />
        </div>
        {isOwner ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.25)' }}
            aria-label="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-300" />
          </button>
        ) : <div className="w-10" />}
      </div>

      <div className="relative flex-1 overflow-y-auto px-5 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-semibold"
            style={{
              background: request?.is_answered
                ? 'linear-gradient(135deg, #065f46, #047857)'
                : 'linear-gradient(135deg, #1a2547, #243154)',
              color: '#f5f1e8',
              border: '1px solid rgba(251,191,36,0.18)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            {initials(getDisplayNameFromString(request?.user_name, ''))}
          </div>
          <div>
            <p className="font-semibold" style={{ color: '#f5f1e8' }}>
              {getDisplayNameFromString(request?.user_name, 'Anonymous')}
            </p>
            <p className="text-xs" style={{ color: 'rgba(245,241,232,0.45)' }}>{timeAgo(request?.created_date)}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {request?.is_answered && (
              <span
                className="flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-1 uppercase tracking-[0.12em]"
                style={{
                  background: 'rgba(110,231,183,0.10)',
                  border: '1px solid rgba(110,231,183,0.30)',
                  color: '#6ee7b7',
                }}
              >
                <CheckCircle2 className="w-3 h-3" /> Answered
              </span>
            )}
            {request?.category && request.category !== 'All' && (
              <span
                className="text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-[0.1em]"
                style={{ background: cat.bg, border: `1px solid ${cat.border}`, color: cat.text }}
              >
                {request.category}
              </span>
            )}
          </div>
        </div>

        {/* The prayer itself — given full reverence */}
        <div
          className="rounded-3xl p-6 mb-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(251,191,36,0.20)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div
            className="absolute -top-4 -left-2 text-[110px] leading-none font-serif select-none pointer-events-none"
            style={{ color: 'rgba(251,191,36,0.10)', fontFamily: '"Cormorant Garamond", Georgia, serif' }}
          >
            "
          </div>
          <p
            className="relative text-[16px] leading-[1.75]"
            style={{
              fontFamily: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
              color: '#f5f1e8',
              fontWeight: 400,
              letterSpacing: '0.005em',
            }}
          >
            {request?.prayer_text}
          </p>
        </div>

        <div className="flex gap-3 mb-3">
          <button
            onClick={() => { if (requireAuth(user, 'record a prayer')) onPray(); }}
            disabled={hasPrayed}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 active:scale-[0.98]"
            style={
              hasPrayed
                ? {
                    background: 'rgba(251,191,36,0.10)',
                    border: '1px solid rgba(251,191,36,0.30)',
                    color: '#fcd34d',
                    cursor: 'default',
                  }
                : {
                    background: 'linear-gradient(135deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))',
                    color: '#0f1729',
                    boxShadow: '0 8px 24px -8px rgba(251,191,36,0.5)',
                  }
            }
          >
            <span>🙏</span>
            {hasPrayed ? `Prayed (${request?.prayer_count || 0}) ✓` : `I Prayed (${request?.prayer_count || 0})`}
          </button>
        </div>

        {isOwner && !request?.is_answered && (
          <button
            onClick={onMarkAnswered}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm mb-6 transition-all active:scale-[0.98]"
            style={{
              background: 'rgba(110,231,183,0.10)',
              border: '1px solid rgba(110,231,183,0.30)',
              color: '#6ee7b7',
            }}
          >
            <CheckCircle2 className="w-4 h-4" /> Mark as Answered 🙌
          </button>
        )}

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: 'rgba(245,241,232,0.45)' }}>
            {comments.length} {comments.length === 1 ? 'Word of Encouragement' : 'Words of Encouragement'}
          </p>
          {comments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm italic" style={{ color: 'rgba(245,241,232,0.45)', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                Be the first to leave a word of encouragement
              </p>
            </div>
          )}
          <div className="space-y-3 mb-6">
            {[...comments].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map(comment => (
              <div
                key={comment.comment_id}
                className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold" style={{ color: '#f5f1e8' }}>
                    {getDisplayNameFromString(comment.user_name, 'Anonymous')}
                  </span>
                  <span className="text-[10px]" style={{ color: 'rgba(245,241,232,0.40)' }}>
                    {timeAgo(comment.timestamp)}
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: 'rgba(245,241,232,0.75)',
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                  }}
                >
                  {comment.comment_text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!user ? (
        <div
          className="relative flex-shrink-0 px-5 py-4 text-center"
          style={{ background: 'rgba(15,23,41,0.95)', borderTop: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}
        >
          <p className="text-sm" style={{ color: 'rgba(245,241,232,0.55)' }}>Sign in to leave encouragement</p>
        </div>
      ) : (
        <div
          className="relative flex-shrink-0 px-5 py-4"
          style={{ background: 'rgba(15,23,41,0.95)', borderTop: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex gap-2">
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleComment()}
              maxLength={500}
              placeholder="Share a word of encouragement…"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: '#f5f1e8',
              }}
            />
            <button
              onClick={handleComment}
              disabled={!commentText.trim() || submitting}
              className="w-11 h-11 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all flex-shrink-0 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))',
                boxShadow: '0 4px 16px -4px rgba(251,191,36,0.4)',
              }}
              aria-label="Send"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#0f1729' }} /> : <Send className="w-4 h-4" style={{ color: '#0f1729' }} />}
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-end justify-center pb-8 px-5 z-60"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="rounded-3xl p-6 w-full max-w-sm"
              style={{
                background: 'linear-gradient(180deg, rgba(36,49,84,0.98) 0%, rgba(26,37,71,0.98) 100%)',
                border: '1px solid rgba(248,113,113,0.30)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              }}
            >
              <p className="font-semibold text-center mb-1" style={{ color: '#f5f1e8' }}>Delete prayer request?</p>
              <p className="text-sm text-center mb-5" style={{ color: 'rgba(245,241,232,0.55)' }}>This cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(245,241,232,0.75)',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => { onDelete(); setConfirmDelete(false); }}
                  className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-all"
                  style={{
                    background: 'linear-gradient(135deg, rgba(248,113,113,0.95), rgba(220,38,38,0.95))',
                    color: '#f5f1e8',
                  }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(5,10,20,0.7)', backdropFilter: 'blur(12px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 280 }}
        className="rounded-t-[32px] px-5 pt-5 pb-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #1a2547 0%, #243154 100%)',
          borderTop: '1px solid rgba(251,191,36,0.20)',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Soft halo at the top — like light from above */}
        <div
          className="absolute -top-10 left-0 right-0 h-32 pointer-events-none opacity-50"
          style={{ background: 'radial-gradient(ellipse 50% 100% at 50% 100%, rgba(251,191,36,0.18) 0%, transparent 70%)' }}
        />

        <div
          className="relative w-12 h-1 rounded-full mx-auto mb-6"
          style={{ background: 'rgba(245,241,232,0.20)' }}
        />

        {!reviewing ? (
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl"
                style={{
                  fontFamily: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
                  color: '#f5f1e8',
                  fontWeight: 500,
                  letterSpacing: '0.005em',
                }}
              >
                Share a prayer request
              </h2>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                aria-label="Close"
              >
                <X className="w-4 h-4" style={{ color: '#f5f1e8' }} />
              </button>
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(245,241,232,0.45)' }}>
              Category
            </p>
            <div className="flex gap-2 flex-wrap mb-5">
              {CATEGORIES.filter(c => c !== 'All').map(cat => {
                const isActive = category === cat;
                const c = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
                    style={
                      isActive
                        ? { background: c.bg, border: `1px solid ${c.border}`, color: c.text }
                        : {
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'rgba(245,241,232,0.55)',
                          }
                    }
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Share what's on your heart…"
              maxLength={1000}
              autoFocus
              className="w-full rounded-2xl px-4 py-3.5 min-h-[140px] mb-4 resize-none text-sm outline-none transition-colors"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: '#f5f1e8',
                fontFamily: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
                fontSize: '15px',
                lineHeight: '1.7',
                caretColor: '#fbbf24',
              }}
            />

            <button
              onClick={() => setAnonymous(p => !p)}
              className="flex items-center gap-2 text-sm mb-6 transition-colors"
              style={{ color: anonymous ? '#fcd34d' : 'rgba(245,241,232,0.55)' }}
            >
              <div
                className="w-4 h-4 rounded flex items-center justify-center transition-all"
                style={
                  anonymous
                    ? { background: '#fbbf24', border: '1px solid #fbbf24' }
                    : { border: '1px solid rgba(245,241,232,0.30)' }
                }
              >
                {anonymous && <Shield className="w-2.5 h-2.5" style={{ color: '#0f1729' }} />}
              </div>
              Post anonymously
            </button>

            <button
              onClick={() => text.trim() && setReviewing(true)}
              disabled={!text.trim()}
              className="w-full py-4 rounded-2xl font-semibold text-sm disabled:opacity-30 transition-all active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))',
                color: '#0f1729',
                boxShadow: '0 8px 24px -8px rgba(251,191,36,0.4)',
              }}
            >
              Review before posting →
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setReviewing(false)}
                className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
                style={{ color: 'rgba(245,241,232,0.6)' }}
              >
                <ArrowLeft className="w-4 h-4" /> Edit
              </button>
              <h2
                className="text-sm font-semibold uppercase tracking-[0.2em]"
                style={{ color: 'rgba(245,241,232,0.6)' }}
              >
                Review
              </h2>
              <div className="w-14" />
            </div>

            <div
              className="rounded-2xl p-5 mb-4 relative overflow-hidden"
              style={{
                background: 'rgba(251,191,36,0.06)',
                border: '1px solid rgba(251,191,36,0.20)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs"
                  style={{
                    background: 'linear-gradient(135deg, #1a2547, #243154)',
                    color: '#f5f1e8',
                    border: '1px solid rgba(251,191,36,0.18)',
                  }}
                >
                  {initials(anonymous ? 'Anonymous' : getDisplayName(user, ''))}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#f5f1e8' }}>
                    {anonymous ? 'Anonymous' : getDisplayName(user, 'Anonymous')}
                  </p>
                  <span
                    className="inline-block text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-[0.1em] mt-0.5"
                    style={{
                      background: (CATEGORY_COLORS[category] || CATEGORY_COLORS.Other).bg,
                      border: `1px solid ${(CATEGORY_COLORS[category] || CATEGORY_COLORS.Other).border}`,
                      color: (CATEGORY_COLORS[category] || CATEGORY_COLORS.Other).text,
                    }}
                  >
                    {category}
                  </span>
                </div>
              </div>
              <p
                className="leading-relaxed"
                style={{
                  color: '#f5f1e8',
                  fontFamily: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
                  fontSize: '15px',
                  lineHeight: '1.75',
                }}
              >
                {text}
              </p>
            </div>

            <p className="text-xs text-center mb-5" style={{ color: 'rgba(245,241,232,0.50)' }}>
              This will be visible to everyone on the prayer wall.
            </p>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-4 rounded-2xl font-semibold text-sm disabled:opacity-40 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              style={{
                background: submitting
                  ? 'rgba(255,255,255,0.10)'
                  : 'linear-gradient(135deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))',
                color: '#0f1729',
                boxShadow: submitting ? 'none' : '0 8px 24px -8px rgba(251,191,36,0.4)',
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                </>
              ) : (
                <>🙏 Submit prayer request</>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── ACTS Guided Prayer ───────────────────────────────────────────────────────
const ACTS_STEPS = [
  { key: 'adoration',    label: 'Adoration',    emoji: '✨', color: '#fbbf24',
    prompt: 'Praise God for who He is — His holiness, goodness, faithfulness. Not what He has done, but His character.',
    placeholder: 'Lord, I praise You because You are…' },
  { key: 'confession',   label: 'Confession',   emoji: '🕊️', color: '#93c5fd',
    prompt: 'Honestly name anything between you and God — a failing, a grudge, something you\'re carrying. He already knows and He already forgives. This isn\'t about shame — it\'s about freedom. "If we confess our sins, he is faithful and righteous to forgive us the sins." (1 John 1:9). Who do you also need to extend grace to — including yourself?',
    placeholder: 'Father, I release to You…' },
  { key: 'thanksgiving', label: 'Thanksgiving', emoji: '🙏', color: '#6ee7b7',
    prompt: 'Thank God specifically — for what He has done, what He prevented, who He placed in your life.',
    placeholder: 'Thank You, Lord, for…' },
  { key: 'supplication', label: 'Supplication', emoji: '💫', color: '#c4b5fd',
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
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-[28px] p-8 text-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(251,191,36,0.20)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(251,191,36,0.15) 0%, transparent 70%)' }}
      />
      <div className="relative">
        <div className="text-5xl mb-4">🙏</div>
        <p
          className="text-xl mb-2"
          style={{
            fontFamily: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
            color: '#f5f1e8',
            fontWeight: 500,
          }}
        >
          Prayer complete
        </p>
        <p
          className="italic mb-5"
          style={{
            color: 'rgba(245,241,232,0.65)',
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '15px',
          }}
        >
          He heard every word.
        </p>
        <div className="flex justify-center mb-4">
          <ShareToFeedButton
            type="spiritual_insight"
            title="Completed guided ACTS prayer 🙏"
            content={`Just worked through a full ACTS prayer — Adoration, Confession, Thanksgiving, Supplication. Taking every concern to God. 'Do not be anxious about anything, but in every situation, present your requests to God.' — Phil 4:6`}
            source="Gideon"
            label="Share to Community"
            color="#fbbf24"
            user={user}
          />
        </div>
        <button
          onClick={() => { setStep(0); setAnswers({ adoration: '', confession: '', thanksgiving: '', supplication: '' }); setDone(false); }}
          className="text-xs font-semibold transition-colors"
          style={{ color: 'rgba(251,191,36,0.65)' }}
        >
          Pray again →
        </button>
      </div>
    </motion.div>
  );

  return (
    <div
      className="rounded-[28px] overflow-hidden relative"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(251,191,36,0.15)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="px-5 pt-5 pb-0 relative">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgba(245,241,232,0.45)' }}>
              Guided Prayer
            </p>
            <p
              className="mt-1"
              style={{
                fontFamily: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
                color: '#f5f1e8',
                fontSize: '17px',
                fontWeight: 500,
              }}
            >
              ACTS Model
            </p>
          </div>
          <div className="flex gap-2">
            {ACTS_STEPS.map((s, i) => (
              <div key={s.key} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-7 h-1 rounded-full transition-all duration-500"
                  style={{ background: i <= step ? s.color : 'rgba(245,241,232,0.10)' }}
                />
                <span className="text-[8px] font-semibold uppercase" style={{ color: 'rgba(245,241,232,0.40)' }}>
                  {s.label.slice(0, 1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xl">{current.emoji}</span>
              <span className="text-sm font-semibold" style={{ color: current.color }}>{current.label}</span>
            </div>
            <p
              className="text-[13px] leading-relaxed mb-4"
              style={{
                color: 'rgba(245,241,232,0.65)',
                fontFamily: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
              }}
            >
              {current.prompt}
            </p>
            <textarea
              value={answers[current.key]}
              onChange={e => setAnswers(a => ({ ...a, [current.key]: e.target.value }))}
              placeholder={current.placeholder}
              maxLength={1000}
              rows={4}
              autoFocus
              className="w-full rounded-2xl px-4 py-3.5 text-sm leading-relaxed resize-none outline-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${current.color}30`,
                color: '#f5f1e8',
                caretColor: current.color,
                fontFamily: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
                fontSize: '15px',
                lineHeight: '1.7',
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 px-5 py-4">
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: 'rgba(245,241,232,0.60)',
            }}
          >
            ← Back
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={() => answers[current.key].trim() && setStep(s => s + 1)}
            disabled={!answers[current.key].trim()}
            className="flex-1 py-2.5 rounded-2xl text-xs font-semibold transition-all disabled:opacity-30 active:scale-[0.98]"
            style={
              answers[current.key].trim()
                ? {
                    background: `linear-gradient(135deg, ${current.color}, ${current.color}cc)`,
                    color: '#0f1729',
                    boxShadow: `0 4px 16px -4px ${current.color}66`,
                  }
                : {
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(245,241,232,0.30)',
                  }
            }
          >
            Next: {ACTS_STEPS[step + 1].label} →
          </button>
        ) : (
          <button
            onClick={finish}
            disabled={!answers.supplication.trim() || saving}
            className="flex-1 py-2.5 rounded-2xl text-xs font-semibold transition-all disabled:opacity-30 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))',
              color: '#0f1729',
              boxShadow: '0 4px 16px -4px rgba(251,191,36,0.4)',
            }}
          >
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
    <div
      className="rounded-[28px] overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(251,191,36,0.12)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <Lock className="w-3.5 h-3.5" style={{ color: 'rgba(251,191,36,0.6)' }} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgba(245,241,232,0.45)' }}>
              My Prayers
            </p>
            <p
              className="mt-0.5 text-sm"
              style={{
                fontFamily: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
                color: '#f5f1e8',
                fontWeight: 500,
                fontSize: '15px',
              }}
            >
              Private — just you and God
            </p>
          </div>
        </div>
        <button
          onClick={() => setAdding(a => !a)}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={
            adding
              ? { background: 'rgba(251,191,36,0.18)', border: '1px solid rgba(251,191,36,0.35)' }
              : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }
          }
          aria-label={adding ? 'Cancel' : 'Add prayer'}
        >
          <Plus
            className="w-4 h-4 transition-transform"
            style={{
              color: adding ? '#fcd34d' : '#f5f1e8',
              transform: adding ? 'rotate(45deg)' : 'rotate(0)',
            }}
          />
        </button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden px-5 pb-3"
          >
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Bring your request to God…"
              maxLength={500}
              rows={3}
              autoFocus
              className="w-full rounded-2xl px-4 py-3 text-sm resize-none outline-none mb-3"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(251,191,36,0.20)',
                color: '#f5f1e8',
                caretColor: '#fbbf24',
                fontFamily: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
                fontSize: '15px',
                lineHeight: '1.7',
              }}
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) add(); }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setAdding(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: 'rgba(245,241,232,0.55)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={add}
                disabled={!text.trim()}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold disabled:opacity-30 transition-all active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))',
                  color: '#0f1729',
                }}
              >
                Add prayer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-5 pb-5 space-y-2">
        {prayers.length === 0 && !adding && (
          <div className="text-center py-6">
            <p
              className="text-sm italic mb-3"
              style={{
                color: 'rgba(245,241,232,0.55)',
                fontFamily: '"Cormorant Garamond", Georgia, serif',
              }}
            >
              Your private prayers live here — only you can see them
            </p>
            <button
              onClick={() => setAdding(true)}
              className="text-xs font-semibold transition-colors"
              style={{ color: 'rgba(251,191,36,0.75)' }}
            >
              + Add your first prayer
            </button>
          </div>
        )}
        {prayers.map(p => (
          <div
            key={p.id}
            className="rounded-2xl p-3.5 flex items-start gap-3 group"
            style={
              p.answered
                ? {
                    background: 'rgba(110,231,183,0.06)',
                    border: '1px solid rgba(110,231,183,0.20)',
                  }
                : {
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }
            }
          >
            <button onClick={() => toggleAnswered(p.id)} className="mt-0.5 flex-shrink-0" aria-label="Toggle answered">
              {p.answered ? (
                <CheckCircle2 className="w-4 h-4" style={{ color: '#6ee7b7' }} />
              ) : (
                <div
                  className="w-4 h-4 rounded-full transition-colors"
                  style={{ border: '1px solid rgba(245,241,232,0.30)' }}
                />
              )}
            </button>
            <p
              className="text-sm flex-1 leading-relaxed"
              style={{
                color: p.answered ? 'rgba(245,241,232,0.50)' : 'rgba(245,241,232,0.85)',
                textDecoration: p.answered ? 'line-through' : 'none',
                fontFamily: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
                fontSize: '15px',
                lineHeight: '1.7',
              }}
            >
              {p.text}
            </p>
            <button
              onClick={() => remove(p.id)}
              className="flex-shrink-0 transition-all opacity-0 group-hover:opacity-60 hover:!opacity-100"
              style={{ color: '#fca5a5' }}
              aria-label="Delete"
            >
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
    <div className="min-h-screen pb-28 relative" style={{ background: '#0f1729' }}>
      {/* Ambient sanctuary backdrop — drifting prayers + falling leaves */}
      <SanctuaryBackground />

      {/* All actual content sits above the ambient layer */}
      <div className="relative" style={{ zIndex: 1 }}>

        {/* ── Sticky sub-bar (page title is in Layout's UniversalHeader) ── */}
        <div
          className="sticky top-14 z-30 flex items-center justify-between px-5 py-2.5"
          style={{
            background: 'rgba(15,23,41,0.72)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(251,191,36,0.10)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-300 opacity-50 animate-ping" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-300" />
              </span>
              <span className="text-[11px] font-medium" style={{ color: 'rgba(245,241,232,0.55)' }}>
                {prayerRequests.length} requests
              </span>
            </div>
            {streak.streak > 0 && (
              <span
                className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  color: '#fcd34d',
                  background: 'rgba(251,191,36,0.10)',
                  border: '1px solid rgba(251,191,36,0.25)',
                }}
              >
                <Flame className="w-3 h-3" />{streak.streak}d
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 ${isRefreshing ? 'opacity-40' : ''}`}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
              aria-label="Refresh"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                style={{ color: 'rgba(251,191,36,0.75)' }}
              />
            </button>
            <button
              onClick={() => { if (requireAuth(user, 'share a prayer request')) setShowNewPrayer(true); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))',
                color: '#0f1729',
                boxShadow: '0 4px 16px -4px rgba(251,191,36,0.5)',
              }}
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
              Share Prayer
            </button>
          </div>
        </div>

        {/* ── Hero ── */}
        <div className="relative px-5 pt-10 pb-8">
          <div className="relative text-center">
            {/* Soft glowing orb evoking a candle / dawn */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <span
                className="absolute w-20 h-20 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)',
                  filter: 'blur(12px)',
                }}
              />
              <span
                className="relative w-14 h-14 rounded-full flex items-center justify-center text-3xl"
                style={{
                  background: 'radial-gradient(circle at 35% 25%, #fef3c7 0%, #fbbf24 45%, #d97706 100%)',
                  boxShadow: '0 0 40px rgba(251,191,36,0.5), inset 0 -2px 6px rgba(0,0,0,0.2)',
                }}
              >
                🕯️
              </span>
            </div>

            <h2
              className="text-[34px] mb-2"
              style={{
                fontFamily: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
                color: '#f5f1e8',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                lineHeight: 1.1,
              }}
            >
              Prayer Wall
            </h2>
            <p
              className="text-sm mb-6 italic"
              style={{
                color: 'rgba(245,241,232,0.65)',
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: '15px',
              }}
            >
              Lift each other up in prayer
            </p>

            {/* Stats — restrained, no heavy chips */}
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-2xl tabular-nums" style={{ color: '#fbbf24', fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 500 }}>
                  {prayerRequests.length}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] font-medium mt-0.5" style={{ color: 'rgba(245,241,232,0.40)' }}>
                  Requests
                </p>
              </div>
              <div className="w-px h-8" style={{ background: 'rgba(245,241,232,0.15)' }} />
              <div className="text-center">
                <p className="text-2xl tabular-nums" style={{ color: '#fbbf24', fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 500 }}>
                  {totalPraying.toLocaleString()}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] font-medium mt-0.5" style={{ color: 'rgba(245,241,232,0.40)' }}>
                  Prayers Lifted
                </p>
              </div>
              {streak.streak > 0 && (
                <>
                  <div className="w-px h-8" style={{ background: 'rgba(245,241,232,0.15)' }} />
                  <div className="text-center">
                    <p className="text-2xl tabular-nums" style={{ color: '#fbbf24', fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 500 }}>
                      {streak.streak}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-medium mt-0.5" style={{ color: 'rgba(245,241,232,0.40)' }}>
                      Day Streak
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 space-y-12">

          {/* ── Crisis Resources (collapsible) ── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <button
              onClick={() => setCrisisExpanded(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🆘</span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgba(245,241,232,0.55)' }}>
                  Crisis Resources
                </span>
              </div>
              <span className="text-xs" style={{ color: 'rgba(245,241,232,0.30)' }}>{crisisExpanded ? '▲' : '▼'}</span>
            </button>
            <AnimatePresence>
              {crisisExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2">
                    <a
                      href="tel:988"
                      className="flex items-center gap-3 p-3 rounded-xl min-h-[44px] transition-all"
                      style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.20)' }}
                    >
                      <span className="text-lg">📞</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: '#f5f1e8' }}>988 Suicide & Crisis Lifeline</p>
                        <p className="text-[11px]" style={{ color: 'rgba(245,241,232,0.55)' }}>Call or text 988 — free, confidential, 24/7</p>
                      </div>
                    </a>
                    <a
                      href="tel:18006624357"
                      className="flex items-center gap-3 p-3 rounded-xl min-h-[44px] transition-all"
                      style={{ background: 'rgba(147,197,253,0.08)', border: '1px solid rgba(147,197,253,0.20)' }}
                    >
                      <span className="text-lg">💙</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: '#f5f1e8' }}>SAMHSA National Helpline</p>
                        <p className="text-[11px]" style={{ color: 'rgba(245,241,232,0.55)' }}>1-800-662-4357 — free referrals & support, 24/7</p>
                      </div>
                    </a>
                    <a
                      href="sms:741741&body=HELLO"
                      className="flex items-center gap-3 p-3 rounded-xl min-h-[44px] transition-all"
                      style={{ background: 'rgba(110,231,183,0.08)', border: '1px solid rgba(110,231,183,0.20)' }}
                    >
                      <span className="text-lg">💬</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: '#f5f1e8' }}>Crisis Text Line</p>
                        <p className="text-[11px]" style={{ color: 'rgba(245,241,232,0.55)' }}>Text HELLO to 741741 — free, confidential, 24/7</p>
                      </div>
                    </a>
                    <p
                      className="text-[11px] leading-relaxed pt-2 italic"
                      style={{
                        color: 'rgba(245,241,232,0.55)',
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                      }}
                    >
                      You are never alone. God loves you and so does this community.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Spotlight ── */}
          {currentSpotlight && (
            <div>
              <SectionHeader label="Spotlight Prayer" emphasized />
              <SpotlightCard
                request={currentSpotlight}
                countdown={countdown}
                total={SPOTLIGHT_DURATION}
                hasPrayed={(currentSpotlight.prayed_by || []).includes(user?.email)}
                onPray={() => handlePray(currentSpotlight)}
                onNext={() => { setSpotlightIdx(i => (i + 1) % Math.max(spotlightRequests.length, 1)); setCountdown(SPOTLIGHT_DURATION); }}
                onClick={() => setSelectedRequest(currentSpotlight)}
              />
              <div className="flex justify-center gap-1.5 mt-4">
                {spotlightRequests.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setSpotlightIdx(i); setCountdown(SPOTLIGHT_DURATION); }}
                    aria-label={`Go to spotlight ${i + 1}`}
                  >
                    <div
                      className="rounded-full transition-all duration-500"
                      style={
                        i === spotlightIdx
                          ? { width: '20px', height: '6px', background: '#fbbf24', boxShadow: '0 0 8px rgba(251,191,36,0.6)' }
                          : { width: '6px', height: '6px', background: 'rgba(245,241,232,0.20)' }
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Scripture card ── */}
          <div
            className="rounded-[28px] p-7 relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(251,191,36,0.18)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <div
              className="absolute -top-2 left-4 leading-none select-none pointer-events-none"
              style={{
                fontSize: '120px',
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                color: 'rgba(251,191,36,0.15)',
              }}
            >
              "
            </div>
            <div className="relative">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: 'rgba(251,191,36,0.7)' }}>
                Before You Pray
              </p>
              <p
                className="leading-[1.75]"
                style={{
                  fontFamily: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
                  color: 'rgba(245,241,232,0.92)',
                  fontSize: '17px',
                  fontStyle: 'italic',
                  fontWeight: 400,
                }}
              >
                Don't be anxious for anything, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts.
              </p>
              <p
                className="text-xs mt-4 font-semibold"
                style={{ color: 'rgba(251,191,36,0.65)', letterSpacing: '0.05em' }}
              >
                — Philippians 4:6–7
              </p>
            </div>
          </div>

          {/* ── ACTS Guided Prayer ── */}
          <div>
            <SectionHeader label="Guided Prayer" />
            <ActsGuidedPrayer onComplete={handleActsComplete} user={user} />
          </div>

          {/* ── Private prayer list ── */}
          <div>
            <SectionHeader label="My Private Prayers" />
            <MyPrayers />
          </div>

          {/* ── Talk to Hannah ── */}
          <Link to={createPageUrl('ChatScreen?bot=Hannah')}>
            <div
              className="rounded-[28px] p-5 flex items-center gap-4 transition-all active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, rgba(147,197,253,0.10) 0%, rgba(147,197,253,0.04) 100%)',
                border: '1px solid rgba(147,197,253,0.22)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #93c5fd, #60a5fa)',
                  boxShadow: '0 4px 16px rgba(147,197,253,0.3)',
                }}
              >
                <Heart className="w-5 h-5" style={{ color: '#0f1729' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold mb-0.5"
                  style={{ color: '#f5f1e8', fontSize: '15px' }}
                >
                  Talk to Hannah
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'rgba(245,241,232,0.60)' }}
                >
                  Need to process something? She listens without judgment.
                </p>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(147,197,253,0.65)' }} />
            </div>
          </Link>

          {/* ── Prayer Wall ── */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <SectionHeader label="Prayer Wall" emphasized noBottomMargin />
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(245,241,232,0.45)',
                }}
              >
                {filtered.length} requests
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
              {CATEGORIES.map(cat => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition-all active:scale-95"
                    style={
                      isActive
                        ? {
                            background: 'rgba(251,191,36,0.15)',
                            border: '1px solid rgba(251,191,36,0.45)',
                            color: '#fcd34d',
                          }
                        : {
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'rgba(245,241,232,0.50)',
                          }
                    }
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {prayersLoading ? (
              <div className="flex flex-col items-center py-16 gap-4">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#fbbf24' }} />
                <p className="text-sm italic" style={{ color: 'rgba(245,241,232,0.55)', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                  Gathering prayers…
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4 opacity-50">🙏</div>
                <p className="text-sm italic mb-5" style={{ color: 'rgba(245,241,232,0.55)', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                  No prayer requests yet.
                </p>
                <button
                  onClick={() => setShowNewPrayer(true)}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, rgba(251,191,36,0.95), rgba(245,158,11,0.95))',
                    color: '#0f1729',
                    boxShadow: '0 8px 24px -8px rgba(251,191,36,0.4)',
                  }}
                >
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

// ─── Section header helper ───────────────────────────────────────────────────
// Tiny gold accent bar + uppercase label. Used throughout the sanctuary
// layout to introduce sections without shouting.
function SectionHeader({ label, emphasized = false, noBottomMargin = false }) {
  return (
    <div className={`flex items-center gap-2 ${noBottomMargin ? '' : 'mb-4'}`}>
      <div
        className="w-1 h-4 rounded-full"
        style={{
          background: emphasized ? '#fbbf24' : 'rgba(251,191,36,0.35)',
          boxShadow: emphasized ? '0 0 8px rgba(251,191,36,0.5)' : 'none',
        }}
      />
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.25em]"
        style={{ color: emphasized ? 'rgba(251,191,36,0.85)' : 'rgba(245,241,232,0.50)' }}
      >
        {label}
      </p>
    </div>
  );
}