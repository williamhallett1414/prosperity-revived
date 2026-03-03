import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, UtensilsCrossed, Heart, ChevronRight, Trophy, Star } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function dayKey(dateStr) {
  return new Date(dateStr).toISOString().split('T')[0];
}

function uniqueDays(items, dateField = 'date') {
  return new Set(items.map(i => dayKey(i[dateField] || i.created_date)));
}

function consecutiveStreak(sortedDays) {
  // sortedDays: array of 'YYYY-MM-DD' strings, most recent first
  if (!sortedDays.length) return 0;
  let streak = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1]);
    const curr = new Date(sortedDays[i]);
    const diff = (prev - curr) / (24 * 60 * 60 * 1000);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

// ─── Nudge Detection ───────────────────────────────────────────────────────────

function detectNudge({ workoutSessions, mealLogs, journalEntries, memories, achievedMilestones }) {
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;

  // ── MILESTONE nudges (highest priority — celebrate first) ──────────────────

  // Workout streak milestones: 3, 7, 14, 30 days
  const workoutDays = Array.from(uniqueDays(workoutSessions))
    .sort((a, b) => b.localeCompare(a));
  const workoutStreak = consecutiveStreak(workoutDays);

  for (const streak of [30, 14, 7, 3]) {
    if (workoutStreak === streak && !achievedMilestones.has(`workout_streak_${streak}`)) {
      return {
        type: 'milestone',
        chatbot: 'CoachDavid',
        icon: Trophy,
        gradient: 'from-[#F59E0B] to-[#EF4444]',
        avatar: '🏆',
        name: 'Coach David',
        message: `INCREDIBLE! You just hit a ${streak}-day workout streak! 🔥 This is the kind of consistency that changes bodies AND identities. Let's talk about what's next.`,
        cta: 'Celebrate with Coach David',
        page: 'Workouts',
        milestoneKey: `workout_streak_${streak}`,
      };
    }
  }

  // Healthy meal streak: 7 meals in a week with calories < 600
  const weekMeals = mealLogs.filter(m => (now - new Date(m.date || m.created_date)) < 7 * dayMs);
  const healthyMeals = weekMeals.filter(m => (m.calories || 0) > 0 && (m.calories || 0) <= 600);
  if (healthyMeals.length >= 7 && !achievedMilestones.has('healthy_meals_7')) {
    return {
      type: 'milestone',
      chatbot: 'ChefDaniel',
      icon: Star,
      gradient: 'from-[#10B981] to-[#059669]',
      avatar: '🥗',
      name: 'Chef Daniel',
      message: "You logged 7 healthy, balanced meals this week — that's a HUGE win! Your body is thanking you. Want to build on this momentum with a full next-week plan?",
      cta: 'Plan next week with Chef Daniel',
      page: 'Nutrition',
      milestoneKey: 'healthy_meals_7',
    };
  }

  // Consistent journaling: 3+ consecutive days
  const journalDays = Array.from(uniqueDays(journalEntries, 'created_date'))
    .sort((a, b) => b.localeCompare(a));
  const journalStreak = consecutiveStreak(journalDays);

  for (const streak of [7, 3]) {
    if (journalStreak === streak && !achievedMilestones.has(`journal_streak_${streak}`)) {
      return {
        type: 'milestone',
        chatbot: 'Hannah',
        icon: Star,
        gradient: 'from-[#8B5CF6] to-[#6D28D9]',
        avatar: '✨',
        name: 'Hannah',
        message: `${streak} days of journaling in a row — that's self-awareness in action! 💛 You're building one of the most powerful habits for growth. Let's go deeper together.`,
        cta: 'Explore with Hannah',
        page: 'PersonalGrowth',
        milestoneKey: `journal_streak_${streak}`,
      };
    }
  }

  // First meal logged
  if (mealLogs.length === 1 && !achievedMilestones.has('first_meal_logged')) {
    return {
      type: 'milestone',
      chatbot: 'ChefDaniel',
      icon: Star,
      gradient: 'from-[#FD9C2D] to-[#E89020]',
      avatar: '🍽️',
      name: 'Chef Daniel',
      message: "You logged your very first meal! Awareness is the first step to transformation. I'm here to turn that into a habit. What are you eating next?",
      cta: 'Chat with Chef Daniel',
      page: 'Nutrition',
      milestoneKey: 'first_meal_logged',
    };
  }

  // First journal entry
  if (journalEntries.length === 1 && !achievedMilestones.has('first_journal')) {
    return {
      type: 'milestone',
      chatbot: 'Hannah',
      icon: Heart,
      gradient: 'from-[#AFC7E3] to-[#3C4E53]',
      avatar: '💛',
      name: 'Hannah',
      message: "You wrote your first journal entry! That takes courage. I'd love to help you build this into a daily practice that accelerates your growth.",
      cta: 'Talk to Hannah',
      page: 'PersonalGrowth',
      milestoneKey: 'first_journal',
    };
  }

  // First workout
  if (workoutSessions.length === 1 && !achievedMilestones.has('first_workout')) {
    return {
      type: 'milestone',
      chatbot: 'CoachDavid',
      icon: Trophy,
      gradient: 'from-[#0A0A0A] to-[#38BDF8]',
      avatar: '🏆',
      name: 'Coach David',
      message: "You logged your FIRST workout! That's the hardest one — and you did it. Now let's build on that momentum.",
      cta: 'Keep it going!',
      page: 'Workouts',
      milestoneKey: 'first_workout',
    };
  }

  // ── PROBLEM / INACTIVITY nudges (lower priority) ───────────────────────────

  // Workout inactivity (7+ days)
  const recentWorkouts = workoutSessions.filter(s => (now - new Date(s.date || s.created_date)) < 7 * dayMs);
  const prevWeekWorkouts = workoutSessions.filter(s => {
    const age = now - new Date(s.date || s.created_date);
    return age >= 7 * dayMs && age < 14 * dayMs;
  });

  if (workoutSessions.length > 0 && recentWorkouts.length === 0) {
    return {
      type: 'nudge',
      chatbot: 'CoachDavid',
      icon: Dumbbell,
      gradient: 'from-[#0A0A0A] to-[#38BDF8]',
      avatar: '💪',
      name: 'Coach David',
      message: "You haven't logged a workout in 7+ days. Your consistency is your superpower — let's reignite it. Even 20 minutes counts.",
      cta: 'Open Coach David',
      page: 'Workouts',
    };
  }

  if (prevWeekWorkouts.length > recentWorkouts.length + 1 && recentWorkouts.length < 2) {
    return {
      type: 'nudge',
      chatbot: 'CoachDavid',
      icon: Dumbbell,
      gradient: 'from-[#0A0A0A] to-[#38BDF8]',
      avatar: '📉',
      name: 'Coach David',
      message: `Your workout frequency dropped this week (${recentWorkouts.length} vs ${prevWeekWorkouts.length} last week). I've got an easy plan to get you back on track.`,
      cta: 'Talk to Coach David',
      page: 'Workouts',
    };
  }

  // High-calorie meals
  const recentMeals = mealLogs.filter(m => (now - new Date(m.date || m.created_date)) < 3 * dayMs);
  const highCalMeals = recentMeals.filter(m => (m.calories || 0) > 700);
  if (highCalMeals.length >= 3) {
    return {
      type: 'nudge',
      chatbot: 'ChefDaniel',
      icon: UtensilsCrossed,
      gradient: 'from-[#FD9C2D] to-[#E89020]',
      avatar: '👨‍🍳',
      name: 'Chef Daniel',
      message: "I noticed a few high-calorie meals lately — totally normal! Let me suggest some lighter, satisfying options for your next meal.",
      cta: 'Chat with Chef Daniel',
      page: 'Nutrition',
    };
  }

  // Meal log inactivity (5+ days)
  const mealLogsThisWeek = mealLogs.filter(m => (now - new Date(m.date || m.created_date)) < 5 * dayMs);
  if (mealLogs.length > 0 && mealLogsThisWeek.length === 0) {
    return {
      type: 'nudge',
      chatbot: 'ChefDaniel',
      icon: UtensilsCrossed,
      gradient: 'from-[#FD9C2D] to-[#E89020]',
      avatar: '🍽️',
      name: 'Chef Daniel',
      message: "You haven't logged any meals in 5 days. Want me to help you build a simple meal plan for this week?",
      cta: 'Chat with Chef Daniel',
      page: 'Nutrition',
    };
  }

  // Journal inactivity (7+ days)
  const recentJournals = journalEntries.filter(j => (now - new Date(j.created_date)) < 7 * dayMs);
  if (journalEntries.length > 0 && recentJournals.length === 0) {
    return {
      type: 'nudge',
      chatbot: 'Hannah',
      icon: Heart,
      gradient: 'from-[#AFC7E3] to-[#3C4E53]',
      avatar: '💛',
      name: 'Hannah',
      message: "It's been a while since you last journaled. A few minutes of reflection can shift everything. I've got a prompt waiting for you.",
      cta: 'Talk to Hannah',
      page: 'PersonalGrowth',
    };
  }

  // Low mood signals from memories
  const hannahMemories = memories.filter(m => m.chatbot_name === 'Hannah' && m.memory_type === 'insight');
  const lowMoodMem = hannahMemories.find(m =>
    /stress|overwhelm|anxious|burned out|low energy|struggling/i.test(m.content)
  );
  if (lowMoodMem && (now - new Date(lowMoodMem.created_date)) / dayMs < 5) {
    return {
      type: 'nudge',
      chatbot: 'Hannah',
      icon: Heart,
      gradient: 'from-[#AFC7E3] to-[#3C4E53]',
      avatar: '🌿',
      name: 'Hannah',
      message: "I noticed you've been going through something tough. I'm here — even a 5-minute check-in can make a difference today.",
      cta: 'Talk to Hannah',
      page: 'PersonalGrowth',
    };
  }

  return null;
}

// ─── Milestone tracking via localStorage ──────────────────────────────────────

function getAchievedMilestones(userEmail) {
  try {
    const raw = localStorage.getItem(`milestones_${userEmail}`);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveMilestone(userEmail, key) {
  try {
    const existing = getAchievedMilestones(userEmail);
    existing.add(key);
    localStorage.setItem(`milestones_${userEmail}`, JSON.stringify([...existing]));
  } catch { /* silent */ }
}

// ─── Component ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'chatbot_nudge_dismissed_at';
const NUDGE_INTERVAL_HOURS = 12;

export default function ChatbotNudgeBanner({ workoutSessions = [], mealLogs = [], user }) {
  const [nudge, setNudge] = useState(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.email) return;

    // Milestone nudges bypass throttle so achievements are always celebrated
    async function analyze() {
      try {
        const [journalEntries, memories] = await Promise.all([
          base44.entities.JournalEntry.filter({ created_by: user.email }, '-created_date', 30).catch(() => []),
          base44.entities.ChatbotMemory.filter({ created_by: user.email }, '-created_date', 30).catch(() => []),
        ]);

        const achievedMilestones = getAchievedMilestones(user.email);
        const detected = detectNudge({ workoutSessions, mealLogs, journalEntries, memories, achievedMilestones });

        if (!detected) return;

        // For non-milestone nudges, apply throttle
        if (detected.type !== 'milestone') {
          const lastDismissed = localStorage.getItem(`${STORAGE_KEY}_${user.email}`);
          if (lastDismissed) {
            const hoursSince = (Date.now() - Number(lastDismissed)) / (1000 * 60 * 60);
            if (hoursSince < NUDGE_INTERVAL_HOURS) return;
          }
        }

        setNudge(detected);
        setTimeout(() => setVisible(true), 2000);
      } catch { /* silent */ }
    }

    analyze();
  }, [user?.email, workoutSessions.length, mealLogs.length]);

  const dismiss = () => {
    setVisible(false);
    if (nudge?.milestoneKey) {
      saveMilestone(user?.email, nudge.milestoneKey);
    } else {
      localStorage.setItem(`${STORAGE_KEY}_${user?.email}`, String(Date.now()));
    }
  };

  const handleCta = () => {
    dismiss();
    navigate(createPageUrl(nudge.page));
  };

  if (!nudge) return null;

  const isMilestone = nudge.type === 'milestone';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -12 }}
          transition={{ duration: 0.35, type: 'spring', stiffness: 300, damping: 25 }}
          className="mb-5"
        >
          <div className={`bg-gradient-to-r ${nudge.gradient} rounded-2xl p-4 shadow-lg relative overflow-hidden`}>
            {/* Decorative circles */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white -translate-y-10 translate-x-10" />
              <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white translate-y-6 -translate-x-6" />
            </div>

            {/* Milestone shimmer line */}
            {isMilestone && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
                className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
              />
            )}

            <button
              onClick={dismiss}
              className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 relative z-10">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-xl ${isMilestone ? 'bg-white/30 ring-2 ring-white/40' : 'bg-white/20'}`}>
                {nudge.avatar}
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-xs font-semibold text-white/80">{nudge.name}</p>
                  {isMilestone && (
                    <span className="text-xs bg-white/25 text-white font-bold px-1.5 py-0.5 rounded-full leading-none">
                      🏅 Achievement
                    </span>
                  )}
                </div>
                <p className="text-sm text-white leading-snug">{nudge.message}</p>

                <button
                  onClick={handleCta}
                  className="mt-2.5 flex items-center gap-1 text-xs font-bold text-white bg-white/20 hover:bg-white/35 px-3 py-1.5 rounded-full transition-colors"
                >
                  {nudge.cta}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}