// ─────────────────────────────────────────────────────────────────────────────
// PROSPERITY REVIVED — COACHING PLAN DATA
// "Renewed Strength: 8 Weeks to Whole-Life Transformation"
// ─────────────────────────────────────────────────────────────────────────────

import { FINANCIAL_FREEDOM_PLAN } from './financialFreedomPlanData';

export const WEEK_THEMES = [
  { week: 1, theme: 'Foundation',   title: 'Know Your Why',         color: 'from-[#0D4F3C] to-[#22856A]', accent: '#22856A', emoji: '🌱' },
  { week: 2, theme: 'Body',         title: 'Temple Strong',          color: 'from-[#0A1A2F] to-[#38BDF8]', accent: '#38BDF8', emoji: '💪' },
  { week: 3, theme: 'Mind',         title: 'Renew Your Mind',        color: 'from-[#3C4E53] to-[#AFC7E3]', accent: '#AFC7E3', emoji: '🧠' },
  { week: 4, theme: 'Spirit',       title: 'Deeper Waters',          color: 'from-[#0A1A2F] to-[#c9a227]', accent: '#c9a227', emoji: '✝️' },
  { week: 5, theme: 'Nutrition',    title: 'Fuel the Mission',       color: 'from-[#1a4d1e] to-[#4ade80]', accent: '#4ade80', emoji: '🥗' },
  { week: 6, theme: 'Habits',       title: 'Daily Discipline',       color: 'from-[#1e1a4d] to-[#FD9C2D]', accent: '#FD9C2D', emoji: '🔥' },
  { week: 7, theme: 'Community',    title: 'Iron Sharpens Iron',     color: 'from-[#4d1a1a] to-[#D9B878]', accent: '#D9B878', emoji: '🤝' },
  { week: 8, theme: 'Legacy',       title: 'Living Your Purpose',    color: 'from-[#0D4F3C] to-[#c9a227]', accent: '#c9a227', emoji: '👑' },
];

// ─────────────────────────────────────────────────────────────────────────────
// DAY DATA — 56 days, 8 weeks
// bible.book / bible.chapter deep-link → /Bible?book=X&chapter=Y
// workout.premade_id references PREMADE_WORKOUTS from WorkoutLibrary
// journal.entry_type maps to MyJournalEntries categories
// personal_growth_page links to a PersonalGrowth sub-page
// ─────────────────────────────────────────────────────────────────────────────

export const PLAN_DAYS = [

  // ═══════════════════════════════════════════════════════════════════════════
  // WEEK 1 — FOUNDATION: "Know Your Why"
  // ═══════════════════════════════════════════════════════════════════════════

  {
    day: 1, week: 1,
    title: 'The Why Behind It All',
    bible: {
      book: 'Romans', chapter: 12, verse_range: '1–2',
      key_verse: '"Do not conform to the pattern of this world, but be transformed by the renewing of your mind." — Romans 12:2',
      devotion: 'Every transformation begins with surrender. Paul doesn\'t call us to self-improvement — he calls us to a living sacrifice. The difference is everything. Self-improvement says "I\'ll be better on my own." Surrender says "I\'ll be new through You." This 8-week journey is not about willpower. It\'s about submission to the God who already sees who you can become.',
      reflection_q: 'In which area of your life have you been trying to change on your own strength, when you actually need to surrender it?',
    },
    workout: { premade_id: 'morning-energizer', motivational_tip: 'Your body is the first altar. Every rep is an act of stewardship.', coach_note: 'Don\'t worry about intensity today. Focus on showing up. That\'s the win.' },
    nutrition: {
      focus: 'Clean Slate',
      meal_theme: 'Anti-Inflammatory Foundation',
      plan: 'Breakfast: Greek yogurt with blueberries and a drizzle of honey. Lunch: Grilled chicken over mixed greens with olive oil and lemon. Dinner: Baked salmon with roasted sweet potato and steamed broccoli. Snack: Apple slices with almond butter.',
      tip: 'Start every morning with 16oz of water before coffee. This simple habit primes your metabolism and starts hydration early.',
      recipe_search: 'salmon',
    },
    journal: { prompt: 'What are the three most important areas of your life you want to transform in the next 8 weeks? Be specific. What would success look like on Day 56?', entry_type: 'general' },
    affirmation: 'I am fearfully and wonderfully made. I have everything I need for the transformation that is already underway.',
    personal_growth_page: 'MindsetResetPage',
    personal_growth_label: 'Mindset Reset',
  },

  {
    day: 2, week: 1,
    title: 'Created on Purpose',
    bible: {
      book: 'Psalm', chapter: 139, verse_range: '13–16',
      key_verse: '"For you created my inmost being; you knit me together in my mother\'s womb." — Psalm 139:13',
      devotion: 'Before you had a name, God had a design. You are not an accident, not an afterthought, not a prototype. You are a masterwork — deliberately constructed, intentionally placed, and uniquely gifted. The reason you\'re beginning this journey is because something in you recognizes that you haven\'t yet fully inhabited the person God built you to be. Today is the day you start showing up for that person.',
      reflection_q: 'What specific quality or gift has God placed in you that you haven\'t been fully stewarding? How can this program help you activate it?',
    },
    workout: { premade_id: 'beginner-full-body', motivational_tip: 'Every workout is a vote for the person you\'re becoming.', coach_note: 'Focus on form over speed. Building correct movement patterns now saves injuries later.' },
    nutrition: {
      focus: 'Protein as Priority',
      meal_theme: 'High-Protein Reset',
      plan: 'Breakfast: 3-egg omelet with spinach, tomatoes, and feta. Lunch: Turkey and avocado lettuce wraps. Dinner: Grilled chicken breast with quinoa and roasted asparagus. Snack: Handful of mixed nuts and string cheese.',
      tip: 'Aim for 25-30g of protein at each meal. Protein keeps you full, feeds your muscles, and stabilizes blood sugar.',
      recipe_search: 'chicken quinoa',
    },
    journal: { prompt: 'Write about a time when you operated in your unique gifts and felt truly alive. What were you doing? What made it feel different from other activities?', entry_type: 'general' },
    affirmation: 'I was created with intention and precision. My life has purpose that is worth pursuing with my whole heart.',
    personal_growth_page: 'IdentityInChristPage',
    personal_growth_label: 'Identity in Christ',
  },

  {
    day: 3, week: 1,
    title: 'Plans that Prosper',
    bible: {
      book: 'Jeremiah', chapter: 29, verse_range: '11–13',
      key_verse: '"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future." — Jeremiah 29:11',
      devotion: 'God said these words to a people in exile — people who had lost everything and been carried away from home. He wasn\'t speaking to the comfortable. He was speaking to the desperate. If today you feel far from where you want to be, know that Jeremiah 29:11 is not a comfort for the comfortable. It is a promise to the displaced. You are exactly where this promise finds you.',
      reflection_q: 'Where in your life do you feel most "in exile" — furthest from where you know you should be? What would it look like to trust God\'s plan in that space?',
    },
    workout: { premade_id: 'yoga-flow', motivational_tip: 'Flexibility of body leads to flexibility of spirit. Let go of what no longer serves you.', coach_note: 'A rest day from intensity is still an active day. Yoga restores what exercise depletes.' },
    nutrition: {
      focus: 'Gut Health',
      meal_theme: 'Probiotic & Fiber Rich',
      plan: 'Breakfast: Overnight oats with chia seeds, banana, and cinnamon. Lunch: Lentil soup with a sourdough slice. Dinner: Stir-fried tofu with bok choy, brown rice, and sesame. Snack: Kombucha and a small handful of walnuts.',
      tip: 'Your gut is your second brain. When your gut microbiome is healthy, your mood, energy, and focus all improve. Feed it well.',
      recipe_search: 'lentil soup',
    },
    journal: { prompt: 'If God already has plans to prosper you, what role do your daily habits play? Write about one habit you need to add and one you need to remove.', entry_type: 'habit_tracker' },
    affirmation: 'God\'s plans for my life are better than anything I could design for myself. I trust His timing and His direction.',
    personal_growth_page: 'GrowthPathwaysPage',
    personal_growth_label: 'Growth Pathways',
  },

  {
    day: 4, week: 1,
    title: 'Trusting the Process',
    bible: {
      book: 'Proverbs', chapter: 3, verse_range: '5–6',
      key_verse: '"Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight." — Proverbs 3:5–6',
      devotion: 'The hardest part of transformation is the middle — the days when you can\'t see the results yet but have already paid the price. Proverbs 3 reminds us that the path forward isn\'t paved with our understanding. It\'s paved with our trust. When you don\'t understand the process, trust the One who designed it.',
      reflection_q: 'What is one area of this journey (physical, spiritual, nutritional) where you feel the most impatient? What does trusting the process look like there?',
    },
    workout: { premade_id: 'core-crusher', motivational_tip: 'Your core is your foundation — physically and spiritually. Strengthen what holds everything else together.', coach_note: 'A strong core prevents injury in every other workout. This is foundational work.' },
    nutrition: {
      focus: 'Hydration',
      meal_theme: 'Water-Rich Foods',
      plan: 'Breakfast: Green smoothie — spinach, cucumber, apple, lemon, ginger. Lunch: Watermelon and feta salad with mint. Dinner: Baked white fish with steamed zucchini noodles and marinara. Snack: Celery with hummus.',
      tip: 'You are 60% water. Dehydration shows up as fatigue before thirst. If you feel tired midday, drink water first.',
      recipe_search: 'green smoothie',
    },
    journal: { prompt: 'Gratitude inventory: List 10 things — big or small — that you are genuinely grateful for right now. How does gratitude change your perspective on your journey?', entry_type: 'gratitude' },
    affirmation: 'I release the need to control every outcome. I trust the path God has laid before me even when I cannot see around the bend.',
    personal_growth_page: 'GratitudeJournalPage',
    personal_growth_label: 'Gratitude Journal',
  },

  {
    day: 5, week: 1,
    title: 'Chosen and Beloved',
    bible: {
      book: 'Ephesians', chapter: 1, verse_range: '3–6',
      key_verse: '"He chose us in him before the creation of the world to be holy and blameless in his sight." — Ephesians 1:4',
      devotion: 'Before the first star was hung, before time had a name, God chose you. Not the polished version of you. Not the disciplined version. The actual you — in all your complexity, contradiction, and unfinished edges. This is the bedrock of your identity: chosen before you could earn it, loved before you could deserve it. Every workout, every clean meal, every journal entry this week flows from this foundation.',
      reflection_q: 'How would your daily choices look different if you started each day truly believing you were chosen and beloved by God?',
    },
    workout: { premade_id: 'cardio-blast', motivational_tip: 'You were built for more. Today, push past the voice that says you\'ve done enough.', coach_note: 'Cardio releases endorphins that elevate mood for hours. This is mental health work disguised as exercise.' },
    nutrition: {
      focus: 'Metabolism Boost',
      meal_theme: 'Thermogenic Foods',
      plan: 'Breakfast: Scrambled eggs with jalapeño and salsa on whole-grain toast. Lunch: Black bean and brown rice bowl with avocado and lime. Dinner: Chicken stir-fry with bell peppers, ginger, and garlic. Snack: Green tea and a hard-boiled egg.',
      tip: 'Spices like turmeric, cayenne, and ginger can boost metabolism by 4-5%. Add them generously.',
      recipe_search: 'black bean bowl',
    },
    journal: { prompt: 'What lies about your identity have you been carrying? Write them out — then write the truth from Scripture that counters each one.', entry_type: 'scripture_reflection' },
    affirmation: 'I am chosen, holy, and dearly loved. Nothing I do today can make God love me more or less.',
    personal_growth_page: 'IdentityInChristPage',
    personal_growth_label: 'Identity in Christ',
  },

  {
    day: 6, week: 1,
    title: 'Strength for the Journey',
    bible: {
      book: 'Isaiah', chapter: 40, verse_range: '28–31',
      key_verse: '"But those who hope in the Lord will renew their strength. They will soar on wings like eagles." — Isaiah 40:31',
      devotion: 'Isaiah was writing to people who were exhausted — a nation that had run out of energy, hope, and vision. His answer was not more strategy or more effort. His answer was hope in the Lord. The Hebrew word for "renew" here literally means to exchange — you hand over your weakness and receive His strength. That exchange is available to you today.',
      reflection_q: 'What has been draining your energy most this week? How can you "exchange" that weariness with God in prayer today?',
    },
    workout: { premade_id: 'upper-body-strength', motivational_tip: 'Six days in. You\'ve already proven something about yourself. Don\'t stop now.', coach_note: 'Strength training increases bone density, metabolism, and confidence. You\'re building more than muscle.' },
    nutrition: {
      focus: 'Energy Foods',
      meal_theme: 'Complex Carbs & Iron',
      plan: 'Breakfast: Oatmeal with banana, walnuts, and cinnamon. Lunch: Spinach salad with grilled steak, chickpeas, and balsamic. Dinner: Whole wheat pasta with turkey bolognese and side salad. Snack: Dates with tahini.',
      tip: 'Complex carbohydrates like oats, sweet potato, and whole grains provide sustained energy without a crash.',
      recipe_search: 'turkey bolognese',
    },
    journal: { prompt: 'Write a letter to yourself from your Week 8 self. What do they want you to know right now? What encouragement would they give you at this moment?', entry_type: 'general' },
    affirmation: 'When I feel weak, I remember that His strength is made perfect in my weakness. I exchange my tired for His strength.',
    personal_growth_page: 'AffirmationsPage',
    personal_growth_label: 'Affirmations',
  },

  {
    day: 7, week: 1,
    title: 'Sabbath — Rest as a Discipline',
    bible: {
      book: 'Genesis', chapter: 2, verse_range: '1–3',
      key_verse: '"By the seventh day God had finished the work he had been doing; so on the seventh day he rested." — Genesis 2:2',
      devotion: 'God didn\'t rest because He was tired. He rested because rest is holy. Sabbath is not laziness — it is a radical act of trust that says "the world will keep turning without my effort today." This week you laid a foundation. Today, let it set. Rest, reflect, celebrate the work already done, and prepare your spirit for Week 2.',
      reflection_q: 'Review your week. What is the most significant shift — in thinking, feeling, or doing — that happened in the last 7 days?',
    },
    workout: { premade_id: 'bedtime-stretch', motivational_tip: 'Rest is not the absence of discipline. It is the completion of it.', coach_note: 'Active recovery stretches reduce next-week soreness by 30%. This is productive rest.' },
    nutrition: {
      focus: 'Mindful Eating',
      meal_theme: 'Your Favorite Nourishing Meal',
      plan: 'Today, prepare and eat a meal you truly love — something nourishing that also brings you joy. Eat slowly, without screens. Taste every bite. This is Sabbath for your body.',
      tip: 'It takes 20 minutes for your stomach to signal fullness to your brain. Slow down and you\'ll naturally eat less and enjoy more.',
      recipe_search: 'comfort food healthy',
    },
    journal: { prompt: 'Week 1 reflection: What did you learn about yourself this week? What was harder than expected? What was easier? What do you most want to carry into Week 2?', entry_type: 'weekly_reflection' },
    affirmation: 'Rest is not a reward I earn. Rest is a gift I receive. I am enough today, even at rest.',
    personal_growth_page: 'WeeklyReflectionPage',
    personal_growth_label: 'Weekly Reflection',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WEEK 2 — BODY: "Temple Strong"
  // ═══════════════════════════════════════════════════════════════════════════

  {
    day: 8, week: 2,
    title: 'Your Body is a Temple',
    bible: {
      book: '1 Corinthians', chapter: 6, verse_range: '19–20',
      key_verse: '"Do you not know that your bodies are temples of the Holy Spirit... You are not your own; you were bought at a price. Therefore honor God with your bodies." — 1 Corinthians 6:19–20',
      devotion: 'The word "temple" in Greek is naos — the innermost sanctuary, the holy of holies. Paul is not saying your body is a general religious building. He is saying the Spirit of God lives in your inner chamber. How you treat your body is how you treat His dwelling. This week, every workout, every meal, every hour of sleep is an act of worship.',
      reflection_q: 'In what specific ways are you currently honoring or dishonoring God with your body? What is one change you will commit to this week?',
    },
    workout: { premade_id: 'strength-circuit', motivational_tip: 'This is worship. Every rep, every set, every drop of sweat offered to the One who made you.', coach_note: 'Week 2 is where the real training begins. Expect to be challenged — that\'s the design.' },
    nutrition: {
      focus: 'Temple Maintenance',
      meal_theme: 'Whole Foods Only',
      plan: 'Breakfast: Smoothie bowl — acai, banana, almond milk, topped with granola and berries. Lunch: Grilled salmon tacos with cabbage slaw and avocado. Dinner: Baked chicken thighs with roasted vegetables and farro. Snack: Medjool dates and mixed nuts.',
      tip: 'This week, eliminate one processed food from your diet. Choose one item that you know doesn\'t honor your body and replace it.',
      recipe_search: 'salmon tacos',
    },
    journal: { prompt: 'Write about your relationship with your body. Have you been at war with it, indifferent to it, or caring for it? What kind of relationship do you want to have with it?', entry_type: 'emotional_checkin' },
    affirmation: 'My body is sacred. I honor it with what I eat, how I move, and how I rest.',
    personal_growth_page: 'EmotionalCheckInPage',
    personal_growth_label: 'Emotional Check-In',
  },

  {
    day: 9, week: 2,
    title: 'Built for Battle',
    bible: {
      book: '2 Timothy', chapter: 1, verse_range: '7',
      key_verse: '"For God has not given us a spirit of fear, but of power and of love and of a sound mind." — 2 Timothy 1:7',
      devotion: 'Physical training is also psychological training. Every time you push through the last set when your body says stop, you are training your mind to override fear. This is not just fitness — this is building the mental hardware for every challenge you will face. A person who knows they can endure physical hardship carries a confidence into every room they enter.',
      reflection_q: 'What does fear most commonly rob you of — in health, work, relationships, faith? How does building physical discipline equip you to fight that fear?',
    },
    workout: { premade_id: 'hiit-30', motivational_tip: 'Fear is a feeling. Courage is a decision. Choose it today, one interval at a time.', coach_note: 'HIIT training trains your nervous system to recover quickly from stress. This is mental toughness built physically.' },
    nutrition: {
      focus: 'Pre-Workout Power',
      meal_theme: 'Performance Fuel',
      plan: 'Breakfast: Banana with peanut butter 30 min before workout. Post-workout: Protein shake or Greek yogurt immediately after. Lunch: Tuna salad on whole-grain with tomato and cucumber. Dinner: Beef stir-fry with broccoli, snap peas, and brown rice. Snack: Hard-boiled eggs.',
      tip: 'Eat a small carb + protein snack 30-45 minutes before intense workouts for maximum performance.',
      recipe_search: 'tuna salad',
    },
    journal: { prompt: 'Name your top 3 fears. For each one, write: "Because God has given me power, love, and a sound mind, I will face this fear by..."', entry_type: 'mindset_reset' },
    affirmation: 'I am not controlled by fear. Power, love, and a sound mind are my inheritance.',
    personal_growth_page: 'MindsetResetPage',
    personal_growth_label: 'Mindset Reset',
  },

  {
    day: 10, week: 2,
    title: 'Discipline is Discipleship',
    bible: {
      book: '1 Corinthians', chapter: 9, verse_range: '24–27',
      key_verse: '"I discipline my body and keep it under control." — 1 Corinthians 9:27',
      devotion: 'Paul uses athletic metaphors more than any other New Testament writer. He understood that spiritual maturity looks a lot like athletic training — intentional, costly, cumulative. The Greek word for discipline here is hypōpiazō — literally "to strike under the eye." Paul is saying he trains his body the way a boxer trains — with focused aggression toward his own weaknesses. What weakness are you disciplining today?',
      reflection_q: 'What specific physical or behavioral pattern needs more of your intentional discipline? What does "keeping it under control" look like for you?',
    },
    workout: { premade_id: 'lower-body-blast', motivational_tip: 'Your legs carry you everywhere you\'re going. Build them strong.', coach_note: 'Leg day increases testosterone and growth hormone naturally — it\'s the most impactful single workout for whole-body strength.' },
    nutrition: {
      focus: 'Blood Sugar Balance',
      meal_theme: 'Low-Glycemic Day',
      plan: 'Breakfast: Veggie and egg frittata. Lunch: Large salad with grilled shrimp, quinoa, and tahini dressing. Dinner: Turkey meatballs with zucchini noodles and pesto. Snack: Handful of almonds and berries.',
      tip: 'Pairing protein with every carbohydrate slows glucose absorption and prevents energy crashes throughout the day.',
      recipe_search: 'zucchini noodles',
    },
    journal: { prompt: 'What does your morning routine currently look like? Design your ideal morning routine — one that sets you up to win every day before most people are awake.', entry_type: 'habit_tracker' },
    affirmation: 'I am the master of my impulses. My discipline today is building the life I want tomorrow.',
    personal_growth_page: 'HabitBuilderPage',
    personal_growth_label: 'Habit Builder',
  },

  {
    day: 11, week: 2,
    title: 'Daniel\'s Discipline',
    bible: {
      book: 'Daniel', chapter: 1, verse_range: '8–17',
      key_verse: '"But Daniel resolved not to defile himself with the royal food and wine." — Daniel 1:8',
      devotion: 'Daniel was offered the finest food in the most powerful kingdom on earth — and he said no. Not out of legalism, but out of conviction. He understood that what entered his body shaped his capacity to think, discern, and hear from God. At the end of the trial, he and his friends were "ten times better" than those who ate the royal diet. Nutritional discipline is not deprivation — it is competitive advantage.',
      reflection_q: 'What specific food or dietary habit is currently hindering your mental clarity, physical performance, or spiritual sensitivity? What would Daniel do?',
    },
    workout: { premade_id: 'abs-focus', motivational_tip: 'Core strength is character strength — it holds everything else together under pressure.', coach_note: 'A strong core protects your spine in every workout and every day. This is preventative maintenance.' },
    nutrition: {
      focus: 'Daniel Fast Inspired',
      meal_theme: 'Plants and Whole Grains',
      plan: 'Breakfast: Fruit and nut granola with almond milk. Lunch: Chickpea and vegetable curry over brown rice. Dinner: Lentil and sweet potato shepherd\'s pie. Snack: Fresh fruit and handful of seeds.',
      tip: 'The original Daniel Fast — no meat, no dairy, no wine — is essentially a whole-food plant-based diet. It reduces inflammation and boosts mental clarity within 10 days.',
      recipe_search: 'chickpea curry',
    },
    journal: { prompt: 'What "royal food" is being offered to you that looks good but doesn\'t serve your best self? Write about one area where you will exercise Daniel\'s resolve.', entry_type: 'scripture_reflection' },
    affirmation: 'My choices today determine my clarity tomorrow. I choose what nourishes, not what merely satisfies.',
    personal_growth_page: 'AffirmationsPage',
    personal_growth_label: 'Affirmations',
  },

  {
    day: 12, week: 2,
    title: 'Running to Win',
    bible: {
      book: 'Hebrews', chapter: 12, verse_range: '1–2',
      key_verse: '"Let us run with perseverance the race marked out for us, fixing our eyes on Jesus, the pioneer and perfecter of faith." — Hebrews 12:1',
      devotion: 'The "great cloud of witnesses" in Hebrews 12 are cheering for you. Every saint who ran their race before you is now in the stands watching yours. They know what it costs. They know what it takes. They are not indifferent to your struggle — they are invested in it. Run as someone who is seen, known, and cheered on.',
      reflection_q: 'Whose example of faithfulness — from Scripture, history, or your own life — most inspires you to keep running? What specifically about their story speaks to yours?',
    },
    workout: { premade_id: 'fat-burn-20', motivational_tip: 'The stands are full. Run like someone is watching — because they are.', coach_note: 'Twenty focused minutes burns more fat than an hour of casual movement. Intensity matters.' },
    nutrition: {
      focus: 'Recovery Nutrition',
      meal_theme: 'Anti-Inflammatory & Antioxidant',
      plan: 'Breakfast: Turmeric golden milk with oatmeal and fresh berries. Lunch: Grilled salmon with roasted beets and arugula salad. Dinner: Baked cod with Mediterranean roasted vegetables. Snack: Tart cherry juice and dark chocolate.',
      tip: 'Tart cherry juice has been shown to reduce muscle soreness and improve recovery by up to 30%. Drink it after tough workouts.',
      recipe_search: 'roasted beets',
    },
    journal: { prompt: 'Who is in your "great cloud of witnesses" — people who have gone before you and whose legacy motivates you? Write about one person and what their life teaches you.', entry_type: 'general' },
    affirmation: 'I am not running alone. I am surrounded by witnesses, guided by faith, and sustained by grace.',
    personal_growth_page: 'GrowthPathwaysPage',
    personal_growth_label: 'Growth Pathways',
  },

  {
    day: 13, week: 2,
    title: 'Eagles\' Wings',
    bible: {
      book: 'Isaiah', chapter: 40, verse_range: '28–31',
      key_verse: '"They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint." — Isaiah 40:31',
      devotion: 'Isaiah gives three images in ascending order of demand: soaring (effortless), running (sustained effort), walking (grinding it out). The promise covers all three. There will be seasons of soaring where everything comes easily. There will be seasons of running where you have to work but the energy is there. And there will be seasons of walking — barely moving, just surviving. The promise is for all three. Today, wherever you are, the promise holds.',
      reflection_q: 'What season are you currently in — soaring, running, or walking? What does "renewing your strength" need to look like for you this week?',
    },
    workout: { premade_id: 'power-yoga', motivational_tip: 'Strength and serenity are not opposites. Find both today.', coach_note: 'Power yoga builds strength, balance, and breath control — all of which translate to every other form of fitness.' },
    nutrition: {
      focus: 'Sustained Energy',
      meal_theme: 'Complex Carbs & Healthy Fats',
      plan: 'Breakfast: Avocado toast on sourdough with poached eggs and everything bagel seasoning. Lunch: Brown rice bowl with roasted chickpeas, cucumber, tomato, and tzatziki. Dinner: Pasta primavera with olive oil, garlic, and fresh herbs. Snack: Banana and almond butter.',
      tip: 'Healthy fats — avocado, olive oil, nuts — are the most energy-dense macronutrient. They fuel long sustained efforts where carbohydrates fall short.',
      recipe_search: 'avocado toast',
    },
    journal: { prompt: 'When was the last time you felt like you were "soaring" in some area of life? What conditions made that possible? How can you recreate those conditions?', entry_type: 'general' },
    affirmation: 'I am sustained by the Lord who does not grow tired or weary. His strength flows through me today.',
    personal_growth_page: 'GuidedMeditationsPage',
    personal_growth_label: 'Guided Meditation',
  },

  {
    day: 14, week: 2,
    title: 'Sabbath — Take Stock',
    bible: {
      book: '1 Kings', chapter: 19, verse_range: '4–8',
      key_verse: '"The journey is too much for you." — 1 Kings 19:7',
      devotion: 'Elijah — the most powerful prophet in Israel — sat under a tree and asked to die. He was depleted. God\'s response was not a lecture, not a correction. God let him sleep. Then He fed him. Twice. Then He sent him back. Rest, nourishment, and then the mission. The sequence matters. Today, honor that sequence.',
      reflection_q: 'What has the most depleted you this week — physically, emotionally, or spiritually? What specific form of rest does your soul most need today?',
    },
    workout: { premade_id: 'bedtime-stretch', motivational_tip: 'Elijah slept. Then ate. Then was sent. Rest before the next mission.', coach_note: 'Sleep is when your muscles actually grow. 8 hours tonight will do more for your physique than another workout.' },
    nutrition: {
      focus: 'Nourish & Restore',
      meal_theme: 'One Beautiful Meal',
      plan: 'Cook something you have been wanting to try — a new recipe, a cuisine, a technique. Make the preparation itself part of the rest. Eat slowly, eat gratefully.',
      tip: 'Cooking at home is linked to better nutrition outcomes, lower calorie intake, and greater food satisfaction than eating out, even when cooking "indulgent" meals.',
      recipe_search: 'new recipe ideas',
    },
    journal: { prompt: 'Week 2 reflection: How has your relationship with your body changed this week? What habit from this week do you most want to carry forward permanently?', entry_type: 'weekly_reflection' },
    affirmation: 'I give myself permission to rest. My value is not in my productivity. I am loved in my stillness.',
    personal_growth_page: 'WeeklyReflectionPage',
    personal_growth_label: 'Weekly Reflection',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WEEK 3 — MIND: "Renew Your Mind"
  // ═══════════════════════════════════════════════════════════════════════════

  {
    day: 15, week: 3,
    title: 'The Battlefield of the Mind',
    bible: {
      book: 'Philippians', chapter: 4, verse_range: '6–8',
      key_verse: '"Whatever is true, whatever is noble, whatever is right... think about such things." — Philippians 4:8',
      devotion: 'Paul wrote Philippians from a prison cell. He had no control over his circumstances, but he had complete control over his thought life — and he disciplined it ferociously. The mind is a garden. Whatever you plant will grow. Whatever you allow will spread. This week is about examining what you have been watering in your thought life and making intentional decisions about what you will plant instead.',
      reflection_q: 'What negative thought patterns run most frequently in your mind? Are they true, noble, right, pure, lovely, admirable? If not, what true thought can replace each one?',
    },
    workout: { premade_id: 'morning-energizer', motivational_tip: 'A strong morning routine is a guard posted at the gate of your mind.', coach_note: 'Morning workouts have been shown to improve cognitive function and reduce anxiety for up to 12 hours.' },
    nutrition: {
      focus: 'Brain Foods',
      meal_theme: 'Omega-3 & Antioxidant Rich',
      plan: 'Breakfast: Walnut and blueberry oatmeal with flaxseed. Lunch: Smoked salmon and avocado on rye. Dinner: Grilled tuna with roasted asparagus and sweet potato. Snack: Dark chocolate and walnuts.',
      tip: 'Omega-3 fatty acids (salmon, walnuts, flaxseed) are the building blocks of brain cell membranes. Feed your mind literally.',
      recipe_search: 'omega-3 brain food',
    },
    journal: { prompt: 'Write your top 5 most recurring negative thoughts. Then write a true, biblically-grounded counter-thought for each one. Post these where you\'ll see them daily.', entry_type: 'mindset_reset' },
    affirmation: 'I take every thought captive and make it obedient to the truth of God\'s Word.',
    personal_growth_page: 'MindsetResetPage',
    personal_growth_label: 'Mindset Reset',
  },

  {
    day: 16, week: 3,
    title: 'Peace that Passes Understanding',
    bible: {
      book: 'Philippians', chapter: 4, verse_range: '4–7',
      key_verse: '"And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus." — Philippians 4:7',
      devotion: 'The Greek word for "guard" here is phroureo — a military term meaning to station a garrison. Paul says God\'s peace doesn\'t just soothe your mind, it stations an armed guard over it. Anxiety cannot breach a mind where God\'s peace is the sentinel. But the guard is stationed through prayer and thanksgiving — not through circumstantial change.',
      reflection_q: 'What anxiety is you carrying today that you could release in prayer right now? Write it as a prayer — name it specifically, then hand it over.',
    },
    workout: { premade_id: 'yoga-flow', motivational_tip: 'Let your breath be your prayer. Inhale peace. Exhale anxiety.', coach_note: 'The vagus nerve is directly stimulated by slow, deep breathing. This is the physical pathway to peace.' },
    nutrition: {
      focus: 'Stress-Reducing Foods',
      meal_theme: 'Magnesium & B-Vitamin Rich',
      plan: 'Breakfast: Dark leafy green smoothie with banana and almond milk. Lunch: Quinoa and black bean bowl with roasted peppers. Dinner: Baked salmon with garlic spinach and wild rice. Snack: Pumpkin seeds and chamomile tea.',
      tip: 'Magnesium deficiency is one of the most common causes of anxiety and poor sleep. Dark leafy greens, pumpkin seeds, and dark chocolate are your best sources.',
      recipe_search: 'magnesium rich recipes',
    },
    journal: { prompt: 'Make a "worry list" — everything weighing on your mind right now. Then, next to each worry, write: "I am giving this to God because..." Finish the sentence with a specific reason to trust Him with this.',
      entry_type: 'emotional_checkin' },
    affirmation: 'I do not have to understand everything to have peace about everything. God\'s peace guards my mind today.',
    personal_growth_page: 'EmotionalCheckInPage',
    personal_growth_label: 'Emotional Check-In',
  },

  {
    day: 17, week: 3,
    title: 'You Are Not Your Thoughts',
    bible: {
      book: '2 Corinthians', chapter: 10, verse_range: '3–5',
      key_verse: '"We take captive every thought to make it obedient to Christ." — 2 Corinthians 10:5',
      devotion: 'Paul says we can take thoughts captive — which means a thought can visit you without moving in. You are not obligated to entertain every visitor. The thought arrives at the door; you are the doorman. You get to decide whether to let it in, feed it, give it a bedroom. This is not toxic positivity. This is spiritual authority over your own interior life.',
      reflection_q: 'Which thought has been living rent-free in your mind for too long? Evict it today. What will you replace it with?',
    },
    workout: { premade_id: 'cardio-blast', motivational_tip: 'Movement is therapy. When your body is moving, your mind cannot stay stuck.', coach_note: 'Aerobic exercise increases BDNF — brain-derived neurotrophic factor — which literally grows new brain cells and improves mood.' },
    nutrition: {
      focus: 'Gut-Brain Connection',
      meal_theme: 'Fermented & Fiber-Rich',
      plan: 'Breakfast: Overnight oats with kefir, banana, and honey. Lunch: Kimchi fried rice with edamame and sesame. Dinner: Miso-glazed salmon with steamed bok choy and brown rice. Snack: Kombucha and apple slices.',
      tip: 'The gut produces 95% of your body\'s serotonin. A healthy gut biome is the single most underrated tool for mental health.',
      recipe_search: 'miso salmon',
    },
    journal: { prompt: 'Describe a recent situation where a thought spiraled into an emotion, then into a behavior. Trace the path backward. Where could you have captured that thought? What truth could have interrupted the spiral?', entry_type: 'emotional_checkin' },
    affirmation: 'I am not subject to my thoughts. I am the authority over them. I choose what I dwell on.',
    personal_growth_page: 'MindsetResetPage',
    personal_growth_label: 'Mindset Reset',
  },

  {
    day: 18, week: 3,
    title: 'The Mind of Christ',
    bible: {
      book: 'Colossians', chapter: 3, verse_range: '1–3',
      key_verse: '"Set your minds on things above, not on earthly things." — Colossians 3:2',
      devotion: 'Paul is not calling us to be out-of-touch spiritual escapists who ignore reality. He is calling us to a different frame of reference — to evaluate all of life from an eternal vantage point. When you look at your challenge from the perspective of eternity, many "urgent" things reveal themselves as trivial, and many "trivial" things reveal themselves as eternally significant.',
      reflection_q: 'Looking at your current challenges from an eternal perspective — what matters more than you think it does? What matters less?',
    },
    workout: { premade_id: 'mobility-flow', motivational_tip: 'A flexible body reflects a flexible mind. Let go of rigidity in both.', coach_note: 'Mobility work is often neglected but it\'s the difference between training for years versus being sidelined by injury.' },
    nutrition: {
      focus: 'Mindful Eating',
      meal_theme: 'Sensory Awareness',
      plan: 'Every meal today: put your phone away. Eat without screens. Notice the colors, textures, and flavors of your food. Eat slowly. Pause between bites. Experience nourishment as the intentional act it is meant to be.',
      tip: 'Mindful eating has been shown to reduce caloric intake by 20% and increase meal satisfaction significantly — without any dietary restriction.',
      recipe_search: 'colorful healthy bowl',
    },
    journal: { prompt: 'Practice gratitude of the mundane: list 20 ordinary things from your daily life that you have been taking for granted. Let this be an act of resetting your perspective to "things above."', entry_type: 'gratitude' },
    affirmation: 'I set my mind on what is above. From that high place, I see my life more clearly.',
    personal_growth_page: 'GratitudeJournalPage',
    personal_growth_label: 'Gratitude Journal',
  },

  {
    day: 19, week: 3,
    title: 'Shepherded Thoughts',
    bible: {
      book: 'Psalm', chapter: 23, verse_range: '1–3',
      key_verse: '"He restores my soul. He guides me in paths of righteousness for his name\'s sake." — Psalm 23:3',
      devotion: 'The 23rd Psalm is not a poem about passive bliss. It\'s a poem about being actively led. The shepherd doesn\'t just provide good feelings — he guides, directs, and navigates. "He restores my soul" in Hebrew means he turns back or brings back — as a shepherd retrieves a wandering sheep. When your mind wanders into anxious or dark places, you have a shepherd who comes and gets you.',
      reflection_q: 'In what direction has your mind been most "wandering" lately? What does it look like to let the Good Shepherd guide your thinking today?',
    },
    workout: { premade_id: 'recovery-day', motivational_tip: 'Even Jesus withdrew to rest. Recovery is not optional — it\'s holy.', coach_note: 'Recovery days are when adaptation occurs. Without them, you plateau. With them, you grow.' },
    nutrition: {
      focus: 'Regeneration Day',
      meal_theme: 'Collagen & Joint Support',
      plan: 'Breakfast: Bone broth and a soft-boiled egg with toast. Lunch: Chicken noodle soup with lots of vegetables. Dinner: Slow-cooked beef stew with root vegetables. Snack: Gelatin-based gummies and fruit.',
      tip: 'Collagen from bone broth, slow-cooked meats, and gelatin supports joint recovery, gut health, and skin — all of which benefit from your recovery day today.',
      recipe_search: 'bone broth soup',
    },
    journal: { prompt: 'Write an honest inventory of your mental health. Rate your anxiety, clarity, joy, and peace on a scale of 1-10. Then write one specific action for each one to move the number by 2 points.', entry_type: 'emotional_checkin' },
    affirmation: 'When my mind wanders, the Good Shepherd brings me back. I am never too far gone to be restored.',
    personal_growth_page: 'GuidedMeditationsPage',
    personal_growth_label: 'Guided Meditation',
  },

  {
    day: 20, week: 3,
    title: 'Words Create Worlds',
    bible: {
      book: 'Proverbs', chapter: 18, verse_range: '21',
      key_verse: '"The tongue has the power of life and death, and those who love it will eat its fruit." — Proverbs 18:21',
      devotion: 'What you say out loud to yourself is a command to your nervous system. Science now confirms what Scripture declared millennia ago: the words you speak over yourself — and especially the words you speak to yourself — shape neural pathways. Negative self-talk is not modesty. It is false prophecy spoken against a person God has declared worthy. Today, police your words.',
      reflection_q: 'What is the most harmful thing you regularly say to yourself? What would the opposite declaration — spoken with conviction — do to your life over 30 days?',
    },
    workout: { premade_id: 'upper-body-strength', motivational_tip: 'Speak over your workout. "I am strong. I am capable. I am improving." Say it out loud.', coach_note: 'Research shows verbal encouragement — even from yourself — can increase athletic performance by up to 18%.' },
    nutrition: {
      focus: 'Voice & Vocal Health',
      meal_theme: 'Anti-Inflammatory & Throat-Soothing',
      plan: 'Breakfast: Warm lemon, honey, and ginger tea with oatmeal. Lunch: Clear broth pho with rice noodles, basil, and lime. Dinner: Turmeric chicken soup with root vegetables. Snack: Manuka honey on toast.',
      tip: 'What you say matters. Eating foods that reduce systemic inflammation — ginger, turmeric, honey — supports the vocal cords you\'re learning to use more intentionally.',
      recipe_search: 'turmeric chicken soup',
    },
    journal: { prompt: 'Write 10 powerful, true declarations about yourself. Start each with "I am..." and draw from Scripture. Read them aloud. Notice what happens in your body.', entry_type: 'affirmation' },
    affirmation: 'I speak life over myself and others. My words are intentional, truthful, and powerful.',
    personal_growth_page: 'AffirmationsPage',
    personal_growth_label: 'Affirmations',
  },

  {
    day: 21, week: 3,
    title: 'Sabbath — Sanctuary of Silence',
    bible: {
      book: 'Psalm', chapter: 46, verse_range: '10',
      key_verse: '"Be still and know that I am God." — Psalm 46:10',
      devotion: 'The Hebrew word for "be still" is raphah — it means to release, to let go, to drop. Not passive emptiness but active release. God is saying: drop the things you\'ve been carrying that were never yours to carry. In the noise of transformation — new habits, new thinking, new disciplines — God calls you to punctuate it with silence. In the silence, He speaks.',
      reflection_q: 'What can you "drop" today — an expectation, a worry, a control — and simply rest in who God is?',
    },
    workout: { premade_id: 'bedtime-stretch', motivational_tip: 'Be still. Not everything requires effort. Some things require release.', coach_note: 'Stretching activates the parasympathetic nervous system — your body\'s natural calming response. This is healing.' },
    nutrition: {
      focus: 'Silence & Simplicity',
      meal_theme: 'Simple Nourishment',
      plan: 'Prepare simple, wholesome food that doesn\'t require a lot of effort. A warm soup, a fresh salad, fruit and cheese. Give your kitchen a sabbath too.',
      tip: 'Fasting from complexity — including food complexity — is a form of rest. Simple nourishment on rest days gives your digestive system a break too.',
      recipe_search: 'simple healthy soup',
    },
    journal: { prompt: 'Week 3 reflection: How has your relationship with your mind shifted this week? What thought patterns are weakening? What new thought patterns are taking root?', entry_type: 'weekly_reflection' },
    affirmation: 'In stillness, I know God. In release, I find strength. In silence, I hear what matters most.',
    personal_growth_page: 'WeeklyReflectionPage',
    personal_growth_label: 'Weekly Reflection',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WEEK 4 — SPIRIT: "Deeper Waters"
  // ═══════════════════════════════════════════════════════════════════════════

  {
    day: 22, week: 4,
    title: 'As the Deer Pants',
    bible: {
      book: 'Psalm', chapter: 42, verse_range: '1–2',
      key_verse: '"As the deer pants for streams of water, so my soul pants for you, my God." — Psalm 42:1',
      devotion: 'A deer in the wild only pants like this when it has been running — when it\'s been chased, exhausted, and is desperate for water. The Psalmist is not writing from a place of casual spirituality. He is writing from depletion. Sometimes we need to be run down before we run toward God with that kind of intensity. This week is about going deeper than habit, deeper than discipline, into genuine spiritual hunger.',
      reflection_q: 'When did you last feel genuine spiritual hunger? What would it take for your soul to thirst for God the way a hunted deer thirsts for water?',
    },
    workout: { premade_id: 'morning-energizer', motivational_tip: 'Start in prayer before you start the workout. Set your spirit before you set your body.', coach_note: 'Your mental state before exercise determines 40% of your physical output. Go in aligned.' },
    nutrition: {
      focus: 'Spiritual Clarity',
      meal_theme: 'Fasting-Adjacent',
      plan: 'Try intermittent fasting today: delay breakfast by 2-3 hours. Use that time for prayer. Break your fast with: avocado and poached eggs. Lunch: Large salad with protein. Dinner: Grilled fish with roasted vegetables.',
      tip: 'A brief fast sharpens spiritual sensitivity in many traditions. Even skipping one meal with intentional prayer can reorient your spirit powerfully.',
      recipe_search: 'fasting breakfast ideas',
    },
    journal: { prompt: 'What does your current prayer life actually look like — not what you think it should look like, but the reality? Be honest. What is one specific change you will make this week?', entry_type: 'scripture_reflection' },
    affirmation: 'My soul is hungry for God above all other satisfactions. I pursue His presence with intention and longing.',
    personal_growth_page: 'GuidedMeditationsPage',
    personal_growth_label: 'Guided Meditation',
  },

  {
    day: 23, week: 4,
    title: 'The Vine and the Branches',
    bible: {
      book: 'John', chapter: 15, verse_range: '1–8',
      key_verse: '"I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing." — John 15:5',
      devotion: 'Abiding is not a feeling — it is a posture. A branch doesn\'t strain to produce fruit; it stays connected and the fruit is the natural result. This 8-week transformation is not about grinding harder. It is about staying connected to the Vine who produces the change. Your role is abiding. His role is the fruit.',
      reflection_q: 'Where in your transformation journey are you most likely to "disconnect from the vine" and try to produce results through sheer effort rather than connection?',
    },
    workout: { premade_id: 'yoga-flow', motivational_tip: 'Each pose a prayer. Each breath a surrender. Abide in the movement.', coach_note: 'Yoga practiced with spiritual intention becomes moving meditation. Let it be both today.' },
    nutrition: {
      focus: 'The Fruit of the Vine',
      meal_theme: 'Vineyard Mediterranean',
      plan: 'Breakfast: Grape and walnut overnight oats with honey. Lunch: Mediterranean plate — hummus, falafel, tabbouleh, pita, olives. Dinner: Chicken tagine with figs, olives, and couscous. Snack: Grapes and cheese.',
      tip: 'Grapes, olive oil, and figs are among the most nutrient-dense Mediterranean foods — and they\'re the same foods Jesus would have eaten daily.',
      recipe_search: 'mediterranean falafel',
    },
    journal: { prompt: 'What specific practices help you "abide" most effectively — stay connected to God? List them. Which ones have you been neglecting? How will you restore them this week?', entry_type: 'scripture_reflection' },
    affirmation: 'I am a branch that stays connected. I do not strain for fruit — I abide in the Vine who produces it through me.',
    personal_growth_page: 'SpiritualGrowth',
    personal_growth_label: 'Spiritual Growth',
  },

  {
    day: 24, week: 4,
    title: 'Mountain-Moving Prayer',
    bible: {
      book: 'Matthew', chapter: 6, verse_range: '5–13',
      key_verse: '"Your kingdom come, your will be done, on earth as it is in heaven." — Matthew 6:10',
      devotion: 'The Lord\'s Prayer is not a template for passivity. It is a bold declaration of partnership — "your will on earth as it is in heaven" assumes that what God wills in the spiritual realm can and should be established in the physical realm. Prayer is the mechanism of that transference. Your prayers are not bouncing off the ceiling. They are reaching heaven and returning with authority.',
      reflection_q: 'What specific, bold prayer have you been afraid to pray — because it feels too big, too audacious, or too personal? Pray it today.',
    },
    workout: { premade_id: 'strength-circuit', motivational_tip: 'Pray before the first rep. Every set is a mountain moved one inch.', coach_note: 'Strength gains come in the recovery, not the workout. Trust the process and the rest.' },
    nutrition: {
      focus: 'Fasting & Prayer',
      meal_theme: 'Light & Spirit-Led',
      plan: 'Consider a modified fast today — one full meal plus light snacks, with the skipped meal time spent in prayer. If fasting isn\'t right for you medically, simply eat simply and pray through your meals.',
      tip: 'Many of history\'s great spiritual breakthroughs came through fasting. Food is not bad — but releasing its comfort temporarily can create space for something deeper.',
      recipe_search: 'simple vegetable meal',
    },
    journal: { prompt: 'Write the boldest prayer you dare to pray for each of these areas: your health, your relationships, your work, your spiritual life. Pray it. Date it. Return to it on Day 56.', entry_type: 'general' },
    affirmation: 'My prayers reach heaven. I pray bold, specific, expectant prayers because God is a faithful Father who delights in giving good gifts.',
    personal_growth_page: 'Prayer',
    personal_growth_label: 'Prayer Journal',
  },

  {
    day: 25, week: 4,
    title: 'The Hall of Faith',
    bible: {
      book: 'Hebrews', chapter: 11, verse_range: '1–3',
      key_verse: '"Now faith is confidence in what we hope for and assurance about what we do not see." — Hebrews 11:1',
      devotion: 'Hebrews 11 is the most extraordinary roll call in human history — ordinary people who did extraordinary things because they believed in what they could not yet see. None of them received what was promised in their lifetime. They all died in faith. They believed anyway. And 2,000 years later, we are still talking about them. Your faithful choices today will outlast your lifetime too.',
      reflection_q: 'What is one thing you sense God calling you to believe for — a hope, a promise, a vision — that you cannot yet see evidence of? Write it as a faith declaration.',
    },
    workout: { premade_id: 'hiit-30', motivational_tip: 'Faith and physical grit are cousins. Both require choosing action before feeling ready.', coach_note: 'HIIT is the most efficient cardiovascular workout proven to exist. 30 minutes here equals 90 minutes of steady cardio.' },
    nutrition: {
      focus: 'Endurance Foods',
      meal_theme: 'Long-Burn Energy',
      plan: 'Breakfast: Chia pudding with mango and coconut. Lunch: Sweet potato and black bean burrito bowl. Dinner: Slow-cooked lamb with root vegetables and flatbread. Snack: Trail mix and dried apricots.',
      tip: 'Chia seeds absorb 10x their weight in water, creating a sustained energy gel in your digestive system. They were the preferred fuel of Aztec warriors on long runs.',
      recipe_search: 'chia pudding',
    },
    journal: { prompt: 'Hebrews 11 lists the great cloud of witnesses. Write your own personal "faith hall of fame" — three people whose lives inspire your faith, and what specifically you\'ve learned from each.', entry_type: 'scripture_reflection' },
    affirmation: 'I am confident in what I hope for. I am certain of what I cannot yet see. My faith is a substance, not just a feeling.',
    personal_growth_page: 'IdentityInChristPage',
    personal_growth_label: 'Identity in Christ',
  },

  {
    day: 26, week: 4,
    title: 'Rivers of Living Water',
    bible: {
      book: 'John', chapter: 7, verse_range: '37–38',
      key_verse: '"Whoever believes in me, as Scripture has said, rivers of living water will flow from within them." — John 7:38',
      devotion: 'Jesus spoke these words on the last day of the Feast of Tabernacles — the culmination of a week-long celebration where priests poured water over the altar. In the middle of this massive ceremony, Jesus stood up and said: "I am what you\'ve been celebrating." The living water isn\'t a trickle for the spiritually elite. It is described as rivers — abundant, powerful, flowing. This is your inheritance.',
      reflection_q: 'Is the water in your life flowing outward to others, or is it pooled up inside you? What would it look like for you to be someone that others are refreshed by?',
    },
    workout: { premade_id: 'lower-body-blast', motivational_tip: 'Living water flows — it moves. Keep moving today.', coach_note: 'Your lymphatic system (your body\'s cleanup crew) is entirely powered by movement. Move to flush and cleanse.' },
    nutrition: {
      focus: 'Ultimate Hydration',
      meal_theme: 'Water-Rich Foods',
      plan: 'Breakfast: Watermelon and mint smoothie. Lunch: Cucumber gazpacho with sourdough. Dinner: Steamed fish with bok choy and clear broth. Snack: Coconut water and cucumber slices. Drink 10 glasses of water today.',
      tip: 'Drinking a full glass of water before every meal can reduce caloric intake by 75-90 calories per meal — just from being more hydrated.',
      recipe_search: 'watermelon smoothie',
    },
    journal: { prompt: 'Who in your life are you currently a source of refreshment for? Who needs the "living water" that flows through you? How can you be more intentionally life-giving to them this week?', entry_type: 'general' },
    affirmation: 'Living water flows through me. I am a source of refreshment to the people around me.',
    personal_growth_page: 'GrowthPathwaysPage',
    personal_growth_label: 'Growth Pathways',
  },

  {
    day: 27, week: 4,
    title: 'Unshakeable',
    bible: {
      book: 'Psalm', chapter: 16, verse_range: '7–11',
      key_verse: '"I keep my eyes always on the Lord. With him at my right hand, I will not be shaken." — Psalm 16:8',
      devotion: 'Four weeks in. You have done the work. You have built the foundation, strengthened the body, renewed the mind, and deepened the spirit. But the real test of transformation is not what you look like in the gym or how many days you\'ve tracked your food. It is what you do when life shakes you. When the diagnosis comes, when the relationship breaks, when the plan falls apart. With God at your right hand, the promise is not comfort. It is unshakeability.',
      reflection_q: 'When life has shaken you hardest — what has held? What spiritual anchor has never failed you? How can you strengthen that anchor now, before the next storm?',
    },
    workout: { premade_id: 'core-crusher', motivational_tip: 'Unshakeability starts in the core. Build what holds you steady.', coach_note: 'You are halfway through the program. Track your progress today — notice what has changed since Day 1.' },
    nutrition: {
      focus: 'Halfway Celebration',
      meal_theme: 'Your Best Healthy Meal',
      plan: 'Celebrate the halfway point! Cook your favorite healthy meal from these first four weeks. You\'ve been building knowledge — now use it to create something you love.',
      tip: 'You are now 4 weeks into changed eating patterns. Habits take 66 days to fully automate. You are more than halfway to automatic.',
      recipe_search: 'celebration healthy dinner',
    },
    journal: { prompt: 'Halfway inventory: Pull up your Day 1 journal entry. Read it. Write about what has changed in you. What has surprised you? What are you most proud of? What is harder than you expected?', entry_type: 'weekly_reflection' },
    affirmation: 'I will not be shaken. God is at my right hand, and that makes me unshakeable.',
    personal_growth_page: 'WeeklyReflectionPage',
    personal_growth_label: 'Halfway Reflection',
  },

  {
    day: 28, week: 4,
    title: 'Sabbath — Breathe Deeply',
    bible: {
      book: 'Genesis', chapter: 2, verse_range: '7',
      key_verse: '"Then the Lord God formed a man from the dust of the ground and breathed into his nostrils the breath of life." — Genesis 2:7',
      devotion: 'God didn\'t speak humans into being from a distance like the other creation. He bent down, got close, and breathed life in personally. The Hebrew word for breath — neshamah — is the same word used for God\'s own breath. You carry God\'s breath in you. When you breathe deeply, you are — in the most literal sense — breathing with the breath of the Almighty.',
      reflection_q: 'Four weeks of transformation. Take ten deep, slow breaths right now. What does it feel like to be alive in this body, at this moment, on this journey?',
    },
    workout: { premade_id: 'bedtime-stretch', motivational_tip: 'Breathe. Just breathe. God\'s breath is in you.', coach_note: '4-7-8 breathing (inhale 4s, hold 7s, exhale 8s) lowers cortisol by up to 30% within 2 minutes. Practice it tonight.' },
    nutrition: {
      focus: 'Sabbath Simplicity',
      meal_theme: 'Rest and Restore',
      plan: 'Eat simple, wholesome food today. Drink extra water. Sleep 8+ hours tonight. Prepare for Week 5 by reviewing the first four weeks and setting one specific intention for each of the next four.',
      tip: 'Sleep is the most powerful recovery tool available. Every hour of lost sleep costs 3-4 hours of peak cognitive and physical performance the next day.',
      recipe_search: 'restorative simple meal',
    },
    journal: { prompt: 'Write a month-1 reflection. What is the most significant internal change so far — not physical, not behavioral, but in your soul? What does the second half of this journey need to look like?', entry_type: 'weekly_reflection' },
    affirmation: 'I carry God\'s own breath. I am alive on purpose, for a purpose, by His design.',
    personal_growth_page: 'GuidedMeditationsPage',
    personal_growth_label: 'Guided Meditation',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WEEK 5 — NUTRITION: "Fuel the Mission"
  // ═══════════════════════════════════════════════════════════════════════════

  {
    day: 29, week: 5,
    title: 'Created to Nourish',
    bible: {
      book: 'Genesis', chapter: 1, verse_range: '29–31',
      key_verse: '"I give you every seed-bearing plant on the face of the whole earth... They will be yours for food." — Genesis 1:29',
      devotion: 'The first thing God gave humanity after purpose and partnership was food. Before law, before covenant, before temple — He gave food. The original menu was whole, plant-based, and abundant. He designed us to thrive on the fuel He created. When we eat as close to the original design as possible, we are, in a real sense, eating in alignment with how we were made.',
      reflection_q: 'How closely does your current diet align with what God originally designed for human nourishment? What is one step closer to the original you can take this week?',
    },
    workout: { premade_id: 'morning-energizer', motivational_tip: 'You are what you eat — and this week you become more intentional about both.', coach_note: 'Notice how clean eating from the past weeks is affecting your workout energy levels today.' },
    nutrition: {
      focus: 'Genesis Diet Deep Dive',
      meal_theme: 'Whole, Plant-Forward',
      plan: 'Breakfast: Fruit plate — mango, papaya, berries, and coconut. Lunch: Large grain bowl — farro, roasted vegetables, herbs, olive oil. Dinner: Stuffed bell peppers with quinoa, black beans, and tomato. Snack: Fresh fruit and seeds.',
      tip: 'This week we go deep on nutrition. Your food journal is your data. Log everything in the app\'s food tracker to see the real picture of your nutrition.',
      recipe_search: 'stuffed bell peppers',
    },
    journal: { prompt: 'Food and emotion are deeply connected. Write about your relationship with food. When do you eat for fuel vs. comfort vs. boredom? What emotions trigger your least healthy eating choices?', entry_type: 'emotional_checkin' },
    affirmation: 'I eat with intention and gratitude. Every meal is an opportunity to honor the body God gave me.',
    personal_growth_page: 'Nutrition',
    personal_growth_label: 'Nutrition Log',
  },

  {
    day: 30, week: 5,
    title: 'The Lord\'s Table',
    bible: {
      book: '1 Corinthians', chapter: 10, verse_range: '31',
      key_verse: '"So whether you eat or drink or whatever you do, do it all for the glory of God." — 1 Corinthians 10:31',
      devotion: 'Paul makes an audacious claim: even eating and drinking can be acts of worship. This is not about making food sacred in a legalistic way. It is about bringing intentionality to everything — making the mundane act of lunch a conscious offering. Eating slowly, thoughtfully, gratefully — with attention to what nourishes and what harms — is a spiritual discipline.',
      reflection_q: 'What would it look like practically for you to "eat and drink for the glory of God" at each of your meals today? What specific habits would change?',
    },
    workout: { premade_id: 'strength-circuit', motivational_tip: 'Eating for glory. Training for glory. Living for glory.', coach_note: 'Post-workout nutrition within 30 minutes maximizes muscle protein synthesis. Plan your post-workout meal before you train.' },
    nutrition: {
      focus: 'Meal Planning Mastery',
      meal_theme: 'Prep Day',
      plan: 'Today is meal planning and prep day. Spend 60-90 minutes batch cooking for the week: a large grain, a protein, and 3+ roasted vegetables. Store in portioned containers. This single habit is the most powerful driver of clean eating success.',
      tip: 'People who meal prep eat 300-400 fewer calories per day, spend less on food, and report higher dietary satisfaction than those who don\'t prep.',
      recipe_search: 'meal prep bowls',
    },
    journal: { prompt: 'Design your ideal eating week. What would you eat at each meal if you were perfectly fueling your body and honoring God? Use the Nutrition log to track what you actually eat this week vs. this ideal.', entry_type: 'general' },
    affirmation: 'I approach every meal with intention. Eating well is an act of worship, not a burden.',
    personal_growth_page: 'Nutrition',
    personal_growth_label: 'Food Log',
  },

  {
    day: 31, week: 5,
    title: 'Fruit of the Spirit & The Garden',
    bible: {
      book: 'Galatians', chapter: 5, verse_range: '22–23',
      key_verse: '"But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control." — Galatians 5:22–23',
      devotion: 'Self-control is the last fruit listed — perhaps because it is the product of all the others. You cannot exercise lasting self-control through willpower alone. It flows from a life rooted in love, nourished by peace, and sustained by faithfulness. Your nutrition choices are downstream of your spiritual state. This week, as you focus on food, don\'t neglect the root that makes the fruit possible.',
      reflection_q: 'Which fruit of the Spirit is most evident in your life right now? Which one is most lacking? How does the lacking fruit show up in your eating and health habits?',
    },
    workout: { premade_id: 'yoga-flow', motivational_tip: 'The fruit of the Spirit includes self-control. Let your practice today be an exercise in it.', coach_note: 'Yoga activates the prefrontal cortex — the seat of self-control in the brain. This is literally brain training for discipline.' },
    nutrition: {
      focus: 'Whole Fruit & Vegetable Deep Dive',
      meal_theme: 'Rainbow Eating',
      plan: 'Eat every color of the rainbow today. Red (tomatoes/berries), orange (carrots/sweet potato), yellow (banana/pepper), green (broccoli/spinach), blue/purple (blueberries/eggplant), white (garlic/mushrooms). Each color = different phytonutrients.',
      tip: 'Eating a diverse range of plant colors maximizes the variety of antioxidants, vitamins, and phytonutrients you consume. Aim for 30 different plants per week.',
      recipe_search: 'rainbow vegetable bowl',
    },
    journal: { prompt: 'Trace a recent moment where your nutrition choices were driven by an emotional state. What was the emotion? What did you eat? What fruit of the Spirit was the antidote you actually needed?', entry_type: 'emotional_checkin' },
    affirmation: 'The Spirit within me produces self-control. I make choices aligned with my truest values, not my momentary feelings.',
    personal_growth_page: 'EmotionalCheckInPage',
    personal_growth_label: 'Emotional Check-In',
  },

  {
    day: 32, week: 5,
    title: 'Proverbs & the Wise Eater',
    bible: {
      book: 'Proverbs', chapter: 25, verse_range: '16',
      key_verse: '"If you find honey, eat just enough — too much of it, and you will vomit." — Proverbs 25:16',
      devotion: 'Proverbs is startlingly practical. It doesn\'t talk about honey as a metaphor — it talks about honey as honey. Too much good food, even the best food, causes problems. The Hebrew wisdom tradition understood that health required not just choosing the right food, but understanding portions, timing, and restraint. The wisdom principle is not denial but calibration.',
      reflection_q: 'Where in your eating do you regularly "eat just enough"? Where do you tend to overindulge? What practical strategy could bring more wisdom to that area?',
    },
    workout: { premade_id: 'abs-focus', motivational_tip: 'Discipline your appetite — for food and for ease. Both require the same muscle.', coach_note: 'Core work is metabolically active and engages 29 muscles simultaneously. It\'s efficient and functional.' },
    nutrition: {
      focus: 'Portion Wisdom',
      meal_theme: 'Mindful Portions',
      plan: 'Today, eat everything you normally would — but use the "plate method": half vegetables, quarter protein, quarter complex carb. No seconds. Eat slowly. See how you feel at the end of each meal on a scale of 1-10 (1=still hungry, 10=uncomfortably full). Aim for 7.',
      tip: 'The Japanese principle of Hara Hachi Bu — eat until 80% full — is practiced by the world\'s longest-lived populations. Stop at satisfied, not stuffed.',
      recipe_search: 'portion control meal',
    },
    journal: { prompt: 'Where in life (not just food) do you struggle with "just enough"? Work, social media, entertainment, validation? Write about the pattern and what wisdom looks like in that area for you.', entry_type: 'general' },
    affirmation: 'I eat with wisdom. I take enough to be nourished and I stop there, trusting that enough is truly enough.',
    personal_growth_page: 'HabitBuilderPage',
    personal_growth_label: 'Habit Builder',
  },

  {
    day: 33, week: 5,
    title: 'Manna in the Desert',
    bible: {
      book: 'Exodus', chapter: 16, verse_range: '4–5',
      key_verse: '"Then the Lord said to Moses, \'I will rain down bread from heaven for you.\'" — Exodus 16:4',
      devotion: 'Manna was unusual food — it couldn\'t be stored (it rotted), it fell daily (they couldn\'t hoard it), and it was calibrated to the exact need of each person. It was designed to teach a specific lesson: daily dependence. We were designed for daily provision, not for stockpiling. Our relationship with food can either teach us trust or foster anxiety. Today, trust that today\'s provision is enough for today.',
      reflection_q: 'In what ways has food become a source of comfort, control, or anxiety for you rather than a practice of daily trust? What would "manna faith" look like in your nutrition choices?',
    },
    workout: { premade_id: 'fat-burn-20', motivational_tip: 'Daily bread, daily movement. Both are gifts. Receive them with gratitude.', coach_note: 'Consistency beats intensity. 20 minutes daily outperforms 2 hours once a week for every measurable health metric.' },
    nutrition: {
      focus: 'Daily Gratitude for Food',
      meal_theme: 'Simple and Sufficient',
      plan: 'Breakfast: Simple oats or grain. Lunch: Simple protein and salad. Dinner: Simple protein and vegetables. Before each meal, pause and genuinely give thanks for the specific food in front of you — name what it is, where it came from, what it will do for your body.',
      tip: 'Studies show that food gratitude practices — pausing to appreciate food before eating — reduce overeating, increase meal satisfaction, and create a healthier relationship with food.',
      recipe_search: 'simple wholesome meals',
    },
    journal: { prompt: 'Write a gratitude letter to your body. Thank it for what it does for you every day — the things it does without being asked: heartbeats, digestion, healing, sensing. Appreciate what you have before asking for more.', entry_type: 'gratitude' },
    affirmation: 'Today\'s provision is enough for today. I receive with gratitude rather than grasp with anxiety.',
    personal_growth_page: 'GratitudeJournalPage',
    personal_growth_label: 'Gratitude Journal',
  },

  {
    day: 34, week: 5,
    title: 'The New Creation Eats Well',
    bible: {
      book: 'Romans', chapter: 14, verse_range: '17',
      key_verse: '"For the kingdom of God is not a matter of eating and drinking, but of righteousness, peace and joy in the Holy Spirit." — Romans 14:17',
      devotion: 'Paul is not dismissing food as unimportant — he has already told us our bodies are temples and that we eat for God\'s glory. Here he is calibrating our obsession. Food is a tool, not a savior. When nutrition becomes identity — when it becomes the primary lens through which you define yourself and others — it has taken a throne that belongs to Someone else. Eat well. But hold it lightly.',
      reflection_q: 'Has your focus on nutrition this week become life-giving discipline or anxious obsession? What is the difference between the two in your specific experience?',
    },
    workout: { premade_id: 'power-yoga', motivational_tip: 'Righteousness, peace, and joy — feel all three in your practice today.', coach_note: 'Strong mental state = better workout. Let the truth you\'ve been studying fuel today\'s practice.' },
    nutrition: {
      focus: 'Freedom & Structure',
      meal_theme: 'Enjoyment Within Principles',
      plan: 'Prepare and enjoy a meal today that is both genuinely delicious and nourishing. This is the goal — not deprivation, not indulgence, but abundant nourishment. Explore the app\'s recipe section for inspiration.',
      tip: 'Sustainable healthy eating is enjoyable healthy eating. If you hate what you\'re eating, you won\'t sustain it. Find nourishing food you genuinely love.',
      recipe_search: 'delicious healthy dinner',
    },
    journal: { prompt: 'Assess your Week 5 progress: How has your relationship with food shifted over the past five weeks? Write three specific changes you\'ve made and the impact each has had.', entry_type: 'general' },
    affirmation: 'I eat well freely. My identity is not in my diet — it is in the One who made me. Food serves me; it does not define me.',
    personal_growth_page: 'DiscoverRecipes',
    personal_growth_label: 'Discover Recipes',
  },

  {
    day: 35, week: 5,
    title: 'Sabbath — The Table of Abundance',
    bible: {
      book: 'Psalm', chapter: 23, verse_range: '5',
      key_verse: '"You prepare a table before me in the presence of my enemies." — Psalm 23:5',
      devotion: 'God doesn\'t serve you scraps in a quiet corner. He sets a full table — in the middle of where your enemies sit. The provision is abundant, public, and designed to be witnessed. This is not stingy grace. This is lavish, generous, table-for-everyone grace. Today, rest in the abundance that has already been prepared for you.',
      reflection_q: 'Where do you most need to experience God\'s lavish provision right now — not scarcity, not survival, but genuine abundance at a table He prepared?',
    },
    workout: { premade_id: 'bedtime-stretch', motivational_tip: 'Rest in abundance. You don\'t have to earn the table that\'s already set for you.', coach_note: 'Five weeks complete. Take your measurements and progress photos today. The data will encourage you for Weeks 6-8.' },
    nutrition: {
      focus: 'Abundance Mindset',
      meal_theme: 'A Feast',
      plan: 'Prepare a beautiful, abundant, nourishing meal and share it with someone — a friend, family member, or neighbor. The table of abundance is meant to be shared.',
      tip: 'Eating with others — shared meals — is one of the strongest predictors of longevity, mental health, and relationship quality across all cultures and research traditions.',
      recipe_search: 'feast sharing dinner',
    },
    journal: { prompt: 'Week 5 reflection: What is your biggest nutritional win? What food habit do you want to carry for life? What did this week teach you about the connection between food and faith?', entry_type: 'weekly_reflection' },
    affirmation: 'I am seated at a table of abundance. I eat from fullness, not scarcity. I share what has been given to me generously.',
    personal_growth_page: 'WeeklyReflectionPage',
    personal_growth_label: 'Weekly Reflection',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WEEK 6 — HABITS: "Daily Discipline"
  // ═══════════════════════════════════════════════════════════════════════════

  {
    day: 36, week: 6,
    title: 'Character is Habit',
    bible: {
      book: 'Luke', chapter: 16, verse_range: '10',
      key_verse: '"Whoever can be trusted with very little can also be trusted with much." — Luke 16:10',
      devotion: 'God\'s economy of promotion is counterintuitive: you get more by being faithful with less. The small disciplines you are building — the 6am workout, the clean meal, the prayer before breakfast, the journal entry — these are not small things. They are proof of character. And character is what God uses to determine what He trusts you with next.',
      reflection_q: 'What "small thing" have you been faithful with over these last 5 weeks? And what "much" might God be preparing you for because of that faithfulness?',
    },
    workout: { premade_id: 'tabata-intense', motivational_tip: 'Twenty seconds of work. You can do anything for twenty seconds.', coach_note: 'Tabata training increases both aerobic and anaerobic capacity simultaneously — the only protocol shown to do both.' },
    nutrition: {
      focus: 'Habit Stacking',
      meal_theme: 'Consistent Routine',
      plan: 'This week: eat the same clean breakfast every day. Choose one you love from the past 5 weeks. Consistency in the morning frees decision energy for more important choices later in the day.',
      tip: 'Decision fatigue is real. Having a default breakfast eliminates one daily decision and preserves your willpower for harder choices.',
      recipe_search: 'easy daily breakfast',
    },
    journal: { prompt: 'Design your "Ideal Day" in detail — every hour from 5am to 10pm. What habits are you building into that day? What are you eliminating? What does a day fully aligned with your values look like?', entry_type: 'habit_tracker' },
    affirmation: 'I am trusted with little because I am faithful in little. This is the path to much.',
    personal_growth_page: 'HabitBuilderPage',
    personal_growth_label: 'Habit Builder',
  },

  {
    day: 37, week: 6,
    title: 'The Ant\'s Wisdom',
    bible: {
      book: 'Proverbs', chapter: 6, verse_range: '6–8',
      key_verse: '"Go to the ant, you sluggard; consider its ways and be wise! It has no commander, no overseer or ruler, yet it stores its provisions in summer and gathers its food at harvest." — Proverbs 6:6–8',
      devotion: 'The ant has no coach, no accountability partner, no boss telling it to prepare. It builds from internal motivation and seasonal wisdom. This is the goal of discipline — not external accountability but internal drive. After six weeks, you should be feeling the beginnings of this: the workouts feel wrong to skip rather than hard to start. That internal pull is the habit becoming who you are.',
      reflection_q: 'On a scale of 1-10, how much are your healthy habits driven by external accountability vs. internal motivation? What would it take to move that number toward internal by 2 points?',
    },
    workout: { premade_id: 'bodyweight-master', motivational_tip: 'No gym required. No equipment required. Just you and the body God gave you.', coach_note: 'Bodyweight mastery is the foundation of all athleticism. Elite athletes train bodyweight before loaded movements.' },
    nutrition: {
      focus: 'Seasonal Eating',
      meal_theme: 'In Season, In Alignment',
      plan: 'Research what is currently in season in your region and plan today\'s meals around those ingredients. Seasonal eating is cheaper, more nutritious (shorter farm-to-table = more nutrients), and more environmentally aligned.',
      tip: 'Produce loses 15-50% of its vitamins within 1-2 weeks of harvest. Eating seasonal, local produce is significantly more nutritious than shipped-from-far produce.',
      recipe_search: 'seasonal vegetables',
    },
    journal: { prompt: 'What habits have become "automatic" over these 6 weeks — things you now do without thinking? Write about the journey from "hard discipline" to "automatic habit" for each one.', entry_type: 'habit_tracker' },
    affirmation: 'I prepare in the season of plenty so I have strength in the season of challenge. I build when building is possible.',
    personal_growth_page: 'HabitBuilderPage',
    personal_growth_label: 'Habit Builder',
  },

  {
    day: 38, week: 6,
    title: 'The Compound Effect',
    bible: {
      book: 'Matthew', chapter: 25, verse_range: '14–21',
      key_verse: '"Well done, good and faithful servant! You have been faithful with a few things; I will put you in charge of many things." — Matthew 25:21',
      devotion: 'The Parable of the Talents is Jesus\' most direct teaching on the compound effect of faithfulness. The servant who invested and grew what he was given received more. The servant who buried what he was given lost even what he had. Every workout you complete, every clean meal you eat, every journal entry you write is a deposit into an account that compounds. The math favors those who are faithful early.',
      reflection_q: 'In what area of your life are you most afraid to invest your talents because you fear losing them? What would the "faithful servant" do?',
    },
    workout: { premade_id: 'strength-circuit', motivational_tip: 'Every rep is a deposit. The compound interest will astound you.', coach_note: 'Week 6: you\'ve been building for six weeks. You are now 30-40% stronger than Day 1. The compound effect is working.' },
    nutrition: {
      focus: 'Macronutrient Balance',
      meal_theme: 'Precision Nutrition Day',
      plan: 'Track your macros today: aim for 40% carbohydrate, 30% protein, 30% fat. Use the app\'s nutrition log. This isn\'t obsession — it\'s a one-day education on what "balanced" actually looks like for you.',
      tip: 'Most people dramatically under-eat protein (need ~0.8g per kg bodyweight) and over-eat refined carbohydrates. A single day of tracking reveals the real picture.',
      recipe_search: 'balanced macros meal',
    },
    journal: { prompt: 'Calculate your "compound interest." Looking at Day 1 vs. today: what has been the cumulative effect of your small daily faithfulness across physical health, mental clarity, spiritual depth, and emotional wellbeing?', entry_type: 'general' },
    affirmation: 'I invest my talents — my time, energy, and faithfulness — with confidence that God multiplies what I give.',
    personal_growth_page: 'ProgressDashboard',
    personal_growth_label: 'Your Journey',
  },

  {
    day: 39, week: 6,
    title: 'Numbered Days',
    bible: {
      book: 'Psalm', chapter: 90, verse_range: '12',
      key_verse: '"Teach us to number our days, that we may gain a heart of wisdom." — Psalm 90:12',
      devotion: 'Moses wrote this psalm — and Moses understood mortality more than most. He had watched his generation die in the wilderness. "Number your days" is not a morbid command. It is a clarifying one. When you know your days are limited, you stop spending them carelessly. You make choices that matter. The alarm clock that goes off at 5:30am for a workout is easier to obey when you understand that each morning is not guaranteed.',
      reflection_q: 'If you knew you had exactly one year left, what habit would you wish you had built? Why are you waiting?',
    },
    workout: { premade_id: 'hiit-30', motivational_tip: 'Make this day count. It is not owed to you. It is given to you.', coach_note: 'HIIT training improves cardiovascular health more efficiently than any other protocol. Every session literally adds time to your life.' },
    nutrition: {
      focus: 'Longevity Foods',
      meal_theme: 'Blue Zones Inspired',
      plan: 'The five "Blue Zones" — where people live longest — share dietary patterns: beans at least 4x per week, greens daily, small amounts of meat, nuts daily, whole grains. Breakfast: Fava bean and egg scramble. Lunch: Minestrone soup. Dinner: Grilled sardines with Greek salad and sourdough.',
      tip: 'Centenarians in Sardinia eat mostly plants, legumes, whole grains, and small amounts of meat — with red wine at meals and strong community. The food and the community are both medicine.',
      recipe_search: 'blue zones longevity',
    },
    journal: { prompt: 'Write your eulogy from the perspective of someone who loves you. What do they say about how you used your days? What habits and character qualities do they mention? Does today align with that eulogy?', entry_type: 'general' },
    affirmation: 'I number my days with wisdom. Every morning is a gift I receive with intentionality.',
    personal_growth_page: 'GrowthPathwaysPage',
    personal_growth_label: 'Growth Pathways',
  },

  {
    day: 40, week: 6,
    title: 'Forty Days',
    bible: {
      book: 'Matthew', chapter: 4, verse_range: '1–11',
      key_verse: '"Jesus was led by the Spirit into the wilderness to be tempted by the devil." — Matthew 4:1',
      devotion: 'Forty is the number of testing in Scripture — Moses, Elijah, and Jesus all spent 40 days in transformation through hardship. You are on Day 40. This is not coincidence. The wilderness is not a punishment — it is a curriculum. Everything Jesus resisted during those forty days, He resisted with Scripture. When hunger, comfort, and ambition were weaponized against Him, the Word was His weapon. Arm yourself the same way.',
      reflection_q: 'What has been your "wilderness" in this transformation — the place of greatest temptation or hardship? What Scripture has been your weapon in that wilderness?',
    },
    workout: { premade_id: 'athlete-conditioning', motivational_tip: 'Day 40. The wilderness is refining you. Push through to the other side.', coach_note: 'This is the hardest workout of the program. It\'s designed that way intentionally. What you overcome today changes what you believe about yourself.' },
    nutrition: {
      focus: 'Wilderness Simplicity',
      meal_theme: 'Fasted Clarity',
      plan: 'In honor of Day 40, practice a modified fast: skip one meal, use that time for prayer and Scripture. For the meals you eat: keep them simple, whole, and unprocessed. Let simplicity be your feast today.',
      tip: 'Fasting one meal per day — skipping breakfast or dinner — is practiced by millions and is associated with improved insulin sensitivity, cognitive clarity, and longevity biomarkers.',
      recipe_search: 'light fasting meal',
    },
    journal: { prompt: 'What specific temptation has most threatened your transformation over these 40 days? What Scripture truth has helped you most? Write the verse out by hand and place it somewhere you will see it daily.',
      entry_type: 'scripture_reflection' },
    affirmation: 'I stand in the wilderness armed with truth. Every temptation is met with the Word of God, and the Word always wins.',
    personal_growth_page: 'IdentityInChristPage',
    personal_growth_label: 'Identity in Christ',
  },

  {
    day: 41, week: 6,
    title: 'Running to Win',
    bible: {
      book: 'Hebrews', chapter: 12, verse_range: '1',
      key_verse: '"Let us throw off everything that hinders and the sin that so easily entangles." — Hebrews 12:1',
      devotion: 'The image here is of a runner stripping off unnecessary weight before a race. The Greek word for "hinders" doesn\'t mean something sinful — it means something heavy. Good things that are deadweight. Habits that are not sins but are still slowing you down. Six weeks in, you know what yours are. What are you still carrying that needs to be dropped so you can run faster?',
      reflection_q: 'Name one habit you have been tolerating that is "not sin but still weight." What would throwing it off look like practically this week?',
    },
    workout: { premade_id: 'bodyweight-master', motivational_tip: 'Strip off the weight. Run lighter. You were built for speed you haven\'t reached yet.', coach_note: 'Two weeks to go. Increase intensity and decrease rest time from Week 5 protocols. Push the adaptation.' },
    nutrition: {
      focus: 'Eliminating Dead Weight',
      meal_theme: 'Audit and Eliminate',
      plan: 'Audit your kitchen today. Remove processed foods, refined sugars, and anything that regularly derails you. Replace with healthy alternatives. This is a physical act with spiritual symbolism — clearing the pantry to run lighter.',
      tip: 'The strongest predictor of eating well is the food environment you create at home. What is visible and accessible is what you eat. Design your environment for success.',
      recipe_search: 'pantry cleanse healthy',
    },
    journal: { prompt: 'Make two lists: "Weight I\'m carrying" (habits, mindsets, relationships, commitments that slow me down) and "Things worth keeping" (what is genuinely essential). Be ruthless in your honesty.', entry_type: 'mindset_reset' },
    affirmation: 'I run lighter today. I am throwing off what hinders and running with unhindered purpose.',
    personal_growth_page: 'MindsetResetPage',
    personal_growth_label: 'Mindset Reset',
  },

  {
    day: 42, week: 6,
    title: 'Sabbath — The Rest of the Faithful',
    bible: {
      book: 'Hebrews', chapter: 4, verse_range: '9–11',
      key_verse: '"There remains, then, a Sabbath-rest for the people of God." — Hebrews 4:9',
      devotion: 'The writer of Hebrews connects our weekly rest to an eternal rest — the rest that remains for God\'s people. Sabbath is not just a break. It is a rehearsal for eternity. When you rest, you are practicing trust. You are declaring that the world does not depend on your effort to keep spinning. Six weeks of faithfulness deserves one day of celebration. Celebrate today.',
      reflection_q: 'How have your Sabbaths changed over these six weeks? Are they becoming genuine rest and celebration, or still feel like obligated pauses? What would make them more life-giving?',
    },
    workout: { premade_id: 'bedtime-stretch', motivational_tip: 'Six weeks done. What you\'ve built is real. Rest in that.', coach_note: 'Measure everything today — weight, waist, push-up count, run time. Six weeks of data is meaningful data.' },
    nutrition: {
      focus: 'Celebration Table',
      meal_theme: 'Six-Week Feast',
      plan: 'Celebrate! Make a meal that represents your best nutritional self — all the principles of the last six weeks in one beautiful plate. Invite someone to share it with you.',
      tip: 'Celebration is part of the protocol. Recognizing progress creates dopamine and serotonin that reinforce the behaviors that created the progress.',
      recipe_search: 'celebration dinner healthy',
    },
    journal: { prompt: 'Week 6 reflection: What habits have become part of who you are now? What are you most proud of from this week? What will you bring into the final two weeks?', entry_type: 'weekly_reflection' },
    affirmation: 'I enter rest with gratitude. Six weeks of faithfulness is cause for celebration. Tomorrow, I rise again.',
    personal_growth_page: 'WeeklyReflectionPage',
    personal_growth_label: 'Weekly Reflection',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WEEK 7 — COMMUNITY: "Iron Sharpens Iron"
  // ═══════════════════════════════════════════════════════════════════════════

  {
    day: 43, week: 7,
    title: 'You Were Not Made to Go It Alone',
    bible: {
      book: 'Proverbs', chapter: 27, verse_range: '17',
      key_verse: '"As iron sharpens iron, so one person sharpens another." — Proverbs 27:17',
      devotion: 'Iron doesn\'t sharpen iron by proximity. It sharpens iron by friction — by pushing against, by resistance, by contact that creates heat. The friendships and communities that most sharpen us are often the ones that are most challenging, not the most comfortable. This week, focus on the relationships that have been pressing against you — and consider that the friction might be intentional.',
      reflection_q: 'Who is currently sharpening you in your life — through challenge, honest feedback, or accountability? Who are you sharpening?',
    },
    workout: { premade_id: 'strength-circuit', motivational_tip: 'Find someone to train with this week. You push harder when someone is watching.', coach_note: 'Research shows people exercise 20% harder and longer when working out with a partner or group. Community is performance-enhancing.' },
    nutrition: {
      focus: 'Shared Meals',
      meal_theme: 'Invitation to the Table',
      plan: 'Invite someone for a meal this week. Prepare something nourishing and share the table. Use the conversation to connect about what matters — not the surface.',
      tip: 'Sharing a meal is the most cross-cultural, cross-historical form of human bonding. The table is where trust is built.',
      recipe_search: 'dinner party healthy',
    },
    journal: { prompt: 'Write about your community. Who are the 5 people you spend the most time with? Are they sharpening you or dulling you? What does this tell you about the direction you\'re heading?', entry_type: 'general' },
    affirmation: 'I was made for community. I bring my sharpened self and I welcome the sharpening of others.',
    personal_growth_page: 'Community',
    personal_growth_label: 'Community',
  },

  {
    day: 44, week: 7,
    title: 'The Power of Two',
    bible: {
      book: 'Ecclesiastes', chapter: 4, verse_range: '9–12',
      key_verse: '"Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up." — Ecclesiastes 4:9–10',
      devotion: 'Qohelet is one of the most honest books in the Bible — and this is one of his most honest observations. Alone, you fall without anyone to help you up. Together, you are held, warmed, and strengthened against attack. These are not primarily romantic promises. They are community promises. Find someone to do life with. Don\'t be the lone wolf who refuses to be helped up.',
      reflection_q: 'When you fall — in health, faith, relationships, work — who picks you up? Do you have that person clearly in your life? If not, what steps can you take to find that accountability partnership?',
    },
    workout: { premade_id: 'athlete-conditioning', motivational_tip: 'Find your training partner. Two are better than one.', coach_note: 'Elite athletes always have training partners and coaches. This is not weakness — it is wisdom.' },
    nutrition: {
      focus: 'Accountability Eating',
      meal_theme: 'Food Log Partnership',
      plan: 'Share your food log with an accountability partner this week. Have them do the same. Mutual visibility creates mutual motivation.',
      tip: 'Public accountability increases follow-through by 65% compared to private commitment. Find your nutrition accountability partner today.',
      recipe_search: 'meal prep partner',
    },
    journal: { prompt: 'Write an accountability covenant — specific, concrete commitments you\'re making for the final two weeks of this program, signed and shared with someone who will hold you to them.', entry_type: 'habit_tracker' },
    affirmation: 'I don\'t have to be strong alone. Two are better than one, and I am wise enough to know that.',
    personal_growth_page: 'Community',
    personal_growth_label: 'Community',
  },

  {
    day: 45, week: 7,
    title: 'Love Your Neighbor\'s Wellness',
    bible: {
      book: '1 Thessalonians', chapter: 5, verse_range: '11',
      key_verse: '"Therefore encourage one another and build each other up, just as in fact you are doing." — 1 Thessalonians 5:11',
      devotion: 'Paul is writing to a church that was already encouraging each other — and he says "keep doing it." Consistent, sustained encouragement is not natural. It requires intention, observation, and generosity of spirit. This week, as you continue your own transformation, turn your attention outward. Who in your community could be transformed by your genuine encouragement?',
      reflection_q: 'Who in your life needs encouragement in their health journey, spiritual growth, or daily faithfulness? What specific, genuine thing could you say or do for them today?',
    },
    workout: { premade_id: 'cardio-blast', motivational_tip: 'Today, after your workout, encourage one person in their fitness journey. Pay it forward.', coach_note: 'You are now a resource for others. Your 45 days of experience can guide someone who is on Day 1.' },
    nutrition: {
      focus: 'Teaching What You\'ve Learned',
      meal_theme: 'Cook for Someone',
      plan: 'Prepare a healthy meal for someone who needs it — a sick neighbor, a busy family member, a new parent. Use the principles you\'ve learned to nourish someone else.',
      tip: 'Teaching what you know is the fastest way to learn it more deeply. When you explain nutrition principles to someone else, your own understanding deepens.',
      recipe_search: 'easy meal for neighbor',
    },
    journal: { prompt: 'Write an encouragement letter to someone in your life who is in the middle of a hard transformation. Don\'t tell them what to do. Just see them, name what you\'ve observed, and tell them they can make it.', entry_type: 'general' },
    affirmation: 'I build up, I don\'t tear down. My words create environments where people grow.',
    personal_growth_page: 'Community',
    personal_growth_label: 'Community Feed',
  },

  {
    day: 46, week: 7,
    title: 'Confess to One Another',
    bible: {
      book: 'James', chapter: 5, verse_range: '16',
      key_verse: '"Therefore confess your sins to each other and pray for each other so that you may be healed." — James 5:16',
      devotion: 'James connects healing directly to confession and mutual prayer. The healing he describes is not just spiritual — the context is physical illness. There is something in the act of genuine vulnerability with a trusted person that facilitates restoration at every level. You have been building habits and disciplines for seven weeks. Today, share honestly — with God, and with one safe person — where you have fallen short. Watch what happens.',
      reflection_q: 'Where in this 7-week journey have you been least honest — with yourself, with God, or with others? What is the small, specific truth you have been avoiding?',
    },
    workout: { premade_id: 'yoga-flow', motivational_tip: 'Let your practice today be an act of honest surrender — no performance, just presence.', coach_note: 'Yoga is uniquely honest. It shows you exactly where you are in your body today, not where you wish you were.' },
    nutrition: {
      focus: 'Honest Audit',
      meal_theme: 'Reset from Any Drift',
      plan: 'Review the last week honestly: have you drifted from the nutritional principles you built? If yes, today is a clean-slate reset — no shame, no performance, just returning to what works. If you haven\'t drifted, celebrate that.',
      tip: 'The ability to return without shame after a lapse is the single most important factor in long-term health behavior change. Shame creates avoidance. Grace creates return.',
      recipe_search: 'clean reset meal',
    },
    journal: { prompt: 'Practice radical honesty: what is one area where your behavior and your values are out of alignment right now? Write about the gap without judgment, and then write one specific step to close it.', entry_type: 'emotional_checkin' },
    affirmation: 'I live in the light, not the shadows. I confess, I return, and I am healed. There is no shame in my journey.',
    personal_growth_page: 'EmotionalCheckInPage',
    personal_growth_label: 'Emotional Check-In',
  },

  {
    day: 47, week: 7,
    title: 'The Body of Christ',
    bible: {
      book: 'Romans', chapter: 12, verse_range: '4–6',
      key_verse: '"Just as each of us has one body with many members, and these members do not all have the same function, so in Christ we, though many, form one body." — Romans 12:4–5',
      devotion: 'Paul is using the human body as a metaphor for church community — but the metaphor works in both directions. Just as the church needs all its members functioning, your physical body needs all its systems working in concert. You have been building strength, flexibility, cardio capacity, and nutrition over seven weeks. Today\'s session integrates it all. This is what a fully-functioning body looks like.',
      reflection_q: 'Which "member" of your own transformation has been least integrated — physical, nutritional, spiritual, or mental? What would more integration look like?',
    },
    workout: { premade_id: 'resistance-band', motivational_tip: 'Every muscle group works together. No part is more important than another.', coach_note: 'Resistance bands create constant tension throughout the movement range — increasing muscular activation by 30% vs. free weights alone.' },
    nutrition: {
      focus: 'Integrative Nutrition',
      meal_theme: 'All Systems Go',
      plan: 'Plan a full day of eating that hits every nutritional category: fiber (vegetables), omega-3 (fatty fish), protein (lean meat/legumes), complex carb (whole grains), probiotics (fermented food), antioxidants (berries), hydration (water). One full day that covers all bases.',
      tip: 'Nutritional diversity is the most important single predictor of gut microbiome health. The goal is variety across all food groups, not perfection in any one.',
      recipe_search: 'complete nutrition meal',
    },
    journal: { prompt: 'Write about how the different dimensions of your transformation — physical, nutritional, mental, spiritual — are beginning to integrate and reinforce each other. What does "whole-life health" feel like from the inside?', entry_type: 'general' },
    affirmation: 'I am one integrated whole — body, soul, and spirit, each part serving the others for the good of the whole.',
    personal_growth_page: 'PersonalGrowth',
    personal_growth_label: 'Personal Growth',
  },

  {
    day: 48, week: 7,
    title: 'The Church at Work',
    bible: {
      book: 'Acts', chapter: 2, verse_range: '42–47',
      key_verse: '"They devoted themselves to the apostles\' teaching and to fellowship, to the breaking of bread and to prayer." — Acts 2:42',
      devotion: 'The early church had four pillars: teaching, fellowship, breaking bread, and prayer. Note that two of the four pillars involve physical gathering — fellowship and shared meals. The community that changed the world ate together. They didn\'t only have spiritual gatherings — they had tables. Your transformation community needs both: the hard conversation and the shared meal.',
      reflection_q: 'Who is your transformation community? Who are you doing this with — even informally? How can you build more genuine fellowship into your health journey?',
    },
    workout: { premade_id: 'morning-energizer', motivational_tip: 'Do your workout, then reach out to your community. Share your progress.', coach_note: 'Social support predicts adherence to exercise programs more accurately than motivation does. Build your community.' },
    nutrition: {
      focus: 'Breaking Bread Together',
      meal_theme: 'Community Meal',
      plan: 'Share a meal with your community — family, friends, small group, whoever your people are. The meal doesn\'t have to be perfect. The fellowship does.',
      tip: 'Family dinner frequency is inversely correlated with adolescent substance abuse, eating disorders, and depression. The table is protective. Keep it.',
      recipe_search: 'family dinner healthy',
    },
    journal: { prompt: 'Who has been your "Acts 2 community" during this 8-week journey? Who has taught you, fellowshiped with you, broken bread with you, prayed for you? Write a gratitude entry naming them and what they\'ve meant to your transformation.', entry_type: 'gratitude' },
    affirmation: 'I am not a solitary transformation. I am part of a community that is being transformed together.',
    personal_growth_page: 'Community',
    personal_growth_label: 'Community',
  },

  {
    day: 49, week: 7,
    title: 'Sabbath — Pour Out and Be Refilled',
    bible: {
      book: 'John', chapter: 17, verse_range: '20–23',
      key_verse: '"I pray also for those who will believe in me through their message, that all of them may be one." — John 17:20–21',
      devotion: 'Jesus\' last prayer before the cross was not for Himself, not for His eleven disciples — it was for the people who would come after, who would believe through their message. He prayed for you. Seven weeks into your transformation, you have become someone whose story could lead others to begin their own. Your journey is not just about you. It was never just about you.',
      reflection_q: 'Who is watching your transformation and being inspired to begin their own? Who could you reach out to this Sabbath and offer to walk the next 8 weeks alongside?',
    },
    workout: { premade_id: 'bedtime-stretch', motivational_tip: 'Rest. Pour out. Be refilled. Repeat forever.', coach_note: 'Seven weeks complete. One to go. The final week is the most important. Finish what you started.' },
    nutrition: {
      focus: 'Generosity at the Table',
      meal_theme: 'Pour Out to Others',
      plan: 'Today, give away some nourishment — deliver food to someone in need, bake something wholesome for a neighbor, bring a healthy dish to share with your community. What flows through you should flow out from you.',
      tip: 'Acts of generosity and giving have been shown to produce more enduring happiness than acts of self-reward. Give today.',
      recipe_search: 'baking for neighbors',
    },
    journal: { prompt: 'Week 7 reflection: How has this week\'s focus on community changed your approach to transformation? What relationships have grown? What community have you invested in? What have you received in return?', entry_type: 'weekly_reflection' },
    affirmation: 'My transformation radiates outward. I am changed so that others can be changed through me.',
    personal_growth_page: 'WeeklyReflectionPage',
    personal_growth_label: 'Weekly Reflection',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WEEK 8 — LEGACY: "Living Your Purpose"
  // ═══════════════════════════════════════════════════════════════════════════

  {
    day: 50, week: 8,
    title: 'Plans to Prosper — Revisited',
    bible: {
      book: 'Jeremiah', chapter: 29, verse_range: '11–13',
      key_verse: '"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you." — Jeremiah 29:11',
      devotion: 'You read this verse on Day 3 from a place of beginning. You read it now from a place of 50 days of faithfulness. The promise hasn\'t changed — but you have. The plans of God don\'t get smaller as you grow into them. They expand. What seemed like the ceiling on Day 3 is now just the floor. In eight days you will stand at Day 56 a different person. Prepare to receive a bigger version of this promise.',
      reflection_q: 'Compare how this verse lands today versus Day 3. What has changed in you? What do the "plans to prosper you" feel like now that you\'ve spent 50 days actively cooperating with them?',
    },
    workout: { premade_id: 'athlete-conditioning', motivational_tip: 'Final week. No holding back. Leave nothing in the tank.', coach_note: 'The final week is deload week for the body but not for the mind. Keep intensity high but reduce volume by 20%.' },
    nutrition: {
      focus: 'Performance Pinnacle',
      meal_theme: 'Peak Performance Day',
      plan: 'Eat your best food day of the entire program. Everything you\'ve learned in 7 weeks goes into today\'s nutrition. Breakfast: Power smoothie bowl. Lunch: Optimal protein and complex carb. Dinner: Your best healthy recipe. Snack: Strategic and clean.',
      tip: 'Your body is now 50 days into consistent clean eating. Your gut biome is transformed, your metabolism is optimized, and your inflammation markers are lower than Day 1.',
      recipe_search: 'peak performance meal',
    },
    journal: { prompt: 'Reread your Day 1 journal entry about your "three areas to transform." Write an honest assessment of where you are in each one. Celebrate progress. Identify what still needs to be built.', entry_type: 'general' },
    affirmation: 'I step into the final week knowing that God\'s plans for me are better than anything I could plan for myself. I show up for what He has prepared.',
    personal_growth_page: 'ProgressDashboard',
    personal_growth_label: 'Your Journey',
  },

  {
    day: 51, week: 8,
    title: 'Made for More',
    bible: {
      book: 'Ephesians', chapter: 3, verse_range: '20–21',
      key_verse: '"Now to him who is able to do immeasurably more than all we ask or imagine, according to his power that is at work within us." — Ephesians 3:20',
      devotion: '"Immeasurably more" is Paul\'s translation of a Greek term that essentially means "wildly beyond calculation." He is not talking about small upgrades. He is talking about the kind of transformation that makes people say "That can\'t be the same person." That is the kind of transformation available to you — not through your own power, but according to His power that is already at work within you.',
      reflection_q: 'If God can do "immeasurably more than you can ask or imagine" — what does your imagination dare to believe for in the next chapter of your life?',
    },
    workout: { premade_id: 'tabata-intense', motivational_tip: '"More than we can ask or imagine." Push past your previous ceiling today.', coach_note: 'Tabata in Week 8 should feel different than Tabata in Week 6. You have built capacity. Use it.' },
    nutrition: {
      focus: 'Future Self Fuel',
      meal_theme: 'Who You\'re Becoming',
      plan: 'Eat as the person you are becoming — not the person you were on Day 1. What does the Week-52 version of you eat on a Tuesday? Eat that today.',
      tip: 'Identity-based habit formation ("I am someone who eats this way") is more powerful than goal-based habits ("I want to eat this way"). The shift in language is the shift in identity.',
      recipe_search: 'healthy lifestyle meal',
    },
    journal: { prompt: 'Describe "Day 365 you" in specific detail. What does their morning look like? What do they eat? How do they move? What do they believe? How do others experience them? Write it present tense, as if it\'s already true.', entry_type: 'general' },
    affirmation: 'I am made for immeasurably more. I don\'t limit God\'s plans with small expectations.',
    personal_growth_page: 'GrowthPathwaysPage',
    personal_growth_label: 'Growth Pathways',
  },

  {
    day: 52, week: 8,
    title: 'The Sermon on the Mount Life',
    bible: {
      book: 'Matthew', chapter: 5, verse_range: '13–16',
      key_verse: '"You are the light of the world. A town built on a hill cannot be hidden." — Matthew 5:14',
      devotion: 'Jesus doesn\'t say "become the light" or "try to shine." He says "you ARE the light." This is a statement of identity before behavior. You don\'t earn the light by your performance over the last 52 days. You simply let it shine by removing the bowl. The discipline, the clean eating, the renewal of mind, the deepening of spirit — these have been removing bowls. The light has been there all along.',
      reflection_q: 'What "bowl" was covering your light before this journey began? What has been removed? How can you continue removing barriers rather than trying harder to produce light?',
    },
    workout: { premade_id: 'bodyweight-master', motivational_tip: 'You are the light. Let your body reflect what\'s happening inside.', coach_note: 'Bodyweight mastery is a life skill. This is an exercise you can do anywhere, forever, with zero equipment.' },
    nutrition: {
      focus: 'Sustainable Forever',
      meal_theme: 'This Is How I Eat Now',
      plan: 'Today: plan a week of meals that you could sustain forever — not perfectly, but consistently. Use everything you\'ve learned to create a realistic, delicious, nourishing meal plan that is genuinely you.',
      tip: 'Sustainability is the ultimate metric. The best diet is the one you can maintain for 40 years. Design yours around what you love that is also good for you.',
      recipe_search: 'sustainable meal plan',
    },
    journal: { prompt: 'Write about three people who have been lit up by your light in the last 52 days — people who have been positively affected by your transformation, even if they don\'t know it. How do you want to continue shining in their direction?', entry_type: 'general' },
    affirmation: 'I am the light of the world. I don\'t hide my light. I let it shine freely and unashamedly.',
    personal_growth_page: 'AffirmationsPage',
    personal_growth_label: 'Affirmations',
  },

  {
    day: 53, week: 8,
    title: 'Fight the Good Fight',
    bible: {
      book: '2 Timothy', chapter: 4, verse_range: '7–8',
      key_verse: '"I have fought the good fight, I have finished the race, I have kept the faith." — 2 Timothy 4:7',
      devotion: 'Paul wrote these words from his final prison cell, days before his execution. He was not reviewing his victories in the colosseum or his accomplishments in the synagogue. He was reviewing his faithfulness. Three things: he fought (he engaged), he finished (he didn\'t quit halfway), he kept the faith (he stayed true to what mattered). That is all that will ever be asked of you. Fight. Finish. Keep the faith.',
      reflection_q: 'Looking at these three metrics — fight, finish, faith — how would you score yourself on this 8-week journey? Where have you excelled? Where have you fallen short? What defines your race so far?',
    },
    workout: { premade_id: 'strength-circuit', motivational_tip: 'Fight the good fight. Finish the race. Keep the faith. Three days left.', coach_note: 'You are completing a real physical transformation. The changes you\'ve made in 7+ weeks are metabolic, structural, and neurological.' },
    nutrition: {
      focus: 'Warrior Fuel',
      meal_theme: 'Fighting Food',
      plan: 'Eat to fight today. Breakfast: Power protein. Lunch: Complex carb and lean protein. Dinner: Anti-inflammatory feast — wild salmon, leafy greens, sweet potato. Snack: Energy-dense whole foods.',
      tip: 'The foods that most support mental fortitude — omega-3s, complex carbs, B vitamins, magnesium — are also the foods that support physical performance. Feed every fight.',
      recipe_search: 'warrior protein meal',
    },
    journal: { prompt: 'Write your own version of 2 Timothy 4:7 for this journey. "I have _____, I have _____, I have _____." Be specific. Be honest. Be proud of what belongs in those blanks.', entry_type: 'scripture_reflection' },
    affirmation: 'I fight. I finish. I keep the faith. These three are enough.',
    personal_growth_page: 'SpiritualGrowth',
    personal_growth_label: 'Spiritual Growth',
  },

  {
    day: 54, week: 8,
    title: 'The Great Commission Life',
    bible: {
      book: 'Matthew', chapter: 28, verse_range: '18–20',
      key_verse: '"Therefore go and make disciples of all nations... teaching them to obey everything I have commanded you." — Matthew 28:19',
      devotion: 'The Great Commission is not just for missionaries. It is for everyone who has been changed. "As you go" — in the ordinary movements of your life — make disciples. You have spent 8 weeks being transformed. The transformation was not for you alone. It was so that others could see what is possible, ask what changed, and begin their own journey. Your story is now a commission.',
      reflection_q: 'Who needs to hear your story — specifically, not generally? What do you have to say now, after 54 days, that you couldn\'t have said on Day 1? Who will you tell?',
    },
    workout: { premade_id: 'hiit-30', motivational_tip: 'Go with all you have. This is your penultimate workout. Leave a legacy on this one.', coach_note: 'Second to last workout. Max effort. The discomfort you push through today becomes the story you tell tomorrow.' },
    nutrition: {
      focus: 'Teaching Kitchen',
      meal_theme: 'Pass It On',
      plan: 'Teach someone one thing you\'ve learned about nutrition in the last 8 weeks. Cook a meal with them, share a recipe, send an article, or text one practical tip. Your knowledge only multiplies when it flows outward.',
      tip: 'The best way to solidify nutritional change is to teach it. Find your person and share what you know.',
      recipe_search: 'beginner healthy cooking',
    },
    journal: { prompt: 'Write a letter to someone who is about to start this 8-week program. What do you wish someone had told you before Day 1? What is most important for them to know? Be honest, practical, and encouraging.', entry_type: 'general' },
    affirmation: 'My transformation is a testimony. I go and share what God has done in me so that others can believe it is possible for them.',
    personal_growth_page: 'Community',
    personal_growth_label: 'Share Your Journey',
  },

  {
    day: 55, week: 8,
    title: 'The Morning of the Last Day',
    bible: {
      book: 'John', chapter: 21, verse_range: '1–6',
      key_verse: '"Early in the morning, Jesus stood on the shore." — John 21:4',
      devotion: 'After the resurrection, after everything — Jesus was at the shore, early in the morning, making breakfast for His disciples. The most powerful moment in all of history had passed, and Jesus was cooking fish on the beach. He didn\'t disappear into glory. He showed up in the ordinary. This is the invitation: as you near the end of this journey, don\'t look for a spectacular finish. Look for the Lord in the ordinary morning, at the ordinary shore, in the ordinary life He has transformed from the inside.',
      reflection_q: 'Where is Jesus meeting you in the ordinary this morning? What ordinary activity has become holy over the last 55 days?',
    },
    workout: { premade_id: 'morning-energizer', motivational_tip: 'Morning of the second-to-last day. Begin it like Day 1 — with intention, gratitude, and the body God gave you.', coach_note: 'Second to last day. This is the last time you do this workout as a "beginner." Tomorrow, you are complete.' },
    nutrition: {
      focus: 'The Shore Breakfast',
      meal_theme: 'Simple and Sacred',
      plan: 'Make a simple, beautiful breakfast today. Eat it slowly. Think about what you\'ve built over 55 days. Let breakfast be a moment of gratitude and anticipation for the final day.',
      tip: 'A mindful breakfast — eaten without distraction, with gratitude — sets the emotional and neurological tone for the entire day. Make it count.',
      recipe_search: 'simple sacred breakfast',
    },
    journal: { prompt: 'Day 55 reflection: Who were you on Day 1? Who are you today? Write about the person you\'ve become — not the accomplishments, but the internal character shifts. What is fundamentally different?', entry_type: 'general' },
    affirmation: 'Jesus meets me in the ordinary. I find the sacred in the daily. Every morning is an invitation to the shore.',
    personal_growth_page: 'GuidedMeditationsPage',
    personal_growth_label: 'Guided Meditation',
  },

  {
    day: 56, week: 8,
    title: 'Day 56 — The New Beginning',
    bible: {
      book: 'Revelation', chapter: 21, verse_range: '5',
      key_verse: '"He who was seated on the throne said, \'I am making everything new!\' Then he said, \'Write this down, for these words are trustworthy and true.\'" — Revelation 21:5',
      devotion: '"I am making everything new" — present tense. Not "I made" and not "I will make." This is the continuous, ongoing, right-now work of God. You are not at an ending. You are at a milestone in a continuous process of renewal. The throne of God is not done with you. Day 56 is not the finish line — it is the starting line of the next chapter of a person who has been fundamentally renewed. Write it down. These things are true and trustworthy.',
      reflection_q: 'On Day 56, what specifically has been made new in you? In your body, your mind, your spirit, your habits, your relationships? Write the whole testimony. Don\'t minimize it.',
    },
    workout: { premade_id: 'power-yoga', motivational_tip: 'Day 56. The new beginning. You made it. Now go do it again — better.', coach_note: 'CONGRATULATIONS. You completed 56 days of intentional transformation. Now set your next goal. This is not the end.' },
    nutrition: {
      focus: 'Celebration and Consecration',
      meal_theme: 'The Feast of Day 56',
      plan: 'Cook or order the most beautiful, nourishing, joyful meal you can imagine. Share it with the people who have been on this journey with you. Celebrate what God has done. Then plan Week 9.',
      tip: 'You have built new metabolic, neurological, and behavioral architecture in 8 weeks. It takes another 8 weeks for these changes to fully automate. Plan your Day 57 today.',
      recipe_search: 'celebration feast healthy',
    },
    journal: { prompt: 'Write your complete Day 56 testimony: What were you before this program? What happened during it? What are you now? What is next? Be specific. Be thorough. This document matters — for you and for everyone you will show it to.', entry_type: 'weekly_reflection' },
    affirmation: 'I am new. I am made new. The One who makes all things new has been working in me for 56 days and He is not done. I am just beginning.',
    personal_growth_page: 'WeeklyReflectionPage',
    personal_growth_label: 'Final Reflection',
  },
];

export const COACHING_PLANS = [
  {
    id: 'renewed-strength',
    title: 'Renewed Strength',
    subtitle: '8 Weeks to Whole-Life Transformation',
    description: 'A comprehensive 8-week program integrating daily Scripture devotions, progressive workouts, intentional nutrition, and journal prompts across 56 days. Built for those ready to align body, mind, and spirit in one unified pursuit.',
    weeks: 8,
    days_total: 56,
    difficulty: 'All Levels',
    gradient: 'from-[#0D4F3C] to-[#c9a227]',
    accent: '#c9a227',
    cover_emoji: '👑',
    tags: ['Bible', 'Fitness', 'Nutrition', 'Journaling', 'Mindset'],
    week_themes: WEEK_THEMES,
    days: PLAN_DAYS,
  },
  FINANCIAL_FREEDOM_PLAN,
];