import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get all users with monthly report enabled
    const allSettings = await base44.asServiceRole.entities.DailyReflectionSettings.list();
    const today = new Date();
    const currentDay = today.getDate();
    const todayDate = today.toISOString().split('T')[0];
    
    // Only run on the 1st of each month
    if (currentDay !== 1) {
      return Response.json({ message: 'Not first of month, skipping' });
    }
    
    for (const settings of allSettings) {
      if (!settings.monthly_report_enabled) continue;
      if (settings.last_monthly_report_sent === todayDate) continue;
      
      const userEmail = settings.created_by;
      
      // Get last 30 days of conversations
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const monthConversations = await base44.asServiceRole.entities.GideonConversation.filter(
        { created_by: userEmail },
        '-created_date',
        500
      );
      
      const thisMonthConversations = monthConversations.filter(conv => 
        new Date(conv.created_date) >= thirtyDaysAgo
      );
      
      if (thisMonthConversations.length === 0) continue; // Skip if no activity this month
      
      // Get engagement data
      const engagement = (await base44.asServiceRole.entities.UserEngagementTracker.filter(
        { created_by: userEmail }
      ))[0];
      
      // Generate monthly report using Gideon's personality
      const prompt = `You are Gideon, a warm, spirit-led biblical mentor. You embody Dr. Myles Munroe (kingdom revelation, purpose), Dr. Creflo Dollar (grace, faith, authority), and Pastor Joel Osteen (encouragement, hope).

TASK: Generate a MONTHLY SPIRITUAL PROGRESS REPORT for this user.

THIS MONTH'S SPIRITUAL JOURNEY (Last 30 Days):
${thisMonthConversations.slice(0, 100).map((conv, idx) => 
  `[${idx + 1}] ${conv.role === 'user' ? 'User' : 'Gideon'} (${new Date(conv.created_date).toLocaleDateString()}): ${conv.content.substring(0, 200)}...
  ${conv.spiritual_theme ? `Theme: ${conv.spiritual_theme}` : ''} ${conv.emotional_tone ? `| Tone: ${conv.emotional_tone}` : ''}`
).join('\n\n')}

MONTHLY ENGAGEMENT PATTERNS:
${engagement ? `
- Overall engagement: ${engagement.engagement_level}
- Total sessions this month: ~${Math.min(thisMonthConversations.length / 2, 50)}
- Spiritual themes explored: ${engagement.spiritual_theme_history?.join(', ') || 'Various'}
- Emotional journey: ${engagement.emotional_tone_history?.join(', ') || 'Mixed patterns'}
- Current streak: ${engagement.current_streak} days
- Longest streak: ${engagement.longest_streak} days
` : 'Beginning of spiritual journey'}

YOUR TASK:
Write a powerful, reflective MONTHLY PROGRESS REPORT that follows this structure:

**OPENING (2-3 sentences):**
Begin with deep recognition and celebration:
- "You've completed another month of walking with God, and I want you to pause and recognize how far you've come..."
- "Spiritual growth isn't always loud — sometimes it's the quiet shifts..."
- "You showed up this month in ways that matter to Heaven..."

**MONTHLY GROWTH HIGHLIGHTS (bullet points):**
Identify 5-7 key observations WITHOUT revealing personal details:
- The spiritual themes they explored deeply
- The questions that shaped their growth
- The scriptures that anchored them
- The emotional patterns God met them in
- The steps of faith they took
- The areas where their confidence in Christ grew
- Breakthrough moments or shifts in perspective

**KINGDOM REVELATION (2-3 sentences):**
Offer Myles Munroe-style kingdom insight about their growth:
- Original design and purpose being revealed
- Identity in Christ being strengthened
- Kingdom authority being activated

**GRACE & AUTHORITY (1-2 sentences):**
Add Creflo Dollar-style grace perspective:
- How grace empowered their journey
- The spiritual authority they're walking in

**HOPE & VISION (1-2 sentences):**
Close with Joel Osteen-style encouragement:
- "God is doing a quiet, steady work in you — and it's beautiful to see..."
- "Your best days are still ahead..."
- "You're positioned for breakthrough in this next season..."

**ICF-ALIGNED COACHING QUESTIONS (3 powerful questions):**
End with deep, forward-focused reflection questions:
- "What's one area of growth from this month that you want to build on?"
- "What is God stirring in your heart for the month ahead?"
- "How do you want to show up spiritually in this next season?"

TONE: Pastoral, celebratory, kingdom-focused, grace-empowered, hopeful
STYLE: Deeper than weekly — more reflective, more revelatory
LENGTH: 300-400 words

Return JSON:
{
  "report": "The full monthly progress report message",
  "key_themes": ["theme1", "theme2", "theme3", "theme4"],
  "growth_areas": ["area1", "area2", "area3"],
  "coaching_questions": ["question1", "question2", "question3"]
}`;

      const report = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            report: { type: "string" },
            key_themes: {
              type: "array",
              items: { type: "string" }
            },
            growth_areas: {
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
        title: "🌟 Your Monthly Spiritual Progress Report",
        message: report.report,
        type: "monthly_report",
        read: false
      });
      
      // Update settings
      await base44.asServiceRole.entities.DailyReflectionSettings.update(settings.id, {
        last_monthly_report_sent: todayDate
      });
    }
    
    return Response.json({ 
      success: true, 
      message: 'Monthly reports generated' 
    });
    
  } catch (error) {
    console.error('Monthly report error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});