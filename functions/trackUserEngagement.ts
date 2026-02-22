import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { action, data } = await req.json();
    
    // Get or create engagement tracker
    let tracker = await base44.entities.UserEngagementTracker.filter({
      created_by: user.email
    });
    
    const now = new Date().toISOString();
    const today = now.split('T')[0];
    
    if (tracker.length === 0) {
      // Create new tracker
      tracker = await base44.entities.UserEngagementTracker.create({
        last_active_date: now,
        total_sessions: 1,
        deep_study_count: 0,
        quick_ask_count: 0,
        emotional_tone_history: [],
        spiritual_theme_history: [],
        current_streak: 1,
        longest_streak: 1,
        engagement_level: 'moderate'
      });
    } else {
      tracker = tracker[0];
      
      const lastActive = new Date(tracker.last_active_date);
      const lastActiveDate = lastActive.toISOString().split('T')[0];
      
      // Calculate streak
      const daysSinceActive = Math.floor((new Date(today) - new Date(lastActiveDate)) / (1000 * 60 * 60 * 24));
      let currentStreak = tracker.current_streak;
      let streakBrokenDate = tracker.streak_broken_date;
      
      if (daysSinceActive === 0) {
        // Same day - keep streak
      } else if (daysSinceActive === 1) {
        // Next day - increment streak
        currentStreak += 1;
      } else {
        // Streak broken
        streakBrokenDate = today;
        currentStreak = 1;
      }
      
      const longestStreak = Math.max(tracker.longest_streak, currentStreak);
      
      // Update tracker based on action
      const updates = {
        last_active_date: now,
        total_sessions: tracker.total_sessions + 1,
        current_streak: currentStreak,
        longest_streak: longestStreak,
        streak_broken_date: streakBrokenDate
      };
      
      if (action === 'deep_study') {
        updates.deep_study_count = tracker.deep_study_count + 1;
      } else if (action === 'quick_ask') {
        updates.quick_ask_count = tracker.quick_ask_count + 1;
      }
      
      // Track emotional tone
      if (data?.emotional_tone) {
        const toneHistory = tracker.emotional_tone_history || [];
        toneHistory.push(data.emotional_tone);
        updates.emotional_tone_history = toneHistory.slice(-10); // Keep last 10
      }
      
      // Track spiritual theme
      if (data?.spiritual_theme) {
        const themeHistory = tracker.spiritual_theme_history || [];
        themeHistory.push(data.spiritual_theme);
        updates.spiritual_theme_history = themeHistory.slice(-10); // Keep last 10
      }
      
      // Determine engagement level (sessions in last 3 days)
      const recentSessions = tracker.total_sessions;
      if (recentSessions < 3) {
        updates.engagement_level = 'low';
      } else if (recentSessions < 10) {
        updates.engagement_level = 'moderate';
      } else {
        updates.engagement_level = 'high';
      }
      
      // Determine preferred time of day
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) {
        updates.preferred_time_of_day = 'morning';
      } else if (hour >= 12 && hour < 17) {
        updates.preferred_time_of_day = 'midday';
      } else if (hour >= 17 && hour < 21) {
        updates.preferred_time_of_day = 'evening';
      }
      
      await base44.entities.UserEngagementTracker.update(tracker.id, updates);
    }
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});