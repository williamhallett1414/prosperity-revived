import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { emotionalPatterns, recentConversations } = body;

    if (!emotionalPatterns || emotionalPatterns.length === 0) {
      return Response.json({
        exercises: [],
        insights: 'Not enough data yet to suggest personalized exercises.'
      });
    }

    const conversationContext = recentConversations
      .map(c => `${c.role === 'user' ? 'User' : 'Hannah'}: ${c.content}`)
      .join('\n');

    const prompt = `Based on this user's emotional patterns and recent conversations, suggest 2-3 personalized exercises to address their core struggles.

Emotional patterns (most frequent): ${emotionalPatterns.join(', ')}

Recent conversation excerpts:
${conversationContext}

For each exercise, provide:
1. Exercise name
2. Why it's relevant to their patterns
3. Step-by-step instructions (3-5 steps)
4. Expected outcome

Format as JSON with structure: { exercises: [{ name, relevance, steps: [], outcome }], keyInsight: "..." }`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          exercises: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                relevance: { type: 'string' },
                steps: { type: 'array', items: { type: 'string' } },
                outcome: { type: 'string' }
              }
            }
          },
          keyInsight: { type: 'string' }
        }
      }
    });

    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});