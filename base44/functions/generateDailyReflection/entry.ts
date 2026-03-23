import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get all users with daily reflection enabled
    const allSettings = await base44.asServiceRole.entities.DailyReflectionSettings.list();
    const today = new Date().toISOString().split('T')[0];
    
    for (const settings of allSettings) {
      if (!settings.enabled) continue;
      if (settings.last_reflection_sent === today) continue;
      
      const userEmail = settings.created_by;
      
      // Get user's recent conversations and spiritual journey
      const recentConversations = await base44.asServiceRole.entities.GideonConversation.filter(
        { created_by: userEmail },
        '-created_date',
        50
      );
      
      const userEngagement = await base44.asServiceRole.entities.UserEngagementTracker.filter(
        { created_by: userEmail }
      );
      
      const engagement = userEngagement[0];
      
      // Get recent reflections to avoid repetition
      const recentReflections = await base44.asServiceRole.entities.GideonDailyReflection.filter(
        { created_by: userEmail },
        '-created_date',
        10
      );
      
      // Generate personalized reflection prompt
      const prompt = `You are Gideon, a spiritual mentor creating a daily reflection prompt for this user.

USER'S SPIRITUAL JOURNEY CONTEXT:
${engagement ? `
- Current engagement level: ${engagement.engagement_level}
- Recent emotional tones: ${engagement.emotional_tone_history?.join(', ') || 'None'}
- Spiritual themes explored: ${engagement.spiritual_theme_history?.join(', ') || 'None'}
- Current streak: ${engagement.current_streak} days
` : 'New user, no engagement data yet'}

RECENT CONVERSATION HIGHLIGHTS:
${recentConversations.length > 0 ? recentConversations.slice(0, 10).map(conv => 
  `- ${conv.role === 'user' ? 'User' : 'Gideon'}: ${conv.content.substring(0, 150)}... (Theme: ${conv.spiritual_theme || 'general'})`
).join('\n') : 'No recent conversations'}

RECENT REFLECTION QUESTIONS (avoid repeating these themes):
${recentReflections.map(r => `- ${r.reflection_question} (Theme: ${r.spiritual_theme})`).join('\n') || 'None'}

CREATE A DAILY REFLECTION PROMPT:

Requirements:
1. Generate ONE powerful ICF-aligned reflection question that:
   - Builds on their recent spiritual themes
   - Matches their emotional tone patterns
   - Encourages deeper self-discovery
   - Is open-ended and thought-provoking
   - Avoids repeating recent themes

2. Suggest a relevant scripture that connects to the question

3. Provide a brief context note (1-2 sentences) explaining why this question matters for their journey right now

Return JSON:
{
  "reflection_question": "The ICF-aligned question",
  "spiritual_theme": "The main theme (identity/purpose/trust/healing/growth/etc)",
  "scripture_suggestion": "Book Chapter:Verse",
  "context_note": "Why this matters now"
}`;

      const reflection = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            reflection_question: { type: "string" },
            spiritual_theme: { type: "string" },
            scripture_suggestion: { type: "string" },
            context_note: { type: "string" }
          }
        }
      });
      
      // Create the daily reflection
      await base44.asServiceRole.entities.GideonDailyReflection.create({
        created_by: userEmail,
        reflection_question: reflection.reflection_question,
        spiritual_theme: reflection.spiritual_theme,
        scripture_suggestion: reflection.scripture_suggestion,
        context_note: reflection.context_note,
        date: today,
        completed: false
      });
      
      // Create notification
      await base44.asServiceRole.entities.Notification.create({
        created_by: userEmail,
        title: "🌟 Daily Reflection from Gideon",
        message: `${reflection.reflection_question}\n\nScripture: ${reflection.scripture_suggestion}`,
        type: "reflection",
        read: false
      });
      
      // Update settings
      await base44.asServiceRole.entities.DailyReflectionSettings.update(settings.id, {
        last_reflection_sent: today
      });
    }
    
    return Response.json({ 
      success: true, 
      processed: allSettings.filter(s => s.enabled && s.last_reflection_sent !== today).length 
    });
    
  } catch (error) {
    console.error('Daily reflection error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});