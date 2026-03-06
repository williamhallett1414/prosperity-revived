import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Circle, Users, Calendar, Flame, Trophy,
  ChevronRight, ChevronDown, ChevronUp, Loader2, Plus,
  Send, Sparkles, Award, Star
} from 'lucide-react';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { SEED_CHALLENGES, CHALLENGE_SEED_KEY } from '@/components/challenges/ChallengeSeed';

// ─── Challenge type config ────────────────────────────────────────────────────
const TYPE_CONFIG = {
  prayer:      { label: 'Prayer',      emoji: '🙏', bg: 'bg-violet-50 text-violet-700' },
  reading:     { label: 'Reading',     emoji: '📖', bg: 'bg-amber-50 text-amber-700'  },
  workouts:    { label: 'Fitness',     emoji: '💪', bg: 'bg-blue-50 text-blue-700'    },
  meditation:  { label: 'Mindfulness', emoji: '🧘', bg: 'bg-teal-50 text-teal-700'   },
  water_intake:{ label: 'Nutrition',   emoji: '🥗', bg: 'bg-green-50 text-green-700' },
  custom:      { label: 'Service',     emoji: '🤝', bg: 'bg-rose-50 text-rose-700'   },
};

// ─── Seed banner ──────────────────────────────────────────────────────────────
function SeedBanner({ onSeed, seeding }) {
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#0A1A2F] to-[#1a2a3f] rounded-2xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 bg-[#D9B878]/20 rounded-xl flex items-center justify-center flex-shrink-0">
        <Trophy className="w-5 h-5 text-[#D9B878]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white">Launch starter challenges</p>
        <p className="text-xs text-white/45">Add 8 faith & wellness challenges for the community</p>
      </div>
      <button onClick={onSeed} disabled={seeding}
        className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-[#D9B878] text-[#0A1A2F] text-xs font-bold disabled:opacity-50 hover:bg-[#c9a227] transition-colors flex items-center gap-1.5">
        {seeding ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Adding…</> : 'Add Challenges'}
      </button>
    </motion.div>
  );
}

// ─── Participant progress strip ────────────────────────────────────────────────
function ParticipantStrip({ participations }) {
  if (!participations?.length) return null;
  const today = new Date().toISOString().split('T')[0];
  const checkedInToday = participations.filter(p =>
    p.last_check_in_date === today || p.completed_days?.includes(today)
  );

  return (
    <div className="mt-3 pt-3 border-t border-[#F2F6FA]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold text-[#0A1A2F]/35 uppercase tracking-widest">
          {checkedInToday.length} of {participations.length} checked in today
        </span>
      </div>
      <div className="flex items-center gap-1 flex-wrap">
        {participations.slice(0, 12).map((p, i) => {
          const hasCheckedIn = p.last_check_in_date === today || p.completed_days?.includes(today);
          const initials = (p.user_name || p.user_email || '?')[0].toUpperCase();
          return (
            <div key={i} title={p.user_name || p.user_email || 'Member'}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-all ${
                hasCheckedIn
                  ? 'bg-emerald-500 text-white border-emerald-400'
                  : 'bg-[#F2F6FA] text-[#0A1A2F]/30 border-white'
              }`}>
              {initials}
            </div>
          );
        })}
        {participations.length > 12 && (
          <span className="text-[10px] text-[#0A1A2F]/30">+{participations.length - 12}</span>
        )}
      </div>
    </div>
  );
}

// ─── Check-in panel (expands inline) ─────────────────────────────────────────
function CheckInPanel({ challenge, participation, user, onCheckedIn }) {
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const today = new Date().toISOString().split('T')[0];
  const completedDays = participation?.completed_days || [];
  const alreadyToday = participation?.last_check_in_date === today;
  const currentDay = completedDays.length + 1;

  // Pick today's prompt if one exists
  const todayPrompt = challenge.daily_prompts?.find(p => p.day === currentDay)
    || challenge.daily_prompts?.[0];

  const handleCheckIn = async () => {
    if (alreadyToday || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const newCompleted = [...completedDays, today];
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split('T')[0];
      let streak = participation?.current_streak || 0;
      if (participation?.last_check_in_date === yStr) streak += 1;
      else streak = 1;

      const newReflections = reflection.trim()
        ? [...(participation?.reflection_entries || []), { day: currentDay, reflection: reflection.trim(), date: new Date().toISOString() }]
        : participation?.reflection_entries || [];

      await base44.entities.ChallengeParticipation.update(participation.id, {
        completed_days: newCompleted,
        current_day: currentDay + 1,
        last_check_in_date: today,
        current_streak: streak,
        longest_streak: Math.max(participation?.longest_streak || 0, streak),
        reflection_entries: newReflections,
      });
      queryClient.invalidateQueries({ queryKey: ['myParticipations'] });
      queryClient.invalidateQueries({ queryKey: ['challengeParticipations', challenge.id] });
      toast.success(`Day ${currentDay} complete! 🔥 ${streak}-day streak`);
      setReflection('');
      onCheckedIn?.();
    } catch (e) {
      toast.error('Check-in failed — try again');
    }
    setIsSubmitting(false);
  };

  if (alreadyToday) {
    return (
      <div className="mt-3 bg-emerald-50 rounded-xl p-3 flex items-center gap-2.5 border border-emerald-100">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        <div>
          <p className="text-xs font-bold text-emerald-700">Checked in today ✓</p>
          <p className="text-[10px] text-emerald-600">Day {currentDay - 1} complete • {participation?.current_streak || 1}-day streak 🔥</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className="mt-3 bg-[#FFF9ED] rounded-xl p-3.5 border border-[#D9B878]/25 space-y-3">
      <div className="flex items-center gap-2">
        <Flame className="w-4 h-4 text-[#c9a227]" />
        <p className="text-xs font-bold text-[#0A1A2F]">Day {currentDay} Check-in</p>
        {(participation?.current_streak || 0) > 0 && (
          <span className="ml-auto text-[10px] font-bold text-orange-500">{participation.current_streak}🔥</span>
        )}
      </div>

      {todayPrompt && (
        <p className="text-xs text-[#0A1A2F]/60 leading-relaxed italic">"{todayPrompt.prompt}"</p>
      )}

      <textarea
        value={reflection}
        onChange={e => setReflection(e.target.value)}
        placeholder="Optional: share a reflection with your group…"
        rows={2}
        className="w-full resize-none text-xs px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#0A1A2F] placeholder-[#0A1A2F]/25 focus:outline-none focus:border-[#D9B878]/60 transition-colors leading-relaxed"
      />

      <button onClick={handleCheckIn} disabled={isSubmitting}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D9B878] to-[#c9a227] text-[#0A1A2F] font-bold text-xs hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
        {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
        {isSubmitting ? 'Logging…' : `Check In — Day ${currentDay}`}
      </button>
    </motion.div>
  );
}

// ─── Main challenge card ──────────────────────────────────────────────────────
function ChallengeCard({ challenge, userParticipation, user, allParticipations, index, onJoin, joining }) {
  const [expanded, setExpanded] = useState(false);
  const typeConf = TYPE_CONFIG[challenge.challenge_type || challenge.type] || TYPE_CONFIG.custom;
  const gradient = challenge.gradient || 'from-[#c9a227] to-[#D9B878]';
  const emoji = challenge.emoji || typeConf.emoji;
  const isParticipating = !!userParticipation;
  const completedDays = userParticipation?.completed_days?.length || 0;
  const progress = Math.min(100, Math.round((completedDays / challenge.duration_days) * 100));
  const daysLeft = challenge.end_date
    ? Math.max(0, differenceInDays(new Date(challenge.end_date), new Date()))
    : challenge.duration_days;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-[#D9B878]/15 overflow-hidden">

      {/* Colour band */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-2">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
            <span className="text-xl">{emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#0A1A2F] text-sm leading-snug">{challenge.title}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${typeConf.bg}`}>
                {typeConf.label}
              </span>
              <span className="text-[10px] text-[#0A1A2F]/30 flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5" /> {challenge.duration_days}d
              </span>
              <span className="text-[10px] text-[#0A1A2F]/30 flex items-center gap-1">
                <Users className="w-2.5 h-2.5" /> {challenge.participant_count || 0}
              </span>
            </div>
          </div>
          {daysLeft <= 5 && daysLeft > 0 && (
            <span className="text-[9px] font-bold bg-red-50 text-red-500 px-2 py-0.5 rounded-full flex-shrink-0">
              {daysLeft}d left
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-[#0A1A2F]/50 leading-relaxed mb-3">{challenge.description}</p>

        {/* Progress bar (if participating) */}
        {isParticipating && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-[#0A1A2F]/40">Your progress</span>
              <span className="text-[10px] font-bold text-[#c9a227]">Day {completedDays}/{challenge.duration_days}</span>
            </div>
            <div className="h-1.5 bg-[#F2F6FA] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
              />
            </div>
          </div>
        )}

        {/* Action row */}
        <div className="flex items-center gap-2">
          {!isParticipating ? (
            <button onClick={() => onJoin(challenge.id)} disabled={joining}
              className={`flex-1 py-2 rounded-xl bg-gradient-to-r ${gradient} text-white font-bold text-xs hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1.5`}>
              {joining ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
              Join Challenge
            </button>
          ) : (
            <button onClick={() => setExpanded(e => !e)}
              className="flex-1 py-2 rounded-xl bg-[#F2F6FA] text-[#0A1A2F] font-bold text-xs hover:bg-[#E8EFF6] transition-colors flex items-center justify-center gap-1.5">
              <Flame className="w-3 h-3 text-orange-400" />
              {expanded ? 'Hide' : 'Log Today'}
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
          <button onClick={() => setExpanded(e => !e)}
            className="w-8 h-8 rounded-xl bg-[#F2F6FA] flex items-center justify-center hover:bg-[#E8EFF6] transition-colors">
            {expanded ? <ChevronUp className="w-3.5 h-3.5 text-[#0A1A2F]/40" /> : <ChevronRight className="w-3.5 h-3.5 text-[#0A1A2F]/40" />}
          </button>
        </div>

        {/* Expandable: check-in + participant strip */}
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              {isParticipating && (
                <CheckInPanel
                  challenge={challenge}
                  participation={userParticipation}
                  user={user}
                  onCheckedIn={() => setExpanded(false)}
                />
              )}
              <ParticipantStrip participations={allParticipations} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Completion celebration ───────────────────────────────────────────────────
function CompletionCard({ challenge }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${challenge.gradient || 'from-[#c9a227] to-[#D9B878]'} rounded-2xl p-5 text-white text-center`}>
      <div className="text-4xl mb-2">🏆</div>
      <h3 className="font-bold text-base mb-1">Challenge Complete!</h3>
      <p className="text-white/80 text-xs mb-3">You finished <strong>{challenge.title}</strong></p>
      <div className="flex items-center justify-center gap-1.5 bg-white/20 rounded-xl py-2 px-4">
        <Award className="w-4 h-4" />
        <span className="text-xs font-bold">{challenge.reward_points || 0} points earned</span>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function GroupChallenges({ user }) {
  const [seeding, setSeeding] = useState(false);
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['activeChallenges'],
    queryFn: () => base44.entities.GroupChallenge.filter({ is_active: true }, '-created_date', 20),
  });

  const { data: myParticipations = [] } = useQuery({
    queryKey: ['myParticipations', user?.email],
    queryFn: () => base44.entities.ChallengeParticipation.filter({ user_email: user.email }),
    enabled: !!user?.email,
  });

  // Load all participations per challenge (for the participant strip)
  const { data: allParticipations = [] } = useQuery({
    queryKey: ['allChallengeParticipations'],
    queryFn: () => base44.entities.ChallengeParticipation.list('-created_date', 200),
    enabled: challenges.length > 0,
  });

  const joinMutation = useMutation({
    mutationFn: async (challengeId) => {
      const challenge = challenges.find(c => c.id === challengeId);
      await base44.entities.ChallengeParticipation.create({
        challenge_id: challengeId,
        user_email: user.email,
        user_name: user.full_name || user.email,
        current_day: 1,
        completed_days: [],
        current_streak: 0,
        longest_streak: 0,
        reflection_entries: [],
        is_anonymous: false,
      });
      await base44.entities.GroupChallenge.update(challengeId, {
        participant_count: (challenge.participant_count || 0) + 1,
      });
    },
    onSuccess: (_, challengeId) => {
      queryClient.invalidateQueries({ queryKey: ['myParticipations'] });
      queryClient.invalidateQueries({ queryKey: ['activeChallenges'] });
      toast.success('You joined the challenge! Check in daily to build your streak 🔥');
    },
    onError: () => toast.error('Failed to join — try again'),
  });

  const handleSeed = async () => {
    setSeeding(true);
    let created = 0;
    for (const c of SEED_CHALLENGES) {
      try {
        await base44.entities.GroupChallenge.create(c);
        created++;
      } catch (e) {
        console.error('Failed to seed challenge:', c.title, e);
      }
    }
    setSeeding(false);
    queryClient.invalidateQueries({ queryKey: ['activeChallenges'] });
    if (created > 0) toast.success(`${created} challenges added!`);
    else toast.error('Seeding failed — check console');
  };

  const getParticipation = (challengeId) =>
    myParticipations.find(p => p.challenge_id === challengeId);

  const getChallengeParticipations = (challengeId) =>
    allParticipations.filter(p => p.challenge_id === challengeId);

  const isCompleted = (challengeId) => {
    const p = getParticipation(challengeId);
    const c = challenges.find(x => x.id === challengeId);
    return p && c && (p.completed_days?.length || 0) >= c.duration_days;
  };

  // Filters
  const myActive = challenges.filter(c => getParticipation(c.id) && !isCompleted(c.id));
  const myDone   = challenges.filter(c => isCompleted(c.id));
  const discover = challenges.filter(c => !getParticipation(c.id));

  const FILTERS = [
    { value: 'all',      label: 'All',        count: challenges.length },
    { value: 'mine',     label: 'My Active',  count: myActive.length },
    { value: 'discover', label: 'Discover',   count: discover.length },
    { value: 'done',     label: 'Completed',  count: myDone.length },
  ];

  const displayList = filter === 'mine' ? myActive
    : filter === 'discover' ? discover
    : filter === 'done' ? myDone
    : challenges;

  return (
    <div className="space-y-4">

      {/* Seed banner — always shown */}
      <SeedBanner onSeed={handleSeed} seeding={seeding} />

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
              filter === f.value
                ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]'
                : 'bg-white text-[#0A1A2F]/50 border-[#E2E8F0] hover:border-[#D9B878]/40'
            }`}>
            {f.label}
            {f.count > 0 && (
              <span className={`text-[9px] rounded-full px-1.5 py-0.5 font-bold ${
                filter === f.value ? 'bg-white/20' : 'bg-[#F2F6FA]'
              }`}>{f.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-[#D9B878]/15 p-4 animate-pulse h-28" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && displayList.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#D9B878]/15 p-10 text-center">
          <div className="w-14 h-14 bg-[#FFF9ED] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-7 h-7 text-[#D9B878]" />
          </div>
          <h3 className="font-bold text-[#0A1A2F] mb-1">
            {filter === 'mine' ? 'No active challenges' :
             filter === 'done' ? 'No completed challenges yet' :
             'No challenges yet'}
          </h3>
          <p className="text-sm text-[#0A1A2F]/40 leading-relaxed">
            {filter === 'mine' ? 'Join a challenge below to start building streaks with your community.' :
             filter === 'done' ? 'Complete a challenge to see your accomplishments here.' :
             'Tap "Add Challenges" above to get started.'}
          </p>
        </div>
      )}

      {/* Completed celebrations */}
      {filter === 'done' && myDone.map(c => (
        <CompletionCard key={c.id} challenge={c} />
      ))}

      {/* Challenge cards */}
      {filter !== 'done' && (
        <div className="space-y-3">
          {displayList.map((challenge, i) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              userParticipation={getParticipation(challenge.id)}
              allParticipations={getChallengeParticipations(challenge.id)}
              user={user}
              index={i}
              onJoin={(id) => joinMutation.mutate(id)}
              joining={joinMutation.isPending && joinMutation.variables === challenge.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
