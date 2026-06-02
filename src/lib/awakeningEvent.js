/**
 * The 7-Day Awakening — event configuration
 *
 * Single source of truth for event dates, day-by-day content, and
 * helper functions used by:
 *   - pages/Awakening.jsx          (the event landing page)
 *   - components/awakening/AwakeningBanner.jsx  (home-screen banner)
 *
 * Tied to App Store In-App Event submission. See
 * APPLE_REVIEW_NOTES.md for reviewer-facing details.
 */

// ── Event window ───────────────────────────────────────────────────────────
// Note on dates: month is 0-indexed in JS Date constructor.
// August 10, 2026 07:00 LOCAL through August 16, 2026 23:59 LOCAL.
//
// The Awakening was originally scheduled for launch week (July 7-13), but
// we separated event-start from app-launch so users have time to get settled
// before the all-hands-on-deck week. Founders still get a launch-week
// experience — see FounderWelcome (a separate, smaller moment on July 6-7,
// the Spiritual Assessment with Gideon). That establishes a baseline they
// can revisit when the Awakening proper kicks off here.
export const EVENT_START = new Date(2026, 7, 10, 7, 0, 0);
export const EVENT_END = new Date(2026, 7, 16, 23, 59, 59);

// Founding Members get Day 0 = August 9 (early access to the Awakening,
// one calendar day before everyone else). This is the Awakening-specific
// early access; their LAUNCH-week perk is the separate Founder Welcome.
export const FOUNDER_DAY0_START = new Date(2026, 7, 9, 7, 0, 0);

// Banner becomes visible on the home screen this date (matches the App Store
// event-visibility-start of 14 days before event_start).
export const BANNER_VISIBLE_FROM = new Date(2026, 6, 27, 0, 0, 0); // July 27
export const BANNER_VISIBLE_TO = EVENT_END;

// ── Day-by-day configuration ───────────────────────────────────────────────
// The `route` field is the React Router target each day's CTA opens.
// All routes resolve to existing pages — nothing here promises a feature
// that doesn't already ship in the app.
export const AWAKENING_DAYS = [
  {
    day: 1,
    label: 'Aug 10',
    coach: 'Gideon',
    coachAvatar: '/src/assets/gideon-avatar.png',
    title: 'Where are you starting?',
    practice: 'Spiritual Assessment',
    description:
      "Gideon meets you at the beginning. A short, honest assessment to mark this day — so on Day 7, you can see how far you came.",
    cta: 'Begin with Gideon',
    route: '/SpiritualAssessment',
  },
  {
    day: 2,
    label: 'Aug 11',
    coach: 'Hannah',
    coachAvatar: '/src/assets/hannah-avatar.png',
    title: "Name what's stirring.",
    practice: 'Heart Journal',
    description:
      'Something is moving in you this week. Hannah holds space while you put words to it.',
    cta: 'Open Heart Journal',
    route: '/MyJournalEntries',
  },
  {
    day: 3,
    label: 'Aug 12',
    coach: 'Coach Paul',
    coachAvatar: '/src/assets/coach-paul-avatar.png',
    title: 'Fast and pray.',
    practice: '24-Hour Fast',
    description:
      'Small surrender, big shift. Coach Paul walks you through a 24-hour fast with prayer prompts at key hours.',
    cta: 'Start the fast',
    route: '/FastingTracker',
  },
  {
    day: 4,
    label: 'Aug 13',
    coach: 'Coach David',
    coachAvatar: '/src/assets/coach-david-avatar.png',
    title: 'Move as worship.',
    practice: 'Strength Workout',
    description:
      'Your body is a temple. Coach David has a 25-minute strength session designed to honor what God gave you.',
    cta: 'Train with David',
    route: '/Workouts',
  },
  {
    day: 5,
    label: 'Aug 14',
    coach: 'Chef Daniel',
    coachAvatar: '/src/assets/chef-daniel-avatar.png',
    title: 'Nourish on purpose.',
    practice: 'Clean Eating Plan',
    description:
      "Eat like your spirit depends on it — because it does. Chef Daniel serves up one full day of clean, restorative meals.",
    cta: "See today's menu",
    route: '/Nutrition',
  },
  {
    day: 6,
    label: 'Aug 15',
    coach: 'Gideon',
    coachAvatar: '/src/assets/gideon-avatar.png',
    title: 'The dark night.',
    practice: 'Dark Night Devotional',
    description:
      "Gideon returns for the hardest day. A devotional on surrender — what have you been holding that He's asking for?",
    cta: 'Enter the devotional',
    route: '/DarkNightDevotionals',
  },
  {
    day: 7,
    label: 'Aug 16',
    coach: 'All Five',
    coachAvatar: null, // rendered as a 5-circle row in the UI
    title: 'We rise together.',
    practice: 'Prayer Partners + Heart Journal',
    description:
      'Day 7. All five coaches present. Share one prayer with a partner, write one Heart Journal entry on what shifted, and receive your blessing.',
    cta: 'Complete the Awakening',
    route: '/PrayerPartners',
  },
];

// ── Date helpers ───────────────────────────────────────────────────────────

/**
 * Returns the current "day number" of the Awakening event:
 *   -1 → banner not yet visible
 *    0 → Founding Member early access (August 9 only, for founders)
 *    1..7 → during the event
 *    8 → event ended
 *
 * Founding Members see Day 0 on August 9; non-founders see "starts tomorrow"
 * until August 10.
 */
export function getCurrentDay(user, now = new Date()) {
  if (now < BANNER_VISIBLE_FROM) return -1;
  if (now > EVENT_END) return 8;

  const isFounder = !!user?.founding_member;
  if (isFounder && now >= FOUNDER_DAY0_START && now < EVENT_START) {
    return 0;
  }
  if (now < EVENT_START) return -1; // pre-event, banner-visible window

  // During event: compute calendar-day offset from EVENT_START.
  const msPerDay = 1000 * 60 * 60 * 24;
  const startOfStartDay = new Date(
    EVENT_START.getFullYear(),
    EVENT_START.getMonth(),
    EVENT_START.getDate()
  );
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.min(7, Math.floor((startOfToday - startOfStartDay) / msPerDay) + 1);
}

/**
 * Days until the event starts (for the countdown banner).
 * Returns 0 if the event has started or ended.
 */
export function daysUntilStart(now = new Date()) {
  if (now >= EVENT_START) return 0;
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.ceil((EVENT_START - now) / msPerDay));
}

/**
 * Whether the home-screen banner should be visible at all.
 */
export function isBannerVisible(now = new Date()) {
  return now >= BANNER_VISIBLE_FROM && now <= BANNER_VISIBLE_TO;
}

/**
 * Founding Members complete the Awakening only by finishing all 7 days.
 * This is the trigger for "lifetime founding pricing locks in," per the
 * landing-page promise. Lock-in is enforced server-side eventually; the
 * client just reports completion.
 */
export function isAwakeningComplete(user) {
  const progress = user?.awakening_progress || [];
  return [1, 2, 3, 4, 5, 6, 7].every((d) => progress.includes(d));
}
