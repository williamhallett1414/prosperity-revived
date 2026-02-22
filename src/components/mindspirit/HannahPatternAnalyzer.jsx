// Helper to analyze emotional patterns and key themes from journal entries

export const analyzeJournalPatterns = async (base44, userEmail) => {
  try {
    const entries = await base44.entities.JournalEntry.filter(
      { created_by: userEmail },
      '-created_date',
      50
    );

    if (entries.length === 0) {
      return { emotionalPatterns: [], keyThemes: [], sentimentTrend: null };
    }

    // Count emotions and themes
    const emotionCounts = {};
    const themeCounts = {};
    const sentimentScores = [];

    entries.forEach(entry => {
      sentimentScores.push(entry.sentiment_score || 0);
      
      entry.emotions_detected?.forEach(emotion => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
      
      entry.key_themes?.forEach(theme => {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      });
    });

    // Get top patterns
    const emotionalPatterns = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([emotion, count]) => ({ emotion, frequency: count }));

    const keyThemes = Object.entries(themeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([theme, count]) => ({ theme, frequency: count }));

    // Calculate sentiment trend
    const recentScores = sentimentScores.slice(0, Math.ceil(sentimentScores.length / 2));
    const olderScores = sentimentScores.slice(Math.ceil(sentimentScores.length / 2));
    const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length;

    return {
      emotionalPatterns,
      keyThemes,
      sentimentTrend: recentAvg - olderAvg,
      avgSentiment: (sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length).toFixed(2),
      totalEntries: entries.length
    };
  } catch (error) {
    console.log('Analyzing journal patterns...');
    return { emotionalPatterns: [], keyThemes: [], sentimentTrend: null };
  }
};

export const generatePatternBasedIntervention = (patterns) => {
  if (patterns.emotionalPatterns.length === 0) return null;

  const topEmotions = patterns.emotionalPatterns.slice(0, 3);
  const topThemes = patterns.keyThemes.slice(0, 3);
  const trendDirection = patterns.sentimentTrend > 0.1 ? 'improving' : patterns.sentimentTrend < -0.1 ? 'declining' : 'stable';

  const interventionMap = {
    anxiety: {
      topicSuggestion: "nervous system regulation",
      intervention: "I've noticed anxiety showing up frequently in your reflections. Would exploring some grounding techniques help you build resilience?"
    },
    grief: {
      topicSuggestion: "processing loss",
      intervention: "You've been processing some grief. I want to honor that. Would it help to explore what you're learning through this experience?"
    },
    overwhelm: {
      topicSuggestion: "simplification and boundaries",
      intervention: "Overwhelm keeps appearing in your entries. Let's talk about what's truly within your control and where you can set boundaries."
    },
    hopelessness: {
      topicSuggestion: "rebuilding agency",
      intervention: "I notice hopelessness in your reflections. This tells me something important needs attention. What's one small thing you could control today?"
    },
    gratitude: {
      topicSuggestion: "abundance mindset",
      intervention: "I'm noticing gratitude emerging in your reflections—that's beautiful. How can we build on this momentum?"
    },
    joy: {
      topicSuggestion: "sustaining momentum",
      intervention: "You're experiencing more joy lately, and I love it. Let's explore how to protect and expand this feeling."
    },
    uncertainty: {
      topicSuggestion: "clarity and decision-making",
      intervention: "Uncertainty keeps showing up. Rather than avoiding it, what if we used it as information? What's it trying to teach you?"
    }
  };

  const primaryEmotion = topEmotions[0]?.emotion;
  const intervention = interventionMap[primaryEmotion];

  if (intervention) {
    return {
      emotion: primaryEmotion,
      frequency: topEmotions[0]?.frequency,
      themes: topThemes.map(t => t.theme),
      trendDirection,
      suggestion: intervention.intervention,
      topicSuggestion: intervention.topicSuggestion
    };
  }

  return null;
};

export const buildPatternContext = (patterns) => {
  if (!patterns || patterns.emotionalPatterns.length === 0) {
    return '';
  }

  const emotionsList = patterns.emotionalPatterns
    .map(e => `${e.emotion} (${e.frequency} times)`)
    .join(', ');
  
  const themesList = patterns.keyThemes
    .map(t => t.theme)
    .join(', ');

  let context = `\n\nJOURNAL PATTERN INSIGHTS:
- Most frequent emotions: ${emotionsList}
- Key life themes: ${themesList}
- Sentiment trend: ${patterns.sentimentTrend > 0.1 ? 'improving' : patterns.sentimentTrend < -0.1 ? 'declining' : 'stable'}
- Average sentiment: ${patterns.avgSentiment}
- Total reflections: ${patterns.totalEntries}

Use these patterns to deeply personalize your coaching. Reference them naturally when relevant. Help the user see their own patterns and what they might mean.`;

  return context;
};