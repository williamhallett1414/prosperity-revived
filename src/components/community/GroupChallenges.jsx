import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import ShareToFeedButton from '@/components/community/ShareToFeedButton';
import {
  CheckCircle2, Users, Calendar, Flame, Trophy, X,
  ChevronRight, ChevronDown, ChevronUp, Loader2, Plus,
  Award, Sparkles
} from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { SEED_CHALLENGES } from '@/components/challenges/ChallengeSeed';
import { getDisplayName, getDisplayNameFromString } from '@/lib/userName';
// ─── Type config (gradient is the fallback when API strips custom fields) ─────
const TYPE_CONFIG = {
  prayer:       { label: 'Prayer',      emoji: '🙏', gradient: 'from-violet-600 to-purple-400',  bg: 'bg-violet-50 dark:bg-violet-900/20 text-violet-700'  },
  reading:      { label: 'Reading',     emoji: '📖', gradient: 'from-amber-500 to-yellow-300',   bg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700'    },
  workouts:     { label: 'Fitness',     emoji: '💪', gradient: 'from-blue-700 to-sky-500',       bg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700'      },
  meditation:   { label: 'Mindfulness', emoji: '📵', gradient: 'from-slate-700 to-slate-500',    bg: 'bg-teal-50 dark:bg-teal-900/20 text-teal-700'      },
  water_intake: { label: 'Nutrition',   emoji: '🥗', gradient: 'from-lime-600 to-green-300',     bg: 'bg-green-50 dark:bg-green-900/20 text-green-700'    },
  custom:       { label: 'Service',     emoji: '🤝', gradient: 'from-emerald-600 to-green-400',  bg: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700'      },
};

const SEED_DONE_KEY = 'challenges_seeded_v1';

// ─── Template picker (Create Challenge) ───────────────────────────────────────
const TEMPLATES = [
  { title: '21-Day Prayer Streak',       emoji: '🙏', type: 'prayer',       duration: 21, description: '5 minutes of intentional prayer every day.',         gradient: 'from-violet-600 to-purple-400' },
  { title: '30-Day Gratitude Journal',   emoji: '📝', type: 'reading',      duration: 30, description: 'Write 3 genuine things you\'re thankful for daily.',  gradient: 'from-amber-500 to-yellow-300' },
  { title: '14-Day Morning Devotional',  emoji: '🌅', type: 'prayer',       duration: 14, description: '10 minutes of Scripture before touching your phone.', gradient: 'from-orange-500 to-amber-300' },
  { title: '7-Day Digital Detox',        emoji: '📵', type: 'meditation',   duration: 7,  description: 'Social media under 15 min/day for one week.',          gradient: 'from-slate-700 to-slate-500'  },
  { title: '21-Day Acts of Service',     emoji: '🤝', type: 'custom',       duration: 21, description: 'One intentional act of kindness each day.',            gradient: 'from-emerald-600 to-green-400'},
  { title: '30-Day Fitness Commitment',  emoji: '💪', type: 'workouts',     duration: 30, description: 'Move your body for 20+ minutes every single day.',     gradient: 'from-blue-700 to-sky-500'     },
  { title: '10-Day Clean Eating Reset',  emoji: '🥗', type: 'water_intake', duration: 10, description: 'Whole foods, no processed sugar, intentional hydration.',gradient: 'from-lime-600 to-green-300'  },
  { title: 'Custom Challenge',           emoji: '✨', type: 'custom',       duration: 14, description: 'Design your own challenge for the community.',          gradient: 'from-[#c9a227] to-[#FAD98D]'  },
];

function CreateChallengeModal({ user, onClose, onCreated }) {
  const [step, setStep]             = useState('templates'); // templates | custom
  const [selected, setSelected]     = useState(null);
  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration]     = useState(21);
  const [creating, setCreating]     = useState(false);

  const pickTemplate = (tpl) => {
    setSelected(tpl);
    setTitle(tpl.title);
    setDescription(tpl.description);
    setDuration(tpl.duration);
    setStep('custom');
  };

  const handleCreate = async () => {
    if (!title.trim()) return;
    setCreating(true);
    try {
      const today = new Date();
      const end   = new Date(today); end.setDate(end.getDate() + duration);
      const fmt   = (d) => d.toISOString().split('T')[0];
      await base44.entities.GroupChallenge.create({
        title: title.trim(),
        description: description.trim(),
        challenge_type: selected?.type || 'custom',
        type: selected?.type || 'custom',
        emoji: selected?.emoji || '✨',
        gradient: selected?.gradient || 'from-[#c9a227] to-[#FAD98D]',
        duration_days: duration,
        goal_value: 1,
        goal_unit: 'per day',
        is_active: true,
        status: 'active',
        participant_count: 0,
        reward_points: duration * 10,
        start_date: fmt(today),
        end_date: fmt(end),
        chatbot_facilitator: 'Gideon',
        created_by_name: getDisplayName(user, 'Community Member'),
      });
      toast.success('Challenge created! 🎉');
      onCreated();
      onClose();
    } catch {
      toast.error('Failed to create — try again');
    }
    setCreating(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="bg-white dark:bg-white/5 w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl max-h-[90dvh] flex flex-col overflow-hidden shadow-2xl">

        <div className="bg-gradient-to-r from-[#0A1A2F] to-[#0A1A2F] text-white px-5 py-4 flex items-center gap-3 flex-shrink-0">
          {step === 'custom' && (
            <button onClick={() => setStep('templates')}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0">
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
          )}
          <div className="flex items-center gap-2 flex-1">
            <Trophy className="w-5 h-5 text-[#FAD98D]" />
            <h2 className="font-bold text-base">{step === 'templates' ? 'Start a Challenge' : 'Customise'}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {step === 'templates' ? (
            <>
              <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45 pb-1">Choose a template or build your own</p>
              {TEMPLATES.map((tpl) => (
                <button key={tpl.title} onClick={() => pickTemplate(tpl)}
                  className="w-full flex items-center gap-3 bg-[#F2F6FA] dark:bg-[#0A1A2F] hover:bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl p-3.5 transition-colors border border-[#F2F6FA] hover:border-[#FAD98D]/40 dark:border-[#FAD98D]/15 dark:border-[#FAD98D]/8 text-left">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tpl.gradient} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-lg">{tpl.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#0A1A2F] dark:text-white leading-snug">{tpl.title}</p>
                    <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45 truncate">{tpl.description}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#0A1A2F]/30 dark:text-white/30 flex-shrink-0">{tpl.duration}d</span>
                  <ChevronRight className="w-4 h-4 text-[#0A1A2F]/25 dark:text-white/25 flex-shrink-0" />
                </button>
              ))}
            </>
          ) : (
            <>
              {selected && (
                <div className={`bg-gradient-to-r ${selected.gradient} rounded-xl p-4 flex items-center gap-3 text-white mb-2`}>
                  <span className="text-3xl">{selected.emoji}</span>
                  <p className="font-bold text-sm">{selected.title}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-1.5">Title</p>
                <input value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#F2F6FA] bg-[#F2F6FA] dark:bg-[#0A1A2F] text-sm font-semibold text-[#0A1A2F] dark:text-white focus:outline-none focus:border-[#FAD98D]/60"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-1.5">Description</p>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#F2F6FA] bg-[#F2F6FA] dark:bg-[#0A1A2F] text-sm text-[#0A1A2F] dark:text-white focus:outline-none focus:border-[#FAD98D]/60 resize-none leading-relaxed"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-2">Duration</p>
                <div className="flex gap-2">
                  {[7, 14, 21, 30, 90].map(d => (
                    <button key={d} onClick={() => setDuration(d)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                        duration === d
                          ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]'
                          : 'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border-[#F2F6FA] hover:border-[#FAD98D]/40 dark:border-[#FAD98D]/15 dark:border-[#FAD98D]/8'
                      }`}>{d}d</button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {step === 'custom' && (
          <div className="border-t border-[#F2F6FA] px-5 py-4 flex-shrink-0">
            <button onClick={handleCreate} disabled={!title.trim() || creating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white font-bold text-sm disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />}
              {creating ? 'Creating…' : `Launch ${duration}-Day Challenge`}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Participant progress strip ───────────────────────────────────────────────
function ParticipantStrip({ participations }) {
  if (!participations?.length) return null;
  const today = new Date().toISOString().split('T')[0];
  const checkedIn = participations.filter(p => p.last_check_in_date === today).length;

  return (
    <div className="mt-3 pt-3 border-t border-[#F2F6FA]">
      <p className="text-[10px] font-bold text-[#0A1A2F]/30 dark:text-white/30 uppercase tracking-widest mb-1.5">
        {checkedIn}/{participations.length} checked in today
      </p>
      <div className="flex items-center gap-1 flex-wrap">
        {participations.slice(0, 14).map((p, i) => {
          const done     = p.last_check_in_date === today;
          const cleanedName = getDisplayNameFromString(p.user_name, '');
          // initials: prefer cleaned name first letter; fall back to email; else '?'
          const initials = cleanedName
            ? cleanedName.charAt(0).toUpperCase()
            : (p.user_email ? p.user_email.charAt(0).toUpperCase() : '?');
          return (
            <div key={i} title={cleanedName || 'Member'}
              className={`w-6 h-6 rounded-full text-[9px] font-bold flex items-center justify-center border-2 transition-all ${
                done ? 'bg-emerald-50 dark:bg-emerald-900/200 text-white border-emerald-300' : 'bg-[#F2F6FA] dark:bg-[#0A1A2F] text-[#0A1A2F]/30 dark:text-white/30 border-white'
              }`}>{initials}</div>
          );
        })}
        {participations.length > 14 && (
          <span className="text-[10px] text-[#0A1A2F]/25 dark:text-white/25 ml-0.5">+{participations.length - 14}</span>
        )}
      </div>
    </div>
  );
}

// ─── Daily check-in panel ─────────────────────────────────────────────────────
function CheckInPanel({ challenge, participation, onCheckedIn, onCompleted }) {
  const [reflection, setReflection] = useState('');
  const [submitting, setSubmitting]  = useState(false);
  const queryClient                  = useQueryClient();

  const today        = new Date().toISOString().split('T')[0];
  const completedDays = participation?.completed_days || [];
  const alreadyToday  = participation?.last_check_in_date === today;
  const currentDay    = completedDays.length + 1;
  const prompt        = challenge.daily_prompts?.find(p => p.day === currentDay) || challenge.daily_prompts?.[0];

  const handleCheckIn = async () => {
    if (alreadyToday || submitting) return;
    setSubmitting(true);
    try {
      const newCompleted = [...completedDays, today];
      const yest = new Date(); yest.setDate(yest.getDate() - 1);
      const yStr = yest.toISOString().split('T')[0];
      let streak = participation?.current_streak || 0;
      if (participation?.last_check_in_date === yStr) streak++;
      else streak = 1;

      const entries = reflection.trim()
        ? [...(participation?.reflection_entries || []), { day: currentDay, reflection: reflection.trim(), date: new Date().toISOString() }]
        : participation?.reflection_entries || [];

      await base44.entities.ChallengeParticipation.update(participation.id, {
        completed_days: newCompleted,
        current_day: currentDay + 1,
        last_check_in_date: today,
        current_streak: streak,
        longest_streak: Math.max(participation?.longest_streak || 0, streak),
        reflection_entries: entries,
      });
      queryClient.invalidateQueries({ queryKey: ['myParticipations'] });
      queryClient.invalidateQueries({ queryKey: ['allParticipations'] });
      const justFinished = newCompleted.length >= (challenge?.duration_days || 999);
      if (justFinished) {
        onCompleted?.({ streak });
      } else {
        toast.success(`Day ${currentDay} ✓  ${streak}🔥`);
      }
      setReflection('');
      onCheckedIn?.();
    } catch {
      toast.error('Check-in failed — try again');
    }
    setSubmitting(false);
  };

  if (alreadyToday) {
    return (
      <div className="mt-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 rounded-xl p-3 flex items-center gap-2.5">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        <div>
          <p className="text-xs font-bold text-emerald-700">Checked in today ✓</p>
          <p className="text-[10px] text-emerald-600">{participation?.current_streak || 1}-day streak 🔥</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
      className="mt-3 bg-white dark:bg-white/5 rounded-xl p-3.5 border border-[#FAD98D]/25 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 space-y-2.5">
      <div className="flex items-center gap-1.5">
        <Flame className="w-3.5 h-3.5 text-[#c9a227]" />
        <p className="text-xs font-bold text-[#0A1A2F] dark:text-white dark:text-white">Day {currentDay} Check-in</p>
        {(participation?.current_streak || 0) > 1 && (
          <span className="ml-auto text-[10px] font-bold text-orange-500">{participation.current_streak}🔥 streak</span>
        )}
      </div>
      {prompt && <p className="text-xs text-[#0A1A2F]/55 dark:text-white/55 italic leading-relaxed">"{prompt.prompt}"</p>}
      <textarea value={reflection} onChange={e => setReflection(e.target.value)} rows={2}
        placeholder="Share a reflection with your group (optional)…"
        className="w-full resize-none text-xs px-3 py-2 rounded-lg border border-[#F2F6FA] bg-white dark:bg-white/5 text-[#0A1A2F] dark:text-white placeholder-[#0A1A2F]/25 focus:outline-none focus:border-[#FAD98D]/60 leading-relaxed"
      />
      <button onClick={handleCheckIn} disabled={submitting}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white font-bold text-xs hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
        {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
        {submitting ? 'Logging…' : `Check In — Day ${currentDay}`}
      </button>
    </motion.div>
  );
}

// ─── Challenge card ───────────────────────────────────────────────────────────
function ChallengeCard({ challenge, myParticipation, allParticipations, user, index, onJoin, joining }) {
  const [expanded, setExpanded] = useState(false);
  const [celebrating, setCelebrating] = useState(null); // { streak, daysTotal }
  const typeConf   = TYPE_CONFIG[challenge.challenge_type || challenge.type] || TYPE_CONFIG.custom;
  const gradient   = challenge.gradient || typeConf.gradient || 'from-[#c9a227] to-[#FAD98D]';
  const emoji      = challenge.emoji || typeConf.emoji;
  const isMember   = !!myParticipation;
  const completed  = myParticipation?.completed_days?.length || 0;
  const progress   = Math.min(100, Math.round((completed / (challenge.duration_days || 1)) * 100));
  const daysLeft   = challenge.end_date
    ? Math.max(0, differenceInDays(new Date(challenge.end_date), new Date()))
    : challenge.duration_days;
  const isFinished = isMember && completed >= (challenge.duration_days || 1);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
      className="bg-white dark:bg-white/5 rounded-2xl border border-[#FAD98D]/15 dark:border-[#FAD98D]/8 overflow-hidden">

      {/* Colour band */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-2">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
            <span className="text-xl">{emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#0A1A2F] dark:text-white text-sm leading-snug">{challenge.title}</h3>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${typeConf.bg}`}>{typeConf.label}</span>
              <span className="text-[10px] text-[#0A1A2F]/30 dark:text-white/30 flex items-center gap-0.5">
                <Calendar className="w-2.5 h-2.5" />{challenge.duration_days}d
              </span>
              <span className="text-[10px] text-[#0A1A2F]/30 dark:text-white/30 flex items-center gap-0.5">
                <Users className="w-2.5 h-2.5" />{challenge.participant_count || 0}
              </span>
              {daysLeft > 0 && daysLeft <= 5 && (
                <span className="text-[9px] font-bold text-red-400">{daysLeft}d left</span>
              )}
            </div>
          </div>
          {isFinished && <span className="text-lg flex-shrink-0">🏆</span>}
        </div>

        {/* Description */}
        <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50 leading-relaxed mb-3 line-clamp-2">{challenge.description}</p>

        {/* Progress bar */}
        {isMember && (
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-[10px] font-bold text-[#0A1A2F]/35 dark:text-white/35">Progress</span>
              <span className="text-[10px] font-bold text-[#c9a227]">Day {completed}/{challenge.duration_days}</span>
            </div>
            <div className="h-1.5 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                className={`h-full rounded-full bg-gradient-to-r ${gradient}`} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {!isMember ? (
            <button onClick={() => onJoin(challenge.id)} disabled={joining}
              className={`flex-1 py-2 rounded-xl bg-gradient-to-r ${gradient} text-white font-bold text-xs hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1.5`}>
              {joining ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
              Join Challenge
            </button>
          ) : (
            <button onClick={() => setExpanded(e => !e)}
              className="flex-1 py-2 rounded-xl bg-[#F2F6FA] dark:bg-[#0A1A2F] text-[#0A1A2F] dark:text-white font-bold text-xs hover:bg-white dark:bg-white/5 transition-colors flex items-center justify-center gap-1.5">
              <Flame className="w-3 h-3 text-orange-400" />
              {expanded ? 'Hide' : 'Log Today'}
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
          {/* Details expand for non-members too */}
          <button onClick={() => setExpanded(e => !e)}
            className="w-8 h-8 rounded-xl bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center hover:bg-white dark:bg-white/5 transition-colors">
            {expanded ? <ChevronUp className="w-3.5 h-3.5 text-[#0A1A2F]/40 dark:text-white/40" /> : <ChevronRight className="w-3.5 h-3.5 text-[#0A1A2F]/40 dark:text-white/40" />}
          </button>
        </div>

        {/* Expandable section */}
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              {isMember ? (
                <CheckInPanel
                  challenge={challenge}
                  participation={myParticipation}
                  onCheckedIn={() => setExpanded(false)}
                  onCompleted={(data) => { setExpanded(false); setCelebrating(data); }}
                />
              ) : (
                /* Non-member: show day 1 preview + join CTA */
                <div className="mt-3 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl p-3.5 border border-[#F2F6FA] space-y-2">
                  <p className="text-[10px] font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest">Day 1 Prompt</p>
                  <p className="text-xs text-[#0A1A2F]/60 dark:text-white/60 italic leading-relaxed">
                    "{challenge.daily_prompts?.[0]?.prompt || 'Show up. That\'s enough for today.'}"
                  </p>
                  <button onClick={() => onJoin(challenge.id)} disabled={joining}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white font-bold text-xs hover:opacity-90 transition-opacity">
                    Join & Start Today
                  </button>
                </div>
              )}
              <ParticipantStrip participations={allParticipations} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Completion celebration (full-screen overlay, auto-closes) ── */}
      <AnimatePresence>
        {celebrating && (
          <CelebrationModal
            challenge={challenge}
            streak={celebrating.streak}
            onClose={() => setCelebrating(null)}
            user={user}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Completion celebration modal ────────────────────────────────────────────
function CelebrationModal({ challenge, streak, onClose, user }) {
  // Auto-close after 7s
  React.useEffect(() => {
    const t = setTimeout(onClose, 7000);
    return () => clearTimeout(t);
  }, [onClose]);

  const typeConf = TYPE_CONFIG[challenge?.challenge_type || challenge?.type] || TYPE_CONFIG.custom;
  const gradient = challenge?.gradient || typeConf.gradient || 'from-[#c9a227] to-[#FAD98D]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.75, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className="w-full max-w-xs"
        onClick={e => e.stopPropagation()}
      >
        <div className={`bg-gradient-to-br ${gradient} rounded-3xl p-8 text-white text-center shadow-2xl`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.4, 1] }}
            transition={{ delay: 0.15, duration: 0.55, times: [0, 0.65, 1] }}
            className="text-6xl mb-3"
          >🏆</motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Challenge Complete</p>
            <h2 className="font-bold text-xl leading-snug mb-2">{challenge?.title}</h2>
            <p className="text-white/75 text-sm mb-5 leading-relaxed">
              You showed up every day. That's the whole thing.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="flex justify-center gap-3 mb-5"
          >
            {[
              { value: challenge?.duration_days, label: 'days' },
              { value: `${streak || challenge?.duration_days}🔥`, label: 'streak' },
              { value: challenge?.reward_points || 100, label: 'points' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/20 rounded-2xl px-4 py-3 min-w-[64px]">
                <p className="text-xl font-bold">{value}</p>
                <p className="text-white/60 text-[10px]">{label}</p>
              </div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
            className="flex justify-center mb-3"
            onClick={e => e.stopPropagation()}>
            <ShareToFeedButton
              type="general_win"
              title={`Completed the "${challenge?.title}" challenge! 🏆`}
              content={`Just finished all ${challenge?.duration_days} days of the "${challenge?.title}" challenge on Prosperity Revived! ${streak ? `Hit a ${streak}-day streak. ` : ''}Consistency is a spiritual discipline. 💪🙏`}
              source="Hannah"
              label="Share this win"
              color="#FAD98D"
              user={user}
            />
          </motion.div>
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-white/25 hover:bg-white/35 transition-colors font-bold text-sm"
          >
            Keep Going 💪
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Completion card ──────────────────────────────────────────────────────────
function CompletionCard({ challenge, participation }) {
  const typeConf = TYPE_CONFIG[challenge.challenge_type || challenge.type] || TYPE_CONFIG.custom;
  const gradient = challenge.gradient || typeConf.gradient || 'from-[#c9a227] to-[#FAD98D]';
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white text-center`}>
      <div className="text-4xl mb-2">🏆</div>
      <h3 className="font-bold mb-0.5">{challenge.title}</h3>
      <p className="text-white/70 text-xs mb-3">Completed in {participation?.completed_days?.length || challenge.duration_days} days</p>
      <div className="flex items-center justify-center gap-1.5 bg-white/20 rounded-xl py-2">
        <Award className="w-4 h-4" />
        <span className="text-xs font-bold">{challenge.reward_points || 0} pts earned</span>
        {(participation?.longest_streak || 0) > 0 && (
          <><span className="text-white/40">·</span><span className="text-xs font-bold">{participation.longest_streak}🔥 best streak</span></>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function GroupChallenges({ user }) {
  const [seeded,      setSeeded]      = useState(() => !!localStorage.getItem(SEED_DONE_KEY));
  const [seeding,     setSeeding]     = useState(false);

  // Auto-seed challenges on first visit
  useEffect(() => {
    if (seeded || seeding) return;
    const autoSeed = async () => {
      setSeeding(true);
      let n = 0;
      for (const c of SEED_CHALLENGES) {
        try { await base44.entities.GroupChallenge.create(c); n++; } catch {}
      }
      setSeeding(false);
      localStorage.setItem(SEED_DONE_KEY, '1');
      setSeeded(true);
      queryClient.invalidateQueries({ queryKey: ['activeChallenges'] });
      if (n > 0) toast.success(`${n} challenges loaded!`);
    };
    autoSeed();
  }, [seeded, seeding]);
  const [filter,      setFilter]      = useState('all');
  const [showCreate,  setShowCreate]  = useState(false);
  const queryClient                   = useQueryClient();

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['activeChallenges'],
    queryFn:  () => base44.entities.GroupChallenge.filter({ is_active: true }, '-created_date', 30),
  });

  const { data: myParticipations = [] } = useQuery({
    queryKey: ['myParticipations', user?.email],
    queryFn:  () => base44.entities.ChallengeParticipation.filter({ user_email: user.email }),
    enabled:  !!user?.email,
  });

  const { data: allParticipations = [] } = useQuery({
    queryKey: ['allParticipations'],
    queryFn:  () => base44.entities.ChallengeParticipation.list('-created_date'),
    enabled:  challenges.length > 0,
  });

  const joinMutation = useMutation({
    mutationFn: async (challengeId) => {
      const ch = challenges.find(c => c.id === challengeId);
      await base44.entities.ChallengeParticipation.create({
        challenge_id: challengeId,
        user_email:   user.email,
        user_name:    getDisplayName(user, user.email || 'Member'),
        current_day:  1, completed_days: [],
        current_streak: 0, longest_streak: 0, reflection_entries: [],
      });
      await base44.entities.GroupChallenge.update(challengeId, {
        participant_count: (ch?.participant_count || 0) + 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myParticipations'] });
      queryClient.invalidateQueries({ queryKey: ['activeChallenges'] });
      toast.success('Challenge joined! Check in daily to build your streak 🔥');
    },
    onError: () => toast.error('Failed to join'),
  });

  const getMyParticipation   = (id) => myParticipations.find(p => p.challenge_id === id);
  const getChallengeMembers  = (id) => allParticipations.filter(p => p.challenge_id === id);
  const isCompleted          = (id) => {
    const p = getMyParticipation(id);
    const c = challenges.find(x => x.id === id);
    return p && c && (p.completed_days?.length || 0) >= c.duration_days;
  };

  const myActive = challenges.filter(c => getMyParticipation(c.id) && !isCompleted(c.id));
  const myDone   = challenges.filter(c => isCompleted(c.id));
  const discover = challenges.filter(c => !getMyParticipation(c.id));

  const FILTERS = [
    { value: 'all',      label: 'All',       count: challenges.length },
    { value: 'mine',     label: 'Active',    count: myActive.length   },
    { value: 'discover', label: 'Discover',  count: discover.length   },
    { value: 'done',     label: 'Done',      count: myDone.length     },
  ];

  const list = filter === 'mine' ? myActive : filter === 'discover' ? discover : filter === 'done' ? myDone : challenges;

  return (
    <div className="space-y-4">

      {/* ── Featured Challenge Banner: 40 Days in the Wilderness ── */}
      <Link to={createPageUrl('SelfCareChallengesPage')}>
        <div style={{
          borderRadius: 20, padding: "20px 18px", cursor: "pointer",
          background: "linear-gradient(135deg,#451a03,#92400e,#78350f)",
          boxShadow: "0 12px 36px rgba(69,26,3,0.45)",
          position: "relative", overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)"
        }}>
          <div style={{position:"absolute",top:-24,right:-24,fontSize:100,opacity:0.06,pointerEvents:"none"}}>✝</div>
          <div style={{position:"absolute",bottom:-16,left:-16,fontSize:64,opacity:0.05,pointerEvents:"none"}}>⛰️</div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <div style={{background:"rgba(255,255,255,0.15)",borderRadius:99,padding:"3px 10px",fontSize:9,color:"rgba(255,255,255,0.9)",fontWeight:900,textTransform:"uppercase",letterSpacing:1.5}}>✦ Featured Challenge</div>
            <div style={{background:"rgba(255,255,255,0.1)",borderRadius:99,padding:"3px 10px",fontSize:9,color:"rgba(255,255,255,0.7)",fontWeight:800}}>40 Days</div>
          </div>
          <div style={{color:"white",fontFamily:"Lora,Georgia,serif",fontWeight:700,fontSize:18,marginBottom:4,lineHeight:1.25}}>40 Days in the Wilderness</div>
          <div style={{color:"rgba(255,255,255,0.55)",fontSize:11,fontStyle:"italic",marginBottom:10}}>Walk as Christ walked. Die to self. Rise in Him.</div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <span style={{color:"rgba(255,255,255,0.55)",fontSize:11}}>📖 Matthew 4:1-11</span>
            <span style={{color:"rgba(255,255,255,0.55)",fontSize:11}}>🔥 75 XP/day</span>
          </div>
          <div style={{background:"rgba(255,255,255,0.12)",borderRadius:12,padding:"9px 14px",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <span style={{color:"white",fontSize:12,fontWeight:700}}>Begin the Pilgrimage</span>
            <span style={{color:"rgba(255,255,255,0.5)",fontSize:13}}>→</span>
          </div>
        </div>
      </Link>

      {/* Top bar: create */}
      <div className="flex gap-2">
        {seeding && (
          <div className="flex-1 flex items-center gap-2 bg-[#0A1A2F] dark:bg-white/5 text-white rounded-2xl px-4 py-3">
            <Loader2 className="w-4 h-4 animate-spin text-[#FAD98D]" />
            <p className="text-xs font-bold">Loading challenges…</p>
          </div>
        )}
        <button onClick={() => setShowCreate(true)}
          className={`${seeded ? 'flex-1' : ''} flex items-center gap-2 bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white rounded-2xl px-4 py-3 font-bold hover:opacity-90 transition-opacity`}>
          <Plus className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs font-bold whitespace-nowrap">New Challenge</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 scrollbar-none pb-0.5">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
              filter === f.value ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]' : 'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border-[#F2F6FA] hover:border-[#FAD98D]/40 dark:border-[#FAD98D]/15 dark:border-[#FAD98D]/8'
            }`}>
            {f.label}
            {f.count > 0 && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${filter === f.value ? 'bg-white/20' : 'bg-[#F2F6FA] dark:bg-[#0A1A2F]'}`}>{f.count}</span>}
          </button>
        ))}
      </div>

      {/* Loading skeletons */}
      {isLoading && [1,2,3].map(i => <div key={i} className="bg-white dark:bg-white/5 rounded-2xl border border-[#FAD98D]/15 dark:border-[#FAD98D]/8 h-28 animate-pulse" />)}

      {/* Empty state */}
      {!isLoading && list.length === 0 && (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#FAD98D]/15 dark:border-[#FAD98D]/8 p-10 text-center">
          <div className="w-14 h-14 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-7 h-7 text-[#FAD98D]" />
          </div>
          <h3 className="font-bold text-[#0A1A2F] dark:text-white mb-1">
            {filter === 'mine' ? 'No active challenges' : filter === 'done' ? 'Nothing completed yet' : 'No challenges yet'}
          </h3>
          <p className="text-sm text-[#0A1A2F]/40 dark:text-white/40 mb-4">
            {filter === 'mine' ? 'Join a challenge to start building your streak.' : filter === 'done' ? 'Finish a challenge to see it here.' : 'Browse challenges below or create your own.'}
          </p>
          {filter !== 'done' && (
            <button onClick={() => setShowCreate(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white font-bold text-sm hover:opacity-90 transition-opacity">
              Create a Challenge
            </button>
          )}
        </div>
      )}

      {/* Completed cards */}
      {filter === 'done' && myDone.map(c => (
        <CompletionCard key={c.id} challenge={c} participation={getMyParticipation(c.id)} />
      ))}

      {/* Challenge cards */}
      {filter !== 'done' && (
        <div className="space-y-3">
          {list.map((c, i) => (
            <ChallengeCard key={c.id} challenge={c}
              myParticipation={getMyParticipation(c.id)}
              allParticipations={getChallengeMembers(c.id)}
              user={user} index={i}
              onJoin={id => joinMutation.mutate(id)}
              joining={joinMutation.isPending && joinMutation.variables === c.id}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateChallengeModal
            user={user}
            onClose={() => setShowCreate(false)}
            onCreated={() => queryClient.invalidateQueries({ queryKey: ['activeChallenges'] })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}