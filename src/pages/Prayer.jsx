import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Send, X, ChevronRight, Loader2, MessageCircle,
  Plus, Shield, ArrowLeft
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import DailyGuidedPrayer from '@/components/prayer/DailyGuidedPrayer';
import CalmingScriptureMeditation from '@/components/prayer/CalmingScriptureMeditation';
import DailyPrayer from '@/components/selfcare/DailyPrayer';
import TakeTimeWithGod from '@/components/selfcare/TakeTimeWithGod';

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

function SpotlightCard({ request, countdown, total, onPray, onNext, onClick, prayedCount }) {
  const prayerCount = (request?.prayer_count || 0) + prayedCount;
  return (
    <div className="relative rounded-3xl overflow-hidden cursor-pointer"
      style={{ background: 'linear-gradient(135deg, #0f2027 0%, #1a3a4a 50%, #203a43 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)' }}
      onClick={onClick}
    >
      <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(201,162,39,0.3) 0%, transparent 70%)' }} />
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
            <button onClick={e => { e.stopPropagation(); onPray(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#c9a227]/20 border border-[#c9a227]/40 hover:bg-[#c9a227]/30 transition-all text-[#c9a227] text-xs font-bold">
              <Heart className="w-3.5 h-3.5" /> I Prayed
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

function PrayerRow({ request, index, onOpen, user }) {
  const catColor = CATEGORY_COLORS[request.category] || CATEGORY_COLORS.Other;
  const hasLiked = (request.liked_by || []).includes(user?.email);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
      onClick={() => onOpen(request)} className="group cursor-pointer"
      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '16px', backdropFilter: 'blur(10px)' }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
          style={{ background: 'linear-gradient(135deg, #1a3a4a, #2d5a70)' }}>
          {initials(request.user_name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-white text-sm">{request.user_name}</span>
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
            {hasLiked && <span className="text-[11px] text-rose-400 font-semibold">♥ You prayed</span>}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0 mt-1 group-hover:text-white/50 transition-colors" />
      </div>
    </motion.div>
  );
}

function PrayerDrawer({ request, user, onClose, onPray, onLike, onComment }) {
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const hasLiked = (request?.liked_by || []).includes(user?.email);
  const comments = request?.comments || [];
  const catColor = CATEGORY_COLORS[request?.category] || CATEGORY_COLORS.Other;

  const handleComment = async () => {
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    await onComment(commentText);
    setCommentText('');
    setSubmitting(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(5,15,25,0.95)', backdropFilter: 'blur(20px)' }}
    >
      <div className="flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-3">
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <div className="w-10 h-1 rounded-full bg-white/20" />
        <div className="w-9" />
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #1a3a4a, #2d5a70)' }}>
            {initials(request?.user_name)}
          </div>
          <div>
            <p className="font-bold text-white">{request?.user_name}</p>
            <p className="text-xs text-white/40">{timeAgo(request?.created_date)}</p>
          </div>
          {request?.category && request.category !== 'All' && (
            <span className={`ml-auto text-[10px] px-2 py-1 rounded-full border font-bold uppercase tracking-wide ${catColor}`}>{request.category}</span>
          )}
        </div>
        <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, rgba(201,162,39,0.08), rgba(201,162,39,0.03))', border: '1px solid rgba(201,162,39,0.2)' }}>
          <p className="text-white leading-relaxed text-[15px]" style={{ fontFamily: 'Georgia, serif' }}>{request?.prayer_text}</p>
        </div>
        <div className="flex gap-3 mb-7">
          <button onClick={onPray} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #c9a227, #92701a)' }}>
            🙏 I Prayed ({request?.prayer_count || 0})
          </button>
          <button onClick={onLike}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border font-bold text-sm transition-all ${hasLiked ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'bg-white/5 border-white/10 text-white/60'}`}>
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-400' : ''}`} />
            {request?.likes || 0}
          </button>
        </div>
        <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-4">{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</p>
        {comments.length === 0 && (
          <div className="text-center py-6">
            <p className="text-white/30 text-sm">Be the first to leave a word of encouragement</p>
          </div>
        )}
        <div className="space-y-3 mb-6">
          {[...comments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(comment => (
            <div key={comment.comment_id} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-white">{comment.user_name}</span>
                <span className="text-[10px] text-white/30">{timeAgo(comment.timestamp)}</span>
              </div>
              <p className="text-sm text-white/65 leading-relaxed">{comment.comment_text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 px-5 py-4 border-t border-white/8" style={{ background: 'rgba(10,20,30,0.98)', backdropFilter: 'blur(20px)' }}>
        <div className="flex gap-2">
          <Input value={commentText} onChange={e => setCommentText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleComment()}
            placeholder="Share a word of encouragement…"
            className="flex-1 bg-white/8 border-white/12 text-white placeholder:text-white/30 rounded-xl text-sm" />
          <button onClick={handleComment} disabled={!commentText.trim() || submitting}
            className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #c9a227, #92701a)' }}>
            {submitting ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function NewPrayerModal({ user, onClose, onSubmit }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Other');
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
          className="bg-white/6 border-white/12 text-white placeholder:text-white/30 rounded-2xl min-h-[120px] mb-4 resize-none text-sm"
          style={{ fontFamily: 'Georgia, serif', lineHeight: '1.7' }} />
        <button onClick={() => setAnonymous(p => !p)}
          className={`flex items-center gap-2 text-sm mb-5 transition-colors ${anonymous ? 'text-[#c9a227]' : 'text-white/40'}`}>
          <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${anonymous ? 'bg-[#c9a227] border-[#c9a227]' : 'border-white/25'}`}>
            {anonymous && <Shield className="w-2.5 h-2.5 text-white" />}
          </div>
          Post anonymously
        </button>
        <button onClick={handleSubmit} disabled={!text.trim() || submitting}
          className="w-full py-4 rounded-2xl font-bold text-white text-sm disabled:opacity-40 transition-all flex items-center justify-center gap-2"
          style={{ background: submitting ? '#555' : 'linear-gradient(135deg, #c9a227, #92701a)' }}>
          {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <><Send className="w-4 h-4" /> Submit Prayer Request</>}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Prayer() {
  const [user, setUser] = useState(null);
  const [spotlightIdx, setSpotlightIdx] = useState(0);
  const [countdown, setCountdown] = useState(SPOTLIGHT_DURATION);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showNewPrayer, setShowNewPrayer] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [prayedCounts, setPrayedCounts] = useState({});
  const queryClient = useQueryClient();

  useEffect(() => { base44.auth.me().then(setUser); }, []);

  const { data: prayerRequests = [] } = useQuery({
    queryKey: ['prayerRequests'],
    queryFn: () => base44.entities.PrayerRequest.list('-created_date', 100),
    refetchInterval: 30_000,
  });

  const filtered = activeCategory === 'All' ? prayerRequests : prayerRequests.filter(r => r.category === activeCategory);
  const spotlightRequests = prayerRequests.slice(0, 10);

  useEffect(() => {
    if (spotlightRequests.length === 0) return;
    const tick = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setSpotlightIdx(i => (i + 1) % spotlightRequests.length);
          return SPOTLIGHT_DURATION;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [spotlightRequests.length]);

  const currentSpotlight = spotlightRequests[spotlightIdx] || null;

  const updatePrayerCount = useMutation({
    mutationFn: async (request) => base44.entities.PrayerRequest.update(request.id, { prayer_count: (request.prayer_count || 0) + 1 }),
    onSuccess: () => queryClient.invalidateQueries(['prayerRequests']),
  });

  const toggleLike = useMutation({
    mutationFn: async (request) => {
      const likedBy = request.liked_by || [];
      const hasLiked = likedBy.includes(user?.email);
      const updatedLikedBy = hasLiked ? likedBy.filter(e => e !== user?.email) : [...likedBy, user?.email];
      return base44.entities.PrayerRequest.update(request.id, { liked_by: updatedLikedBy, likes: updatedLikedBy.length });
    },
    onSuccess: () => queryClient.invalidateQueries(['prayerRequests']),
  });

  const addComment = useMutation({
    mutationFn: async ({ requestId, commentText, existingComments }) => {
      const newComment = { comment_id: Date.now().toString(), user_email: user?.email, user_name: user?.full_name || 'Anonymous', comment_text: commentText, timestamp: new Date().toISOString() };
      return base44.entities.PrayerRequest.update(requestId, { comments: [...existingComments, newComment] });
    },
    onSuccess: () => { queryClient.invalidateQueries(['prayerRequests']); toast.success('Encouragement sent 🙏'); },
  });

  const createRequest = useMutation({
    mutationFn: async ({ text, category, anonymous }) => base44.entities.PrayerRequest.create({
      user_name: anonymous ? 'Anonymous' : user?.full_name || 'Anonymous',
      prayer_text: text, category, is_anonymous: anonymous, prayer_count: 0, likes: 0, liked_by: [], comments: [],
    }),
    onSuccess: () => { queryClient.invalidateQueries(['prayerRequests']); toast.success('Your prayer has been shared 🙏'); },
  });

  const handlePray = useCallback((request) => {
    setPrayedCounts(prev => ({ ...prev, [request.id]: (prev[request.id] || 0) + 1 }));
    updatePrayerCount.mutate(request);
    toast.success('🙏 Prayer recorded', { duration: 1500 });
  }, []);

  const freshSelected = selectedRequest ? prayerRequests.find(r => r.id === selectedRequest.id) || selectedRequest : null;
  const totalPraying = prayerRequests.reduce((sum, r) => sum + (r.prayer_count || 0), 0);

  return (
    <div className="min-h-screen pb-28" style={{ background: 'linear-gradient(180deg, #050f18 0%, #0a1a2f 40%, #0d1f35 100%)' }}>

      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-5 py-4"
        style={{ background: 'rgba(5,15,24,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Prayer Wall</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[11px] text-white/40 font-medium">{prayerRequests.length} requests · {totalPraying.toLocaleString()} prayers offered</span>
          </div>
        </div>
        <button onClick={() => setShowNewPrayer(true)}
          className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #c9a227, #92701a)' }}>
          <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
        </button>
      </div>

      <div className="px-4 pt-5 space-y-5">

        {/* Spotlight */}
        {currentSpotlight && (
          <div>
            <SpotlightCard
              request={currentSpotlight}
              countdown={countdown}
              total={SPOTLIGHT_DURATION}
              prayedCount={prayedCounts[currentSpotlight.id] || 0}
              onPray={() => handlePray(currentSpotlight)}
              onNext={() => { setSpotlightIdx(i => (i + 1) % spotlightRequests.length); setCountdown(SPOTLIGHT_DURATION); }}
              onClick={() => setSelectedRequest(currentSpotlight)}
            />
            <div className="flex justify-center gap-1.5 mt-3">
              {spotlightRequests.slice(0, 8).map((_, i) => (
                <button key={i} onClick={() => { setSpotlightIdx(i); setCountdown(SPOTLIGHT_DURATION); }}>
                  <div className={`rounded-full transition-all duration-300 ${i === spotlightIdx ? 'w-5 h-1.5 bg-[#c9a227]' : 'w-1.5 h-1.5 bg-white/20'}`} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Devotional tools */}
        <div className="space-y-3">
          <DailyGuidedPrayer />
          <CalmingScriptureMeditation />
          <DailyPrayer />
          <TakeTimeWithGod />
        </div>

        {/* Prayer Wall list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Prayer Requests</p>
            <span className="text-[11px] text-white/30 font-medium">{filtered.length} waiting</span>
          </div>

          {/* Category filters */}
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

      {/* Drawer / Modal */}
      <AnimatePresence>
        {selectedRequest && freshSelected && (
          <PrayerDrawer
            request={freshSelected} user={user}
            onClose={() => setSelectedRequest(null)}
            onPray={() => handlePray(freshSelected)}
            onLike={() => toggleLike.mutate(freshSelected)}
            onComment={text => addComment.mutate({ requestId: freshSelected.id, commentText: text, existingComments: freshSelected.comments || [] })}
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
