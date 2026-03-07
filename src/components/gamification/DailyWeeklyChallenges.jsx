import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Zap, Calendar, Target, Loader2, CheckCircle2 } from 'lucide-react';
import { awardPoints, checkAndAwardBadges } from '@/components/gamification/ProgressManager';

const DIFFICULTY = {
  easy:   { bar: 'from-[#AFC7E3] to-[#3C4E53]',   label: 'Easy',   text: 'text-[#3C4E53]'   },
  medium: { bar: 'from-[#c9a227] to-[#FAD98D]',   label: 'Medium', text: 'text-[#c9a227]'   },
  hard:   { bar: 'from-[#0A1A2F] to-[#0A1A2F]',   label: 'Hard',   text: 'text-[#0A1A2F]'   },
};

function ChallengeCard({ challenge, isCompleted, onComplete, loading }) {
  const diff = DIFFICULTY[challenge.difficulty] || DIFFICULTY.medium;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#FAD98D]/25 overflow-hidden shadow-sm">
      {/* Difficulty bar */}
      <div className={`h-1 bg-gradient-to-r ${diff.bar}`} />
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none flex-shrink-0">{challenge.icon || '⚡'}</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#0A1A2F] text-sm leading-snug">{challenge.title}</p>
            <p className="text-xs text-[#0A1A2F]/50 mt-0.5">{challenge.description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold ${diff.text}`}>{diff.label}</span>
          <span className="text-xs font-bold text-[#c9a227]">+{challenge.bonus_points} pts</span>
        </div>
        {isCompleted ? (
          <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FAD98D]/20 border border-[#FAD98D]/30">
            <CheckCircle2 className="w-4 h-4 text-[#c9a227]" />
            <span className="text-sm font-semibold text-[#c9a227]">Completed</span>
          </div>
        ) : (
          <button onClick={onComplete} disabled={loading}
            className="w-full bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white font-semibold text-sm py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {loading ? 'Marking…' : 'Complete Challenge'}
          </button>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState({ icon, label }) {
  return (
    <div className="bg-white rounded-2xl border border-[#FAD98D]/20 p-8 text-center">
      <p className="text-2xl mb-2">{icon}</p>
      <p className="text-sm text-[#0A1A2F]/45">{label}</p>
    </div>
  );
}

export default function DailyWeeklyChallenges({ user }) {
  const queryClient = useQueryClient();

  const today = new Date().toISOString().split('T')[0];
  const weekStart = (() => {
    const d = new Date(); d.setDate(d.getDate() - d.getDay()); return d.toISOString().split('T')[0];
  })();

  const { data: dailyChallenges = [] } = useQuery({
    queryKey: ['dailyChallenges'],
    queryFn: async () => {
      const all = await base44.entities.DailyChallenge.list('-created_date', 50);
      return all.filter(c => c.date === today && c.is_active);
    },
    enabled: !!user,
  });
  const { data: weeklyChallenges = [] } = useQuery({
    queryKey: ['weeklyChallenges'],
    queryFn: async () => {
      const all = await base44.entities.DailyChallenge.list('-created_date', 50);
      return all.filter(c => c.is_weekly && c.week_start === weekStart && c.is_active);
    },
    enabled: !!user,
  });
  const { data: completions = [] } = useQuery({
    queryKey: ['challengeCompletions', user?.email],
    queryFn: () => base44.entities.ChallengeCompletion.list(),
    enabled: !!user,
  });

  const completionMutation = useMutation({
    mutationFn: async (challenge) => {
      await base44.entities.ChallengeCompletion.create({
        challenge_id: challenge.id,
        user_email: user?.email,
        completion_date: today,
        bonus_points_earned: challenge.bonus_points,
      });
      await awardPoints(user?.email, challenge.bonus_points, { challenge_completed: 1 });
      await checkAndAwardBadges(user?.email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['challengeCompletions']);
      queryClient.invalidateQueries(['userProgress']);
    },
  });

  const isCompleted = (id) => completions.some(c => c.challenge_id === id && c.completion_date === today);

  const [tab, setTab] = React.useState('daily');

  return (
    <div className="space-y-4">
      {/* Tab toggle */}
      <div className="flex gap-2">
        {[{ id: 'daily', icon: Calendar, label: 'Daily' }, { id: 'weekly', icon: Target, label: 'Weekly' }].map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === id
                ? 'bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white shadow-sm'
                : 'bg-white text-[#0A1A2F]/50 border border-[#FAD98D]/25'
            }`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* Challenges */}
      {tab === 'daily' && (
        dailyChallenges.length === 0
          ? <EmptyState icon="📅" label="No daily challenges today — check back tomorrow!" />
          : <div className="space-y-3">
              {dailyChallenges.map(c => (
                <ChallengeCard key={c.id} challenge={c} isCompleted={isCompleted(c.id)}
                  onComplete={() => completionMutation.mutate(c)} loading={completionMutation.isPending} />
              ))}
            </div>
      )}
      {tab === 'weekly' && (
        weeklyChallenges.length === 0
          ? <EmptyState icon="📆" label="No weekly challenges this week." />
          : <div className="space-y-3">
              {weeklyChallenges.map(c => (
                <ChallengeCard key={c.id} challenge={c} isCompleted={isCompleted(c.id)}
                  onComplete={() => completionMutation.mutate(c)} loading={completionMutation.isPending} />
              ))}
            </div>
      )}

      {/* Tip */}
      <div className="bg-[#FAD98D]/15 border border-[#FAD98D]/25 rounded-2xl p-4 text-sm text-[#0A1A2F]/65 space-y-1">
        <p className="font-semibold text-[#0A1A2F] text-xs uppercase tracking-wide mb-1.5">How challenges work</p>
        <p>📅 Daily challenges reset every 24 hours</p>
        <p>📆 Weekly challenges span the full week</p>
        <p>⭐ Complete all to earn bonus points and badges</p>
      </div>
    </div>
  );
}
