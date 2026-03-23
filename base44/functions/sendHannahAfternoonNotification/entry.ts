import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const today = new Date().toISOString().split('T')[0];

    // Get all users with afternoon notifications enabled
    const allSettings = await base44.asServiceRole.entities.HannahNotificationSettings.list();
    
    const eligibleSettings = allSettings.filter(settings => 
      settings.afternoon_enabled && settings.last_afternoon_sent !== today
    );

    const afternoonNotifications = [
      {
        title: "You're Doing Better Than You Think 💪",
        message: "The afternoon slump is real, but so is your resilience. What's one challenge you've already overcome today? How does that shift your perspective?",
        theme: "resilience"
      },
      {
        title: "Reframe It 🔄",
        message: "What feels hard right now? Now ask: What's the opportunity here? What can this teach me? How can I grow from this?",
        theme: "reframing"
      },
      {
        title: "Energy Check 🔋",
        message: "Are you running on fumes or still energized? What would restore your energy right now — movement, connection, rest, or a win?",
        theme: "energy_awareness"
      },
      {
        title: "Motivation Boost ⚡",
        message: "Remember why you started today. What does success look like for the next few hours? You've got this.",
        theme: "motivation"
      },
      {
        title: "You're Stronger Than Your Struggle 🌟",
        message: "Grit isn't about not struggling — it's about persisting anyway. What do you want to accomplish in the next 2 hours?",
        theme: "resilience"
      },
      {
        title: "Shift Your Lens 🎨",
        message: "One setback doesn't erase your progress. What's one thing that went right today? How can you build on that momentum?",
        theme: "reframing"
      },
      {
        title: "Feel Your Progress 📈",
        message: "You're halfway (or past halfway) through. What's one win — big or small — that you can acknowledge right now?",
        theme: "motivation"
      },
      {
        title: "Notice Your Resilience 🏔️",
        message: "You've been challenged today and you're still here. What does that tell you about who you are becoming?",
        theme: "resilience"
      }
    ];

    // Select a random notification
    const randomNotification = afternoonNotifications[Math.floor(Math.random() * afternoonNotifications.length)];
    let sentCount = 0;

    // Send notification to each eligible user
    for (const settings of eligibleSettings) {
      try {
        // Create notification
        await base44.asServiceRole.entities.Notification.create({
          type: "hannah_mindset",
          category: "afternoon",
          title: randomNotification.title,
          message: randomNotification.message,
          theme: randomNotification.theme,
          created_by: settings.created_by,
          read: false
        });

        // Update last_afternoon_sent
        await base44.asServiceRole.entities.HannahNotificationSettings.update(settings.id, {
          last_afternoon_sent: today
        });

        sentCount++;
      } catch (error) {
        console.error(`Failed to send notification to ${settings.created_by}:`, error.message);
      }
    }

    return Response.json({
      success: true,
      sent_count: sentCount,
      notification: randomNotification
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});