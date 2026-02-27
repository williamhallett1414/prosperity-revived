import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import OpenAI from 'npm:openai';

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    let body;
    try { body = await req.json(); } catch { body = {}; }
    const { day_id, day_number, title, ot_readings, nt_reading, psalm_proverb } = body;

    // Return cached if already generated
    if (day_number) {
      const existing = await base44.asServiceRole.entities.BibleYearPlanDay.filter({ day_number });
      const day = existing[0];
      if (day?.devotional_generated) {
        return Response.json({
          devotional_theme: day.devotional_theme,
          devotional_text: day.devotional_text,
          reflection_question: day.reflection_question,
          prayer: day.prayer
        });
      }
    }

    const readings = [...(ot_readings || []), nt_reading, psalm_proverb].filter(Boolean).join(', ');

    const prompt = `You are a warm, faith-driven, encouraging spiritual writer for the Prosperity Revived devotional app.

Generate a daily devotional for Day ${day_number} of the Bible-in-a-Year plan titled "${title}".

Today's scriptures: ${readings}

Return a JSON object with exactly these fields:
- devotional_theme: A short, punchy theme title (3-6 words)
- devotional_text: A 150-250 word devotional teaching that is warm, practical, faith-driven, encouraging, and Spirit-led. Draw from the themes in today's scriptures. Never condemning. Always uplifting and purpose-focused.
- reflection_question: One thoughtful personal reflection question rooted in today's readings
- prayer: A short 2-3 sentence prayer (first person, from the reader to God) that connects to today's theme

Respond ONLY with the JSON object, no extra text.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(response.choices[0].message.content);

    // Cache it — create or update the BibleYearPlanDay record
    if (day_id) {
      await base44.asServiceRole.entities.BibleYearPlanDay.update(day_id, {
        ...content,
        devotional_generated: true
      });
    } else if (day_number) {
      // Try to create a cache record
      const existing2 = await base44.asServiceRole.entities.BibleYearPlanDay.filter({ day_number });
      if (existing2[0]) {
        await base44.asServiceRole.entities.BibleYearPlanDay.update(existing2[0].id, {
          ...content,
          devotional_generated: true
        });
      } else {
        await base44.asServiceRole.entities.BibleYearPlanDay.create({
          day_number,
          title: title || `Day ${day_number}`,
          ot_readings: ot_readings || [],
          nt_reading: nt_reading || '',
          psalm_proverb: psalm_proverb || '',
          ...content,
          devotional_generated: true
        });
      }
    }

    return Response.json(content);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});