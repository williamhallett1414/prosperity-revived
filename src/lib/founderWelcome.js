/**
 * The Founder Welcome — launch-week perk for Founding Members.
 *
 * Context: the Awakening event was moved out of launch week to August 10–16,
 * so app-launch and the big event no longer overlap. Founders were originally
 * promised "early access on July 6" (a full day before the public). That
 * promise stands — but now July 6 is its own smaller moment: the Founder
 * Welcome. A personal welcome from Gideon and the Spiritual Assessment,
 * which establishes a baseline they'll revisit when the Awakening begins
 * a month later.
 *
 * Visibility:
 *   - July 6, 2026 (Founders only): "Day before launch — a gift for you."
 *   - July 7, 2026 (Founders only): "Welcome to launch day."
 *   - July 8 onward: hidden (replaced by normal Home content; the Awakening
 *     banner takes over from July 27 with its own countdown).
 *
 * Distinct from FounderCelebration.jsx, which fires ONCE when a Founder
 * completes onboarding (the gold "Welcome to the Revived 500" overlay).
 * That's a one-time moment; this is a calendar-window card.
 */

// July 6, 2026 07:00 LOCAL — Founder Day Zero
export const FOUNDER_WELCOME_START = new Date(2026, 6, 6, 7, 0, 0);

// End of July 7, 2026 — covers launch day too
export const FOUNDER_WELCOME_END = new Date(2026, 6, 7, 23, 59, 59);

/**
 * Returns the current state of the Founder Welcome window for a given user:
 *   'hidden'        → outside window, OR user is not a Founder
 *   'pre-launch'    → July 6, before public launch (Day Zero proper)
 *   'launch-day'    → July 7, public launch day
 *
 * Non-founders always see 'hidden'.
 */
export function getFounderWelcomeState(user, now = new Date()) {
  if (!user?.founding_member) return 'hidden';
  if (now < FOUNDER_WELCOME_START) return 'hidden';
  if (now > FOUNDER_WELCOME_END) return 'hidden';

  // Same-calendar-day check using local time
  const isJuly6 =
    now.getFullYear() === 2026 &&
    now.getMonth() === 6 &&
    now.getDate() === 6;
  return isJuly6 ? 'pre-launch' : 'launch-day';
}

export function isFounderWelcomeVisible(user, now = new Date()) {
  return getFounderWelcomeState(user, now) !== 'hidden';
}
