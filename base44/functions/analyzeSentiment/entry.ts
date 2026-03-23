import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { entry_id } = await req.json();

    if (!entry_id) {
      return Response.json({ error: 'entry_id required' }, { status: 400 });
    }

    // Get the journal entry
    const entry = await base44.asServiceRole.entities.JournalEntry.get(entry_id);
    
    if (!entry) {
      return Response.json({ error: 'Entry not found' }, { status: 404 });
    }

    // Call LLM to analyze sentiment
    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Analyze the sentiment of this journal entry and respond ONLY with valid JSON (no markdown, no extra text):

Journal entry: "${entry.content}"

Respond with ONLY this JSON structure:
{
  "sentiment": "very_negative|negative|neutral|positive|very_positive",
  "sentiment_score": -1 to 1,
  "emotions_detected": ["emotion1", "emotion2", "emotion3"],
  "key_themes": ["theme1", "theme2", "theme3"]
}`,
      response_json_schema: {
        type: 'object',
        properties: {
          sentiment: { type: 'string' },
          sentiment_score: { type: 'number' },
          emotions_detected: { type: 'array', items: { type: 'string' } },
          key_themes: { type: 'array', items: { type: 'string' } }
        },
        required: ['sentiment', 'sentiment_score', 'emotions_detected', 'key_themes']
      }
    });

    // Update entry with sentiment analysis
    await base44.asServiceRole.entities.JournalEntry.update(entry_id, {
      sentiment: response.sentiment,
      sentiment_score: response.sentiment_score,
      emotions_detected: response.emotions_detected,
      key_themes: response.key_themes
    });

    return Response.json({
      success: true,
      sentiment: response.sentiment,
      sentiment_score: response.sentiment_score,
      emotions_detected: response.emotions_detected,
      key_themes: response.key_themes
    });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});