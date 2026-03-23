import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const today = new Date().toISOString().split('T')[0];

    const allSettings = await base44.asServiceRole.entities.ChefDanielNotificationSettings.list();
    const usersToNotify = allSettings.filter(s => 
      s.midday_enabled && s.last_midday_sent !== today
    );

    const middayTips = [
      {
        greeting: "Lunch time!",
        tip: "Add fermented foods like kimchi or sauerkraut to your lunch — your gut microbiome will thank you.",
        question: "What are you having for lunch today?"
      },
      {
        greeting: "Hey there!",
        tip: "Leftovers taste better when you add one fresh element — herbs, a squeeze of citrus, or a sprinkle of cheese.",
        question: "What can you add to make your lunch more exciting?"
      },
      {
        greeting: "Quick tip:",
        tip: "Build your lunch around protein and fiber — it'll keep your energy steady all afternoon.",
        question: "How do you want to feel after lunch?"
      },
      {
        greeting: "Midday reminder:",
        tip: "Don't skip lunch to 'save calories' — it crashes your metabolism and makes you overeat later.",
        question: "What balanced lunch can you enjoy guilt-free?"
      },
      {
        greeting: "Chef Daniel here:",
        tip: "A drizzle of good olive oil on your salad or soup isn't indulgent — it's essential for absorbing fat-soluble vitamins.",
        question: "What healthy fats are you including in your meals today?"
      }
    ];

    const randomTip = middayTips[Math.floor(Math.random() * middayTips.length)];

    let notificationsSent = 0;

    for (const settings of usersToNotify) {
      const message = `🥗 ${randomTip.greeting}\n\n${randomTip.tip}\n\n${randomTip.question}`;

      await base44.asServiceRole.entities.Notification.create({
        created_by: settings.created_by,
        title: "Chef Daniel's Lunch Tip",
        message: message,
        type: "info",
        read: false
      });

      await base44.asServiceRole.entities.ChefDanielNotificationSettings.update(settings.id, {
        last_midday_sent: today
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