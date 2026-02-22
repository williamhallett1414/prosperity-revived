import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const today = new Date().toISOString().split('T')[0];

    const allSettings = await base44.asServiceRole.entities.ChefDanielNotificationSettings.list();
    const usersToNotify = allSettings.filter(s => 
      s.evening_enabled && s.last_evening_sent !== today
    );

    const eveningTips = [
      {
        greeting: "Evening wisdom:",
        tip: "Finish your dish with fresh herbs or a splash of acid — it makes even simple meals taste restaurant-ready.",
        question: "What are you cooking tonight?"
      },
      {
        greeting: "Hey!",
        tip: "Don't eat dinner right before bed — give your body 2-3 hours to digest for better sleep and gut health.",
        question: "How do you feel after dinner tonight?"
      },
      {
        greeting: "Quick prep tip:",
        tip: "Pre-portion tomorrow's breakfast tonight — it removes decision fatigue and sets you up to win.",
        question: "What can you prep now for an easier tomorrow?"
      },
      {
        greeting: "Daniel here:",
        tip: "Clean as you go — a tidy kitchen keeps you calm and makes cooking feel less overwhelming.",
        question: "What kitchen habit would make cooking more enjoyable for you?"
      },
      {
        greeting: "Evening reflection:",
        tip: "Chew slowly, taste intentionally — digestion starts in your mouth, not your stomach.",
        question: "How can you be more present during your next meal?"
      }
    ];

    const randomTip = eveningTips[Math.floor(Math.random() * eveningTips.length)];

    let notificationsSent = 0;

    for (const settings of usersToNotify) {
      const message = `🌙 ${randomTip.greeting}\n\n${randomTip.tip}\n\n${randomTip.question}`;

      await base44.asServiceRole.entities.Notification.create({
        created_by: settings.created_by,
        title: "Chef Daniel's Evening Tip",
        message: message,
        type: "info",
        read: false
      });

      await base44.asServiceRole.entities.ChefDanielNotificationSettings.update(settings.id, {
        last_evening_sent: today
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