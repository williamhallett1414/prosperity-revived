import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Calendar, Target, Loader2, CheckCircle2, ShieldCheck, AlertCircle, X } from 'lucide-react';
import { awardPoints, checkAndAwardBadges } from '@/components/gamification/ProgressManager';

// ── Verification helpers ────────────────────────────────────────────────────────
async function verifyChallenge(challenge, userEmail, today, weekStart) {
  const v = challenge.verify;
  if (!v) return { ok: true };
  if (v.type === 'reflection_required') return { ok: false, needsReflection: true };

  try {
    if (v.type === 'journal_today') {
      const list = await base44.entities.JournalEntry.filter({ created_by: userEmail });
      const found = list.filter(e => e.created_date && e.created_date.startsWith(today) && (!v.entryType || e.entry_type === v.entryType));
      if (found.length === 0) return { ok: false, message: `No ${v.entryType || 'journal'} entry found for today. Write one first!` };
      return { ok: true };
    }
    if (v.type === 'meal_log_today') {
      const list = await base44.entities.MealLog.filter({ created_by: userEmail });
      const found = list.filter(e => e.date === today || (e.created_date && e.created_date.startsWith(today)));
      if (found.length === 0) return { ok: false, message: 'No meal logged today. Log a meal in Nutrition first!' };
      return { ok: true };
    }
    if (v.type === 'workout_today') {
      const list = await base44.entities.WorkoutSession.filter({ created_by: userEmail });
      const found = list.filter(e => e.created_date && e.created_date.startsWith(today));
      if (found.length === 0) return { ok: false, message: 'No workout logged today. Complete a workout in Fitness first!' };
      return { ok: true };
    }
    if (v.type === 'water_today') {
      const list = await base44.entities.WaterLog.filter({ created_by: userEmail });
      const found = list.find(e => e.date === today && (e.glasses || 0) >= (v.min || 8));
      if (!found) return { ok: false, message: `Log at least ${v.min || 8} glasses of water today in Nutrition!` };
      return { ok: true };
    }
    if (v.type === 'meditation_today') {
      const list = await base44.entities.MeditationSession.filter({ created_by: userEmail });
      const found = list.filter(e => e.created_date && e.created_date.startsWith(today));
      if (found.length === 0) return { ok: false, message: 'No meditation session found today. Complete one in Wellness first!' };
      return { ok: true };
    }
    if (v.type === 'comment_today') {
      const list = await base44.entities.Comment.filter({ created_by: userEmail });
      const found = list.filter(e => e.created_date && e.created_date.startsWith(today));
      if (found.length === 0) return { ok: false, message: 'No comment found today. Leave an encouraging comment in Community first!' };
      return { ok: true };
    }
    if (v.type === 'bookmark_today') {
      const list = await base44.entities.Bookmark.filter({ created_by: userEmail });
      const found = list.filter(e => e.created_date && e.created_date.startsWith(today));
      if (found.length === 0) return { ok: false, message: 'No bookmark saved today. Bookmark a Bible verse first!' };
      return { ok: true };
    }
    if (v.type === 'prayer_today') {
      const list = await base44.entities.PrayerJournal.filter({ created_by: userEmail });
      const found = list.filter(e => e.created_date && e.created_date.startsWith(today));
      if (found.length === 0) return { ok: false, message: 'No prayer entry today. Submit a prayer in the Prayer section first!' };
      return { ok: true };
    }
    if (v.type === 'post_today') {
      const list = await base44.entities.CommunityShare.filter({ created_by: userEmail });
      const found = list.filter(e => e.created_date && e.created_date.startsWith(today));
      if (found.length === 0) return { ok: false, message: 'No post found today. Share something in Community first!' };
      return { ok: true };
    }
    if (v.type === 'message_today') {
      const list = await base44.entities.Message.filter({ sender_email: userEmail });
      const found = list.filter(e => e.created_date && e.created_date.startsWith(today));
      if (found.length === 0) return { ok: false, message: 'No message sent today. Send an encouraging message first!' };
      return { ok: true };
    }
    if (v.type === 'reading_today') {
      const list = await base44.entities.ReadingPlanProgress.filter({ created_by: userEmail });
      const found = list.filter(p => (p.completion_dates || []).some(d => d.startsWith(today)));
      if (found.length === 0) return { ok: false, message: 'No Bible reading logged today. Complete a reading plan day in Bible first!' };
      return { ok: true };
    }
    // Weekly types
    if (v.type === 'workouts_week') {
      const list = await base44.entities.WorkoutSession.filter({ created_by: userEmail });
      const count = list.filter(e => e.created_date >= weekStart).length;
      if (count < v.min) return { ok: false, message: `You've logged ${count}/${v.min} workouts this week. Keep going!` };
      return { ok: true };
    }
    if (v.type === 'journals_week') {
      const list = await base44.entities.JournalEntry.filter({ created_by: userEmail });
      const days = new Set(list.filter(e => e.created_date >= weekStart).map(e => e.created_date && e.created_date.split('T')[0]));
      if (days.size < v.min) return { ok: false, message: `You've journaled on ${days.size}/${v.min} different days this week.` };
      return { ok: true };
    }
    if (v.type === 'meals_week') {
      const list = await base44.entities.MealLog.filter({ created_by: userEmail });
      const days = new Set(list.filter(e => (e.date || (e.created_date && e.created_date.split('T')[0])) >= weekStart).map(e => e.date || (e.created_date && e.created_date.split('T')[0])));
      if (days.size < v.min) return { ok: false, message: `You've logged meals on ${days.size}/${v.min} days this week.` };
      return { ok: true };
    }
    if (v.type === 'meditations_week') {
      const list = await base44.entities.MeditationSession.filter({ created_by: userEmail });
      const count = list.filter(e => e.created_date >= weekStart).length;
      if (count < v.min) return { ok: false, message: `You've completed ${count}/${v.min} meditation sessions this week.` };
      return { ok: true };
    }
    if (v.type === 'community_week') {
      const [comments, posts] = await Promise.all([
        base44.entities.Comment.filter({ created_by: userEmail }),
        base44.entities.CommunityShare.filter({ created_by: userEmail }),
      ]);
      const count = comments.filter(e => e.created_date >= weekStart).length + posts.filter(e => e.created_date >= weekStart).length;
      if (count < v.min) return { ok: false, message: `You've posted/commented ${count}/${v.min} times this week in Community.` };
      return { ok: true };
    }
    if (v.type === 'bookmarks_week') {
      const list = await base44.entities.Bookmark.filter({ created_by: userEmail });
      const count = list.filter(e => e.created_date >= weekStart).length;
      if (count < v.min) return { ok: false, message: `You've bookmarked ${count}/${v.min} verses this week.` };
      return { ok: true };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: 'Could not verify — please try again.' };
  }
}

// ── Static challenge pools ──────────────────────────────────────────────────────
const CHALLENGE_POOL = [
  { id: 'p1',  title: 'Morning Devotional',       description: 'Spend 5 minutes in prayer or scripture before anything else today.',  icon: '🌅', difficulty: 'easy',   bonus_points: 25, verify: { type: 'prayer_today' } },
  { id: 'p2',  title: 'Drink 8 Glasses of Water', description: 'Stay hydrated throughout the day — log your water intake.',           icon: '💧', difficulty: 'easy',   bonus_points: 20, verify: { type: 'water_today', min: 8 } },
  { id: 'p3',  title: 'Log a Meal',               description: 'Track at least one full meal in the Nutrition section.',              icon: '🥗', difficulty: 'easy',   bonus_points: 20, verify: { type: 'meal_log_today' } },
  { id: 'p4',  title: 'Complete a Workout',        description: 'Finish any workout session in the Fitness section.',                  icon: '💪', difficulty: 'medium', bonus_points: 40, verify: { type: 'workout_today' } },
  { id: 'p5',  title: 'Write a Journal Entry',     description: 'Reflect on your day in at least 3 sentences in your journal.',       icon: '📓', difficulty: 'easy',   bonus_points: 25, verify: { type: 'journal_today' } },
  { id: 'p6',  title: '10-Minute Meditation',      description: 'Complete a 10-minute meditation or breathing session.',              icon: '🧘', difficulty: 'easy',   bonus_points: 30, verify: { type: 'meditation_today' } },
  { id: 'p7',  title: 'Read a Bible Chapter',      description: 'Read at least one chapter of the Bible today.',                     icon: '📖', difficulty: 'easy',   bonus_points: 25, verify: { type: 'reading_today' } },
  { id: 'p8',  title: 'Encourage Someone',         description: 'Leave an encouraging comment on a community post.',                  icon: '💬', difficulty: 'easy',   bonus_points: 20, verify: { type: 'comment_today' } },
  { id: 'p9',  title: 'Share a Scripture',         description: 'Post a Bible verse that encouraged you today in the Community.',     icon: '✝️', difficulty: 'easy',   bonus_points: 25, verify: { type: 'post_today' } },
  { id: 'p10', title: 'Gratitude Journal',          description: 'Write a gratitude journal entry today.',                             icon: '🙏', difficulty: 'easy',   bonus_points: 20, verify: { type: 'journal_today', entryType: 'gratitude' } },
  { id: 'p11', title: 'Try a New Recipe',           description: 'Cook or log a recipe you have never tried before.',                 icon: '🍽️', difficulty: 'medium', bonus_points: 35, verify: { type: 'meal_log_today' } },
  { id: 'p12', title: 'Send an Encouragement',     description: 'Send a direct message to uplift a friend on the app.',              icon: '💌', difficulty: 'easy',   bonus_points: 20, verify: { type: 'message_today' } },
  { id: 'p13', title: 'Complete a Self-Care Task', description: 'Do one self-care activity — log it in your journal.',               icon: '🌸', difficulty: 'easy',   bonus_points: 25, verify: { type: 'journal_today' } },
  { id: 'p14', title: '30-Minute Walk',             description: 'Get outside or walk indoors for at least 30 minutes — log workout.',icon: '🚶', difficulty: 'medium', bonus_points: 35, verify: { type: 'workout_today' } },
  { id: 'p15', title: 'Bookmark a Verse',           description: 'Bookmark a Bible verse that speaks to you today.',                  icon: '🔖', difficulty: 'easy',   bonus_points: 15, verify: { type: 'bookmark_today' } },
  { id: 'p16', title: 'Fast from Social Media',    description: 'Spend one hour without social media — write a reflection about it.', icon: '📵', difficulty: 'medium', bonus_points: 40, verify: { type: 'journal_today' } },
  { id: 'p17', title: 'Submit a Prayer Request',   description: 'Share something on your heart in the Prayer section.',              icon: '🕊️', difficulty: 'easy',   bonus_points: 20, verify: { type: 'prayer_today' } },
  { id: 'p18', title: 'Hard Workout',               description: 'Push yourself — complete a workout today.',                         icon: '🔥', difficulty: 'hard',   bonus_points: 60, verify: { type: 'workout_today' } },
  { id: 'p19', title: 'Read a Devotional Article', description: 'Read a devotional — then write a journal reflection about it.',     icon: '📰', difficulty: 'easy',   bonus_points: 20, verify: { type: 'journal_today' } },
  { id: 'p20', title: 'Affirmation Practice',       description: 'Read 3 affirmations aloud — write them down in your journal.',     icon: '✨', difficulty: 'easy',   bonus_points: 20, verify: { type: 'journal_today', entryType: 'affirmation' } },
  { id: 'p21', title: 'No Sugar Challenge',         description: 'Avoid added sugars today — log all your meals as proof.',          icon: '🍎', difficulty: 'hard',   bonus_points: 50, verify: { type: 'meal_log_today' } },
  { id: 'p22', title: 'Invite a Friend',            description: 'Send a message inviting someone to join you on your journey.',     icon: '🤝', difficulty: 'medium', bonus_points: 35, verify: { type: 'message_today' } },
  { id: 'p23', title: 'Group Check-In',             description: 'Visit your community group and post or comment.',                  icon: '👥', difficulty: 'easy',   bonus_points: 20, verify: { type: 'comment_today' } },
  { id: 'p24', title: 'Evening Reflection',         description: 'Before bed, write how God showed up for you today.',               icon: '🌙', difficulty: 'easy',   bonus_points: 25, verify: { type: 'journal_today', entryType: 'reflection' } },
  { id: 'p25', title: 'Memorize a Verse',           description: 'Pick a short verse — bookmark it and write it in your journal.',   icon: '🧠', difficulty: 'medium', bonus_points: 40, verify: { type: 'bookmark_today' } },
];

const WEEKLY_CHALLENGE_POOL = [
  { id: 'w1',  title: '7-Day Workout Streak',       description: 'Complete at least one workout every day this week.',                icon: '🔥', difficulty: 'hard',   bonus_points: 200, verify: { type: 'workouts_week', min: 7 } },
  { id: 'w2',  title: 'Read the Bible Every Day',   description: 'Complete a reading plan day each day this week.',                   icon: '📖', difficulty: 'medium', bonus_points: 150, verify: { type: 'journals_week', min: 5 } },
  { id: 'w3',  title: 'Journal 5 Days This Week',   description: 'Write a journal entry on at least 5 different days.',              icon: '📓', difficulty: 'medium', bonus_points: 120, verify: { type: 'journals_week', min: 5 } },
  { id: 'w4',  title: 'Log All Meals for 5 Days',   description: 'Track every meal for 5 days in the Nutrition section.',            icon: '🥗', difficulty: 'medium', bonus_points: 130, verify: { type: 'meals_week', min: 5 } },
  { id: 'w5',  title: 'Hydration Week',              description: 'Hit your daily water goal every single day this week.',            icon: '💧', difficulty: 'medium', bonus_points: 120, verify: { type: 'meals_week', min: 5 } },
  { id: 'w6',  title: 'Community Contributor',       description: 'Post or comment in the community at least 4 times this week.',    icon: '💬', difficulty: 'easy',   bonus_points: 100, verify: { type: 'community_week', min: 4 } },
  { id: 'w7',  title: 'Prayer Focus Week',           description: 'Submit a prayer request and complete 3 prayer sessions.',         icon: '🕊️', difficulty: 'easy',   bonus_points: 110, verify: { type: 'meditations_week', min: 3 } },
  { id: 'w8',  title: 'Cook 3 Healthy Meals',        description: 'Log 3 home-cooked healthy meals throughout the week.',            icon: '🍽️', difficulty: 'medium', bonus_points: 130, verify: { type: 'meals_week', min: 3 } },
  { id: 'w9',  title: '4 Meditations This Week',     description: 'Complete four meditation or breathing sessions this week.',       icon: '🧘', difficulty: 'medium', bonus_points: 140, verify: { type: 'meditations_week', min: 4 } },
  { id: 'w10', title: 'No Sugar for 5 Days',         description: 'Avoid added sugars for 5 days — log all your meals as proof.',   icon: '🍎', difficulty: 'hard',   bonus_points: 180, verify: { type: 'meals_week', min: 5 } },
  { id: 'w11', title: 'Encourage 5 People',          description: 'Send encouragements or comments to 5 different community members.',icon: '💛', difficulty: 'easy',   bonus_points: 100, verify: { type: 'community_week', min: 5 } },
  { id: 'w12', title: 'Memorize 2 Verses',           description: 'Bookmark at least 2 Bible verses this week.',                    icon: '🧠', difficulty: 'medium', bonus_points: 150, verify: { type: 'bookmarks_week', min: 2 } },
  { id: 'w13', title: 'Digital Sabbath Day',         description: 'Take a rest day — write a reflection journal entry about it.',   icon: '📵', difficulty: 'medium', bonus_points: 120, verify: { type: 'journals_week', min: 1 } },
  { id: 'w14', title: '5+ Workouts This Week',       description: 'Log at least 5 workout sessions this week.',                     icon: '🚶', difficulty: 'hard',   bonus_points: 200, verify: { type: 'workouts_week', min: 5 } },
  { id: 'w15', title: 'Weekly Gratitude Reflection', description: 'Write a gratitude journal entry on at least 5 days this week.',  icon: '🙏', difficulty: 'easy',   bonus_points: 100, verify: { type: 'journals_week', min: 5 } },
];

// ── Date helpers ────────────────────────────────────────────────────────────────
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

function getWeeklyChallenges(weekStartStr, count = 2) {
  const seed = weekStartStr.replace(/-/g, '') + '7';
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const indices = new Set();
  let n = hash;
  while (indices.size < count) {
    indices.add(n % WEEKLY_CHALLENGE_POOL.length);
    n = (n * 1664525 + 1013904223) >>> 0;
  }
  return [...indices].map(i => ({ ...WEEKLY_CHALLENGE_POOL[i], week_start: weekStartStr, is_weekly: true, is_active: true }));
}

// ── UI ──────────────────────────────────────────────────────────────────────────
const DIFFICULTY = {
  easy:   { bar: 'from-[#AFC7E3] to-[#3C4E53]', label: 'Easy',   text: 'text-[#3C4E53]' },
  medium: { bar: 'from-[#c9a227] to-[#FAD98D]', label: 'Medium', text: 'text-[#c9a227]' },
  hard:   { bar: 'from-[#0A1A2F] to-[#3C4E53]', label: 'Hard',   text: 'text-[#0A1A2F]' },
};

function ChallengeCard({ challenge, isCompleted, onVerifyAndComplete, userEmail, today, weekStart }) {
  const diff = DIFFICULTY[challenge.difficulty] || DIFFICULTY.medium;
  const [verifying, setVerifying] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [needsReflection, setNeedsReflection] = React.useState(false);
  const [reflection, setReflection] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  async function handleVerify() {
    setVerifying(true);
    setError(null);
    const result = await verifyChallenge(challenge, userEmail, today, weekStart);
    setVerifying(false);
    if (result.ok) {
      onVerifyAndComplete(challenge);
    } else if (result.needsReflection) {
      setNeedsReflection(true);
    } else {
      setError(result.message);
    }
  }

  async function handleReflectionSubmit() {
    if (!reflection.trim() || reflection.trim().length < 20) return;
    setSubmitting(true);
    await base44.entities.JournalEntry.create({
      title: challenge.title + ' — Reflection',
      content: reflection.trim(),
      entry_type: 'reflection',
    });
    setNeedsReflection(false);
    setReflection('');
    setSubmitting(false);
    onVerifyAndComplete(challenge);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#FAD98D]/25 overflow-hidden shadow-sm">
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

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-600 leading-relaxed flex-1">{error}</p>
              <button onClick={() => setError(null)}><X className="w-3.5 h-3.5 text-red-300" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {needsReflection && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden">
              <p className="text-xs text-[#0A1A2F]/60 italic">Write a brief reflection (at least 20 chars) to verify completion:</p>
              <textarea
                value={reflection}
                onChange={e => setReflection(e.target.value)}
                rows={3}
                placeholder="Share what you did and how it went…"
                className="w-full resize-none text-xs px-3 py-2 rounded-xl border border-[#FAD98D]/40 bg-[#FAF9F6] text-[#0A1A2F] focus:outline-none focus:border-[#FAD98D]"
              />
              <div className="flex gap-2">
                <button onClick={() => setNeedsReflection(false)}
                  className="flex-1 py-2 rounded-xl border border-[#FAD98D]/30 text-xs font-semibold text-[#0A1A2F]/50">Cancel</button>
                <button onClick={handleReflectionSubmit} disabled={submitting || reflection.trim().length < 20}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-1">
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Submit
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isCompleted ? (
          <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FAD98D]/20 border border-[#FAD98D]/30">
            <CheckCircle2 className="w-4 h-4 text-[#c9a227]" />
            <span className="text-sm font-semibold text-[#c9a227]">Verified & Complete</span>
          </div>
        ) : !needsReflection && (
          <button onClick={handleVerify} disabled={verifying}
            className="w-full bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white font-semibold text-sm py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {verifying ? 'Verifying…' : 'Verify & Complete'}
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
  const [tab, setTab] = React.useState('daily');

  const today = new Date().toISOString().split('T')[0];
  const weekStart = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    return d.toISOString().split('T')[0];
  }, []);

  const staticDailyChallenges = React.useMemo(() => getDailyChallenges(today, 3), [today]);
  const staticWeeklyChallenges = React.useMemo(() => getWeeklyChallenges(weekStart, 2), [weekStart]);

  const { data: dbDailyChallenges = [] } = useQuery({
    queryKey: ['dailyChallenges'],
    queryFn: async () => {
      const all = await base44.entities.DailyChallenge.list('-created_date', 50);
      return all.filter(c => c.date === today && c.is_active);
    },
    enabled: !!user,
  });

  const dailyChallenges = React.useMemo(() => {
    const combined = [...dbDailyChallenges];
    staticDailyChallenges.forEach(sc => {
      if (!combined.some(c => c.id === sc.id)) combined.push(sc);
    });
    return combined;
  }, [dbDailyChallenges, staticDailyChallenges]);

  const { data: dbWeeklyChallenges = [] } = useQuery({
    queryKey: ['weeklyChallenges'],
    queryFn: async () => {
      const all = await base44.entities.DailyChallenge.list('-created_date', 50);
      return all.filter(c => c.is_weekly && c.week_start === weekStart && c.is_active);
    },
    enabled: !!user,
  });

  const weeklyChallenges = React.useMemo(() => {
    const combined = [...dbWeeklyChallenges];
    staticWeeklyChallenges.forEach(sc => {
      if (!combined.some(c => c.id === sc.id)) combined.push(sc);
    });
    return combined;
  }, [dbWeeklyChallenges, staticWeeklyChallenges]);

  const { data: completions = [] } = useQuery({
    queryKey: ['challengeCompletions', user?.email],
    queryFn: () => base44.entities.ChallengeCompletion.list(),
    enabled: !!user,
  });

  const completionMutation = useMutation({
    mutationFn: async (challenge) => {
      const isStatic = CHALLENGE_POOL.some(p => p.id === challenge.id) || WEEKLY_CHALLENGE_POOL.some(p => p.id === challenge.id);
      await base44.entities.ChallengeCompletion.create({
        challenge_id: isStatic ? 'static' : challenge.id,
        static_challenge_id: isStatic ? challenge.id : undefined,
        user_email: user?.email,
        completion_date: today,
        bonus_points_earned: challenge.bonus_points,
        verified: true,
      });
      await awardPoints(user?.email, challenge.bonus_points, { challenges_completed: 1 });
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

  return (
    <div className="space-y-4">
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

      {tab === 'daily' && (
        dailyChallenges.length === 0
          ? <EmptyState icon="📅" label="No daily challenges today — check back tomorrow!" />
          : <div className="space-y-3">
              {dailyChallenges.map(c => (
                <ChallengeCard key={c.id} challenge={c} isCompleted={isCompleted(c.id)}
                  onVerifyAndComplete={(ch) => completionMutation.mutate(ch)}
                  userEmail={user?.email} today={today} weekStart={weekStart} />
              ))}
            </div>
      )}
      {tab === 'weekly' && (
        weeklyChallenges.length === 0
          ? <EmptyState icon="📆" label="No weekly challenges this week." />
          : <div className="space-y-3">
              {weeklyChallenges.map(c => (
                <ChallengeCard key={c.id} challenge={c} isCompleted={isCompleted(c.id)}
                  onVerifyAndComplete={(ch) => completionMutation.mutate(ch)}
                  userEmail={user?.email} today={today} weekStart={weekStart} />
              ))}
            </div>
      )}

      <div className="bg-[#FAD98D]/15 border border-[#FAD98D]/25 rounded-2xl p-4 text-sm text-[#0A1A2F]/65 space-y-1">
        <p className="font-semibold text-[#0A1A2F] text-xs uppercase tracking-wide mb-1.5">How challenges work</p>
        <p>🛡️ Completion is verified against your real app activity</p>
        <p>📅 Daily challenges reset every 24 hours</p>
        <p>📆 Weekly challenges span the full week</p>
      </div>
    </div>
  );
}