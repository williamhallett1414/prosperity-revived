import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { conversations, journalEntries, period = 'week' } = body;

    const conversationSummary = conversations
      .map(c => `${c.role === 'user' ? 'User' : 'Hannah'}: ${c.content.substring(0, 100)}...`)
      .join('\n');

    const journalSummary = journalEntries
      .map(e => e.content.substring(0, 100))
      .join('\n');

    const prompt = `Generate a thoughtful progress summary for a user based on their ${period} of coaching conversations and journal entries.

Conversation highlights:
${conversationSummary}

Journal entries:
${journalSummary}

Create a summary that includes:
1. Key themes and patterns observed
2. Emotional growth or shifts noticed
3. Specific breakthroughs or insights
4. Gentle suggestions for continued growth
5. Affirmation of their journey

Be warm, encouraging, and specific. Use a supportive tone.

Format as JSON: { summary: "...", keyThemes: [...], breakthroughs: [...], nextSteps: [...] }`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          keyThemes: { type: 'array', items: { type: 'string' } },
          breakthroughs: { type: 'array', items: { type: 'string' } },
          nextSteps: { type: 'array', items: { type: 'string' } }
        }
      }
    });

    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});