// ─────────────────────────────────────────────────────────────────────────────
// PROSPERITY REVIVED — LOVE LANGUAGES COACHING PLAN
// "Love That Lasts: 8-Week Relationship Transformation"
// Based on the Five Love Languages by Gary Chapman
// ─────────────────────────────────────────────────────────────────────────────

export const LOVE_LANGUAGES_WEEK_THEMES = [
  { week: 1, theme: 'Foundation',        title: 'What Love Really Is',         color: 'from-[#e11d48] to-[#9f1239]', accent: '#e11d48', emoji: '❤️' },
  { week: 2, theme: 'Understanding',     title: 'Learning to Truly See',        color: 'from-[#9f1239] to-[#0A1A2F]', accent: '#fb7185', emoji: '👁️' },
  { week: 3, theme: 'Words',             title: 'Words of Affirmation',         color: 'from-[#be123c] to-[#e11d48]', accent: '#fda4af', emoji: '🗣️' },
  { week: 4, theme: 'Time',              title: 'Quality Time',                 color: 'from-[#0A1A2F] to-[#e11d48]', accent: '#fb7185', emoji: '⏰' },
  { week: 5, theme: 'Service',           title: 'Acts of Service',              color: 'from-[#e11d48] to-[#0A1A2F]', accent: '#fda4af', emoji: '🤝' },
  { week: 6, theme: 'Healing',           title: 'Forgiveness & Repair',         color: 'from-[#881337] to-[#0A1A2F]', accent: '#fb7185', emoji: '🕊️' },
  { week: 7, theme: 'Culture',           title: 'Building a Love Culture',      color: 'from-[#0A1A2F] to-[#be123c]', accent: '#fda4af', emoji: '🏡' },
  { week: 8, theme: 'Legacy',            title: 'Love That Lasts',              color: 'from-[#e11d48] to-[#0A1A2F]', accent: '#e11d48', emoji: '♾️' },
];

export const LOVE_LANGUAGES_DAYS = [

  // ═══════════════════════════════════════════════════════════════════════════
  // WEEK 1 — THE FOUNDATION OF LOVE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    day: 1, week: 1, title: 'What Is Love, Really?',
    bible: { book: '1 John', chapter: 4, verse_range: '7–8', key_verse: '"Whoever does not love does not know God, because God is love." — 1 John 4:8', devotion: 'Love isn\'t just something God does — it\'s who He is. Every healthy relationship you\'ll ever build starts here: at the source. Before we talk about love languages, communication styles, or conflict patterns, we begin with this bedrock truth. God is love, and every genuine act of human love is a reflection of His nature flowing through imperfect people toward other imperfect people. This week is about understanding what love actually is — not Hollywood love, not transactional love, but the kind that endures.', reflection_q: 'What was the primary way love was shown to you growing up — through words, actions, time, gifts, or touch? How has that shaped how you give and receive love today?' },
    workout: { premade_id: 'morning-energizer', motivational_tip: 'Just as physical health requires daily habits, love requires daily intention. Start building both today.', coach_note: 'Day 1 is about showing up. In fitness and in love, consistency beats intensity every time.' },
    nutrition: { focus: 'Relationship Challenge: Discover Your Love Language', meal_theme: 'Self-Awareness Day', plan: 'Take the Love Language self-assessment: For each pair, choose which matters more. (A) Hearing "I love you / I\'m proud of you" vs (B) Someone doing something helpful without being asked. (A) Receiving a thoughtful gift vs (B) Having someone\'s undivided attention. (A) A long hug vs (B) A heartfelt written note. Tally your answers — your top result is likely your primary love language.', tip: 'Your love language is how YOU feel most loved. The languages you give most naturally reveal how you were loved growing up.', recipe_search: 'self care healthy breakfast' },
    journal: { prompt: 'Write down your top 2 love languages and one specific memory where you felt deeply loved in that language. What made that moment so meaningful? What does this tell you about what your relationships most need?', entry_type: 'general' },
    affirmation: 'I am capable of giving and receiving love deeply. My relationships can grow and transform starting today.',
    personal_growth_page: 'AffirmationsPage',
    personal_growth_label: 'Open Affirmations',
  },

  {
    day: 2, week: 1, title: 'The Power of Words of Affirmation',
    bible: { book: 'Proverbs', chapter: 18, verse_range: '21', key_verse: '"The tongue has the power of life and death." — Proverbs 18:21', devotion: 'Words are not neutral. Every sentence you speak either deposits life or withdraws it from the people around you. People whose love language is Words of Affirmation don\'t just want compliments — they need verbal acknowledgment that they are seen, valued, and appreciated. Generic praise bounces off. Specific praise penetrates. "You\'re great" means little. "The way you stayed calm when everything fell apart — I genuinely admire that" lands and lingers.', reflection_q: 'Think of the most encouraging words anyone has ever spoken over you. Write them down. How did those words change you? How long did they stay with you?' },
    workout: { premade_id: 'beginner-full-body', motivational_tip: 'The words you speak over your own body matter too. Speak life over yourself during this workout.', coach_note: 'Focus on form and breath. The internal dialogue during exercise shapes how you show up everywhere.' },
    nutrition: { focus: 'Relationship Challenge: Say It Specifically', meal_theme: 'Words as Nourishment', plan: 'Today, give 3 genuine, specific affirmations to 3 different people — each one with a "because." Not "you\'re amazing" but "the way you handled that situation showed real wisdom and I genuinely admire it." The "because" is what makes affirmation land rather than bounce off.', tip: 'Research shows specific compliments are remembered 3x longer than generic ones. Precision is love.', recipe_search: 'energy boosting meal' },
    journal: { prompt: 'Write 5 specific affirmations for someone in your life — things you\'ve noticed but never said out loud. Then write: what words do you wish someone would speak over you that you\'ve never heard? Write them to yourself first.', entry_type: 'general' },
    affirmation: 'My words have the power to build people up. I choose today to speak life into everyone I encounter.',
    personal_growth_page: 'AffirmationsPage',
    personal_growth_label: 'Open Affirmations',
  },

  {
    day: 3, week: 1, title: 'Acts of Service — Love in Action',
    bible: { book: 'Mark', chapter: 10, verse_range: '45', key_verse: '"For even the Son of Man did not come to be served, but to serve." — Mark 10:45', devotion: 'Jesus, the King of the universe, washed His disciples\' feet. Acts of Service isn\'t about being a doormat with no boundaries — it\'s about choosing to show love through action for someone whose heart opens when people do things for them. The person who always notices when you do (or don\'t) help, who says "I have to do everything myself" — they are probably not nagging. They are speaking their love language and not being heard.', reflection_q: 'Think of someone in your life whose love language might be Acts of Service. What are they really asking for when they express frustration about unmet needs?' },
    workout: { premade_id: 'core-crusher', motivational_tip: 'Service requires strength. Build the physical capacity to show up for others with energy and presence.', coach_note: 'A strong core represents stability and foundation — the same qualities that make acts of service sustainable rather than exhausting.' },
    nutrition: { focus: 'Relationship Challenge: Do One Unsolicited Thing', meal_theme: 'Service Practice', plan: 'Today, do one act of service for someone without being asked and without telling them you did it. Clean something, handle something they\'ve been meaning to do, take something off their plate. Notice the difference between serving to be seen vs. serving as a gift.', tip: 'The most powerful acts of service are the ones done when no one is watching or tracking. That is love, not transaction.', recipe_search: 'meal prep for someone else' },
    journal: { prompt: 'List 5 things the most important people in your life have asked you to do repeatedly. Translate each one: what love language need is underneath that repeated request? What would a loving, language-specific response look like?', entry_type: 'general' },
    affirmation: 'I serve from fullness and love, not from obligation or fear. My actions are gifts, freely given.',
    personal_growth_page: 'MyJournalEntries',
    personal_growth_label: 'Open Journal',
  },

  {
    day: 4, week: 1, title: 'Receiving Gifts — The Symbol Behind the Object',
    bible: { book: 'James', chapter: 1, verse_range: '17', key_verse: '"Every good and perfect gift is from above." — James 1:17', devotion: 'For people whose love language is Receiving Gifts, it is never about the money or the object. It is about what the gift communicates: you were on my mind, I thought of you, you matter enough for me to mark this moment. God Himself speaks this language — He gave us His Son. The gift-language person doesn\'t need expensive. They need thoughtful. The missed birthday, forgotten anniversary, or empty-handed return from a trip cuts them deeper than you realize — not because they\'re materialistic, but because they heard "you weren\'t worth remembering."', reflection_q: 'Think of a gift — however small — that someone gave you that meant everything. What made it so meaningful? What did it communicate that words couldn\'t?' },
    workout: { premade_id: 'yoga-flow', motivational_tip: 'Today\'s workout is a gift to your future self. Receive it with that intention.', coach_note: 'Flow with gratitude. Every stretch, every breath is a gift your body gives you.' },
    nutrition: { focus: 'Relationship Challenge: Give Without an Occasion', meal_theme: 'Thoughtful Giving', plan: 'Give someone a small, thoughtful, unexpected gift today — something that says "I thought of you." It doesn\'t have to cost anything: a note, their favorite coffee, a flower, a book you think they\'d love. The thought is the entire point.', tip: 'Keep a running list of things people mention wanting or liking. That list is relationship gold for gift-language people.', recipe_search: 'homemade gift food recipe' },
    journal: { prompt: 'Are you better at giving or receiving? What does that reveal about how you were taught to love? Write about one person whose repeated feelings of being forgotten might actually be a love language going unmet.', entry_type: 'gratitude' },
    affirmation: 'I notice the people in my life and mark the moments that matter to them. Thoughtfulness is one of my love gifts.',
    personal_growth_page: 'GratitudeJournalPage',
    personal_growth_label: 'Gratitude Journal',
  },

  {
    day: 5, week: 1, title: 'Quality Time — Presence Is the Present',
    bible: { book: 'Psalm', chapter: 46, verse_range: '10', key_verse: '"Be still, and know that I am God." — Psalm 46:10', devotion: 'Presence is one of the rarest gifts in the modern world. Even God speaks this language — He doesn\'t just want your requests, He wants your presence. People whose love language is Quality Time don\'t need grand events or expensive outings. They need you fully there: phone down, eyes up, heart open, genuinely interested. Two hours of distracted togetherness means less than five minutes of full, undivided attention. You cannot fake presence with a person whose love language is Quality Time — they feel your absence even when you\'re in the same room.', reflection_q: 'When was the last time you were fully present with someone you love — not distracted, not multitasking, not halfway somewhere else? What made that time feel different?' },
    workout: { premade_id: 'morning-energizer', motivational_tip: 'Be fully present in this workout — no phone, no mental wandering. Practice presence here first.', coach_note: 'Mindful exercise is practice for mindful relationships. Every rep done with full attention is training.' },
    nutrition: { focus: 'Relationship Challenge: Phone-Free Quality Time', meal_theme: 'Presence Practice', plan: 'Schedule one hour today that is completely phone-free with another person OR alone in reflection. No notifications, no checking. Full presence. Afterward, write: what opened up when the distractions were removed?', tip: 'Studies show that simply having a phone visible on the table — even face down — reduces the quality of conversation by measurable amounts. Put it away entirely.', recipe_search: 'slow dinner meal together' },
    journal: { prompt: 'Who in your life is quietly starving for your undivided attention? What has it cost that relationship? What habits or devices are stealing your presence from the people who matter most?', entry_type: 'general' },
    affirmation: 'When I am with someone, I am fully with them. My presence is one of the greatest gifts I can give.',
    personal_growth_page: 'GuidedMeditationsPage',
    personal_growth_label: 'Guided Meditation',
  },

  {
    day: 6, week: 1, title: 'Physical Touch — Connection Through Presence',
    bible: { book: 'Matthew', chapter: 8, verse_range: '3', key_verse: '"Jesus reached out his hand and touched the man." — Matthew 8:3', devotion: 'The leper hadn\'t been touched in years. Jesus could have healed him with a word from a distance. He chose to reach out and touch him first. For people whose love language is Physical Touch, connection is communicated through the body — a hug, a hand on the shoulder, physical closeness during a hard conversation. It\'s not primarily about romantic touch; it\'s about safety, belonging, and the wordless communication that says "I am here and you matter." Touch withheld from someone who speaks this language communicates distance, coldness, and disconnection even when none is intended.', reflection_q: 'What role has physical connection played in your most important relationships? Have you been starved for it? Have you withheld it without realizing it?' },
    workout: { premade_id: 'bedtime-stretch', motivational_tip: 'Your body is how you inhabit the world. Care for it with the same intentionality you bring to your relationships.', coach_note: 'Slow, intentional movement. Feel every stretch. Be present in your physical experience.' },
    nutrition: { focus: 'Relationship Challenge: Be Intentionally Present Physically', meal_theme: 'Safety and Warmth', plan: 'Today, offer one meaningful physical gesture of connection to someone you love — a longer hug than usual, sitting close during a conversation, a hand on their arm when they\'re struggling. Be intentional. Notice their response. Notice yours.', tip: 'Physical affirmation doesn\'t require grand gestures. A hand on the shoulder, a longer goodbye hug — small acts of physical care compound over time.', recipe_search: 'comfort food healthy' },
    journal: { prompt: 'What does "safe closeness" look like in your healthiest relationships? How have you been withholding physical affirmation from someone who needs it? What would change if you became more intentionally physically present?', entry_type: 'general' },
    affirmation: 'I am safe to be close to. My presence — physical, emotional, and spiritual — brings comfort to the people I love.',
    personal_growth_page: 'MyJournalEntries',
    personal_growth_label: 'Open Journal',
  },

  {
    day: 7, week: 1, title: 'You Cannot Pour from Empty',
    bible: { book: 'Matthew', chapter: 22, verse_range: '39', key_verse: '"Love your neighbor as yourself." — Matthew 22:39', devotion: 'The command assumes self-love. Not narcissism — dignity. Not self-obsession — self-care. Jesus didn\'t say love your neighbor instead of yourself. He said "as." The standard for how we love others is how we love ourselves. You cannot give what you don\'t have. If you\'ve been loving others from an empty tank, the love that\'s coming out is depleted love — impatient, resentful, conditional. This Sabbath is an invitation to receive, rest, and refill so you have something real to give this week and every week.', reflection_q: 'In what ways have you been loving others from an empty tank? What does your own soul need right now? What is your own primary love language, and when did you last fill it?' },
    workout: { premade_id: 'bedtime-stretch', motivational_tip: 'Rest is not weakness — it\'s wisdom. Honor your body as you\'re learning to honor your relationships.', coach_note: 'Rest day. Let your body and heart recover together.' },
    nutrition: { focus: 'Self-Love Practice: Speak Your Language to Yourself', meal_theme: 'Rest and Receive', plan: 'Identify your top love language and intentionally give it to yourself today. Words of Affirmation: write 10 true, kind things about yourself. Quality Time: spend an hour doing something you love alone. Gift: buy yourself something small and meaningful. Acts of Service: do one thing for Future You. Physical Touch: take a slow bath, stretch gently, get rest.', tip: 'You are not selfish for filling your own tank. You are responsible. A full person loves better than a depleted one.', recipe_search: 'self care sunday meal' },
    journal: { prompt: 'What do you most want from your relationships that you haven\'t been able to ask for? Write it here first. Then: what would it mean to treat yourself with the same love and intentionality you\'re learning to show others?', entry_type: 'general' },
    affirmation: 'I receive love as freely as I give it. I am worthy of care, rest, and the full love I am learning to offer others.',
    personal_growth_page: 'GuidedMeditationsPage',
    personal_growth_label: 'Guided Meditation',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WEEK 2 — UNDERSTANDING YOUR PERSON
  // ═══════════════════════════════════════════════════════════════════════════

  ...Array.from({ length: 7 }, (_, i) => ({
    day: 8 + i, week: 2,
    title: ['Listening to Understand', 'The Complaint Is the Clue', 'Their Story Shapes Their Language', 'Asking the Right Questions', 'Breaking Old Patterns', 'Consistency Is Love', 'The Week 2 Review'][i],
    bible: {
      book: ['James', 'Proverbs', 'Psalm', 'Proverbs', 'Romans', '1 Corinthians', 'Lamentations'][i],
      chapter: [1, 20, 139, 20, 12, 13, 3][i],
      verse_range: ['19', '5', '13-14', '5', '2', '7', '40'][i],
      key_verse: [
        '"Everyone should be quick to listen, slow to speak." — James 1:19',
        '"The purposes of a person\'s heart are deep waters, but one who has insight draws them out." — Proverbs 20:5',
        '"For you created my inmost being; you knit me together in my mother\'s womb." — Psalm 139:13',
        '"The purposes of a person\'s heart are deep waters, but one who has insight draws them out." — Proverbs 20:5',
        '"Be transformed by the renewing of your mind." — Romans 12:2',
        '"Love always perseveres." — 1 Corinthians 13:7',
        '"Let us examine our ways and test them." — Lamentations 3:40',
      ][i],
      devotion: [
        'Most people listen to respond. This week\'s challenge: listen to understand. There is a profound difference. When you listen to respond, you spend half your attention preparing your reply. When you listen to understand, you become fully present to what is actually being communicated — including what\'s beneath the words. Most relationship conflict is not about what it appears to be about. Underneath every argument is usually an unmet love language need.',
        'Proverbs 20:5 is the key to relationship insight: "The purposes of a person\'s heart are deep waters, but one who has insight draws them out." A complaint is always a surface expression of a deeper need. "You never spend time with me" translates to Quality Time. "You don\'t appreciate anything I do" translates to Acts of Service. "You forgot our anniversary" translates to Receiving Gifts. Learning to hear what\'s underneath changes everything.',
        'God formed the person you love in their mother\'s womb — with their entire history, family, and emotional formation already in place. The way they give and receive love was largely shaped before they ever met you. Childhood experiences of love — or its absence — become the template. Understanding someone\'s story doesn\'t excuse their behavior; it explains it. And explanation creates compassion.',
        'Good questions draw out deep water. Most relationship conversations stay shallow because the questions stay shallow. "How are you?" draws nothing. "What\'s been weighing on you this week that you haven\'t said out loud?" draws out soul. The quality of your questions determines the depth of your connection.',
        'Old relationship patterns are not destiny — they are defaults. The brain takes familiar paths because they are efficient. Choosing a new response in a triggered moment takes conscious effort. But each new choice rewires the default. You can become someone who responds differently in your closest relationships. It takes awareness, intention, and repeated practice.',
        'Consistency is one of the most underrated expressions of love. Showing up in someone\'s love language on Day 400 the same way you did on Day 1 — that is love as a decision, not a feeling. Anyone can love well when they feel like it. The transformation happens when love becomes your choice regardless of how you feel.',
        'Week 2 check-in: Not to judge yourself, but to see clearly. What has surprised you most about someone you love? Where have you grown in how you understand them? What is one assumption you held that this week has challenged?',
      ][i],
      reflection_q: [
        'Think of your last significant argument. What was it really about underneath? What love language need was going unmet on both sides?',
        'Write the last 3 complaints or criticisms you received from someone close to you. Translate each one: what love language were they actually expressing?',
        'What do you know about how the most important people in your life experienced love — or its absence — growing up? How might that history show up in your relationship with them today?',
        'Write 5 questions you\'ve never asked someone important to you — questions that could genuinely change how well you know them.',
        'What is one relationship pattern you keep repeating that you\'re ready to break? What does the new pattern look like?',
        'What is one consistent, small daily action you could take that would make someone feel loved in their language every single day?',
        'What has Week 2 revealed about how you relate to the people you love? Where did you grow? Where did old patterns pull you back?',
      ][i],
    },
    workout: {
      premade_id: ['morning-energizer', 'upper-body-strength', 'cardio-blast', 'yoga-flow', 'lower-body-blast', 'core-crusher', 'bedtime-stretch'][i],
      motivational_tip: [
        'Listen to your body the way you\'re learning to listen to the people you love — without preparing your response.',
        'Strength in relationships, like physical strength, is built through consistent small efforts over time.',
        'Push through resistance today — in the workout and in the old patterns you\'re working to break.',
        'Flow. Don\'t force. The same principle that makes yoga effective makes relationships flourish.',
        'The foundation you build here — physical and relational — is what carries you when things get hard.',
        'Your core is your center. Your ability to stay grounded under pressure in relationships is your relational core.',
        'Rest is where growth consolidates. What you\'ve learned this week settles during rest.',
      ][i],
      coach_note: [
        'Mindful movement. Full presence. Practice being in your body without distraction.',
        'Progressive challenge. Each week you\'re capable of more than the last.',
        'Midweek energy. Push through the plateau — same as relationship breakthroughs.',
        'Slow, intentional movement. Presence over performance.',
        'Build the foundation. Legs carry you — make them strong.',
        'Core work. Stability is built from the inside out.',
        'Rest and recover. Week 3 brings deeper work.',
      ][i],
    },
    nutrition: {
      focus: ['The Listening Exercise', 'Translation Practice', 'Build a Love Map', 'Ask the Deep Question', 'Pattern Interrupt Practice', 'Daily Love Language Deposit', 'Week 2 Reflection'][i],
      meal_theme: ['Understanding Others', 'Hearing What\'s Beneath', 'Knowing Their Story', 'Deeper Connection', 'New Choices', 'Consistent Care', 'Rest and Review'][i],
      plan: [
        'Today in every significant conversation, practice one rule: ask one follow-up question before sharing your own perspective. "Tell me more about that." "What did that feel like?" "What do you need from me right now?" Notice how the conversation changes when you stay curious one beat longer.',
        'Take the 3 complaints you wrote in your journal and write a "translation" for each. Then write what a loving, love-language-specific response to each complaint would actually look like in practice.',
        'Create a "love map" for someone important to you: What are their biggest stressors? Their deepest fears? What brings them most joy? What was love like for them growing up? What do they dream about? Most people in close relationships have never consciously mapped this.',
        'From your journal list of 5 deep questions, ask at least one today — not in an interview style, but woven naturally into real conversation. Notice what opens up.',
        'Identify one moment this week when you felt an old relational pattern being triggered. Write: what triggered it, what the old response would have been, and what you chose instead.',
        'Commit to one daily love language deposit for one person this week: small, consistent, specific to their language. Track it daily. Notice what accumulates.',
        'Review the week honestly: where did you grow? Where did old patterns win? What will you carry into Week 3?',
      ][i],
      tip: [
        'The single most powerful thing you can do in any conversation is stay curious one question longer than feels natural.',
        'Most relationship conflict resolves faster when both people learn to translate complaint into need.',
        'The people who know their partner\'s love map most thoroughly report the highest relationship satisfaction.',
        'One genuine deep question per day changes the entire trajectory of a relationship over a month.',
        'Patterns break one response at a time. Every new choice is a vote for who you\'re becoming.',
        'Relationships are built in small, consistent moments — not grand gestures.',
        'Self-awareness without self-condemnation is the foundation of real growth.',
      ][i],
      recipe_search: ['mindful eating practice', 'meal prep together', 'comfort soup recipe', 'energizing lunch', 'protein rich dinner', 'nourishing consistency meal', 'rest day recovery food'][i],
    },
    journal: {
      prompt: [
        'What did you hear differently today when you slowed down to listen? What opened up when you stayed curious one beat longer than usual?',
        'What complaint from someone you love have you been responding to at the surface level instead of the love language need beneath it?',
        'How does knowing someone\'s backstory change how you respond to their behavior? Where has understanding replaced frustration this week?',
        'What happened when you asked a deeper question? What did you learn that you wouldn\'t have learned otherwise?',
        'What did you choose this week that your old self wouldn\'t have? What made the new choice possible?',
        'What does consistent love feel like — both to give and to receive? Where has consistency been missing in your relationships?',
        'What is the most important thing you\'ve learned about love, relationships, or yourself in the first two weeks of this journey?',
      ][i],
      entry_type: 'general',
    },
    affirmation: [
      'I listen to understand, not just to respond. My presence in conversation is a gift.',
      'I hear what is really being said beneath the surface. I respond to the need, not the noise.',
      'I hold the stories of the people I love with tenderness. Their history explains, not excuses.',
      'My questions draw out deep water. I have the courage to go beneath the surface.',
      'I am not my patterns. I choose how I respond. Every new choice builds the person I am becoming.',
      'My love is consistent. The people in my life can count on me.',
      'I am growing. Every week, every day, every conversation is building something real.',
    ][i],
    personal_growth_page: ['MyJournalEntries', 'EmotionalCheckInPage', 'MyJournalEntries', 'MyJournalEntries', 'MindsetResetPage', 'HabitBuilderPage', 'WeeklyReflectionPage'][i],
    personal_growth_label: ['Open Journal', 'Emotional Check-In', 'Open Journal', 'Open Journal', 'Mindset Reset', 'Habit Builder', 'Weekly Reflection'][i],
  })),

  // ═══════════════════════════════════════════════════════════════════════════
  // WEEK 3 — WORDS OF AFFIRMATION DEEP DIVE
  // ═══════════════════════════════════════════════════════════════════════════

  ...Array.from({ length: 7 }, (_, i) => ({
    day: 15 + i, week: 3,
    title: ['Specific Praise Changes Everything', 'Encouragement for the Struggling', 'The Full Apology', 'Speaking Life Over the Young', 'Truth Spoken in Love', 'The Gratitude You Never Said', 'Words of Life for Yourself'][i],
    bible: {
      book: ['1 Thessalonians', 'Hebrews', 'Matthew', 'Proverbs', 'Ephesians', '1 Thessalonians', 'Psalm'][i],
      chapter: [5, 10, 5, 22, 4, 5, 19][i],
      verse_range: ['11', '24-25', '23-24', '6', '15', '18', '14'][i],
      key_verse: [
        '"Encourage one another and build each other up." — 1 Thessalonians 5:11',
        '"Spur one another on toward love and good deeds." — Hebrews 10:24',
        '"First go and be reconciled to them." — Matthew 5:24',
        '"Start children off on the way they should go." — Proverbs 22:6',
        '"Speaking the truth in love, we will grow to become the full measure of Christ." — Ephesians 4:15',
        '"Give thanks in all circumstances." — 1 Thessalonians 5:18',
        '"May these words of my mouth and this meditation of my heart be pleasing in your sight." — Psalm 19:14',
      ][i],
      devotion: [
        'Generic praise bounces off. Specific praise penetrates and stays. "You\'re amazing" means almost nothing. "The way you stayed present with your kids even when you were exhausted — I see what that costs you and it is one of the most loving things I\'ve ever watched" — that changes how someone sees themselves. Specificity communicates that you actually paid attention, that you actually saw them, that your praise is real and not performative.',
        'The people in your life are fighting battles you cannot see. Your words of encouragement might be the only fuel they get today. Hebrews says to "spur one another on" — the image is of someone who physically helps another keep moving when they\'re about to stop. Some of the people closest to you are about to stop. Your words could be the thing that keeps them going.',
        'A good apology is one of the most healing things one human can offer another. Most apologies are really just attempts to make the apologizer feel better. A genuine apology takes responsibility, expresses real regret, makes restitution where possible, commits to change, and requests forgiveness. Most people only do the first part. The full apology is rare and transformative.',
        'The words spoken over children — and anyone who is younger or looks up to you — shape their identity at a foundational level. Proverbs says to "train up a child in the way they should go." Training is not primarily instruction — it is modeling and verbal formation. What identity words are being spoken over the young people in your sphere of influence?',
        'Truth without love is brutality. Love without truth is flattery. The skill — and it is a skill that must be practiced — is holding both simultaneously. Speaking the truth in love means the delivery is as considered as the content. It means the relationship comes before the correction. It means you earn the right to speak hard things by building the trust that shows you\'re for the person, not against them.',
        'There are people in your life whose impact you\'ve deeply felt but never fully voiced. We assume people know what they mean to us. They often don\'t. Unexpressed gratitude is one of the most common relationship regrets — people discover too late how much they were valued by someone who never said so.',
        'The final Words of Affirmation practice turns the lens on yourself. The conversation you have with yourself about yourself is the most frequent and most influential conversation in your life. What words do you habitually speak over yourself? Are they building you up or slowly eroding your capacity to love well?',
      ][i],
      reflection_q: [
        'Think of a time someone gave you a specific compliment that changed how you saw yourself. What was it? Why did it land differently than generic praise?',
        'Who in your life is fighting a battle right now that you haven\'t acknowledged? What words do they most need to hear from you?',
        'How do you typically apologize? Is your apology designed to relieve your guilt or to genuinely heal the other person?',
        'What words have you spoken over a child or younger person that you wish you could take back? What would you say instead?',
        'What truth have you been withholding from someone you love — softening it so much that it has lost its power? What would it sound like spoken with both love and clarity?',
        'Who have you never fully thanked — someone whose impact on your life you\'ve felt but never said out loud?',
        'What are the words your soul most needs to hear right now? Why haven\'t you been speaking them over yourself?',
      ][i],
    },
    workout: {
      premade_id: ['upper-body-strength', 'cardio-blast', 'morning-energizer', 'yoga-flow', 'hiit-30', 'lower-body-blast', 'bedtime-stretch'][i],
      motivational_tip: [
        'Every rep is specific effort toward a specific goal. Bring that precision to your words today too.',
        'Push when it\'s hard. The people who need your encouragement are doing the same right now.',
        'Show up today. Some days the most important thing is just that you came.',
        'Flow and breathe. Some of the best conversations happen in quiet, unhurried moments.',
        'Full intensity. Sometimes love demands your full effort with nothing held back.',
        'Build the foundation. What you build here — in body and in words — outlasts the moment.',
        'Rest with gratitude. Seven days of intentional love language work deserves rest.',
      ][i],
      coach_note: ['Build strength — physical and verbal.', 'Midweek push.', 'Energize the day.', 'Slow and present.', 'Full effort.', 'Strong finish to the week.', 'Rest and integrate.'][i],
    },
    nutrition: {
      focus: ['The Specificity Practice', 'Write the Encouragement Letter', 'The Five-Part Apology', 'Speak a Blessing', 'The Honest Loving Conversation', 'The Gratitude Letter', 'Affirmation Day'][i],
      meal_theme: ['Precision and Care', 'Nourishing Others with Words', 'Healing Through Honesty', 'Blessing the Next Generation', 'Truth as Love', 'Expressed Gratitude', 'Self-Love through Words'][i],
      plan: [
        'For every compliment or affirmation you give today, add a "because." "I appreciate you because..." or "That was impressive because the situation was [specific] and you chose [specific response]." The because transforms a compliment into an observation that lands.',
        'Write a full encouragement letter to someone who is struggling — not to send yet. Write it as if it might be the last letter they ever receive from you. Then decide whether to share it. What do you see in them that they cannot currently see in themselves?',
        'The five-part full apology: (1) "I\'m sorry." (2) "I was wrong — specifically ___." (3) "What can I do to make this right?" (4) "I\'m going to work to not repeat this by ___." (5) "Will you forgive me?" Write out a full apology you owe someone. All five parts. Decide whether to deliver it.',
        'Speak a genuine blessing over someone today — not a wish but a declaration. "I see in you the capacity to ___. I believe what God is building in you will ___." Say it to their face. Watch what it does to both of you.',
        'Write out a difficult honest conversation you\'ve been avoiding using this structure: "When you ___ I feel ___ because ___. What I need is ___." Practice saying it aloud alone first. The structure removes blame and keeps you in your own experience.',
        'Write a full, genuine letter of gratitude to someone who has profoundly impacted your life and who has never been fully thanked. Unlike the encouragement letter — send this one.',
        'Write 10 affirmations about yourself. Not aspirations — truths that are already real about you. Then read them aloud. Notice the resistance and the places where they land as true.',
      ][i],
      tip: [
        'The "because" is not a compliment technique — it is proof that you actually saw the person. That\'s what makes it land.',
        'Writing what you see in someone before you say it makes the words more precise and more powerful.',
        'Most apologies re-wound because they\'re incomplete. The full five-part apology is rare enough that it heals rather than reopens.',
        'Spoken blessings over young people and those who look up to you carry a weight that lasts decades. Use that weight intentionally.',
        'The structure "When you / I feel / because / I need" keeps conflict in the realm of need rather than accusation.',
        'Unexpressed gratitude is one of the most common sources of relationship regret. Send the letter while you still can.',
        'The words you speak over yourself become your inner operating system. Upgrade them intentionally.',
      ][i],
      recipe_search: ['nourishing breakfast', 'energy meal', 'simple comforting lunch', 'wholesome family dinner', 'pre-conversation calming tea', 'gratitude celebration meal', 'self care food'][i],
    },
    journal: {
      prompt: [
        'What specific thing did you notice about someone today that you\'ve never said out loud before? What held you back from saying it?',
        'What did writing the encouragement letter reveal about how deeply you actually see this person?',
        'What does your typical apology reveal about who you\'re really trying to make feel better — them or yourself?',
        'What happened when you spoke a blessing over someone? What did it feel like to say it? What did you see in their response?',
        'What truth have you been afraid to speak? What is the cost of that continued silence?',
        'What happened when you sent or planned to send the gratitude letter? What does it feel like to express what was unspoken?',
        'Week 3 summary: How has your relationship with words changed? What will you do differently going forward?',
      ][i],
      entry_type: 'general',
    },
    affirmation: [
      'I notice specifically. I speak what I see. My words are precise instruments of love.',
      'My words hold people up when they are about to fall. I do not withhold encouragement from those who need it.',
      'I apologize fully and honestly. I heal rather than re-wound.',
      'I speak life, identity, and blessing over the people who look up to me.',
      'I speak truth with love. I am for the people I confront, not against them.',
      'I say thank you while there is still time. Gratitude expressed is a gift.',
      'I speak with kindness and truth over myself. My inner voice is an ally.',
    ][i],
    personal_growth_page: ['AffirmationsPage', 'MyJournalEntries', 'MyJournalEntries', 'MyJournalEntries', 'MindsetResetPage', 'GratitudeJournalPage', 'AffirmationsPage'][i],
    personal_growth_label: ['Affirmations', 'Open Journal', 'Open Journal', 'Open Journal', 'Mindset Reset', 'Gratitude Journal', 'Affirmations'][i],
  })),

  // ═══════════════════════════════════════════════════════════════════════════
  // WEEK 4 — QUALITY TIME DEEP DIVE
  // ═══════════════════════════════════════════════════════════════════════════

  ...Array.from({ length: 7 }, (_, i) => ({
    day: 22 + i, week: 4,
    title: ['Undivided Attention', 'Creating Intentional Experiences', 'Shared Activities That Connect', 'Building Connection Rituals', 'Five Minutes of Full Presence', 'Sitting with Someone in Pain', 'Sabbath as Sacred Time Together'][i],
    bible: {
      book: ['Matthew', 'Song of Solomon', 'Luke', 'Deuteronomy', 'Ephesians', 'Job', 'Mark'][i],
      chapter: [6, 2, 10, 6, 5, 2, 6][i],
      verse_range: ['21', '10-12', '38-42', '6-7', '15-16', '11-13', '31'][i],
      key_verse: [
        '"Where your treasure is, there your heart will be also." — Matthew 6:21',
        '"Arise, come, my darling; my beautiful one, come with me." — Song of Solomon 2:10',
        '"Mary has chosen what is better." — Luke 10:42',
        '"Talk about them when you sit at home and when you walk along the road." — Deuteronomy 6:7',
        '"Making the most of every opportunity." — Ephesians 5:16',
        '"They sat on the ground with him for seven days and seven nights. No one said a word." — Job 2:13',
        '"Come with me by yourselves to a quiet place and get some rest." — Mark 6:31',
      ][i],
      devotion: [
        'Time is treasure. What you spend your time on reveals what you actually value — not what you say you value. People whose love language is Quality Time feel loved when they receive your full attention, and feel dismissed when they receive your physical presence but not your real focus. The most painful experience for them is talking to someone whose eyes and heart are somewhere else.',
        'The beloved in Song of Solomon invites the other into an intentional experience: "Arise, come with me." Quality time relationships thrive on invitation — "I want to be with you specifically. I planned this because you matter to me." The planned, intentional experience says something that spontaneous time cannot: you were worth the thought, worth the effort, worth the anticipation.',
        'Martha is doing everything right by practical standards. Mary is just sitting at Jesus\' feet. And Jesus says Mary chose better. Sometimes the most loving thing you can do is stop doing and start being. The tyranny of productivity steals more quality time from our most important relationships than almost anything else.',
        'Deuteronomy\'s instruction is to talk about these things "when you sit, when you walk, when you lie down, when you rise." Intentional connection is built in the margins of ordinary life — the 10-minute car ride, the dinner table, the bedtime ritual — not just in the special occasions. The special occasions matter, but the margins are where the relationship actually lives.',
        'Quality time doesn\'t require hours. It requires intention. Five minutes of full, phone-free, genuinely curious presence is worth more than two hours of distracted togetherness. The quality-time person can feel the difference in thirty seconds. They are exquisitely sensitive to where your attention actually is.',
        'When Job\'s friends arrived after his catastrophic loss, they sat with him in silence for seven days and seven nights. No advice. No explanation. No "have you tried ___?" They showed up and stayed present in the darkness. This is one of the most profound acts of love in all of Scripture. The Quality Time love language includes the willingness to be present in pain without needing to fix it.',
        'Jesus regularly withdrew to quiet places. He built Sabbath rhythm into His own life even during His most demanding seasons. Mark 6:31 is Jesus inviting His disciples to come away and rest — not from laziness, but because sustained presence with others requires seasons of renewal. Sabbath rest is relational: with God, with your own soul, and with those you love.',
      ][i],
      reflection_q: [
        'How do the people closest to you experience your presence? Are you physically there but emotionally or mentally somewhere else?',
        'When did you last create an intentional experience — not just time together, but something you planned specifically for one person?',
        'Is there a Martha vs. Mary tension in your closest relationships — are you always doing when what\'s needed is simply being?',
        'What are the natural connection rituals in your most important relationships? Which have faded? Which one would you most want to restore or create?',
        'Think of a 5-minute conversation that felt like it mattered more than an hour with that same person on a different day. What made the difference?',
        'Think of someone who sat with you in pain without trying to fix it. What did their presence mean? How often do you offer that kind of presence to others?',
        'What does true Sabbath — rest and connection without obligation — look like for you? When did you last experience it?',
      ][i],
    },
    workout: {
      premade_id: ['morning-energizer', 'cardio-blast', 'yoga-flow', 'upper-body-strength', 'hiit-30', 'lower-body-blast', 'bedtime-stretch'][i],
      motivational_tip: ['Be fully present in this workout. Practice presence here first.', 'Move with intention. Time invested here is treasure.', 'Flow slowly. Presence over pace.', 'Build strength for sustained showing up.', 'Full effort — quality over quantity applies here too.', 'End the week strong. Foundation for everything.', 'Rest is preparation for the week ahead.'][i],
      coach_note: ['Mindful movement day.', 'Cardio builds capacity to show up.', 'Slow flow. Full presence.', 'Strength for the long game.', 'HIIT intensity — quality time with your body.', 'Final push of the week.', 'Rest and integrate.'][i],
    },
    nutrition: {
      focus: ['Presence Audit', 'Plan the Intentional Experience', 'Find the Shared Activity', 'Create a Connection Ritual', '10-Minute Presence Practice', 'Sit With Someone', 'Sabbath Rest Design'][i],
      meal_theme: ['Attention as Nourishment', 'Intentional Connection', 'Shared Experience', 'Ritual as Love', 'Quality Over Quantity', 'Presence in Pain', 'Sacred Rest'][i],
      plan: [
        'Audit your last 48 hours: when were you physically with someone but mentally somewhere else? What pulled your attention away — phone, worry, planning, fatigue? What would full presence have looked like in those moments?',
        'Plan one intentional Quality Time experience for someone this week. It doesn\'t need to be expensive — it needs to be specific to them: their favorite activity, restaurant, walk, or place. Put it in your calendar. Guard it like a meeting.',
        'List activities you genuinely enjoy doing with others. Ask the important person in your life to make their own list. Find the overlap. Schedule one this week.',
        'Identify or create one small daily connection ritual with someone important to you — morning coffee, evening walk, bedtime conversation, a weekly call. Something consistent, low-effort, and meaningful.',
        'Practice 10 minutes of completely undistracted presence with someone today. No agenda, no phones, no multitasking. Just full curiosity. After, reflect: what opened up that doesn\'t usually open up?',
        'Reach out to someone who is currently going through pain and offer your presence — not your advice. "I\'m not going to try to fix this. I just want to be with you in it." Practice sitting without solving.',
        'Design your ideal Sabbath: who is in it, what you do, what you protect it from. What would real rest and connection look like for you this week?',
      ][i],
      tip: [
        'Simply having your phone visible on a table — even face-down — measurably reduces conversation quality. Put it away entirely.',
        'The planned experience says "you were worth thinking about." That message alone is what the Quality Time person needs.',
        'Shared activities build implicit trust and create shared memories — two of the most powerful relationship bonds.',
        'Consistent small rituals build more relational security over time than occasional grand gestures.',
        'Five minutes of full presence builds more connection than two hours of distracted togetherness.',
        'The person in pain doesn\'t need your wisdom. They need your presence. Those are different things.',
        'Sabbath protected is Sabbath received. Without protection it disappears into obligation.',
      ][i],
      recipe_search: ['phone free dinner recipe', 'date night cooking', 'meal to share together', 'simple ritual breakfast', 'present moment tea recipe', 'comforting soup', 'sabbath rest meal'][i],
    },
    journal: {
      prompt: [
        'What distracted you most from presence today? What one change would make the biggest difference in how present you are with the people you love?',
        'What does planning an intentional experience communicate to someone whose love language is Quality Time?',
        'What shared activity has built the deepest connection in your life? What made it work?',
        'What connection ritual from your past do you miss most? Is it possible to restore it?',
        'What did 10 minutes of full presence reveal — about the person, about yourself, about what gets missed when you\'re distracted?',
        'What is the difference between being with someone and being present with them? When have you experienced the latter?',
        'Week 4: what has this week\'s work on Quality Time taught you about how you show up for the people you love?',
      ][i],
      entry_type: 'general',
    },
    affirmation: [
      'My full attention is a gift. When I am with someone, I am truly with them.',
      'I create intentional experiences for the people I love. They are worth my planning and my presence.',
      'I build connection through shared experience. I show up for what matters to the people I love.',
      'I protect and honor our rituals of connection. Consistency in small things builds deep trust.',
      'Five minutes of full presence is worth more than hours of distraction. I give quality, not just quantity.',
      'I sit with people in their pain. I don\'t need to fix what I can simply be present with.',
      'I protect Sabbath as sacred time. Rest and connection are not luxuries — they are necessities.',
    ][i],
    personal_growth_page: ['MyJournalEntries', 'HabitBuilderPage', 'MyJournalEntries', 'HabitBuilderPage', 'GuidedMeditationsPage', 'EmotionalCheckInPage', 'WeeklyReflectionPage'][i],
    personal_growth_label: ['Open Journal', 'Habit Builder', 'Open Journal', 'Habit Builder', 'Guided Meditation', 'Emotional Check-In', 'Weekly Reflection'][i],
  })),

  // ═══════════════════════════════════════════════════════════════════════════
  // WEEK 5 — ACTS OF SERVICE DEEP DIVE
  // ═══════════════════════════════════════════════════════════════════════════

  ...Array.from({ length: 7 }, (_, i) => ({
    day: 29 + i, week: 5,
    title: ['Service from Love, Not Fear', 'The Unsolicited Gift of Help', 'Service Without Score-Keeping', 'Serving at Work', 'The Neighbor in Your Path', 'Sustaining Your Capacity to Serve', 'Rest as Service to Yourself'][i],
    bible: {
      book: ['Mark', 'Romans', '1 Peter', 'Colossians', 'Luke', 'Isaiah', 'Matthew'][i],
      chapter: [10, 12, 3, 3, 10, 40, 11][i],
      verse_range: ['45', '10', '8-9', '23', '30-37', '31', '28-29'][i],
      key_verse: [
        '"The Son of Man did not come to be served, but to serve." — Mark 10:45',
        '"Honor one another above yourselves." — Romans 12:10',
        '"Do not repay evil with evil or insult with insult." — 1 Peter 3:9',
        '"Whatever you do, work at it with all your heart, as working for the Lord." — Colossians 3:23',
        '"Which of these three do you think was a neighbor to the man?" — Luke 10:36',
        '"Those who hope in the Lord will renew their strength." — Isaiah 40:31',
        '"Come to me, all you who are weary, and I will give you rest." — Matthew 11:28',
      ][i],
      devotion: [
        'Jesus served from wholeness, not from wound. There is a profound difference between serving because you are afraid, serving to earn love, serving to be seen, or serving to avoid conflict — and serving because you are full and love flows out of that fullness. Many people who struggle with Acts of Service as their primary language cycle between over-serving and resentment precisely because they\'re serving from depletion and performing rather than giving.',
        'The unexpected act of service — done without being asked, possibly without recognition — is one of the most powerful expressions of love. It communicates something that requested service cannot: "I was thinking about you. I noticed your load. I wanted to make your life easier because I love you." Romans 12:10 says to "honor one another above yourselves." Honor looks like action.',
        'In marriage and in every close relationship, service cannot be transactional. "I did the dishes so you owe me." "I helped with that project and no one noticed." The ledger-keeping is the enemy of genuine service. 1 Peter describes a relationship pattern where love and care flow regardless of whether they\'re returned — not as doormat passivity, but as the active choice to love freely.',
        'Your workplace is a field of service. How you show up for your team, clients, and colleagues — whether or not anyone is watching or tracking — is a form of love. Colossians says to work as if working for the Lord, not for human approval. Excellence in service at work is both professional integrity and spiritual practice.',
        'The Good Samaritan didn\'t stop to ask whether the man in the road deserved help. He saw a need and filled it. He crossed social, ethnic, and inconvenience barriers to do so. The "neighbor" in your daily path — the person whose need you\'ve been walking past because it\'s not your responsibility, not your circle, not your problem — is your assignment today.',
        'You cannot sustain a life of service from an empty tank. Isaiah 40:31 promises renewed strength to those who wait on God — not to those who run until they collapse. The most effective servants protect their renewal. If you\'ve been running on empty, your service has been costing you more than it should, and those who receive it can often feel the resentment or exhaustion underneath.',
        'Matthew 11:28 is Jesus\' invitation to the burned-out, the over-functioning, the ones who have been serving so hard they\'ve forgotten they\'re allowed to rest. Receiving rest is not failure. It is faithfulness to the people who depend on you having something real to give. This Sabbath is an act of love for your future self and for everyone who will receive from you next week.',
      ][i],
      reflection_q: [
        'Are you currently serving from love or from fear, obligation, or need for approval? What would pure love-based service look like in your closest relationships?',
        'What unsolicited act of service would most powerfully communicate love to the most important person in your life right now?',
        'Do you keep score in your closest relationships? What would it look and feel like to serve without the ledger?',
        'How do you serve the people you work with? What would change if you approached your workplace as a field of love and service?',
        'Who is the "neighbor in your path" — the person with a need you\'ve been walking past because it falls outside your defined responsibility?',
        'What renews you? Are you protecting time and space for genuine renewal? What are you serving from right now — fullness or depletion?',
        'What does receiving rest — not just stopping work, but genuinely resting — look and feel like for you?',
      ][i],
    },
    workout: {
      premade_id: ['morning-energizer', 'upper-body-strength', 'cardio-blast', 'core-crusher', 'lower-body-blast', 'yoga-flow', 'bedtime-stretch'][i],
      motivational_tip: ['Serve your future self with this workout.', 'Build the strength to keep showing up for others.', 'Push through — service requires endurance.', 'Core strength for the long haul.', 'Foundation work. Build what carries you.', 'Flow and restore.', 'Rest intentionally. Tomorrow you serve again.'][i],
      coach_note: ['Service starts with showing up.', 'Strength for sustained service.', 'Midweek endurance.', 'Center and stabilize.', 'Build the foundation.', 'Active recovery.', 'Full rest.'][i],
    },
    nutrition: {
      focus: ['Service Motivation Audit', 'Plan the Unsolicited Act', 'Drop the Ledger for One Day', 'Serve Your Workplace', 'The Neighbor Exercise', 'Design Your Renewal Plan', 'Receive Rest'][i],
      meal_theme: ['Love-Based Service', 'Surprise Gift of Help', 'Free Giving', 'Professional Love', 'Unexpected Neighbor', 'Sustained Capacity', 'Sacred Rest'][i],
      plan: [
        'Examine your service honestly: list 5 things you regularly do for others. For each, write: am I doing this from love, duty, fear, or the need for approval? No judgment — just honest awareness. Awareness is the first step toward service that flows from freedom.',
        'Identify one person whose love language is Acts of Service. Without telling them, plan and execute one completely unsolicited act of service for them this week. Handle something they\'ve been meaning to do. Lighten a specific load.',
        'Challenge: go through today without mentally noting what someone else hasn\'t done. Every time you notice the ledger operating, return to: "I do this because I love them, not because I\'m keeping score."',
        'List 5 concrete ways you could serve the people you work with more intentionally this week. Pick one and do it today — going beyond your job description because you choose to.',
        'Walk through your normal daily environment in your mind. Who are the people you regularly encounter whose needs you\'ve been overlooking? Identify one person and one small act of service you could offer them.',
        'Design your personal renewal plan: what genuinely fills your tank? List 5 specific activities. Schedule at least one this week as a non-negotiable appointment with yourself.',
        'Practice receiving. Ask someone to serve you in one small way today and receive it without minimizing, deflecting, or immediately reciprocating. Just receive.',
      ][i],
      tip: [
        'Service done from fear or obligation eventually produces resentment. Service done from love produces energy.',
        'Unsolicited service says "I notice you" — which is the message that the Acts of Service person needs most to feel loved.',
        'Score-keeping is the slow poison of close relationships. The antidote is the daily decision to give freely.',
        'The way you treat colleagues when nothing is required of you reveals your actual character.',
        'The Good Samaritan is remembered 2000 years later. Most people\'s greatest acts of love are the unasked-for ones.',
        'Your capacity to serve others is directly proportional to how well you care for yourself. Renewal is not selfishness.',
        'Receiving gracefully is as important as giving generously. Both require the absence of a ledger.',
      ][i],
      recipe_search: ['serving others meal', 'meal to bring a friend', 'energy meal for giving', 'workplace treat recipe', 'neighbor food gift', 'restorative dinner', 'sabbath rest food'][i],
    },
    journal: {
      prompt: [
        'What would your service look like if you removed the need for recognition, reciprocation, or relief from guilt?',
        'What did it cost you to do the unsolicited act of service? What do you think it gave the other person?',
        'What does score-keeping cost you in your most important relationships? What would freedom from the ledger feel like?',
        'What would it mean to see your workplace as a field of love and service rather than simply a place of obligation?',
        'Who have you been walking past? What stopped you? What\'s your move?',
        'What happens to your capacity to love well when you run on empty? What does your renewal plan protect?',
        'What makes receiving rest — without guilt or the compulsion to be productive — difficult for you?',
      ][i],
      entry_type: 'general',
    },
    affirmation: [
      'I serve from love and fullness, not from fear or obligation. My service is a gift freely given.',
      'I notice the loads people carry. I help without being asked because love notices.',
      'I give freely without keeping score. Generosity is my relational currency.',
      'My work is an act of love and service. I do it with all my heart.',
      'I see the need in my path and I respond. I am a neighbor.',
      'I protect my renewal so I have something real to give. Self-care is stewardship.',
      'I receive rest without guilt. A full person loves better than a depleted one.',
    ][i],
    personal_growth_page: ['MyJournalEntries', 'MyJournalEntries', 'EmotionalCheckInPage', 'HabitBuilderPage', 'MyJournalEntries', 'HabitBuilderPage', 'GuidedMeditationsPage'][i],
    personal_growth_label: ['Open Journal', 'Open Journal', 'Emotional Check-In', 'Habit Builder', 'Open Journal', 'Habit Builder', 'Guided Meditation'][i],
  })),

  // ═══════════════════════════════════════════════════════════════════════════
  // WEEK 6 — HEALING BROKEN RELATIONSHIPS
  // ═══════════════════════════════════════════════════════════════════════════

  ...Array.from({ length: 7 }, (_, i) => ({
    day: 36 + i, week: 6,
    title: ['What Forgiveness Is and Isn\'t', 'The Forgiveness Journey', 'Reconciliation vs. Restoration', 'The Wisdom of Healthy Limits', 'When Love Isn\'t Returned', 'Permission to Grieve', 'Receiving God\'s Perfect Love'][i],
    bible: {
      book: ['Matthew', 'Genesis', 'Romans', 'Matthew', 'Luke', 'Psalm', 'Zephaniah'][i],
      chapter: [18, 50, 12, 10, 15, 34, 3][i],
      verse_range: ['21-22', '19-21', '18', '16', '20', '18', '17'][i],
      key_verse: [
        '"Seventy-seven times." — Matthew 18:22',
        '"You intended to harm me, but God intended it for good." — Genesis 50:20',
        '"If it is possible, as far as it depends on you, live at peace with everyone." — Romans 12:18',
        '"Be as shrewd as snakes and as innocent as doves." — Matthew 10:16',
        '"But while he was still a long way off, his father saw him and was filled with compassion." — Luke 15:20',
        '"The Lord is close to the brokenhearted." — Psalm 34:18',
        '"He will rejoice over you with singing." — Zephaniah 3:17',
      ][i],
      devotion: [
        'Seventy-seven times is not a number — it is a posture. Forgiveness is not condoning what happened. It is not pretending it didn\'t matter. It is not reconciliation. Forgiveness is the decision to release the debt — to stop letting someone else\'s past actions determine your present emotional state. The unforgiven wound doesn\'t punish the one who inflicted it. It imprisons you. Forgiveness is primarily an act of self-liberation.',
        'Joseph\'s journey to forgiveness took 13 years. A pit. Years of slavery. False accusation. Prison. And when he finally had the power to exact revenge, he wept and said "You intended to harm me, but God intended it for good." The journey to that sentence — not the sentence itself — is the most important part. Forgiveness is rarely instant. It is usually a long walk in the same direction.',
        'Romans 12:18 is one of the most honest verses in the New Testament about reconciliation: "If it is possible, as far as it depends on you, live at peace with everyone." Paul uses two conditional qualifiers. "If it is possible" — acknowledging it isn\'t always. "As far as it depends on you" — acknowledging there\'s a part that doesn\'t depend on you. Your job is your side. You cannot control the other side.',
        'Healthy limits in relationships are not walls against love. They are the wisdom structures that protect the relationship itself. Matthew 10:16 — "shrewd as snakes, innocent as doves" — is Jesus describing the combination of wisdom and love that makes sustained relationship possible. Knowing what you will and won\'t accept is not selfishness. It is the prerequisite for relationships that last.',
        'The father in the prodigal son parable doesn\'t chase his son down the road. He watches. He waits. He holds space. And when the son returns, the father runs toward him. Sometimes faithful love looks like holding space without chasing, without forcing, without abandoning hope. Loving someone who isn\'t ready to receive it is its own profound discipline.',
        'Grief over a relationship — whether it ended, changed, became something less than it was, or never became what you hoped — is a legitimate loss. The church often rushes past grief into forgiveness, hope, or moving on. But grief must be honored before it can be healed. God meets us in grief. Psalm 34:18 says He is "close to the brokenhearted" — not far from them, managing them from a distance, but close.',
        'Zephaniah 3:17 offers one of the most tender images of God in all of Scripture: He is with you, He is mighty to save, He takes great delight in you, He rejoices over you with singing. The love you have been searching for in every human relationship — the love that is completely safe, that never withdraws, that never depends on your performance — already exists and is already directed at you. Every human relationship becomes healthier when it is not being asked to be God.',
      ][i],
      reflection_q: [
        'Is there someone you need to forgive — not for their sake, but for yours? What is carrying that unforgiveness costing you daily?',
        'Where are you on your forgiveness journey with the most significant wound in your relational history? What is the next step — even a very small one?',
        'Is there a relationship in your life where you have done your part and the outcome now depends entirely on the other person\'s choices?',
        'Where do you need clearer, healthier limits in a relationship right now? What are you currently allowing that is slowly eroding you?',
        'Is there someone you love who is not currently able to receive your love? What does faithfully loving them from where you are — without self-abandonment — actually look like?',
        'What relationship loss — past or present, ended or changed — have you not yet fully grieved? What would it mean to give yourself permission to grieve it honestly?',
        'In what ways have you been asking human relationships to give you something only God can give? How might your relationships change if that deepest need were already fully met?',
      ][i],
    },
    workout: {
      premade_id: ['morning-energizer', 'yoga-flow', 'cardio-blast', 'upper-body-strength', 'lower-body-blast', 'core-crusher', 'bedtime-stretch'][i],
      motivational_tip: ['The choice to forgive is the first rep. Do the work.', 'Move gently. The heart is doing hard work this week.', 'Process through movement. Let the body help the heart.', 'Build strength for the work of healing.', 'Foundation. Stability. That\'s what this week builds.', 'Center yourself. Healing requires being grounded.', 'Rest. What you\'ve processed this week needs space to settle.'][i],
      coach_note: ['Healing is active, not passive.', 'Gentle movement for a heavy week.', 'Midweek release through movement.', 'Physical strength for emotional work.', 'Build the foundation.', 'Core stability for the healing process.', 'Rest and integrate this week\'s deep work.'][i],
    },
    nutrition: {
      focus: ['The Forgiveness Letter', 'The Journey Map', 'My Side vs. Their Side', 'The Boundary Statement', 'The Faithful Love Plan', 'The Grief Practice', 'Receiving Perfect Love'][i],
      meal_theme: ['Release and Heal', 'The Long Walk', 'Clear Seeing', 'Wisdom and Love', 'Faithful Distance', 'Honored Grief', 'Filled by God'][i],
      plan: [
        'Write a forgiveness letter to someone who hurt you — not to send, but to release. Write everything: what they did, how it affected you, what it cost you. End with: "I choose to release this debt. I am no longer carrying this." You don\'t have to feel forgiving yet. Start with the choice. The feeling often follows the decision.',
        'Map your forgiveness journey for one significant wound: where did it start? Where are you today? What is the next step — not the final destination, just the next one? Draw or write it out.',
        'Draw two columns: "My Part" and "Their Part." Write only what you are genuinely responsible for in the left column. Write what belongs to the other person in the right. Your assignment is only your column. Work your side.',
        'Write a clear, specific limit statement for one relationship: "I am no longer willing to ___. When that happens, I will ___." Practice saying it aloud until it feels like yours — not hostile, just clear.',
        'Write a "faithful love plan" for someone who is not currently able to receive your love. What does loving them well look like from where you are without self-abandonment or resentment?',
        'Set a timer for 20 minutes. Write freely about a relationship loss you have not fully processed. Give yourself permission to feel the full weight of it. Then do something gentle for yourself.',
        'Sit with Zephaniah 3:17 for 10 minutes. Read it slowly. Imagine God rejoicing over you — not tolerating you, not managing you, but genuinely delighting in you. What does it feel like to be fully known and fully loved?',
      ][i],
      tip: [
        'Forgiveness is a choice before it is a feeling. Make the choice repeatedly until the feeling follows.',
        'You don\'t have to arrive at forgiveness today. You just have to know what the next step is and take it.',
        'Working your side doesn\'t mean accepting blame for everything. It means taking full ownership of your actual part.',
        'Clear limits said with love are more relationship-preserving than fuzzy limits said with resentment.',
        'You can love someone faithfully from a distance. That is sometimes the most loving thing available.',
        'Grief that is honored moves through you. Grief that is suppressed gets stuck and shows up sideways.',
        'The love of God is not a theological concept to agree with. It is a living reality to receive. Receive it today.',
      ][i],
      recipe_search: ['healing soup recipe', 'comforting tea', 'emotional wellness food', 'restorative meal', 'gentle nourishment', 'comfort food healthy', 'peaceful sabbath meal'][i],
    },
    journal: {
      prompt: [
        'What does choosing forgiveness feel like — even before the feeling fully follows the choice?',
        'Where are you on your forgiveness journey, honestly? What is the next step?',
        'What does working your column — and only your column — relieve you of?',
        'What relationship would be transformed if you implemented one clear, loving limit? What are you protecting with that limit?',
        'What does faithful love look like when it isn\'t being received? What keeps you from losing yourself in that wait?',
        'What grief are you still carrying that deserves to be set down and honored?',
        'Week 6: What has this week\'s work on healing, forgiveness, and limits taught you about love?',
      ][i],
      entry_type: 'general',
    },
    affirmation: [
      'I release what was done to me. Forgiveness is my freedom, not their pardon.',
      'I am on the journey. The next step is enough.',
      'I work my side with integrity and release the outcome of the other side.',
      'My limits are an act of love — for myself and for the relationship.',
      'I love faithfully from where I am, without losing myself in the process.',
      'My grief is honored here. I am held in it by a God who is close to the brokenhearted.',
      'I am fully known and fully loved by God. That fills what no person can fill.',
    ][i],
    personal_growth_page: ['Prayer', 'MyJournalEntries', 'MyJournalEntries', 'EmotionalCheckInPage', 'MyJournalEntries', 'EmotionalCheckInPage', 'GuidedMeditationsPage'][i],
    personal_growth_label: ['Prayer', 'Open Journal', 'Open Journal', 'Emotional Check-In', 'Open Journal', 'Emotional Check-In', 'Guided Meditation'][i],
  })),

  // ═══════════════════════════════════════════════════════════════════════════
  // WEEK 7 — BUILDING A LOVE CULTURE
  // ═══════════════════════════════════════════════════════════════════════════

  ...Array.from({ length: 7 }, (_, i) => ({
    day: 43 + i, week: 7,
    title: ['What Does Your Environment Communicate?', 'Leading with Love', 'What the Children Are Absorbing', 'Everyone Belongs Here', 'Conflict That Builds Connection', 'Love on the Hard Days', 'Love That Overflows Outward'][i],
    bible: {
      book: ['1 Corinthians', 'John', 'Deuteronomy', 'Romans', 'Ephesians', '1 Corinthians', 'Luke'][i],
      chapter: [14, 13, 11, 15, 4, 13, 14][i],
      verse_range: ['1', '34-35', '19', '7', '26-27', '7', '13-14'][i],
      key_verse: [
        '"Follow the way of love." — 1 Corinthians 14:1',
        '"By this everyone will know that you are my disciples, if you love one another." — John 13:35',
        '"Talk about them when you sit at home and when you walk along the road." — Deuteronomy 11:19',
        '"Accept one another, then, just as Christ accepted you." — Romans 15:7',
        '"Do not let the sun go down while you are still angry." — Ephesians 4:26',
        '"Love always perseveres." — 1 Corinthians 13:7',
        '"Then you will be blessed." — Luke 14:14',
      ][i],
      devotion: [
        'A love culture doesn\'t happen accidentally. It\'s cultivated. It requires someone to go first, to model it consistently, to protect it when it\'s threatened, and to re-establish it when it erodes. A love culture is not a feeling in a household or relationship — it is an environment created through repeated choices. The temperature of your relationships is largely set by what you choose to do and say when no one is requiring anything of you.',
        'John 13:35 is one of the most demanding verses in the New Testament: the primary evidence that you belong to Jesus is not your doctrine, your church attendance, or your moral record. It is how you love the people closest to you. Your love for others is the public testimony of your private faith. The culture you create in your relationships is visible to everyone.',
        'Children absorb culture in the margins — not in the lectures. What they learn about love, conflict, forgiveness, service, and presence, they learn by watching you when you think no one is paying attention. The car ride. The dinner table conversation. How you speak about other people. How you repair after conflict. What you model in the margins is more formative than what you teach intentionally.',
        'A love culture is one where belonging is given before it is earned. Romans 15:7 says to "accept one another just as Christ accepted you." Christ accepted you while you were still a mess, still figuring it out, still making a wreck of things. The question for every relationship and community you build: do people feel they belong before they feel they\'re good enough?',
        'Ephesians 4:26 is remarkably practical: don\'t let the sun go down on your anger. Conflict handled well deepens connection — it creates trust that the relationship can handle honesty and survive disagreement. Conflict avoided creates distance that compounds quietly over time until the gap feels permanent. The willingness to repair — and to repair quickly — is one of the most powerful builders of relational culture.',
        '1 Corinthians 13:7 — love "always perseveres." The evidence of real love is not how it shows up on easy days. Easy days don\'t reveal love; they reveal preference. The hard days — the ones where you don\'t feel like it, where resentment is accessible, where withdrawal would be easier — those are the days that build or erode the love culture of your relationships.',
        'Luke 14:13-14 describes Jesus\' vision of a party where the uninvited, the overlooked, and the forgotten are the guests of honor. A love culture that stays only inside a household or inner circle eventually becomes a clique. Real love culture overflows — it begins to include who others exclude, welcome who others overlook, and extend to the edges of your relational world.',
      ][i],
      reflection_q: [
        'If love is an atmosphere and your most important relationship is a room, what is the temperature right now? What are you doing that sets it?',
        'What does the way you love the people closest to you say about the God you say you follow? What would a stranger conclude?',
        'What are the children — or anyone younger — in your life absorbing about love, conflict, and relationships from watching you in unguarded moments?',
        'Do the people in your closest relationships feel like they belong before they feel like they need to earn it? Who might be uncertain?',
        'What is your conflict pattern — do you engage and repair, or do you avoid and distance? What does your pattern cost the relationship over time?',
        'What is the hardest thing about your most important relationship right now? Are you loving through it or managing around it?',
        'Who outside your inner circle is waiting, perhaps without knowing it, for the overflow of the love culture you\'ve been building?',
      ][i],
    },
    workout: {
      premade_id: ['morning-energizer', 'upper-body-strength', 'hiit-30', 'yoga-flow', 'cardio-blast', 'lower-body-blast', 'bedtime-stretch'][i],
      motivational_tip: ['Set the tone today. Leaders go first.', 'Build the strength to keep showing up.', 'Full effort — love culture is built at full effort.', 'Flow with intention. Culture is created in quiet moments.', 'Midweek push. Cultures are sustained through hard days.', 'Build the foundation. What holds you carries your relationships.', 'Rest well. Week 8 is the final week.'][i],
      coach_note: ['Lead with your body and your character today.', 'Seven weeks in. You are not who you were.', 'HIIT — full effort in short windows builds capacity over time.', 'Slow and present. The deepest work happens quietly.', 'Cardio endurance for the long game.', 'Final weekly foundation work.', 'Rest before the final week.'][i],
    },
    nutrition: {
      focus: ['Culture Temperature Check', 'The Love Culture Vision', 'Observe the Margins', 'Create Belonging for One Person', 'Repair One Thing', 'Love Through the Hard Day', 'Extend an Invitation'][i],
      meal_theme: ['Setting the Atmosphere', 'Leading the Way', 'What They\'re Absorbing', 'Unconditional Welcome', 'Conflict as Connection', 'Persevering Love', 'Overflow Outward'][i],
      plan: [
        'Rate your relationship culture on 1-10 in each area: How safe do people feel being honest with you? How quickly are conflicts repaired? How often are love languages actively spoken? How often do people leave interactions with you feeling better than before? Where is the lowest score and what would raise it?',
        'Write the love culture you want to create in your most important relationship or household. What does it look, sound, and feel like? What is your specific role in building it? What is the first concrete action?',
        'Pay specific attention today to what is being communicated about love in the unguarded moments — at the dinner table, in the car, before bed. What are those moments currently teaching? What would you want them to teach?',
        'Identify one person in your relational world who might not feel they fully belong. Do one specific, concrete thing to communicate unconditional welcome to them today.',
        'Identify one unresolved conflict or distance in a close relationship. Take the first step toward repair today — even if the conflict wasn\'t primarily your fault. Go first.',
        'Today, choose to love someone in their language even though you don\'t feel like it. Love as a decision. Love through the friction. Notice what it produces in you and in them.',
        'Extend an invitation to someone on the edges of your relational world — someone who could benefit from the love culture you\'ve been building these 7 weeks.',
      ][i],
      tip: [
        'The temperature of a relationship is largely set by the person willing to take responsibility for it.',
        'Love cultures are built in specific choices, not general intentions.',
        'The margins of daily life are more formative than the special occasions.',
        'Belonging extended before it is earned is the rarest and most powerful relational gift.',
        'Going first in repair — even when you didn\'t start the conflict — is a profound act of love.',
        'Love that perseveres through the hard days is the only love that can be fully trusted.',
        'The love that starts in your household eventually must overflow or it becomes self-contained and begins to diminish.',
      ][i],
      recipe_search: ['family dinner recipe', 'hosting meal ideas', 'cooking for community', 'welcoming meal', 'comfort meal after conflict', 'perseverance meal', 'sharing food with neighbors'][i],
    },
    journal: {
      prompt: [
        'What one change would most dramatically shift the love culture in your most important relationship or household?',
        'What does love look like when it leads — when one person chooses to go first regardless of the other?',
        'What did you notice in the margins of your relationships this week? What were those unguarded moments teaching?',
        'What does belonging feel like to give? To receive? Who in your world needs it most right now?',
        'What did going first in repair cost you? What did it create that wouldn\'t have existed otherwise?',
        'What did choosing to love on a hard day teach you about the nature of love?',
        'Week 7: What does a love culture look and feel like in the relationships you\'ve been building?',
      ][i],
      entry_type: 'general',
    },
    affirmation: [
      'I set the temperature in my relationships. I choose to make them warmer.',
      'My love is the most visible testimony of my faith. I love visibly and consistently.',
      'What I model in unguarded moments shapes those who watch me. I choose carefully.',
      'Belonging is given here before it is earned. I welcome people as they are.',
      'I repair quickly. I go first. Conflict in my relationships leads to deeper connection.',
      'I love on the hard days. Especially on the hard days.',
      'The love I build here overflows. It reaches beyond my inner circle.',
    ][i],
    personal_growth_page: ['MyJournalEntries', 'MyJournalEntries', 'MyJournalEntries', 'EmotionalCheckInPage', 'MyJournalEntries', 'EmotionalCheckInPage', 'WeeklyReflectionPage'][i],
    personal_growth_label: ['Open Journal', 'Open Journal', 'Open Journal', 'Emotional Check-In', 'Open Journal', 'Emotional Check-In', 'Weekly Reflection'][i],
  })),

  // ═══════════════════════════════════════════════════════════════════════════
  // WEEK 8 — LOVE THAT LASTS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    day: 50, week: 8, title: 'The Person You\'ve Become',
    bible: { book: '2 Corinthians', chapter: 5, verse_range: '17', key_verse: '"The old has gone, the new is here." — 2 Corinthians 5:17', devotion: 'Eight weeks ago you began this journey with a certain understanding of love, certain patterns in your relationships, and certain defaults in how you give and receive care. That person still exists in your memory. But you are not that person anymore. The work of these eight weeks — the reflection, the practice, the challenged patterns, the forgiveness steps, the new habits — has changed you. Not completely. Not finished. But genuinely changed. Receive that today.', reflection_q: 'Who were you in relationships 8 weeks ago? What patterns did you carry? What did you not know then that you know now? What is most different?' },
    workout: { premade_id: 'strength-circuit', motivational_tip: 'You are not who you were on Day 1. Prove it today in how you move and how you love.', coach_note: 'Final week. Personal best. Eight weeks of showing up has built something real.' },
    nutrition: { focus: 'The Before and After', meal_theme: 'New Creation', plan: 'Write your relational "before and after." What were your defaults 8 weeks ago — in conflict, in affection, in presence, in service, in forgiveness? What are they now? Even slight shifts are real shifts. Celebrate the changes you can see.', tip: 'Growth is rarely dramatic in real time. Looking back across 8 weeks reveals what daily reflection cannot.', recipe_search: 'celebration meal healthy' },
    journal: { prompt: 'Write about the most significant shift in how you love someone that has happened over these 8 weeks. What caused that shift? Who has felt the difference?', entry_type: 'general' },
    affirmation: 'I am not who I was. Love has changed me. I continue to grow.',
    personal_growth_page: 'MyJournalEntries', personal_growth_label: 'Open Journal',
  },

  {
    day: 51, week: 8, title: 'Celebrating What Was Built',
    bible: { book: 'Psalm', chapter: 126, verse_range: '1-3', key_verse: '"The Lord has done great things for us, and we are filled with joy." — Psalm 126:3', devotion: 'Look at what has actually changed. Some of it is dramatic — a repaired relationship, a forgiveness step taken, a pattern broken. Some of it is subtle — a slightly longer hug, an apology offered, a question asked that wouldn\'t have been asked before. All of it is real. The Psalmist says "we were like those who dreamed" — the change felt impossible until it was happening. What felt impossible 8 weeks ago that is real today?', reflection_q: 'Which relationship has changed most noticeably over these 8 weeks? What specific things happened that wouldn\'t have happened before you started?' },
    workout: { premade_id: 'cardio-blast', motivational_tip: 'Sprint toward the finish. You\'ve earned this final push.', coach_note: 'Second to last hard workout. Everything you have.' },
    nutrition: { focus: 'The Relationship Wins List', meal_theme: 'Gratitude and Celebration', plan: 'List every relational win from the past 8 weeks — big and small. Include moments you almost defaulted to the old pattern but chose differently. Moments you showed up. Moments you loved well. Moments you forgave. Moments you asked the better question. Write them all.', tip: 'What gets celebrated gets repeated. Naming your wins is not self-congratulation — it is reinforcement of the new pattern.', recipe_search: 'celebration gratitude meal' },
    journal: { prompt: 'What do you most want to protect from these 8 weeks going forward? What wins must not be lost?', entry_type: 'gratitude' },
    affirmation: 'I celebrate what love has built in me and in my relationships. The Lord has done great things.',
    personal_growth_page: 'GratitudeJournalPage', personal_growth_label: 'Gratitude Journal',
  },

  {
    day: 52, week: 8, title: 'Honest About What Still Needs Work',
    bible: { book: 'Proverbs', chapter: 27, verse_range: '17', key_verse: '"As iron sharpens iron, so one person sharpens another." — Proverbs 27:17', devotion: 'Honest self-assessment without self-condemnation is one of the rarest and most important skills in a growing person. You are not finished. There are places where old wiring is still the default, love languages you still struggle to speak, forgiveness work still in progress. This is not failure — it is honesty. The person who says "I\'m done and I\'ve arrived" stops growing. The person who says "here is exactly where I still need work" is the one who keeps becoming.', reflection_q: 'Where in your relationships are you still operating from old patterns? What will require continued, intentional work beyond this program?' },
    workout: { premade_id: 'hiit-30', motivational_tip: 'Do the hard work. The final week demands your full honesty and your full effort.', coach_note: 'Final HIIT. Everything you have.' },
    nutrition: { focus: 'The Honest Assessment', meal_theme: 'Clear-Eyed Growth', plan: 'Rate yourself honestly in each love language: how naturally do you speak Words of Affirmation, Acts of Service, Receiving Gifts, Quality Time, Physical Touch? For your lowest score, write one specific, concrete commitment for how you will grow in that language over the next 90 days.', tip: 'The love language that is hardest to give is almost always the one you most need to grow.', recipe_search: 'honest simple healthy meal' },
    journal: { prompt: 'What is the hardest love language for you to give consistently? What would it take to grow there? Who would benefit most if you did?', entry_type: 'general' },
    affirmation: 'I see myself clearly and without condemnation. I know where I am growing and I commit to the work.',
    personal_growth_page: 'EmotionalCheckInPage', personal_growth_label: 'Emotional Check-In',
  },

  {
    day: 53, week: 8, title: 'Commitments, Not Intentions',
    bible: { book: 'Joshua', chapter: 24, verse_range: '15', key_verse: '"But as for me and my household, we will serve the Lord." — Joshua 24:15', devotion: 'Joshua didn\'t express a hope or intention. He made a declaration in front of witnesses. The difference between an intention and a commitment is the presence of a decision that has already been made — a decision that doesn\'t need to be revisited every morning. Love going forward isn\'t about good feelings or sustained motivation. It is about commitments made in clear-headed, intentional moments that hold when the feelings change.', reflection_q: 'What commitments — not goals, not intentions, but actual commitments — do you want to make about how you love the people in your life going forward?' },
    workout: { premade_id: 'lower-body-blast', motivational_tip: 'Every rep is a vote for the person you are committed to becoming.', coach_note: 'Build the foundation. Commitments require a strong base.' },
    nutrition: { focus: 'The Love Commitment List', meal_theme: 'Declared Intentions', plan: 'Write 5 specific commitments about how you will love going forward. Not "I will be better" — specific: "I will ask one genuine question every day." "I will put my phone away during dinner." "I will initiate repair within 24 hours of conflict." "I will speak one specific affirmation every day." Write them somewhere permanent. Read them every morning for the next 30 days.', tip: 'A commitment is a decision made once so it doesn\'t have to be made again every morning under the variable pressure of feelings.', recipe_search: 'nourishing commitment meal' },
    journal: { prompt: 'What makes a commitment different from an intention? Which 5 commitments would, if kept consistently for one year, most transform your most important relationships?', entry_type: 'general' },
    affirmation: 'I am committed. Not when I feel like it — committed. My love is a decision I have already made.',
    personal_growth_page: 'HabitBuilderPage', personal_growth_label: 'Habit Builder',
  },

  {
    day: 54, week: 8, title: 'Love Is the Point',
    bible: { book: '1 Corinthians', chapter: 13, verse_range: '13', key_verse: '"The greatest of these is love." — 1 Corinthians 13:13', devotion: 'And now these three remain: faith, hope, and love. But the greatest of these is love. Everything else in this life is temporary. Prophecies will cease. Knowledge will pass away. Tongues will be stilled. What remains — what actually endures — is love. The love you build in your relationships, the forgiveness you choose, the presence you give, the words you speak, the service you offer. This is the thing that lasts. This is what God most cares about. This is the point.', reflection_q: 'At the end of your life, what do you want the people who knew you to say about how you loved them? Write that eulogy now and let it become your north star.' },
    workout: { premade_id: 'athlete-conditioning', motivational_tip: 'This is it. The final workout. Love and leave everything here.', coach_note: 'YOUR FINAL WORKOUT. Eight weeks of faithfulness. Train with the weight of who you are becoming.' },
    nutrition: { focus: 'The Love Eulogy', meal_theme: 'The Point of Everything', plan: 'Write the eulogy you want — not the one people would write today, but the one you are building toward. How did you love? Who felt most loved by you? What did your presence give to the world? What did they say at your table? Read it aloud. Let it settle in you as a vision, not a fantasy.', tip: 'People who write their desired eulogy make more intentional daily choices. It\'s not morbid — it\'s clarifying.', recipe_search: 'meaningful celebration dinner' },
    journal: { prompt: 'What does it mean that love is the greatest of these? What does that change about how you spend your time, your energy, your attention, and your words starting tomorrow?', entry_type: 'general' },
    affirmation: 'Love is the most important thing I do. I choose it deliberately, consistently, and with my whole heart.',
    personal_growth_page: 'MyJournalEntries', personal_growth_label: 'Open Journal',
  },

  {
    day: 55, week: 8, title: 'Share Your Story',
    bible: { book: 'Revelation', chapter: 12, verse_range: '11', key_verse: '"They triumphed by the word of their testimony." — Revelation 12:11', devotion: 'Your love story — even incomplete, even still in process, even honestly imperfect — is a weapon against someone else\'s despair. There are people in your life who have stopped believing that relationships can get better, that patterns can change, that forgiveness is possible. Your testimony — the honest one, not the highlight reel — could be the thing that restores their hope. Share it.', reflection_q: 'What would you tell someone at the very beginning of this journey about what it requires, what it costs, and what it gives back?' },
    workout: { premade_id: 'yoga-flow', motivational_tip: 'Move with gratitude. This is a celebration of what has happened in you.', coach_note: 'Final Saturday. Move with intention and gratitude.' },
    nutrition: { focus: 'Write and Share Your Testimony', meal_theme: 'Testimony and Generosity', plan: 'Write a 1-2 paragraph testimony from these 8 weeks: what you brought in, what happened, what changed, and what you\'re walking toward. Then share it with at least one person — a friend, a spouse, a family member — who could be encouraged by it.', tip: 'Your testimony doesn\'t need to be polished. It needs to be honest. Honest is what connects.', recipe_search: 'meal to share with friends' },
    journal: { prompt: 'Write your testimony. The real one. What happened in you over these 8 weeks? Who is watching you that needs to hear it?', entry_type: 'general' },
    affirmation: 'My story matters. What God has done in my relationships is worth sharing. I pass it on.',
    personal_growth_page: 'MyJournalEntries', personal_growth_label: 'Open Journal',
  },

  {
    day: 56, week: 8, title: 'Love Never Fails',
    bible: { book: '1 Corinthians', chapter: 13, verse_range: '8', key_verse: '"Love never fails." — 1 Corinthians 13:8', devotion: 'Love never fails. Not some love — love. The real kind. The kind that is patient when it doesn\'t feel like being patient. The kind that serves without keeping score. The kind that speaks specific truth with gentleness. The kind that sits with people in pain without needing to fix them. The kind that forgives because unforgiveness is a prison. That love never fails. Eight weeks is not a finish line — it is a threshold. What you\'ve built is not a destination; it\'s a direction. Press on.', reflection_q: 'Eight weeks. 56 days. Who are you now as a lover of people? How have your relationships changed? What does "love never fails" mean to you personally, right now?' },
    workout: { premade_id: 'bedtime-stretch', motivational_tip: '56 days. You kept showing up. This is just the beginning.', coach_note: '🙏 Day 56. You did it. Rest with gratitude. This is just the beginning.' },
    nutrition: { focus: 'The Final Letter', meal_theme: 'Love That Continues', plan: 'Write a letter to the person you are becoming — the version of you who has been loving intentionally, consistently, and skillfully for one year from now. What has changed? What do they know that you are only beginning to learn? What do they wish you had trusted sooner? Let this letter be the vision you step toward.', tip: 'Writing to your future self closes the gap between who you are and who you\'re becoming. Make it specific.', recipe_search: 'final celebration meal' },
    journal: { prompt: '8 weeks of choosing love. What has it cost you? What has it given you? What does "love never fails" mean to you now, personally, in the relationships you\'re actually living?\n\nWrite freely for as long as it takes. This entry is for the version of you who will open this journal in a year and need to remember what you built here.\n\nLove never fails. Press on.', entry_type: 'general' },
    affirmation: 'Love never fails. I choose it today and every day. I am just beginning.',
    personal_growth_page: 'WeeklyReflectionPage', personal_growth_label: 'Final Reflection',
  },
];

export const LOVE_LANGUAGES_PLAN = {
  id: 'love-languages-relationships',
  title: 'Love That Lasts',
  subtitle: '8-Week Relationship Transformation',
  description: 'An 8-week journey through the Five Love Languages — Words of Affirmation, Acts of Service, Receiving Gifts, Quality Time, and Physical Touch — woven together with Scripture, forgiveness work, and daily relationship practice. Whether you\'re growing a marriage, repairing a friendship, deepening family bonds, or learning to love yourself well, this plan will transform how you give and receive love.',
  weeks: 8,
  days_total: 56,
  difficulty: 'beginner',
  gradient: 'from-[#e11d48] to-[#0A1A2F]',
  accent: '#e11d48',
  cover_emoji: '❤️',
  tags: ['Relationships', 'Faith', 'Mindset', 'Journaling', 'Healing'],
  week_themes: LOVE_LANGUAGES_WEEK_THEMES,
  days: LOVE_LANGUAGES_DAYS,
};

export default LOVE_LANGUAGES_PLAN;
