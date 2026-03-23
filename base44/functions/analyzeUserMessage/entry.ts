import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { message, conversation_history } = await req.json();
    
    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }
    
    // Build context from conversation history
    const historyContext = conversation_history && conversation_history.length > 0
      ? `\n\nRecent conversation context:\n${conversation_history.slice(-5).map(msg => 
          `${msg.role === 'user' ? 'User' : 'Gideon'}: ${msg.content}`
        ).join('\n')}`
      : '';
    
    // Analyze the message using LLM
    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert in emotional intelligence and spiritual discernment. Analyze the following user message and provide a detailed psychological and spiritual assessment.

User's Message: "${message}"
${historyContext}

Provide your analysis in the following JSON format:
{
  "emotional_tone": "primary emotional state (discouraged, anxious, hopeful, confused, hurt, determined, celebratory, peaceful, struggling, joyful, overwhelmed, content, fearful, grateful, angry, lonely, restless, seeking)",
  "emotional_intensity": "low, moderate, or high",
  "spiritual_theme": "primary spiritual theme (identity, purpose, trust, surrender, fear, faith, growth, healing, breakthrough, wilderness, calling, obedience, doubt, freedom, restoration, intimacy, transformation, worship)",
  "secondary_themes": ["array of 1-3 secondary spiritual themes"],
  "core_need": "the deepest need being expressed (clarity, hope, peace, validation, direction, comfort, strength, understanding, connection, forgiveness, breakthrough, purpose)",
  "suggested_scriptures": ["3-5 Bible references that directly address this need"],
  "coaching_focus": "what ICF-aligned coaching approach would be most helpful (exploration, awareness, goal-setting, accountability, reframing, empowerment, action-planning)",
  "personalization_notes": "brief insights about what this person specifically needs to hear based on their message and history"
}

Be deeply empathetic and discerning. Look beneath the surface words to the heart of what's being expressed.`,
      response_json_schema: {
        type: "object",
        properties: {
          emotional_tone: { type: "string" },
          emotional_intensity: { type: "string" },
          spiritual_theme: { type: "string" },
          secondary_themes: { type: "array", items: { type: "string" } },
          core_need: { type: "string" },
          suggested_scriptures: { type: "array", items: { type: "string" } },
          coaching_focus: { type: "string" },
          personalization_notes: { type: "string" }
        }
      }
    });
    
    // Track this analysis for engagement patterns
    await base44.functions.invoke('trackUserEngagement', {
      action: 'session',
      data: {
        emotional_tone: analysis.emotional_tone,
        spiritual_theme: analysis.spiritual_theme
      }
    });
    
    return Response.json(analysis);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});