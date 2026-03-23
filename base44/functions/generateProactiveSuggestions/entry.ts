import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get all users with proactive suggestions enabled
    const allSettings = await base44.asServiceRole.entities.DailyReflectionSettings.list();
    const today = new Date().toISOString().split('T')[0];
    
    for (const settings of allSettings) {
      if (!settings.proactive_suggestions_enabled) continue;
      
      // Check frequency
      const lastSent = settings.last_suggestion_sent ? new Date(settings.last_suggestion_sent) : null;
      const daysSinceLastSuggestion = lastSent ? 
        Math.floor((new Date() - lastSent) / (1000 * 60 * 60 * 24)) : 999;
      
      const frequencyMap = { daily: 1, every_3_days: 3, weekly: 7 };
      const requiredDays = frequencyMap[settings.suggestion_frequency || 'every_3_days'];
      
      if (daysSinceLastSuggestion < requiredDays) continue;
      
      const userEmail = settings.created_by;
      
      // Analyze user's spiritual journey
      const conversations = await base44.asServiceRole.entities.GideonConversation.filter(
        { created_by: userEmail },
        '-created_date',
        100
      );
      
      if (conversations.length === 0) continue; // Skip users with no conversation history
      
      const engagement = (await base44.asServiceRole.entities.UserEngagementTracker.filter(
        { created_by: userEmail }
      ))[0];
      
      // Get existing suggestions to avoid repetition
      const existingSuggestions = await base44.asServiceRole.entities.GideonProactiveSuggestion.filter(
        { created_by: userEmail },
        '-created_date',
        20
      );
      
      // Generate AI-driven proactive suggestions
      const prompt = `You are Gideon, a spiritual mentor providing proactive guidance WITHOUT being asked.

ANALYZE THE USER'S SPIRITUAL JOURNEY:

Recent Conversations (last 100 messages):
${conversations.map((conv, idx) => 
  `[${idx + 1}] ${conv.role === 'user' ? 'User' : 'Gideon'} (${new Date(conv.created_date).toLocaleDateString()}): ${conv.content.substring(0, 200)}...
  Theme: ${conv.spiritual_theme || 'N/A'} | Tone: ${conv.emotional_tone || 'N/A'}`
).join('\n\n')}

User Engagement Profile:
${engagement ? `
- Engagement: ${engagement.engagement_level}
- Recent emotional patterns: ${engagement.emotional_tone_history?.join(', ') || 'None'}
- Spiritual themes: ${engagement.spiritual_theme_history?.join(', ') || 'None'}
- Current streak: ${engagement.current_streak} days
` : 'Limited data'}

Recent Suggestions Already Sent (avoid repeating):
${existingSuggestions.map(s => `- ${s.title} (Theme: ${s.spiritual_theme})`).join('\n') || 'None'}

YOUR TASK: Generate 1-2 PROACTIVE, TIMELY suggestions that would genuinely help them RIGHT NOW.

Look for:
1. **Unresolved themes** they keep coming back to
2. **Growth opportunities** based on patterns you see
3. **Encouragement** for consistent areas or struggles
4. **Scripture** that speaks directly to their journey
5. **Next steps** in their spiritual growth

Types of suggestions:
- "scripture": A timely, relevant Bible verse with brief insight
- "reflection": A gentle prompt to think deeper about a recurring theme
- "encouragement": Affirmation of their growth or a word of hope
- "prayer_prompt": A specific prayer focus based on their needs

Return JSON array (1-2 suggestions max):
[
  {
    "suggestion_type": "scripture|reflection|encouragement|prayer_prompt",
    "title": "Short, warm title",
    "content": "The main suggestion (2-4 sentences, conversational, personal)",
    "scripture_reference": "Book Chapter:Verse (if applicable)",
    "spiritual_theme": "The theme being addressed",
    "based_on_context": "Brief note on why this is timely (1 sentence)"
  }
]`;

      const suggestions = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  suggestion_type: { type: "string" },
                  title: { type: "string" },
                  content: { type: "string" },
                  scripture_reference: { type: "string" },
                  spiritual_theme: { type: "string" },
                  based_on_context: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      // Create suggestions and notifications
      for (const suggestion of suggestions.suggestions || []) {
        await base44.asServiceRole.entities.GideonProactiveSuggestion.create({
          created_by: userEmail,
          ...suggestion,
          read: false
        });
        
        await base44.asServiceRole.entities.Notification.create({
          created_by: userEmail,
          title: `💡 ${suggestion.title}`,
          message: suggestion.content,
          type: "gideon_insight",
          read: false
        });
      }
      
      // Update settings
      await base44.asServiceRole.entities.DailyReflectionSettings.update(settings.id, {
        last_suggestion_sent: today
      });
    }
    
    return Response.json({ success: true, message: 'Proactive suggestions generated' });
    
  } catch (error) {
    console.error('Proactive suggestion error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});