import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, UtensilsCrossed, Heart, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';

function detectNudge({ workoutSessions, mealLogs, journalEntries, memories }) {
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;

  // --- Coach David: workout inactivity / declining consistency ---
  const recentWorkouts = workoutSessions.filter(s => {
    const d = new Date(s.date || s.created_date);
    return (now - d) < 7 * dayMs;
  });
  const prevWeekWorkouts = workoutSessions.filter(s => {
    const d = new Date(s.date || s.created_date);
    const age = now - d;
    return age >= 7 * dayMs && age < 14 * dayMs;
  });

  if (workoutSessions.length > 0 && recentWorkouts.length === 0) {
    return {
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

  // --- Chef Daniel: repeated unhealthy meals / no logging ---
  const recentMeals = mealLogs.filter(m => {
    const d = new Date(m.date || m.created_date);
    return (now - d) < 3 * dayMs;
  });

  const highCalMeals = recentMeals.filter(m => (m.calories || 0) > 700);
  if (highCalMeals.length >= 3) {
    return {
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

  const mealLogsThisWeek = mealLogs.filter(m => {
    const d = new Date(m.date || m.created_date);
    return (now - d) < 5 * dayMs;
  });
  if (mealLogs.length > 0 && mealLogsThisWeek.length === 0) {
    return {
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

  // --- Hannah: no journaling / low mood signals ---
  const recentJournals = journalEntries.filter(j => {
    const d = new Date(j.created_date);
    return (now - d) < 7 * dayMs;
  });

  if (journalEntries.length > 0 && recentJournals.length === 0) {
    return {
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

  // Low mood from Hannah memories
  const hannahMemories = memories.filter(m => m.chatbot_name === 'Hannah' && m.memory_type === 'insight');
  const lowMoodMem = hannahMemories.find(m =>
    /stress|overwhelm|anxious|burned out|low energy|struggling/i.test(m.content)
  );
  if (lowMoodMem) {
    const memAge = (now - new Date(lowMoodMem.created_date)) / dayMs;
    if (memAge < 5) {
      return {
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
  }

  // Micro-goal milestone: first workout
  if (workoutSessions.length === 1) {
    return {
      chatbot: 'CoachDavid',
      icon: Dumbbell,
      gradient: 'from-[#0A0A0A] to-[#38BDF8]',
      avatar: '🏆',
      name: 'Coach David',
      message: "You logged your FIRST workout! That's the hardest one. Ready to build on that momentum?",
      cta: 'Keep it going!',
      page: 'Workouts',
    };
  }

  return null;
}

const STORAGE_KEY = 'chatbot_nudge_dismissed_at';
const NUDGE_INTERVAL_HOURS = 12;

export default function ChatbotNudgeBanner({ workoutSessions = [], mealLogs = [], user }) {
  const [nudge, setNudge] = useState(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.email) return;

    // Throttle: only show once per NUDGE_INTERVAL_HOURS
    const lastDismissed = localStorage.getItem(`${STORAGE_KEY}_${user.email}`);
    if (lastDismissed) {
      const hoursSince = (Date.now() - Number(lastDismissed)) / (1000 * 60 * 60);
      if (hoursSince < NUDGE_INTERVAL_HOURS) return;
    }

    async function analyze() {
      try {
        const [journalEntries, memories] = await Promise.all([
          base44.entities.JournalEntry.filter({ created_by: user.email }, '-created_date', 20).catch(() => []),
          base44.entities.ChatbotMemory.filter({ created_by: user.email }, '-created_date', 30).catch(() => []),
        ]);

        const detected = detectNudge({ workoutSessions, mealLogs, journalEntries, memories });
        if (detected) {
          setNudge(detected);
          // Small delay so it doesn't flash immediately on load
          setTimeout(() => setVisible(true), 2500);
        }
      } catch (e) {
        // silent
      }
    }

    analyze();
  }, [user?.email, workoutSessions.length, mealLogs.length]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(`${STORAGE_KEY}_${user?.email}`, String(Date.now()));
  };

  const handleCta = () => {
    dismiss();
    navigate(createPageUrl(nudge.page));
  };

  if (!nudge) return null;

  const Icon = nudge.icon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
          className="mb-5 mx-0"
        >
          <div className={`bg-gradient-to-r ${nudge.gradient} rounded-2xl p-4 shadow-lg relative overflow-hidden`}>
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white -translate-y-8 translate-x-8" />
            </div>

            <button
              onClick={dismiss}
              className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 relative z-10">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xl">
                {nudge.avatar}
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <p className="text-xs font-semibold text-white/70 mb-0.5">{nudge.name}</p>
                <p className="text-sm text-white leading-snug">{nudge.message}</p>

                <button
                  onClick={handleCta}
                  className="mt-2.5 flex items-center gap-1 text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
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