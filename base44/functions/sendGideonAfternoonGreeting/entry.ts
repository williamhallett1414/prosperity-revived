import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const afternoonGreetings = [
  {
    message: "You're not running on empty — grace is fueling you.",
    question: "What's one thing you want God to help you finish well?"
  },
  {
    message: "Afternoon strength check: You have everything you need through Christ. His power shows up strongest when you feel weakest.",
    question: "What challenge needs His strength right now?"
  },
  {
    message: "Keep going. The finish line isn't as far as it feels, and God's grace is carrying you further than your own effort ever could.",
    question: "What would perseverance look like in this moment?"
  },
  {
    message: "You don't have to be strong on your own. God's strength is made perfect in your weakness, and His grace is sufficient for this moment.",
    question: "Where do you need to lean into God's strength rather than your own?"
  },
  {
    message: "The afternoon isn't about perfection — it's about progress. God celebrates every faithful step you take.",
    question: "What progress, no matter how small, can you acknowledge today?"
  }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const allSettings = await base44.asServiceRole.entities.GideonNotificationSettings.list();
    const today = new Date().toISOString().split('T')[0];
    
    for (const settings of allSettings) {
      if (!settings.afternoon_enabled || settings.last_afternoon_sent === today) {
        continue;
      }
      
      const greeting = afternoonGreetings[Math.floor(Math.random() * afternoonGreetings.length)];
      
      await base44.asServiceRole.entities.Notification.create({
        user_email: settings.created_by,
        title: "Afternoon Grace from Gideon 💪",
        message: `${greeting.message}\n\n${greeting.question}`,
        type: "gideon_greeting",
        read: false
      });
      
      await base44.asServiceRole.entities.GideonNotificationSettings.update(settings.id, {
        last_afternoon_sent: today
      });
    }
    
    return Response.json({ success: true, count: allSettings.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});