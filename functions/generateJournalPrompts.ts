import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { mood, emotionalTone, recentEntries } = body;

    const entriesContext = recentEntries
      .slice(0, 3)
      .map(e => e.content)
      .join('\n---\n');

    const prompt = `Generate 3 guided journaling prompts for someone with:
- Current mood: ${mood}/10
- Emotional tone: ${emotionalTone}
${entriesContext ? `- Recent journal themes: ${entriesContext}` : ''}

Create prompts that:
1. Are specific to their emotional state (not generic)
2. Deepen self-awareness and reflection
3. Help them process emotions healthily
4. Connect to potential growth or patterns

Format as JSON: { prompts: [{ prompt: "...", purpose: "..." }, ...] }`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          prompts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                prompt: { type: 'string' },
                purpose: { type: 'string' }
              }
            }
          }
        }
      }
    });

    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});