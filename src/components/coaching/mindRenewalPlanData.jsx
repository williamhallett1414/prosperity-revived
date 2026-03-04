// MIND RENEWAL — 8-WEEK MENTAL HEALTH TRANSFORMATION
export const MIND_RENEWAL_WEEK_THEMES = [
  { week: 1, theme: 'Awareness', title: 'Naming Your Patterns', color: 'from-[#06B6D4] to-[#0891B2]', accent: '#06B6D4', emoji: '🧠' },
  { week: 2, theme: 'Unlearning', title: 'Releasing False Beliefs', color: 'from-[#0891B2] to-[#155E75]', accent: '#0891B2', emoji: '🔄' },
  { week: 3, theme: 'Healing', title: 'Processing Trauma', color: 'from-[#155E75] to-[#06B6D4]', accent: '#155E75', emoji: '💚' },
  { week: 4, theme: 'Reframing', title: 'New Thought Patterns', color: 'from-[#06B6D4] to-[#164E63]', accent: '#06B6D4', emoji: '✨' },
  { week: 5, theme: 'Resilience', title: 'Bouncing Back', color: 'from-[#164E63] to-[#0891B2]', accent: '#164E63', emoji: '💪' },
  { week: 6, theme: 'Integration', title: 'Wholeness', color: 'from-[#0891B2] to-[#06B6D4]', accent: '#0891B2', emoji: '🌟' },
  { week: 7, theme: 'Expression', title: 'Authentic Living', color: 'from-[#06B6D4] to-[#155E75]', accent: '#06B6D4', emoji: '🎨' },
  { week: 8, theme: 'Legacy', title: 'Freed Mind, Whole Life', color: 'from-[#155E75] to-[#06B6D4]', accent: '#155E75', emoji: '👑' },
];

export const MIND_RENEWAL_PLAN = {
  id: 'mind-renewal',
  title: 'Mind Renewal',
  subtitle: '8-Week Mental Health Transformation',
  description: 'Heal your mind from anxiety, depression, trauma, and limiting beliefs. Integrate neuroscience, psychology, and spirituality for genuine mental freedom and emotional wholeness.',
  weeks: 8,
  days_total: 56,
  difficulty: 'All Levels',
  gradient: 'from-[#06B6D4] to-[#0891B2]',
  accent: '#06B6D4',
  cover_emoji: '🧠',
  tags: ['Mental Health', 'Healing', 'Psychology', 'Mindset', 'Wellness'],
  week_themes: MIND_RENEWAL_WEEK_THEMES,
  days: Array.from({ length: 56 }, (_, i) => ({
    day: i + 1,
    week: Math.floor(i / 7) + 1,
    title: `Day ${i + 1}: Mental Healing`,
    bible: { book: 'Philippians', chapter: 4, verse_range: '8', key_verse: '"Whatever is true... think about such things." — Philippians 4:8', devotion: 'Your thoughts shape your reality. Choose them carefully.', reflection_q: 'What thought pattern most needs healing?' },
    workout: { premade_id: 'yoga-flow', motivational_tip: 'Movement heals the mind as much as the body.', coach_note: 'Somatic practices integrate trauma.' },
    nutrition: { focus: 'Brain Health', meal_theme: 'Mood-Supporting Foods', plan: 'Omega-3s, B vitamins, and foods that support neurotransmitter production.', tip: 'The gut-brain axis: feed it well.', recipe_search: 'brain health mood nutrition' },
    journal: { prompt: 'What belief about yourself needs to be challenged?', entry_type: 'emotional_checkin' },
    affirmation: 'My mind is healing. Old patterns are loosening. I am becoming free.',
    personal_growth_page: 'EmotionalCheckInPage',
    personal_growth_label: 'Emotional Check-In',
  })),
};

export default MIND_RENEWAL_PLAN;