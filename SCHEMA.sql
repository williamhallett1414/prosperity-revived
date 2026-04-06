-- ═══════════════════════════════════════════════════════════════
-- Prosperity Revived — Database Schema
-- Generated: 2026-04-05
-- Platform: Base44 (mapped to PostgreSQL for DrawDB)
-- All tables include auto-generated: id, created_by, created_date
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE "ChallengeParticipant" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "completed_days" JSONB,
  "challenge_id" TEXT,
  "status" TEXT,
  "user_email" VARCHAR(255),
  "user_name" VARCHAR(255),
  "progress" INTEGER,
  "current_streak" INTEGER,
  "longest_streak" INTEGER,
  "total_check_ins" INTEGER,
  "daily_workouts_completed" JSONB,
  "total_minutes_trained" INTEGER,
  "calories_burned" INTEGER,
  "last_check_in_date" TEXT,
  "is_completed" TEXT,
  "current_progress" INTEGER,
  "progress_percentage" INTEGER,
  "progress_logs" JSONB
);

CREATE TABLE "GroupChallenge" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "title" TEXT,
  "description" TEXT,
  "challenge_type" TEXT,
  "emoji" TEXT,
  "gradient" TEXT,
  "duration_days" TEXT,
  "goal_value" INTEGER,
  "goal_unit" TEXT,
  "is_active" BOOLEAN,
  "status" TEXT,
  "participant_count" INTEGER,
  "reward_points" TEXT,
  "start_date" TEXT,
  "end_date" TEXT,
  "chatbot_facilitator" TEXT,
  "created_by_name" TEXT
);

CREATE TABLE "WorkoutPlan" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "times_copied" INTEGER,
  "is_shared" BOOLEAN,
  "share_code" TEXT,
  "creator_name" VARCHAR(255),
  "completed_dates" JSONB,
  "likes" TEXT,
  "title" TEXT,
  "description" TEXT,
  "difficulty" TEXT,
  "duration_minutes" TEXT,
  "exercises" TEXT,
  "category" TEXT,
  "image_url" TEXT
);

CREATE TABLE "WorkoutSession" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "workout_id" TEXT,
  "workout_name" TEXT,
  "date" TEXT,
  "duration_minutes" TEXT,
  "exercises_performed" TEXT,
  "name" TEXT,
  "feel" TEXT,
  "sets_completed" TEXT,
  "timed_completed_sets" INTEGER,
  "sets" JSONB,
  "reps" INTEGER,
  "weight" INTEGER,
  "workouts_completed" TEXT
);

CREATE TABLE "GroupReadingPlan" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "plan_id" TEXT,
  "plan_name" TEXT,
  "group_name" TEXT,
  "description" TEXT,
  "creator_email" VARCHAR(255),
  "creator_name" TEXT,
  "total_days" TEXT,
  "is_custom" TEXT,
  "custom_readings" TEXT,
  "start_date" TEXT,
  "is_private" TEXT,
  "invite_code" TEXT,
  "member_count" INTEGER
);

CREATE TABLE "HannahUserProfile" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "chatbot_name" TEXT,
  "memory_type" TEXT,
  "content" TEXT,
  "style" TEXT,
  "stage" TEXT,
  "goal" TEXT,
  "context" TEXT,
  "importance" INTEGER,
  "conversation_date" TIMESTAMP,
  "last_referenced" TIMESTAMP,
  "created_by" VARCHAR(255)
);

CREATE TABLE "JournalEntry" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "title" TEXT,
  "content" TEXT,
  "entry_type" TEXT,
  "tags" JSONB,
  "prompt" TEXT,
  "mood" TEXT,
  "suggested_practice" TEXT,
  "habits" TEXT,
  "duration" INTEGER,
  "created_date" TEXT
);

CREATE TABLE "UserProgress" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "total_points" INTEGER,
  "level" INTEGER,
  "badges" JSONB,
  "current_streak" INTEGER,
  "longest_streak" INTEGER,
  "friends_count" TEXT,
  "comments_count" TEXT,
  "messages_sent" TEXT,
  "photos_uploaded" TEXT,
  "last_active_date" TEXT
);

CREATE TABLE "ReadingPlanProgress" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "plan_id" TEXT,
  "plan_name" TEXT,
  "is_custom" BOOLEAN,
  "custom_readings" TEXT,
  "total_days" INTEGER,
  "completed_days" JSONB,
  "current_day" INTEGER,
  "started_date" TIMESTAMP,
  "current_streak" INTEGER,
  "longest_streak" INTEGER
);

CREATE TABLE "ChallengeParticipation" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "completed_days" JSONB,
  "current_day" INTEGER,
  "reflection_entries" JSONB,
  "last_check_in_date" TEXT,
  "current_streak" INTEGER,
  "longest_streak" INTEGER,
  "challenge_id" TEXT,
  "user_email" VARCHAR(255),
  "user_name" VARCHAR(255)
);

CREATE TABLE "Notification" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "notification" TEXT,
  "recipient_email" TEXT,
  "title" TEXT,
  "message" TEXT,
  "sender_email" TEXT,
  "sender_name" TEXT,
  "action_url" TEXT,
  "icon" TEXT,
  "is_read" BOOLEAN
);

CREATE TABLE "StudyGroup" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "member_count" INTEGER,
  "group_id" TEXT,
  "user_email" VARCHAR(255),
  "role" TEXT,
  "group" TEXT,
  "data" JSONB,
  "isLoading" TEXT,
  "queryFn" TEXT
);

CREATE TABLE "GideonNotificationSettings" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "morning_enabled" BOOLEAN,
  "midday_enabled" BOOLEAN,
  "afternoon_enabled" BOOLEAN,
  "evening_enabled" BOOLEAN,
  "verse_of_day_enabled" BOOLEAN,
  "weekly_checkin_enabled" BOOLEAN,
  "challenge_reminders_enabled" BOOLEAN,
  "growth_prompts_enabled" BOOLEAN
);

CREATE TABLE "SermonNote" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "title" TEXT,
  "speaker" TEXT,
  "date" TIMESTAMP,
  "scripture_reference" TEXT,
  "notes" TEXT,
  "key_points" JSONB,
  "action_items" JSONB,
  "audio_url" TEXT
);

CREATE TABLE "SpiritualGoal" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "title" TEXT,
  "description" TEXT,
  "category" TEXT,
  "frequency" TEXT,
  "target_date" TEXT,
  "status" TEXT,
  "completed_dates" JSONB,
  "progress" TEXT
);

CREATE TABLE "PrayerRequest" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "prayed_by" JSONB,
  "prayer_count" INTEGER,
  "comments" JSONB,
  "is_answered" BOOLEAN,
  "user_name" TEXT,
  "user_email" VARCHAR(255),
  "prayer_text" TEXT,
  "is_anonymous" TEXT
);

CREATE TABLE "HannahConversation" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "user_email" VARCHAR(255),
  "emotional_tone" TEXT,
  "conversation_session_id" TIMESTAMP,
  "mood_score" TEXT,
  "role" TEXT,
  "content" TEXT,
  "is_journal_entry" BOOLEAN
);

CREATE TABLE "ChatbotMemory" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "chatbot_name" TEXT,
  "last_referenced" TIMESTAMP,
  "memory_type" TEXT,
  "content" TEXT,
  "context" TEXT,
  "importance" INTEGER,
  "conversation_date" TIMESTAMP
);

CREATE TABLE "MealLog" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "date" TEXT,
  "meal_type" TEXT,
  "description" TEXT,
  "calories" TEXT,
  "notes" TEXT,
  "id" TEXT,
  "created_date" TIMESTAMP
);

CREATE TABLE "CommunityShare" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "encouragement_count" INTEGER,
  "user_display_name" TEXT,
  "share_type" TEXT,
  "title" TEXT,
  "content" TEXT,
  "chatbot_source" TEXT,
  "is_anonymous" TEXT
);

CREATE TABLE "Post" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "likes" INTEGER,
  "content" TEXT,
  "user_name" VARCHAR(255),
  "image_url" TEXT,
  "video_url" TEXT,
  "topic" TEXT,
  "group_id" TEXT
);

CREATE TABLE "GroupReadingMember" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "group_id" TEXT,
  "user_email" VARCHAR(255),
  "user_name" TEXT,
  "progress_id" TEXT,
  "share_progress" BOOLEAN,
  "role" TEXT,
  "joined_date" TIMESTAMP
);

CREATE TABLE "Bookmark" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "book" TEXT,
  "chapter" INTEGER,
  "verse" INTEGER,
  "verse_text" TEXT,
  "note" TEXT,
  "highlight_color" TEXT
);

CREATE TABLE "PlanDiscussion" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "group_id" TEXT,
  "day_number" TEXT,
  "user_email" VARCHAR(255),
  "user_name" TEXT,
  "reply_count" INTEGER,
  "likes" INTEGER
);

CREATE TABLE "GideonConversation" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "role" TEXT,
  "content" TEXT,
  "emotional_tone" TEXT,
  "spiritual_theme" TEXT,
  "session_id" TEXT
);

CREATE TABLE "Encouragement" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "share_id" TEXT,
  "encouragement_type" TEXT,
  "message" TEXT,
  "is_anonymous" BOOLEAN,
  "user_display_name" TEXT
);

CREATE TABLE "Friend" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "user_email" VARCHAR(255),
  "friend_email" TEXT,
  "user_name" VARCHAR(255),
  "friend_name" VARCHAR(255),
  "status" TEXT
);

CREATE TABLE "Comment" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "post_id" TEXT,
  "content" TEXT,
  "user_name" VARCHAR(255),
  "comments_count" TEXT,
  "likes" INTEGER
);

CREATE TABLE "HannahFeedback" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "user_email" TEXT,
  "message_content" TEXT,
  "feedback_type" TEXT,
  "conversation_session_id" TEXT,
  "was_exercise_suggestion" TEXT
);

CREATE TABLE "Meditation" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "title" TEXT,
  "duration_minutes" INTEGER,
  "script" TEXT,
  "category" TEXT,
  "completed_dates" TEXT
);

CREATE TABLE "Message" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "sender_email" VARCHAR(255),
  "receiver_email" TEXT,
  "sender_name" VARCHAR(255),
  "receiver_name" TEXT,
  "read" BOOLEAN
);

CREATE TABLE "BlogPost" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "title" TEXT,
  "author_name" TEXT,
  "is_published" BOOLEAN,
  "likes" INTEGER
);

CREATE TABLE "ChallengeCompletion" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "challenge_id" TEXT,
  "user_email" VARCHAR(255),
  "completion_date" TEXT,
  "bonus_points_earned" TEXT
);

CREATE TABLE "ChefDanielNotificationSettings" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "morning_enabled" BOOLEAN,
  "midday_enabled" BOOLEAN,
  "afternoon_enabled" BOOLEAN,
  "evening_enabled" BOOLEAN
);

CREATE TABLE "PrayerJournal" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "title" TEXT,
  "content" TEXT,
  "prayer_type" TEXT,
  "mood" TEXT
);

CREATE TABLE "RecipeCollection" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "name" TEXT,
  "description" TEXT,
  "recipe_ids" JSONB,
  "is_public" BOOLEAN
);

CREATE TABLE "GroupMember" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "role" TEXT,
  "group_id" TEXT,
  "user_email" VARCHAR(255)
);

CREATE TABLE "DiscussionReply" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "discussion_id" TEXT,
  "user_email" VARCHAR(255),
  "user_name" TEXT
);

CREATE TABLE "WaterLog" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "date" TEXT,
  "goal" INTEGER,
  "glasses" TEXT
);

CREATE TABLE "PlanNote" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "note" TEXT,
  "plan_id" TEXT,
  "day_number" TEXT
);

CREATE TABLE "StudyGuideNote" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "guide_id" TEXT,
  "subsection" TEXT
);

CREATE TABLE "GideonDailyReflection" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "response" TEXT,
  "completed" BOOLEAN
);

CREATE TABLE "GideonProactiveSuggestion" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "read" BOOLEAN,
  "helpful" BOOLEAN
);

CREATE TABLE "TTSJob" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "meditation_id" TEXT,
  "status" TEXT
);

CREATE TABLE "MeditationFavorite" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "meditation_id" TEXT,
  "meditation_title" TEXT
);

CREATE TABLE "RecipeLike" (
  "id" SERIAL PRIMARY KEY,
  "created_by" VARCHAR(255),
  "created_date" TIMESTAMP DEFAULT NOW(),
  "recipe_id" TEXT,
  "user_email" VARCHAR(255)
);

