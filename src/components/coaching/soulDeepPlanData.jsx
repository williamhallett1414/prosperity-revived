// SOUL DEEP — 8-WEEK SPIRITUAL AWAKENING
export const SOUL_DEEP_WEEK_THEMES = [
  { week: 1, theme: 'Encounter', title: 'Meeting God Afresh', color: 'from-[#7C3AED] to-[#A78BFA]', accent: '#7C3AED', emoji: '🙏' },
  { week: 2, theme: 'Surrender', title: 'Laying Down Control', color: 'from-[#A78BFA] to-[#DDD6FE]', accent: '#A78BFA', emoji: '🕊️' },
  { week: 3, theme: 'Healing', title: 'Spiritual Wounds', color: 'from-[#DDD6FE] to-[#7C3AED]', accent: '#DDD6FE', emoji: '💜' },
  { week: 4, theme: 'Truth', title: 'Scripture as Foundation', color: 'from-[#7C3AED] to-[#6366F1]', accent: '#6366F1', emoji: '📖' },
  { week: 5, theme: 'Community', title: 'The Body of Christ', color: 'from-[#6366F1] to-[#7C3AED]', accent: '#6366F1', emoji: '🤝' },
  { week: 6, theme: 'Purpose', title: 'Living Your Calling', color: 'from-[#7C3AED] to-[#A78BFA]', accent: '#A78BFA', emoji: '⭐' },
  { week: 7, theme: 'Intimacy', title: 'Knowing God Deeply', color: 'from-[#A78BFA] to-[#7C3AED]', accent: '#A78BFA', emoji: '💎' },
  { week: 8, theme: 'Overflow', title: 'Living from Fullness', color: 'from-[#7C3AED] to-[#EC4899]', accent: '#EC4899', emoji: '✨' },
];

export const SOUL_DEEP_PLAN = {
  id: 'soul-deep',
  title: 'Soul Deep',
  subtitle: '8-Week Spiritual Awakening',
  description: 'Go deeper into intimacy with God through daily Scripture, contemplative practices, and spiritual disciplines. This is Christianity beyond habit—awakening to a living, breathing relationship with the Divine.',
  weeks: 8,
  days_total: 56,
  difficulty: 'All Levels',
  gradient: 'from-[#7C3AED] to-[#A78BFA]',
  accent: '#7C3AED',
  cover_emoji: '🙏',
  tags: ['Spiritual', 'Prayer', 'Scripture', 'Meditation', 'Faith'],
  week_themes: SOUL_DEEP_WEEK_THEMES,
  days: Array.from({ length: 56 }, (_, i) => ({
    day: i + 1,
    week: Math.floor(i / 7) + 1,
    title: `Day ${i + 1}: Soul Encounter`,
    bible: { book: 'Psalm', chapter: 42, verse_range: '1-2', key_verse: '"As the deer pants for streams of water, so my soul pants for you, O God." — Psalm 42:1', devotion: 'Deep spiritual awakening begins with spiritual hunger.', reflection_q: 'What is your soul thirsting for?' },
    workout: { premade_id: 'guided-meditation', motivational_tip: 'Stillness is a spiritual practice.', coach_note: 'Let meditation deepen your prayer life.' },
    nutrition: { focus: 'Fasting & Feast', meal_theme: 'Spiritual Disciplines', plan: 'Simple foods, intentional fasting, sacred meals.', tip: 'Eating can be a spiritual practice too.', recipe_search: 'contemplative simple meal' },
    meditation: { title: 'Sabbath Rest', description: 'Enter true rest — ceasing striving and trusting in God\'s sufficiency.' },
    journal: { prompt: 'Where do you encounter God most vividly?', entry_type: 'spiritual_reflection' },
    affirmation: 'My soul awakens to God\'s presence. I am known and loved in the depths of my being.',
    personal_growth_page: 'Prayer',
    personal_growth_label: 'Prayer Journal',
  })),
};

export default SOUL_DEEP_PLAN;