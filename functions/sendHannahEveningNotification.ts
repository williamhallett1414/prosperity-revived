import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const today = new Date().toISOString().split('T')[0];

    // Get all users with evening notifications enabled
    const allSettings = await base44.asServiceRole.entities.HannahNotificationSettings.list();
    
    const eligibleSettings = allSettings.filter(settings => 
      settings.evening_enabled && settings.last_evening_sent !== today
    );

    const eveningNotifications = [
      {
        title: "You Made It 🌙",
        message: "Another day in the books. Before you rest, what's one small win you want to acknowledge? You showed up. That matters.",
        theme: "reflection_gratitude"
      },
      {
        title: "Grateful Tonight 🙏",
        message: "What's one thing that went right today? One person you appreciated? One moment of calm? Write it down or just notice it.",
        theme: "gratitude"
      },
      {
        title: "Self-Compassion Moment 💛",
        message: "You did your best with what you had today. What's one way you can show yourself kindness tonight? What do you need?",
        theme: "self_compassion"
      },
      {
        title: "Reflect & Release 🌊",
        message: "What did today teach you? What do you want to let go of as you wind down? What are you proud of?",
        theme: "reflection"
      },
      {
        title: "Process Today 📝",
        message: "Emotions need space to be felt and released. What came up today? What do you need to process before sleep?",
        theme: "emotional_processing"
      },
      {
        title: "Celebrate Yourself 🌟",
        message: "You showed up. You persisted. You handled challenges. What's one way you proved your resilience today?",
        theme: "gratitude"
      },
      {
        title: "Compassion for You 💚",
        message: "Did you mess up? That's okay. Did you feel overwhelmed? That's human. What does your future self want to tell your current self?",
        theme: "self_compassion"
      },
      {
        title: "Tomorrow's Fresh Start ✨",
        message: "Today is done. You get to start fresh tomorrow. Before sleep, what's one intention you want to carry into tomorrow?",
        theme: "reflection_gratitude"
      }
    ];

    // Select a random notification
    const randomNotification = eveningNotifications[Math.floor(Math.random() * eveningNotifications.length)];
    let sentCount = 0;

    // Send notification to each eligible user
    for (const settings of eligibleSettings) {
      try {
        // Create notification
        await base44.asServiceRole.entities.Notification.create({
          type: "hannah_mindset",
          category: "evening",
          title: randomNotification.title,
          message: randomNotification.message,
          theme: randomNotification.theme,
          created_by: settings.created_by,
          read: false
        });

        // Update last_evening_sent
        await base44.asServiceRole.entities.HannahNotificationSettings.update(settings.id, {
          last_evening_sent: today
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