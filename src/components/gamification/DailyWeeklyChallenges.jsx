import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Zap, Calendar, Target, Loader2, CheckCircle2 } from 'lucide-react';
import { awardPoints, checkAndAwardBadges } from '@/components/gamification/ProgressManager';

// Static pool of daily challenges — rotates by date
const CHALLENGE_POOL = [
  { id: 'p1',  title: 'Morning Devotional',      description: 'Spend 5 minutes in prayer or scripture before anything else today.', icon: '🌅', difficulty: 'easy',   bonus_points: 25 },
  { id: 'p2',  title: 'Drink 8 Glasses of Water', description: 'Stay hydrated throughout the day — log your water intake.',           icon: '💧', difficulty: 'easy',   bonus_points: 20 },
  { id: 'p3',  title: 'Log a Meal',               description: 'Track at least one full meal in the Nutrition section.',              icon: '🥗', difficulty: 'easy',   bonus_points: 20 },
  { id: 'p4',  title: 'Complete a Workout',        description: 'Finish any workout session in the Fitness section.',                  icon: '💪', difficulty: 'medium', bonus_points: 40 },
  { id: 'p5',  title: 'Write a Journal Entry',     description: 'Reflect on your day in at least 3 sentences in your journal.',       icon: '📓', difficulty: 'easy',   bonus_points: 25 },
  { id: 'p6',  title: '10-Minute Meditation',      description: 'Complete a 10-minute meditation or breathing session.',              icon: '🧘', difficulty: 'easy',   bonus_points: 30 },
  { id: 'p7',  title: 'Read a Bible Chapter',      description: 'Read at least one chapter of the Bible today.',                     icon: '📖', difficulty: 'easy',   bonus_points: 25 },
  { id: 'p8',  title: 'Encourage Someone',         description: 'Leave an encouraging comment on a community post.',                  icon: '💬', difficulty: 'easy',   bonus_points: 20 },
  { id: 'p9',  title: 'Share a Scripture',         description: 'Post a Bible verse that encouraged you today in the Community.',    icon: '✝️', difficulty: 'easy',   bonus_points: 25 },
  { id: 'p10', title: 'Gratitude List',             description: 'Write down 5 things you are grateful for today.',                   icon: '🙏', difficulty: 'easy',   bonus_points: 20 },
  { id: 'p11', title: 'Try a New Recipe',           description: 'Cook or log a recipe you have never tried before.',                 icon: '🍽️', difficulty: 'medium', bonus_points: 35 },
  { id: 'p12', title: 'Send an Encouragement',     description: 'Send a direct message to uplift a friend on the app.',              icon: '💌', difficulty: 'easy',   bonus_points: 20 },
  { id: 'p13', title: 'Complete a Self-Care Task', description: 'Do one self-care activity — stretching, rest, skincare, etc.',      icon: '🌸', difficulty: 'easy',   bonus_points: 25 },
  { id: 'p14', title: '30-Minute Walk',             description: 'Get outside or walk indoors for at least 30 minutes.',              icon: '🚶', difficulty: 'medium', bonus_points: 35 },
  { id: 'p15', title: 'Bookmark a Verse',           description: 'Bookmark a Bible verse that speaks to you today.',                  icon: '🔖', difficulty: 'easy',   bonus_points: 15 },
  { id: 'p16', title: 'Fast from Social Media',    description: 'Spend one hour without social media and use that time with God.',   icon: '📵', difficulty: 'medium', bonus_points: 40 },
  { id: 'p17', title: 'Submit a Prayer Request',   description: 'Share something on your heart in the Prayer section.',              icon: '🕊️', difficulty: 'easy',   bonus_points: 20 },
  { id: 'p18', title: 'Hard Workout',               description: 'Push yourself — complete a hard-difficulty workout today.',          icon: '🔥', difficulty: 'hard',   bonus_points: 60 },
  { id: 'p19', title: 'Read a Devotional Article', description: 'Read a devotional or blog post in the app today.',                  icon: '📰', difficulty: 'easy',   bonus_points: 20 },
  { id: 'p20', title: 'Affirmation Practice',       description: 'Read 3 affirmations aloud and believe them today.',                 icon: '✨', difficulty: 'easy',   bonus_points: 20 },
  { id: 'p21', title: 'No Sugar Challenge',         description: 'Avoid added sugars for the entire day — log your meals.',           icon: '🍎', difficulty: 'hard',   bonus_points: 50 },
  { id: 'p22', title: 'Invite a Friend',            description: 'Invite someone to join you on your wellness journey.',              icon: '🤝', difficulty: 'medium', bonus_points: 35 },
  { id: 'p23', title: 'Group Check-In',             description: 'Visit your community group and post or comment.',                   icon: '👥', difficulty: 'easy',   bonus_points: 20 },
  { id: 'p24', title: 'Evening Reflection',         description: 'Before bed, reflect on 3 ways God showed up for you today.',        icon: '🌙', difficulty: 'easy',   bonus_points: 25 },
  { id: 'p25', title: 'Memorize a Verse',           description: 'Pick a short verse and commit it to memory today.',                 icon: '🧠', difficulty: 'medium', bonus_points: 40 },
];

// Deterministically pick N challenges from the pool based on today's date
function getDailyChallenges(dateStr, count = 3) {
  const seed = dateStr.replace(/-/g, '');
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const indices = new Set();
  let n = hash;
  while (indices.size < count) {
    indices.add(n % CHALLENGE_POOL.length);
    n = (n * 1664525 + 1013904223) >>> 0;
  }
  return [...indices].map(i => ({ ...CHALLENGE_POOL[i], date: dateStr, is_active: true }));
}

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

  // Generate static daily challenges from pool — always 3 per day
  const staticDailyChallenges = React.useMemo(() => getDailyChallenges(today, 3), [today]);

  const { data: dbDailyChallenges = [] } = useQuery({
    queryKey: ['dailyChallenges'],
    queryFn: async () => {
      const all = await base44.entities.DailyChallenge.list('-created_date', 50);
      return all.filter(c => c.date === today && c.is_active);
    },
    enabled: !!user,
  });

  // Merge: DB challenges first, then static ones not already covered
  const dailyChallenges = React.useMemo(() => {
    const combined = [...dbDailyChallenges];
    staticDailyChallenges.forEach(sc => {
      if (!combined.some(c => c.id === sc.id)) combined.push(sc);
    });
    return combined;
  }, [dbDailyChallenges, staticDailyChallenges]);
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
      // For static pool challenges, store with static_challenge_id
      const isStatic = CHALLENGE_POOL.some(p => p.id === challenge.id);
      await base44.entities.ChallengeCompletion.create({
        challenge_id: isStatic ? 'static' : challenge.id,
        static_challenge_id: isStatic ? challenge.id : undefined,
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

  const isCompleted = (id) => completions.some(c =>
    (c.challenge_id === id || c.static_challenge_id === id) && c.completion_date === today
  );

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