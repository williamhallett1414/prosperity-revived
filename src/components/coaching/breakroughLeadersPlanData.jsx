// BREAKTHROUGH LEADERS — 6-WEEK LEADERSHIP & CHARACTER TRANSFORMATION
export const BREAKTHROUGH_LEADERS_WEEK_THEMES = [
  { week: 1, theme: 'Vision', title: 'Defining Your Leadership', color: 'from-[#8B5CF6] to-[#7C3AED]', accent: '#8B5CF6', emoji: '👁️' },
  { week: 2, theme: 'Character', title: 'The Leader You\'re Becoming', color: 'from-[#7C3AED] to-[#6D28D9]', accent: '#7C3AED', emoji: '⭐' },
  { week: 3, theme: 'Influence', title: 'Leading Others', color: 'from-[#6D28D9] to-[#8B5CF6]', accent: '#6D28D9', emoji: '🎯' },
  { week: 4, theme: 'Courage', title: 'Bold Decision-Making', color: 'from-[#8B5CF6] to-[#A78BFA]', accent: '#8B5CF6', emoji: '🦁' },
  { week: 5, theme: 'Integrity', title: 'Walking the Talk', color: 'from-[#A78BFA] to-[#7C3AED]', accent: '#A78BFA', emoji: '✊' },
  { week: 6, theme: 'Legacy', title: 'Leading for Impact', color: 'from-[#7C3AED] to-[#8B5CF6]', accent: '#7C3AED', emoji: '👑' },
];

export const BREAKTHROUGH_LEADERS_PLAN = {
  id: 'breakthrough-leaders',
  title: 'Breakthrough Leaders',
  subtitle: '6-Week Leadership & Character Transformation',
  description: 'Lead with authentic power and spiritual authority. Develop the character, courage, and conviction required to influence others toward purpose and transformation.',
  weeks: 6,
  days_total: 42,
  difficulty: 'Intermediate',
  gradient: 'from-[#8B5CF6] to-[#7C3AED]',
  accent: '#8B5CF6',
  cover_emoji: '👑',
  tags: ['Leadership', 'Growth', 'Character', 'Influence', 'Faith'],
  week_themes: BREAKTHROUGH_LEADERS_WEEK_THEMES,
  days: Array.from({ length: 42 }, (_, i) => ({
    day: i + 1,
    week: Math.floor(i / 7) + 1,
    title: `Day ${i + 1}: Lead Forward`,
    bible: { book: 'Proverbs', chapter: 27, verse_range: '12', key_verse: '"The prudent see danger and take refuge, but the simple keep going and pay the penalty." — Proverbs 27:12', devotion: 'Leaders see ahead and prepare accordingly.', reflection_q: 'What is your leadership blind spot?' },
    workout: { premade_id: 'strength-circuit', motivational_tip: 'Strong leaders have strong foundations.', coach_note: 'Physical discipline mirrors leadership discipline.' },
    nutrition: { focus: 'Performance Fuel', meal_theme: 'Peak Leadership Energy', plan: 'Foods that sustain focus and mental clarity for long decision-making days.', tip: 'Leaders who neglect nutrition lose edge.', recipe_search: 'mental clarity energy meal' },
    journal: { prompt: 'Who is someone whose leadership you deeply respect? What qualities do they embody?', entry_type: 'general' },
    affirmation: 'I lead with integrity, courage, and vision. Others follow because I know where we are going.',
    personal_growth_page: 'GrowthPathwaysPage',
    personal_growth_label: 'Growth Pathways',
  })),
};

export default BREAKTHROUGH_LEADERS_PLAN;