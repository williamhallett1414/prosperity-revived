import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const eveningGreetings = [
  {
    message: "Slow down and reflect. God has been faithful today.",
    question: "What moment are you grateful for?"
  },
  {
    message: "Evening grace: You don't have to carry today's worries into tomorrow. God's mercies are new every morning.",
    question: "What do you need to release to God before you rest?"
  },
  {
    message: "Take inventory of today. Not to judge yourself, but to see where God showed up — because He did.",
    question: "Where did you sense God's presence or provision today?"
  },
  {
    message: "The day is done, and so is the pressure to be perfect. God's love for you didn't waver once today.",
    question: "What truth about God's character stood out to you today?"
  },
  {
    message: "Rest isn't weakness — it's trust. God's got tomorrow handled. Tonight, just breathe and be grateful.",
    question: "What are you thanking God for as this day closes?"
  }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const allSettings = await base44.asServiceRole.entities.GideonNotificationSettings.list();
    const today = new Date().toISOString().split('T')[0];
    
    for (const settings of allSettings) {
      if (!settings.evening_enabled || settings.last_evening_sent === today) {
        continue;
      }
      
      const greeting = eveningGreetings[Math.floor(Math.random() * eveningGreetings.length)];
      
      await base44.asServiceRole.entities.Notification.create({
        user_email: settings.created_by,
        title: "Evening Reflection with Gideon 🌙",
        message: `${greeting.message}\n\n${greeting.question}`,
        type: "gideon_greeting",
        read: false
      });
      
      await base44.asServiceRole.entities.GideonNotificationSettings.update(settings.id, {
        last_evening_sent: today
      });
    }
    
    return Response.json({ success: true, count: allSettings.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});