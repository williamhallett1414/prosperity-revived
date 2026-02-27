import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import OpenAI from 'npm:openai';

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { day_number, title, ot_readings, nt_reading, psalm_proverb, instructions } = await req.json();

  if (!day_number || !ot_readings || !nt_reading) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const readings = [...ot_readings, nt_reading, psalm_proverb].filter(Boolean).join(', ');

  const prompt = `You are a warm, faith-driven spiritual writer for the Prosperity Revived app. 
Generate a daily Bible devotional for Day ${day_number} — "${title}".

Today's readings: ${readings}
Reading context: ${instructions || ''}

Write in this exact JSON format:
{
  "theme": "Short theme title (3-6 words)",
  "devotional": "150-250 word teaching that is warm, practical, encouraging, Spirit-led, purpose-focused, and never condemning. Connect the day's scriptures to real life. Reference specific passages naturally.",
  "reflection": "One thoughtful reflection question",
  "prayer": "One short, heartfelt prayer (2-3 sentences, first person)"
}

Brand voice: warm, faith-driven, practical, encouraging, Spirit-led, uplifting, purpose-focused.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  const content = JSON.parse(response.choices[0].message.content);

  // Cache the devotional on the entity record
  const days = await base44.asServiceRole.entities.BibleYearPlanDay.filter({ day_number });
  if (days.length > 0) {
    await base44.asServiceRole.entities.BibleYearPlanDay.update(days[0].id, {
      devotional_theme: content.theme,
      devotional_text: content.devotional,
      reflection_question: content.reflection,
      prayer: content.prayer
    });
  }

  return Response.json(content);
});