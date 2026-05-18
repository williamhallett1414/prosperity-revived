# Apple App Store Review Notes

## Info.plist Required Entries
Add these to your iOS project's Info.plist before submitting:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Prosperity Revived uses the microphone to let you have voice conversations with your AI coaching guides (Gideon, Hannah, Coach David, Chef Daniel, Coach Paul) and to record sermon notes.</string>

<key>NSCameraUsageDescription</key>
<string>Prosperity Revived uses the camera to let you record video messages to share your faith journey with the community and to take progress photos for your fitness goals.</string>
```

## App Privacy (App Store Connect)
Declare these data types:
- **Health & Fitness**: Workout logs, nutrition data, body measurements
- **User Content**: Journal entries, community posts, chat messages, photos
- **Identifiers**: Email address, user ID
- **Usage Data**: App interactions, feature usage
- **Sensitive Info**: Religious beliefs (faith-based content)

## Age Rating
Recommend: **12+** (religious content, community features, health tracking)

## Required Features Already Implemented
- ✅ AI content disclosure on all chat screens
- ✅ Crisis resources (988 Suicide & Crisis Lifeline, Crisis Text Line 741741)
- ✅ Health & wellness disclaimer on fitness/nutrition pages
- ✅ Account deletion (Settings → Manage My Data → Delete Account)
- ✅ Data export request (Settings → Manage My Data → Access & Export)
- ✅ Content reporting (flag icon on community posts)
- ✅ User blocking (X icon on community posts)
- ✅ AI moderation notice on community feed
- ✅ Health & Wellness Waiver during onboarding
- ✅ Privacy Policy page (in-app + Settings link)
- ✅ Terms & Conditions page
- ✅ Subscription Terms page

## App Review Submission Notes (paste into App Store Connect)
"Prosperity Revived is a faith-based wellness app featuring AI coaching
guides. All AI-generated responses are clearly labeled as such and are
not a substitute for professional medical, financial, or therapeutic
advice. Crisis resources (988 Lifeline) are prominently displayed on
all mental health and emotional wellness screens. Users must accept a
Health & Wellness Waiver during onboarding before accessing fitness or
nutrition features. Account deletion is available in Settings → Manage
My Data. Community content is moderated by AI with user reporting and
blocking capabilities."

---

## In-App Event: The 7-Day Awakening (Launch Week 2026)

**Event window:** July 7, 2026 (07:00 local) through July 13, 2026 (23:59 local).
**Submitted as:** In-App Event → Special Event.
**Deep link route:** `/Awakening` (page auto-registered via `pages.config.js`).

### What the event delivers

When users tap the event card, Apple deep-links them to the in-app
`/Awakening` route. There they see:

- A hero with a personalized greeting and countdown (pre-event) or the
  current day highlighted (during-event).
- A 7-day progress strip showing complete and upcoming days.
- Seven gated day cards. Each card's primary CTA routes the user to an
  existing shipped feature:

  | Day | Coach        | Practice                      | Route                  |
  |-----|--------------|-------------------------------|------------------------|
  | 1   | Gideon       | Spiritual Assessment          | /SpiritualAssessment   |
  | 2   | Hannah       | Heart Journal entry           | /MyJournalEntries      |
  | 3   | Coach Paul   | 24-hour fast                  | /FastingTracker        |
  | 4   | Coach David  | Strength workout              | /Workouts              |
  | 5   | Chef Daniel  | Clean-eating meal plan        | /Nutrition             |
  | 6   | Gideon       | Dark Night Devotional         | /DarkNightDevotionals  |
  | 7   | All five     | Prayer Partner share + Heart Journal | /PrayerPartners |

- A home-screen banner (visible June 23 through July 13) promoting the
  event and linking to `/Awakening`.

Completion is stored on the User entity field `awakening_progress`
(array of integers 1-7). Optimistic update with rollback on save failure.

### Founding Member tie-in (The Revived 500)

The first 500 waitlist signups from `prosperityrevived.app` are marked
on the User entity with `founding_member: true`. Founding Members receive:

1. **Day 0 early access (July 6).** The Awakening landing screen unlocks
   one day early for them with a personal welcome from Gideon. Non-founders
   see only a countdown until July 7.
2. **Founding 500 badge** displayed in the event UI and (planned) on
   profile, Prayer Wall, and Day 7 completion graphic.
3. **Lifetime founding pricing locks in** upon completion of all 7 days.
   The field `founding_pricing_locked: boolean` is set on the User record
   when day 7 is marked complete and `founding_member` is true. There are
   no paid tiers in the current build, so this field is reserved for
   future use; nothing is sold or charged during the event.

The App Store event card itself contains NO Founding-Member-exclusive
language. The event is open to all users; differentiation happens
only inside the app.

### How to verify (for App Review)

The reviewer demo account provided in the App Review Information
section has `founding_member: true` set so the full Founding Member
experience (Day 0 early access, Founding 500 badge) can be observed
beginning July 6.

To reach the event experience:
1. Open the app and complete sign-in.
2. From the Home screen, tap the "The 7-Day Awakening" banner OR
   navigate to `/Awakening` directly.
3. The event landing screen loads with state appropriate to the date:
   - Before July 7: countdown view with locked day cards.
   - July 6 (Founding Members only): Day 0 unlocked with welcome.
   - July 7 through July 13: today's card highlighted, prior days
     marked complete, future days locked.
   - After July 13: completion summary, all days revisitable.

Date-gating logic lives in `src/lib/awakeningEvent.js` and is readable
during code review. If interactive previewing of a specific day is
required, please contact us at the email below and we will provide a
debug build with the simulated-clock override enabled.

### Content notes for review

- All Scripture cited in the event experience comes from established
  public-domain and licensed translations, not AI generation.
- AI coaches direct users to Scripture and explicitly note they are not
  substitutes for clergy, counselors, or medical professionals.
- No purchase, subscription, or paid unlock is required to participate.
- Day 3 fasting features an explicit guardrail screen (already present
  in the FastingTracker page) advising users with medical conditions,
  pregnancy, or eating-disorder history to consult their physician
  first, with a "Modified Fast" alternative.
- User-generated content (Heart Journal entries, Prayer Partner
  requests) flows through existing community moderation and reporting
  infrastructure documented above.

### Schema additions required in Base44

These fields must be added to the User entity in the Base44 dashboard
before the event submission goes live (the code is defensive against
their absence — it treats missing values as default-empty/false — but
the data won't persist until the fields exist):

- `awakening_progress`: Array of integers, default `[]`
- `founding_member`: Boolean, default `false`
- `founding_pricing_locked`: Boolean, default `false`

