// Helper module for Hannah's knowledge base integration

export const getKnowledgeBaseInstructions = (sourcesText) => `
KNOWLEDGE BASE INTEGRATION:
You have access to a curated knowledge base of articles, academic research, and self-help resources on personal growth topics.

When a user asks about a topic where relevant sources exist, you can:
1. Reference specific sources in your response
2. Cite key insights from credible, curated research
3. Provide synthesized wisdom that integrates multiple perspectives
4. Guide users to deeper resources for further learning

HOW TO CITE SOURCES:
When referencing a source in your response, use this format:
- Mention the source naturally in conversation: "As research by [Author] suggests..." or "In [Publication], it's noted that..."
- If a source is particularly relevant, you can add: "[Source: Title - Author/Publication]"
- Provide the key insight or quote from the source, then explain how it applies to their situation

SYNTHESIS APPROACH:
When multiple sources address the same topic:
1. Find common themes across sources
2. Present the most actionable insights
3. Show how different perspectives complement each other
4. Acknowledge when sources have different viewpoints (and why that matters)

GUARDRAILS:
- Only cite sources that are clearly curated and credible
- Always prioritize the user's unique situation over generic advice
- If a source doesn't perfectly apply, explain the connection
- Don't overwhelm with citations—integrate insights naturally into conversation
- Focus on practical application, not academic rigor

${sourcesText || ''}
`;

export const formatSourcesForContext = (sources) => {
  if (!sources || sources.length === 0) {
    return '';
  }

  let sourcesText = '\nRELEVANT SOURCES:\n';
  sources.forEach((source, index) => {
    sourcesText += `\n${index + 1}. "${source.title}"`;
    if (source.author_or_source) {
      sourcesText += ` - ${source.author_or_source}`;
    }
    sourcesText += `\n   Type: ${source.source_type}`;
    sourcesText += `\n   Summary: ${source.summary}`;
    if (source.key_insights && source.key_insights.length > 0) {
      sourcesText += `\n   Key Insights: ${source.key_insights.slice(0, 2).join('; ')}`;
    }
    if (source.url_or_reference) {
      sourcesText += `\n   Reference: ${source.url_or_reference}`;
    }
  });

  return sourcesText;
};

export const extractTopicsFromMessage = (message) => {
  const topicKeywords = [
    'habit', 'boundary', 'anxiety', 'confidence', 'relationship', 'leadership',
    'money', 'financial', 'stress', 'burnout', 'emotion', 'self-worth', 'identity',
    'purpose', 'motivation', 'communication', 'attachment', 'resilience', 'recovery',
    'nervous system', 'mindset', 'procrastination', 'perfectionism', 'self-sabotage'
  ];

  const messageLower = message.toLowerCase();
  return topicKeywords.filter(keyword => messageLower.includes(keyword));
};