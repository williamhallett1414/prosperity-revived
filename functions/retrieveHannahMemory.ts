import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { limit = 50, summaryOnly = false } = body;

    // Retrieve all past conversations
    const conversations = await base44.entities.HannahConversation.filter({
      user_email: user.email
    }, '-created_date', limit);

    if (conversations.length === 0) {
      return Response.json({
        memory: [],
        summary: 'This is our first conversation.',
        keyThemes: [],
        emotionalPatterns: [],
        growthAreas: []
      });
    }

    // Group conversations by session
    const sessionMap = {};
    conversations.forEach(conv => {
      const sessionId = conv.conversation_session_id || 'general';
      if (!sessionMap[sessionId]) {
        sessionMap[sessionId] = [];
      }
      sessionMap[sessionId].push(conv);
    });

    // Extract key information from conversations
    const allUserMessages = conversations
      .filter(c => c.role === 'user')
      .map(c => c.content);

    const emotionalTones = conversations
      .filter(c => c.emotional_tone)
      .map(c => c.emotional_tone);

    const emotionalPatternFreq = {};
    emotionalTones.forEach(tone => {
      emotionalPatternFreq[tone] = (emotionalPatternFreq[tone] || 0) + 1;
    });

    const topEmotionalPatterns = Object.entries(emotionalPatternFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tone]) => tone);

    // If just returning summary, use LLM
    if (summaryOnly && conversations.length > 5) {
      const conversationText = conversations
        .slice(0, 20)
        .map(c => `${c.role === 'user' ? 'User' : 'Hannah'}: ${c.content.substring(0, 100)}...`)
        .join('\n');

      const summaryResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on these past conversations, create a brief memory summary highlighting:
1. Key topics discussed
2. Main challenges/goals
3. Progress made
4. Important personal details

Conversations:
${conversationText}

Format as JSON: { summary: "...", keyThemes: [...], growthAreas: [...], importantDetails: [...] }`,
        response_json_schema: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            keyThemes: { type: 'array', items: { type: 'string' } },
            growthAreas: { type: 'array', items: { type: 'string' } },
            importantDetails: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      return Response.json({
        memory: conversations.slice(0, 10),
        summary: summaryResponse.summary,
        keyThemes: summaryResponse.keyThemes || [],
        growthAreas: summaryResponse.growthAreas || [],
        importantDetails: summaryResponse.importantDetails || [],
        emotionalPatterns: topEmotionalPatterns,
        totalConversations: conversations.length
      });
    }

    // Return raw memory + basic analysis
    return Response.json({
      memory: conversations.slice(0, limit),
      emotionalPatterns: topEmotionalPatterns,
      keyThemes: extractKeyThemes(allUserMessages),
      totalConversations: conversations.length,
      sessionCount: Object.keys(sessionMap).length,
      lastConversation: conversations[0]?.created_date
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function extractKeyThemes(messages) {
  const themes = {};
  const keywords = {
    'habits': ['habit', 'routine', 'daily', 'build', 'consistency'],
    'relationships': ['relationship', 'family', 'friend', 'partner', 'communication'],
    'emotions': ['feel', 'emotional', 'anxiety', 'stress', 'overwhelmed', 'sad'],
    'goals': ['goal', 'achieve', 'want', 'ambition', 'succeed'],
    'finances': ['money', 'financial', 'earn', 'budget', 'income'],
    'identity': ['who am i', 'identity', 'believe', 'values', 'purpose'],
    'work': ['career', 'job', 'work', 'professional', 'leadership'],
    'growth': ['grow', 'develop', 'improve', 'change', 'transform']
  };

  messages.forEach(msg => {
    const lower = msg.toLowerCase();
    Object.entries(keywords).forEach(([theme, words]) => {
      if (words.some(w => lower.includes(w))) {
        themes[theme] = (themes[theme] || 0) + 1;
      }
    });
  });

  return Object.entries(themes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([theme]) => theme);
}