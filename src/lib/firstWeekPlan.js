/**
 * Your First Week — a permanent 7-day welcome sequence for new users.
 *
 * Different from The 7-Day Awakening (which is a fixed-date launch event):
 *   - First Week is tied to each user's signup date, not a calendar date
 *   - Runs forever (every new user gets one)
 *   - Adapts to the user's pre-signup quiz answers (priorities, coaching_style)
 *   - Hides while the Awakening visibility window is active (July 27-August 16)
 *     so we don't show two competing 7-day plans simultaneously
 *
 * UI surfaces:
 *   - components/firstweek/FirstWeekBanner.jsx — home-screen card
 *   - pages/FirstWeek.jsx — full 7-day plan page
 *
 * Progress is stored on the User entity as `first_week_progress: Array<Int>`.
 * Dismissal is local-only in localStorage (don't surveil users with this).
 */
import { isBannerVisible as isAwakeningVisible, EVENT_END as AWAKENING_END } from './awakeningEvent';

// ── Date helpers ───────────────────────────────────────────────────────────

/**
 * Returns the effective start date for the user's First Week. This is usually
 * just their signup date — but if a user happens to sign up during the
 * Awakening event-visibility window (July 27-August 16, 2026), we defer their
 * First Week to start the day after Awakening ends. Without this, when the
 * Awakening banner hides on July 14, the user would suddenly find their
 * First Week jumped ahead to "Day N of 7" without ever having seen Day 1.
 *
 * Returns null if signup date is missing/invalid.
 */
function effectiveFirstWeekStart(user) {
  if (!user?.created_date) return null;
  const signup = new Date(user.created_date);
  if (Number.isNaN(signup.getTime())) return null;
  // Awakening ends at the END of August 16 (EVENT_END). First Week deferred
  // start is the calendar day AFTER that.
  const dayAfterAwakening = new Date(
    AWAKENING_END.getFullYear(),
    AWAKENING_END.getMonth(),
    AWAKENING_END.getDate() + 1
  );
  return signup < dayAfterAwakening ? dayAfterAwakening : signup;
}

/**
 * How many days has it been since the user's effective First Week start?
 *   0 = First Week starts today
 *   1 = First Week started yesterday
 *   7+ = first week is over
 *
 * Returns 999 ("not in first week") if start date is missing.
 */
export function daysSinceSignup(user, now = new Date()) {
  const start = effectiveFirstWeekStart(user);
  if (!start) return 999;
  const msPerDay = 1000 * 60 * 60 * 24;
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.floor((startOfNow - startDay) / msPerDay);
  // If start is in the future (e.g., user signed up mid-Awakening, deferred
  // start is later this week), report -1 so the rest of the helpers treat
  // them as "not yet in First Week."
  return diff < 0 ? -1 : diff;
}

/**
 * Returns the user's current day in their First Week (1-7), or null if
 * they're outside the window. Day 1 = signup day.
 */
export function currentFirstWeekDay(user, now = new Date()) {
  const elapsed = daysSinceSignup(user, now);
  if (elapsed < 0 || elapsed >= 7) return null;
  return elapsed + 1;
}

/**
 * Should the First Week banner show on Home right now?
 *
 * Hide if any of:
 *   - User is outside their first week
 *   - User dismissed it (localStorage)
 *   - Awakening banner is currently visible (avoid double-banners)
 *   - User has marked all 7 days complete
 */
const DISMISS_KEY = 'first_week_dismissed';

export function isFirstWeekDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

export function dismissFirstWeek() {
  try {
    localStorage.setItem(DISMISS_KEY, '1');
  } catch {}
}

export function shouldShowFirstWeek(user, now = new Date()) {
  // Awakening event takes priority — hide First Week during its window
  if (isAwakeningVisible(now)) return false;
  if (isFirstWeekDismissed()) return false;
  const day = currentFirstWeekDay(user, now);
  if (day === null) return false;
  const progress = user?.first_week_progress || [];
  if (progress.length >= 7) return false; // they finished it
  return true;
}

// ── Personalized day plans ─────────────────────────────────────────────────
//
// Each user's 7 days are filled from a pool of "modules" — small day-themes
// keyed by coach + practice + route. Priority of selection:
//   1. Modules matching the user's top quiz priorities go first (Days 1-3)
//   2. A foundational mix fills Days 4-6
//   3. Day 7 is always "Reflect on the week"
//
// All routes resolve to pages that already exist in the app.

const MODULE_POOL = {
  // ── Spiritual ──
  meet_gideon: {
    coach: 'Gideon',
    practice: 'Bible Study',
    title: 'Meet Gideon.',
    description:
      "Your first conversation with Gideon. Start where you are — He's not waiting for you to be ready.",
    cta: 'Talk with Gideon',
    route: '/Bible',
    fitsPriorities: ['deeper_spiritual_life', 'clearer_purpose'],
  },
  prayer_with_hannah: {
    coach: 'Hannah',
    practice: 'Prayer Journal',
    title: 'Bring it to Hannah.',
    description:
      "Hannah doesn't fix — she sits with you. Open a prayer journal and name what's on your heart today.",
    cta: 'Pray with Hannah',
    route: '/MindSpirit',
    fitsPriorities: ['deeper_spiritual_life', 'calmer_mind'],
  },
  daily_devotional: {
    coach: 'Gideon',
    practice: 'Daily Devotional',
    title: "Today's reading.",
    description:
      'One short passage. Three minutes. Let scripture meet you where the week is meeting you.',
    cta: "Read today's devotional",
    route: '/Devotionals',
    fitsPriorities: ['deeper_spiritual_life'],
  },

  // ── Body ──
  first_workout: {
    coach: 'Coach David',
    practice: 'First Workout',
    title: 'Move with David.',
    description:
      'Twenty minutes. Bodyweight only. Your body was made for this — Coach David starts gentle.',
    cta: 'Train with David',
    route: '/Workouts',
    fitsPriorities: ['stronger_body', 'more_discipline'],
  },
  log_first_meal: {
    coach: 'Chef Daniel',
    practice: 'Log a Meal',
    title: 'Eat with intention.',
    description:
      "Chef Daniel walks you through logging your first meal. No calorie shame — just awareness.",
    cta: 'Open Nutrition',
    route: '/Nutrition',
    fitsPriorities: ['stronger_body', 'better_nutrition'],
  },

  // ── Mind / Coach Paul ──
  growth_with_paul: {
    coach: 'Coach Paul',
    practice: 'Growth Session',
    title: 'Talk with Coach Paul.',
    description:
      "Coach Paul holds space for the harder questions — purpose, identity, the inner work. Open up.",
    cta: 'Sit with Paul',
    route: '/MindSpirit',
    fitsPriorities: ['clearer_purpose', 'calmer_mind', 'better_relationships'],
  },
  rest_practice: {
    coach: 'Hannah',
    practice: 'Sabbath Pause',
    title: 'A pause that counts.',
    description:
      "Ten minutes of guided stillness. No app trick — just quiet, with Hannah's voice if you want it.",
    cta: 'Begin the pause',
    route: '/MindSpirit',
    fitsPriorities: ['more_rest', 'calmer_mind'],
  },

  // ── Final reflection (always Day 7) ──
  week_reflection: {
    coach: 'All Five',
    practice: 'Weekly Reflection',
    title: 'Look back at the week.',
    description:
      "Seven days in. Open your Weekly Reflection — write what shifted, what surprised you, what's still being asked of you.",
    cta: 'Open Weekly Reflection',
    route: '/WeeklyReflectionPage',
    fitsPriorities: [],
  },
};

const ALL_MODULE_KEYS = Object.keys(MODULE_POOL);

/**
 * Build a 7-day plan personalized to the user's priorities and coaching
 * style. Deterministic — same input always produces same output, so users
 * see consistent days when they come back.
 *
 * Algorithm:
 *   1. Day 1 is always Meet Gideon (intentional first contact with brand)
 *   2. Days 2-6 are filled from modules whose fitsPriorities overlap with
 *      the user's quiz priorities, in priority order. Falls back to the
 *      foundational mix if priorities are missing.
 *   3. Day 7 is always the Weekly Reflection.
 *   4. Modules don't repeat within a 7-day plan.
 */
export function buildFirstWeekPlan(user) {
  const userPriorities = Array.isArray(user?.priorities) ? user.priorities : [];

  const days = [];
  days.push({ day: 1, label: 'Day 1', ...MODULE_POOL.meet_gideon });

  // Score remaining modules by how many of the user's priorities they fit
  const scored = ALL_MODULE_KEYS
    .filter((k) => k !== 'meet_gideon' && k !== 'week_reflection')
    .map((k) => {
      const m = MODULE_POOL[k];
      const score = m.fitsPriorities.filter((p) => userPriorities.includes(p)).length;
      return { key: k, score };
    })
    // Stable sort: priority match descending, then by original module-pool order
    .sort((a, b) => b.score - a.score || ALL_MODULE_KEYS.indexOf(a.key) - ALL_MODULE_KEYS.indexOf(b.key));

  for (let d = 2; d <= 6; d++) {
    const idx = d - 2;
    const choice = scored[idx];
    if (!choice) break;
    days.push({ day: d, label: `Day ${d}`, ...MODULE_POOL[choice.key] });
  }

  // Pad with fallback modules if pool isn't big enough (defensive)
  while (days.length < 6) {
    const fallback = MODULE_POOL[ALL_MODULE_KEYS[days.length % ALL_MODULE_KEYS.length]];
    days.push({ day: days.length + 1, label: `Day ${days.length + 1}`, ...fallback });
  }

  days.push({ day: 7, label: 'Day 7', ...MODULE_POOL.week_reflection });
  return days;
}

/**
 * Did the user complete this day already?
 */
export function isFirstWeekDayComplete(user, dayNumber) {
  const progress = user?.first_week_progress || [];
  return progress.includes(dayNumber);
}
