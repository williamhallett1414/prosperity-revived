// Avatar State Machine — maps chatbot events → animation states

export const AVATAR_STATES = {
  IDLE: 'idle',
  LISTENING: 'listening',
  THINKING: 'thinking',
  SPEAKING: 'speaking',
  CELEBRATE: 'celebrate',
  REFLECT: 'reflect',
};

const CELEBRATION_TRIGGERS = [
  'great job', 'amazing', 'you did it', 'well done', 'congratulations', 'proud of you',
  'excellent', 'fantastic', 'incredible', 'breakthrough', 'milestone', 'achievement',
  'you\'ve grown', 'progress', 'success', 'won', 'celebrate',
];

const SPIRITUAL_TRIGGERS = [
  'scripture', 'prayer', 'god', 'jesus', 'holy spirit', 'bless', 'faith', 'verse',
  'bible', 'worship', 'amen', 'grace', 'peace be', 'lord', 'psalm', 'gospel',
  'spiritual', 'heaven', 'divine', 'sacred', 'devotional',
];

/**
 * Get the animation state for a given chatbot event
 * @param {'user_typing'|'user_sent'|'bot_thinking'|'bot_speaking'} eventType
 * @param {string} botName - 'gideon' | 'hannah' | 'coach_david' | 'chef_daniel'
 * @param {string} [messageContent] - optional message text for content-aware states
 * @returns {string} AVATAR_STATES value
 */
export function getAnimationForEvent(eventType, botName, messageContent = '') {
  const lowerContent = messageContent.toLowerCase();

  switch (eventType) {
    case 'user_typing':
      return AVATAR_STATES.LISTENING;

    case 'user_sent':
    case 'bot_thinking':
      return AVATAR_STATES.THINKING;

    case 'bot_speaking': {
      // Gideon gets 'reflect' for spiritual messages
      if (botName === 'gideon' && SPIRITUAL_TRIGGERS.some(t => lowerContent.includes(t))) {
        return AVATAR_STATES.REFLECT;
      }
      // Any bot gets 'celebrate' for praise messages
      if (CELEBRATION_TRIGGERS.some(t => lowerContent.includes(t))) {
        return AVATAR_STATES.CELEBRATE;
      }
      return AVATAR_STATES.SPEAKING;
    }

    case 'idle':
    default:
      return AVATAR_STATES.IDLE;
  }
}

export const AVATAR_CONFIG = {
  gideon: {
    displayName: 'Gideon',
    subtitle: 'Spiritual Guide',
    primaryColor: '#c9a227',
    secondaryColor: '#D9B878',
    accentColor: '#FAD98D',
    emoji: '📖',
    portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    idleEmoji: '🙏',
    thinkingEmoji: '✨',
    speakingEmoji: '📖',
    celebrateEmoji: '🌟',
    reflectEmoji: '🕊️',
    listeningEmoji: '👂',
  },
  hannah: {
    displayName: 'Hannah',
    subtitle: 'Personal Growth Guide',
    primaryColor: '#AFC7E3',
    secondaryColor: '#3C4E53',
    accentColor: '#E8F4FD',
    emoji: '💛',
    portrait: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    idleEmoji: '💛',
    thinkingEmoji: '🤔',
    speakingEmoji: '💬',
    celebrateEmoji: '🎉',
    reflectEmoji: '🌱',
    listeningEmoji: '💙',
  },
  coach_david: {
    displayName: 'Coach David',
    subtitle: 'Fitness Coach',
    primaryColor: '#38BDF8',
    secondaryColor: '#0EA5E9',
    accentColor: '#E0F7FF',
    emoji: '💪',
    portrait: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=200&h=200&fit=crop&crop=face',
    idleEmoji: '💪',
    thinkingEmoji: '🧠',
    speakingEmoji: '🏋️',
    celebrateEmoji: '🏆',
    reflectEmoji: '🎯',
    listeningEmoji: '👊',
  },
  chef_daniel: {
    displayName: 'Chef Daniel',
    subtitle: 'Nutrition Guide',
    primaryColor: '#8fa68a',
    secondaryColor: '#6b8f72',
    accentColor: '#EBF5EC',
    emoji: '👨‍🍳',
    portrait: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=200&h=200&fit=crop&crop=face',
    idleEmoji: '👨‍🍳',
    thinkingEmoji: '🤔',
    speakingEmoji: '🍳',
    celebrateEmoji: '🎊',
    reflectEmoji: '🌿',
    listeningEmoji: '👂',
  },
};