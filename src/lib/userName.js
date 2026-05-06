/**
 * Helpers for handling user display names safely.
 *
 * Background: Base44 auto-populates `user.full_name` with the local part
 * of the user's email address on signup (e.g. "prosperityrevivedtest1"
 * from "prosperityrevivedtest1@gmail.com"). That means a non-empty
 * `full_name` is NOT a reliable signal that the user has actually set
 * their name. Greeting them with "Good morning, prosperityrevivedtest1"
 * looks broken and unfriendly.
 *
 * These helpers detect when full_name is almost certainly the
 * auto-populated email prefix (and therefore should NOT be shown to the
 * user as their name), and provide consistent fallbacks across the app
 * for greetings, profile display, avatar initials, etc.
 */

/**
 * Returns true when `fullName` looks like it was auto-derived from an
 * email address rather than typed by a human.
 *
 * Detection rules (any one is enough):
 *   1. Exact match against the local part of the user's email
 *   2. Contains a dot or underscore (e.g. "william.hallett", "j_smith")
 *   3. Contains a digit AND has no whitespace (e.g. "user1414",
 *      "prosperityrevivedtest1")
 *
 * These are heuristics — a real human could legitimately have a name
 * that triggers one of these, but the cost of a false positive is low
 * ("friend" instead of their name) and the cost of a false negative is
 * high (the app looks broken).
 */
export function isEmailPrefixName(fullName, email) {
  if (!fullName) return false;
  const trimmed = String(fullName).trim();
  if (!trimmed) return false;

  // Rule 1: exact match against email local part
  if (email && typeof email === 'string') {
    const localPart = email.split('@')[0];
    if (localPart && trimmed.toLowerCase() === localPart.toLowerCase()) {
      return true;
    }
  }

  // Rule 2: contains . or _ (technical handle pattern)
  if (/[._]/.test(trimmed)) return true;

  // Rule 3: contains a digit AND no whitespace (handle-like)
  if (/\d/.test(trimmed) && !/\s/.test(trimmed)) return true;

  return false;
}

/**
 * Returns the user's first name, suitable for personal greetings like
 * "Good morning, X". Falls back to `fallback` (default "friend") when:
 *   - user is null/undefined
 *   - full_name is empty
 *   - full_name looks like an auto-derived email prefix
 */
export function getFirstName(user, fallback = 'friend') {
  if (!user) return fallback;
  const raw = (user.full_name || '').trim();
  if (!raw) return fallback;
  if (isEmailPrefixName(raw, user.email)) return fallback;
  const first = raw.split(/\s+/)[0];
  return first || fallback;
}

/**
 * Returns the user's display name (full name) suitable for profile
 * pages, "About" cards, etc. Falls back to `fallback` when full_name
 * is unset or looks like an auto-derived email prefix.
 */
export function getDisplayName(user, fallback = 'Friend') {
  if (!user) return fallback;
  const raw = (user.full_name || '').trim();
  if (!raw) return fallback;
  if (isEmailPrefixName(raw, user.email)) return fallback;
  return raw;
}

/**
 * Returns a single uppercase letter for use in avatar initials.
 *
 * Strategy:
 *   - If we have a real name, use its first letter.
 *   - If full_name is an email prefix, use the email's first letter
 *     (still personalized to the user, just not "P" for everyone whose
 *     name we don't know).
 *   - Otherwise '?'.
 */
export function getInitial(user) {
  if (!user) return '?';
  const raw = (user.full_name || '').trim();
  if (raw && !isEmailPrefixName(raw, user.email)) {
    return raw.charAt(0).toUpperCase();
  }
  const email = (user.email || '').trim();
  if (email) return email.charAt(0).toUpperCase();
  return '?';
}

/**
 * Returns the value to PRE-FILL into a name input field. Unlike the
 * greeting helpers, this returns an empty string (not "friend") when
 * full_name is unset or looks auto-derived — so the input shows its
 * placeholder rather than fake-looking pre-filled text the user would
 * have to delete.
 */
export function getNameInputValue(user) {
  if (!user) return '';
  const raw = (user.full_name || '').trim();
  if (!raw) return '';
  if (isEmailPrefixName(raw, user.email)) return '';
  return raw;
}

/**
 * Read-side counterpart to getDisplayName. Use this when you have a
 * raw name string from a stored record (e.g. `post.user_name`,
 * `comment.user_name`, `recipe.user_name`) — i.e. a name that some
 * earlier code wrote with the buggy `user.full_name || 'Anonymous'`
 * pattern, baking the email-prefix value into the record.
 *
 * Falls back to `fallback` (default "Friend") when:
 *   - the name is empty/null/undefined
 *   - the name looks like an auto-derived email prefix
 *
 * Note: with no email available we can only apply rules 2 & 3 of the
 * detector (dot/underscore, digit-without-whitespace), which catches
 * the test account ("prosperityrevivedtest1") and most realistic
 * Base44 auto-fills, but is necessarily best-effort.
 */
export function getDisplayNameFromString(name, fallback = 'Friend') {
  if (!name) return fallback;
  const trimmed = String(name).trim();
  if (!trimmed) return fallback;
  if (isEmailPrefixName(trimmed)) return fallback;
  return trimmed;
}

/**
 * Read-side counterpart to getInitial. Use this when you have a raw
 * name string and want a single uppercase letter for an avatar
 * fallback. Returns the first letter of the name unless the name
 * looks email-prefix-derived, in which case it falls back to '?'.
 *
 * If you also have access to the user's email, prefer using getInitial
 * with a {full_name, email} object so it can fall back to the email's
 * initial. This string-only variant is for stored records where email
 * isn't available.
 */
export function getInitialFromString(name) {
  if (!name) return '?';
  const trimmed = String(name).trim();
  if (!trimmed) return '?';
  if (isEmailPrefixName(trimmed)) return '?';
  return trimmed.charAt(0).toUpperCase();
}
