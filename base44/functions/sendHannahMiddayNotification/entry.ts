import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const today = new Date().toISOString().split('T')[0];

    // Get all users with midday notifications enabled
    const allSettings = await base44.asServiceRole.entities.HannahNotificationSettings.list();
    
    const eligibleSettings = allSettings.filter(settings => 
      settings.midday_enabled && settings.last_midday_sent !== today
    );

    const middayNotifications = [
      {
        title: "Midday Check-In ☀️",
        message: "Pause for a moment. How are you feeling right now? Stressed? Energized? What's one thing you can do in the next 10 minutes to reset your nervous system?",
        theme: "stress_checkin"
      },
      {
        title: "Breathe & Reset 🌬️",
        message: "Your body holds the stress of your morning. Take 3 deep breaths. What would help you shift from react mode to respond mode right now?",
        theme: "emotional_regulation"
      },
      {
        title: "Emotional Check ❤️",
        message: "Name the emotion you're feeling right now without judgment. Is it energy? Overwhelm? Calm? What does your emotional weather tell you about what you need?",
        theme: "stress_checkin"
      },
      {
        title: "Productivity Reset 🔄",
        message: "You've made it halfway. Let go of the morning and choose your top 3 priorities for the afternoon. What matters most right now?",
        theme: "productivity_reset"
      },
      {
        title: "Mind & Body Check 🧘‍♀️",
        message: "Are you racing ahead or grounded in the present? Take one minute to notice your body. How can you regulate yourself right now?",
        theme: "emotional_regulation"
      },
      {
        title: "Stress Awareness 🎯",
        message: "Is your stress a signal or sabotage? What's one thing you can control right now, and what do you need to let go of?",
        theme: "stress_checkin"
      },
      {
        title: "Respond, Don't React 💫",
        message: "Midday is when patterns kick in. What's one moment today where you reacted instead of responded? What would responding look like?",
        theme: "emotional_regulation"
      },
      {
        title: "Recalibrate 🎨",
        message: "The afternoon is still ahead of you. What's one small shift you can make to feel more aligned with your goals?",
        theme: "productivity_reset"
      }
    ];

    // Select a random notification
    const randomNotification = middayNotifications[Math.floor(Math.random() * middayNotifications.length)];
    let sentCount = 0;

    // Send notification to each eligible user
    for (const settings of eligibleSettings) {
      try {
        // Create notification
        await base44.asServiceRole.entities.Notification.create({
          type: "hannah_mindset",
          category: "midday",
          title: randomNotification.title,
          message: randomNotification.message,
          theme: randomNotification.theme,
          created_by: settings.created_by,
          read: false
        });

        // Update last_midday_sent
        await base44.asServiceRole.entities.HannahNotificationSettings.update(settings.id, {
          last_midday_sent: today
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