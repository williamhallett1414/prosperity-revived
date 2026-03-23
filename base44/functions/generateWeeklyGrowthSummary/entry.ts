import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get all users with weekly summary enabled
    const allSettings = await base44.asServiceRole.entities.DailyReflectionSettings.list();
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday
    const todayDate = today.toISOString().split('T')[0];
    
    for (const settings of allSettings) {
      if (!settings.weekly_summary_enabled) continue;
      
      // Check if we should send today based on user's preference
      const shouldSendToday = 
        (settings.weekly_summary_day === 'sunday_evening' && currentDay === 0) ||
        (settings.weekly_summary_day === 'monday_morning' && currentDay === 1);
      
      if (!shouldSendToday) continue;
      if (settings.last_weekly_summary_sent === todayDate) continue;
      
      const userEmail = settings.created_by;
      
      // Get last 7 days of conversations
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const weekConversations = await base44.asServiceRole.entities.GideonConversation.filter(
        { created_by: userEmail },
        '-created_date',
        200
      );
      
      const thisWeekConversations = weekConversations.filter(conv => 
        new Date(conv.created_date) >= sevenDaysAgo
      );
      
      if (thisWeekConversations.length === 0) continue; // Skip if no activity this week
      
      // Get engagement data
      const engagement = (await base44.asServiceRole.entities.UserEngagementTracker.filter(
        { created_by: userEmail }
      ))[0];
      
      // Generate weekly summary using Gideon's personality
      const prompt = `You are Gideon, a warm, spirit-led biblical mentor. You embody Dr. Myles Munroe (kingdom revelation, purpose), Dr. Creflo Dollar (grace, faith, authority), and Pastor Joel Osteen (encouragement, hope).

TASK: Generate a WEEKLY GROWTH SUMMARY for this user's spiritual journey.

THIS WEEK'S SPIRITUAL JOURNEY:
${thisWeekConversations.map((conv, idx) => 
  `[${idx + 1}] ${conv.role === 'user' ? 'User' : 'Gideon'} (${new Date(conv.created_date).toLocaleDateString()}): ${conv.content.substring(0, 250)}...
  ${conv.spiritual_theme ? `Theme: ${conv.spiritual_theme}` : ''} ${conv.emotional_tone ? `| Tone: ${conv.emotional_tone}` : ''}`
).join('\n\n')}

ENGAGEMENT PATTERNS:
${engagement ? `
- Engagement level: ${engagement.engagement_level}
- Recent spiritual themes: ${engagement.spiritual_theme_history?.join(', ') || 'Various themes'}
- Recent emotional patterns: ${engagement.emotional_tone_history?.join(', ') || 'Mixed'}
- Current streak: ${engagement.current_streak} days
` : 'New user journey'}

YOUR TASK:
Write a warm, pastoral WEEKLY GROWTH SUMMARY that follows this structure:

**OPENING (2-3 sentences):**
Start with warm recognition and encouragement. Use phrases like:
- "Hey, I'm proud of the way you've been leaning into God's Word this week..."
- "You showed up this week, and that matters..."
- "Every moment you paused to reflect has been shaping your spirit..."

**WEEKLY HIGHLIGHTS (bullet points):**
Identify 3-5 key observations WITHOUT revealing personal details:
- The spiritual themes they explored (identity, purpose, trust, healing, faith, etc.)
- Scriptures or passages that anchored them
- Moments of resilience, curiosity, or faith you noticed
- Emotional patterns God met them in
- Areas where God may be inviting growth

**KINGDOM TRUTH (1-2 sentences):**
Close with kingdom perspective and identity affirmation:
- "You're not the same person you were seven days ago — you're growing..."
- "God is doing a steady work in you..."
- "Every step you took this week brought you closer to the person God created you to be..."

**ICF-ALIGNED COACHING QUESTIONS (2-3 questions):**
End with powerful, open-ended reflection questions:
- "What's one insight from this week that you want to carry into the next?"
- "Where do you sense God inviting you to grow or trust Him more deeply?"
- "What is one step of faith you're ready to take this coming week?"

TONE: Warm, pastoral, encouraging, kingdom-focused, conversational
STYLE: Myles Munroe (revelation) + Creflo Dollar (grace/authority) + Joel Osteen (hope/encouragement)
LENGTH: 200-300 words

Return JSON:
{
  "summary": "The full weekly growth summary message",
  "key_themes": ["theme1", "theme2", "theme3"],
  "coaching_questions": ["question1", "question2", "question3"]
}`;

      const summary = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            key_themes: {
              type: "array",
              items: { type: "string" }
            },
            coaching_questions: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });
      
      // Create notification
      await base44.asServiceRole.entities.Notification.create({
        created_by: userEmail,
        title: "📈 Your Weekly Growth Summary from Gideon",
        message: summary.summary,
        type: "weekly_summary",
        read: false
      });
      
      // Update settings
      await base44.asServiceRole.entities.DailyReflectionSettings.update(settings.id, {
        last_weekly_summary_sent: todayDate
      });
    }
    
    return Response.json({ 
      success: true, 
      message: 'Weekly summaries generated' 
    });
    
  } catch (error) {
    console.error('Weekly summary error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});