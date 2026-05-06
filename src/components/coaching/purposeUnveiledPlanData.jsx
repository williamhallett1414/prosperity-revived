// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE UNVEILED — 8-Week Divine Purpose & Life Direction Program
// ─────────────────────────────────────────────────────────────────────────────

export const PURPOSE_UNVEILED_WEEK_THEMES = [
  { week: 1, theme: 'Discovering Your Calling',    title: 'What Are You Here For?',     color: 'from-[#f59e0b] to-[#0A1A2F]', accent: '#f59e0b', emoji: '🎯' },
  { week: 2, theme: 'Your Unique Design',          title: 'Gifts, Skills & Passions',   color: 'from-[#ec4899] to-[#0A1A2F]', accent: '#ec4899', emoji: '💎' },
  { week: 3, theme: 'Story & Testimony',           title: 'How Your Past Shapes Purpose', color: 'from-[#06b6d4] to-[#0A1A2F]', accent: '#06b6d4', emoji: '📚' },
  { week: 4, theme: 'Vision Clarification',        title: 'Seeing Your Future Clearly', color: 'from-[#10b981] to-[#0A1A2F]', accent: '#10b981', emoji: '🔮' },
  { week: 5, theme: 'Overcoming Obstacles',        title: 'Fear, Doubt & Resistance',   color: 'from-[#ef4444] to-[#0A1A2F]', accent: '#ef4444', emoji: '⚡' },
  { week: 6, theme: 'Building Your Path',          title: 'From Vision to Action',      color: 'from-[#3b82f6] to-[#0A1A2F]', accent: '#3b82f6', emoji: '🛤️' },
  { week: 7, theme: 'Living On Purpose',           title: 'Integration & Alignment',    color: 'from-[#8b5cf6] to-[#0A1A2F]', accent: '#8b5cf6', emoji: '✨' },
  { week: 8, theme: 'Purpose as Legacy',           title: 'Your Eternal Impact',        color: 'from-[#a78bfa] to-[#0A1A2F]', accent: '#a78bfa', emoji: '👑' },
];

export const PURPOSE_UNVEILED_DAYS = [
  {
    day: 1, week: 1, title: 'Why Purpose Matters',
    bible: { book: 'Jeremiah', chapter: 29, verse_range: '11', key_verse: '"For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope." — Jeremiah 29:11', devotion: 'God does not call you to exist. He calls you to thrive with intention. You are not an accident, and your life is not random. Purpose is not luxury — it is the foundation of a meaningful life. This 8-week journey invites you to discover what God has always known: why you are here.', reflection_q: 'When do you feel most alive? When do you lose track of time because you\'re so engaged?' },
    workout: { premade_id: 'morning-energizer', motivational_tip: 'Energy follows purpose. Moving toward your calling energizes you.', coach_note: 'This week, we wake up to your deeper calling.' },
    nutrition: { focus: 'Purposeful Eating', meal_theme: 'Fuel for Discovery', plan: 'Eat as an act of honoring the body and life you\'ve been given. Intentional nourishment supports intentional living.', tip: 'How you feed yourself mirrors how you approach your life\'s purpose.', recipe_search: 'intentional meaningful meal' },
    journal: { prompt: 'What is your gut answer to "why are you here?" Don\'t overthink it — what\'s your first honest response?', entry_type: 'general' },
    affirmation: 'I am here for a reason. I am ready to discover it.',
    personal_growth_page: 'PersonalGrowth', personal_growth_label: 'Personal Growth',
  },
  {
    day: 2, week: 1, title: 'God\'s Design & Your Purpose',
    bible: { book: 'Psalm', chapter: 139, verse_range: '14', key_verse: '"I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well." — Psalm 139:14', devotion: 'You are not a random creation. Every gift you have, every experience you\'ve had, every struggle you\'ve survived — these are not accidents. They are the raw materials of your calling. Your purpose is woven from the very fabric of who you are.', reflection_q: 'What gifts do you have that feel most natural to you? What do people often ask you to help with?' },
    workout: { premade_id: 'strength-circuit', motivational_tip: 'You are wonderfully made. This body, this mind, this spirit — they are designed for your purpose.', coach_note: 'Strength training reminds you: you are strong enough for your calling.' },
    nutrition: { focus: 'Honoring Your Temple', meal_theme: 'Self-Respect', plan: 'Eat foods that honor the body you\'ve been given. Feed yourself like someone worthy of care — because you are.', tip: 'Self-respect in nutrition mirrors self-respect in pursuing purpose.', recipe_search: 'honoring nourishing meals' },
    journal: { prompt: 'List 10 gifts, skills, or strengths you have. Don\'t be humble — be honest. What are you genuinely good at?', entry_type: 'general' },
    affirmation: 'I am wonderfully designed. My gifts are not accidents — they are my calling.',
    personal_growth_page: 'IdentityInChristPage?focus=wonderfully-made', personal_growth_label: 'Identity in Christ',
  },
  {
    day: 3, week: 1, title: 'The Difference Between Purpose & Career',
    bible: { book: 'Colossians', chapter: 3, verse_range: '23–24', key_verse: '"Whatever you do, work at it with all your heart, as working for the Lord, not for human masters, since you know that you will receive an inheritance from the Lord as a reward. It is the Lord Christ you are serving." — Colossians 3:23–24', devotion: 'Your purpose is not necessarily your career. It might be expressed through your work, but it might also be expressed through your relationships, your community, your creative expression, or your spiritual gifts. Purpose is the "why" — the deep reason you are here. Career is one possible "how."', reflection_q: 'What would you do if you never needed to earn money? What does that reveal about your true purpose?' },
    workout: { premade_id: 'yoga-flow', motivational_tip: 'Purpose flows through you like breath flows through yoga. It is both the practice and the point.', coach_note: 'Yoga teaches you to act from your center, not from external pressure.' },
    nutrition: { focus: 'Nourishment vs. Consumption', meal_theme: 'Genuine Fuel', plan: 'Distinguish between food that nourishes and food that numbs. Apply this same clarity to purpose: are you living what nourishes you?', tip: 'Your relationship with food mirrors your relationship with purpose — do you honor it or ignore it?', recipe_search: 'authentic nourishing meals' },
    journal: { prompt: 'If you removed "what makes money," what activities would still matter to you? That\'s closer to your purpose.', entry_type: 'general' },
    affirmation: 'My purpose is bigger than my career. I am here to impact, to serve, to love.',
    personal_growth_page: 'MindsetResetPage', personal_growth_label: 'Mindset Reset',
  },
  ...Array.from({ length: 4 }, (_, i) => ({
    day: 4 + i, week: 1,
    title: ['Your Legacy Already','Seeking Clarity','Overcoming Noise','Sabbath: Purpose Rest'][i],
    bible: {
      book: ['Romans','Proverbs','Psalm','Proverbs'][i],
      chapter: [12, 27, 27, 19][i],
      verse_range: ['1–2','12','11','14'][i],
      key_verse: [
        '"Therefore, I urge you, brothers and sisters, in view of God\'s mercy, to offer your bodies as a living sacrifice... This is your true and proper worship." — Romans 12:1–2',
        '"Do you see someone skilled in their work? They will serve before kings." — Proverbs 22:29',
        '"One thing I ask from the Lord, this only do I seek: that I may dwell in the house of the Lord all the days of my life." — Psalm 27:4',
        '"A good name is more desirable than great riches; to be esteemed is better than silver or gold." — Proverbs 22:1',
      ][i],
      devotion: [
        'You are already leaving a legacy. Every interaction, every choice shapes the world around you. This week is not about creating legacy — it\'s about being intentional with the one you\'re already creating.',
        'Clarity comes from slowing down and listening. This week, create space to hear your own heart.',
        'The noise of other people\'s expectations, culture\'s demands, and social media\'s noise drowns out your true calling. We are quieting that noise.',
        'You have completed the first week of discovering your purpose. Rest in the clarity that is beginning to emerge.',
      ][i],
      reflection_q: [
        'What legacy do you want to leave? How are your daily choices moving you toward or away from that?',
        'What would clarity about your purpose feel like?',
        'Whose expectations are loudest in your life? Are they your own?',
        'What has Week 1 revealed about your deep calling?',
      ][i],
    },
    workout: { premade_id: ['morning-energizer','strength-circuit','yoga-flow','bedtime-stretch'][i], motivational_tip: ['Every movement matters. You are already leaving your mark.','True strength is living your purpose.','Quiet your mind to hear your calling.','Rest in the emerging clarity.'][i], coach_note: ['Legacy is daily practice. Every workout, every meal, every interaction counts.','Clarity requires space. Strength training creates mental space.','Yoga quiets the noise. In silence, you hear truth.','Week 1 complete. You are beginning to see.'][i] },
    nutrition: { focus: ['Legacy Meals','Clear Choices','Mindful Nourishment','Celebratory Feast'][i], meal_theme: ['Impact','Clarity','Intention','Integration'][i], plan: ['Eat a meal that reflects the legacy you want to leave. Nourish yourself the way you want to nourish others.','Eat with clear choices — not from habit, not from emotion, but from intention.','Eat mindfully, noticing each bite. This is practicing purpose.','Celebrate one week of deep work on your calling.'][i], tip: ['Your meals are a form of legacy. Feed yourself and others well.','Clarity in eating mirrors clarity in purpose.','Intention in meals is intention in life.','Celebration marks the beginning.'][i], recipe_search: ['legacy meaningful meal','clear intentional choices','mindful conscious eating','celebration thanksgiving'][i] },
    journal: { prompt: ['What legacy do you want to be remembered for?','What brings you clarity about your purpose?','What noise do you most need to silence?','Week 1 reflection: What is emerging about your calling?'][i], entry_type: i === 3 ? 'weekly_reflection' : 'general' },
    affirmation: ['I am building my legacy now. Every choice matters.','Clarity is emerging. I am finding my way.','I silence the noise and listen to my own truth.','I am discovering my purpose. It is becoming clear.'][i],
    personal_growth_page: ['Community','SpiritualGrowth','GuidedMeditationsPage','WeeklyReflectionPage'][i],
    personal_growth_label: ['Community','Spiritual Growth','Guided Meditation','Weekly Reflection'][i],
  })),

  // Weeks 2-8 abbreviated
  ...Array.from({ length: 7 }, (_, weekIndex) => 
    Array.from({ length: 7 }, (_, dayIndex) => ({
      day: 8 + (weekIndex * 7) + dayIndex,
      week: 2 + weekIndex,
      title: [
        ['Gifts Inventory','Skills Assessment','Passion Exploration','Values Clarification','Strengths Profile','Your Unique Mix','Sabbath: Celebrating You'],
        ['Hardship & Healing','Triumph & Testimony','Turning Points','Failure as Teacher','Seasons & Growth','Your Story Matters','Sabbath: Honoring Your Journey'],
        ['Vision Exercise','Dreams Unfiltered','Concrete Vision','Values Alignment','Desired Impact','Visualizing Success','Sabbath: Holding the Vision'],
        ['Fear Inventory','Doubt Deconstruction','Breaking Through','Permission to Pursue','Courage Building','Taking the First Step','Sabbath: Fear Transformed'],
        ['Strategic Planning','Breaking It Down','Building Momentum','Milestones & Metrics','Progress Tracking','Adjusting Course','Sabbath: The Steady Path'],
        ['Daily Alignment','Work as Worship','Rest as Practice','Community & Calling','Balance & Rhythms','Living the Vision','Sabbath: Purpose Integrated'],
        ['Legacy Clarity','Generosity & Impact','Teaching Others','Leaving Your Mark','Eternal Perspective','Your Unfolding Purpose','Sabbath: Purpose Eternal'],
      ][weekIndex][dayIndex],
      bible: { book: 'Bible', chapter: 1, verse_range: '1', key_verse: 'Your purpose unfolds over time.' },
      workout: { premade_id: 'morning-energizer', motivational_tip: 'Keep moving toward your calling.', coach_note: 'Consistency builds momentum.' },
      nutrition: { focus: 'Purpose Fuel', meal_theme: 'Energy', plan: 'Eat to fuel the life you\'re building.', tip: 'Nourishment supports calling.', recipe_search: 'purposeful nutrition' },
      journal: { prompt: 'What is God revealing about your purpose?', entry_type: dayIndex === 6 ? 'weekly_reflection' : 'general' },
      affirmation: 'I am living my purpose with clarity and courage.',
      personal_growth_page: 'PersonalGrowth', personal_growth_label: 'Personal Growth',
    }))
  ).flat(),
];

export const PURPOSE_UNVEILED_PLAN = {
  id: 'purpose-unveiled-program',
  title: 'Purpose Unveiled',
  subtitle: '8-Week Divine Purpose & Life Direction Program',
  description: 'Discover why you are here. This 8-week program guides you through identifying your gifts, exploring your unique design, overcoming obstacles to your calling, and building a life aligned with your deepest purpose. Move from confusion to clarity to action.',
  weeks: 8,
  days_total: 56,
  difficulty: 'All Levels',
  gradient: 'from-[#f59e0b] to-[#0A1A2F]',
  accent: '#f59e0b',
  cover_emoji: '🎯',
  tags: ['Purpose', 'Calling', 'Vision', 'Life Direction', 'Personal Growth'],
  category: 'personal',
  week_themes: PURPOSE_UNVEILED_WEEK_THEMES,
  days: PURPOSE_UNVEILED_DAYS,
};

export default PURPOSE_UNVEILED_PLAN;