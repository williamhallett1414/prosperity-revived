import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const today = new Date().toISOString().split('T')[0];

    const allSettings = await base44.asServiceRole.entities.ChefDanielNotificationSettings.list();
    const usersToNotify = allSettings.filter(s => 
      s.afternoon_enabled && s.last_afternoon_sent !== today
    );

    const afternoonTips = [
      {
        greeting: "Afternoon reminder:",
        tip: "If your pan isn't hot enough to make you nervous, it's not hot enough to sear. Let it heat properly before adding food.",
        question: "What dish are you planning to cook later?"
      },
      {
        greeting: "Chef tip:",
        tip: "Pat your protein dry before cooking — moisture is the enemy of a good crust.",
        question: "What technique do you want to master this week?"
      },
      {
        greeting: "Quick prep tip:",
        tip: "Pull meat from the fridge 20 minutes before cooking — room temp = even cooking, better texture.",
        question: "What can you prep now to make dinner easier?"
      },
      {
        greeting: "Hey!",
        tip: "Garlic burns fast — add it after onions have softened, not at the same time.",
        question: "What flavor mistake have you learned from recently?"
      },
      {
        greeting: "Daniel here:",
        tip: "Rest your meat after cooking — it redistributes the juices and makes every bite tender and juicy.",
        question: "What small technique change could elevate your cooking tonight?"
      }
    ];

    const randomTip = afternoonTips[Math.floor(Math.random() * afternoonTips.length)];

    let notificationsSent = 0;

    for (const settings of usersToNotify) {
      const message = `🔥 ${randomTip.greeting}\n\n${randomTip.tip}\n\n${randomTip.question}`;

      await base44.asServiceRole.entities.Notification.create({
        created_by: settings.created_by,
        title: "Chef Daniel's Cooking Tip",
        message: message,
        type: "info",
        read: false
      });

      await base44.asServiceRole.entities.ChefDanielNotificationSettings.update(settings.id, {
        last_afternoon_sent: today
      });

      notificationsSent++;
    }

    return Response.json({
      success: true,
      notificationsSent,
      tip: randomTip
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});