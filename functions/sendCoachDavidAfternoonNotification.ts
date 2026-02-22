import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userName = user.full_name?.split(' ')[0] || '';

    const afternoonPrompts = [
      "Did you hit your workout today? If not, what stopped you? If yes, how do you feel?",
      "You've got power left in the tank. What's one more thing you can accomplish?",
      "Who are you proving something to today? Yourself or someone else? Let that drive you.",
      "What's the hardest part coming up? How will you break through it?",
      "How badly do you want this? Your actions today are the answer. What are they saying?"
    ];

    const afternoonInsights = [
      "The afternoon is where champions separate from everyone else. Most people quit. You won't.",
      "Your motivation is tied to your identity. You're not working out—you're becoming the person you know you can be.",
      "Accountability breeds consistency. Consistency breeds transformation. Stay honest with yourself.",
      "Plateaus aren't failures—they're signals. Your body is asking for something new. Listen.",
      "The pain of discipline is way less than the pain of regret. Choose discipline."
    ];

    const randomInsight = afternoonInsights[Math.floor(Math.random() * afternoonInsights.length)];
    const randomQuestion = afternoonPrompts[Math.floor(Math.random() * afternoonPrompts.length)];

    const message = `🔥 AFTERNOON PUSH, ${userName}!\n\nTime to dig deep. You've got this.\n\n💡 ${randomInsight}\n\n❓ ${randomQuestion}\n\nFinish strong.`;

    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject: `🔥 Coach David: Afternoon Accountability Push`,
      body: message
    });

    return Response.json({ success: true, message });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});