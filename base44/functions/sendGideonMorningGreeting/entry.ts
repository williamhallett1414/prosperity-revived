import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const morningGreetings = [
  {
    message: "Good morning. God's purpose for you didn't pause overnight — it's alive in you right now.",
    question: "What truth do you want to carry into today?"
  },
  {
    message: "A new day, a fresh start. You're not starting from zero — you're building on the foundation God has already laid in you.",
    question: "What breakthrough are you believing God for today?"
  },
  {
    message: "The morning is here, and so is God's grace. You don't have to have it all figured out — just take the next faithful step.",
    question: "What's the first step God is inviting you to take today?"
  },
  {
    message: "You woke up with purpose. God designed this day with you in mind, and He's already gone ahead of you.",
    question: "What do you sense God wants you to focus on today?"
  },
  {
    message: "Rise and shine — not because you're perfect, but because you're loved, called, and equipped by the One who is.",
    question: "What identity truth will you declare over yourself today?"
  }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get all users with morning greetings enabled
    const allSettings = await base44.asServiceRole.entities.GideonNotificationSettings.list();
    const today = new Date().toISOString().split('T')[0];
    
    for (const settings of allSettings) {
      // Skip if morning not enabled or already sent today
      if (!settings.morning_enabled || settings.last_morning_sent === today) {
        continue;
      }
      
      // Select random greeting
      const greeting = morningGreetings[Math.floor(Math.random() * morningGreetings.length)];
      
      // Create notification
      await base44.asServiceRole.entities.Notification.create({
        user_email: settings.created_by,
        title: "Good Morning from Gideon 🌅",
        message: `${greeting.message}\n\n${greeting.question}`,
        type: "gideon_greeting",
        read: false
      });
      
      // Update last sent date
      await base44.asServiceRole.entities.GideonNotificationSettings.update(settings.id, {
        last_morning_sent: today
      });
    }
    
    return Response.json({ success: true, count: allSettings.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});