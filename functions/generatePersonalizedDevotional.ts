import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Authenticate user
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Gather user context data
    const [journals, prayers, planProgress, memories, emotionalPatterns] = await Promise.all([
      base44.entities.JournalEntry.filter({ created_by: user.email }, '-created_date', 5),
      base44.entities.PrayerJournal.filter({ created_by: user.email }, '-created_date', 5),
      base44.entities.ReadingPlanProgress.filter({ created_by: user.email }, '-updated_date', 3),
      base44.entities.ChatbotMemory.filter({ 
        chatbot_name: 'Gideon', 
        created_by: user.email 
      }, '-importance', 10),
      base44.entities.EmotionalPattern.filter({ created_by: user.email }, '-created_date', 5)
    ]);

    // Build rich context for AI
    const journalContext = journals.length > 0 
      ? `Recent journal entries reveal: ${journals.map(j => `${j.entry_type}: ${j.content.substring(0, 200)}`).join(' | ')}`
      : '';

    const prayerContext = prayers.length > 0
      ? `Prayer life patterns: ${prayers.map(p => `${p.prayer_type}: ${p.content.substring(0, 150)}`).join(' | ')}`
      : '';

    const readingContext = planProgress.length > 0
      ? `Reading journey: Currently ${planProgress[0].current_day}/${planProgress[0].total_days} days into ${planProgress[0].plan_name}, with ${planProgress[0].current_streak || 0} day streak.`
      : '';

    const memoryContext = memories.length > 0
      ? `Spiritual growth areas: ${memories.map(m => m.content).join('; ')}`
      : '';

    const emotionalContext = emotionalPatterns.length > 0
      ? `Recent emotional state: ${emotionalPatterns.map(e => `${e.emotion_category}: ${e.intensity}/10`).join(', ')}`
      : '';

    const moodFromJournal = journals.length > 0 && journals[0].mood 
      ? journals[0].mood 
      : 'neutral';

    // Generate personalized devotional content using AI
    const prompt = `You are Gideon, a compassionate spiritual guide. Generate a highly personalized daily devotional for ${user.full_name} based on their current spiritual and emotional state.

USER CONTEXT:
${journalContext}
${prayerContext}
${readingContext}
${memoryContext}
${emotionalContext}
Current mood: ${moodFromJournal}

Create a devotional that:
1. Directly addresses their current emotional/spiritual state
2. Connects to themes from their recent journal entries or prayers
3. Includes relevant Scripture that speaks to their situation
4. Offers practical application for today
5. Includes a personalized prayer
6. Poses 2-3 deep reflection questions tailored to their journey

Format as JSON with fields: 
- title (string)
- opening_message (string, warm personal greeting)
- scripture_passage (string, verse reference)
- scripture_text (string, the actual verse text)
- meditation (string, 2-3 paragraphs applying Scripture to their context)
- practical_step (string, one concrete action for today)
- reflection_questions (array of strings, 2-3 questions)
- personalized_prayer (string, prayer addressing their specific needs)
- closing_encouragement (string, brief hopeful message)`;

    const devotionalContent = await base44.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: false,
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          opening_message: { type: "string" },
          scripture_passage: { type: "string" },
          scripture_text: { type: "string" },
          meditation: { type: "string" },
          practical_step: { type: "string" },
          reflection_questions: { 
            type: "array",
            items: { type: "string" }
          },
          personalized_prayer: { type: "string" },
          closing_encouragement: { type: "string" }
        }
      }
    });

    // Save to GideonDailyReflection for display
    const today = new Date().toISOString().split('T')[0];
    
    // Check if already exists for today
    const existing = await base44.entities.GideonDailyReflection.filter({
      created_by: user.email,
      date: today
    });

    let reflection;
    if (existing.length > 0) {
      // Update existing
      reflection = await base44.entities.GideonDailyReflection.update(existing[0].id, {
        spiritual_theme: devotionalContent.title,
        context_note: devotionalContent.opening_message,
        reflection_question: devotionalContent.reflection_questions[0],
        scripture_suggestion: devotionalContent.scripture_passage,
        full_content: JSON.stringify(devotionalContent)
      });
    } else {
      // Create new
      reflection = await base44.entities.GideonDailyReflection.create({
        date: today,
        spiritual_theme: devotionalContent.title,
        context_note: devotionalContent.opening_message,
        reflection_question: devotionalContent.reflection_questions[0],
        scripture_suggestion: devotionalContent.scripture_passage,
        full_content: JSON.stringify(devotionalContent),
        completed: false
      });
    }

    return Response.json({
      success: true,
      devotional: devotionalContent,
      reflection_id: reflection.id
    });

  } catch (error) {
    console.error('Personalized devotional generation error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});