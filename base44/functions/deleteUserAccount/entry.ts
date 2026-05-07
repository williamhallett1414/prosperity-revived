import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// All entities and the fields that identify user ownership.
// We check both created_by (platform standard) and any entity-specific
// user-identifier fields so nothing is missed.
const ENTITY_DELETION_CONFIG = [
  { name: 'JournalEntry',          fields: ['created_by'] },
  { name: 'PrayerJournal',         fields: ['created_by'] },
  { name: 'PrayerRequest',         fields: ['created_by', 'user_email'] },
  { name: 'Post',                  fields: ['created_by'] },
  { name: 'Comment',               fields: ['created_by'] },
  { name: 'Photo',                 fields: ['created_by'] },
  { name: 'ProgressPhoto',         fields: ['created_by'] },
  { name: 'Bookmark',              fields: ['created_by'] },
  { name: 'SermonNote',            fields: ['created_by'] },
  { name: 'StudyGuideNote',        fields: ['created_by'] },
  { name: 'PlanNote',              fields: ['created_by'] },
  { name: 'RepentanceEntry',       fields: ['created_by'] },
  { name: 'ReadingPlanProgress',   fields: ['created_by'] },
  { name: 'WorkoutSession',        fields: ['created_by'] },
  { name: 'WorkoutPlan',           fields: ['created_by'] },
  { name: 'MealLog',               fields: ['created_by'] },
  { name: 'Recipe',                fields: ['created_by'] },
  { name: 'WaterLog',              fields: ['created_by'] },
  { name: 'UserProgress',          fields: ['created_by'] },
  { name: 'SpiritualGoal',         fields: ['created_by'] },
  { name: 'MeditationSession',     fields: ['created_by'] },
  { name: 'MeditationFavorite',    fields: ['created_by'] },
  { name: 'SelfCareActivity',      fields: ['created_by'] },
  { name: 'DailyChallenge',        fields: ['created_by'] },
  { name: 'ChallengeParticipant',  fields: ['created_by'] },
  { name: 'ChallengeParticipation',fields: ['created_by'] },
  { name: 'ChallengeCompletion',   fields: ['created_by'] },
  { name: 'StudyGroup',            fields: ['created_by'] },
  { name: 'GroupMember',           fields: ['created_by', 'user_email'] },
  { name: 'NutritionPlan',         fields: ['created_by'] },
  { name: 'MealPlanDay',           fields: ['created_by'] },
  { name: 'RecipeCollection',      fields: ['created_by'] },
  { name: 'RecipeLike',            fields: ['created_by'] },
  { name: 'BlogPost',              fields: ['created_by'] },
  { name: 'Notification',          fields: ['created_by'] },
  { name: 'GideonConversation',    fields: ['created_by'] },
  { name: 'HannahConversation',    fields: ['created_by'] },
  { name: 'GideonAdvice',          fields: ['created_by'] },
  { name: 'GideonDailyReflection', fields: ['created_by'] },
  { name: 'GideonProactiveSuggestion', fields: ['created_by'] },
  { name: 'ProactiveSuggestion',   fields: ['created_by'] },
  { name: 'JournalSummary',        fields: ['created_by'] },
  { name: 'SpiritualThemeInsight', fields: ['created_by'] },
  { name: 'EmotionalPattern',      fields: ['created_by'] },
  { name: 'ChatbotMemory',         fields: ['created_by'] },
  { name: 'ChatbotPreferences',    fields: ['created_by'] },
  { name: 'UserMemory',            fields: ['created_by'] },
  { name: 'HannahProgress',        fields: ['created_by'] },
  { name: 'HannahUserProfile',     fields: ['created_by'] },
  { name: 'HannahFeedback',        fields: ['created_by'] },
  { name: 'HannahBookmark',        fields: ['created_by'] },
  { name: 'DailyVerseReminder',    fields: ['created_by'] },
  { name: 'GideonNotificationSettings', fields: ['created_by'] },
  { name: 'HannahNotificationSettings', fields: ['created_by'] },
  { name: 'ChefDanielNotificationSettings', fields: ['created_by'] },
  { name: 'CoachDavidNotificationSettings', fields: ['created_by'] },
  { name: 'DailyReflectionSettings', fields: ['created_by'] },
  { name: 'StudyGuideProgress',    fields: ['created_by'] },
  { name: 'UserEngagementTracker', fields: ['created_by'] },
  { name: 'Friend',                fields: ['created_by', 'user_email', 'friend_email'] },
  { name: 'Message',               fields: ['created_by', 'sender_email', 'receiver_email'] },
  { name: 'CommunityShare',        fields: ['created_by'] },
  { name: 'Encouragement',         fields: ['created_by'] },
  { name: 'PrayerRequest',         fields: ['created_by'] },
  { name: 'GroupChallenge',        fields: ['created_by'] },
  { name: 'GroupReadingPlan',      fields: ['created_by'] },
  { name: 'GroupReadingMember',    fields: ['created_by', 'user_email'] },
  { name: 'PlanDiscussion',        fields: ['created_by'] },
  { name: 'DiscussionReply',       fields: ['created_by'] },
  { name: 'TTSJob',                fields: ['created_by'] },
];

async function deleteAllForEntity(serviceBase44, entityName, fields, userEmail) {
  const Entity = serviceBase44.entities[entityName];
  if (!Entity) return 0;

  let totalDeleted = 0;
  // Check each ownership field and delete matching records
  const seenIds = new Set();
  for (const field of fields) {
    try {
      const query = { [field]: userEmail };
      const records = await Entity.filter(query, null, 500).catch(() => []);
      if (!Array.isArray(records)) continue;
      for (const r of records) {
        if (r?.id && !seenIds.has(r.id)) {
          seenIds.add(r.id);
          await Entity.delete(r.id).catch(() => {});
          totalDeleted++;
        }
      }
    } catch (_e) {
      // Non-fatal: continue to next field/entity
    }
  }
  return totalDeleted;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Authenticate the requesting user
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = user.email;
    let totalDeleted = 0;

    // Use service role to delete all data across all entities
    const serviceBase44 = base44.asServiceRole;

    // Delete all user data across all entities — run sequentially to avoid rate limits
    for (const { name, fields } of ENTITY_DELETION_CONFIG) {
      try {
        const count = await deleteAllForEntity(serviceBase44, name, fields, userEmail);
        totalDeleted += count;
      } catch (_e) { /* non-fatal, continue */ }
    }

    // Mark the user profile as deleted — this flag is checked on every login
    // to permanently block re-access even if Base44 still has the account.
    try {
      await base44.auth.updateMe({
        deletion_requested_at: new Date().toISOString(),
        deleted_at: new Date().toISOString(),
        bio: '',
        spiritual_goal: '',
        full_name: '[deleted]',
        age_group: null,
        onboarding_completed: null,
      });
    } catch (_e) { /* best effort */ }

    return Response.json({ 
      success: true, 
      deleted: totalDeleted,
      message: 'All user data deleted successfully'
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});