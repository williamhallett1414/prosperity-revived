/**
 * ROOTED & RENEWED: Body, Soul & Spirit
 * An 8-Week Holistic Coaching Plan
 *
 * Each day contains 5 pillars:
 * - devotion: { scripture, book, chapter, title, reflection }
 * - workout: { workoutId, title, tip, category }  — maps to WorkoutLibrary IDs
 * - nutrition: { meal, recipe, description, macros, logPrompt }
 * - journal: { prompt, reflection }
 * - affirmation: string
 */

export const COACHING_PLAN = {
  id: 'rooted-and-renewed',
  title: 'Rooted & Renewed',
  subtitle: 'Body, Soul & Spirit',
  tagline: '8 Weeks to Transform Every Area of Your Life',
  description:
    'A holistic 8-week journey that weaves together daily Scripture, purposeful workouts, nourishing meals, and deep inner reflection. Each day builds on the last, creating lasting habits across your faith, fitness, nutrition, and mindset.',
  duration_weeks: 8,
  theme_color: 'from-[#0A1A2F] via-[#0A1A2F] to-[#c9a227]',
  accent: '#c9a227',
  pillars: [
    { id: 'devotion',   icon: '📖', label: 'Daily Devotion',        color: '#c9a227',  page: 'Bible' },
    { id: 'workout',    icon: '💪', label: 'Workout',               color: '#38BDF8',  page: 'Workouts' },
    { id: 'nutrition',  icon: '🥗', label: 'Nutrition',             color: '#4ade80',  page: 'Nutrition' },
    { id: 'journal',    icon: '✍️', label: 'Journal Prompt',        color: '#AFC7E3',  page: 'GratitudeJournalPage' },
    { id: 'affirmation',icon: '✨', label: 'Daily Affirmation',     color: '#FAD98D',  page: 'AffirmationsPage' },
  ],
  weeks: [
    // ─────────────────────────────────────────────────────────────────────────
    // WEEK 1 — FOUNDATIONS: Who You Are in Christ
    // ─────────────────────────────────────────────────────────────────────────
    {
      number: 1,
      title: 'Foundations',
      theme: 'Who You Are in Christ',
      overview: 'Before you can build anything lasting, you need to know whose you are. This week we lay the spiritual, physical, and emotional groundwork for everything that follows.',
      color: 'from-[#0A1A2F] to-[#0A1A2F]',
      days: [
        {
          day: 1,
          title: 'A New Beginning',
          devotion: {
            title: 'Made New',
            scripture: '"Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!" — 2 Corinthians 5:17',
            book: '2 Corinthians', chapter: 5,
            reflection: 'You are not starting this journey as a broken person trying to become whole. You are starting as someone already made new in Christ. The transformation you seek on the outside begins with accepting who you already are on the inside. Sit with this truth today: you are a new creation. Not "will be." Not "might be." You are.',
          },
          workout: {
            workoutId: 'beginner-full-body',
            title: 'Beginner Full Body',
            tip: 'Today isn\'t about perfection — it\'s about showing up. Every rep is an act of stewardship for the temple God gave you. Start slow, stay consistent.',
            category: 'full_body',
          },
          nutrition: {
            meal: 'Breakfast',
            recipe: 'Overnight Oats with Berries & Honey',
            description: 'Rolled oats soaked overnight in almond milk, topped with fresh blueberries, a drizzle of raw honey, and a handful of walnuts. High in fiber, slow-release energy, anti-inflammatory.',
            macros: { calories: 420, protein: 12, carbs: 62, fat: 14 },
            logPrompt: 'Log this as a balanced breakfast in your food diary — aim for 400-500 calories to fuel your morning.',
          },
          journal: {
            prompt: 'What does it mean to you personally that you are a "new creation"? What old identity or habit are you most ready to leave behind as you begin this 8-week journey?',
            reflection: 'Write freely — there are no wrong answers here. This is between you and God.',
          },
          affirmation: 'I am a new creation in Christ. The old has gone, the new is here. I step into today\'s journey with confidence and grace.',
        },
        {
          day: 2,
          title: 'Fearfully & Wonderfully Made',
          devotion: {
            title: 'The Temple You Live In',
            scripture: '"I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well." — Psalm 139:14',
            book: 'Psalms', chapter: 139,
            reflection: 'Your body is not an obstacle to your spiritual life — it is a gift from the God who knew every detail of you before you were born. When you nourish it, move it, and rest it, you are honoring the Craftsman who made it. How differently would you treat yourself today if you truly believed you were fearfully and wonderfully made?',
          },
          workout: {
            workoutId: 'morning-energizer',
            title: 'Morning Energizer',
            tip: 'Try doing this workout within 30 minutes of waking up. Movement in the morning sets your body\'s cortisol rhythm and gives you a natural energy boost without caffeine.',
            category: 'full_body',
          },
          nutrition: {
            meal: 'Lunch',
            recipe: 'Grilled Chicken & Quinoa Power Bowl',
            description: 'Quinoa base with grilled chicken breast, roasted sweet potato, steamed broccoli, cherry tomatoes, and lemon tahini dressing. Protein-packed, anti-inflammatory.',
            macros: { calories: 520, protein: 42, carbs: 48, fat: 16 },
            logPrompt: 'Log your lunch and check your protein intake — aim for 30-40g per meal to support muscle recovery.',
          },
          journal: {
            prompt: 'Write a letter to your body. Acknowledge one thing you appreciate about it, one way you\'ve neglected it, and one promise you\'re making to it during these 8 weeks.',
            reflection: 'This exercise may feel vulnerable. That\'s the point.',
          },
          affirmation: 'My body is fearfully and wonderfully made. I honor it today with every choice I make.',
        },
        {
          day: 3,
          title: 'Identity Over Insecurity',
          devotion: {
            title: 'Son/Daughter of the King',
            scripture: '"See what great love the Father has lavished on us, that we should be called children of God!" — 1 John 3:1',
            book: '1 John', chapter: 3,
            reflection: 'Insecurity is simply identity confusion — you\'ve forgotten whose child you are. The King of the universe calls you His own. Let that settle into the places where comparison, shame, or fear have taken up residence.',
          },
          workout: {
            workoutId: 'core-strength',
            title: 'Core Strength Builder',
            tip: 'A strong core is your foundation for everything — posture, back health, athletic performance. Think of building your core the way you build your character: steady, consistent work over time.',
            category: 'strength',
          },
          nutrition: {
            meal: 'Dinner',
            recipe: 'Baked Salmon with Roasted Asparagus & Brown Rice',
            description: 'Wild-caught salmon fillet seasoned with garlic, lemon, and dill. Served with roasted asparagus drizzled in olive oil and a cup of brown rice. Rich in omega-3s and complete protein.',
            macros: { calories: 580, protein: 46, carbs: 42, fat: 22 },
            logPrompt: 'Log your dinner and track your omega-3 intake this week — aim for 2 servings of fatty fish.',
          },
          journal: {
            prompt: 'What is one lie you\'ve believed about yourself that contradicts what God says about you? Write it down, then cross it out and write the truth beside it.',
            reflection: 'Identity work is the foundation of sustainable transformation.',
          },
          affirmation: 'I am a child of God — deeply loved, fully accepted, called and equipped. No insecurity can change who I am.',
        },
        {
          day: 4,
          title: 'Rest Is Not Weakness',
          devotion: {
            title: 'The Gift of the Sabbath',
            scripture: '"Come to me, all you who are weary and burdened, and I will give you rest." — Matthew 11:28',
            book: 'Matthew', chapter: 11,
            reflection: 'God built rest into the fabric of creation — not as a reward for the productive, but as a rhythm for all of us. In a culture that glorifies hustle, choosing rest is an act of faith. Today is your active recovery day. Honor it fully.',
          },
          workout: {
            workoutId: 'desk-stretch',
            title: 'Desk Stretch Break (Active Recovery)',
            tip: 'Today is about gentle movement and recovery, not intensity. Foam roll, stretch, take a slow walk. Your muscles grow during rest, not during the workout.',
            category: 'flexibility',
          },
          nutrition: {
            meal: 'Snack',
            recipe: 'Greek Yogurt with Chia Seeds & Sliced Almonds',
            description: 'Plain full-fat Greek yogurt with 1 tbsp chia seeds, 15g sliced almonds, and a small drizzle of honey. Probiotic-rich, high protein, satisfying.',
            macros: { calories: 280, protein: 18, carbs: 22, fat: 12 },
            logPrompt: 'Track your snacks — many people underestimate snack calories. This one is designed to keep you full between meals.',
          },
          journal: {
            prompt: 'What does rest mean to you right now? Is there any part of you that feels guilty for resting? Where does that guilt come from, and what does God say about it?',
            reflection: 'Rest is resistance to the lie that your worth comes from output.',
          },
          affirmation: 'Rest is not laziness — it is wisdom. I give myself permission to slow down and receive God\'s restoration today.',
        },
        {
          day: 5,
          title: 'Strength Through Surrender',
          devotion: {
            title: 'His Power in Your Weakness',
            scripture: '"I can do all this through him who gives me strength." — Philippians 4:13',
            book: 'Philippians', chapter: 4,
            reflection: 'Paul wrote this verse from prison — not from the winner\'s podium. The strength he\'s describing is not human willpower. It\'s the supernatural sustaining power of Christ that enables you to be content, resilient, and purposeful in every circumstance. You don\'t need to feel strong today. You just need to lean on the One who is.',
          },
          workout: {
            workoutId: 'cardio-blast',
            title: 'Cardio Blast',
            tip: 'Push through when it gets hard today. Remind yourself that physical discomfort is temporary, but the character you\'re building is permanent. Every hard set is a small act of mental toughness.',
            category: 'cardio',
          },
          nutrition: {
            meal: 'Pre-Workout',
            recipe: 'Banana with Almond Butter',
            description: 'One medium banana with 2 tbsp natural almond butter. The banana provides fast carbs for energy; the almond butter adds slow-burning fat and protein. Perfect 30 minutes before exercise.',
            macros: { calories: 320, protein: 7, carbs: 42, fat: 16 },
            logPrompt: 'Pre-workout nutrition matters. Log this 30-45 min before your cardio session.',
          },
          journal: {
            prompt: 'Write about a time you felt physically or emotionally depleted but kept going. What got you through it? How does that strength connect to your faith?',
            reflection: 'Recalling your past resilience builds future resilience.',
          },
          affirmation: 'I can do all things through Christ who strengthens me. My weakness is the perfect canvas for His power.',
        },
        {
          day: 6,
          title: 'Community & Accountability',
          devotion: {
            title: 'Iron Sharpens Iron',
            scripture: '"As iron sharpens iron, so one person sharpens another." — Proverbs 27:17',
            book: 'Proverbs', chapter: 27,
            reflection: 'You were not designed to do this alone. The people God places in your life — especially those who challenge you, hold you accountable, and run alongside you — are one of His greatest gifts. Who is your iron? Who are you sharpening?',
          },
          workout: {
            workoutId: 'upper-body-strength',
            title: 'Upper Body Strength',
            tip: 'Consider inviting a friend or family member to work out with you today. Accountability partners increase workout consistency by 65%. Who in your life needs this journey as much as you do?',
            category: 'strength',
          },
          nutrition: {
            meal: 'Meal Prep Sunday',
            recipe: 'Turkey & Vegetable Stir Fry',
            description: 'Ground turkey with bell peppers, snap peas, broccoli, garlic, and ginger in a light coconut aminos sauce. Serve over cauliflower rice. Batch-cook for 3 servings.',
            macros: { calories: 440, protein: 38, carbs: 28, fat: 18 },
            logPrompt: 'Meal prep tip: make double batches and log them now so you\'re not guessing calorie counts later in the week.',
          },
          journal: {
            prompt: 'Who are the 2-3 people you want to share this journey with? Write their names and one specific way each person could support you. Then reach out to at least one of them today.',
            reflection: 'Community is not a luxury — it\'s a biblical imperative.',
          },
          affirmation: 'I am strengthened by community. I reach out, I lean in, and I show up for others as they show up for me.',
        },
        {
          day: 7,
          title: 'Reflection & Recommitment',
          devotion: {
            title: 'Selah — Pause and Reflect',
            scripture: '"Let the morning bring me word of your unfailing love, for I have put my trust in you. Show me the way I should go, for to you I entrust my life." — Psalm 143:8',
            book: 'Psalms', chapter: 143,
            reflection: 'The word "Selah" appears 74 times in the Psalms — a musical pause, an invitation to stop and reflect on what was just said. Today is your Selah. Look back at the week. Give thanks. Identify what was hard. Recommit to the next 7 days with fresh eyes.',
          },
          workout: {
            workoutId: 'bedtime-stretch',
            title: 'Bedtime Stretch & Recovery',
            tip: 'Well done on completing Week 1. This gentle stretch session prepares your body for the deeper work ahead. Breathe deeply. You showed up for 7 days — that is worth celebrating.',
            category: 'flexibility',
          },
          nutrition: {
            meal: 'Week 1 Reflection',
            recipe: 'Whole Grain Toast with Avocado & Poached Egg',
            description: 'Two slices of sprouted grain bread topped with mashed avocado, a poached egg, red pepper flakes, and a squeeze of lemon. Balanced macros for a Sunday brunch.',
            macros: { calories: 480, protein: 22, carbs: 44, fat: 24 },
            logPrompt: 'Review your food log from this week. How many days did you hit your protein goal? What was your average calorie intake?',
          },
          journal: {
            prompt: 'Week 1 Reflection: What surprised you most about this first week? What was harder than you expected? What was easier? Write a prayer of gratitude and intention for Week 2.',
            reflection: 'Reflection without judgment. You are in process, not on trial.',
          },
          affirmation: 'I completed Week 1. I am building something real. Every day I show up is a victory, and I carry that momentum into the week ahead.',
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────────────────
    // WEEK 2 — DISCIPLINE: Building the Temple
    // ─────────────────────────────────────────────────────────────────────────
    {
      number: 2,
      title: 'Discipline',
      theme: 'Building the Temple',
      overview: 'Motivation gets you started. Discipline keeps you going. This week we build the systems and habits that will sustain this transformation long after the feelings fade.',
      color: 'from-[#0A1A2F] to-[#0A1A2F]',
      days: [
        {
          day: 8,
          title: 'Sacred Routines',
          devotion: {
            title: 'The Power of the Morning',
            scripture: '"Very early in the morning, while it was still dark, Jesus got up, left the house and went off to a solitary place, where he prayed." — Mark 1:35',
            book: 'Mark', chapter: 1,
            reflection: 'If Jesus — the Son of God — needed to begin His day in solitary prayer, how much more do we? A morning routine is not about performance; it\'s about posturing your heart toward God before the world gets to it first. Start today with 5 minutes of silence before you check your phone.',
          },
          workout: {
            workoutId: 'morning-energizer',
            title: 'Morning Energizer',
            tip: 'Stack your workout with your devotional time. Many people find that 10 minutes of movement followed by 10 minutes of prayer is more effective than trying to do either separately. Experiment today.',
            category: 'full_body',
          },
          nutrition: {
            meal: 'Breakfast',
            recipe: 'Spinach & Mushroom Egg White Omelette',
            description: 'Four egg whites with sautéed baby spinach, cremini mushrooms, and a sprinkle of feta cheese. Served with half an avocado. High protein, low calorie.',
            macros: { calories: 320, protein: 28, carbs: 12, fat: 18 },
            logPrompt: 'Aim to eat breakfast within 1 hour of waking. Log this meal and note your hunger level before and after.',
          },
          journal: {
            prompt: 'Design your ideal morning routine. What would the first 60 minutes of your day look like if they were fully intentional? Include faith, movement, and nourishment.',
            reflection: 'You don\'t rise to your goals — you fall to your systems.',
          },
          affirmation: 'I am a person of intentional habits. I design my mornings and my mornings design my days.',
        },
        {
          day: 9,
          title: 'Consistency Over Intensity',
          devotion: {
            title: 'The Long Obedience',
            scripture: '"Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up." — Galatians 6:9',
            book: 'Galatians', chapter: 6,
            reflection: 'The harvest doesn\'t come the day after planting. Spiritual, physical, and emotional transformation all require the same thing: showing up day after day, especially when you don\'t feel like it. The breakthrough you\'re looking for is usually on the other side of the day you almost quit.',
          },
          workout: {
            workoutId: 'lower-body-power',
            title: 'Lower Body Power',
            tip: 'Legs are your largest muscle group. Training them releases the most testosterone and growth hormone, which means benefits for your entire body. Push through the burn today — it\'s where the growth happens.',
            category: 'strength',
          },
          nutrition: {
            meal: 'Lunch',
            recipe: 'Lentil & Sweet Potato Soup',
            description: 'Red lentils simmered with diced sweet potato, canned tomatoes, spinach, cumin, and turmeric. Garnished with plain yogurt and fresh cilantro. High fiber, plant-based protein.',
            macros: { calories: 380, protein: 18, carbs: 62, fat: 8 },
            logPrompt: 'Track your fiber intake today — aim for 25-35g daily. This soup alone provides about 14g.',
          },
          journal: {
            prompt: 'Where in your life are you tempted to quit just before the breakthrough? Write about a past moment where consistency paid off, even when it was slow.',
            reflection: 'Your testimony is being written one faithful day at a time.',
          },
          affirmation: 'I do not need to be motivated — I am disciplined. I show up even when I don\'t feel like it, and that is where transformation lives.',
        },
        {
          day: 10,
          title: 'Feeding the Spirit',
          devotion: {
            title: 'Man Does Not Live on Bread Alone',
            scripture: '"Man shall not live on bread alone, but on every word that comes from the mouth of God." — Matthew 4:4',
            book: 'Matthew', chapter: 4,
            reflection: 'Jesus was quoting Deuteronomy when He said this — in the middle of 40 days of fasting, when His physical hunger was at its peak. He understood something we often forget: spiritual hunger is more urgent than physical hunger. You\'ve been feeding your body. Are you also feeding your spirit?',
          },
          workout: {
            workoutId: 'hiit-30',
            title: '30-Minute HIIT',
            tip: 'HIIT workouts elevate your metabolism for up to 24 hours after completion. Today\'s challenge: match the intensity of this workout with the intensity of your prayer life this week.',
            category: 'cardio',
          },
          nutrition: {
            meal: 'Post-Workout',
            recipe: 'Protein Smoothie: "The Temple Builder"',
            description: '1 scoop vanilla protein powder, 1 frozen banana, 1 tbsp almond butter, 1 cup almond milk, 1 tsp cinnamon, handful of spinach (you won\'t taste it). Blend and drink within 30 minutes of your workout.',
            macros: { calories: 380, protein: 32, carbs: 38, fat: 10 },
            logPrompt: 'Post-workout nutrition is critical. Log this shake and aim to consume it within 30 minutes of finishing your HIIT session.',
          },
          journal: {
            prompt: 'What is your current "spiritual diet"? How much time do you spend in the Word vs. social media vs. entertainment each day? Write honestly, then consider one swap you\'ll make this week.',
            reflection: 'You become what you consume — spiritually, mentally, and physically.',
          },
          affirmation: 'I feed my spirit as intentionally as I feed my body. The Word of God is my daily bread and I hunger for it.',
        },
        {
          day: 11,
          title: 'The Power of Saying No',
          devotion: {
            title: 'Self-Control Is a Fruit',
            scripture: '"But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control." — Galatians 5:22-23',
            book: 'Galatians', chapter: 5,
            reflection: 'Self-control is listed last in Paul\'s list of spiritual fruit — but that doesn\'t mean it\'s least important. It means it underlies all the others. You cannot consistently love, find peace, or demonstrate faithfulness without self-control. Every time you choose the salad, skip the scroll, or go to bed on time, you\'re exercising a spiritual muscle.',
          },
          workout: {
            workoutId: 'abs-focus',
            title: 'Abs-Focused Workout',
            tip: 'Core work is humbling — and revealing. Notice any tendency to cheat the form when it gets hard. That same tendency shows up in other areas of life. Discipline here trains discipline everywhere.',
            category: 'strength',
          },
          nutrition: {
            meal: 'Dinner',
            recipe: 'Herb-Roasted Chicken Thighs with Roasted Vegetables',
            description: 'Bone-in chicken thighs marinated in rosemary, thyme, garlic, and lemon zest. Roasted alongside Brussels sprouts, red onion, and baby carrots. Simple, satisfying, nutrient-dense.',
            macros: { calories: 520, protein: 44, carbs: 28, fat: 24 },
            logPrompt: 'Practice mindful eating at dinner tonight — eat without screens. Log the meal and note how satisfied you feel 20 minutes after finishing.',
          },
          journal: {
            prompt: 'What is the one area of your life where you most need to develop self-control right now? What would it look like to say "no" to one thing today in order to say "yes" to something better?',
            reflection: 'Every no to the flesh is a yes to the spirit.',
          },
          affirmation: 'Self-control is a gift I am growing. I choose what serves my destiny over what satisfies my momentary desires.',
        },
        {
          day: 12,
          title: 'Moving Through Resistance',
          devotion: {
            title: 'The Struggle Is the Training',
            scripture: '"Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance." — James 1:2-3',
            book: 'James', chapter: 1,
            reflection: 'James doesn\'t say "if you face trials" — he says "whenever." Resistance is not a sign that you\'re on the wrong path. It\'s often a sign that you\'re on exactly the right one. The muscle you build in the struggle is the muscle that carries you through the next one.',
          },
          workout: {
            workoutId: 'bodyweight-master',
            title: 'Bodyweight Mastery',
            tip: 'Bodyweight training is deceptively challenging. Today\'s session will test your mental toughness as much as your physical strength. When you want to stop, ask yourself: "Am I done or am I just uncomfortable?" There\'s a difference.',
            category: 'strength',
          },
          nutrition: {
            meal: 'Breakfast',
            recipe: 'Chia Pudding with Mango & Coconut',
            description: 'Three tablespoons of chia seeds soaked overnight in coconut milk with vanilla extract. Topped with fresh mango chunks and toasted coconut flakes. High in omega-3s and fiber.',
            macros: { calories: 420, protein: 10, carbs: 52, fat: 18 },
            logPrompt: 'Chia seeds expand in your stomach, keeping you fuller longer. Log this breakfast and track your hunger levels through the morning.',
          },
          journal: {
            prompt: 'What is the resistance you\'re feeling most right now in this program? Write about it honestly — then write about what you believe is on the other side of pushing through it.',
            reflection: 'Name the resistance. Naming it removes some of its power.',
          },
          affirmation: 'I welcome resistance as my teacher. Every obstacle is building the strength I need for the next chapter.',
        },
        {
          day: 13,
          title: 'Gratitude as Fuel',
          devotion: {
            title: 'The Antidote to Complaining',
            scripture: '"Give thanks in all circumstances; for this is God\'s will for you in Christ Jesus." — 1 Thessalonians 5:18',
            book: '1 Thessalonians', chapter: 5,
            reflection: 'Gratitude is not a passive feeling — it\'s an active choice. And research confirms what Scripture has always taught: people who practice daily gratitude experience measurably higher levels of wellbeing, energy, and resilience. When you shift your focus from what you lack to what you have, everything changes.',
          },
          workout: {
            workoutId: 'cardio-blast',
            title: 'Cardio Blast',
            tip: 'Try a "gratitude run" today. For every minute of cardio, think of something you\'re grateful for. By the end of your 25-minute session, you\'ll have 25 reasons to be thankful — and the endorphins to match.',
            category: 'cardio',
          },
          nutrition: {
            meal: 'Lunch',
            recipe: 'Mediterranean Chickpea Salad',
            description: 'Canned chickpeas with cucumber, cherry tomatoes, Kalamata olives, red onion, and fresh parsley. Dressed in olive oil, lemon juice, and za\'atar. No cook required, infinitely packable.',
            macros: { calories: 390, protein: 16, carbs: 48, fat: 16 },
            logPrompt: 'This is an excellent prep-ahead meal. Make a double batch and log both servings now for easy tracking tomorrow.',
          },
          journal: {
            prompt: 'Write 10 things you are grateful for in your body specifically — not for how it looks, but for what it can do. Include small things: the ability to breathe deeply, to taste food, to feel the sun.',
            reflection: 'Gratitude is the fastest path to contentment.',
          },
          affirmation: 'I live in gratitude. I see the gifts in front of me, and that perspective makes me powerful, present, and alive.',
        },
        {
          day: 14,
          title: 'Week 2 Celebration',
          devotion: {
            title: 'The God Who Sees',
            scripture: '"She gave this name to the LORD who spoke to her: \'You are the God who sees me.\'" — Genesis 16:13',
            book: 'Genesis', chapter: 16,
            reflection: 'Hagar was a slave, alone in the desert, having run away from mistreatment. God found her and called her by name. El Roi — the God who sees. You are seen. Your effort this week was seen. Your tears were seen. Your quiet discipline, logged meals, and journal entries — all seen. You are not doing this alone.',
          },
          workout: {
            workoutId: 'power-yoga',
            title: 'Power Yoga Session',
            tip: 'After 2 weeks of building intensity, yoga is your celebration workout. Flow through these poses with gratitude for a body that moved for 14 days straight. You have earned this.',
            category: 'yoga',
          },
          nutrition: {
            meal: 'Celebration Meal',
            recipe: 'Grilled Shrimp Tacos with Mango Salsa',
            description: 'Grilled shrimp seasoned with chili-lime in corn tortillas with cabbage slaw, mango salsa, avocado, and cilantro crema. A healthy celebration meal that feels indulgent but isn\'t.',
            macros: { calories: 560, protein: 38, carbs: 52, fat: 22 },
            logPrompt: 'You\'ve completed 2 weeks — this meal is your celebration. Log it, enjoy it, and review your nutrition from the past 14 days in the app.',
          },
          journal: {
            prompt: 'Week 2 Complete. Write about how you feel physically, spiritually, and emotionally compared to Day 1. What habits are beginning to stick? What still needs work? What is God showing you about yourself?',
            reflection: 'You are 25% of the way through. The foundation is set.',
          },
          affirmation: 'I am seen by the God who created me. My faithfulness over these 14 days matters and I celebrate the person I am becoming.',
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────────────────
    // WEEK 3 — HEALING: Addressing the Roots
    // ─────────────────────────────────────────────────────────────────────────
    {
      number: 3,
      title: 'Healing',
      theme: 'Addressing the Roots',
      overview: 'Lasting transformation requires healing — not just of the body, but of the soul. This week we address the emotional and spiritual roots of the patterns that have held you back.',
      color: 'from-[#0A1A2F] to-[#1a5c4a]',
      days: [
        { day: 15, title: 'Forgiveness Unlocks Freedom', devotion: { title: 'Set Yourself Free', scripture: '"Get rid of all bitterness, rage and anger... Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you." — Ephesians 4:31-32', book: 'Ephesians', chapter: 4, reflection: 'Unforgiveness is like drinking poison and waiting for the other person to die. The person most imprisoned by your bitterness is you. Forgiveness is not condoning what happened — it is releasing your right to be the one who makes it right. That is God\'s job. Today we begin the deep work.' }, workout: { workoutId: 'hiit-30', title: '30-Minute HIIT', tip: 'Physical exertion can be a powerful emotional release. If you feel emotion rising during today\'s workout, let it. Tears during exercise are not weakness — they are healing.', category: 'cardio' }, nutrition: { meal: 'Anti-Inflammatory Day', recipe: 'Turmeric Golden Milk Smoothie', description: 'Almond milk blended with 1 tsp turmeric, 1/2 tsp ginger, cinnamon, black pepper, mango chunks, and a banana. Anti-inflammatory powerhouse.', macros: { calories: 280, protein: 6, carbs: 52, fat: 8 }, logPrompt: 'Turmeric is one of the most studied anti-inflammatory foods. Log this as your morning drink and note how you feel an hour later.' }, journal: { prompt: 'Is there someone you need to forgive — including yourself? Write their name. Write what they did. Then write: "I choose to release this to God. I am free." This is not for them. This is for you.', reflection: 'You may need to choose forgiveness more than once. That\'s okay.' }, affirmation: 'I am free. I release what was done to me and trust God to heal every wound. Forgiveness is my superpower.' },
        { day: 16, title: 'Breaking Emotional Eating', devotion: { title: 'Hunger That Food Can\'t Fill', scripture: '"Blessed are those who hunger and thirst for righteousness, for they will be filled." — Matthew 5:6', book: 'Matthew', chapter: 5, reflection: 'Much of our struggle with food isn\'t about food at all — it\'s about unmet emotional needs. Boredom, loneliness, stress, and grief all send us to the pantry. Today, before you eat anything, pause and ask: "Am I physically hungry, or is this something else?" That pause is the beginning of freedom.' }, workout: { workoutId: 'mobility-flow', title: 'Mobility & Flexibility', tip: 'Today\'s slower workout gives you space to notice your body\'s signals. Practice the pause: before each water break, check in — am I thirsty, tired, or hungry?', category: 'flexibility' }, nutrition: { meal: 'Mindful Eating Practice', recipe: 'Slow-Cooked Vegetable & Bean Chili', description: 'A hearty chili with kidney beans, black beans, fire-roasted tomatoes, bell peppers, and warm spices. High fiber, deeply satisfying, naturally filling.', macros: { calories: 420, protein: 22, carbs: 58, fat: 8 }, logPrompt: 'Practice eating this meal without distractions. Log it before and after — note your hunger level (1-10) before you start and your fullness level when you finish.' }, journal: { prompt: 'What emotions most often drive you to eat when you\'re not physically hungry? What are those emotions really asking for? What is a non-food response you could try next time?', reflection: 'You are not broken. You developed coping mechanisms that once protected you.' }, affirmation: 'I eat to nourish, not to numb. I am learning to hear my body\'s true signals and meet my needs with wisdom.' },
        { day: 17, title: 'The Comparison Trap', devotion: { title: 'Run Your Own Race', scripture: '"Each one should test their own actions. Then they can take pride in themselves alone, without comparing themselves to someone else." — Galatians 6:4', book: 'Galatians', chapter: 6, reflection: 'Social media has made comparison an hourly occurrence. But the comparison trap has always been there — in the gym, in the mirror, in the pew. You are running a unique race with a unique calling and a unique body. Your only competitor is the person you were yesterday.' }, workout: { workoutId: 'strength-circuit', title: 'Total Strength Circuit', tip: 'Today: compete only with yourself. Don\'t worry about anyone else\'s weights or times. Track your own numbers from last week and try to beat them. Progress, not perfection.', category: 'strength' }, nutrition: { meal: 'Lunch', recipe: 'Avocado & Black Bean Burrito Bowl', description: 'Brown rice with seasoned black beans, grilled corn, diced avocado, pico de gallo, and a chipotle-lime dressing. Satisfying, colorful, and completely plant-based.', macros: { calories: 510, protein: 18, carbs: 72, fat: 18 }, logPrompt: 'Plant-based meals are an important part of a balanced diet. Log this and compare it to your protein intake from yesterday\'s meat-based meal.' }, journal: { prompt: 'Who do you most often compare yourself to? What does that comparison cost you emotionally? Write a prayer releasing the need to measure up to anyone other than the person God made you to be.', reflection: 'Comparison is the thief of gratitude and the enemy of calling.' }, affirmation: 'I run my own race. I am exactly where I need to be, becoming who God designed me to be — and no one else\'s journey changes that.' },
        { day: 18, title: 'Renewing Your Mind', devotion: { title: 'The Battlefield', scripture: '"Do not conform to the pattern of this world, but be transformed by the renewing of your mind." — Romans 12:2', book: 'Romans', chapter: 12, reflection: 'Your behaviors will never change until your beliefs change. The patterns that keep you stuck — the emotional eating, the skipped workouts, the avoidance — all flow from mental patterns. The Word of God is your most powerful tool for rewiring those patterns. Transformation happens from the inside out.' }, workout: { workoutId: 'athlete-conditioning', title: 'Athletic Conditioning', tip: 'While you\'re working out today, replace any negative self-talk with a truth from scripture. When your mind says "I can\'t," counter it with "I can do all things through Christ."', category: 'full_body' }, nutrition: { meal: 'Brain Food', recipe: 'Walnut & Berry Brain Bowl', description: 'Mixed greens topped with blueberries, walnuts, sliced strawberries, goat cheese, and a balsamic vinaigrette. Walnuts and berries are among the top brain-protective foods.', macros: { calories: 380, protein: 12, carbs: 32, fat: 24 }, logPrompt: 'Your diet affects your mental health directly. Log this meal and research one food you could add to your regular rotation for brain health.' }, journal: { prompt: 'What is the most persistent negative thought about yourself? Where did it come from? What does Scripture say in direct contradiction to it? Write both and choose which voice you will feed.', reflection: 'What you feed grows. What you starve dies.' }, affirmation: 'My mind is being renewed daily. I reject the lies and embrace the truth: I am transformed, capable, and chosen.' },
        { day: 19, title: 'The Body Keeps the Score', devotion: { title: 'Carrying What Was Never Meant to Be Carried', scripture: '"Cast all your anxiety on him because he cares for you." — 1 Peter 5:7', book: '1 Peter', chapter: 5, reflection: 'Trauma and chronic stress are stored in the body — that is not just science, it\'s spiritual reality. Many of our physical struggles (fatigue, weight gain, chronic pain) have emotional roots. God invites you to literally cast your burdens on Him. That is an act of surrender, trust, and healing all at once.' }, workout: { workoutId: 'bedtime-stretch', title: 'Bedtime Stretch & Recovery', tip: 'Tonight, do this stretch routine as a prayer. As you hold each stretch, breathe deeply and release. Physically surrendering tension is a powerful metaphor for spiritual surrender.', category: 'flexibility' }, nutrition: { meal: 'Dinner', recipe: 'Warm Bone Broth with Herbs', description: 'Homemade or store-bought bone broth simmered with fresh rosemary, thyme, and garlic. Gut-healing, rich in collagen, and deeply restorative on a healing day.', macros: { calories: 60, protein: 6, carbs: 4, fat: 2 }, logPrompt: 'Add this as a calorie-light evening option. Pair it with a balanced dinner and log both.' }, journal: { prompt: 'Is there anything your body is trying to tell you through pain, fatigue, or tension? Write to it as if it could speak to you. What might it say about what it has been carrying?', reflection: 'Your body is not your enemy. It is a faithful messenger.' }, affirmation: 'I release what my body has been holding. I cast my burdens on the God who cares for me, and I receive His rest and healing.' },
        { day: 20, title: 'Boundaries Are Biblical', devotion: { title: 'Love Has Limits', scripture: '"Above all else, guard your heart, for everything you do flows from it." — Proverbs 4:23', book: 'Proverbs', chapter: 4, reflection: 'A boundary is not a wall — it\'s a property line. It defines where you end and where another person begins. Jesus had boundaries: He said no to the crowd to be alone with the Father (Mark 1:35). He said no to Satan\'s tests in the wilderness. Healthy boundaries are not selfishness — they are stewardship of the life God gave you.' }, workout: { workoutId: 'upper-body-strength', title: 'Upper Body Strength', tip: 'Notice if you have any trouble saying no in your fitness life — skipping rest days, overtraining, or letting others talk you out of your routine. Physical boundaries and personal boundaries often mirror each other.', category: 'strength' }, nutrition: { meal: 'Snack + Evening', recipe: 'Hummus with Raw Vegetables & Rice Crackers', description: 'Homemade or store-bought hummus with carrot sticks, cucumber, bell pepper strips, and a few whole grain rice crackers. Great for curbing evening snacking urges.', macros: { calories: 240, protein: 8, carbs: 28, fat: 12 }, logPrompt: 'Evening snacking is one of the most common places people exceed their calorie goals. Log this intentional snack as a healthy boundary.' }, journal: { prompt: 'Where in your life do you need to set a better boundary? With a person? With a screen? With food or drink? Write out one specific boundary you\'re committing to this week and what it will protect.', reflection: 'A boundary said with love is a gift — to yourself and the people in your life.' }, affirmation: 'I guard my heart and my health. I set boundaries with love and confidence, knowing they protect what God has entrusted to me.' },
        { day: 21, title: 'Halfway There', devotion: { title: 'Keep Going', scripture: '"Not that I have already obtained all this, or have already arrived at my goal, but I press on to take hold of that for which Christ Jesus took hold of me." — Philippians 3:12', book: 'Philippians', chapter: 3, reflection: 'Halfway. Paul\'s words are for you today: you haven\'t arrived, but you haven\'t quit. The pressing on is the victory. You\'ve healed, disciplined, and strengthened for 21 days. The next 21 will go deeper. Press on.' }, workout: { workoutId: 'tabata-intense', title: 'Tabata Intense', tip: 'A Tabata session at the halfway mark is symbolic: this workout mimics what the second half of this journey requires — maximum effort in short bursts, consistent recovery, and finishing strong.', category: 'cardio' }, nutrition: { meal: 'Midpoint Check-In', recipe: 'Sheet Pan Salmon & Veggies', description: 'Salmon fillet with broccoli, cherry tomatoes, and zucchini all on one sheet pan roasted with olive oil, garlic, and herbs. Minimal dishes, maximum nutrition.', macros: { calories: 540, protein: 48, carbs: 28, fat: 26 }, logPrompt: 'Midpoint nutrition review: check your 3-week average calories, protein, and water intake. Adjust your goals in the app for the final 4 weeks.' }, journal: { prompt: 'Three weeks in. Write about the version of yourself you are becoming. Not who you were on Day 1. Not who you\'ll be on Day 56. Who are you today, right now, at the halfway point?', reflection: 'You are already the person in process. Celebrate her/him.' }, affirmation: 'I am halfway through and I am different. I press on — not because I have to, but because I am becoming who I was always meant to be.' },
      ],
    },
    // ─────────────────────────────────────────────────────────────────────────
    // WEEK 4 — STRENGTH: Building on the Foundation
    // ─────────────────────────────────────────────────────────────────────────
    {
      number: 4,
      title: 'Strength',
      theme: 'Building on the Foundation',
      overview: 'The foundation is laid. The healing is in process. Now we build. This week we increase intensity across every pillar — harder workouts, deeper Scripture, more challenging journaling, and leveling up nutrition.',
      color: 'from-[#1a5c4a] to-[#2d6a1e]',
      days: [
        { day: 22, title: 'Walking in Power', devotion: { title: 'Spirit of Power, Love & Sound Mind', scripture: '"For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline." — 2 Timothy 1:7', book: '2 Timothy', chapter: 1, reflection: 'Timidity is not humility. Fear is not faith. The Spirit that lives in you is a spirit of power. This week you will step into that power — in your workouts, in your eating, in your inner life. No more playing small.' }, workout: { workoutId: 'strength-circuit', title: 'Total Strength Circuit', tip: 'Week 4 is time to increase your weights or reps from Week 1. Log your numbers and aim for progressive overload — the foundation of physical strength gains.', category: 'strength' }, nutrition: { meal: 'High Protein Day', recipe: 'Ground Turkey Stuffed Bell Peppers', description: 'Bell peppers halved and filled with seasoned ground turkey, brown rice, black beans, diced tomatoes, and topped with a sprinkle of cheese. Baked until tender.', macros: { calories: 480, protein: 42, carbs: 38, fat: 16 }, logPrompt: 'Week 4 nutrition goal: hit 1g of protein per pound of bodyweight. Log everything and see how close you get.' }, journal: { prompt: 'In what area of your life have you been playing small? What would it look like to walk in the power God gave you — specifically in one relationship, one health choice, or one spiritual practice this week?', reflection: 'Power is not arrogance. It\'s knowing who you are and acting accordingly.' }, affirmation: 'I walk in the power of the Holy Spirit. Timidity has no place in my story. I am bold, capable, and fully alive.' },
        { day: 23, title: 'Pruning Season', devotion: { title: 'What Gets Cut Produces Fruit', scripture: '"He cuts off every branch in me that bears no fruit, while every branch that does bear fruit he prunes so that it will be even more fruitful." — John 15:2', book: 'John', chapter: 15, reflection: 'Pruning hurts. But Jesus says it happens to the fruitful branches — not just the weak ones. If your life feels like it\'s being cut back right now, consider: maybe God is preparing you for a season of greater fruitfulness than you\'ve ever known.' }, workout: { workoutId: 'hiit-30', title: '30-Minute HIIT (Increased Intensity)', tip: 'Today, increase your interval intensity by 10%. If you were doing 75% effort last week, push to 85%. The pruning of your comfort zone is where growth happens.', category: 'cardio' }, nutrition: { meal: 'Clean Out', recipe: 'Detox Green Smoothie', description: 'Kale, cucumber, green apple, lemon juice, ginger, 1 tbsp chia seeds, and cold water blended until smooth. Eliminates processed food cravings and supports liver health.', macros: { calories: 180, protein: 4, carbs: 38, fat: 4 }, logPrompt: 'Pair this smoothie with a food diary review: what foods have been creeping back in that don\'t serve your goals? Log what needs to go.' }, journal: { prompt: 'What in your life feels like it\'s being pruned right now? A relationship, a habit, an ambition? Write about the discomfort — and then write about what fruit you believe will come from this season.', reflection: 'Seasons of loss are often seasons of preparation.' }, affirmation: 'I welcome the pruning. I trust the Gardner knows what He\'s doing, and I will bear much fruit.' },
        { day: 24, title: 'Fueling Your Purpose', devotion: { title: 'Designed for Good Works', scripture: '"For we are God\'s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do." — Ephesians 2:10', book: 'Ephesians', chapter: 2, reflection: 'You were not created for survival — you were created for purpose. And purpose requires energy. Your body, mind, and spirit all need to be fueled for the work God prepared for you. Caring for yourself is not self-indulgence. It\'s mission preparation.' }, workout: { workoutId: 'athlete-conditioning', title: 'Athletic Conditioning', tip: 'Today, dedicate your workout to a purpose bigger than yourself. Think of someone you\'re doing this for — a child, a community, a calling. Let that expand your capacity.', category: 'full_body' }, nutrition: { meal: 'Performance Nutrition', recipe: 'Sweet Potato & Egg White Breakfast Bowl', description: 'Roasted sweet potato cubes with scrambled egg whites, sautéed kale, avocado slices, and a drizzle of hot sauce. Pre-performance fuel.', macros: { calories: 440, protein: 30, carbs: 48, fat: 14 }, logPrompt: 'Fuel for purpose: review your energy levels throughout the day. Log meals and note which foods give you sustained energy vs. crashes.' }, journal: { prompt: 'Write about your purpose. Not your job — your purpose. What do you believe God made you to do and be? How does this 8-week journey connect to that larger calling?', reflection: 'Purpose is the deepest form of motivation. It outlasts feelings every time.' }, affirmation: 'I am God\'s handiwork, created for good works He prepared for me. I fuel my body and my faith for the mission I was made for.' },
        { day: 25, title: 'Celebrating Progress', devotion: { title: 'Ebenezer — Thus Far He Has Helped', scripture: '"He named it Ebenezer, saying, \'Thus far the LORD has helped us.\'" — 1 Samuel 7:12', book: '1 Samuel', chapter: 7, reflection: 'An Ebenezer is a stone of remembrance. Samuel set it up so the people would never forget: God showed up. As you pass the Day 25 mark, set your own Ebenezer. Remember where you were. Remember what God has done. He has helped you thus far — and He will continue.' }, workout: { workoutId: 'power-yoga', title: 'Power Yoga (Celebration Practice)', tip: 'Today\'s yoga practice is a moving celebration. Move with gratitude. Every warrior pose is a declaration. Every downward dog is a prayer. Honor 25 days of faithfulness.', category: 'yoga' }, nutrition: { meal: 'Progress Meal', recipe: 'Seared Tuna Steak with Mango Salsa', description: 'Seared yellowfin tuna with a crust of sesame seeds, paired with a bright mango-avocado salsa and steamed jasmine rice. A progress celebration that\'s as nutritious as it is delicious.', macros: { calories: 520, protein: 50, carbs: 38, fat: 16 }, logPrompt: 'Take your measurements and log a progress note in the app. Compare to your starting point. Celebrate the wins.' }, journal: { prompt: 'Name 5 specific changes you\'ve noticed in yourself over the past 25 days. They can be physical, emotional, spiritual, or relational. Give each one a moment of genuine celebration.', reflection: 'Celebration is not pride — it\'s acknowledgment that God has been at work.' }, affirmation: 'Thus far, God has helped me. I mark this milestone with gratitude and step forward with confidence.' },
        { day: 26, title: 'Depth Over Performance', devotion: { title: 'The Interior Life', scripture: '"But when you pray, go into your room, close the door and pray to your Father, who is unseen. Then your Father, who sees what is done in secret, will reward you." — Matthew 6:6', book: 'Matthew', chapter: 6, reflection: 'Jesus consistently emphasized the interior life over external performance. He was suspicious of public displays and deeply committed to private devotion. The deepest transformations of this program are the ones no one else can see — the 5am prayers, the quiet moments of surrender, the late night journaling.' }, workout: { workoutId: 'lower-body-power', title: 'Lower Body Power', tip: 'Lower body strength training is unglamorous and hard. It\'s also where the most power is built. Today is about interior work — no music, no distraction. Just you, your body, and the quiet discipline of showing up.', category: 'strength' }, nutrition: { meal: 'Simplicity Day', recipe: 'Simple Baked Chicken with Roasted Broccoli', description: 'Plain baked chicken breast seasoned with salt, pepper, and garlic. Paired with oven-roasted broccoli. No frills — just clean, effective fuel.', macros: { calories: 380, protein: 46, carbs: 18, fat: 12 }, logPrompt: 'Today is a simplicity day — eat clean and plain. Log everything with precision and see how you feel eating without complexity or sauces.' }, journal: { prompt: 'What is happening in your interior life right now that no one else sees? What prayers are you praying in secret? What is God answering in the quiet that you haven\'t told anyone?', reflection: 'The most important things in life happen in private.' }, affirmation: 'My interior life is rich and real. I do the deep work even when no one is watching, and my Father who sees in secret rewards me.' },
        { day: 27, title: 'The Art of Recovery', devotion: { title: 'Be Still and Know', scripture: '"Be still, and know that I am God." — Psalm 46:10', book: 'Psalms', chapter: 46, reflection: 'This verse comes in the middle of a Psalm about the earth giving way and mountains falling into the sea. God\'s instruction in the middle of chaos is not "fight harder." It\'s "be still." Active recovery, Sabbath rest, and contemplative prayer are not breaks from the journey — they are the journey.' }, workout: { workoutId: 'desk-stretch', title: 'Active Recovery & Stretching', tip: 'Recovery is not passive — it\'s active. Foam roll. Walk. Stretch. Sleep 8 hours. These are your assignments today. The best athletes in the world treat recovery as seriously as training.', category: 'flexibility' }, nutrition: { meal: 'Recovery Nutrition', recipe: 'Tart Cherry & Collagen Smoothie', description: 'Tart cherry juice is one of the most research-backed foods for muscle recovery. Blend with collagen peptides, almond milk, and a banana for a powerful recovery drink.', macros: { calories: 300, protein: 20, carbs: 42, fat: 4 }, logPrompt: 'Recovery nutrition matters as much as performance nutrition. Log this drink and track your sleep hours tonight — aim for 7-9.' }, journal: { prompt: 'What do you need to let yourself recover from right now — physically, emotionally, spiritually? What would complete recovery look like for you in each of those areas?', reflection: 'Healing requires rest. Give yourself permission to receive it.' }, affirmation: 'I am still. I know He is God. In the stillness I am restored, renewed, and ready for what comes next.' },
        { day: 28, title: 'The Month Mark', devotion: { title: 'A Living Testimony', scripture: '"They triumphed over him by the blood of the Lamb and by the word of their testimony." — Revelation 12:11', book: 'Revelation', chapter: 12, reflection: 'Your testimony is powerful. Not just the dramatic version — the 28-day version. The daily discipline, the meals logged, the journal filled, the Scripture read. That is a testimony of faithfulness. Write it. Share it. It will strengthen you and encourage someone else.' }, workout: { workoutId: 'full-body-circuit', title: 'Full Body Circuit (Month Benchmark)', tip: 'One month in. Do your benchmark workout and compare your performance to Day 1. Log every rep, every time, every weight. Concrete evidence of growth is a powerful motivator.', category: 'full_body' }, nutrition: { meal: 'Month 1 Review', recipe: 'Build-Your-Own Grain Bowl', description: 'Choose: farro, quinoa, or brown rice base. Add: grilled protein of choice. Top with: seasonal roasted vegetables, a healthy fat, and a dressing made with olive oil and lemon. Make it yours.', macros: { calories: 480, protein: 36, carbs: 52, fat: 16 }, logPrompt: 'Month review: go to your food log history and review your most frequent meals, average protein, and calorie consistency. Adjust for month 2.' }, journal: { prompt: 'Write your 28-day testimony. Include: where you started, what was hard, what surprised you, what changed, and what you now believe about yourself that you didn\'t on Day 1.', reflection: 'You have a testimony. It matters. Don\'t keep it to yourself.' }, affirmation: 'One month of faithfulness. My testimony is real, powerful, and only getting better. I carry it forward with gratitude and momentum.' },
      ],
    },
    // ─────────────────────────────────────────────────────────────────────────
    // WEEKS 5-8 — FLOURISHING: Living the Life
    // (Summarized for brevity — full data structure maintained)
    // ─────────────────────────────────────────────────────────────────────────
    {
      number: 5,
      title: 'Purpose',
      theme: 'Living with Intention',
      overview: 'You\'ve built the foundation, done the healing work, and developed real strength. Now we begin to live from that place — with clarity, intentionality, and an understanding of the unique calling on your life.',
      color: 'from-[#2d6a1e] to-[#C9A227]',
      days: Array.from({ length: 7 }, (_, i) => ({
        day: 29 + i,
        title: ['Called & Equipped', 'Serving From Strength', 'The Long Game', 'Generous Living', 'Finishing Strong', 'Community & Legacy', 'Week 5 Integration'][i],
        devotion: {
          title: ['Your Unique Assignment', 'Poured Out', 'Seeds & Seasons', 'The Generous Life', 'Perseverance', 'Sharpened Together', 'Count the Cost'][i],
          scripture: [
            '"For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future." — Jeremiah 29:11',
            '"I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit." — John 15:5',
            '"Whoever sows sparingly will also reap sparingly, and whoever sows generously will also reap generously." — 2 Corinthians 9:6',
            '"A generous person will prosper; whoever refreshes others will be refreshed." — Proverbs 11:25',
            '"We also glory in our sufferings, because we know that suffering produces perseverance; perseverance, character; and character, hope." — Romans 5:3-4',
            '"Two are better than one, because they have a good return for their labor." — Ecclesiastes 4:9',
            '"Suppose one of you wants to build a tower. Won\'t you first sit down and estimate the cost to see if you have enough money to complete it?" — Luke 14:28',
          ][i],
          book: ['Jeremiah', 'John', '2 Corinthians', 'Proverbs', 'Romans', 'Ecclesiastes', 'Luke'][i],
          chapter: [29, 15, 9, 11, 5, 4, 14][i],
          reflection: 'Week 5 deepens your understanding of purpose, service, and the intentional life you are building.',
        },
        workout: {
          workoutId: ['bodyweight-master', 'tabata-intense', 'strength-circuit', 'athlete-conditioning', 'hiit-30', 'cardio-blast', 'power-yoga'][i],
          title: ['Bodyweight Mastery', 'Tabata Intense', 'Total Strength Circuit', 'Athletic Conditioning', '30-Min HIIT', 'Cardio Blast', 'Power Yoga'][i],
          tip: 'Week 5: you are past the hump. Your body has adapted to consistent movement. Now we push past your previous limits.',
          category: ['strength', 'cardio', 'strength', 'full_body', 'cardio', 'cardio', 'yoga'][i],
        },
        nutrition: {
          meal: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-Workout', 'Post-Workout', 'Week Review'][i],
          recipe: ['Açaí Power Bowl', 'Thai Peanut Noodle Salad', 'Stuffed Portobello Mushrooms', 'Energy Balls: Dates & Oats', 'Rice Cake with Honey & Protein', 'Chocolate Protein Shake', 'Week 5 Favourite Meal'][i],
          description: 'Nutrient-dense, intentionally chosen to fuel purposeful living.',
          macros: { calories: 400 + i * 20, protein: 22 + i * 3, carbs: 45 + i * 5, fat: 14 + i * 1 },
          logPrompt: 'Continue logging every meal. At week 5, most people see their eating patterns normalize — celebrate that.',
        },
        journal: {
          prompt: ['What would you do with your life if you knew you could not fail?', 'Who are you serving right now, and what does it cost you?', 'What seeds are you planting today that you hope to harvest in 5 years?', 'What would generous living look like for you this week?', 'What are you suffering through right now that is building character?', 'Who is your "two are better than one" person?', 'What is the cost of the life you are building, and are you willing to pay it?'][i],
          reflection: 'Week 5 journaling deepens your sense of calling and community.',
        },
        affirmation: ["My plans are held by God's plans, and they are better than I imagined.", 'I bear fruit that lasts because I remain in the Vine.', 'I sow generously into every area of my life and trust the harvest to God.', 'My generosity refreshes others and God refreshes me.', 'My suffering has a purpose. It is producing something eternal in me.', 'I am stronger in community. I invest in my relationships as carefully as my health.', 'I count the cost and I commit. No half-measures. All in.'][i],
      })),
    },
    {
      number: 6,
      title: 'Abundance',
      theme: 'The Overflow Life',
      overview: 'You cannot give what you don\'t have. This week focuses on living from overflow — spiritually, physically, and emotionally — so that your life pours into the people around you.',
      color: 'from-[#C9A227] to-[#C9A227]',
      days: Array.from({ length: 7 }, (_, i) => ({
        day: 36 + i,
        title: ['Overflow', 'The Cup Runs Over', 'Sowing & Reaping', 'Living Well', 'The Body at Its Best', 'Spiritual Overflow', 'Week 6 Integration'][i],
        devotion: {
          title: ['Living Water', 'Goodness & Mercy', 'You Reap What You Sow', 'Life to the Full', 'Temple in Full Operation', 'Rivers of Living Water', 'Overflow Reflection'][i],
          scripture: [
            '"Whoever believes in me, as Scripture has said, rivers of living water will flow from within them." — John 7:38',
            '"Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the LORD forever." — Psalm 23:6',
            '"Do not be deceived: God cannot be mocked. A man reaps what he sows." — Galatians 6:7',
            '"The thief comes only to steal and kill and destroy; I have come that they may have life, and have it to the full." — John 10:10',
            '"Do you not know that your bodies are temples of the Holy Spirit, who is in you, whom you have received from God?" — 1 Corinthians 6:19',
            '"He who believes in Me, as the Scripture said, \'From his innermost being will flow rivers of living water.\'" — John 7:38',
            '"Now to him who is able to do immeasurably more than all we ask or imagine." — Ephesians 3:20',
          ][i],
          book: ['John', 'Psalms', 'Galatians', 'John', '1 Corinthians', 'John', 'Ephesians'][i],
          chapter: [7, 23, 6, 10, 6, 7, 3][i],
          reflection: 'You cannot pour from an empty cup. Week 6 is about the overflow that comes from abiding deeply.',
        },
        workout: {
          workoutId: ['resistance-band', 'strength-circuit', 'athlete-conditioning', 'bodyweight-master', 'tabata-intense', 'power-yoga', 'mobility-flow'][i],
          title: ['Resistance Band Workout', 'Total Strength Circuit', 'Athletic Conditioning', 'Bodyweight Mastery', 'Tabata Intense', 'Power Yoga', 'Mobility Flow'][i],
          tip: 'Week 6: your body is performing at its peak. Notice how different this feels from Week 1. This is what consistency produces.',
          category: ['strength', 'strength', 'full_body', 'strength', 'cardio', 'yoga', 'flexibility'][i],
        },
        nutrition: {
          meal: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-Workout', 'Post-Workout', 'Week Review'][i],
          recipe: ['Smoked Salmon Eggs Benedict (Healthy)', 'Mason Jar Superfood Salad', 'Moroccan Chicken Tagine', 'Protein Cheese & Fruit Plate', 'Dates & Cashew Butter', 'Bone Broth Protein Shake', 'Week 6 Personal Favourite'][i],
          description: 'Abundance-fueled eating: variety, color, and nutrition density.',
          macros: { calories: 420 + i * 15, protein: 28 + i * 2, carbs: 42 + i * 3, fat: 16 + i * 1 },
          logPrompt: 'Week 6: try one new recipe this week. Log it and give it a rating in the app.',
        },
        journal: {
          prompt: ['What does "rivers of living water flowing from within you" look like in your daily life?', 'Name three ways God\'s goodness has followed you this week.', 'What are you reaping right now from seeds planted 6 weeks ago?', 'What does "life to the full" mean to you today, versus on Day 1?', 'Write a thank-you letter to your body for what it has accomplished in 6 weeks.', 'How has your spiritual life changed in 6 weeks? Be specific.', 'What is overflowing in your life right now that you want to share with others?'][i],
          reflection: 'Abundance is not about having more — it\'s about living from a full place.',
        },
        affirmation: ['Rivers of living water flow from within me. I am a source of life to those around me.', "God's goodness and mercy follow me everywhere I go.", 'I reap the harvest of 6 weeks of faithful sowing. Every day counts.', 'I live life to the full — body, soul, and spirit.', 'My body is a temple operating at its best. I am grateful and committed.', 'My spirit is full and overflowing. I share freely from the abundance God provides.', 'Immeasurably more than I asked or imagined — that is what God is doing in me.'][i],
      })),
    },
    {
      number: 7,
      title: 'Legacy',
      theme: 'Living for Something Greater',
      overview: 'You\'re not just building a healthy body — you\'re building a life that will outlast you. This week we lift our eyes to legacy: the impact of a life lived with intentionality, faith, and love.',
      color: 'from-[#C9A227] to-[#c9a227]',
      days: Array.from({ length: 7 }, (_, i) => ({
        day: 43 + i,
        title: ['Living for Legacy', 'Planting Trees', 'The Faithful Servant', 'Investing in Others', 'The Long View', 'What Remains', 'Week 7 Integration'][i],
        devotion: {
          title: ['The Seeds That Outlive You', 'For Those Who Come After', 'Well Done', 'Multiplied Investment', 'The Eternal Weight of Glory', 'Love Never Fails', 'Storing Up Treasure'][i],
          scripture: [
            '"A good person leaves an inheritance for their children\'s children." — Proverbs 13:22',
            '"One generation commends your works to another; they tell of your mighty acts." — Psalm 145:4',
            '"Well done, good and faithful servant! You have been faithful with a few things; I will put you in charge of many things." — Matthew 25:23',
            '"And the things you have heard me say in the presence of many witnesses entrust to reliable people who will also be qualified to teach others." — 2 Timothy 2:2',
            '"For our light and momentary troubles are achieving for us an eternal glory that far outweighs them all." — 2 Corinthians 4:17',
            '"Love never fails." — 1 Corinthians 13:8',
            '"Store up for yourselves treasures in heaven, where moths and vermin do not destroy." — Matthew 6:20',
          ][i],
          book: ['Proverbs', 'Psalms', 'Matthew', '2 Timothy', '2 Corinthians', '1 Corinthians', 'Matthew'][i],
          chapter: [13, 145, 25, 2, 4, 13, 6][i],
          reflection: 'Legacy is the overflow of a life fully lived. What you build in these 8 weeks will ripple outward.',
        },
        workout: {
          workoutId: ['strength-circuit', 'athlete-conditioning', 'hiit-30', 'bodyweight-master', 'tabata-intense', 'cardio-blast', 'power-yoga'][i],
          title: ['Total Strength Circuit', 'Athletic Conditioning', '30-Min HIIT', 'Bodyweight Mastery', 'Tabata Intense', 'Cardio Blast', 'Power Yoga'][i],
          tip: 'Week 7: consider inviting someone into your workout. The best legacy is reproducible.',
          category: ['strength', 'full_body', 'cardio', 'strength', 'cardio', 'cardio', 'yoga'][i],
        },
        nutrition: {
          meal: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-Workout', 'Post-Workout', 'Week Review'][i],
          recipe: ['Legacy Granola Bowl', 'Harvest Grain Salad', 'Sunday Roast Chicken', 'Homemade Trail Mix', 'Fig & Almond Pre-Workout', 'Recovery Collagen Smoothie', 'Week 7 Signature Meal'][i],
          description: 'Food that nourishes for decades — anti-inflammatory, micronutrient-dense, and sustainable.',
          macros: { calories: 440 + i * 10, protein: 30 + i * 2, carbs: 48 + i * 2, fat: 16 + i * 1 },
          logPrompt: 'Legacy eating: identify 5 meals you will keep eating for life. Log them and build your personal recipe library.',
        },
        journal: {
          prompt: ['What legacy are you building? Not just for your family, but for anyone whose life you touch.', 'What wisdom do you want to pass on to the next generation?', 'What would it mean to hear "well done, good and faithful servant" from God?', 'Who in your life can you invest in the way this program has invested in you?', 'What eternal perspective changes how you see your current hardships?', 'Write about one relationship you want to strengthen this week. What one act of love will you choose?', 'What "treasure in heaven" are you storing up through this journey?'][i],
          reflection: 'You are living a story someone else will read.',
        },
        affirmation: ['My life leaves a legacy. Every faithful act plants a seed that will outlive me.', "I plant trees whose shade I may never sit under, and that is an act of love.", "I am a faithful servant. I steward what I've been given with excellence.", 'I multiply what I have received. I invest in others generously.', 'My present suffering is producing an eternal weight of glory beyond all comparison.', 'Love is my legacy. It will be the last thing standing.', 'I store up treasure in heaven with every faithful, loving act.'][i],
      })),
    },
    {
      number: 8,
      title: 'Flourishing',
      theme: 'The Life You Were Made For',
      overview: 'This is it. The final week. Not an ending — a launching. Everything you\'ve built over 56 days becomes the foundation for the rest of your life. This week we celebrate, consolidate, and commission.',
      color: 'from-[#c9a227] to-[#FAD98D]',
      days: [
        { day: 50, title: 'The Final Push', devotion: { title: 'Finish What You Started', scripture: '"Being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus." — Philippians 1:6', book: 'Philippians', chapter: 1, reflection: 'God finishes what He starts. And He started something in you 50 days ago. You are not just "almost done with a program" — you are being completed. The work will continue. But mark today: you showed up.' }, workout: { workoutId: 'strength-circuit', title: 'Total Strength Circuit (Final Challenge)', tip: 'Week 8, Day 1. Set personal records today. Log every weight, every rep. You will look back at this workout someday and be amazed at how far you\'ve come.', category: 'strength' }, nutrition: { meal: 'Champion\'s Breakfast', recipe: 'Smoked Salmon & Avocado Bagel', description: 'Toasted whole grain bagel with cream cheese, smoked salmon, sliced avocado, capers, and red onion. A champion\'s breakfast for a champion\'s final week.', macros: { calories: 520, protein: 36, carbs: 46, fat: 22 }, logPrompt: 'Final week nutrition: eat like the person you have become, not the person you were on Day 1. Log with the confidence of 50 days of discipline.' }, journal: { prompt: 'You have 7 days left. What do you want to make sure you do, say, or feel before this program ends? Write a plan for your final week that honors everything the previous 7 weeks built.', reflection: 'Don\'t coast to the finish. Sprint.' }, affirmation: 'God who started this work in me will carry it to completion. I run hard to the finish line with everything I have.' },
        { day: 51, title: 'Legacy in the Making', devotion: { title: 'Your Story Isn\'t Over', scripture: '"I have fought the good fight, I have finished the race, I have kept the faith." — 2 Timothy 4:7', book: '2 Timothy', chapter: 4, reflection: 'Paul\'s "finished race" was martyrdom — the ultimate completion. Your race has decades to run. But you\'re learning what it means to fight well, finish what you start, and keep faith through every mile. These 8 weeks are practice for the marathon of a life well-lived.' }, workout: { workoutId: 'athlete-conditioning', title: 'Athletic Conditioning', tip: 'You are an athlete now. Not metaphorically — literally. 51 days of consistent training has changed your body, your metabolism, and your identity. Wear it proudly today.', category: 'full_body' }, nutrition: { meal: 'Lunch', recipe: 'Warrior Bowl: Beef & Roasted Vegetables', description: 'Sliced lean sirloin over farro with roasted beets, sweet potato, arugula, pomegranate seeds, and a tahini dressing. A warrior\'s fuel for the final stretch.', macros: { calories: 560, protein: 44, carbs: 52, fat: 18 }, logPrompt: 'Track your final week meals with pride. Compare your daily nutrition averages to Week 1. Celebrate the consistency.' }, journal: { prompt: 'Write the opening paragraph of the next chapter of your life. The chapter that begins the day after this program ends. What does that person look like, live like, and believe?', reflection: 'This is a beginning, not an ending.' }, affirmation: 'I fight the good fight. I run my race. I keep the faith. My story is far from over — it is just getting good.' },
        { day: 52, title: 'The Gratitude Harvest', devotion: { title: 'Every Good Gift', scripture: '"Every good and perfect gift is from above, coming down from the Father of the heavenly lights." — James 1:17', book: 'James', chapter: 1, reflection: 'Take inventory. Your health, your strength, your clarity, your community — every good thing you can name is a gift from the Father. Gratitude is not just an emotion; it\'s the posture of a person who knows who they belong to.' }, workout: { workoutId: 'hiit-30', title: '30-Min HIIT (Gratitude Edition)', tip: 'Dedicate each interval to something you\'re grateful for. 8 intervals, 8 gifts. Go.', category: 'cardio' }, nutrition: { meal: 'Dinner', recipe: 'Harvest Feast: Roasted Squash & Chickpea Stew', description: 'Butternut squash and chickpeas slow-cooked with coconut milk, red curry paste, and kale. Served over basmati rice. A harvest celebration that nourishes deeply.', macros: { calories: 480, protein: 18, carbs: 68, fat: 16 }, logPrompt: 'As you log this meal, write three things you\'re grateful for in your relationship with food that are different from 8 weeks ago.' }, journal: { prompt: 'Write a list of 52 things you\'re grateful for from the past 52 days. One per day. Go.', reflection: 'This exercise will take time. It is worth every minute.' }, affirmation: 'Every good thing in my life is a gift from above. I receive it with open hands and a grateful heart.' },
        { day: 53, title: 'Passing It On', devotion: { title: 'You Are Someone\'s Answer', scripture: '"Praise be to the God and Father of our Lord Jesus Christ, the Father of compassion and the God of all comfort, who comforts us in all our troubles, so that we can comfort those in any trouble with the comfort we ourselves receive from God." — 2 Corinthians 1:3-4', book: '2 Corinthians', chapter: 1, reflection: 'The comfort, strength, healing, and transformation you\'ve received over these 8 weeks — you received it so you could pass it on. Your journey is now your message. Someone is waiting to hear it.' }, workout: { workoutId: 'beginner-full-body', title: 'Beginner Full Body (Pay It Forward)', tip: 'Do this beginner workout with someone new — a friend, a family member, a colleague who\'s been watching your transformation. Be their Day 1. Be the reason they start.', category: 'full_body' }, nutrition: { meal: 'Shared Meal', recipe: 'Feed Someone Else: Batch Cook Comfort Soup', description: 'A large pot of vegetable and chicken minestrone — simple, nourishing, and made for sharing. Cook for two, four, or eight. The act of feeding others is both generous and spiritually rich.', macros: { calories: 340, protein: 24, carbs: 38, fat: 10 }, logPrompt: 'Cook for someone else today. Log the act of generosity as well as the meal.' }, journal: { prompt: 'Who needs to hear your story? Write the name of one person you will share your transformation journey with this week — and write what you will say to them.', reflection: 'Your mess is your message. Your test is your testimony.' }, affirmation: 'I am someone\'s answer. The transformation I\'ve received is a gift I give away. My story is not mine alone.' },
        { day: 54, title: 'Body, Soul & Spirit Aligned', devotion: { title: 'Wholly Holy', scripture: '"May God himself, the God of peace, sanctify you through and through. May your whole spirit, soul and body be kept blameless at the coming of our Lord Jesus Christ." — 1 Thessalonians 5:23', book: '1 Thessalonians', chapter: 5, reflection: 'Sanctification is not just spiritual — it is whole-person. Spirit, soul, and body. You have spent 54 days attending to all three, and they are becoming more aligned. This is what wholeness feels like.' }, workout: { workoutId: 'power-yoga', title: 'Power Yoga (Full Integration)', tip: 'Today\'s yoga is your integration practice. As you move, breathe, and hold, notice how your body, soul, and spirit work together. This is what they were designed to do.', category: 'yoga' }, nutrition: { meal: 'Aligned Eating', recipe: 'Mediterranean Whole Plate', description: 'Grilled chicken, tabbouleh, hummus, pita, olives, and cucumber. The Mediterranean diet has the most research supporting longevity and whole-body health. This is how the world\'s healthiest people eat.', macros: { calories: 520, protein: 40, carbs: 48, fat: 20 }, logPrompt: 'Research "Mediterranean diet longevity." Log this meal and read one article on whole-person nutrition.' }, journal: { prompt: 'In what ways are your body, soul, and spirit more aligned now than they were on Day 1? Where is there still dissonance? What is your plan for continuing the integration after this program ends?', reflection: 'Wholeness is a direction, not a destination.' }, affirmation: 'My spirit, soul, and body are aligning in Christ. I am becoming wholly holy — and I will not stop here.' },
        { day: 55, title: 'Preparing the Launch', devotion: { title: 'Sent Ones', scripture: '"As the Father has sent me, I am sending you." — John 20:21', book: 'John', chapter: 20, reflection: 'Jesus spoke these words to His disciples after the resurrection. You have spent 55 days preparing. Tomorrow is your Day 56 — your "as the Father has sent me, I am sending you" moment. You go out different from how you came in. You are sent.' }, workout: { workoutId: 'bodyweight-master', title: 'Bodyweight Mastery (Pre-Finale)', tip: 'One final challenge workout before tomorrow\'s celebration. Leave everything on the mat. No holdbacks. This is what 55 days of training has prepared you for.', category: 'strength' }, nutrition: { meal: 'Pre-Finale Fuel', recipe: 'Steak & Eggs: The Performance Plate', description: 'Lean sirloin steak with two eggs any style, a side of sautéed spinach, and half an avocado. The classic high-performance meal for someone who is ready.', macros: { calories: 580, protein: 52, carbs: 12, fat: 34 }, logPrompt: 'Final preparation: review 8 weeks of nutrition logs. Write a summary of what worked, what didn\'t, and what you\'ll keep.' }, journal: { prompt: 'You have been sent. Write your personal mission statement — one to three sentences that capture who you are, what you\'re called to do, and how you will live. Carry it with you beyond Day 56.', reflection: 'A mission statement is not a slogan. It is a compass.' }, affirmation: 'I am sent — by the same Father who sent His Son. I go out different. I go out ready. I go out on mission.' },
        { day: 56, title: 'Day 56 — You Did It', devotion: { title: 'The Blessing of the Faithful', scripture: '"Blessed is the one who perseveres under trial because, having stood the test, that person will receive the crown of life that the Lord has promised to those who love him." — James 1:12', book: 'James', chapter: 1, reflection: 'You persevered. 56 days of Scripture, movement, nourishment, reflection, and growth. You stood the test. This is not the crown of life James speaks of — but it is a preview of the character that receives it. Well done. Now go live it.' }, workout: { workoutId: 'athlete-conditioning', title: 'Day 56 Benchmark Workout', tip: 'Your final benchmark. Do the same workout you did on Day 28 or your most challenging session. Compare the numbers. Celebrate the growth. Then never stop.', category: 'full_body' }, nutrition: { meal: 'Celebration Feast', recipe: 'Your Signature Healthy Celebration Meal', description: 'Choose the meal from the past 8 weeks that made you feel the best and tasted the most like thriving. Make it. Share it. Celebrate.', macros: { calories: 500, protein: 40, carbs: 50, fat: 18 }, logPrompt: 'Final log. Take a screenshot of your 8-week nutrition overview. You earned it.' }, journal: { prompt: 'Day 56. Write the story of these 8 weeks. Where you started, what happened, who you became. Then write the first three commitments you are making to yourself for the next 8 weeks. This is not the end — it is the launch.', reflection: 'Your journal is a legacy document. Keep writing.' }, affirmation: 'I am Rooted & Renewed. Body, Soul & Spirit. I did the work, I received the grace, and I carry it forward. This is who I am. This is where I begin.' },
      ],
    },
  ],
};

export default COACHING_PLAN;
