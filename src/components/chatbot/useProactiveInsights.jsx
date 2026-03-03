/**
 * useProactiveInsights
 * Analyzes user data client-side and returns a proactive insight card
 * for Coach David, Chef Daniel, or Hannah.
 *
 * Returns: { insight: { title, message, prompt_action, type } | null }
 */
import { useMemo } from 'react';

// ─── Coach David ────────────────────────────────────────────────────────────
function analyzeCoachDavidData({ workoutSessions = [], memories = [] }) {
  const now = new Date();

  // Detect missed-workout streak (no session in last 5 days)
  const lastSession = workoutSessions[0];
  if (lastSession) {
    const daysSince = Math.floor(
      (now - new Date(lastSession.created_date || lastSession.date)) / 86400000
    );
    if (daysSince >= 5) {
      return {
        title: '💪 Time to Get Back in the Game',
        message: `It looks like it's been ${daysSince} days since your last workout. Consistency beats perfection — a 20-minute session today is all it takes to break the streak.`,
        prompt_action: 'Give me a quick 20-minute workout I can do right now',
        type: 'missed_workout',
      };
    }
  }

  // Detect no workouts logged at all
  if (workoutSessions.length === 0) {
    return {
      title: '🚀 Ready to Start Your Fitness Journey?',
      message: "You haven't logged a workout yet. Let's build your first plan — just tell me your goal and available time.",
      prompt_action: 'Build me a beginner workout plan',
      type: 'no_workouts',
    };
  }

  // Detect plateau pattern from memories
  const plateauMemory = memories.find(m =>
    m.content?.toLowerCase().includes('plateau') ||
    m.content?.toLowerCase().includes('stuck') ||
    m.content?.toLowerCase().includes('same weight')
  );
  if (plateauMemory) {
    return {
      title: '📈 Breaking Through Your Plateau',
      message: "Plateaus are normal — they're a sign your body adapted. Let's shake up your routine with a progressive overload or deload week strategy.",
      prompt_action: 'Help me break through my fitness plateau',
      type: 'plateau',
    };
  }

  // High-frequency training (5+ sessions in last 7 days) → recovery tip
  const recentSessions = workoutSessions.filter(s => {
    const d = new Date(s.created_date || s.date);
    return (now - d) / 86400000 <= 7;
  });
  if (recentSessions.length >= 5) {
    return {
      title: '🔄 Recovery Is Part of the Plan',
      message: "You've been crushing it — 5+ sessions this week! Make sure you're prioritizing sleep and active recovery. Overtraining can stall your progress.",
      prompt_action: 'Give me a recovery protocol for this week',
      type: 'overtraining',
    };
  }

  return null;
}

// ─── Chef Daniel ────────────────────────────────────────────────────────────
function analyzeChefDanielData({ mealLogs = [], memories = [] }) {
  const now = new Date();

  // No meals logged yet
  if (mealLogs.length === 0) {
    return {
      title: '🥗 Start Tracking Your Nutrition',
      message: "You haven't logged any meals yet. Even a rough log helps me give you personalized advice. Let's start with what you had today.",
      prompt_action: "Help me log today's meals",
      type: 'no_meals',
    };
  }

  // Low protein detection
  const recentMeals = mealLogs.slice(0, 7);
  const avgProtein =
    recentMeals.reduce((sum, m) => sum + (m.protein || 0), 0) / recentMeals.length;
  if (avgProtein > 0 && avgProtein < 50) {
    return {
      title: '💪 Low Protein Alert',
      message: `Your recent meals average only ~${Math.round(avgProtein)}g of protein per day. Aim for 0.7–1g per pound of body weight. I can help you boost it without overhauling your meals.`,
      prompt_action: 'Show me easy high-protein meal swaps',
      type: 'low_protein',
    };
  }

  // High calorie days
  const avgCalories =
    recentMeals.reduce((sum, m) => sum + (m.calories || 0), 0) / recentMeals.length;
  if (avgCalories > 2800) {
    return {
      title: '⚡ Calorie Awareness Check',
      message: `Your recent average is ~${Math.round(avgCalories)} calories/day. If your goal is weight loss or maintenance, let's talk about simple swaps that don't leave you hungry.`,
      prompt_action: 'Help me reduce calories without feeling deprived',
      type: 'high_calories',
    };
  }

  // Memory-based: struggling with eating
  const struggleMemory = memories.find(m =>
    m.content?.toLowerCase().includes('unhealthy') ||
    m.content?.toLowerCase().includes('junk') ||
    m.content?.toLowerCase().includes('struggling') ||
    m.content?.toLowerCase().includes('fast food')
  );
  if (struggleMemory) {
    return {
      title: '🍱 Quick Meal Prep Win',
      message: "Life gets busy and healthy eating slips. Here's a challenge: spend 30 minutes this Sunday prepping 2 staples — protein and a grain — and your whole week gets easier.",
      prompt_action: 'Give me a 30-minute Sunday meal prep plan',
      type: 'meal_prep',
    };
  }

  return null;
}

// ─── Hannah ──────────────────────────────────────────────────────────────────
function analyzeHannahData({ conversations = [], memories = [], moodScores = [] }) {
  // Detect consistently low mood
  if (moodScores.length >= 3) {
    const recent = moodScores.slice(0, 5);
    const avg = recent.reduce((s, m) => s + m, 0) / recent.length;
    if (avg <= 4) {
      return {
        title: '🌱 A Grounding Practice for You',
        message: "I've noticed your mood has been low recently. That matters. When everything feels heavy, grounding exercises can create a little breathing room. Would you like to try one now?",
        prompt_action: 'Walk me through a grounding exercise for low mood',
        type: 'low_mood',
      };
    }
  }

  // Detect anxious tone patterns
  const anxiousConvos = conversations.filter(c =>
    c.emotional_tone === 'anxious' || c.emotional_tone === 'overwhelmed'
  );
  if (anxiousConvos.length >= 3) {
    return {
      title: '🫁 Nervous System Reset',
      message: "Anxiety and overwhelm have been showing up for you lately. Your nervous system might need some intentional regulation. Let's try the 4-7-8 breath or pendulation practice.",
      prompt_action: 'Guide me through a nervous system regulation exercise',
      type: 'anxiety_pattern',
    };
  }

  // Detect burnout signals from memories
  const burnoutMemory = memories.find(m =>
    m.content?.toLowerCase().includes('burnout') ||
    m.content?.toLowerCase().includes('exhausted') ||
    m.content?.toLowerCase().includes('empty') ||
    m.content?.toLowerCase().includes('done')
  );
  if (burnoutMemory) {
    return {
      title: '🔋 Permission to Rest',
      message: "You've mentioned exhaustion or burnout before. Real rest isn't laziness — it's essential recovery. Let's talk about what genuine restoration looks like for you right now.",
      prompt_action: "Let's talk about recovering from burnout",
      type: 'burnout',
    };
  }

  // No journal entries in a while → nudge
  if (conversations.length === 0) {
    return {
      title: '📓 Start Your Growth Journey',
      message: "Every great journey begins with a single step. Share what's on your mind — even one sentence — and we'll go from there together.",
      prompt_action: "Here's what's on my mind today: ",
      type: 'no_conversations',
    };
  }

  return null;
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useProactiveInsights({ chatbot, workoutSessions, mealLogs, conversations, memories, moodScores }) {
  const insight = useMemo(() => {
    if (chatbot === 'CoachDavid') return analyzeCoachDavidData({ workoutSessions, memories });
    if (chatbot === 'ChefDaniel') return analyzeChefDanielData({ mealLogs, memories });
    if (chatbot === 'Hannah') return analyzeHannahData({ conversations, memories, moodScores });
    return null;
  }, [chatbot, workoutSessions, mealLogs, conversations, memories, moodScores]);

  return { insight };
}