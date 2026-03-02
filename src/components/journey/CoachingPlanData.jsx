// ─────────────────────────────────────────────────────────────────────────────
// PROSPERITY REVIVED — 8-WEEK TRANSFORMATION PLAN
// Body · Mind · Spirit
//
// Each day includes:
//  devotion  → title, verse, reference, book, chapter, body text, prayer
//  workout   → category (matches Workouts page), title, duration, tip
//  nutrition → focus, meal idea, what to log, tip
//  growth    → journal prompt, reflection, habit action, links to app pages
// ─────────────────────────────────────────────────────────────────────────────

export const PLAN_ID = 'prosperity-revived-8week-v1';

const w = (week, theme, subtitle, tagline, color, days) => ({
  week, theme, subtitle, tagline, color, days
});

const day = (d, devotion, workout, nutrition, growth) => ({
  day: d, devotion, workout, nutrition, growth
});

const dev = (title, verse, ref, book, ch, body, prayer) => ({
  title, verse, ref, book, ch, body, prayer
});

const wrk = (title, category, duration, tip) => ({
  title, category, duration, tip
});

const nut = (focus, meal, logTip, tip) => ({
  focus, meal, logTip, tip
});

const grow = (journalPrompt, reflection, habit, appLink, appLabel) => ({
  journalPrompt, reflection, habit, appLink, appLabel
});

// ─────────────────────────────────────────────────────────────────────────────
export const prosperityRevivedPlan = {
  id: PLAN_ID,
  title: 'Prosperity Revived',
  subtitle: '8-Week Body, Mind & Spirit Transformation',
  description: 'A holistic 8-week coaching plan that integrates daily Scripture, purposeful movement, clean nutrition, and personal growth practices to transform every area of your life.',
  totalDays: 56,
  author: 'Prosperity Revived Coaches',
  tags: ['faith', 'fitness', 'nutrition', 'mindset', 'transformation'],
  coverGradient: 'from-[#0A1A2F] via-[#1a3a5c] to-[#c9a227]',
  accentColor: '#c9a227',

  weeks: [

    // ═══════════════════════════════════════════════════════════════════════
    w(1, 'Foundation', 'Knowing Who You Are in Christ', 'Identity shapes everything. Before transformation, know the foundation.', 'from-[#0A1A2F] to-[#1a3a5c]', [

      day(1,
        dev('Made in His Image', 'So God created mankind in his own image, in the image of God he created them; male and female he created them.', 'Genesis 1:27', 'Genesis', 1,
          'Day one begins not with a to-do list, but with a revelation: you are made in the image of Almighty God. Every cell in your body, every thought in your mind, every longing in your heart bears the fingerprint of the Creator. This week we build on that identity. The world will tell you who you are based on your past, your failures, your appearance. Scripture says something radically different. You are a bearer of God\'s image — purposeful, loved, and designed for flourishing.',
          'Father, today I choose to see myself through Your eyes. Remind me, especially when doubt creeps in, that I am made in Your image and that is enough. Amen.'),
        wrk('Foundation Strength: Full Body Reset', 'strength', 30, 'Don\'t worry about the weight today — focus on perfect form. Every rep is an act of stewardship over the body God gave you.'),
        nut('Hydration Foundation', 'Overnight oats with berries + 2 eggs', 'Log breakfast in the food journal. Notice how you feel 2 hours after eating.', 'Start your day with 16oz of water before any food. Your body is 60% water — honor that.'),
        grow('Write down 3 ways you have been shaped by God\'s image that have nothing to do with how you look or what you produce.', 'Identity precedes transformation. Who you believe you are determines every choice you make.', 'Set a daily reminder that says "I am made in His image" for 7am this week.', 'GratitudeJournalPage', 'Open Gratitude Journal')
      ),

      day(2,
        dev('You Are God\'s Masterpiece', 'For we are God\'s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.', 'Ephesians 2:10', 'Ephesians', 2,
          'The word translated "handiwork" in Greek is poiema — it\'s where we get the word "poem." You are not a rough draft. You are not a mistake to be fixed. You are a poem crafted by the most creative Being in the universe, written with intentionality and beauty. The good works ahead of you were prepared before you were born. This isn\'t pressure — it\'s invitation. You don\'t need to manufacture purpose. You were built for it.',
          'Lord, help me walk in the purpose You wrote for me before the foundation of the world. Open my eyes to the good works set before me today. Amen.'),
        wrk('Cardio Awakening: 20-Minute Walk or Jog', 'cardio', 20, 'Walk or jog and spend the time in prayer or listening to worship music. Movement and worship together is a powerful spiritual practice.'),
        nut('Protein Foundation', 'Grilled chicken salad with olive oil + avocado', 'Log your lunch. Aim for 30g of protein at this meal.', 'Protein isn\'t just for building muscle — it stabilizes blood sugar and keeps your mood even. Honor God\'s design.'),
        grow('What "good works" feel most aligned with who you were designed to be? List 3 things you do that make you feel most alive.', 'Purpose isn\'t found, it\'s revealed — one faithful step at a time.', 'Write one sentence about your purpose and keep it visible today.', 'PersonalGrowth', 'Open Personal Growth')
      ),

      day(3,
        dev('Rest as Worship', 'By the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work.', 'Genesis 2:2', 'Genesis', 2,
          'Rest is not laziness — it is obedience. God modeled it before He commanded it. In our productivity-obsessed culture, rest feels like falling behind. But rest is actually a form of trust: I don\'t have to manufacture every outcome. I can stop, reflect, and let God work. This week, your active rest day is a gift. Take a longer meditation. Spend time in Psalms. Let your body recover so it can perform at its best tomorrow.',
          'God, teach me to rest in You, not just in sleep. Help me receive rest as worship, not weakness. Amen.'),
        wrk('Active Recovery: Flexibility & Mobility Flow', 'flexibility', 25, 'Foam roll your legs, hips, and back. Move slowly and breathe deeply. This is not wasted time — it\'s what allows your next workout to be better.'),
        nut('Anti-Inflammatory Focus', 'Salmon + roasted sweet potato + steamed broccoli', 'Log dinner and note your energy levels 30 minutes after eating.', 'Anti-inflammatory foods (salmon, sweet potato, leafy greens) help your body recover faster. Eat for restoration.'),
        grow('What does "resting in God" actually look like for you? What makes it hard?', 'Rest is not the absence of activity — it is the presence of trust.', 'Take a 10-minute technology-free rest period after lunch today.', 'GuidedMeditationsPage', 'Open Guided Meditations')
      ),

      day(4,
        dev('Fear Not — You Are Known', 'But now, this is what the Lord says — he who created you, Jacob, he who formed you, Israel: Do not fear, for I have redeemed you; I have summoned you by name; you are mine.', 'Isaiah 43:1', 'Isaiah', 43,
          'God doesn\'t say "fear not because nothing bad will happen." He says "fear not because you are Mine." The antidote to fear is not certainty about the future — it is certainty about the relationship. You are known by name. You were redeemed. You belong to the God of the universe. When this week gets hard (and it will), return here. Not to willpower. Not to motivation. Return to the one who called you by name.',
          'Father, when fear rises, remind me that I am known, redeemed, and Yours. That is more than enough. Amen.'),
        wrk('Upper Body Strength: Push & Pull', 'strength', 35, 'Today\'s workout mirrors the balance in our walk with God — push past your comfort zone, but also learn to receive strength from above. Focus on full range of motion.'),
        nut('Blood Sugar Balance', 'Turkey wrap with spinach, tomatoes, and hummus + side of fruit', 'Log your meal and note any cravings between meals — this tells you if your blood sugar is stable.', 'Eating balanced meals with protein + fiber + healthy fat every 3-4 hours keeps cortisol (stress hormone) lower.'),
        grow('Write about a fear that has been holding you back. Then write the truth from Scripture that directly confronts it.', 'Fear is not the opposite of faith — it is the invitation to exercise faith.', 'When fear arises today, say aloud: "I am known, redeemed, and His."', 'AffirmationsPage', 'Open Affirmations')
      ),

      day(5,
        dev('Your Body is a Temple', 'Do you not know that your bodies are temples of the Holy Spirit, who is in you, whom you have received from God? You are not your own; you were bought at a price. Therefore honor God with your bodies.', '1 Corinthians 6:19-20', '1 Corinthians', 6,
          'This passage is often misused to shame people about their bodies. But Paul\'s point is radically different: your body is the dwelling place of God Himself. This is cause for wonder, not guilt. The Holy Spirit chose to take up residence inside you. How does that change how you train? How you eat? How you rest? Not from obligation — from reverence. You are stewarding a sacred space.',
          'Holy Spirit, remind me today that my body is Your home. May the way I treat it be an act of worship to You. Amen.'),
        wrk('Lower Body Power: Legs & Glutes', 'strength', 40, 'Your legs are your foundation — just like your faith. Strong legs carry you further. Train with intention today, remembering that every squat and lunge honors the One who gave you this body.'),
        nut('Wholesome Carbs for Energy', 'Quinoa bowl with roasted vegetables, chickpeas, and tahini dressing', 'Log your meal. Focus on how complex carbs fuel your workout performance differently than processed ones.', 'Your muscles run on glycogen from carbs. Wholesome carbs = sustained energy. Processed carbs = quick crash.'),
        grow('What would it change about how you treat your body if you truly believed the Holy Spirit lives in it? Be specific.', 'The body is not a burden to manage — it is a blessing to steward.', 'After your workout, take 2 minutes to thank God specifically for what your body was able to do today.', 'GratitudeJournalPage', 'Open Journal')
      ),

      day(6,
        dev('Transformed, Not Conformed', 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God\'s will is — his good, pleasing and perfect will.', 'Romans 12:2', 'Romans', 12,
          'Transformation is not willpower — it is the result of renewed thinking. What we consistently think becomes what we consistently do. The world has a script for your body, your food, your success, your worth. Scripture says there\'s a better way: let your mind be transformed. This week we begin identifying the patterns of thought that have kept you stuck, and replacing them with the truth of God\'s word, one day at a time.',
          'Father, identify the thought patterns in me that conform to this world rather than to You. Begin the work of transformation from the inside out. Amen.'),
        wrk('HIIT Cardio Blast: 20 Minutes', 'cardio', 20, 'HIIT is a metaphor for transformation — intense discomfort produces rapid change. Push hard for the work intervals. Rest fully in the recovery. Both matter.'),
        nut('Detox & Cleanse Focus', 'Big green smoothie (spinach, cucumber, celery, lemon, ginger, apple) + boiled eggs', 'Log your breakfast and note your energy level through the morning. Green vegetables support liver function and natural detox.', 'Your body detoxes naturally every night during sleep. Support that process with green vegetables and staying hydrated.'),
        grow('What "patterns of this world" do you most feel pressure to conform to? How does that show up in your fitness, eating, or self-worth?', 'Mind renewal is not a one-time event — it is a daily practice of choosing truth over pattern.', 'Identify one thought pattern you want to renew this week and write a Scripture replacement for it.', 'MindsetResetPage', 'Open Mindset Reset')
      ),

      day(7,
        dev('Week One Reflection: Celebrating the Foundation', 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.', 'Proverbs 3:5-6', 'Proverbs', 3,
          'You made it through week one. Pause before moving forward. Real transformation requires you to look back as much as you look ahead. What shifted this week? What was harder than expected? Where did you feel God showing up? Proverbs 3 is the foundation under every other strategy: trust. Not in your plan, not in your willpower, not in your track record. Trust in Him. From that trust, paths become straight — not easy, but directed.',
          'Lord, thank You for week one. For every moment I showed up even when I didn\'t feel like it. Keep directing my path as I keep trusting You. Amen.'),
        wrk('Active Rest: Nature Walk & Gratitude', 'flexibility', 30, 'Walk outside for 30 minutes. Speak 10 things you are grateful for out loud. This is both active recovery and spiritual practice.'),
        nut('Week One Reflection Meal', 'Your favorite healthy meal from this week — make it again and enjoy it intentionally', 'Review your food log from the week. What patterns do you notice? What one thing will you improve next week?', 'Progress over perfection. If you logged 4 out of 7 days this week, that\'s 4 more than last week.'),
        grow('Write a one-paragraph reflection on Week 1: What surprised you? What was hard? What are you most grateful for? What is one thing you want to carry into Week 2?', 'Every ending is a beginning. Week one is complete. You are not the same person who started it.', 'Share one insight from this week with a friend or in the app community.', 'WeeklyReflectionPage', 'Open Weekly Reflection')
      ),
    ]),

    // ═══════════════════════════════════════════════════════════════════════
    w(2, 'Renewing Your Mind', 'Rewiring Thoughts for Transformation', 'What you think in secret becomes what you live in public.', 'from-[#1a3a5c] to-[#2d5a8e]', [

      day(8,
        dev('As a Man Thinketh', 'For as he thinks in his heart, so is he.', 'Proverbs 23:7', 'Proverbs', 23,
          'Ancient wisdom confirmed by modern neuroscience: your thoughts become your biology. Repeated thought patterns literally reshape the neural pathways in your brain. This isn\'t just motivation — it\'s science. Chronic negative thoughts about your body, your worth, or your future create biological stress responses that work against your health goals. This week we go to war against toxic thinking — not with willpower alone, but with the weapon of Scripture.',
          'Father, search my thoughts. Show me where they are working against Your purposes in me. Renew my mind from the inside out. Amen.'),
        wrk('Mind-Body Connection: Yoga & Breathwork', 'flexibility', 30, 'As you move through each pose, breathe intentionally. Your breath is one of the few bodily functions you can consciously control. Controlling it calms the nervous system and clears the mind.'),
        nut('Brain Food Focus', 'Smoked salmon on whole grain toast + walnuts + blueberries', 'Log your breakfast. Omega-3s (salmon, walnuts) support brain health and mood regulation.', 'What you eat directly affects how you think. Omega-3 fatty acids are literally the building blocks of brain cell membranes.'),
        grow('Write down 5 negative thoughts about yourself or your body that appear most frequently. Don\'t analyze yet — just name them.', 'You cannot change what you refuse to acknowledge. Name the thoughts before you can renew them.', 'Read Philippians 4:8 and use it as a filter for every thought today: "Is this true, noble, right, pure, lovely, admirable?"', 'MindsetResetPage', 'Open Mindset Reset')
      ),

      day(9,
        dev('Take Every Thought Captive', 'We demolish arguments and every pretension that sets itself up against the knowledge of God, and we take captive every thought to make it obedient to Christ.', '2 Corinthians 10:5', '2 Corinthians', 10,
          'Paul uses military language here for a reason. Thought life is warfare. The enemy\'s greatest weapon is not external circumstances — it is getting inside your head. Taking thoughts "captive" means you don\'t just observe your thoughts passively, you actively examine them and choose which ones get to stay. A thought is not you — it is a visitor. You decide if it gets to take up residence. This is the daily practice of mind renewal.',
          'Lord, give me the discernment to recognize toxic thoughts and the courage to take them captive rather than let them run my life. Amen.'),
        wrk('Upper Body Strength: Chest & Back', 'strength', 40, 'Notice what thoughts arise when you hit difficulty during your sets. Take those thoughts captive. Replace "I can\'t" with "I\'m getting stronger every rep."'),
        nut('Mood-Stabilizing Nutrition', 'Lentil soup with turmeric and spinach + whole grain bread', 'Log your lunch. Notice how you feel emotionally 1 hour after eating this type of meal.', 'Lentils provide slow-burning carbs that maintain serotonin production. Turmeric is a powerful anti-inflammatory that supports brain health.'),
        grow('Take the 5 negative thoughts from yesterday and write a Biblical truth directly against each one. This is your "thought replacement" list.', 'Every lie has a truth that dismantles it. Find the truth. Return to it every time the lie appears.', 'Place your thought replacement list somewhere visible — bathroom mirror, phone wallpaper, notebook.', 'AffirmationsPage', 'Open Affirmations')
      ),

      day(10,
        dev('Peace That Guards Your Mind', 'And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.', 'Philippians 4:7', 'Philippians', 4,
          'The word "guard" here is a military term — like a soldier posted at the gate. God\'s peace isn\'t just a feeling, it\'s a protector. When anxiety storms in, peace stands at the door. But notice: peace comes after prayer (verse 6), after gratitude (verse 6), and after fixing our minds on good things (verse 8). Peace is not passive — it is cultivated through intentional spiritual practice. Today\'s guided meditation is your practice.',
          'Father, release Your peace that surpasses understanding over my mind today. Let it stand guard against every anxious thought. Amen.'),
        wrk('Active Recovery: 30-Minute Guided Meditation Walk', 'flexibility', 30, 'Walk at a gentle pace and listen to a guided meditation from the app. Movement + mindfulness is one of the most effective stress-reduction combinations available.'),
        nut('Stress-Reducing Foods', 'Dark chocolate (70%+) + almonds + chamomile tea for snack; salmon dinner', 'Log your snack and dinner. Notice how your appetite changes with stress vs. peace.', 'Magnesium (found in dark chocolate, almonds, leafy greens) is depleted by stress and is essential for calm nervous system function.'),
        grow('Write about the last time you experienced real peace — not the absence of problems, but genuine peace in the middle of them. What was different about that time?', 'Peace is not the absence of chaos. It is the presence of God in the middle of it.', 'Open the Guided Meditations section and complete one full session today.', 'GuidedMeditationsPage', 'Open Guided Meditations')
      ),

      day(11,
        dev('Renewing Through the Word', 'Your word is a lamp for my feet, a light on my path.', 'Psalm 119:105', 'Psalms', 119,
          'Psalm 119 is the longest chapter in the Bible — 176 verses about one topic: the power of God\'s Word. The psalmist is not describing a religious obligation. He is describing a love affair. The Word illuminates the next step when you can\'t see the whole path. You don\'t need a 20-year plan — you need the next step lit up. Read the Word not to master it, but to be mastered by it.',
          'Lord, as I read Your Word today, let it illuminate my next step with clarity. Make it a lamp, not just a lamp I know about. Amen.'),
        wrk('Lower Body Strength: Squat & Hip Hinge Focus', 'strength', 40, 'Strong lower body = strong foundation. As you squat today, imagine you are lowering into His strength and rising in His power. Let the movement be intentional.'),
        nut('Fiber & Gut Health', 'Big salad with dark leafy greens, chickpeas, seeds, and apple cider vinegar dressing', 'Log your meal. Your gut is your second brain — 90% of serotonin is produced in the gut, not the head.', 'A healthy gut microbiome improves mood, reduces anxiety, and supports mental clarity. Feed your good bacteria with fiber-rich vegetables.'),
        grow('Set a 5-day Bible reading streak goal. Open the Bible page and start a reading plan that aligns with where you are in life right now.', 'Five minutes in the Word daily does more for mind renewal than an hour of motivational content.', 'Open the Bible page, choose a reading plan, and read today\'s passage.', 'Plans', 'Open Reading Plans')
      ),

      day(12,
        dev('Confidence From God\'s Strength', 'I can do all this through him who gives me strength.', 'Philippians 4:13', 'Philippians', 4,
          'This verse is often misapplied as "I can do anything I want if I believe hard enough." Paul wrote it from prison, in the context of being content in both abundance and need. The actual meaning: whatever circumstances I face — whether plenty or poverty, success or suffering — I can handle it. Not because I\'m special. Because He strengthens me. This is not hype. This is a confession of dependence on the only strength that doesn\'t run out.',
          'God, I confess that my own strength is not enough. But in You, I can do all the things You have called me to do. Strengthen me today. Amen.'),
        wrk('HIIT: Tabata-Style Circuit', 'cardio', 25, 'Tabata is 20 seconds on, 10 seconds rest. It is supposed to be uncomfortable. When the burn comes, remember: you are building capacity, not just burning calories. He gives you strength for what He calls you to.'),
        nut('Performance Nutrition', 'Pre-workout: banana + almond butter. Post-workout: protein shake + rice cakes', 'Log your pre and post workout nutrition. Timing your nutrition around workouts improves recovery by up to 40%.', 'Carbs before, protein after. Simple. Effective. The body is a machine — fuel it accordingly.'),
        grow('What is one thing you\'ve been telling yourself you "can\'t" do that might actually be possible through Christ\'s strength? Write a plan for one small step toward it this week.', 'You are not capable of everything. You are capable of everything He assigns to you.', 'Write "I can do all things through Christ" somewhere you\'ll see it during your hardest moment today.', 'HabitBuilderPage', 'Open Habit Builder')
      ),

      day(13,
        dev('Guard Your Heart\'s Input', 'Above all else, guard your heart, for everything you do flows from it.', 'Proverbs 4:23', 'Proverbs', 4,
          '"Guard your heart" is not about emotional protection — it\'s about input management. In Hebrew, the "heart" is the center of your whole inner life: thoughts, will, emotions. Everything you consume — media, relationships, content, conversations — flows into the heart and then flows out into your life. What are you watching? What are you listening to? Who are you spending time with? Your life output is a direct result of your heart input.',
          'Lord, give me wisdom to guard what enters my heart. Help me be discerning about what I allow to shape my thinking. Amen.'),
        wrk('Core & Stability: Pilates-Inspired Session', 'strength', 35, 'Core strength is the foundation of all movement. A strong core protects your spine and improves every other lift. Today, think about what\'s at your core — your values, your faith, your non-negotiables.'),
        nut('Clean Eating Reset', 'Whole foods day: nothing processed. Eggs, vegetables, fruit, lean protein, nuts, water.', 'Log everything today — even snacks. A "whole foods" day resets your palate and helps you identify hidden junk food habits.', 'When you eat only whole foods for a day, your taste buds recalibrate. Processed food starts to taste artificial. That\'s a good thing.'),
        grow('Do a "media audit." For one hour, track every piece of content you consume. Social media, news, podcasts, conversations. What is it doing to your heart?', 'You become what you consistently consume. Input determines output.', 'Replace 30 minutes of social media today with the Bible app or a personal growth resource.', 'PersonalGrowth', 'Open Personal Growth')
      ),

      day(14,
        dev('Week Two Reflection: The Renewed Mind', 'And do not be conformed to this world, but be transformed by the renewing of your mind, so that you may prove what the will of God is, that which is good and acceptable and perfect.', 'Romans 12:2', 'Romans', 12,
          'Two weeks in. Your mind is the most powerful force in your transformation — not your gym time, not your meal plan. What you consistently think about yourself and your possibility determines everything else. This week you have been doing the hard internal work. Thought replacement. Meditation. Guarding your input. It may not feel dramatic yet, but neural pathways are literally being rewired every time you choose truth over a lie. Keep going.',
          'Father, I thank You for the work happening inside me, even when I can\'t see it. Keep transforming my mind until it looks like Yours. Amen.'),
        wrk('Full Body Circuit: Best of Week 2', 'strength', 45, 'Combine your favorite exercises from this week into one 45-minute circuit. Celebrate what your body can now do that felt hard 14 days ago.'),
        nut('Week Two Celebration Meal', 'Cook a meal you love that is also wholesome — this is the goal: food you love that loves you back.', 'Review 2 weeks of food logs. Identify your biggest win and one area to improve entering Week 3.', 'Two weeks of improved nutrition creates measurable change in energy, sleep quality, and mood. You should be starting to feel it.'),
        grow('Write your Week 2 reflection: How has your thinking changed? What lies are losing power? What truths are getting louder?', 'The renewed mind is not the absence of bad thoughts. It is the habit of replacing them with truth.', 'Share something you have learned this week in the Community section.', 'WeeklyReflectionPage', 'Open Weekly Reflection')
      ),
    ]),

    // ═══════════════════════════════════════════════════════════════════════
    w(3, 'Nourishing the Temple', 'Food as Fuel, Not Comfort', 'You don\'t eat to live — you eat to thrive.', 'from-[#2d5a8e] to-[#4a7c59]', [

      day(15,
        dev('Eat to Honor', 'So whether you eat or drink or whatever you do, do it all for the glory of God.', '1 Corinthians 10:31', '1 Corinthians', 10,
          'Your relationship with food is one of the most powerful areas where faith and daily life intersect. Every meal is an opportunity to honor God or to numb yourself. This doesn\'t mean every meal must be perfect — it means every meal can be intentional. Eating slowly. Tasting food. Being grateful. Choosing nourishment. These are acts of worship wrapped in the ordinary. This week, we take a deep look at not just what you eat, but why.',
          'Lord, transform my relationship with food from comfort and control to gratitude and stewardship. Let every meal be an act of worship. Amen.'),
        wrk('Cardio: 30-Minute Steady State Jog', 'cardio', 30, 'Run at a conversational pace — you should be able to speak in full sentences. This builds your aerobic base, which is the engine behind all other fitness.'),
        nut('Intuitive Eating Intro', 'Choose a meal based on how your body feels, not habit or craving. Pause before eating and ask: am I actually hungry? What does my body need?', 'Before logging your meal, write one sentence about why you chose it. This builds eating awareness.', 'Hunger is a signal, not an emergency. If you eat before true hunger, you are likely eating for emotional rather than physical reasons.'),
        grow('What emotions most often trigger your eating choices? Boredom? Stress? Celebration? Loneliness? Write honestly — no judgment.', 'Emotional awareness around food is the beginning of a healthy relationship with it.', 'Start the habit of pausing for 30 seconds before each meal — ask: "Am I hungry? What does my body need?" Log what you notice.', 'Nutrition', 'Open Nutrition')
      ),

      day(16,
        dev('The Garden Diet', 'Then God said, "I give you every seed-bearing plant on the face of the whole earth and every tree that has fruit with seed in it. They will be yours for food."', 'Genesis 1:29', 'Genesis', 1,
          'Before the fall, before animals were given for food, God\'s original design was plant-based abundance. Every color in the produce section represents different phytonutrients that support different body systems. The rainbow God painted into food is not decorative — it is functional. This week, we eat the rainbow, honoring the original design while enjoying the full provision that came later. Plants first, always.',
          'Creator God, thank You for the abundance and intelligence You put into the food You grew for us. Help me to eat with gratitude and wisdom. Amen.'),
        wrk('Lower Body Strength: Lunges & Step-Ups', 'strength', 40, 'Step-ups mirror our walk with God — one deliberate step at a time, each one building on the last. Don\'t rush the movement. Slow and controlled builds more strength.'),
        nut('Eat the Rainbow', 'Build a plate with at least 5 different colors of whole plant foods: red (tomato), orange (sweet potato), yellow (pepper), green (spinach), purple (beet)', 'Log the colors you ate today. Challenge: can you hit 5 colors at every meal this week?', 'Each color family contains different antioxidants: carotenoids (orange), anthocyanins (purple), chlorophyll (green). More colors = broader protection.'),
        grow('Research one vegetable or fruit you\'ve never eaten. Find a recipe in the Discover section and plan to cook it this week.', 'Food curiosity is a spiritual practice — it keeps us grateful for the variety God created.', 'Open the Discover Recipes section and find one new plant-based recipe to try this week.', 'DiscoverRecipes', 'Discover Recipes')
      ),

      day(17,
        dev('Fasting as Focus', 'When you fast, do not look somber as the hypocrites do, for they disfigure their faces to show others they are fasting. Truly I tell you, they have already received their reward in full. But when you fast, put oil on your head and wash your face, so that it will not be obvious to others that you are fasting.', 'Matthew 6:16-18', 'Matthew', 6,
          'Jesus said "when you fast" — not "if." Biblical fasting was assumed. It is a practice of intentional self-denial for the purpose of spiritual focus. Today, we practice a modified fast: no food until noon. Use the morning hunger not as a crisis but as a prayer signal. Every time your stomach growls, pray. Fasting teaches your body that you are not controlled by appetites — you are led by the Spirit.',
          'Lord, as I fast today, let every feeling of hunger become a prayer. I want You more than I want food. Amen.'),
        wrk('Morning Yoga & Prayer Session', 'flexibility', 25, 'On a fasting morning, gentler movement is appropriate. Yoga and prayer combined is a powerful spiritual and physical practice. Move slow, breathe deep, pray often.'),
        nut('Intermittent Fasting Day', 'No food until noon. Water, black coffee, or herbal tea until then. Break fast with: eggs + vegetables + avocado.', 'Log your break-fast meal. Note your hunger level on a scale of 1-10 when you finally eat. How did fasting affect your clarity this morning?', 'Intermittent fasting (16:8) activates autophagy (cellular cleanup), improves insulin sensitivity, and increases mental clarity. These are biological benefits that align with spiritual disciplines.'),
        grow('What did you notice this morning during your fast? Was it harder or easier than expected? What did you spend the hunger moments doing?', 'Spiritual disciplines are not about merit — they are about creating space for God.', 'Explore the Bible\'s teachings on fasting. Read Matthew 6:16-18 and Isaiah 58:6-7 in the Bible app today.', 'Bible', 'Open Bible')
      ),

      day(18,
        dev('Drink the Living Water', 'Jesus answered, "Everyone who drinks this water will be thirsty again, but whoever drinks the water I give them will never thirst. Indeed, the water I give them will become in them a spring of water welling up to eternal life."', 'John 4:13-14', 'John', 4,
          'Jesus used the most basic physical need — water — to describe the deepest spiritual reality. We are always seeking something to satisfy the thirst in us. Career. Relationships. Achievement. Food. Scrolling. None of it satisfies for long. The Living Water He offers is the only drink that becomes a spring from the inside. And practically: your physical body is 60% water. Chronic dehydration mimics anxiety, fatigue, and brain fog. Hydration is a form of self-care.',
          'Jesus, I am thirsty — for You first, and for the life You promise. Be the spring inside me that never runs dry. Amen.'),
        wrk('Cardio: Swim, Bike, or Row — Cross Train', 'cardio', 35, 'Try a different cardio modality today. Cross-training prevents overuse injury, keeps motivation high, and challenges your cardiovascular system in new ways.'),
        nut('Hydration Challenge', 'Half your bodyweight in ounces of water today. (150lb = 75oz). Add lemon and cucumber to your water for electrolyte support.', 'Log your water intake alongside your food today. Most people dramatically underestimate how much water they actually drink.', 'Signs of dehydration: fatigue, headache, difficulty concentrating, increased appetite, dark urine. Often mistaken for hunger — drink water first.'),
        grow('What "wells" in your life have you been drinking from that always leave you thirsty again? What would it look like to return to the Living Water in that area?', 'Physical and spiritual dehydration have the same symptom: desperate seeking for something that doesn\'t satisfy.', 'Set a reminder to drink 8oz of water every 2 hours today. Make hydration an act of self-awareness.', 'Nutrition', 'Open Food Log')
      ),

      day(19,
        dev('Provision and Contentment', 'And my God will meet all your needs according to the riches of his glory in Christ Jesus.', 'Philippians 4:19', 'Philippians', 4,
          'Scarcity thinking destroys your relationship with food: "I must eat everything on my plate because I might not have enough later." "I deserve this treat because I was good today." "I can\'t afford to eat healthy." These are lies from a poverty mindset, not promises from a God of abundance. He meets all your needs. Including your nutritional ones. This week, practice abundance thinking: there is enough good food. There is enough time. There is enough grace for imperfect eating.',
          'Provider God, replace my scarcity mindset with trust in Your abundance. Help me eat from a place of provision, not fear. Amen.'),
        wrk('Upper Body: Shoulder & Arm Focus', 'strength', 35, 'Strong arms and shoulders help us carry the burdens placed before us and serve those around us. Train with that in mind today.'),
        nut('Meal Prep Day', 'Spend 45 minutes batch cooking for the next 3 days: cook a grain (brown rice or quinoa), roast a batch of vegetables, prepare a protein source.', 'Log what you meal prepped. Planning your nutrition removes the decision fatigue that leads to poor choices when tired or stressed.', 'Meal prep is one of the highest-ROI health habits: 45 minutes of preparation saves hours of poor decisions during the week.'),
        grow('Write about your food "scarcity" stories. What beliefs about food were formed in your childhood or past that still affect your choices today?', 'Food stories shape food choices. Understanding your story is the beginning of rewriting it.', 'Cook one meal from scratch this week that you are proud of. Log it, photograph it, and share it in the community.', 'Community', 'Open Community')
      ),

      day(20,
        dev('Sweet to the Taste', 'How sweet are your words to my taste, sweeter than honey to my mouth!', 'Psalm 119:103', 'Psalms', 119,
          'The psalmist describes Scripture as sweet — as satisfying as food. There is a discipline in learning to find spiritual nourishment genuinely satisfying. Many of us find junk food more appealing than whole food because our palate has been corrupted by years of artificial flavors. Similarly, many find entertainment more appealing than Scripture because our soul\'s palate has been shaped by constant stimulation. Both palates can be retrained. Both cravings can be transformed.',
          'Lord, create in me a genuine hunger for Your Word that is sweeter to me than any temporary pleasure. Renew my appetite. Amen.'),
        wrk('HIIT: Kettlebell or Dumbbell Complex', 'strength', 30, 'A complex is performing multiple exercises back to back without putting the weight down. It\'s uncomfortable and effective — just like spiritual formation.'),
        nut('Sugar Detox Day', 'No added sugar today. Read labels. Sugar hides in pasta sauce, yogurt, salad dressing, and "health" foods.', 'Log your meals and note any sugar withdrawal symptoms: headache, irritability, cravings. These are signs your body was dependent.', 'The average American consumes 77g of added sugar daily (recommended: <25g for women, <36g for men). One "healthy" smoothie from a cafe can have 60g.'),
        grow('What does your soul crave when it is stressed or empty? What are you reaching for when you feel that internal hunger?', 'Your deepest cravings point to your deepest needs. Let them lead you to the Source.', 'When a craving hits today, pause for 60 seconds and ask: "What am I actually hungry for?"', 'EmotionalCheckInPage', 'Emotional Check-In')
      ),

      day(21,
        dev('Week Three: The Grateful Table', 'Give thanks in all circumstances; for this is God\'s will for you in Christ Jesus.', '1 Thessalonians 5:18', '1 Thessalonians', 5,
          'Three weeks of intentional transformation. This week in nutrition, you went deeper than macros and calories — you examined your relationship with food at the root. That is harder than any diet. Gratitude is the final nutrition practice of this week: eating with thanksgiving. Before every meal, a simple pause: "Thank You." Not a performance. Not a ritual. A genuine acknowledgment that this food came from a God who provides.',
          'Thank You, God, for every bite of food I\'ve eaten this week. Thank You for the progress, the awareness, and the grace for the moments that didn\'t go perfectly. Amen.'),
        wrk('Yoga Flow: Grateful Body Practice', 'flexibility', 35, 'Move through each pose thanking God for that part of your body. Your spine that supports you. Your lungs that breathe. Your legs that carry you. This is a prayer in motion.'),
        nut('Week Three Favorite Meal', 'Recreate the best meal you discovered this week and eat it slowly, without screens, in full gratitude.', 'Review your 3-week food journal. Write 3 wins and 1 area to improve. You have data now — use it.', 'Three weeks of nutritional improvement creates measurable change: improved gut bacteria, reduced inflammation, more stable mood and energy.'),
        grow('Write a thank-you letter to your body for everything it does for you every day without your recognition or thanks.', 'Gratitude heals the shame that often drives unhealthy relationships with food and our bodies.', 'Post one thing you are grateful for in the Community section. Let others see your gratitude.', 'WeeklyReflectionPage', 'Open Weekly Reflection')
      ),
    ]),

    // ═══════════════════════════════════════════════════════════════════════
    w(4, 'Strengthening Your Body', 'Training with Purpose and Power', 'Your body is the vehicle for everything God has called you to do. Train it accordingly.', 'from-[#4a7c59] to-[#0A1A2F]', [

      day(22,
        dev('Run With Endurance', 'Therefore, since we are surrounded by such a great cloud of witnesses, let us throw off everything that hinders and the sin that so easily entangles. And let us run with perseverance the race marked out for us.', 'Hebrews 12:1', 'Hebrews', 12,
          'Week four is physical focus week. And what better metaphor than a race? Hebrews 12 gives us the athlete\'s mindset for the spiritual life: identify what hinders. Throw it off. Run with endurance. Not speed — endurance. Anyone can sprint. Champions sustain. This applies to your training: the one who shows up consistently for months beats the one who goes hard for two weeks and burns out. Consistency over intensity. Endurance over explosiveness.',
          'Father, help me throw off everything that hinders my race — physical, mental, and spiritual. Give me the endurance to run the race YOU marked out for me, not someone else\'s. Amen.'),
        wrk('Endurance Run: 30 Minutes at Steady Pace', 'cardio', 30, 'Do not stop. Even if you have to slow to a shuffle, keep moving forward. Finishing matters more than pace. This is endurance training — it pays dividends weeks from now.'),
        nut('Carb Loading for Performance', 'Oatmeal with banana + honey (pre-run); whole grain pasta with marinara and lean ground turkey (post-run dinner)', 'Log your timing around the workout. Eating carbs 1-2 hours before cardio and within 45 minutes after maximizes performance and recovery.', 'Complex carbs are your running fuel. Don\'t fear them on workout days — they are the premium gasoline your engine runs on.'),
        grow('What "hinders" you most in your physical goals? What patterns, habits, or mindsets keep tripping you up? Name them specifically.', 'You cannot outrun what you refuse to name. Identify the hindrance before you can throw it off.', 'Write your fitness goal for this week. Not just "work out more" — specific, measurable: "run 3 times, lift 3 times."', 'HabitBuilderPage', 'Open Habit Builder')
      ),

      day(23,
        dev('Strong in the Lord', 'Finally, be strong in the Lord and in his mighty power. Put on the full armor of God, so that you can take your stand against the devil\'s schemes.', 'Ephesians 6:10-11', 'Ephesians', 6,
          'The very first instruction in the armor of God passage is not about a piece of armor — it is about the source of strength. "Be strong in the Lord." Not in your own determination, not in your gym PR, not in your willpower. In the Lord. This is not passive. It requires action: showing up, putting in the work, being consistent. But the source is not you. When you train today, you are not just building muscle — you are practicing the discipline of accessing strength beyond your own.',
          'Lord, today I will be strong — not in myself, but in You. Help me access Your power in every moment of difficulty. Amen.'),
        wrk('Heavy Strength: Deadlift & Row Day', 'strength', 50, 'Today we go heavy. Pick a challenging weight — not dangerous, but demanding. The back muscles you build today support your posture, protect your spine, and enable you to carry more in life.'),
        nut('Muscle Building Nutrition', 'Pre-workout: rice cakes + peanut butter. Post-workout: protein shake + banana. Dinner: lean beef or chicken + vegetables + rice.', 'Log your protein intake for the day. On heavy lifting days, aim for 0.8-1g of protein per pound of bodyweight.', 'Muscle protein synthesis peaks 2 hours after strength training. That\'s why post-workout protein timing matters. Your muscles are literally hungry — feed them.'),
        grow('Where in your life are you trying to be strong in your own strength rather than God\'s? What would it look like to "put on the full armor" in that area?', 'Physical strength is temporary. Strength rooted in God is the kind that holds up under the actual pressures of life.', 'Set a new personal record goal for one lift. Write it down. Work toward it this week.', 'WorkoutProgress', 'Open Workout Progress')
      ),

      day(24,
        dev('Rest and Recover', 'He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.', 'Psalm 23:2-3', 'Psalms', 23,
          'God doesn\'t just permit rest — He leads us to it. The Shepherd takes His sheep to quiet waters. To green pastures. Not because they have been bad, but because rest is part of the design. Your muscles grow during rest, not during exercise. Sleep is when human growth hormone is released. Recovery is where the gains are made. Skipping rest days is not dedication — it is a form of pride that refuses to acknowledge the body\'s designed need for recovery.',
          'Good Shepherd, lead me to the rest You have prepared for me. Let me receive it without guilt, knowing that You built it into the design. Amen.'),
        wrk('Active Recovery: Foam Rolling + Gentle Stretching', 'flexibility', 20, 'Spend 10 minutes foam rolling and 10 minutes in gentle static stretching. Use this time to pray or listen to worship music. Recovery is sacred.'),
        nut('Anti-Inflammatory Recovery Plate', 'Tart cherry juice (natural anti-inflammatory) + turmeric golden milk + salmon or sardines for dinner', 'Log your recovery nutrition. Tracking what you eat on rest days often reveals compensating overeating after hard training.', 'Tart cherry juice reduces delayed onset muscle soreness by up to 22% in studies. It is one of the most evidence-backed natural recovery tools available.'),
        grow('Do you rest without guilt? Or does rest feel like failure? Write about your relationship with rest and recovery — physically and spiritually.', 'Refusing to rest is often pride disguised as discipline. True strength knows when to stop.', 'Take a full 30-minute rest today with no screens, no productivity. Just be. Notice what comes up.', 'GuidedMeditationsPage', 'Open Meditations')
      ),

      day(25,
        dev('The Discipline of the Body', 'Everyone who competes in the games goes into strict training. They do it to get a crown that will not last, but we do it to get a crown that will last forever.', '1 Corinthians 9:25', '1 Corinthians', 9,
          'Paul wrote this to a church in Corinth — the city that hosted the Isthmian Games, second only to the Olympics in the ancient world. Athletes trained for months in strict discipline. Paul used it as a metaphor for spiritual formation. But let\'s also take it literally: the discipline required to transform your body is real training for the discipline required to transform your character. Every time you choose a workout over the couch, you are building spiritual muscle too.',
          'Lord, make me disciplined — not for my own glory, but for the crown that lasts forever. Let my physical training build spiritual character. Amen.'),
        wrk('Push Day: Chest, Shoulders, Triceps', 'strength', 45, 'Three-to-four exercises per muscle group. Don\'t rush between sets — rest 90 seconds fully. Full rest between sets produces more total volume and better results.'),
        nut('Clean Protein Sources', 'Greek yogurt + berries (breakfast); chicken Caesar salad (lunch); turkey meatballs + zucchini noodles (dinner)', 'Log all three meals. Note how your energy differs on high-protein days versus days where protein is lower.', 'Protein is the most satiating macronutrient. High protein intake reduces overall calorie consumption naturally, improves muscle recovery, and stabilizes blood sugar.'),
        grow('Paul says athletes go into "strict training." What area of your life needs more discipline right now? Not punishment — purposeful structure.', 'Discipline is not deprivation. It is delayed gratification in service of a bigger vision.', 'Add one new fitness habit to your tracker this week that you will maintain through Week 8.', 'HabitBuilderPage', 'Open Habit Builder')
      ),

      day(26,
        dev('Your Strength Comes From Joy', 'Nehemiah said, "Go and enjoy choice food and sweet drinks, and send some to those who have nothing prepared, because this day is holy to our Lord. Do not grieve, for the joy of the Lord is your strength."', 'Nehemiah 8:10', 'Nehemiah', 8,
          'The joy of the Lord is your strength. Not willpower. Not discipline (though these matter). Joy. When you find genuine delight in your spiritual and physical practices, they become self-reinforcing. This is why we do not build a program around guilt or fear. We build around joy. The body responds to joy differently than to stress. Cortisol destroys muscle and stores fat. Joy releases endorphins and growth hormone. Joy is a performance-enhancing substance.',
          'Lord, be my strength today not through grinding willpower but through the joy that only You give. Fill me with it. Amen.'),
        wrk('Joyful Cardio: Dance, Sport, or Group Fitness', 'cardio', 40, 'Do a cardio activity today that you actually enjoy. Not "should" enjoy — genuinely enjoy. Play. Delight. Your body responds to joyful movement differently than obligatory exercise.'),
        nut('Celebrate Wisely: Treat Meal', 'Choose one meal today to eat something you love that you might not eat every day. Eat it slowly, enjoy it completely, don\'t feel guilty.', 'Log your treat meal. The key difference between a treat meal and a cheat meal is that a treat meal is planned and celebrated — not shame-eaten.', 'Rigidly perfect eating 100% of the time is not sustainable and creates binge cycles. A planned treat meal once per week actually improves long-term adherence to healthy eating by 20%.'),
        grow('What physical activities do you genuinely enjoy that could become your primary form of exercise rather than a punishment you endure?', 'Sustainable fitness is built on joy, not obligation. Find what you love and do it consistently.', 'Write a list of 5 physical activities that bring you genuine joy. Incorporate one per week going forward.', 'PersonalGrowth', 'Open Personal Growth')
      ),

      day(27,
        dev('Building Each Other Up', 'Therefore encourage one another and build each other up, just as in fact you are doing.', '1 Thessalonians 5:11', '1 Thessalonians', 5,
          'You were not meant to do this alone. Paul\'s instruction to the church was communal: encourage one another, build each other up. Community is not a nice add-on to transformation — it is part of the design. Accountability, shared suffering, celebration, honest feedback. Today, connect with someone on the same journey. Share a win. Ask for support. Reach out. The race is run faster with fellow runners.',
          'Lord, give me the humility to need others and the generosity to encourage them. Help me be a builder of others\' strength, not just my own. Amen.'),
        wrk('Partner or Group Workout', 'strength', 45, 'Find a workout partner today — in person or virtually. Share today\'s workout in the community section. Invite someone to join. Community accountability increases exercise consistency by 95%.'),
        nut('Cook for Someone Else', 'Make a healthy meal for someone else today — a family member, friend, or neighbor. Nutritious food shared in community is one of the most ancient forms of love.', 'Log what you cooked and who it was for. Serving others through food connects the physical and spiritual in a powerful way.', 'Research consistently shows that social eating — sharing meals with others — improves both physical and mental health outcomes. Eat together.'),
        grow('Who in your life is on a similar journey of transformation? Reach out to them today. Could you be accountability partners for the remainder of this plan?', 'Iron sharpens iron. You need someone who sees your blind spots and loves you enough to name them.', 'Post an encouragement to someone in the Community section of the app today.', 'Community', 'Open Community')
      ),

      day(28,
        dev('Week Four: The Transformed Body', 'For physical training is of some value, but godliness has value for all things, holding promise for both the present life and the life to come.', '1 Timothy 4:8', '1 Timothy', 4,
          'Four weeks completed. Paul acknowledges that physical training has "some value" — he doesn\'t dismiss it. But godliness has value for everything, in this life and the next. The goal of this program was never to simply look different in the mirror. It was to become a person whose body, mind, and spirit are aligned with the life God designed for you. Your body is getting stronger. Your mind is getting sharper. Keep going.',
          'Father, let my physical transformation be an outward sign of the inward transformation You are doing. May my body serve the mission You\'ve given me for decades to come. Amen.'),
        wrk('Week 4 Celebration: Full Body PR Session', 'strength', 55, 'Test yourself. Do a PR (personal record) attempt in one or two movements. Write down your numbers. Four weeks from now, test again. Progress is the best motivator.'),
        nut('Nutrition Week 4 Assessment', 'Prepare a balanced, colorful meal using everything you\'ve learned about anti-inflammatory, high-protein, whole-food eating.', 'Do a full 4-week food journal review. Calculate your average protein intake. Identify the meal patterns that serve you best.', 'Four weeks of consistent nutrition changes gut bacteria composition, reduces chronic inflammation markers, and improves sleep architecture. You are different at a cellular level.'),
        grow('Describe your body at the start of Week 1 vs now. Not just physically — energy, confidence, sleep quality, pain levels, mood. What has changed?', 'The body keeps score. It records every choice. Four weeks of better choices create measurable, real change.', 'Write your Week 4 reflection and update your progress in the app\'s Journey dashboard.', 'WeeklyReflectionPage', 'Open Weekly Reflection')
      ),
    ]),

    // ═══════════════════════════════════════════════════════════════════════
    w(5, 'Deepening Your Faith', 'Going Beyond Surface Religion', 'Transformation requires encounter, not just information.', 'from-[#c9a227] to-[#0A1A2F]', [

      day(29,
        dev('Seek First His Kingdom', 'But seek first his kingdom and his righteousness, and all these things will be given to you as well.', 'Matthew 6:33', 'Matthew', 6,
          'We have spent four weeks building physical and mental foundations. Now we go deeper. The deepest transformation is always spiritual. "Seek first" is a priority statement. Before the food plan. Before the workout. Before the to-do list. Before the plan for how this day will go. Seek the Kingdom. Practically: what does your morning look like? Is God first — truly first? This week, we restructure our days around that one instruction.',
          'Lord, be first today. Not as a religious exercise but as the genuine orientation of my heart. May everything else fall into place from that center. Amen.'),
        wrk('Morning Devotional Workout', 'flexibility', 25, 'Do this workout as soon as you wake up, before looking at your phone. The first hour of the day sets the tone for everything. Move your body and fix your heart before the world demands your attention.'),
        nut('Mindful First Meal', 'Wait until you are truly hungry for your first meal. Sit without screens. Pray before eating. Eat slowly. This is a spiritual practice in a physical act.', 'Log your first meal and the time you ate it. Note your actual hunger level (1-10) when you began eating.', 'Research shows that those who pray before meals eat 15-20% slower and report greater satisfaction. Gratitude affects digestion.'),
        grow('What does "seeking the Kingdom first" actually mean in your daily schedule? Be honest — what tends to be actually first?', 'Priorities are revealed by calendars and bank accounts, not intentions. What does your actual morning routine say about what\'s first?', 'Restructure tomorrow\'s morning: Bible reading and prayer before phone. Even just 10 minutes.', 'Bible', 'Open Bible')
      ),

      day(30,
        dev('Abiding in the Vine', 'I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.', 'John 15:5', 'John', 15,
          'A branch does not strain to produce fruit. It simply stays connected. The effort is in the staying — in abiding. In remaining. In the daily discipline of returning to the Source when distraction pulls you away. This is the entire secret of the Christian life, and the secret of sustainable transformation: stay connected to the Vine. The fruit — physical, mental, spiritual — comes from the connection, not from the striving.',
          'Jesus, I want to abide in You — not just visit occasionally. Teach me what daily connection to You actually looks like in my busy, distracted life. Amen.'),
        wrk('Long Cardio: 45-Minute Endurance Session', 'cardio', 45, 'Use this extended cardio time to practice "abiding." Listen to a sermon, worship music, or Scripture audio. Let the movement be a vehicle for spiritual presence rather than just exercise.'),
        nut('Nourishment Not Performance', 'Today, eat without any fitness goal in mind — simply nourish your body lovingly. Choose foods that are whole and satisfying. No counting, tracking, or calculating.', 'Write three sentences about how your relationship with food has shifted over 30 days. Not results — relationship.', 'The fruit of healthy eating is long-term vitality, not short-term numbers. Eat for the person you are becoming, not the number on the scale.'),
        grow('What practices help you actually stay connected to God throughout a regular day? What pulls you away most effectively?', 'Abiding requires practice — habits and rhythms that keep you tethered to the Source when life pulls hard.', 'Identify your "abiding practices" — morning prayer, midday Scripture, evening gratitude — and make them non-negotiable this week.', 'HabitBuilderPage', 'Open Habit Builder')
      ),

      day(31,
        dev('Prayer as Power', 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.', 'Philippians 4:6', 'Philippians', 4,
          'Paul\'s instruction is almost outrageously simple: in everything — everything — pray instead of worry. The anxiety we feel about our health, our bodies, our progress, our future is God\'s invitation to conversation. Not a sign of failed faith. An invitation. Today\'s practice is simple but transformative: every anxious thought gets converted to prayer. Not eliminated — converted. "I\'m worried about..." becomes "Lord, I bring this to you..."',
          'Father, I bring every anxious thought to You today. Convert my worry to prayer and let Your peace stand guard. Amen.'),
        wrk('Strength: Functional Full Body', 'strength', 40, 'Functional training uses movements you do in real life: carrying, pushing, pulling, squatting. Train for the life you want to live, not just for appearance.'),
        nut('Stress & Cortisol Management Foods', 'Ashwagandha tea + dark chocolate; fermented foods (kimchi, kefir, kombucha); magnesium-rich dinner (dark leafy greens + pumpkin seeds)', 'Log how your food choices shifted during a stressful moment today. Stress eating is one of the most common patterns to interrupt.', 'Cortisol triggers cravings for sugar and fat. Probiotics (fermented foods) reduce cortisol. Food choices are both a response to stress and a tool for managing it.'),
        grow('Practice the "Prayer Conversion" for one hour: every anxious thought gets written down and converted to a prayer. Share one of these prayers in your journal.', 'Anxiety is displaced prayer. The energy is already there — redirect it.', 'Open the Prayer section and log a prayer request for something you have been anxious about.', 'Prayer', 'Open Prayer')
      ),

      day(32,
        dev('Spiritual Hunger', 'Blessed are those who hunger and thirst for righteousness, for they will be filled.', 'Matthew 5:6', 'Matthew', 5,
          'Jesus calls "hungry" people blessed. Not the satisfied. Not the self-sufficient. The hungry. Those who are aware they need something they don\'t have. Spiritual hunger is a gift — it is the awareness that there is more than what you currently have or know of God. Do not despise your spiritual longing. Do not anesthetize it with busyness or entertainment. Let it lead you to the place where every genuine hunger is satisfied.',
          'Lord, increase my hunger for You. Not just satisfaction with You — hunger. Keep the longing alive that drives me deeper. Amen.'),
        wrk('Hill Intervals or Incline Treadmill: 30 Minutes', 'cardio', 30, 'Hills require more from you than flat ground. The resistance is the teacher. Lean into the incline — it is making you stronger than the easy ground ever could.'),
        nut('Satisfy Your Body\'s Genuine Hunger', 'Today, only eat in response to genuine physical hunger (not boredom, emotion, or habit). When hungry, choose protein + fat + fiber first.', 'Note how many times you ate today out of genuine hunger versus habit or emotion. This is important data.', 'Average people eat 35% of their daily calories in response to non-hunger cues (boredom, stress, seeing food). Awareness of this pattern begins to change it.'),
        grow('What are you most hungry for — spiritually? Not what you think you should say. What do you actually long for in your relationship with God?', 'The honest hunger is the starting point for every genuine encounter with God.', 'Spend 15 minutes in silent prayer — no asking, no thanking, just being present with God in that hunger.', 'GuidedMeditationsPage', 'Open Meditations')
      ),

      day(33,
        dev('Encountering God in Worship', 'Yet a time is coming and has now come when the true worshipers will worship the Father in the Spirit and in truth, for they are the kind of worshipers the Father seeks.', 'John 4:23', 'John', 4,
          'Worship is not a genre of music. It is an orientation of your whole life toward God. Your workout can be worship. Your meal preparation can be worship. The way you speak to your body can be worship. The Father is not seeking a style of singing — He is seeking people whose lives are directed toward Him. Today, as you move, eat, and reflect, ask yourself: Is this worship? Is my life pointed toward Him?',
          'Father, I want to be the kind of worshiper You seek — not just on Sunday, but in every moment. Show me how my whole life can be oriented toward You. Amen.'),
        wrk('Worship Workout: Move to Worship Music', 'flexibility', 35, 'Design your own circuit or yoga flow and do it entirely to worship music. Let the lyrics be your prayer and the movement be your response. This is embodied worship.'),
        nut('Gratitude Meal Ritual', 'Create a full "grateful meal" ritual: set the table nicely, no devices, pray specifically over your food, eat slowly and savor every bite.', 'Write about how eating this way feels compared to your normal eating experience. Presence transforms meals.', 'Mindful eating practices reduce calorie intake by 15-20%, improve digestion, increase meal satisfaction, and reduce post-meal guilt. Presence is a nutritional tool.'),
        grow('Design your "daily worship" routine. Not just devotional time — how will your morning workout, meals, and evening look as acts of worship?', 'The life fully surrendered to God is the most powerful transformation available. It changes everything from the inside out.', 'Write your ideal "worship day" schedule. Then try it tomorrow.', 'WeeklyReflectionPage', 'Open Weekly Reflection')
      ),

      day(34,
        dev('His Word Does Not Return Empty', 'So is my word that goes out from my mouth: It will not return to me empty, but will accomplish what I desire and achieve the purpose for which I sent it.', 'Isaiah 55:11', 'Isaiah', 55,
          'Every time you read Scripture, something happens — even when you don\'t feel it. God\'s Word is described as a seed in Matthew 13: it enters, it germinates, it grows at the appointed time. Five weeks of reading Scripture every day has been planting seeds. Some of those seeds will bear fruit this week. Others won\'t be visible for months or years. Trust the process. Keep reading. The Word does its work.',
          'God, thank You that Your Word is doing its work in me even when I can\'t see it. Give me faith to keep reading, keep planting, keep trusting. Amen.'),
        wrk('Strength: Back & Bicep Focus', 'strength', 45, 'Strong backs carry heavy loads. Both physically and metaphorically. The people God calls to do great things have backs that can bear the weight of that calling.'),
        nut('Power Bowl Day', 'Grain bowl with your choice of ingredients: a base (brown rice, quinoa, or farro), a protein, 3+ vegetables, healthy fat (avocado or tahini), and a flavorful sauce.', 'Explore the recipe section and find a power bowl recipe to try. Log every ingredient — tracking whole food meals is satisfying.', 'Grain bowls are nutritionally ideal: complex carbs + protein + vegetables + healthy fat in a single, customizable, satisfying meal.'),
        grow('Read Isaiah 55:10-11. What seeds has this plan been planting in you that you can see beginning to germinate?', 'Transformation is not a straight line. It is seeds planted in darkness, growing invisibly, emerging in season.', 'Open the Bible app and read Isaiah 55 in full. Write one verse that speaks most directly to where you are.', 'Bible', 'Open Bible')
      ),

      day(35,
        dev('Week Five: The Deepened Faith', 'But grow in the grace and knowledge of our Lord and Savior Jesus Christ. To him be glory both now and forever! Amen.', '2 Peter 3:18', '2 Peter', 3,
          'Five weeks. The halfway point. And this week you went to the deepest level — faith itself. Physical and mental transformation without a deepened faith creates a better-looking version of the same person. Faith transformation creates a new person. You are in process. Growing in grace. Growing in the knowledge of Christ. This is not a season — it is the pattern of your whole life from here.',
          'Lord, five weeks in, I can see You working. Thank You for the grace that makes growth possible. Keep me growing in You — now and forever. Amen.'),
        wrk('Week 5 Active Rest: Long Nature Walk & Praise', 'flexibility', 45, 'Walk somewhere beautiful today. Bring earphones with worship music or walk in silence. Praise out loud. Move your body. Rest your effort. This is the Sabbath week five.'),
        nut('Week 5 Reflection Meal', 'Cook or order your healthiest, most satisfying meal of the program so far. Eat it in celebration of five weeks of consistent effort.', 'Review your Week 5 nutrition. Are you eating differently out of genuine desire, or still out of obligation? That internal shift is the goal.', 'Five weeks of consistent nutrition changes your sense of identity: "I am someone who eats well" begins to feel true. That identity shift sustains the behavior.'),
        grow('Write your most honest reflection yet. What has God been doing in you over these 35 days? What are you most grateful for? What are you still resisting?', 'The most transformative question is not "How much have I changed?" but "How much more am I open to changing?"', 'Post a testimony of something God has done in you over these 5 weeks in the Community section.', 'WeeklyReflectionPage', 'Open Weekly Reflection')
      ),
    ]),

    // ═══════════════════════════════════════════════════════════════════════
    w(6, 'Building Holy Habits', 'Making the Good Easy and the Bad Hard', 'Character is what you do when no one is watching. Habits are what you do when you are not thinking.', 'from-[#0A1A2F] to-[#c9a227]', [

      day(36,
        dev('Train Yourself in Godliness', 'Have nothing to do with godless myths and old wives\' tales; rather, train yourself to be godly.', '1 Timothy 4:7', '1 Timothy', 4,
          '"Train yourself" — the Greek word is gumnaze, where we get "gymnasium." Godliness requires training, not just inspiration. You cannot will yourself into godly character any more than you can will yourself into physical fitness. You have to show up, do the reps, and trust the process. Habits are how you train. The environment you design either makes virtue easy or makes it hard. This week, we engineer our environments for transformation.',
          'Lord, I am committed to the training — not just to the inspiration. Help me design my life so that goodness is the easy default, not the hard exception. Amen.'),
        wrk('Habit Stack Workout: Compound Movements', 'strength', 45, 'Today, every movement is a compound (multi-joint) exercise: squat, deadlift, bench press, row. Compounds build more total muscle and burn more calories per movement. Efficiency is a form of stewardship.'),
        nut('Habit Stack Nutrition: Meal Prep Sunday', 'Batch cook for the week: protein source, grain, three vegetables. Portion into containers. Having healthy food ready removes the decision point.', 'Log your meal prep. Calculate: how much time did you spend meal prepping vs. how many meal decisions did it simplify?', 'Having pre-portioned, healthy food ready increases the probability of eating well by 350%. Environment design beats willpower every time.'),
        grow('Do a "habit audit." List your current daily habits — morning to night. Which ones support your transformation? Which ones work against it?', 'Your habits are your automated character. Design them intentionally or they will design themselves accidentally.', 'Identify one "keystone habit" — a habit that, when maintained, triggers other good habits. Make it this week\'s focus.', 'HabitBuilderPage', 'Open Habit Builder')
      ),

      day(37,
        dev('Small Beginnings', 'Who dares despise the day of small things?', 'Zechariah 4:10', 'Zechariah', 4,
          'Transformation happens in increments almost too small to see. One degree of course correction sustained over time changes your entire destination. One push-up instead of none. One page of Scripture instead of nothing. One glass of water before your coffee. Small obediences, compounded daily, create a completely different life five years from now. Do not despise the small. Do the small.',
          'Lord, cure me of my addiction to dramatic beginnings and help me to fall in love with faithful small steps. Amen.'),
        wrk('1% Better Challenge: Beat Last Week\'s Numbers', 'strength', 40, 'Add 5% more weight, one more rep, or one less rest second to last week\'s workout. 1% better every week = 52% better in a year. That\'s the math of compound growth.'),
        nut('1% Better Eating: One Upgrade', 'Identify one food swap this week that is a small but meaningful improvement. White rice → brown rice. Regular pasta → lentil pasta. Vegetable oil → olive oil. Just one.', 'Log your food swap and how it felt. Small upgrades sustained consistently beat dramatic meal overhauls every time.', '1% food upgrades compounded over 52 weeks create a fundamentally different diet. The power is in consistency, not perfection.'),
        grow('What is one small habit you could start today that your future self will be grateful for? Something so small that failing to do it would be embarrassing.', 'Big dreams are built by small habits. Start where you can, not where you wish you were.', 'Start the "2-minute rule" today: if a good habit takes less than 2 minutes to start, do it immediately.', 'HabitBuilderPage', 'Open Habit Builder')
      ),

      day(38,
        dev('The Anchor of Accountability', 'Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up.', 'Ecclesiastes 4:9-10', 'Ecclesiastes', 4,
          'Solomon, the wisest man who ever lived, says this simply: two is better than one. Not because it is spiritually more impressive, but because it is practically more effective. We need people who notice when we fall. Who help us up without judgment. Who do the work alongside us. This is not weakness — it is wisdom. The lone achiever is a myth. Sustainable transformation almost always involves community.',
          'Lord, give me the humility to need others and the grace to be someone worth needing. Connect me with the right people for this season. Amen.'),
        wrk('Accountability Workout: Log & Share', 'strength', 45, 'Complete your workout and share it in the Community section. Post your PR or your completion. Let others celebrate with you and hold you accountable.'),
        nut('Shared Meal This Week', 'Plan to eat at least one meal this week with another person who shares your health values. Cook together or share a restaurant meal with intention.', 'Log the meal and note how social eating affected your enjoyment and your choices. Research shows we eat better in positive social settings.', 'Communal eating activates the parasympathetic nervous system (rest and digest) more effectively than solo eating. Eat with people you love.'),
        grow('Do you have an accountability partner for this plan? If not, reach out to someone today. If yes — check in with them. How are they doing?', 'Accountability is not about reporting failure. It is about sharing the journey so neither of you walks alone.', 'Send an encouraging message to someone in your life who is working on their health. Your encouragement could be the difference today.', 'Community', 'Open Community')
      ),

      day(39,
        dev('Faithful in Little', '"His master replied, Well done, good and faithful servant! You have been faithful with a few things; I will put you in charge of many things. Come and share your master\'s happiness!"', 'Matthew 25:21', 'Matthew', 25,
          'The promotion in Matthew 25 is not based on talent, results, or grand achievement. It is based on faithfulness with what was given. The daily discipline of this program — showing up even on hard days, choosing the better meal even when tired, reading one verse even when you have 10 minutes — this is the faithfulness God rewards. Not with Instagram metrics. With deeper capacity and greater trust.',
          'Master, I want to hear those words: "Well done, faithful servant." Not for my glory, but because Your joy is my deepest reward. Help me be faithful with what You\'ve given me today. Amen.'),
        wrk('Leg Day: Squat Depth & Glute Focus', 'strength', 50, 'Faithfulness in training means showing up for leg day even when you don\'t want to. Legs are foundational. Do not skip them. Your whole body depends on their strength.'),
        nut('Consistency Check', 'Today\'s meal challenge: eat exactly what you planned with no deviations. Consistency for one day practiced repeatedly becomes reliability.', 'Log your planned meals before you eat them (not after). Prospective food logging increases adherence by 40% versus logging after the fact.', 'Plan tomorrow\'s meals tonight. Willpower is highest in the morning and depleted by evening — plan when you are strong.'),
        grow('In what small areas of faithfulness do you most need to grow? Daily Bible reading? Morning workout? Logging your food? Pick one and commit to it for the next 7 days without exception.', 'Faithfulness is not exciting. It is also the only path to greater capacity and deeper trust.', 'Set a 7-day streak goal in the Habit Builder and commit to it. Seven days of faithfulness in one area.', 'HabitBuilderPage', 'Open Habit Builder')
      ),

      day(40,
        dev('Forty Days of Transformation', 'Jesus, full of the Holy Spirit, left the Jordan and was led by the Spirit into the wilderness, where for forty days he was tempted by the devil.', 'Luke 4:1-2', 'Luke', 4,
          'Forty days is a significant number throughout Scripture: Noah\'s flood, Moses on Sinai, Elijah\'s journey, Jesus\' temptation. Forty days represents a period of testing, formation, and preparation for what comes next. Today is Day 40. You have been in a formation period. Whatever has been refined, sharpened, or revealed in these 40 days — that is the work of God preparing you for what He has next.',
          'Lord, 40 days in. I don\'t know everything You are preparing me for, but I trust that this period of formation has been for a purpose. Thank You for every difficult day. Amen.'),
        wrk('Endurance Challenge: Longest Run or Swim Yet', 'cardio', 50, 'Day 40 calls for something challenging. Do your longest cardio session of the program. Forty days of training has prepared you for this. Trust the work.'),
        nut('Milestone Celebration Meal', 'Prepare a special meal that represents the best of what you\'ve learned about nourishing your body over 40 days. Cook with intention and celebrate.', 'Write about how your relationship with food has changed since Day 1. Not the results — the relationship. That is the real transformation.', 'Forty days of changed eating habits has literally altered your gut microbiome, reduced chronic inflammation, and changed your food preferences. You are not the same person who started.'),
        grow('Day 40 journal entry: What has this program revealed about you that you didn\'t know before you started? What has God been doing that you couldn\'t see on Day 1?', 'Formation periods are never wasted. The wilderness shapes what the Promised Land requires.', 'Write a full-page reflection on your first 40 days. Keep it forever.', 'MyJournalEntries', 'Open Journal Entries')
      ),

      day(41,
        dev('The Test of Temptation', 'No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear. But when you are tempted, he will also provide a way out so that you can endure it.', '1 Corinthians 10:13', '1 Corinthians', 10,
          'You will face temptation to quit this plan before it is finished. Temptation to eat the thing that sets you back three days. Temptation to skip a workout when you are tired. Temptation to believe the lies about yourself that you thought you had defeated. Paul says: God will provide a way out. Always. The question is whether you will look for it. The way out is usually obvious — and it requires humility to take it.',
          'Father, show me the way out of every temptation that comes today. Give me eyes to see it and courage to take it. Amen.'),
        wrk('Upper Body Pull Day: Back Width & Depth', 'strength', 45, 'Pull exercises build the muscles of pulling toward yourself — receiving strength, holding on, pulling through. These are metaphors for the spiritual disciplines of this week.'),
        nut('Identify Your Trigger Foods', 'Write down the top 3 foods that consistently lead you off track. What are the circumstances when you eat them? Time of day? Emotional state? Social setting?', 'Log your meals today plus any trigger-food moments. Awareness of triggers is 80% of managing them.', 'Trigger foods are rarely about the food itself. They are about the emotional state that precedes the eating. Manage the state, and the food choice usually follows.'),
        grow('What are your most frequent temptations in this plan? Which ones have you resisted? Which ones have gotten you? What is your "way out" strategy for each?', 'Temptation is not failure. Giving in without looking for the way out is the failure. God always provides an exit.', 'Write three specific "way out" strategies for your three most common temptations.', 'MindsetResetPage', 'Open Mindset Reset')
      ),

      day(42,
        dev('Week Six: Habits as Holiness', 'Whether you eat or drink or whatever you do, do it all for the glory of God.', '1 Corinthians 10:31', '1 Corinthians', 10,
          'Six weeks of daily practice. Six weeks of Bible, workout, nutrition, and growth. The repetition has been the point. Not because repetition is inherently holy, but because sustained practice creates new defaults. Your body now expects movement. Your mind now expects Scripture. Your gut now expects whole foods. Your spirit now expects connection with God. These are not rules anymore. They are becoming who you are.',
          'Lord, thank You for six weeks of grace. For every day I showed up even imperfectly. May these habits continue long after this plan ends. Amen.'),
        wrk('Week 6 Integration: The Best of Everything', 'strength', 55, 'Design your own workout using your 6 favorite exercises from this plan. This is YOUR routine now — not something assigned to you. Own it.'),
        nut('Week 6 Reflection & Forward Planning', 'Identify your 3 highest-impact nutrition habits from this program and write them as non-negotiable practices going forward.', 'Review all 6 weeks of food logs. What patterns define your best weeks? What patterns define your worst? Use this data to plan Week 7.', 'Six weeks of data is meaningful. Most people never track long enough to see their actual patterns. You have that data now.'),
        grow('Write your Week 6 reflection with a focus on habits: which ones are now automatic? Which ones still require effort? What does that tell you?', 'The goal of this plan is to make its habits permanent. Six weeks is almost there.', 'Add your top 3 habits to the Habit Builder with weekly tracking enabled.', 'WeeklyReflectionPage', 'Open Weekly Reflection')
      ),
    ]),

    // ═══════════════════════════════════════════════════════════════════════
    w(7, 'Walking in Purpose', 'Aligning Your Whole Life With God\'s Call', 'You were made for more than personal improvement. You were made for purpose.', 'from-[#D9B878] to-[#0A1A2F]', [

      day(43,
        dev('Created for Good Works', 'For we are God\'s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.', 'Ephesians 2:10', 'Ephesians', 2,
          'Week seven. Seven weeks of building yourself. Now we turn outward. The work God prepared in advance for you is not inside you — it is in the world, through you. Your strengthened body is not the destination — it is the vehicle. Your renewed mind is not the goal — it is the instrument. Your deepened faith is not the product — it is the power. This week asks: What are you being prepared for?',
          'Lord, I have been building the vessel. Now show me the mission. What are the good works You prepared in advance for me? Amen.'),
        wrk('Purpose Cardio: Run or Walk in Your Neighborhood', 'cardio', 35, 'Run or walk through your neighborhood or community and pray for it. Pray for the people in the houses. Pray for the businesses. Pray for the schools. This is purpose-filled cardio.'),
        nut('Cook for Someone in Need', 'Prepare a meal today with extra portions for someone who could use it — a neighbor, an elderly person, a struggling family member, or a meal for a food bank.', 'Log what you prepared and who it was for. Note how preparing food with a purpose beyond yourself changes the experience.', 'Generosity is one of the most powerful mood-elevating activities documented in psychology. It literally changes your neurochemistry. Giving is good medicine.'),
        grow('What is the mission your transformation is preparing you for? Who is it for? How does becoming healthier help you serve others better?', 'Personal transformation is not the destination. It is the preparation for something bigger than yourself.', 'Write a one-paragraph "mission statement" for your life that is bigger than your personal health goals.', 'GrowthPathwaysPage', 'Open Growth Pathways')
      ),

      day(44,
        dev('Light of the World', 'You are the light of the world. A town built on a hill cannot be hidden. Neither do people light a lamp and put it under a bowl. Instead they put it on its stand, and it gives light to everyone in the house.', 'Matthew 5:14-15', 'Matthew', 5,
          'You. Are. The. Light. Of. The. World. Not a light. The light. This is staggering. Jesus says you are to the world what He is: light in darkness. Transformation is not a personal trophy — it is fuel for the light you are meant to be. Every healthier choice, every renewed thought, every deepened faith practice is making your light brighter and extending its reach. Who in your world needs the light you carry?',
          'Jesus, You called me light. Help me not hide it or diminish it. Let my transformed life be clearly visible light to everyone around me. Amen.'),
        wrk('Strength: Compound Full Body — Maximum Effort', 'strength', 55, 'Week seven, near the peak of the program. Push harder than you have pushed. You have built the foundation. This is the harvest of 7 weeks of consistent training.'),
        nut('Share Your Journey Meal', 'Invite someone to eat a healthy meal with you that you have learned to prepare during this program. Be the example.', 'Log the meal and write about the conversation. How did sharing your journey with someone else affect you?', 'Teaching someone else what you have learned about nutrition solidifies your own knowledge by 90%. Teach by example.'),
        grow('Who in your life is watching your transformation and needs to see you complete this? Who would be inspired by your story? Write them a letter — even if you never send it.', 'You are someone\'s evidence that transformation is possible. Whether you know it or not, someone is watching.', 'Post a photo or update in the Community section about your Week 7 journey.', 'Community', 'Open Community')
      ),

      day(45,
        dev('Seek Wisdom for Your Path', 'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.', 'James 1:5', 'James', 1,
          'Transformation requires wisdom, not just information. You have gathered a lot of information in this program. Now the question is: what do you do with it? God promises to give wisdom generously — not stingily, not only to the especially spiritual. To anyone who asks. What decisions do you need wisdom for right now? Career direction? Relationships? Your next health goals? Ask. He gives generously.',
          'God, I need wisdom — not just knowledge — about what to do next. You promised to give it generously. I\'m asking. Amen.'),
        wrk('Yoga & Reflection: Mid-Week Recovery', 'flexibility', 30, 'As you move through this restorative session, ask God for wisdom about each area of your life you are uncertain about. Let the movement be a form of listening.'),
        nut('Nutritional Wisdom: Eat for Your Goals', 'Based on everything you\'ve learned, design tomorrow\'s full meal plan yourself. No template — your plan, based on your goals, your body, and your knowledge.', 'Log your self-designed meal plan. The fact that you can do this reflects 45 days of nutritional education. You know more than you think.', 'Nutritional wisdom is knowing what you need, when you need it, and why. Seven weeks of intentional eating has been building exactly this.'),
        grow('What three decisions do you currently need God\'s wisdom for? Write them as specific prayer requests.', 'Wisdom is not the absence of uncertainty. It is the habit of asking the right One when you are uncertain.', 'Open the Spiritual Insights section and read something that addresses an area where you are seeking wisdom.', 'SpiritualInsights', 'Open Spiritual Insights')
      ),

      day(46,
        dev('The Servant Leader', 'Whoever wants to become great among you must be your servant, and whoever wants to be first must be slave of all. For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.', 'Mark 10:43-45', 'Mark', 10,
          'Jesus turned the world\'s definition of greatness upside down. Greatness is not achieved by accumulating more for yourself. It is achieved through service to others. Your transformed body is meant to serve. Your renewed mind is meant to serve. Your deepened faith is meant to serve. The question is not "How can I be successful?" but "Who can I serve with the strength I am building?"',
          'Jesus, make me a servant. Not despite my ambition, but through it. Help me see greatness through Your eyes. Amen.'),
        wrk('Service Workout: Train with Someone Who Needs It', 'strength', 45, 'Invite someone who is just beginning their fitness journey to work out with you. Your seven weeks of experience makes you exactly the encourager they need.'),
        nut('Nourish Someone\'s Body', 'Research and prepare a meal specifically designed for someone else\'s health needs — a diabetic-friendly meal for a parent, an anti-inflammatory meal for a friend with chronic pain.', 'Log your meal and note how serving someone else\'s health needs affected your own food choices today.', 'Cooking for others with intentionality is one of the most intimate forms of service. Food is love made visible.'),
        grow('Where is God calling you to lead and serve in the next season of your life? What qualities developed in this program equip you for that calling?', 'Leadership is not a position — it is a decision to put others before yourself with the strength God has given you.', 'Write down one specific way you will use your transformation to serve someone else this week.', 'GrowthPathwaysPage', 'Open Growth Pathways')
      ),

      day(47,
        dev('The Fruit of the Spirit in Your Body', 'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.', 'Galatians 5:22-23', 'Galatians', 5,
          'Notice how many of these fruits have direct physical implications. Self-control — with food, with rest, with habits. Peace — that affects your nervous system, your cortisol, your sleep. Joy — a performance-enhancing neurochemical. Kindness — with your body, not just with others. The Spirit\'s fruit is not just spiritual fruit. It is whole-life fruit. Allow the Spirit to produce in you what willpower never can.',
          'Holy Spirit, produce these fruits in every area of my life — including how I treat my body and live in it. I cannot produce them myself. You can. Amen.'),
        wrk('HIIT: Spirit Empowered Interval Training', 'cardio', 30, 'Push hard. Rest fully. Notice the joy, peace, and self-control required. These are Spirit fruits working in a very physical way.'),
        nut('Whole Life Nourishment', 'Today eat as if every meal is a spiritual act: with prayer, without screens, with gratitude, with appropriate portions. Let the Spirit guide your eating.', 'Log your meals and note your emotional state at each eating. Spirit-guided eating looks different from willpower eating.', 'Spirit-guided eating is not a list of rules — it is sensitivity to your body\'s actual needs, gratitude for provision, and freedom from food obsession.'),
        grow('Which of the 9 fruits of the Spirit is most evident in your life now compared to Day 1? Which one needs the most growth?', 'The fruit of the Spirit is not produced by trying harder. It grows when you stay connected to the Vine.', 'Choose one fruit of the Spirit to focus on expressing through your body this week. Write what that looks like practically.', 'IdentityInChristPage', 'Identity in Christ')
      ),

      day(48,
        dev('What Does Your Life Preach?', 'Preach the gospel at all times. Use words if necessary.', 'Attributed to St. Francis of Assisi', 'Matthew', 5,
          'Whether or not this exact quote is from Francis, the truth in it is undeniable. Your life is preaching something. The way you treat your body preaches. The way you handle stress preaches. The way you talk about food preaches. The way you recover from failure preaches. What is your transformed life saying to the people around you? Seven weeks of evidence. What does that evidence say about Who you belong to?',
          'Lord, let my life — my whole life — preach the truth that You are worth knowing. Let the transformation be testimony. Amen.'),
        wrk('Long Endurance: Run, Cycle, or Swim 45+ Minutes', 'cardio', 50, 'Endurance preaches. The person who keeps going when it is hard is preaching something. Finish this session strong.'),
        nut('Write Your Nutrition Testimony', 'Write 3-5 sentences about how your relationship with food has changed over 7 weeks. This is your nutrition testimony — the story of what God did through your eating.', 'Log your meals today with the extra layer of reflection: what is this food doing for the person I am becoming?', 'Your food choices are a visible testimony of your values and priorities. People are watching, even when you don\'t know it.'),
        grow('Write your transformation testimony — the story of what God has done in you over 7 weeks. This is not for performance. It is for your own record.', 'Testimony is not bragging — it is bearing witness to what God has done. It builds faith in you and in others who hear it.', 'Share a part of your testimony in the Community section. Someone needs to hear it.', 'Community', 'Open Community')
      ),

      day(49,
        dev('Week Seven: Eyes On the Finish', 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.', 'Galatians 6:9', 'Galatians', 6,
          'Do not quit. Seven weeks in, the initial motivation is gone. The novelty has worn off. The hard part now is the unsexy consistency of one more day. Galatians 6:9 is your verse for this final stretch: at the proper time, harvest. You are planting still. Keep planting. One more workout. One more clean meal. One more day in the Word. The harvest is closer than it has ever been.',
          'Father, give me the strength to not give up on the last stretch. The harvest is coming. Let me not become weary in the final push. Amen.'),
        wrk('Week 7 Best: Full Body High Volume', 'strength', 60, 'Week 7 peak training day. More volume than any previous week. You have earned this capacity. Use it all.'),
        nut('Seven Week Nutrition Celebration', 'Cook the single best, most nutritious meal you know how to make. Eat it with someone who matters to you.', 'Review 7 weeks of food data. Calculate your longest streak of clean eating. Celebrate that number.', 'Seven weeks of nutritional data is now a personal research project. You understand your body better than 95% of people. Use that knowledge.'),
        grow('Write your Week 7 reflection: What are you most proud of? What do you want to carry forward into Week 8 and beyond?', 'You are seven-eighths of the way. This is where most people quit. You are not most people.', 'Commit to completing every single remaining day. Write it down and sign it like a covenant.', 'WeeklyReflectionPage', 'Open Weekly Reflection')
      ),
    ]),

    // ═══════════════════════════════════════════════════════════════════════
    w(8, 'Living Abundantly', 'The Life You Were Created For', 'You have done the work. Now live from the transformation, not toward it.', 'from-[#c9a227] to-[#D9B878]', [

      day(50,
        dev('The Abundant Life', '"I have come that they may have life, and have it to the full."', 'John 10:10', 'John', 10,
          'This is why you started. Not for abs. Not for a number on a scale. For the full life Jesus promised. Abundant life is not comfort or ease — it is capacity. The capacity to love more fully. To serve more effectively. To endure more faithfully. To enjoy more deeply. You have been building capacity for eight weeks. This final week, live from that place. Not striving toward it. Living from it.',
          'Jesus, I want the full life You came to give. Not the edges of it — the center. Lead me into it and help me live from it. Amen.'),
        wrk('Celebration Workout: Your Favorites All Together', 'strength', 45, 'Final week. Design a workout using only exercises you love. This is not a test — it is a celebration of who you have become.'),
        nut('Abundant Table', 'Create a meal that feels abundant — beautiful, nourishing, generous. Extra servings if hosting others. Food as celebration.', 'Log your final week\'s meals with gratitude. Fifty days of transformed eating. Write one line of gratitude for each.', 'You have built a new nutritional identity. Protect it. The habits you have formed are precious — maintain them beyond this program.'),
        grow('Write about what "abundant life" means to you now vs. what it meant when you started. How has the definition changed?', 'Abundance is not having everything. It is being fully alive in what you have been given.', 'Open John 10:10 in the Bible app and read the full chapter in context. Meditate on what Jesus means by "abundant life."', 'Bible', 'Open Bible')
      ),

      day(51,
        dev('His Mercies Are New Every Morning', 'Because of the Lord\'s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.', 'Lamentations 3:22-23', 'Lamentations', 3,
          'Every day of this program, His mercies were new. The days you skipped a workout — new mercy. The nights you ate poorly — new mercy. The mornings you didn\'t read your devotion — new mercy. Lamentations was written in the middle of catastrophic failure. The temple destroyed, Jerusalem in ruins, the nation exiled. And in the middle of it: "His compassions never fail. They are new every morning." Grace is not a starting platform. It is a daily provision.',
          'Lord, thank You for Your faithfulness when I was not faithful. For the new mercy that met me every morning. You are great. Amen.'),
        wrk('Long Cardio: Sunrise Run', 'cardio', 40, 'Wake up early and run as the sun rises. Let it be a physical picture of His mercies being new every morning. The run is the prayer.'),
        nut('Breakfast as Thanksgiving', 'Make your single best, most loved healthy breakfast. Eat it slowly, in silence, with genuine gratitude. This is the final nutrition spiritual practice.', 'Log your breakfast with a one-sentence prayer of gratitude. Fifty-one days of eating for your transformation.', 'The practice of eating breakfast with gratitude changes the neurochemical environment in which digestion happens. Gratitude is a nutritional tool.'),
        grow('Write a gratitude letter to yourself for showing up for 51 days. List every single thing you are grateful for from this experience.', 'Gratitude is not the easy emotion — it is the most transformative one. It can be practiced in the ruins.', 'Post the most meaningful moment from this program in the Community section. Inspire someone who is still in the middle.', 'GratitudeJournalPage', 'Open Gratitude Journal')
      ),

      day(52,
        dev('The Altar of Daily Offering', 'Therefore, I urge you, brothers and sisters, in view of God\'s mercy, to offer your bodies as a living sacrifice, holy and pleasing to God — this is your true and proper worship.', 'Romans 12:1', 'Romans', 12,
          'We return where we began — with the body as worship. Eight weeks ago, this might have sounded abstract. After 52 days, you know exactly what it looks like. It looks like showing up at 5am. It looks like choosing the salmon over the fries. It looks like the journal entry when you would rather scroll. It looks like the prayer when you would rather worry. Offer your body as a living sacrifice. This is your proper worship. This is your life.',
          'Father, I offer my body to You — again — as a living sacrifice. All that I have built over these 52 days, I lay on the altar. Use it for Your glory. Amen.'),
        wrk('Strength: Full Body Gratitude Circuit', 'strength', 50, 'For each exercise, speak one thing aloud that you are grateful for from this program. Ten exercises, ten gratitudes. This is your closing act of physical worship.'),
        nut('Your Signature Healthy Meal', 'Cook the meal that best represents who you have become over 52 days — the meal that is now "your" meal. The one that nourishes and satisfies.', 'Log your signature meal and write its "story" — where did you learn to make it? What does it represent?', 'A "signature healthy meal" represents identity: I am someone who eats this way. Identity-based habits are the most durable.'),
        grow('Write a letter to the person you were on Day 1. What do they need to know? What are you going to tell them?', 'The distance between Day 1 and Day 52 is measured not in pounds or miles. It is measured in who you have become.', 'Read your Day 1 journal entry and your Day 52 letter side by side. Witness your transformation.', 'MyJournalEntries', 'Open Journal Entries')
      ),

      day(53,
        dev('The Peace of Completion', 'I have fought the good fight, I have finished the race, I have kept the faith.', '2 Timothy 4:7', '2 Timothy', 4,
          'Paul wrote this from prison, facing execution. "I have finished the race." Three simple declarations. Not "I won" — I finished. Not "I was perfect" — I kept the faith. The standard God holds us to is not perfection. It is faithfulness. Finishing. Showing up. Keeping the faith even on the days it was hard. This is almost your finish line. Keep going. You will be able to say these words.',
          'Father, like Paul, I want to be able to say these words with confidence: I fought. I finished. I kept the faith. Give me the grace to be faithful to the end. Amen.'),
        wrk('Rest & Gratitude Walk: No Agenda', 'flexibility', 30, 'Walk for 30 minutes with no destination and no fitness goal. Just walk in gratitude and prayer. Rest before the final push.'),
        nut('Pre-Finale Nourishment', 'Eat your highest-quality, most carefully prepared meal of the entire program today. Fuel yourself for the final 3 days.', 'Log your meal and note: who did you have in mind as you prepared it? Your future self? A loved one? God?', 'Preparing food with someone in mind — including yourself — elevates the care and quality of what you make.'),
        grow('What is your single greatest lesson from this 8-week program? Write it in one sentence. Make it specific enough that you would tattoo it on your heart.', 'The most valuable lessons are earned, not taught. You have earned yours.', 'Write that lesson as an affirmation and add it to the Affirmations section of the app.', 'AffirmationsPage', 'Open Affirmations')
      ),

      day(54,
        dev('What God Has Done', 'He who began a good work in you will carry it on to completion until the day of Christ Jesus.', 'Philippians 1:6', 'Philippians', 1,
          'The God who started this work in you will not abandon it at Day 54. He will carry it to completion. Not the completion of this program — the completion of your whole life in Him. You are a work in progress. A poem still being written. A race still being run. But you are further along than you were on Day 1, and the same God who carried you through these 54 days will carry you through the next season too.',
          'Lord, thank You for starting this work in me. I trust You to finish it. Not just this program — my whole life. Amen.'),
        wrk('Strength: Personal Records Session', 'strength', 55, 'Test your PRs today. Track them. Compare to Day 22 when you last tested. Write the numbers down. They represent transformation in the most measurable way.'),
        nut('Nutritional Legacy Planning', 'Write your "nutritional legacy" — the 5 eating habits you will maintain for the rest of your life regardless of any future program or plan.', 'Log these 5 habits and save them. Review them in 90 days, 6 months, and 1 year from today.', 'Nutritional legacy is not perfection forever — it is non-negotiable fundamentals that you return to always, no matter what season of life you are in.'),
        grow('What is one habit from this program that you want to protect most fiercely going forward? What is your strategy for maintaining it when life gets hard?', 'Post-program maintenance requires strategy, not just intention. Plan for the hard days before they arrive.', 'Open the Habit Builder and set up all your key habits for long-term tracking beyond this 8-week plan.', 'HabitBuilderPage', 'Open Habit Builder')
      ),

      day(55,
        dev('The Legacy of Your Transformation', 'A good person leaves an inheritance for their children\'s children.', 'Proverbs 13:22', 'Proverbs', 13,
          'Your transformation is not just for you. It is for everyone who comes after you. The children who will see a parent who chose health. The friends who will be inspired by your consistency. The community that will be nourished by your service. The future self who will live in the body you are building. Transformation has a legacy. What legacy are you building with these 55 days?',
          'Father, let the work You have done in me extend beyond me — to my family, my community, and the generations that follow. Let my transformation be a gift that keeps giving. Amen.'),
        wrk('Legacy Run: Long, Slow, Grateful', 'cardio', 45, 'Run for 45 minutes and spend each mile thinking about one person your transformation will impact. Pray for them by name as you run.'),
        nut('Cook for the Future: Meal Prep for Week 9', 'Meal prep for next week — you are no longer on the program, but you are still maintaining the habits. Plan your meals for the week after this ends.', 'Log your meal prep. The fact that you are planning for Week 9 while still in Week 8 demonstrates that this is no longer a program. It is your life.', 'Preparing for the week after the program ends is the most important single act you can do to maintain your transformation long-term.'),
        grow('Write a letter to your children, family, or closest friends about what this transformation means for them. How will your changed life change theirs?', 'Your transformation is a gift to everyone in your world. Own the legacy you are building.', 'Share your transformation story one final time in the Community section.', 'Community', 'Open Community')
      ),

      day(56,
        dev('Day 56: Well Done, Good and Faithful', 'His master replied, "Well done, good and faithful servant! You have been faithful with a few things; I will put you in charge of many things. Come and share your master\'s happiness!"', 'Matthew 25:23', 'Matthew', 25,
          'You finished. Fifty-six days. Eight weeks of Scripture, movement, nourishment, and growth. Not because you felt like it every day. Not because it was easy. Because you chose it — day after day. "Well done, good and faithful servant." These are the words your Father is speaking over you today. Not because you were perfect. Because you were faithful. Because you kept going. Because you showed up. Well done.',
          'Father, I have run this race. I have fought this fight. I have kept this faith. Thank You for carrying me. Thank You for every day of grace. Thank You for transforming me from the inside out. Use what You have built. I am Yours. Amen.'),
        wrk('Day 56 Celebration Workout: Make It Your Own', 'strength', 60, 'The final workout of the program. Design it yourself. Make it everything you love. Go as hard as you want. Finish strong. Then celebrate.'),
        nut('Day 56 Feast', 'Celebrate with the single most special, most beautiful, most nourishing meal of the entire program. This is not a cheat meal. This is a feast.', 'Log your final meal of the program with a reflection: what does food mean to you now vs. 56 days ago?', 'You have changed your relationship with food. That is worth celebrating with the best meal you know how to make.'),
        grow('Write your final journal entry: Your Day 56 testimony. Who were you on Day 1? Who are you now? What is God calling you to next? This is your beginning, not your ending.', 'Day 56 is not the end of your transformation. It is the beginning of the life your transformation was preparing you for.', 'Open the Weekly Reflection page and write your full 8-week testimony. Then share it with someone who needs it.', 'WeeklyReflectionPage', 'Complete Your 8-Week Reflection')
      ),
    ]),
  ],
};

export default prosperityRevivedPlan;
