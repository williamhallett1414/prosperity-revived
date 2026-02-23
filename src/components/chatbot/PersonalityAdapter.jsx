/**
 * Utility to adapt chatbot prompts based on user personality preferences
 */

export function getPersonalityPromptAddition(preferences) {
  if (!preferences) return '';

  const parts = [];

  // Communication Style
  const styleMap = {
    empathetic: 'Be empathetic, understanding, and compassionate in your responses. Show that you truly hear and validate the user\'s feelings.',
    direct: 'Be direct, straightforward, and to the point. Focus on clear, actionable guidance without unnecessary elaboration.',
    motivational: 'Be inspiring, energizing, and motivational. Push the user toward action and help them see their potential.',
    casual: 'Be friendly, relaxed, and conversational. Speak like a close friend who knows them well.',
    formal: 'Be professional, structured, and respectful. Maintain appropriate boundaries and formality.'
  };
  if (preferences.communication_style && styleMap[preferences.communication_style]) {
    parts.push(styleMap[preferences.communication_style]);
  }

  // Tone
  const toneMap = {
    warm: 'Use a warm, caring, and friendly tone that makes the user feel supported.',
    professional: 'Maintain a professional, clear, and competent tone.',
    encouraging: 'Be supportive, uplifting, and encouraging in your language.',
    straightforward: 'Be honest, direct, and don\'t sugarcoat things.',
    gentle: 'Use soft, nurturing language that feels safe and comforting.'
  };
  if (preferences.tone && toneMap[preferences.tone]) {
    parts.push(toneMap[preferences.tone]);
  }

  // Response Length
  const lengthMap = {
    brief: 'Keep responses concise and to the point. Aim for 2-3 sentences unless more detail is specifically requested.',
    balanced: 'Provide moderate detail - enough to be helpful without being overwhelming.',
    detailed: 'Give thorough, comprehensive responses with plenty of context and explanation.'
  };
  if (preferences.response_length && lengthMap[preferences.response_length]) {
    parts.push(lengthMap[preferences.response_length]);
  }

  // Humor Level
  const humorMap = {
    none: 'Keep responses serious and focused. Avoid humor or jokes.',
    light: 'Include occasional lightheartedness when appropriate, but stay primarily focused.',
    moderate: 'Balance your responses with appropriate humor to keep things engaging.'
  };
  if (preferences.humor_level && humorMap[preferences.humor_level]) {
    parts.push(humorMap[preferences.humor_level]);
  }

  // Formality
  const formalityMap = {
    casual: 'Speak casually as if talking to a good friend. Use contractions and relaxed language.',
    balanced: 'Balance professionalism with friendliness - be approachable but competent.',
    formal: 'Use proper, respectful language and maintain professional boundaries.'
  };
  if (preferences.formality && formalityMap[preferences.formality]) {
    parts.push(formalityMap[preferences.formality]);
  }

  if (parts.length === 0) return '';

  return `\n\n**COMMUNICATION PREFERENCES:**\nThe user prefers the following communication style:\n${parts.join('\n')}\n\nAdapt your responses to match these preferences while maintaining your core personality and expertise.`;
}

export async function fetchUserPreferences(base44, chatbotName) {
  try {
    const user = await base44.auth.me();
    if (!user?.email) return null;

    const preferences = await base44.entities.ChatbotPreferences.filter({
      created_by: user.email,
      chatbot_name: chatbotName
    });

    return preferences.length > 0 ? preferences[0] : null;
  } catch (error) {
    console.error('Error fetching chatbot preferences:', error);
    return null;
  }
}