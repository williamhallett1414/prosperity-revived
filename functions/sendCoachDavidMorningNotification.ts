import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userName = user.full_name?.split(' ')[0] || '';

    const morningPrompts = [
      "What's ONE discipline you'll practice today that'll move you closer to your goal?",
      "How will you show up for yourself today? What's your non-negotiable?",
      "What obstacle might try to derail you today? How will you overcome it?",
      "Who are you becoming through this fitness journey? What does that person do today?",
      "What's your biggest win going to be today? How will you earn it?"
    ];

    const morningInsights = [
      "Discipline is doing what needs to be done, even when you don't feel like it. That's where champions are made.",
      "Your morning sets the tone for your whole day. How you start is how you finish.",
      "Identity-based fitness beats goal-based fitness. You're not working out—you're becoming someone unstoppable.",
      "Progressive overload isn't just about weight. It's about consistency, intensity, and mental toughness.",
      "Your body responds to what you believe about yourself. Believe you're strong. Train like it."
    ];

    const randomInsight = morningInsights[Math.floor(Math.random() * morningInsights.length)];
    const randomQuestion = morningPrompts[Math.floor(Math.random() * morningPrompts.length)];

    const message = `🔥 MORNING FIRE, ${userName.toUpperCase()}! 💪\n\nYour day is yours to own. Let's build something today.\n\n💡 ${randomInsight}\n\n❓ ${randomQuestion}\n\nLet's go.`;

    // Send notification via email
    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject: `💪 Coach David: Morning Discipline Reminder`,
      body: message
    });

    return Response.json({ success: true, message });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});