import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const middayGreetings = [
  {
    message: "Take a breath. God is with you in the middle of your day just as much as the beginning.",
    question: "What do you need His peace for right now?"
  },
  {
    message: "Pause for a moment. You're not behind — you're exactly where God can meet you with clarity and strength.",
    question: "What decision or situation needs God's wisdom right now?"
  },
  {
    message: "Midday check-in: You're not alone in the chaos. God is your anchor, your clarity, your calm.",
    question: "What stress or worry can you release to Him right now?"
  },
  {
    message: "The day isn't over yet. You still have time to walk in purpose, speak with grace, and trust God's timing.",
    question: "What shift in perspective would help you finish strong?"
  },
  {
    message: "Refocus. God's plan for you hasn't changed just because the day got busy. He's still leading, still providing.",
    question: "Where do you sense God redirecting your focus today?"
  }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const allSettings = await base44.asServiceRole.entities.GideonNotificationSettings.list();
    const today = new Date().toISOString().split('T')[0];
    
    for (const settings of allSettings) {
      if (!settings.midday_enabled || settings.last_midday_sent === today) {
        continue;
      }
      
      const greeting = middayGreetings[Math.floor(Math.random() * middayGreetings.length)];
      
      await base44.asServiceRole.entities.Notification.create({
        user_email: settings.created_by,
        title: "Midday Moment with Gideon ☀️",
        message: `${greeting.message}\n\n${greeting.question}`,
        type: "gideon_greeting",
        read: false
      });
      
      await base44.asServiceRole.entities.GideonNotificationSettings.update(settings.id, {
        last_midday_sent: today
      });
    }
    
    return Response.json({ success: true, count: allSettings.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});