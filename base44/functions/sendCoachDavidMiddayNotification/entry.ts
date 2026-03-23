import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userName = user.full_name?.split(' ')[0] || '';

    const middayPrompts = [
      "How much water have you had? Hydration is performance. Stay ahead.",
      "Your body needs movement right now. Even 5 minutes counts. What'll you do?",
      "How's your energy? Fuel up smart. What's next?",
      "Midday slump hitting? Get moving. A quick walk, stretch, or mobility work resets everything.",
      "You're halfway through. Are you winning or are you sliding? What's the next move?"
    ];

    const middayInsights = [
      "Hydration directly affects strength, endurance, and mental clarity. Your performance is only as good as your water intake.",
      "Movement in the middle of your day breaks plateaus in energy and productivity. Don't sit all day.",
      "The discipline you build in small moments is the discipline that shows up in big moments.",
      "Recovery isn't something you do after—it's something you do during. Stay proactive.",
      "Your midday choices compound. What you do now echoes into tonight and tomorrow."
    ];

    const randomInsight = middayInsights[Math.floor(Math.random() * middayInsights.length)];
    const randomQuestion = middayPrompts[Math.floor(Math.random() * middayPrompts.length)];

    const message = `⚡ MIDDAY CHECK-IN, ${userName}!\n\nYou're halfway through. Let's stay sharp.\n\n💡 ${randomInsight}\n\n❓ ${randomQuestion}\n\nKeeP that momentum going.`;

    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject: `⚡ Coach David: Midday Movement Check`,
      body: message
    });

    return Response.json({ success: true, message });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});