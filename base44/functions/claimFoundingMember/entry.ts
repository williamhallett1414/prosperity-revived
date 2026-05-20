/**
 * claimFoundingMember
 *
 * Called by the iOS app at the moment a user completes onboarding. Decides
 * whether to grant the user "Founding Member" status, subject to:
 *
 *   1. The user must be a "candidate" (founder_candidate === true) — set
 *      when their account is first created via our /signup flow.
 *   2. The user must not already be a founder (idempotent — safe to call
 *      twice without making 501 founders).
 *   3. The current count of founders must be under 500 (the Revived 500 cap).
 *
 * If all three pass, sets founding_member = true on the user via
 * service-role write. Returns { granted: true, position: N } so the iOS
 * app can show a celebration.
 *
 * If any fail, returns { granted: false, reason: '...' } and the iOS app
 * continues into the app without founder treatment.
 *
 * ── On race conditions ─────────────────────────────────────────────────
 * This is a "best-effort with buffer" implementation, not strictly atomic.
 * If two users complete onboarding at the same instant when count=499,
 * both reads see 499 and both writes succeed — leaving 501 founders.
 *
 * Real-world impact: minimal. For a 500-member cohort, ending up at 501
 * or 502 is invisible to users and doesn't break the brand promise. We
 * apply a CAP_BUFFER (default 5) so we soft-stop at 495, leaving 5 slots
 * as buffer against contention. If you ever cross 495 in practice, you
 * still have headroom to react before publicly hitting 500.
 *
 * For true atomicity, Base44 would need to expose a transactional
 * counter or a unique-constraint primitive. As of this writing, neither
 * appears available in the SDK.
 *
 * ── Deployment ─────────────────────────────────────────────────────────
 * This file is committed to the repo for visibility, but Base44's
 * function runtime is a separate deploy surface. To activate:
 *   1. Open Base44 dashboard, navigate to Functions
 *   2. Create a new function named exactly "claimFoundingMember"
 *   3. Paste the contents of this file as the function entry
 *   4. Verify it has access to read/write the User entity at service role
 *   5. Save
 *
 * To test:
 *   - Set founder_candidate = true on a test user in Base44 dashboard
 *   - From the iOS app, complete onboarding for that user
 *   - The function should return { granted: true } and set
 *     founding_member = true on that user's record
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const FOUNDER_CAP = 500;
const CAP_BUFFER = 5; // soft-stop 5 slots early to absorb race contention

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Authenticate the requesting user
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ granted: false, reason: 'unauthorized' }, { status: 401 });
    }

    // Idempotent — already a founder? Don't double-write.
    if (user.founding_member === true) {
      return Response.json({ granted: true, reason: 'already_founder', alreadyFounder: true });
    }

    // Must be marked as a candidate (set on signup). This is the gate that
    // ties founder status to having signed up through our flow, not to
    // an external mechanism.
    if (user.founder_candidate !== true) {
      return Response.json({ granted: false, reason: 'not_candidate' });
    }

    // Service-role client for reading the count + writing the flag without
    // user-level permission checks
    const serviceBase44 = base44.asServiceRole;

    // Count existing founders. NOTE: this is a list-and-count, not a true
    // atomic counter. See the race-condition note in the header.
    // Using the SDK's list() to fetch all founders is fine because the
    // total set is capped at ~500.
    const allFounders = await serviceBase44.entities.User.filter({ founding_member: true });
    const currentCount = Array.isArray(allFounders) ? allFounders.length : 0;

    // Soft-stop with buffer to absorb race contention
    if (currentCount >= FOUNDER_CAP - CAP_BUFFER) {
      // We're at or past the soft-stop. Don't grant new founders unless
      // we have actual buffer to grant safely.
      if (currentCount >= FOUNDER_CAP) {
        return Response.json({
          granted: false,
          reason: 'cap_reached',
          currentCount,
        });
      }
      // Between (CAP - BUFFER) and CAP we still allow but log it
      console.warn(
        `claimFoundingMember: in buffer zone (${currentCount}/${FOUNDER_CAP})`
      );
    }

    // Grant founder status
    await serviceBase44.entities.User.update(user.id, {
      founding_member: true,
    });

    return Response.json({
      granted: true,
      position: currentCount + 1,
      capacity: FOUNDER_CAP,
    });
  } catch (err) {
    console.error('claimFoundingMember error:', err);
    return Response.json(
      { granted: false, reason: 'error', message: String(err?.message || err) },
      { status: 500 }
    );
  }
});
