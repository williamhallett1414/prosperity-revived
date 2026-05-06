/**
 * ShareToFeedButton
 * A lightweight, context-aware share button that pre-fills a bottom-sheet
 * and posts to base44.entities.CommunityShare.
 *
 * Props:
 *   type        — share_type: 'fitness_goal' | 'emotional_breakthrough' |
 *                 'spiritual_insight' | 'nutrition_milestone' | 'general_win' | 'habit_streak'
 *   title       — pre-filled title string
 *   content     — pre-filled body text
 *   source      — chatbot_source: 'Hannah'|'CoachDavid'|'ChefDaniel'|'Gideon'|'general'
 *   label       — button label (default 'Share to Community')
 *   variant     — 'pill' (default) | 'icon' | 'banner'
 *   color       — tailwind background color class or CSS hex for pill bg
 *   user        — base44 user object (for display name)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Share2, X, Send, Loader2, Lock, Users, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { getDisplayName } from '@/lib/userName';
const TYPE_META = {
  fitness_goal:           { label: '🏋️ Fitness Goal',          color: '#38BDF8' },
  emotional_breakthrough: { label: '💜 Emotional Breakthrough', color: '#A78BFA' },
  spiritual_insight:      { label: '📖 Spiritual Insight',      color: '#C9A227' },
  nutrition_milestone:    { label: '🥗 Nutrition Milestone',    color: '#22C55E' },
  general_win:            { label: '✨ General Win',             color: '#FD9C2D' },
  habit_streak:           { label: '✅ Habit Streak',           color: '#FD9C2D' },
  growth_win:             { label: '🧠 Growth Win',             color: '#AFC7E3' },
};

const VISIBILITY_OPTIONS = [
  { value: 'public',  icon: Globe,  label: 'Public',       sub: 'Everyone in the community' },
  { value: 'friends', icon: Users,  label: 'Friends only', sub: 'Just your connections'      },
  { value: 'private', icon: Lock,   label: 'Private',       sub: 'Only you can see this'     },
];

export default function ShareToFeedButton({
  type = 'general_win',
  title: defaultTitle = '',
  content: defaultContent = '',
  source = 'general',
  label = 'Share to Community',
  variant = 'pill',
  color,
  user,
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(defaultTitle);
  const [content, setContent] = useState(defaultContent);
  const [visibility, setVisibility] = useState('public');
  const [anonymous, setAnonymous] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync pre-fills when props change (e.g. after data loads)
  const openSheet = () => {
    setTitle(defaultTitle);
    setContent(defaultContent);
    setOpen(true);
  };

  const handleShare = async () => {
    if (!title.trim()) { toast.error('Add a title first'); return; }
    if (!content.trim()) { toast.error('Add a message first'); return; }
    setSaving(true);
    try {
      await base44.entities.CommunityShare.create({
        share_type: type,
        title: title.trim(),
        content: content.trim(),
        chatbot_source: source,
        is_anonymous: anonymous,
        visibility,
        user_display_name: anonymous ? null : (getDisplayName(user, '') || null),
        encouragement_count: 0,
      });
      toast.success('Shared to the community! 🎉');
      setOpen(false);
    } catch (e) {
      console.error(e);
      toast.error('Failed to share — try again');
    } finally {
      setSaving(false);
    }
  };

  const meta = TYPE_META[type] || TYPE_META.general_win;
  const accentColor = color || meta.color;

  // ── Trigger button ────────────────────────────────────────────────────────
  const trigger = variant === 'icon' ? (
    <button onClick={openSheet}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95"
      style={{ background: `${accentColor}20`, color: accentColor }}
      title={label}>
      <Share2 className="w-4 h-4" />
    </button>
  ) : variant === 'banner' ? (
    <button onClick={openSheet}
      className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-white text-sm font-bold shadow-sm dark:shadow-none active:scale-98 transition-transform"
      style={{ background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor})` }}>
      <Share2 className="w-4 h-4" /> {label}
    </button>
  ) : (
    // pill (default)
    <button onClick={openSheet}
      className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full border transition-all active:scale-95"
      style={{ borderColor: `${accentColor}40`, color: accentColor, background: `${accentColor}12` }}>
      <Share2 className="w-3.5 h-3.5" /> {label}
    </button>
  );

  // ── Bottom sheet ──────────────────────────────────────────────────────────
  return (
    <>
      {trigger}

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[200]"
              onClick={() => setOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[201] rounded-t-3xl overflow-hidden flex flex-col"
              style={{ background: '#FFFFFF', maxHeight: '92vh' }}
            >
              {/* Handle */}
              <div className="flex-shrink-0 flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>

              {/* Header */}
              <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: `${accentColor}20` }}>
                    <Share2 className="w-4 h-4" style={{ color: accentColor }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">Share to Community</p>
                    <p className="text-[10px] font-semibold" style={{ color: accentColor }}>{meta.label}</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                  <X className="w-4 h-4 text-[#0A1A2F]/50 dark:text-white/50" />
                </button>
              </div>

              {/* Scrollable form body */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">

                {/* Title */}
                <div>
                  <p className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-1.5">Title</p>
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g., Hit my 7-day streak! 🔥"
                    maxLength={80}
                    className="w-full rounded-xl border border-gray-200 dark:border-white/10 px-3.5 py-2.5 text-sm font-semibold text-[#0A1A2F] dark:text-white placeholder:text-[#0A1A2F]/30 dark:text-white/30 focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <p className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-1.5">Your message</p>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Share what you achieved and how it felt..."
                    rows={4}
                    maxLength={500}
                    className="w-full rounded-xl border border-gray-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-[#0A1A2F] dark:text-white placeholder:text-[#0A1A2F]/30 dark:text-white/30 focus:outline-none focus:border-[#C9A227] transition-colors resize-none"
                  />
                  <p className="text-right text-[10px] text-[#0A1A2F]/25 dark:text-white/25 mt-0.5">{content.length}/500</p>
                </div>

                {/* Visibility */}
                <div>
                  <p className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-2">Visibility</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {VISIBILITY_OPTIONS.map(({ value, icon: Icon, label: vLabel, sub }) => (
                      <button key={value} onClick={() => setVisibility(value)}
                        className={`flex flex-col items-center gap-1 rounded-xl py-2.5 px-2 border-2 transition-all ${
                          visibility === value
                            ? 'border-[#C9A227] bg-[#FAD98D]/15 dark:bg-[#FAD98D]/8'
                            : 'border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 dark:bg-white/5'
                        }`}>
                        <Icon className={`w-4 h-4 ${visibility === value ? 'text-[#C9A227]' : 'text-[#0A1A2F]/35 dark:text-white/35'}`} />
                        <p className={`text-[10px] font-bold leading-tight ${visibility === value ? 'text-[#C9A227]' : 'text-[#0A1A2F]/50 dark:text-white/50'}`}>{vLabel}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Anonymous toggle */}
                <button onClick={() => setAnonymous(v => !v)}
                  className="flex items-center gap-3 w-full">
                  <div className={`w-10 h-6 rounded-full transition-colors flex items-center ${anonymous ? 'bg-[#C9A227]' : 'bg-gray-200'}`}>
                    <motion.div animate={{ x: anonymous ? 18 : 2 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="w-5 h-5 bg-white dark:bg-white/5 rounded-full shadow-sm dark:shadow-none" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#0A1A2F] dark:text-white dark:text-white">Post anonymously</p>
                    <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40">Your name won't be shown</p>
                  </div>
                </button>
              </div>

              {/* Sticky submit footer — always visible above bottom nav */}
              <div className="flex-shrink-0 px-5 pt-3 pb-4 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#0A1A2F]" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
                <button onClick={handleShare} disabled={saving}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-white text-sm font-bold shadow-md dark:shadow-none active:scale-98 transition-all disabled:opacity-60"
                  style={{ background: `linear-gradient(135deg, ${accentColor}dd, ${accentColor})` }}>
                  {saving
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sharing...</>
                    : <><Send className="w-4 h-4" /> Share with Community</>
                  }
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
