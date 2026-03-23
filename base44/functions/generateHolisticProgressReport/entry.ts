import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Gather comprehensive data from all sources
    const [
      memories,
      journals,
      workouts,
      meals,
      prayers,
      readingProgress,
      spiritualGoals,
      emotionalPatterns,
      meditationSessions,
      userProgress
    ] = await Promise.all([
      base44.entities.ChatbotMemory.filter({ created_by: user.email }, '-created_date', 50),
      base44.entities.JournalEntry.filter({ created_by: user.email }, '-created_date', 20),
      base44.entities.WorkoutSession.filter({ created_by: user.email }, '-created_date', 20),
      base44.entities.MealLog.filter({ created_by: user.email }, '-created_date', 20),
      base44.entities.PrayerJournal.filter({ created_by: user.email }, '-created_date', 20),
      base44.entities.ReadingPlanProgress.filter({ created_by: user.email }, '-created_date', 5),
      base44.entities.SpiritualGoal.filter({ created_by: user.email, status: 'active' }),
      base44.entities.EmotionalPattern.filter({ created_by: user.email }, '-created_date', 10),
      base44.entities.MeditationSession.filter({ created_by: user.email }, '-created_date', 20),
      base44.entities.UserProgress.filter({ created_by: user.email }, '-created_date', 1)
    ]);

    // Build detailed context for AI analysis
    const contextData = {
      user_name: user.full_name,
      timeframe: "last 30 days",
      
      hannah_insights: {
        total_memories: memories.filter(m => m.chatbot_name === 'Hannah').length,
        emotional_patterns: emotionalPatterns.map(ep => ({
          pattern: ep.pattern_type,
          frequency: ep.frequency,
          identified: ep.created_date
        })),
        journal_moods: journals.filter(j => j.mood).map(j => ({
          mood: j.mood,
          date: j.created_date,
          sentiment: j.sentiment
        })),
        key_themes: [...new Set(journals.flatMap(j => j.key_themes || []))],
        recent_goals: memories.filter(m => m.chatbot_name === 'Hannah' && m.memory_type === 'goal').slice(0, 3)
      },
      
      coach_david_insights: {
        total_memories: memories.filter(m => m.chatbot_name === 'CoachDavid').length,
        workout_frequency: workouts.length,
        workout_consistency: calculateConsistency(workouts),
        total_workout_duration: workouts.reduce((sum, w) => sum + (w.duration_minutes || 0), 0),
        recent_achievements: memories.filter(m => m.chatbot_name === 'CoachDavid' && m.memory_type === 'achievement').slice(0, 3),
        workout_dates: workouts.map(w => w.created_date)
      },
      
      chef_daniel_insights: {
        total_memories: memories.filter(m => m.chatbot_name === 'ChefDaniel').length,
        meal_logging_frequency: meals.length,
        nutrition_goals: userProgress[0] ? {
          target_calories: userProgress[0].target_calories,
          target_protein: userProgress[0].target_protein,
          current_weight: userProgress[0].current_weight
        } : null,
        meal_consistency: calculateConsistency(meals),
        recent_insights: memories.filter(m => m.chatbot_name === 'ChefDaniel' && m.memory_type === 'insight').slice(0, 3)
      },
      
      gideon_insights: {
        total_memories: memories.filter(m => m.chatbot_name === 'Gideon').length,
        prayer_frequency: prayers.length,
        reading_progress: readingProgress.map(rp => ({
          plan: rp.plan_name,
          progress: rp.completed_days?.length || 0,
          total_days: rp.total_days,
          current_streak: rp.current_streak
        })),
        spiritual_goals_active: spiritualGoals.length,
        meditation_sessions: meditationSessions.length,
        answered_prayers: prayers.filter(p => p.answered === true).length,
        prayer_dates: prayers.map(p => p.created_date)
      }
    };

    // Identify temporal correlations
    const correlations = identifyCorrelations({
      journals,
      workouts,
      prayers,
      meditationSessions,
      meals
    });

    // Generate AI summary
    const aiPrompt = `You are an AI wellness analyst providing a holistic progress report for ${user.full_name}.

**Your Task:**
Analyze the user's comprehensive wellness data and create a warm, encouraging holistic progress report. Identify meaningful connections between different areas of their life (emotional, physical, nutritional, spiritual).

**Data Summary:**
${JSON.stringify(contextData, null, 2)}

**Detected Temporal Correlations:**
${JSON.stringify(correlations, null, 2)}

**Create a holistic progress report with these sections:**

1. **Overall Wellbeing Summary** (2-3 sentences)
   - High-level view of their journey
   - Celebrate overall progress

2. **Key Interconnected Insights** (3-5 bullet points)
   - Identify correlations (e.g., "Your improved mood patterns correlate with consistent meditation and better sleep")
   - Connect dots between Hannah (emotional), Coach David (physical), Chef Daniel (nutrition), and Gideon (spiritual)
   - Be specific with examples from the data

3. **Areas of Strength** (2-3 bullet points)
   - What they're doing exceptionally well
   - Cross-domain achievements

4. **Growth Opportunities** (2-3 bullet points)
   - Gentle suggestions for areas that could use more attention
   - How strengthening one area might benefit others

5. **Personalized Recommendation** (1-2 sentences)
   - One specific, actionable next step that leverages their strengths

**Tone:** Warm, encouraging, insightful, and personal. Speak directly to the user. Be data-informed but human-centered.

Return ONLY valid JSON with this structure:
{
  "overall_summary": "string",
  "interconnected_insights": ["string", "string", ...],
  "areas_of_strength": ["string", "string", ...],
  "growth_opportunities": ["string", "string", ...],
  "personalized_recommendation": "string",
  "generated_date": "ISO date string"
}`;

    const aiResponse = await base44.integrations.Core.InvokeLLM({
      prompt: aiPrompt,
      response_json_schema: {
        type: "object",
        properties: {
          overall_summary: { type: "string" },
          interconnected_insights: { type: "array", items: { type: "string" } },
          areas_of_strength: { type: "array", items: { type: "string" } },
          growth_opportunities: { type: "array", items: { type: "string" } },
          personalized_recommendation: { type: "string" },
          generated_date: { type: "string" }
        }
      }
    });

    // Add metadata
    const report = {
      ...aiResponse,
      generated_date: new Date().toISOString(),
      data_summary: {
        total_memories: memories.length,
        total_workouts: workouts.length,
        total_journals: journals.length,
        total_meals: meals.length,
        total_prayers: prayers.length,
        total_meditations: meditationSessions.length
      },
      correlations: correlations
    };

    return Response.json({
      success: true,
      report: report
    });
    
  } catch (error) {
    console.error('Report generation error:', error);
    return Response.json({ 
      error: error.message,
      details: 'Failed to generate holistic progress report'
    }, { status: 500 });
  }
});

// Helper: Calculate consistency (days with activity in last 30 days)
function calculateConsistency(items) {
  if (items.length === 0) return 0;
  
  const uniqueDays = new Set(
    items.map(item => {
      const date = new Date(item.created_date);
      return date.toISOString().split('T')[0];
    })
  );
  
  return uniqueDays.size;
}

// Helper: Identify temporal correlations
function identifyCorrelations(data) {
  const { journals, workouts, prayers, meditationSessions, meals } = data;
  const correlations = [];
  
  // Create date-based activity map
  const activityByDate = {};
  
  // Group all activities by date
  [...journals, ...workouts, ...prayers, ...meditationSessions, ...meals].forEach(item => {
    const date = new Date(item.created_date).toISOString().split('T')[0];
    if (!activityByDate[date]) {
      activityByDate[date] = {
        hasJournal: false,
        journalMood: null,
        hasWorkout: false,
        hasPrayer: false,
        hasMeditation: false,
        hasMeal: false
      };
    }
    
    if (journals.includes(item)) {
      activityByDate[date].hasJournal = true;
      activityByDate[date].journalMood = item.mood;
    }
    if (workouts.includes(item)) activityByDate[date].hasWorkout = true;
    if (prayers.includes(item)) activityByDate[date].hasPrayer = true;
    if (meditationSessions.includes(item)) activityByDate[date].hasMeditation = true;
    if (meals.includes(item)) activityByDate[date].hasMeal = true;
  });
  
  // Analyze patterns
  const dates = Object.keys(activityByDate).sort();
  
  // Correlation 1: Workout + good mood
  const workoutDays = dates.filter(d => activityByDate[d].hasWorkout);
  const workoutGoodMoodDays = workoutDays.filter(d => 
    activityByDate[d].journalMood && ['Good', 'Great', 'joyful', 'grateful'].includes(activityByDate[d].journalMood)
  );
  if (workoutGoodMoodDays.length >= 3) {
    correlations.push({
      type: "workout_mood",
      description: "Workout days correlate with improved mood",
      frequency: workoutGoodMoodDays.length,
      confidence: "high"
    });
  }
  
  // Correlation 2: Meditation/Prayer + journaling
  const spiritualDays = dates.filter(d => activityByDate[d].hasPrayer || activityByDate[d].hasMeditation);
  const spiritualJournalDays = spiritualDays.filter(d => activityByDate[d].hasJournal);
  if (spiritualJournalDays.length >= 3) {
    correlations.push({
      type: "spiritual_journaling",
      description: "Spiritual practices (prayer/meditation) often coincide with journaling",
      frequency: spiritualJournalDays.length,
      confidence: "medium"
    });
  }
  
  // Correlation 3: Consistent meal logging + workout
  const mealDays = dates.filter(d => activityByDate[d].hasMeal);
  const mealWorkoutDays = mealDays.filter(d => activityByDate[d].hasWorkout);
  if (mealWorkoutDays.length >= 3) {
    correlations.push({
      type: "nutrition_fitness",
      description: "Days with meal logging often include workouts",
      frequency: mealWorkoutDays.length,
      confidence: "medium"
    });
  }
  
  return correlations;
}