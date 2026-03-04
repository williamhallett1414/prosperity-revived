// ─────────────────────────────────────────────────────────────────────────────
// THE LISTENING HEART — 8-Week Contemplative Prayer & Stillness Program
// ─────────────────────────────────────────────────────────────────────────────

export const CONTEMPLATIVE_PRAYER_WEEK_THEMES = [
  { week: 1, theme: 'Learning to Listen',     title: 'God Speaks in Silence',        color: 'from-[#3b82f6] to-[#0A1A2F]', accent: '#3b82f6', emoji: '🧘' },
  { week: 2, theme: 'Centering Prayer',       title: 'Sacred Word Practice',         color: 'from-[#8b5cf6] to-[#0A1A2F]', accent: '#8b5cf6', emoji: '💫' },
  { week: 3, theme: 'Lectio Divina',          title: 'Divine Reading',              color: 'from-[#06b6d4] to-[#0A1A2F]', accent: '#06b6d4', emoji: '📖' },
  { week: 4, theme: 'Contemplative Walking',  title: 'Sacred Movement',             color: 'from-[#10b981] to-[#0A1A2F]', accent: '#10b981', emoji: '🚶' },
  { week: 5, theme: 'Breath as Prayer',       title: 'The Jesus Prayer',            color: 'from-[#f59e0b] to-[#0A1A2F]', accent: '#f59e0b', emoji: '💨' },
  { week: 6, theme: 'Silence & Solitude',     title: 'Desert Wisdom',               color: 'from-[#ec4899] to-[#0A1A2F]', accent: '#ec4899', emoji: '🏜️' },
  { week: 7, theme: 'Surrender',              title: 'Letting Go',                  color: 'from-[#a855f7] to-[#0A1A2F]', accent: '#a855f7', emoji: '🕊️' },
  { week: 8, theme: 'Transformed by Presence', title: 'The Contemplative Life',     color: 'from-[#14b8a6] to-[#0A1A2F]', accent: '#14b8a6', emoji: '✨' },
];

export const CONTEMPLATIVE_PRAYER_DAYS = [
  {
    day: 1, week: 1, title: 'God Speaks in Silence',
    bible: { book: 'Psalm', chapter: 46, verse_range: '10', key_verse: '"Be still, and know that I am God." — Psalm 46:10', devotion: 'The loudest voice in your life is usually your own thought. This 8-week journey is about learning to quiet that voice so you can hear another one. Contemplative prayer is not asking God for things. It is listening to God be God.', reflection_q: 'When was the last time you experienced genuine silence? What did it feel like?' },
    workout: { premade_id: 'morning-energizer', motivational_tip: 'Movement prepares the body to be still. We wake up the body so the spirit can rest.', coach_note: 'This week is about quieting. Start with gentle movement.' },
    nutrition: { focus: 'Mindful Eating', meal_theme: 'Presence', plan: 'Eat one meal in complete silence today. No screens, no talking — just presence with your food and your breath.', tip: 'Silence teaches your nervous system that you are safe.', recipe_search: 'simple meditative meal' },
    journal: { prompt: 'What is the sound of silence for you? What would it mean to hear God in it?', entry_type: 'general' },
    affirmation: 'In silence, I hear God. In stillness, I know His presence.',
    personal_growth_page: 'GuidedMeditationsPage', personal_growth_label: 'Guided Meditation',
  },
  {
    day: 2, week: 1, title: 'The Practice of Presence',
    bible: { book: 'Proverbs', chapter: 8, verse_range: '34', key_verse: '"Blessed are those who listen to me, watching daily at my doors, waiting at my doorway." — Proverbs 8:34', devotion: 'Wisdom waits at the door of those who listen. Not those who demand or ask, but those who wait and watch. Contemplative prayer is the practice of waiting at the door.', reflection_q: 'What does it mean to "watch daily at the door"? How is that different from typical prayer?' },
    workout: { premade_id: 'yoga-flow', motivational_tip: 'Yoga teaches you to be present in your body. That presence is the foundation of prayer.', coach_note: 'Yoga is moving meditation. Let it be your prayer today.' },
    nutrition: { focus: 'Intentional Eating', meal_theme: 'Sacred Fuel', plan: 'Eat with the awareness that you are being nourished by God. Each bite is a gift. Eat it that way.', tip: 'Intentional eating is a form of prayer.', recipe_search: 'sacred wholesome meal' },
    journal: { prompt: 'What are you waiting for God to say to you? What doors are you watching?', entry_type: 'general' },
    affirmation: 'I wait at the door of wisdom. I listen for God\'s voice in the silence.',
    personal_growth_page: 'GuidedMeditationsPage', personal_growth_label: 'Guided Meditation',
  },
  {
    day: 3, week: 1, title: 'Quieting the Inner Noise',
    bible: { book: 'Philippians', chapter: 4, verse_range: '6–7', key_verse: '"Do not be anxious about anything... present your requests to God. And the peace of God... will guard your hearts and minds." — Philippians 4:6–7', devotion: 'The inner noise is usually anxiety, planning, worry, rehearsal. Contemplative prayer begins by offering all of that to God and asking for the peace that guards your mind. That peace is not dependent on your circumstances being solved. It is dependent on your mind being at rest in God.', reflection_q: 'What is the loudest noise in your inner world right now? Can you name it and hand it over?' },
    workout: { premade_id: 'bedtime-stretch', motivational_tip: 'Stretching releases what your body has been holding. Let it go.', coach_note: 'Gentle movement helps your nervous system shift from activation to rest.' },
    nutrition: { focus: 'Anxiety Release', meal_theme: 'Calming', plan: 'Eat foods that calm your nervous system: magnesium-rich greens, omega-3s, foods that settle rather than stimulate.', tip: 'What you eat affects the noise level of your mind.', recipe_search: 'calming nervous system foods' },
    journal: { prompt: 'Name three sources of inner noise. For each one, write: "I give this to God."', entry_type: 'emotional_checkin' },
    affirmation: 'The peace of God quiets my mind. I release the noise and rest in His presence.',
    personal_growth_page: 'EmotionalCheckInPage', personal_growth_label: 'Emotional Check-In',
  },
  ...Array.from({ length: 4 }, (_, i) => ({
    day: 4 + i, week: 1,
    title: ['God in the Ordinary','Dwelling in His Presence','Sabbath: Deep Rest','Week 1 Reflection'][i],
    bible: {
      book: ['Exodus','John','Genesis','Psalm'][i],
      chapter: [3, 15, 2, 139][i],
      verse_range: ['5','4–5','1–3','14'][i],
      key_verse: [
        '"Do not come any closer," God said. "Take off your sandals, for the place where you are standing is holy ground." — Exodus 3:5',
        '"I am the vine; you are the branches... Remain in me, and I will remain in you." — John 15:4–5',
        '"By the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work." — Genesis 2:2–3',
        '"I praise you because I am fearfully and wonderfully made." — Psalm 139:14',
      ][i],
      devotion: [
        'God is not confined to prayer closets. He is in the ordinary, the mundane, the everyday. The ground where you stand is holy when you recognize His presence there.',
        'Remaining in God is not effort. It is surrender. When you stop striving and start resting in connection, everything changes.',
        'God rested. Not because He was tired, but because rest is holy. This week you have learned to rest. Now rest fully.',
        'You are fearfully and wonderfully made for this contemplative life. Your capacity for silence, for listening, for stillness — these are not escapes. They are the deepest engagement with reality.',
      ][i],
      reflection_q: [
        'Where do you experience God\'s presence most naturally? In nature? In quiet? In solitude?',
        'What would it look like to "remain" in God — to stay connected throughout your day?',
        'How has this week of learning silence changed you?',
        'What has Week 1 taught you about your capacity for contemplation?',
      ][i],
    },
    workout: { premade_id: ['morning-energizer','yoga-flow','bedtime-stretch','power-yoga'][i], motivational_tip: ['God is in this moment. Let movement be your prayer.','Remain in this flow. In flow, you remain in Him.','Rest as a spiritual discipline.','You are made for this contemplative life.'][i], coach_note: ['Holiness is everywhere. Movement opens your eyes to it.','The deepest spiritual practice is often the simplest.','Week 1 complete. You have begun.','Let this be your celebration of the beginning.'][i] },
    nutrition: { focus: ['Sacred Ordinary','Abiding Nourishment','Rest & Restore','Gratitude Feast'][i], meal_theme: ['Holy Ground','Connection','Integration','Celebration'][i], plan: ['Eat an ordinary meal as if it were sacred. Because it is.','Eat while dwelling in gratitude for God\'s presence. Let eating be abiding.','Rest from meal preparation today. Be nourished without effort.','Cook a meal that celebrates the beginning of your contemplative journey.'][i], tip: ['Holiness is in the ordinary when you see it.','Gratitude transforms any meal into communion.','Rest is part of the protocol.','Celebration confirms the beginning.'][i], recipe_search: ['simple sacred meal','gratitude nourishment','rest restore healing','celebration thanksgiving'][i] },
    journal: { prompt: ['Where do you see God in the ordinary parts of your day?','How does remaining in God change your daily rhythms?','Week 1 reflection: What has this week revealed about your need for silence?','What is the most important thing you\'ve learned about contemplative prayer?'][i], entry_type: i === 3 ? 'weekly_reflection' : 'general' },
    affirmation: ['The ground where I stand is holy. God is here.','I remain in God. In Him, I abide.','I rest in God\'s presence. Rest is holy.','I am made for this. Contemplation is my native language.'][i],
    personal_growth_page: ['SpiritualGrowth','GuidedMeditationsPage','GuidedMeditationsPage','WeeklyReflectionPage'][i],
    personal_growth_label: ['Spiritual Growth','Guided Meditation','Guided Meditation','Weekly Reflection'][i],
  })),

  // Weeks 2-8 abbreviated structure (continue pattern)
  ...Array.from({ length: 7 }, (_, weekIndex) => 
    Array.from({ length: 7 }, (_, dayIndex) => ({
      day: 8 + (weekIndex * 7) + dayIndex,
      week: 2 + weekIndex,
      title: [
        ['Sacred Word Discovery','Releasing the Word','Healing Prayer','Divine Silence','Surrender Practice','Extending Silence','Sabbath: Contemplative Rest'],
        ['Lectio Divina Foundation','Meditatio: Chewing','Oratio: Conversing','Contemplatio: Resting','Journaling as Prayer','Deepening the Practice','Sabbath: Divine Encounter'],
        ['Walking with God','Labyrinth Prayer','Sacred Spaces','Movement as Worship','Trail Contemplation','Integration of Movement','Sabbath: Sacred Journey'],
        ['The Jesus Prayer','Breath and Heartbeat','Rhythmic Prayer','Continuous Prayer','Night Prayer','Integration','Sabbath: Breath as Praise'],
        ['Desert Hospitality','The Cloud of Unknowing','Apophatic Prayer','Nothingness as Fullness','Extended Silence','Community in Solitude','Sabbath: Companionable Silence'],
        ['Surrender Practices','Dying to Self','Empty and Waiting','Receiving God\'s Will','Living the Surrender','Teaching Surrender','Sabbath: Perfect Peace'],
        ['Transformed Mind','Renewed Heart','Embodied Prayer','Living the Contemplative Life','Ongoing Practice','Sharing the Journey','Sabbath: Eternal Presence'],
      ][weekIndex][dayIndex],
      bible: {
        book: ['1 John','Luke','Isaiah','Mark','2 Corinthians','Colossians','Galatians'][weekIndex],
        chapter: [4, 10, 40, 1, 3, 3, 2][weekIndex],
        verse_range: ['8','38–42','28–31','35','16–18','1–3','20'][weekIndex],
        key_verse: [
          '"God is love." — 1 John 4:8',
          '"Mary has chosen what is better, and it will not be taken away from her." — Luke 10:42',
          '"Those who hope in the Lord will renew their strength." — Isaiah 40:31',
          '"Be still and know that I am God." — Mark 1:35',
          '"I have been crucified with Christ and I no longer live, but Christ lives in me." — 2 Corinthians 3:16–18',
          '"Set your minds on things above, not on earthly things." — Colossians 3:1–3',
          '"I have been crucified with Christ and I no longer live, but Christ lives in me." — Galatians 2:20',
        ][weekIndex],
        devotion: 'Contemplative prayer moves from word to silence, from asking to listening, from doing to being. Each week deepens the practice.'[weekIndex],
        reflection_q: 'How is your relationship with silence changing? What are you learning?'[weekIndex],
      },
      workout: { premade_id: 'morning-energizer', motivational_tip: 'Move in prayer today.', coach_note: 'The body is part of contemplation.' },
      nutrition: { focus: 'Contemplative Eating', meal_theme: 'Presence', plan: 'Eat in silence, with presence.', tip: 'Eating is a form of prayer.', recipe_search: 'meditative meal' },
      journal: { prompt: 'What is God teaching you this week?', entry_type: dayIndex === 6 ? 'weekly_reflection' : 'general' },
      affirmation: 'I am being transformed by God\'s presence. I am becoming contemplative.',
      personal_growth_page: 'GuidedMeditationsPage', personal_growth_label: 'Guided Meditation',
    }))
  ).flat(),
];

export const CONTEMPLATIVE_PRAYER_PLAN = {
  id: 'contemplative-prayer-program',
  title: 'The Listening Heart',
  subtitle: '8-Week Contemplative Prayer & Stillness Program',
  description: 'Journey into the ancient practices of contemplative prayer: centering prayer, lectio divina, sacred silence, and the Jesus prayer. This 8-week program teaches you to quiet the noise, listen to God\'s voice, and live from a place of deep spiritual presence.',
  weeks: 8,
  days_total: 56,
  difficulty: 'All Levels',
  gradient: 'from-[#3b82f6] to-[#0A1A2F]',
  accent: '#3b82f6',
  cover_emoji: '🧘',
  tags: ['Prayer', 'Spirituality', 'Contemplation', 'Meditation', 'Faith'],
  week_themes: CONTEMPLATIVE_PRAYER_WEEK_THEMES,
  days: CONTEMPLATIVE_PRAYER_DAYS,
};

export default CONTEMPLATIVE_PRAYER_PLAN;