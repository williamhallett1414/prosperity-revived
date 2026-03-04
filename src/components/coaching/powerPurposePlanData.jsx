// POWER & PURPOSE — 6-WEEK ATHLETIC TRANSFORMATION
export const POWER_PURPOSE_WEEK_THEMES = [
  { week: 1, theme: 'Foundation', title: 'Building Your Base', color: 'from-[#0EA5E9] to-[#3B82F6]', accent: '#0EA5E9', emoji: '💪' },
  { week: 2, theme: 'Strength', title: 'Progressive Overload', color: 'from-[#3B82F6] to-[#1E40AF]', accent: '#3B82F6', emoji: '🔥' },
  { week: 3, theme: 'Power', title: 'Explosive Performance', color: 'from-[#1E40AF] to-[#DC2626]', accent: '#DC2626', emoji: '⚡' },
  { week: 4, theme: 'Endurance', title: 'Building Capacity', color: 'from-[#DC2626] to-[#EA580C]', accent: '#EA580C', emoji: '🏃' },
  { week: 5, theme: 'Integration', title: 'Full-Body Mastery', color: 'from-[#EA580C] to-[#0EA5E9]', accent: '#0EA5E9', emoji: '🎯' },
  { week: 6, theme: 'Legacy', title: 'Athlete for Life', color: 'from-[#0EA5E9] to-[#065F46]', accent: '#065F46', emoji: '👑' },
];

export const POWER_PURPOSE_PLAN = {
  id: 'power-purpose',
  title: 'Power & Purpose',
  subtitle: '6-Week Athletic Foundation',
  description: 'Transform your body into a powerful, resilient asset. Progressive strength training combined with sports nutrition and a warrior mindset—designed for athletes and those ready to become one.',
  weeks: 6,
  days_total: 42,
  difficulty: 'Intermediate',
  gradient: 'from-[#0EA5E9] to-[#DC2626]',
  accent: '#0EA5E9',
  cover_emoji: '💪',
  tags: ['Fitness', 'Strength', 'Sports', 'Mindset', 'Nutrition'],
  week_themes: POWER_PURPOSE_WEEK_THEMES,
  days: Array.from({ length: 42 }, (_, i) => ({
    day: i + 1,
    week: Math.floor(i / 7) + 1,
    title: `Day ${i + 1}: Power Training`,
    bible: { book: 'Proverbs', chapter: 10, verse_range: '4', key_verse: '"Lazy hands make for poverty, but diligent hands bring wealth." — Proverbs 10:4', devotion: 'Discipline in training mirrors discipline in life.', reflection_q: 'Where are you most tempted to slack off?' },
    workout: { premade_id: 'strength-circuit', motivational_tip: 'Every rep builds the athlete you\'re becoming.', coach_note: 'Progressive overload is key.' },
    nutrition: { focus: 'Protein & Recovery', meal_theme: 'Athlete Fuel', plan: 'High-protein, nutrient-dense meals to support muscle development.', tip: 'Timing protein intake optimizes muscle protein synthesis.', recipe_search: 'athlete protein meal' },
    journal: { prompt: 'What does being an athlete mean to you spiritually?', entry_type: 'general' },
    affirmation: 'I am building power for purpose. My strength serves something greater than myself.',
    personal_growth_page: 'Workouts',
    personal_growth_label: 'View Workouts',
  })),
};

export default POWER_PURPOSE_PLAN;