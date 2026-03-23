import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const today = new Date().toISOString().split('T')[0];

    // Get all users with morning notifications enabled
    const allSettings = await base44.asServiceRole.entities.HannahNotificationSettings.list();
    
    const eligibleSettings = allSettings.filter(settings => 
      settings.morning_enabled && settings.last_morning_sent !== today
    );

    const morningNotifications = [
      {
        title: "Good Morning 🌅",
        message: "A small habit done consistently beats a big habit done occasionally. What's one tiny action you want to commit to today?",
        theme: "identity_intention"
      },
      {
        title: "Start Your Day Strong 💪",
        message: "Before you jump in, pause and ask: Who do I want to be today? How do I want to show up? Let that intention guide your day.",
        theme: "identity_intention"
      },
      {
        title: "Mindset Moment 🌱",
        message: "Your habits are the foundation of who you're becoming. What's one identity-based habit you're building? (\"I'm someone who...\") What would that person do today?",
        theme: "habit_formation"
      },
      {
        title: "Ground Yourself 🧘",
        message: "Before the day takes over, take 60 seconds to breathe deeply and feel your feet on the ground. What would it feel like to carry that calm throughout your day?",
        theme: "emotional_grounding"
      },
      {
        title: "Your Day, Your Design ✨",
        message: "You have the power to design your day. Instead of reacting to what comes, what's one intention you want to set that puts you in the driver's seat?",
        theme: "identity_intention"
      },
      {
        title: "Tiny Changes, Big Results 🎯",
        message: "1% better today is all you need. What's one small improvement you can make — in your routine, your thinking, or your actions?",
        theme: "habit_formation"
      },
      {
        title: "Center Yourself 💫",
        message: "Your nervous system sets the tone for everything that follows. How can you start today from a place of calm instead of chaos? What does that take?",
        theme: "emotional_grounding"
      },
      {
        title: "Identity Check-In 🪞",
        message: "What kind of person do you want to be? Now ask yourself: What would that version of you do in the next hour? Go do it.",
        theme: "identity_intention"
      }
    ];

    // Select a random notification
    const randomNotification = morningNotifications[Math.floor(Math.random() * morningNotifications.length)];
    let sentCount = 0;

    // Send notification to each eligible user
    for (const settings of eligibleSettings) {
      try {
        // Create notification
        await base44.asServiceRole.entities.Notification.create({
          type: "hannah_mindset",
          category: "morning",
          title: randomNotification.title,
          message: randomNotification.message,
          theme: randomNotification.theme,
          created_by: settings.created_by,
          read: false
        });

        // Update last_morning_sent
        await base44.asServiceRole.entities.HannahNotificationSettings.update(settings.id, {
          last_morning_sent: today
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