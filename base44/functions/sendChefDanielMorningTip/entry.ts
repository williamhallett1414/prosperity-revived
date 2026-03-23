import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const today = new Date().toISOString().split('T')[0];

    // Get all users with morning notifications enabled
    const allSettings = await base44.asServiceRole.entities.ChefDanielNotificationSettings.list();
    const usersToNotify = allSettings.filter(s => 
      s.morning_enabled && s.last_morning_sent !== today
    );

    const morningTips = [
      {
        greeting: "Good morning!",
        tip: "Add a squeeze of lemon to your eggs or greens — it brightens flavor and boosts absorption of iron.",
        question: "What breakfast are you thinking about today?"
      },
      {
        greeting: "Rise and shine!",
        tip: "Pre-chop veggies the night before — it makes morning cooking stress-free and sets you up for success.",
        question: "What's one small thing you can prep tonight to make tomorrow easier?"
      },
      {
        greeting: "Hey there!",
        tip: "Start your day with protein — it stabilizes blood sugar and keeps you satisfied until lunch.",
        question: "How do you want to feel after breakfast today?"
      },
      {
        greeting: "Morning!",
        tip: "Toast your spices in a dry pan for 30 seconds — it wakes up their oils and transforms the flavor.",
        question: "What flavors are you craving this morning?"
      },
      {
        greeting: "Good morning, chef!",
        tip: "Greek yogurt + berries + nuts = instant balanced breakfast. Protein, antioxidants, and healthy fats in one bowl.",
        question: "What quick, nutritious breakfast can you make in under 5 minutes?"
      }
    ];

    const randomTip = morningTips[Math.floor(Math.random() * morningTips.length)];

    let notificationsSent = 0;

    for (const settings of usersToNotify) {
      const message = `🍳 ${randomTip.greeting}\n\n${randomTip.tip}\n\n${randomTip.question}`;

      await base44.asServiceRole.entities.Notification.create({
        created_by: settings.created_by,
        title: "Chef Daniel's Morning Tip",
        message: message,
        type: "info",
        read: false
      });

      await base44.asServiceRole.entities.ChefDanielNotificationSettings.update(settings.id, {
        last_morning_sent: today
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