// NOURISH & THRIVE — 6-WEEK NUTRITIONAL RESET
export const NOURISH_THRIVE_WEEK_THEMES = [
  { week: 1, theme: 'Detox', title: 'Clean Slate', color: 'from-[#10B981] to-[#059669]', accent: '#10B981', emoji: '🌿' },
  { week: 2, theme: 'Rebuild', title: 'Nutrient Density', color: 'from-[#059669] to-[#047857]', accent: '#059669', emoji: '🥗' },
  { week: 3, theme: 'Balance', title: 'Macronutrient Harmony', color: 'from-[#047857] to-[#065F46]', accent: '#047F46', emoji: '⚖️' },
  { week: 4, theme: 'Healing', title: 'Gut Health Restoration', color: 'from-[#065F46] to-[#10B981]', accent: '#10B981', emoji: '💚' },
  { week: 5, theme: 'Mastery', title: 'Sustainable Eating', color: 'from-[#10B981] to-[#6366F1]', accent: '#6366F1', emoji: '🎯' },
  { week: 6, theme: 'Overflow', title: 'Nourished for Life', color: 'from-[#6366F1] to-[#10B981]', accent: '#10B981', emoji: '✨' },
];

export const NOURISH_THRIVE_PLAN = {
  id: 'nourish-thrive',
  title: 'Nourish & Thrive',
  subtitle: '6-Week Nutritional Reset',
  description: 'Heal your relationship with food and transform your body from the inside out. Nutrition science meets spiritual gratitude in a 6-week journey to vibrant health.',
  weeks: 6,
  days_total: 42,
  difficulty: 'Beginner',
  gradient: 'from-[#10B981] to-[#065F46]',
  accent: '#10B981',
  cover_emoji: '🥗',
  tags: ['Nutrition', 'Health', 'Wellness', 'Food', 'Mindset'],
  week_themes: NOURISH_THRIVE_WEEK_THEMES,
  days: Array.from({ length: 42 }, (_, i) => ({
    day: i + 1,
    week: Math.floor(i / 7) + 1,
    title: `Day ${i + 1}: Nourish`,
    bible: { book: '3 John', chapter: 1, verse_range: '2', key_verse: '"Dear friend, I pray that you may enjoy good health." — 3 John 1:2', devotion: 'God desires your wholeness through proper nourishment.', reflection_q: 'How does food serve your body as a temple?' },
    workout: { premade_id: 'yoga-flow', motivational_tip: 'Gentle movement supports nutritional healing.', coach_note: 'Restorative practices complement dietary changes.' },
    nutrition: { focus: 'Whole Foods Only', meal_theme: 'Plant-Forward Abundance', plan: 'Nutrient-dense whole foods that restore gut health and energy.', tip: 'Each meal is medicine when chosen with intention.', recipe_search: 'whole foods healing meal' },
    journal: { prompt: 'What emotions trigger your eating patterns?', entry_type: 'general' },
    affirmation: 'I nourish my body with foods that honor it. My health flows from gratitude and intention.',
    personal_growth_page: 'Nutrition',
    personal_growth_label: 'View Nutrition',
  })),
};

export default NOURISH_THRIVE_PLAN;