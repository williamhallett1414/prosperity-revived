import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { current_message, recent_context } = await req.json();

    if (!current_message) {
      return Response.json({ error: 'current_message is required' }, { status: 400 });
    }

    // Fetch all past conversations (limit to last 500 messages for performance)
    const allMessages = await base44.entities.GideonConversation.filter(
      { created_by: user.email },
      '-created_date',
      500
    );

    if (allMessages.length === 0) {
      return Response.json({ relevant_memories: [], memory_summary: null });
    }

    // Use LLM to identify relevant past conversations
    const memoryAnalysisPrompt = `You are a memory retrieval system for Gideon, a spiritual guide. 

CURRENT USER MESSAGE: "${current_message}"

RECENT CONVERSATION CONTEXT (last few messages):
${recent_context || 'None'}

PAST CONVERSATION HISTORY (oldest to newest):
${allMessages.map((msg, idx) => 
  `[${idx + 1}] ${msg.role === 'user' ? 'User' : 'Gideon'} (${new Date(msg.created_date).toLocaleDateString()}): ${msg.content.substring(0, 200)}${msg.content.length > 200 ? '...' : ''}`
).join('\n')}

TASK: Analyze the past conversation history and identify the most relevant previous messages that should be recalled for context.

Look for:
1. **Recurring themes** or topics the user keeps coming back to
2. **Breakthroughs or insights** that were particularly meaningful
3. **Emotional patterns** that relate to the current message
4. **Spiritual themes** that connect (identity, purpose, trust, healing, etc.)
5. **Personal details** or situations the user has shared
6. **Prayer requests** or ongoing struggles
7. **Growth areas** or goals mentioned

Return a JSON object with:
{
  "relevant_message_indices": [list of message indices from the history that are most relevant, max 10],
  "memory_summary": "A brief 2-3 sentence summary of the most important context from past conversations that Gideon should remember right now",
  "connection_points": ["Brief point 1", "Brief point 2", "Brief point 3"] (max 5 key connections to reference)
}`;

    const memoryAnalysis = await base44.integrations.Core.InvokeLLM({
      prompt: memoryAnalysisPrompt,
      response_json_schema: {
        type: "object",
        properties: {
          relevant_message_indices: {
            type: "array",
            items: { type: "number" }
          },
          memory_summary: {
            type: "string"
          },
          connection_points: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    });

    // Retrieve the relevant messages
    const relevantMessages = memoryAnalysis.relevant_message_indices
      .map(idx => allMessages[idx - 1])
      .filter(msg => msg);

    return Response.json({
      relevant_memories: relevantMessages,
      memory_summary: memoryAnalysis.memory_summary,
      connection_points: memoryAnalysis.connection_points,
      total_conversation_count: allMessages.length
    });

  } catch (error) {
    console.error('Memory retrieval error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});