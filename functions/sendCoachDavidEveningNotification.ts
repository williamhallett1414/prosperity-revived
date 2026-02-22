import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userName = user.full_name?.split(' ')[0] || '';

    const eveningPrompts = [
      "Did you earn your rest today? Reflect on what you accomplished and what's next.",
      "What's one win from today you're celebrating? Own it.",
      "Tomorrow starts now. What will you do differently? What will you do better?",
      "Your recovery is part of the training. How will you honor your body tonight?",
      "What did you learn about yourself today? How does that shape tomorrow?"
    ];

    const eveningInsights = [
      "Recovery isn't weakness—it's strategy. Your muscles grow in sleep. Prioritize it.",
      "Reflection is where growth happens. What you learn today compounds into tomorrow's results.",
      "Rest and intensity are partners, not enemies. One without the other doesn't work.",
      "Your sleep quality directly impacts your strength, recovery, and mental clarity. Protect it.",
      "Consistency compounds. Every day of showing up is a brick in the foundation of who you're becoming."
    ];

    const randomInsight = eveningInsights[Math.floor(Math.random() * eveningInsights.length)];
    const randomQuestion = eveningPrompts[Math.floor(Math.random() * eveningPrompts.length)];

    const message = `😴 EVENING RECOVERY, ${userName}!\n\nYou showed up today. Be proud of that.\n\n💡 ${randomInsight}\n\n❓ ${randomQuestion}\n\nRest well. Tomorrow, we go again. 💪`;

    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject: `😴 Coach David: Evening Recovery & Reflection`,
      body: message
    });

    return Response.json({ success: true, message });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});