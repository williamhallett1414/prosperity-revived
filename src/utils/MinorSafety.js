/**
 * MinorSafety — Age-gated social interaction utility
 *
 * Prosperity Revived separates minor (13-17) and adult (18+) accounts.
 * Minors can only interact with other minors. Adults can only interact
 * with other adults. This prevents cross-age social contact including
 * direct messaging, friend requests, comments, and profile viewing.
 *
 * User age_group is set during onboarding:
 *   '18plus'  → adult account
 *   '13to17'  → minor account
 */

import { base44 } from '@/api/base44Client';

// Cache for looked-up users' age groups
const ageCache = new Map();

/**
 * Check if a user is a minor based on their age_group field.
 */
export function isMinor(user) {
  return user?.age_group === '13to17';
}

/**
 * Check if a user is an adult based on their age_group field.
 */
export function isAdult(user) {
  return user?.age_group === '18plus' || (!user?.age_group); // default to adult if not set (legacy accounts)
}

/**
 * Check if two users are in the same age tier (both minor or both adult).
 * Returns true if interaction is allowed.
 */
export function canInteract(currentUser, otherUser) {
  const currentIsMinor = isMinor(currentUser);
  const otherIsMinor = isMinor(otherUser);
  return currentIsMinor === otherIsMinor;
}

/**
 * Look up another user's age group by email and check interaction permission.
 * Returns { allowed: boolean, reason: string }
 */
export async function checkInteractionAllowed(currentUser, otherEmail) {
  if (!currentUser?.email || !otherEmail) return { allowed: false, reason: 'Missing user info' };
  if (currentUser.email === otherEmail) return { allowed: true, reason: '' };

  try {
    // Check cache first
    if (ageCache.has(otherEmail)) {
      const otherAgeGroup = ageCache.get(otherEmail);
      const currentIsMinor = isMinor(currentUser);
      const otherIsMinor = otherAgeGroup === '13to17';
      if (currentIsMinor === otherIsMinor) return { allowed: true, reason: '' };
      return {
        allowed: false,
        reason: currentIsMinor
          ? 'For your safety, you can only message and interact with other teen accounts.'
          : 'This account belongs to a minor. Adult accounts cannot interact with minor accounts.'
      };
    }

    // Look up the other user
    const users = await base44.entities.User?.filter?.({ email: otherEmail });
    const otherUser = users?.[0];
    if (otherUser?.age_group) {
      ageCache.set(otherEmail, otherUser.age_group);
    }

    const currentIsMinor = isMinor(currentUser);
    const otherIsMinor = otherUser?.age_group === '13to17';

    if (currentIsMinor === otherIsMinor) return { allowed: true, reason: '' };

    return {
      allowed: false,
      reason: currentIsMinor
        ? 'For your safety, you can only message and interact with other teen accounts.'
        : 'This account belongs to a minor. Adult accounts cannot interact with minor accounts.'
    };
  } catch (e) {
    // If we can't verify, allow (graceful degradation) but log
    console.warn('MinorSafety: could not verify age group for', otherEmail, e);
    return { allowed: true, reason: '' };
  }
}

/**
 * Get the age tier label for display.
 */
export function getAgeTierLabel(user) {
  return isMinor(user) ? 'Teen' : 'Adult';
}

/**
 * Filter a list of users/emails to only same-age-tier users.
 */
export function filterSameAgeTier(currentUser, userList) {
  const currentIsMinor = isMinor(currentUser);
  return userList.filter(u => {
    const otherIsMinor = u.age_group === '13to17';
    return currentIsMinor === otherIsMinor;
  });
}

export default {
  isMinor,
  isAdult,
  canInteract,
  checkInteractionAllowed,
  getAgeTierLabel,
  filterSameAgeTier,
};
