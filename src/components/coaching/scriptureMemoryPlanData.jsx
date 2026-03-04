// ─────────────────────────────────────────────────────────────────────────────
// HIDE IT IN YOUR HEART — 8-Week Scripture Memorization & Meditation Program
// ─────────────────────────────────────────────────────────────────────────────

export const SCRIPTURE_MEMORY_WEEK_THEMES = [
  { week: 1, theme: 'Foundation',          title: 'Why Scripture Matters',      color: 'from-[#dc2626] to-[#0A1A2F]', accent: '#dc2626', emoji: '📖' },
  { week: 2, theme: 'The God Verses',      title: 'Who God Is',                 color: 'from-[#ea580c] to-[#0A1A2F]', accent: '#ea580c', emoji: '⛪' },
  { week: 3, theme: 'Identity in Christ',  title: 'Who You Are',                color: 'from-[#facc15] to-[#0A1A2F]', accent: '#facc15', emoji: '🎯' },
  { week: 4, theme: 'Promise Verses',      title: 'What God Offers',            color: 'from-[#22c55e] to-[#0A1A2F]', accent: '#22c55e', emoji: '🌈' },
  { week: 5, theme: 'Comfort & Truth',     title: 'When Life Is Hard',          color: 'from-[#06b6d4] to-[#0A1A2F]', accent: '#06b6d4', emoji: '💙' },
  { week: 6, theme: 'Daily Wisdom',        title: 'Living Scripture',           color: 'from-[#8b5cf6] to-[#0A1A2F]', accent: '#8b5cf6', emoji: '💡' },
  { week: 7, theme: 'Warfare & Strength',  title: 'Standing Firm',              color: 'from-[#f43f5e] to-[#0A1A2F]', accent: '#f43f5e', emoji: '⚔️' },
  { week: 8, theme: 'Hidden in Your Heart', title: 'The Transformed Life',       color: 'from-[#a78bfa] to-[#0A1A2F]', accent: '#a78bfa', emoji: '✨' },
];

export const SCRIPTURE_MEMORY_DAYS = [
  {
    day: 1, week: 1, title: 'The Sword of the Spirit',
    bible: { book: 'Ephesians', chapter: 6, verse_range: '17', key_verse: '"And take the helmet of salvation and the sword of the Spirit, which is the word of God." — Ephesians 6:17', devotion: 'Scripture memorized and hidden in your heart is your weapon against despair, fear, and lies. It is not information. It is transformation. This 8-week journey is about hiding God\'s word in your heart so deeply that it becomes the lens through which you see everything.', reflection_q: 'When have you most needed Scripture? What verse do you wish you had known by heart?' },
    workout: { premade_id: 'morning-energizer', motivational_tip: 'Your mind is a muscle. We\'re training it. Memory is a skill.', coach_note: 'Repetition builds memory. This week we begin.' },
    nutrition: { focus: 'Brain Fuel', meal_theme: 'Mental Clarity', plan: 'Foods that support memory and cognition: omega-3s, antioxidants, B vitamins. Your brain is doing important work.', tip: 'What you eat affects your ability to memorize and focus.', recipe_search: 'brain boosting foods' },
    journal: { prompt: 'What Scripture verses are already hidden in your heart? How have they sustained you?', entry_type: 'general' },
    affirmation: 'I hide God\'s word in my heart. It becomes my strength and my guide.',
    personal_growth_page: 'BibleBooks', personal_growth_label: 'Bible',
  },
  {
    day: 2, week: 1, title: 'Memory as Spiritual Discipline',
    bible: { book: 'Deuteronomy', chapter: 11, verse_range: '18', key_verse: '"Fix these words of mine in your hearts and your minds... tie them as symbols on your hands and bind them on your foreheads." — Deuteronomy 11:18', devotion: 'Memorization is not about being smart. It is about giving your mind something true to chew on repeatedly. Meditation (in the biblical sense) is returning to the verse again and again, letting it work on you.', reflection_q: 'What does it mean to "fix" God\'s word in your heart? How is that different from just reading it?' },
    workout: { premade_id: 'strength-circuit', motivational_tip: 'Repetition builds strength. Whether in muscles or memory, consistency is key.', coach_note: 'The discipline of memorization trains your discipline in all areas.' },
    nutrition: { focus: 'Sustained Focus', meal_theme: 'Energy', plan: 'Eat for sustained energy and mental clarity. Complex carbs, steady proteins, foods that don\'t crash.', tip: 'Blood sugar stability affects memory stability.', recipe_search: 'sustained energy brain food' },
    journal: { prompt: 'Which spiritual disciplines are easiest for you? Which are hardest? What does memorization require?', entry_type: 'general' },
    affirmation: 'I discipline my mind to hold God\'s word. In repetition, I find truth.',
    personal_growth_page: 'SpiritualGrowth', personal_growth_label: 'Spiritual Growth',
  },
  {
    day: 3, week: 1, title: 'Meditation: Chewing the Cud',
    bible: { book: 'Joshua', chapter: 1, verse_range: '8', key_verse: '"Keep this Book of the Law always on your lips; meditate on it day and night, so that you may be careful to do everything written in it." — Joshua 1:8', devotion: 'In Hebrew, meditation (hagah) means to mutter, to muse, to chew repeatedly — like a cow chewing cud. You are not trying to memorize for memorization\'s sake. You are returning again and again to let the verse transform your thinking.', reflection_q: 'What does it mean to "meditate" on Scripture? Is it different from just reading it?' },
    workout: { premade_id: 'yoga-flow', motivational_tip: 'In yoga, you return to the breath repeatedly. In Scripture, return to the verse.', coach_note: 'Meditation is both physical and spiritual. Yoga teaches your body to meditate.' },
    nutrition: { focus: 'Reflective Eating', meal_theme: 'Mindfulness', plan: 'Eat slowly, returning to the present moment with each bite. Let eating teach you meditation.', tip: 'Meditation with food teaches meditation with Scripture.', recipe_search: 'mindful eating meditation' },
    journal: { prompt: 'Take one verse and meditate on it: write it, then write what comes to you as you sit with it. What does it reveal?', entry_type: 'scripture_reflection' },
    affirmation: 'I meditate on God\'s word, returning again and again. In the repetition, I am transformed.',
    personal_growth_page: 'BibleStudyGuide', personal_growth_label: 'Bible Study',
  },
  ...Array.from({ length: 4 }, (_, i) => ({
    day: 4 + i, week: 1,
    title: ['Choose Your Verses','Memory Aids','Practice Deep','Sabbath: Rest in Truth'][i],
    bible: {
      book: ['Psalm','Proverbs','Timothy','Matthew'][i],
      chapter: [119, 22, 2, 6][i],
      verse_range: ['105','3','15','31'][i],
      key_verse: [
        '"Your word is a lamp to my feet and a light to my path." — Psalm 119:105',
        '"Train up a child in the way they should go; even when old, they will not depart from it." — Proverbs 22:6',
        '"Present yourself to God as one approved, a worker who... correctly handles the word of truth." — 2 Timothy 2:15',
        '"His divine power has given us everything we need for a godly life." — 2 Peter 1:3',
      ][i],
      devotion: [
        'The verses you choose should speak to your life, your season, your current struggles and celebrations. Choose wisely.',
        'Mnemonic devices, repetition patterns, and spatial memory all help. Your brain is designed to remember.',
        'The more you practice, the more natural the recall becomes. Practice is not punishment. It is investment.',
        'You have completed one week of training your mind. Rest in the truth you are beginning to hold.',
      ][i],
      reflection_q: [
        'What theme of Scripture does your life most need right now?',
        'What memory techniques work best for you?',
        'How often do you need to review a verse before it sticks?',
        'What has Week 1 revealed about your capacity for Scripture memorization?',
      ][i],
    },
    workout: { premade_id: ['morning-energizer','yoga-flow','strength-circuit','bedtime-stretch'][i], motivational_tip: ['Choose verses that speak to you.','Memory is a skill that improves with use.','Practice is the path to mastery.','Week 1 complete. You have begun.'][i], coach_note: ['Start with 5-7 verses. Quality over quantity.','Different techniques work for different people. Find yours.','Consistency beats intensity. Small daily practice outperforms occasional cramming.','Celebrate the beginning.'][i] },
    nutrition: { focus: ['Choice & Intention','Fuel the Work','Consistent Nourishment','Celebrate & Rest'][i], meal_theme: ['Selection','Sustenance','Consistency','Integration'][i], plan: ['Eat mindfully today, choosing foods that nourish. Just as you\'re choosing verses that nourish.','Eat foods that fuel mental clarity and sustained focus.','Eat consistently well. Small daily nourishment is the foundation.','Celebrate one week of Scripture memorization discipline.'][i], tip: ['Intentional choices in food mirror intentional choices in Scripture.','Your brain needs fuel to do this work.','Consistency in nutrition mirrors consistency in memorization.','Celebration confirms commitment.'][i], recipe_search: ['intentional mindful meal','brain fuel sustained','consistent nutrition','celebration feast'][i] },
    journal: { prompt: ['Which verses are you choosing to memorize? Why these?','How is the practice of memorization going?','Describe the practice: how often, how you\'re studying, what\'s working.','Week 1 reflection: What has this week taught you about training your mind?'][i], entry_type: i === 3 ? 'weekly_reflection' : 'general' },
    affirmation: ['I choose Scripture that nourishes me.','I train my mind to hold truth.','I am consistent in this discipline.','I am becoming a person who knows God\'s word.'][i],
    personal_growth_page: ['BibleBooks','SpiritualGrowth','MindsetResetPage','WeeklyReflectionPage'][i],
    personal_growth_label: ['Bible','Spiritual Growth','Mindset Reset','Weekly Reflection'][i],
  })),

  // Weeks 2-8 abbreviated (continue pattern)
  ...Array.from({ length: 7 }, (_, weekIndex) => 
    Array.from({ length: 7 }, (_, dayIndex) => ({
      day: 8 + (weekIndex * 7) + dayIndex,
      week: 2 + weekIndex,
      title: [
        ['God is Good','God is Faithful','God is Love','God Sees You','God is Enough','Proclaim God\'s Character','Sabbath: Rest in God\'s Nature'],
        ['Loved Completely','Made in His Image','Empowered','New Creation','Redeemed','Living Your Identity','Sabbath: Accepting Your Identity'],
        ['All Things Work','Protected','Sufficient Grace','Promises to Stand On','Hope for Tomorrow','Claiming Your Promises','Sabbath: Standing on the Promises'],
        ['Comfort in Loss','Strength in Weakness','Truth Over Fear','Healing Words','Rest for the Weary','Surviving the Hard','Sabbath: Peace in Crisis'],
        ['Wisdom for Today','Proverbs for Living','Guidance','Choices Matter','Daily Bread','Living the Wisdom','Sabbath: Living from Truth'],
        ['Authority in Christ','Taking Thoughts Captive','Weapons of Warfare','Standing Firm','Victory Declared','Walking in Strength','Sabbath: Victorious Living'],
        ['Transformed Mind','Renewed Heart','Hidden Verses','Lived Truth','Sharing What You Know','Teaching Scripture','Sabbath: The Transformed Life'],
      ][weekIndex][dayIndex],
      bible: { book: 'Bible', chapter: 1, verse_range: '1', key_verse: 'Scripture builds throughout the weeks', devotion: 'Each week adds depth to your Scripture memory practice.' },
      workout: { premade_id: 'morning-energizer', motivational_tip: 'Keep practicing. Memory is a discipline.', coach_note: 'Consistent practice transforms.' },
      nutrition: { focus: 'Brain & Spirit', meal_theme: 'Fuel', plan: 'Eat well to think well. Your body and mind work together.', tip: 'Nourishment supports memorization.', recipe_search: 'brain healthy foods' },
      journal: { prompt: 'What verses are taking root in your heart?', entry_type: dayIndex === 6 ? 'weekly_reflection' : 'general' },
      affirmation: 'I hide God\'s word in my heart. It transforms me.',
      personal_growth_page: 'BibleBooks', personal_growth_label: 'Bible',
    }))
  ).flat(),
];

export const SCRIPTURE_MEMORY_PLAN = {
  id: 'scripture-memory-program',
  title: 'Hide It in Your Heart',
  subtitle: '8-Week Scripture Memorization & Meditation Program',
  description: 'Hide God\'s word in your heart where it becomes your guide, your weapon, and your comfort. This 8-week program teaches you to memorize and meditate on Scripture, transforming your thinking and renewing your mind through systematic, disciplined practice.',
  weeks: 8,
  days_total: 56,
  difficulty: 'All Levels',
  gradient: 'from-[#dc2626] to-[#0A1A2F]',
  accent: '#dc2626',
  cover_emoji: '📖',
  tags: ['Bible', 'Scripture', 'Memorization', 'Meditation', 'Spirituality'],
  category: 'spiritual',
  week_themes: SCRIPTURE_MEMORY_WEEK_THEMES,
  days: SCRIPTURE_MEMORY_DAYS,
};

export default SCRIPTURE_MEMORY_PLAN;