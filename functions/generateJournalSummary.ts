import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { summary_type } = await req.json();
    
    if (!summary_type || !['weekly', 'monthly'].includes(summary_type)) {
      return Response.json({ error: 'Invalid summary_type. Must be "weekly" or "monthly"' }, { status: 400 });
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    if (summary_type === 'weekly') {
      startDate.setDate(endDate.getDate() - 7);
    } else {
      startDate.setDate(endDate.getDate() - 30);
    }

    // Fetch all journal entries for the user
    const allEntries = await base44.entities.JournalEntry.filter(
      { created_by: user.email },
      '-created_date',
      1000
    );

    // Filter entries within the date range
    const entries = allEntries.filter(entry => {
      const entryDate = new Date(entry.created_date);
      return entryDate >= startDate && entryDate <= endDate;
    });

    if (entries.length === 0) {
      return Response.json({
        summary_text: `No journal entries found in the past ${summary_type === 'weekly' ? '7 days' : '30 days'}. Start journaling to see your personalized insights!`,
        entries_analyzed: 0,
        period_start: startDate.toISOString().split('T')[0],
        period_end: endDate.toISOString().split('T')[0],
        category_breakdown: {},
        mood_trends: {}
      });
    }

    // Analyze patterns
    const categoryBreakdown = {};
    const moodCounts = {};
    const categoryEntries = {};

    entries.forEach(entry => {
      const category = entry.entry_type || 'general';
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
      
      if (!categoryEntries[category]) {
        categoryEntries[category] = [];
      }
      categoryEntries[category].push({
        content: entry.content?.substring(0, 200),
        title: entry.title,
        mood: entry.mood,
        prompt: entry.prompt
      });

      if (entry.mood) {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      }
    });

    // Prepare data for AI analysis
    const analysisPrompt = `Analyze the following journal entries from the past ${summary_type === 'weekly' ? '7 days' : '30 days'} and provide a warm, encouraging, personalized summary.

Total entries: ${entries.length}

Category breakdown:
${Object.entries(categoryBreakdown).map(([cat, count]) => `- ${cat}: ${count} entries`).join('\n')}

${Object.keys(moodCounts).length > 0 ? `Mood patterns:
${Object.entries(moodCounts).map(([mood, count]) => `- ${mood}: ${count} times`).join('\n')}` : ''}

Sample entries by category:
${Object.entries(categoryEntries).map(([cat, entries]) => `
${cat.toUpperCase()}:
${entries.slice(0, 3).map(e => `- ${e.title || 'Untitled'}: ${e.content || ''}`).join('\n')}
`).join('\n')}

Create a ${summary_type} summary that:
1. Highlights key emotional and spiritual patterns
2. Celebrates growth moments and wins
3. Identifies recurring themes
4. Offers gentle encouragement
5. Notes gratitude patterns (if applicable)
6. Is personal, warm, and uplifting (3-4 paragraphs)

Write in second person (addressing the user as "you"). Be specific about what you notice in their entries.`;

    // Generate AI summary
    const aiResult = await base44.integrations.Core.InvokeLLM({
      prompt: analysisPrompt,
      add_context_from_internet: false
    });

    const summaryText = typeof aiResult === 'string' ? aiResult : aiResult.response || aiResult.text || 'Summary unavailable';

    // Save the summary
    const summary = await base44.entities.JournalSummary.create({
      summary_type,
      summary_text: summaryText,
      period_start: startDate.toISOString().split('T')[0],
      period_end: endDate.toISOString().split('T')[0],
      entries_analyzed: entries.length,
      mood_trends: moodCounts,
      category_breakdown: categoryBreakdown
    });

    return Response.json({
      success: true,
      summary
    });

  } catch (error) {
    console.error('Error generating summary:', error);
    return Response.json({ 
      error: 'Failed to generate summary', 
      details: error.message 
    }, { status: 500 });
  }
});