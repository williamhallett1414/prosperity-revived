import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const notificationTemplates = {
  low_engagement_24h: [
    {
      message: "God hasn't forgotten you — He's holding you steady.",
      question: "What truth do you want to lean on today?"
    },
    {
      message: "Even when you're quiet, God is still speaking. He's waiting to meet you in His Word.",
      question: "What's keeping you from connecting with Scripture today?"
    },
    {
      message: "Grace doesn't take breaks — it's waiting for you right where you are.",
      question: "What would it look like to give yourself a few minutes with God today?"
    }
  ],
  low_engagement_48h: [
    {
      message: "You're missed. God's Word is here whenever you're ready — no pressure, just presence.",
      question: "What's one thing you need to hear from God right now?"
    },
    {
      message: "Life gets busy. But even 5 minutes in Scripture can shift your whole day.",
      question: "What's stirring in your heart that God wants to speak to?"
    }
  ],
  low_engagement_72h: [
    {
      message: "It's been a few days. God hasn't moved — He's still right here, ready to walk with you.",
      question: "What would make it easier to reconnect with Scripture today?"
    },
    {
      message: "No shame, no guilt — just an open door. God's Word is waiting to refresh your spirit.",
      question: "What truth do you need to be reminded of today?"
    }
  ],
  high_engagement: [
    {
      message: "You've been leaning into purpose lately. That's not random — God is drawing you deeper.",
      question: "What step do you feel God nudging you toward?"
    },
    {
      message: "You're building something strong. Your hunger for God's Word is planting seeds of transformation.",
      question: "What's stirring in your spirit today?"
    },
    {
      message: "Your consistency is creating momentum. God is using this season to shape you.",
      question: "What breakthrough are you sensing on the horizon?"
    }
  ],
  emotional_discouraged: [
    {
      message: "I hear you. When the weight feels heavy, remember — God carries what you can't.",
      question: "What burden can you release to Him right now?"
    },
    {
      message: "Discouragement isn't the end of the story. God is writing a chapter of breakthrough even now.",
      question: "What truth about God's character do you need to hold onto today?"
    }
  ],
  emotional_anxious: [
    {
      message: "God is closer than your worries. His peace isn't waiting for the problem to be solved — it's available now.",
      question: "What do you need His peace for right now?"
    },
    {
      message: "Anxiety doesn't have the final word. God's promises are louder and more certain.",
      question: "What promise of God can you declare over this anxiety?"
    }
  ],
  emotional_hopeful: [
    {
      message: "Hope is rising in you — that's the Holy Spirit stirring. Keep leaning in.",
      question: "What's fueling this hope you're feeling?"
    },
    {
      message: "You're sensing God's movement. This is the beginning of something good.",
      question: "What step of faith is God inviting you to take in this hopeful season?"
    }
  ],
  spiritual_purpose: [
    {
      message: "Purpose isn't a distant destination — it's alive in you right now. God placed it there.",
      question: "What truth about your purpose is becoming clearer?"
    },
    {
      message: "You're not searching for purpose — you're uncovering what God already designed in you.",
      question: "What gift or calling is God highlighting in this season?"
    }
  ],
  spiritual_identity: [
    {
      message: "Your identity isn't based on performance — it's rooted in whose you are.",
      question: "What truth about who God says you are stands out today?"
    },
    {
      message: "God doesn't see what you've done — He sees who you are in Christ. Let that truth settle in.",
      question: "How does knowing your identity in Christ shift your perspective today?"
    }
  ],
  spiritual_trust: [
    {
      message: "Trust isn't easy, but God has never failed you. He's not starting now.",
      question: "What area of your life is God inviting you to trust Him with more deeply?"
    },
    {
      message: "When you can't see the path, trust the One who does. God's got you.",
      question: "What would it look like to surrender this to God today?"
    }
  ],
  streak_maintained: [
    {
      message: "You're showing up. That consistency is building something powerful in your spirit.",
      question: "What transformation are you noticing in yourself?"
    },
    {
      message: "Your streak isn't just about numbers — it's about faithfulness. Keep going.",
      question: "What's motivating you to stay consistent right now?"
    }
  ],
  streak_broken: [
    {
      message: "Streaks are nice, but grace is better. You're not starting over — you're continuing forward.",
      question: "What's one small step you can take to reconnect today?"
    },
    {
      message: "A broken streak doesn't define you. God's mercy is new every morning — including this one.",
      question: "What would it look like to give yourself grace and begin again?"
    }
  ],
  deep_study_user: [
    {
      message: "You're hungry for depth. God honors that. There's more revelation waiting for you.",
      question: "What passage is God drawing you to dive deeper into?"
    },
    {
      message: "Deep study unlocks kingdom principles. You're not just reading — you're being transformed.",
      question: "What insight from Scripture is reshaping how you see yourself or God?"
    }
  ]
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get all users with personalized notifications enabled
    const allSettings = await base44.asServiceRole.entities.GideonNotificationSettings.list();
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    
    for (const settings of allSettings) {
      if (!settings.personalized_notifications_enabled) continue;
      
      const userEmail = settings.created_by;
      
      // Get or create engagement tracker
      let tracker = await base44.asServiceRole.entities.UserEngagementTracker.filter({
        created_by: userEmail
      });
      
      if (tracker.length === 0) continue; // No tracker means new user
      
      tracker = tracker[0];
      const lastActive = new Date(tracker.last_active_date);
      const hoursSinceActive = (now - lastActive) / (1000 * 60 * 60);
      
      // LOW ENGAGEMENT (24-72 hours)
      if (hoursSinceActive >= 24 && tracker.last_low_engagement_notification !== today) {
        let template;
        if (hoursSinceActive >= 72) {
          template = notificationTemplates.low_engagement_72h[
            Math.floor(Math.random() * notificationTemplates.low_engagement_72h.length)
          ];
        } else if (hoursSinceActive >= 48) {
          template = notificationTemplates.low_engagement_48h[
            Math.floor(Math.random() * notificationTemplates.low_engagement_48h.length)
          ];
        } else {
          template = notificationTemplates.low_engagement_24h[
            Math.floor(Math.random() * notificationTemplates.low_engagement_24h.length)
          ];
        }
        
        await base44.asServiceRole.entities.Notification.create({
          user_email: userEmail,
          title: "Gideon is thinking of you 💭",
          message: `${template.message}\n\n${template.question}`,
          type: "gideon_personalized",
          read: false
        });
        
        await base44.asServiceRole.entities.UserEngagementTracker.update(tracker.id, {
          last_low_engagement_notification: today
        });
      }
      
      // HIGH ENGAGEMENT (5+ sessions in last 3 days)
      if (tracker.engagement_level === 'high' && tracker.last_high_engagement_notification !== today) {
        const template = notificationTemplates.high_engagement[
          Math.floor(Math.random() * notificationTemplates.high_engagement.length)
        ];
        
        await base44.asServiceRole.entities.Notification.create({
          user_email: userEmail,
          title: "Gideon sees your growth 🌱",
          message: `${template.message}\n\n${template.question}`,
          type: "gideon_personalized",
          read: false
        });
        
        await base44.asServiceRole.entities.UserEngagementTracker.update(tracker.id, {
          last_high_engagement_notification: today
        });
      }
      
      // EMOTIONAL TONE PATTERNS
      if (tracker.emotional_tone_history && tracker.emotional_tone_history.length > 0) {
        const recentTone = tracker.emotional_tone_history[tracker.emotional_tone_history.length - 1];
        
        if (recentTone === 'discouraged' && notificationTemplates.emotional_discouraged) {
          const template = notificationTemplates.emotional_discouraged[
            Math.floor(Math.random() * notificationTemplates.emotional_discouraged.length)
          ];
          
          await base44.asServiceRole.entities.Notification.create({
            user_email: userEmail,
            title: "God sees you 👁️",
            message: `${template.message}\n\n${template.question}`,
            type: "gideon_personalized",
            read: false
          });
        } else if (recentTone === 'anxious' && notificationTemplates.emotional_anxious) {
          const template = notificationTemplates.emotional_anxious[
            Math.floor(Math.random() * notificationTemplates.emotional_anxious.length)
          ];
          
          await base44.asServiceRole.entities.Notification.create({
            user_email: userEmail,
            title: "Peace is here ☮️",
            message: `${template.message}\n\n${template.question}`,
            type: "gideon_personalized",
            read: false
          });
        } else if (recentTone === 'hopeful' && notificationTemplates.emotional_hopeful) {
          const template = notificationTemplates.emotional_hopeful[
            Math.floor(Math.random() * notificationTemplates.emotional_hopeful.length)
          ];
          
          await base44.asServiceRole.entities.Notification.create({
            user_email: userEmail,
            title: "Hope is rising ✨",
            message: `${template.message}\n\n${template.question}`,
            type: "gideon_personalized",
            read: false
          });
        }
      }
      
      // SPIRITUAL THEMES
      if (tracker.spiritual_theme_history && tracker.spiritual_theme_history.length > 0) {
        const recentTheme = tracker.spiritual_theme_history[tracker.spiritual_theme_history.length - 1];
        
        if (recentTheme === 'purpose' && notificationTemplates.spiritual_purpose) {
          const template = notificationTemplates.spiritual_purpose[
            Math.floor(Math.random() * notificationTemplates.spiritual_purpose.length)
          ];
          
          await base44.asServiceRole.entities.Notification.create({
            user_email: userEmail,
            title: "Your purpose is alive 🎯",
            message: `${template.message}\n\n${template.question}`,
            type: "gideon_personalized",
            read: false
          });
        } else if (recentTheme === 'identity' && notificationTemplates.spiritual_identity) {
          const template = notificationTemplates.spiritual_identity[
            Math.floor(Math.random() * notificationTemplates.spiritual_identity.length)
          ];
          
          await base44.asServiceRole.entities.Notification.create({
            user_email: userEmail,
            title: "Know who you are 👑",
            message: `${template.message}\n\n${template.question}`,
            type: "gideon_personalized",
            read: false
          });
        } else if (recentTheme === 'trust' && notificationTemplates.spiritual_trust) {
          const template = notificationTemplates.spiritual_trust[
            Math.floor(Math.random() * notificationTemplates.spiritual_trust.length)
          ];
          
          await base44.asServiceRole.entities.Notification.create({
            user_email: userEmail,
            title: "Trust the journey 🛤️",
            message: `${template.message}\n\n${template.question}`,
            type: "gideon_personalized",
            read: false
          });
        }
      }
      
      // STREAK NOTIFICATIONS
      if (tracker.current_streak >= 7 && tracker.last_streak_notification !== today) {
        const template = notificationTemplates.streak_maintained[
          Math.floor(Math.random() * notificationTemplates.streak_maintained.length)
        ];
        
        await base44.asServiceRole.entities.Notification.create({
          user_email: userEmail,
          title: `${tracker.current_streak} day streak! 🔥`,
          message: `${template.message}\n\n${template.question}`,
          type: "gideon_personalized",
          read: false
        });
        
        await base44.asServiceRole.entities.UserEngagementTracker.update(tracker.id, {
          last_streak_notification: today
        });
      } else if (tracker.streak_broken_date === today) {
        const template = notificationTemplates.streak_broken[
          Math.floor(Math.random() * notificationTemplates.streak_broken.length)
        ];
        
        await base44.asServiceRole.entities.Notification.create({
          user_email: userEmail,
          title: "Grace over perfection 💙",
          message: `${template.message}\n\n${template.question}`,
          type: "gideon_personalized",
          read: false
        });
      }
      
      // DEEP STUDY MODE USERS
      if (tracker.deep_study_count >= 5 && tracker.engagement_level === 'high') {
        const template = notificationTemplates.deep_study_user[
          Math.floor(Math.random() * notificationTemplates.deep_study_user.length)
        ];
        
        await base44.asServiceRole.entities.Notification.create({
          user_email: userEmail,
          title: "Going deeper 📚",
          message: `${template.message}\n\n${template.question}`,
          type: "gideon_personalized",
          read: false
        });
      }
    }
    
    return Response.json({ success: true, message: 'Personalized notifications sent' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});