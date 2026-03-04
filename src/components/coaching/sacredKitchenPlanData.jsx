// SACRED KITCHEN — 4-WEEK FAITH-BASED CULINARY JOURNEY
export const SACRED_KITCHEN_WEEK_THEMES = [
  { week: 1, theme: 'Gratitude', title: 'Blessing the Table', color: 'from-[#EC4899] to-[#DB2777]', accent: '#EC4899', emoji: '🙏' },
  { week: 2, theme: 'Nourishment', title: 'Feeding Your Soul', color: 'from-[#DB2777] to-[#BE185D]', accent: '#DB2777', emoji: '❤️' },
  { week: 3, theme: 'Community', title: 'Cooking as Love', color: 'from-[#BE185D] to-[#EC4899]', accent: '#BE185D', emoji: '🤝' },
  { week: 4, theme: 'Purpose', title: 'Food as Ministry', color: 'from-[#EC4899] to-[#F472B6]', accent: '#F472B6', emoji: '✨' },
];

export const SACRED_KITCHEN_PLAN = {
  id: 'sacred-kitchen',
  title: 'Sacred Kitchen',
  subtitle: '4-Week Faith-Based Culinary Journey',
  description: 'Rediscover the spiritual dimension of food and cooking. Transform your kitchen into a sacred space where nutrition, gratitude, and love meet around the table.',
  weeks: 4,
  days_total: 28,
  difficulty: 'Beginner',
  gradient: 'from-[#EC4899] to-[#DB2777]',
  accent: '#EC4899',
  cover_emoji: '👩‍🍳',
  tags: ['Nutrition', 'Faith', 'Cooking', 'Family', 'Spirituality'],
  week_themes: SACRED_KITCHEN_WEEK_THEMES,
  days: Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    week: Math.floor(i / 7) + 1,
    title: `Day ${i + 1}: Sacred Cooking`,
    bible: { book: '1 Corinthians', chapter: 10, verse_range: '31', key_verse: '"Whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31', devotion: 'Cooking can be an act of worship.', reflection_q: 'How can your kitchen become sacred space?' },
    workout: { premade_id: 'morning-energizer', motivational_tip: 'Care for your body as a temple through what you feed it.', coach_note: 'Cooking itself is active movement.' },
    nutrition: { focus: 'Intentional Cooking', meal_theme: 'Love on a Plate', plan: 'Recipes that nourish body and soul, prepared with prayer and intention.', tip: 'Slow cooking is meditation. Prepare with presence.', recipe_search: 'faith-based recipe family' },
    journal: { prompt: 'What memories does food from your childhood carry?', entry_type: 'general' },
    affirmation: 'My kitchen is sacred. Every meal is an offering of love to those I feed.',
    personal_growth_page: 'DiscoverRecipes',
    personal_growth_label: 'Discover Recipes',
  })),
};

export default SACRED_KITCHEN_PLAN;