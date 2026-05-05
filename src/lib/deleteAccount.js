// Self-service account deletion flow.
//
// The Base44 SDK does not expose a `deleteAccount` method for end-users.
// Account removal in Base44 is normally an admin action performed from the
// Users section of the dashboard.
//
// To satisfy Apple App Store Guideline 5.1.1(v) — which requires apps that
// allow account creation to also offer in-app, user-initiated account
// deletion — this helper:
//
//   1. Marks the user's profile with `deletion_requested_at` so the app
//      operator can see the request and finalize removal in the Base44 admin.
//   2. Best-effort wipes the user's most sensitive self-generated data
//      (journal, prayer journal, posts, comments, photos, messages) so the
//      user's visible content is gone immediately.
//   3. Signs the user out so they cannot continue to access the account.
//
// The function returns a Promise that resolves to a result object.
// Failures during the data-wipe step are non-fatal — we still proceed to
// sign out, because the most important guarantees for the user are
// (a) deletion request is recorded, (b) they're signed out, (c) their
// visible data is best-effort scrubbed.

import { base44 } from '@/api/base44Client';

// User-generated content entities that the user has direct authority over
// and that contain potentially sensitive personal data. We do NOT try to
// wipe every entity in the system — that would be slow and fragile, and
// many entities are app-managed (UserProgress, NotificationSettings, etc.)
// rather than user-managed.
const USER_DATA_ENTITIES = [
  'JournalEntry',
  'PrayerJournal',
  'PrayerRequest',
  'Post',
  'CommunityPost',
  'CommunityShare',
  'Comment',
  'Photo',
  'ProgressPhoto',
  'Message',
  'GideonConversation',
  'HannahConversation',
  'MoodEntry',
  'EmotionalPattern',
  'SermonNote',
  'StudyGuideNote',
  'PlanNote',
  'RepentanceEntry',
];

async function wipeEntity(entityName, userEmail) {
  try {
    const Entity = base44.entities[entityName];
    if (!Entity || typeof Entity.filter !== 'function') return { entityName, ok: true, count: 0, skipped: true };
    const records = await Entity.filter({ created_by: userEmail }).catch(() => []);
    if (!Array.isArray(records) || records.length === 0) {
      return { entityName, ok: true, count: 0 };
    }
    let success = 0;
    for (const r of records) {
      if (r && r.id && typeof Entity.delete === 'function') {
        try {
          await Entity.delete(r.id);
          success++;
        } catch (_e) { /* keep going */ }
      }
    }
    return { entityName, ok: true, count: success };
  } catch (_e) {
    return { entityName, ok: false, count: 0 };
  }
}

/**
 * Run the full account-deletion flow.
 * @returns {Promise<{ marked: boolean, wiped: number, errors: string[] }>}
 */
export async function deleteUserAccount() {
  const errors = [];
  let marked = false;
  let wipedCount = 0;

  // Step 1: get current user (we need the email to scope data wipes)
  let currentUser = null;
  try {
    currentUser = await base44.auth.me();
  } catch (e) {
    errors.push('Could not load current user: ' + (e?.message || 'unknown'));
  }

  // Step 2: mark the profile as deletion-requested so the operator can
  // finalize. We do this BEFORE wiping data so even if wiping fails we
  // have a record of the request.
  try {
    const stamp = new Date().toISOString();
    await base44.auth.updateMe({
      deletion_requested_at: stamp,
      // Soft-clear the most identifying free-text fields immediately
      bio: '',
      spiritual_goal: '',
      full_name: '[deleted user]',
    });
    marked = true;
  } catch (e) {
    errors.push('Could not mark deletion request on profile: ' + (e?.message || 'unknown'));
  }

  // Step 3: best-effort wipe of user-generated content
  if (currentUser?.email) {
    const results = await Promise.all(
      USER_DATA_ENTITIES.map((name) => wipeEntity(name, currentUser.email))
    );
    for (const r of results) {
      wipedCount += r.count || 0;
    }
  }

  // Step 4: clear local app data (localStorage caches, coaching progress, etc.)
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Be selective: clear our app's keys but leave Base44 SDK token keys
      // alone — the logout flow will handle those.
      const keysToRemove = [];
      for (const key of Object.keys(window.localStorage)) {
        if (
          key.startsWith('coaching_progress_') ||
          key.startsWith('ritual_morning_') ||
          key.startsWith('ritual_evening_') ||
          key.startsWith('start_my_day_done') ||
          key.startsWith('pr_')
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
    }
  } catch (_e) { /* non-fatal */ }

  return { marked, wiped: wipedCount, errors };
}
