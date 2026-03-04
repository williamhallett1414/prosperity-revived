// 30-DAY GROWTH SPRINT — 4-WEEK PRODUCTIVITY ACCELERATION
export const GROWTH_SPRINT_WEEK_THEMES = [
  { week: 1, theme: 'Clarity', title: 'Know Your North Star', color: 'from-[#F59E0B] to-[#D97706]', accent: '#F59E0B', emoji: '🎯' },
  { week: 2, theme: 'Build', title: 'Systems & Habits', color: 'from-[#D97706] to-[#B45309]', accent: '#D97706', emoji: '🔨' },
  { week: 3, theme: 'Execute', title: 'Daily Action', color: 'from-[#B45309] to-[#F59E0B]', accent: '#B45309', emoji: '⚡' },
  { week: 4, theme: 'Momentum', title: '30 Days to a New You', color: 'from-[#F59E0B] to-[#FBBF24]', accent: '#FBBF24', emoji: '🚀' },
];

export const GROWTH_SPRINT_PLAN = {
  id: 'growth-sprint',
  title: '30-Day Growth Sprint',
  subtitle: '4-Week Productivity Acceleration',
  description: 'Rapid transformation through focused goal-setting, daily execution, and accountability. 30 days to break old patterns and build unstoppable momentum toward your dreams.',
  weeks: 4,
  days_total: 28,
  difficulty: 'Intermediate',
  gradient: 'from-[#F59E0B] to-[#D97706]',
  accent: '#F59E0B',
  cover_emoji: '🚀',
  tags: ['Growth', 'Productivity', 'Goals', 'Mindset', 'Action'],
  week_themes: GROWTH_SPRINT_WEEK_THEMES,
  days: Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    week: Math.floor(i / 7) + 1,
    title: `Day ${i + 1}: Sprint Forward`,
    bible: { book: 'Proverbs', chapter: 21, verse_range: '5', key_verse: '"The plans of the diligent lead to profit as surely as haste leads to poverty." — Proverbs 21:5', devotion: 'Speed without plan produces waste. Plan fuels execution.', reflection_q: 'What one goal would change everything?' },
    workout: { premade_id: 'hiit-30', motivational_tip: 'High intensity, focused effort—both for fitness and goals.', coach_note: 'Peak performance under time pressure.' },
    nutrition: { focus: 'Energy Foods', meal_theme: 'Brain & Body Fuel', plan: 'Foods that sustain energy for focused work and training.', tip: 'What you eat fuels your productivity.', recipe_search: 'energy productivity meal' },
    journal: { prompt: 'What is your #1 goal for this 30 days?', entry_type: 'goal_setting' },
    affirmation: 'I execute with clarity and power. 30 days from now, I am unrecognizable.',
    personal_growth_page: 'HabitBuilderPage',
    personal_growth_label: 'Build Habits',
  })),
};

export default GROWTH_SPRINT_PLAN;