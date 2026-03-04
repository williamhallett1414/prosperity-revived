// ─────────────────────────────────────────────────────────────────────────────
// PROSPERITY REVIVED — 8-WEEK COACHING PLANS DATA
// ─────────────────────────────────────────────────────────────────────────────

// Page link helpers used throughout
// App pages: Bible, Workouts, Nutrition, PersonalGrowth, GratitudeJournalPage,
//            WeeklyReflectionPage, GuidedMeditationsPage, HabitBuilderPage,
//            AffirmationsPage, EmotionalCheckInPage, MindsetResetPage,
//            DiscoverRecipes, FoodLogHistory, Prayer

export const COACHING_PLANS = [
  {
    id: 'renew-your-mind',
    title: 'Renew Your Mind, Body & Spirit',
    subtitle: '8-Week Total Transformation',
    description: 'A holistic 8-week journey rooted in Romans 12:2 — "Be transformed by the renewing of your mind." Each week builds on the last, weaving together daily Scripture, purposeful movement, whole-food nourishment, and deep inner work to help you show up as the fullest version of who God created you to be.',
    theme_verse: '"Do not conform to the pattern of this world, but be transformed by the renewing of your mind." — Romans 12:2',
    coach: 'All Coaches',
    difficulty: 'beginner',
    duration_weeks: 8,
    category: 'total_transformation',
    color_from: '#c9a227',
    color_to: '#0A1A2F',
    emoji: '✨',
    tags: ['Faith', 'Fitness', 'Nutrition', 'Mindset', 'Journaling'],
    weeks: [
      // ── WEEK 1 ────────────────────────────────────────────────────────────
      {
        week: 1,
        theme: 'Foundation',
        theme_verse: 'Psalm 18:2 — "The Lord is my rock, my fortress, and my deliverer."',
        overview: 'This week is about laying the groundwork. We\'re not rushing into intense workouts or strict diets — we\'re building a sustainable rhythm. You\'ll establish your morning anchor, begin tracking what you eat, and open the conversation with who God says you are.',
        focus_color: '#D9B878',
        days: [
          {
            day: 1, label: 'Monday',
            theme: 'Identity Reset',
            devotion: {
              title: 'You Are Already Enough',
              scripture: 'Genesis 1:27',
              reading: 'Open to Genesis 1:27 in the Bible. God created you in His image — that\'s not a goal to reach, it\'s a truth to receive. Before any workout, any meal, any achievement — you are made in the image of the living God.',
              reflection: 'Write in your journal: "What lies do I believe about myself that conflict with being made in God\'s image?" Let the answer be honest. You don\'t have to fix them today — just name them.',
              prayer: 'Lord, I receive my identity as Your image-bearer today. Help me see myself the way You see me.',
              app_links: [{ label: 'Open Bible to Genesis 1', page: 'Bible' }, { label: 'Write in Journal', page: 'MyJournalEntries' }]
            },
            workout: {
              title: 'Beginner Full Body',
              workout_id: 'beginner-full-body',
              note: 'This is your baseline. Don\'t push for perfection — just show up. Notice how your body feels. That awareness is the work today.',
              motivational_tip: 'The goal today isn\'t fitness. It\'s faithfulness. Showing up when it\'s new and unfamiliar is one of the bravest things you can do.',
              app_links: [{ label: 'Start Beginner Full Body Workout', page: 'Workouts' }]
            },
            nutrition: {
              focus: 'Food Log Baseline',
              guidance: 'Don\'t change anything about how you eat today. Just log every meal honestly in the food log. No judgment. This is your starting point.',
              recipe: {
                name: 'Overnight Oats with Berries',
                ingredients: ['½ cup rolled oats', '½ cup milk or almond milk', '1 tbsp chia seeds', '1 tsp honey', '¼ cup mixed berries'],
                instructions: 'Combine oats, milk, chia seeds, and honey in a jar. Refrigerate overnight. Top with berries in the morning.',
                macros: 'Approx. 340 cal | 12g protein | 55g carbs | 8g fat',
                why: 'Oats provide steady energy. Chia seeds add omega-3s and fiber. Berries are antioxidant powerhouses. Simple, nourishing, and easy to make the night before.'
              },
              app_links: [{ label: 'Log Your Meals', page: 'Nutrition' }, { label: 'Browse Recipes', page: 'DiscoverRecipes' }]
            },
            reflection: {
              prompt: 'What is one thing you\'re hoping this 8 weeks gives you? Be specific. Not "be healthier" — what specifically would feel different?',
              app_links: [{ label: 'Open Gratitude Journal', page: 'GratitudeJournalPage' }]
            }
          },
          {
            day: 2, label: 'Tuesday',
            theme: 'Movement as Worship',
            devotion: {
              title: 'Your Body Is a Temple',
              scripture: '1 Corinthians 6:19-20',
              reading: 'Read 1 Corinthians 6:19-20. Paul isn\'t giving a fitness lecture — he\'s reframing why we take care of our bodies. This isn\'t about vanity. It\'s about stewardship of something sacred.',
              reflection: 'Journal: "If I treated my body like a temple rather than a tool, what would change first?"',
              prayer: 'God, I want to honor You with how I care for this body You gave me. Help me see movement as an act of worship.',
              app_links: [{ label: 'Open Bible to 1 Corinthians 6', page: 'Bible' }]
            },
            workout: {
              title: 'Active Recovery / Morning Energizer',
              workout_id: 'morning-energizer',
              note: 'Gentle movement. Focus on breath and intention rather than intensity.',
              motivational_tip: 'Rest days aren\'t lazy days — they\'re when your muscles actually rebuild. Movement doesn\'t have to be hard to be holy.',
              app_links: [{ label: 'Start Morning Energizer', page: 'Workouts' }]
            },
            nutrition: {
              focus: 'Hydration Awareness',
              guidance: 'Your goal today: drink 8 glasses of water. Set phone reminders every 2 hours. Most fatigue, cravings, and brain fog are dehydration in disguise.',
              recipe: {
                name: 'Lemon Herb Grilled Chicken Bowl',
                ingredients: ['4 oz chicken breast', '½ cup cooked brown rice', '1 cup mixed greens', '½ lemon (juice)', '1 tsp olive oil', 'salt, pepper, oregano'],
                instructions: 'Season chicken with lemon, oil, salt, pepper, oregano. Grill or pan-fry 6 min each side. Serve over rice and greens.',
                macros: 'Approx. 420 cal | 38g protein | 42g carbs | 9g fat',
                why: 'High-protein meal to support muscle repair after Day 1 workout. Brown rice provides sustained energy without blood sugar spikes.'
              },
              app_links: [{ label: 'Log Meals', page: 'Nutrition' }]
            },
            reflection: {
              prompt: 'How did your body feel during and after yesterday\'s workout? What surprised you?',
              app_links: [{ label: 'Emotional Check-In', page: 'EmotionalCheckInPage' }]
            }
          },
          {
            day: 3, label: 'Wednesday',
            theme: 'Renewing the Mind',
            devotion: {
              title: 'What You Think, You Become',
              scripture: 'Philippians 4:8',
              reading: 'Read Philippians 4:8 slowly. Paul lists 8 things to think about: true, noble, right, pure, lovely, admirable, excellent, praiseworthy. How much of your mental diet today matches this list?',
              reflection: 'Write down 5 thoughts you had before noon today. Rate each one: does it match Philippians 4:8? What patterns do you notice?',
              prayer: 'Lord, guard my mind today. Help me take every thought captive and bring it to You.',
              app_links: [{ label: 'Open Bible to Philippians 4', page: 'Bible' }, { label: 'Mindset Reset', page: 'MindsetResetPage' }]
            },
            workout: {
              title: 'Core Crusher',
              workout_id: 'core-crusher',
              note: 'A strong core isn\'t just about abs — it\'s about stability, posture, and resilience. Same qualities you\'re building spiritually this week.',
              motivational_tip: '"Be strong in the Lord and in His mighty power." — Ephesians 6:10. Let that be your mantra today.',
              app_links: [{ label: 'Start Core Crusher', page: 'Workouts' }]
            },
            nutrition: {
              focus: 'Protein at Every Meal',
              guidance: 'Challenge: include a protein source at every meal today. Protein keeps you full, stabilizes blood sugar, and supports the muscle you\'re building.',
              recipe: {
                name: 'Greek Yogurt Parfait with Walnuts',
                ingredients: ['¾ cup plain Greek yogurt', '2 tbsp walnuts', '1 tbsp honey', '½ cup granola', '¼ cup blueberries'],
                instructions: 'Layer yogurt, granola, blueberries and walnuts. Drizzle honey.',
                macros: 'Approx. 380 cal | 22g protein | 45g carbs | 14g fat',
                why: 'Greek yogurt has 3x the protein of regular yogurt. Walnuts provide brain-healthy omega-3s. Perfect post-workout snack or breakfast.'
              },
              app_links: [{ label: 'Log Meals', page: 'Nutrition' }]
            },
            reflection: {
              prompt: 'What is one negative thought pattern you notice regularly? Where do you think it comes from?',
              app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }]
            }
          },
          {
            day: 4, label: 'Thursday',
            theme: 'Soul Care',
            devotion: {
              title: 'Be Still and Know',
              scripture: 'Psalm 46:10',
              reading: 'Read Psalm 46:10. The command isn\'t just to be still in body — it\'s to be still enough to know God. In our always-on world, stillness is an act of defiance and devotion.',
              reflection: 'Spend 5 minutes in silence before opening your phone today. Just breathe and listen. Journal afterward: what came up in the quiet?',
              prayer: 'God, I come to You in the stillness today. Speak to me.',
              app_links: [{ label: 'Open Bible to Psalms', page: 'Bible' }, { label: 'Guided Meditation', page: 'GuidedMeditationsPage' }]
            },
            workout: {
              title: 'Rest Day / Yoga Flow',
              workout_id: 'yoga-flow',
              note: 'Gentle movement only. This is your soul-care day. Move slowly, breathe deeply.',
              motivational_tip: 'Recovery isn\'t weakness — it\'s wisdom. The strongest athletes in the world prioritize rest. So did Jesus.',
              app_links: [{ label: 'Start Yoga Flow', page: 'Workouts' }]
            },
            nutrition: {
              focus: 'Anti-Inflammatory Eating',
              guidance: 'Today, add at least one anti-inflammatory food: turmeric, ginger, leafy greens, berries, or fatty fish. These foods reduce body-wide inflammation that causes fatigue and brain fog.',
              recipe: {
                name: 'Golden Turmeric Lentil Soup',
                ingredients: ['1 cup red lentils', '1 can coconut milk', '1 tsp turmeric', '1 tsp cumin', '1 clove garlic', '2 cups vegetable broth', 'spinach handful', 'lemon juice'],
                instructions: 'Sauté garlic, add lentils, broth, coconut milk, and spices. Simmer 20 min. Add spinach and lemon juice at end.',
                macros: 'Approx. 390 cal | 18g protein | 52g carbs | 11g fat',
                why: 'Turmeric contains curcumin — one of the most studied anti-inflammatory compounds on earth. Lentils provide iron and slow-burning carbs.'
              },
              app_links: [{ label: 'Browse More Recipes', page: 'DiscoverRecipes' }]
            },
            reflection: {
              prompt: 'What does "soul care" mean to you? What activities genuinely restore you? (Hint: not just relaxing — actually restoring.)',
              app_links: [{ label: 'Guided Meditation', page: 'GuidedMeditationsPage' }]
            }
          },
          {
            day: 5, label: 'Friday',
            theme: 'Gratitude as Fuel',
            devotion: {
              title: 'Thankfulness Changes Everything',
              scripture: '1 Thessalonians 5:18',
              reading: 'Read 1 Thessalonians 5:18: "Give thanks in all circumstances; for this is God\'s will for you in Christ Jesus." Not for all circumstances — in all circumstances. The distinction matters.',
              reflection: 'Name 10 things you\'re grateful for today. Push past the obvious ones. Go specific. "The way the light came through the window this morning."',
              prayer: 'Lord, open my eyes to see Your gifts in the ordinary.',
              app_links: [{ label: 'Open Gratitude Journal', page: 'GratitudeJournalPage' }]
            },
            workout: {
              title: 'Cardio Blast',
              workout_id: 'cardio-blast',
              note: 'Bring energy today — it\'s Friday! Cardio releases endorphins, which naturally elevate mood and reduce stress hormones.',
              motivational_tip: 'You have made it through your first week. That matters. Every rep today is evidence that you\'re someone who follows through.',
              app_links: [{ label: 'Start Cardio Blast', page: 'Workouts' }]
            },
            nutrition: {
              focus: 'Meal Prep Sunday Preview',
              guidance: 'Today, plan Sunday\'s meal prep. Write down 3 breakfasts, 3 lunches, and 3 dinners for next week. Having a plan is the difference between eating intentionally and eating by accident.',
              recipe: {
                name: 'Avocado Toast with Poached Egg',
                ingredients: ['2 slices whole grain bread', '1 ripe avocado', '2 eggs', 'red pepper flakes', 'everything bagel seasoning', 'lemon juice'],
                instructions: 'Toast bread. Mash avocado with lemon, salt. Poach eggs 3 min. Layer and top with seasonings.',
                macros: 'Approx. 450 cal | 20g protein | 38g carbs | 24g fat',
                why: 'Healthy fats from avocado support brain function and hormone health. Eggs provide complete protein — all 9 essential amino acids.'
              },
              app_links: [{ label: 'Log Meals', page: 'Nutrition' }]
            },
            reflection: {
              prompt: 'Look back at your week. What is one thing you did this week that you\'re proud of? Not what you accomplished — what you chose.',
              app_links: [{ label: 'Weekly Reflection', page: 'WeeklyReflectionPage' }]
            }
          },
          {
            day: 6, label: 'Saturday',
            theme: 'Community & Connection',
            devotion: {
              title: 'We Were Made for Community',
              scripture: 'Hebrews 10:24-25',
              reading: 'Read Hebrews 10:24-25. We are not designed to grow alone. This isn\'t just about church attendance — it\'s about intentional sharpening and encouragement.',
              reflection: 'Who in your life knows you\'re on this journey? Who could you invite into accountability with you?',
              prayer: 'God, bring the right people alongside me. Help me be a good friend and a willing one.',
              app_links: [{ label: 'Open Bible to Hebrews', page: 'Bible' }]
            },
            workout: {
              title: 'Lower Body Blast',
              workout_id: 'lower-body-blast',
              note: 'Legs are your largest muscle group. Training them burns the most calories and builds the most functional strength. Go strong today.',
              motivational_tip: '"Two are better than one" — Ecclesiastes 4:9. If you have someone to work out with today, do it.',
              app_links: [{ label: 'Start Lower Body Blast', page: 'Workouts' }]
            },
            nutrition: {
              focus: 'Social Eating Strategies',
              guidance: 'Challenge: eat one meal today with someone you care about. Shared meals are one of the most ancient forms of human connection. Put your phone down and be fully present.',
              recipe: {
                name: 'Sheet Pan Salmon with Roasted Vegetables',
                ingredients: ['6 oz salmon fillet', '1 cup broccoli florets', '1 cup cherry tomatoes', '½ cup bell pepper', '2 tbsp olive oil', 'garlic, herbs, lemon'],
                instructions: 'Toss vegetables in oil, garlic, salt. Roast at 400°F for 15 min. Add salmon, roast 12 more min. Squeeze lemon over everything.',
                macros: 'Approx. 480 cal | 42g protein | 24g carbs | 22g fat',
                why: 'Salmon is one of the richest sources of omega-3 fatty acids, which reduce inflammation, support brain health, and improve mood.'
              },
              app_links: [{ label: 'Log Meals', page: 'Nutrition' }]
            },
            reflection: {
              prompt: 'What does your ideal support system look like for this journey? What\'s missing from it right now?',
              app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }]
            }
          },
          {
            day: 7, label: 'Sunday',
            theme: 'Sabbath & Review',
            devotion: {
              title: 'Rest Is Sacred',
              scripture: 'Genesis 2:2-3',
              reading: 'Read Genesis 2:2-3. God Himself rested. This was the model before the fall, before sin, when everything was perfect — and rest was still built in. What does that tell you about its importance?',
              reflection: 'Week 1 review: What worked? What felt hard? What surprised you? Write honestly — this is data, not judgment.',
              prayer: 'God, thank You for this first week. I rest in You today.',
              app_links: [{ label: 'Weekly Reflection', page: 'WeeklyReflectionPage' }]
            },
            workout: {
              title: 'Full Rest or Bedtime Stretch',
              workout_id: 'bedtime-stretch',
              note: 'Gentle stretching only. Honor your body\'s need for full recovery.',
              motivational_tip: 'You finished Week 1. That is not small. Many people start — very few make it to Day 7. You are already not like most people.',
              app_links: [{ label: 'Bedtime Stretch', page: 'Workouts' }]
            },
            nutrition: {
              focus: 'Meal Prep Day',
              guidance: 'Spend 60-90 minutes today preparing food for the week. Batch cook grains, cut vegetables, portion snacks. People who meal prep eat 30% fewer calories from processed food.',
              recipe: {
                name: 'Batch-Cooked Quinoa & Veggie Bowls',
                ingredients: ['2 cups quinoa', '2 cups mixed roasted vegetables', '1 can chickpeas', '½ cup tahini dressing', 'fresh herbs'],
                instructions: 'Cook quinoa (makes ~6 cups). Roast mixed vegetables 25 min at 425°F. Rinse and roast chickpeas. Store separately. Assemble bowls throughout the week.',
                macros: 'Per bowl: ~430 cal | 18g protein | 58g carbs | 16g fat',
                why: 'Quinoa is a complete protein — rare for a plant food. This batch prep creates 4-5 ready-made lunches, removing the daily decision burden.'
              },
              app_links: [{ label: 'Food Log History', page: 'FoodLogHistory' }]
            },
            reflection: {
              prompt: 'On a scale of 1-10, how would you rate: (1) your faith engagement this week (2) your movement (3) your nutrition (4) your inner work? What does Week 2 need more of?',
              app_links: [{ label: 'Weekly Reflection', page: 'WeeklyReflectionPage' }]
            }
          }
        ]
      },
      // ── WEEK 2 ────────────────────────────────────────────────────────────
      {
        week: 2,
        theme: 'Discipline',
        theme_verse: '1 Corinthians 9:27 — "I strike a blow to my body and make it my slave."',
        overview: 'Week 2 is where we begin to feel the pull between who we want to be and what\'s comfortable. Discipline isn\'t punishment — it\'s the bridge between your goals and your daily choices. This week we\'ll build the habits that will carry you through.',
        focus_color: '#38BDF8',
        days: [
          { day: 8, label: 'Monday', theme: 'The Habit Loop', devotion: { title: 'Small Steps, Big Change', scripture: 'Zechariah 4:10', reading: 'Read Zechariah 4:10 — "Do not despise these small beginnings, for the Lord rejoices to see the work begin." Habits start almost invisibly. Trust the process even when you can\'t see the results yet.', reflection: 'Identify one habit from Week 1 that felt automatic. Now identify one you\'re still fighting. What makes the difference?', prayer: 'God, help me be faithful in the small things this week.', app_links: [{ label: 'Habit Builder', page: 'HabitBuilderPage' }, { label: 'Open Bible', page: 'Bible' }] }, workout: { title: 'Upper Body Strength', workout_id: 'upper-body-strength', note: 'This week we increase intensity slightly. Focus on form before weight.', motivational_tip: 'Discipline is choosing what you want most over what you want right now.', app_links: [{ label: 'Start Upper Body Workout', page: 'Workouts' }] }, nutrition: { focus: 'Eliminate One Processed Food', guidance: 'Identify one processed food you eat regularly and remove it for this week. Replace it with something whole. Small subtraction, big impact.', recipe: { name: 'Spinach & Egg White Scramble', ingredients: ['3 egg whites', '1 whole egg', '1 cup fresh spinach', '¼ cup mushrooms', '1 tbsp olive oil', 'salt, pepper'], instructions: 'Sauté mushrooms and spinach 3 min. Add beaten eggs and scramble gently. Season and serve.', macros: 'Approx. 195 cal | 22g protein | 5g carbs | 9g fat', why: 'High protein, low calorie, loaded with iron from spinach. Perfect for days when you want satiety without heaviness.' }, app_links: [{ label: 'Log Meals', page: 'Nutrition' }] }, reflection: { prompt: 'What is the hardest discipline for you right now — physical, mental, or spiritual? Why do you think that area is the hardest?', app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }] } },
          { day: 9, label: 'Tuesday', theme: 'Renew Your Morning', devotion: { title: 'First Fruits of Your Day', scripture: 'Psalm 5:3', reading: 'Read Psalm 5:3. David\'s morning pattern: lay requests before God and wait expectantly. Your morning sets the emotional tone for everything that follows. How you start matters.', reflection: 'Design your ideal morning ritual for this 8-week journey. What 3 things would you do every morning to set a powerful tone?', prayer: 'Lord, I offer You the first moments of this day.', app_links: [{ label: 'Open Bible to Psalms', page: 'Bible' }, { label: 'Affirmations', page: 'AffirmationsPage' }] }, workout: { title: 'Morning Energizer', workout_id: 'morning-energizer', note: 'Do this one first thing in the morning — before coffee, before your phone.', motivational_tip: 'Win the morning, win the day. This 15 minutes sets a tone that follows you for hours.', app_links: [{ label: 'Start Morning Energizer', page: 'Workouts' }] }, nutrition: { focus: 'Front-Load Your Calories', guidance: 'Challenge: eat your biggest meal before 2pm today. Research shows people who eat more earlier in the day manage weight better, have more energy, and sleep better.', recipe: { name: 'Power Breakfast Burrito', ingredients: ['2 eggs', '¼ cup black beans', '2 tbsp salsa', '1 whole wheat tortilla', '1 tbsp Greek yogurt (instead of sour cream)', '¼ avocado'], instructions: 'Scramble eggs with beans. Warm tortilla. Fill with egg mixture, salsa, avocado, yogurt. Roll and eat.', macros: 'Approx. 460 cal | 26g protein | 48g carbs | 18g fat', why: 'This breakfast covers all three macros and gives you the protein and fat needed to stay full until lunch.' }, app_links: [{ label: 'Log Meals', page: 'Nutrition' }] }, reflection: { prompt: 'What does your actual morning look like right now vs. your ideal one? What\'s the gap?', app_links: [{ label: 'Emotional Check-In', page: 'EmotionalCheckInPage' }] } },
          { day: 10, label: 'Wednesday', theme: 'Strength in Weakness', devotion: { title: 'Grace in the Struggle', scripture: '2 Corinthians 12:9-10', reading: 'Read 2 Corinthians 12:9-10. Paul boasts in his weaknesses because that\'s where God\'s power shows up most visibly. Where are you weak in this journey? That might be exactly where God wants to work.', reflection: 'Write about one area you\'ve been ashamed to admit is hard for you. Then write: "This is where God can show up."', prayer: 'God, I stop pretending I have this figured out. My weakness is an invitation for Your strength.', app_links: [{ label: 'Guided Meditation', page: 'GuidedMeditationsPage' }] }, workout: { title: 'Cardio Blast', workout_id: 'cardio-blast', note: 'Midweek intensity boost. Push through the Wednesday energy dip.', motivational_tip: '"I can do all things through Christ who strengthens me." — Philippians 4:13. Say it during the hard moments.', app_links: [{ label: 'Start Cardio Blast', page: 'Workouts' }] }, nutrition: { focus: 'Reduce Sugar', guidance: 'Check every label today. If sugar is in the first 3 ingredients, put it back. Your goal isn\'t perfection — it\'s awareness.', recipe: { name: 'Almond Butter Energy Balls', ingredients: ['1 cup rolled oats', '½ cup almond butter', '2 tbsp honey', '2 tbsp dark chocolate chips', '1 tsp vanilla extract'], instructions: 'Mix all ingredients. Roll into 12 balls. Refrigerate 30 min.', macros: 'Per ball: ~120 cal | 4g protein | 14g carbs | 6g fat', why: 'Natural sugars from honey + fiber from oats = sustained energy without the crash. These travel well and beat candy every time.' }, app_links: [{ label: 'Browse Recipes', page: 'DiscoverRecipes' }] }, reflection: { prompt: 'Where do you feel strongest right now in this journey? Where do you feel most challenged?', app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }] } },
          { day: 11, label: 'Thursday', theme: 'Wisdom for the Body', devotion: { title: 'Listen to Your Body', scripture: 'Proverbs 4:7', reading: 'Read Proverbs 4:7 — "Wisdom is the principal thing; therefore get wisdom." Wisdom applies to every domain, including how we care for our physical selves. Are you pushing when you should rest? Resting when you should push?', reflection: 'Honest check-in: rate your sleep, stress, and energy levels on a scale of 1-10 this week. What do those numbers tell you?', prayer: 'Lord, give me wisdom — for my body, my choices, and my rest.', app_links: [{ label: 'Open Bible to Proverbs', page: 'Bible' }] }, workout: { title: 'Yoga Flow', workout_id: 'yoga-flow', note: 'Listen to what your body actually needs today. If you\'re exhausted, do a 15-minute walk instead. If you\'re energized, add 10 extra minutes.', motivational_tip: 'Wisdom is knowing when to push and when to rest. Both take courage.', app_links: [{ label: 'Start Yoga Flow', page: 'Workouts' }] }, nutrition: { focus: 'Fiber Target', guidance: 'Aim for 25-35g of fiber today. Most people get 10-12g. Fiber feeds your gut microbiome, controls blood sugar, and keeps you full.', recipe: { name: 'High-Fiber Black Bean Tacos', ingredients: ['½ cup black beans', '2 corn tortillas', '¼ avocado', 'shredded cabbage', 'lime juice', 'cilantro', 'hot sauce'], instructions: 'Warm beans with cumin and garlic. Warm tortillas. Build tacos with beans, cabbage, avocado. Squeeze lime, add cilantro.', macros: 'Approx. 380 cal | 15g protein | 52g carbs | 14g fat — 14g fiber', why: 'Black beans have 15g of fiber per cup. Combined with cabbage and corn tortillas, this is a fiber powerhouse.' }, app_links: [{ label: 'Log Meals', page: 'Nutrition' }] }, reflection: { prompt: 'What would "balanced" actually feel like for you? Not perfect — balanced?', app_links: [{ label: 'Emotional Check-In', page: 'EmotionalCheckInPage' }] } },
          { day: 12, label: 'Friday', theme: 'The Power of Words', devotion: { title: 'Speak Life', scripture: 'Proverbs 18:21', reading: 'Read Proverbs 18:21 — "The tongue has the power of life and death." The most powerful conversations you have are the ones you have with yourself. What words are you speaking over your body, your journey, your capacity to change?', reflection: 'Write 5 truthful affirmations about who you are and what you\'re capable of. Not wishful thinking — truths you\'re choosing to believe.', prayer: 'God, align my words with Your truth about me today.', app_links: [{ label: 'Affirmations', page: 'AffirmationsPage' }, { label: 'Open Bible to Proverbs', page: 'Bible' }] }, workout: { title: 'Lower Body Blast', workout_id: 'lower-body-blast', note: 'End-of-week push. Finish strong.', motivational_tip: 'You showed up again. That\'s the discipline we\'re building. Not motivation — discipline.', app_links: [{ label: 'Start Lower Body Blast', page: 'Workouts' }] }, nutrition: { focus: 'Intuitive Eating Check-In', guidance: 'Today, before every meal, ask: Am I actually hungry, or is this boredom, stress, or habit? Take a 5-minute pause before eating. You don\'t have to change your meal — just notice.', recipe: { name: 'Salmon & Sweet Potato Mash', ingredients: ['5 oz salmon', '1 medium sweet potato', '1 tbsp butter', '½ tsp cinnamon', 'steamed broccoli', 'lemon'], instructions: 'Bake sweet potato 45 min at 400°F. Steam broccoli. Pan-sear salmon 4 min each side. Mash sweet potato with butter and cinnamon.', macros: 'Approx. 520 cal | 40g protein | 38g carbs | 20g fat', why: 'Sweet potatoes are one of the most nutrient-dense foods available — vitamin A, potassium, fiber. Salmon provides omega-3s and complete protein.' }, app_links: [{ label: 'Food Log History', page: 'FoodLogHistory' }] }, reflection: { prompt: 'What words have you been speaking over yourself this week? Which ones are helping you? Which ones are holding you back?', app_links: [{ label: 'Affirmations', page: 'AffirmationsPage' }] } },
          { day: 13, label: 'Saturday', theme: 'Serve Others', devotion: { title: 'Strength for Others', scripture: 'Galatians 5:13', reading: 'Read Galatians 5:13 — "Serve one another humbly in love." The transformation you\'re undergoing isn\'t just for you. Your health, clarity, and strength are meant to overflow into the lives around you.', reflection: 'Who in your life could benefit from one thing you\'ve learned this week? How can you share it?', prayer: 'God, make my growth a gift — not just for me, but for the people around me.', app_links: [{ label: 'Open Bible', page: 'Bible' }] }, workout: { title: 'Full Body HIIT', workout_id: 'hiit-30', note: 'Optional: workout with a friend today. Share the plan with someone.', motivational_tip: 'You are becoming someone others will want to follow. Let your consistency be a testimony.', app_links: [{ label: 'Start HIIT Workout', page: 'Workouts' }] }, nutrition: { focus: 'Cook for Someone Else', guidance: 'Make a healthy meal today with someone else in mind. Cook for your family, a neighbor, or a friend. Nourishing others is one of the most loving acts there is.', recipe: { name: 'Crowd-Pleasing Turkey Chili', ingredients: ['1 lb ground turkey', '1 can kidney beans', '1 can diced tomatoes', '1 cup corn', '½ onion', '2 tbsp chili powder', 'cumin, garlic, salt'], instructions: 'Brown turkey with onion. Add all remaining ingredients. Simmer 30 min. Serve with toppings.', macros: 'Per serving: ~380 cal | 35g protein | 35g carbs | 9g fat (serves 4)', why: 'Ground turkey is leaner than beef with nearly identical protein. This dish scales easily and tastes better the next day.' }, app_links: [{ label: 'Browse Recipes', page: 'DiscoverRecipes' }] }, reflection: { prompt: 'How is this journey changing the way you show up for the people in your life?', app_links: [{ label: 'Gratitude Journal', page: 'GratitudeJournalPage' }] } },
          { day: 14, label: 'Sunday', theme: 'Week 2 Sabbath', devotion: { title: 'Faithfulness Over Perfection', scripture: 'Luke 16:10', reading: 'Read Luke 16:10. You don\'t have to have a perfect week. You have to be faithful with what you have. Two weeks in, the question isn\'t "did I do everything right?" — it\'s "did I keep showing up?"', reflection: 'Week 2 review: What habit feels most natural now? What are you most looking forward to in Week 3?', prayer: 'Thank You, God, for two weeks of showing up. I rest in Your faithfulness today.', app_links: [{ label: 'Weekly Reflection', page: 'WeeklyReflectionPage' }] }, workout: { title: 'Rest / Bedtime Stretch', workout_id: 'bedtime-stretch', note: 'Rest is part of the plan, not a break from it.', motivational_tip: 'Two weeks in. You\'ve already done more than most people will do all year.', app_links: [{ label: 'Bedtime Stretch', page: 'Workouts' }] }, nutrition: { focus: 'Review Your Food Log', guidance: 'Open your food log from the past two weeks. What patterns do you see? What foods make you feel best? Which ones correlate with low energy days?', recipe: { name: 'Sunday Veggie Frittata', ingredients: ['6 eggs', '½ cup spinach', '½ cup bell pepper', '¼ cup onion', '2 oz goat cheese', '1 tbsp olive oil', 'herbs, salt, pepper'], instructions: 'Preheat oven to 375°F. Sauté vegetables in oven-safe skillet. Pour beaten eggs over vegetables. Top with goat cheese. Bake 15 min.', macros: 'Approx. 330 cal | 24g protein | 8g carbs | 22g fat (serves 2)', why: 'Frittata is the ultimate meal prep staple. Make it Sunday and eat it for breakfast Monday and Tuesday.' }, app_links: [{ label: 'Food Log History', page: 'FoodLogHistory' }] }, reflection: { prompt: 'What verse from this week\'s reading is staying with you? Write it out and explain why it matters to you right now.', app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }] } }
        ]
      },
      // ── WEEKS 3-8 (abbreviated for performance, full content per week) ──
      {
        week: 3,
        theme: 'Perseverance',
        theme_verse: 'James 1:4 — "Let perseverance finish its work so that you may be mature and complete."',
        overview: 'Week 3 is when most programs fail. The novelty has worn off, results aren\'t visible yet, and old patterns call loudly. This week we go deep on why you started and build the grit to finish what you began.',
        focus_color: '#FD9C2D',
        days: Array.from({ length: 7 }, (_, i) => ({
          day: 15 + i,
          label: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i],
          theme: ['When It Gets Hard','The Long Game','Breakthrough Moment','Anchored in Truth','Run Your Race','Community Accountability','Week 3 Review'][i],
          devotion: {
            title: ['Press Through','Faithful to the Finish','Dark Before Dawn','God\'s Promises Don\'t Expire','Eyes Fixed Forward','Iron Sharpens Iron','Count It All Joy'][i],
            scripture: ['Galatians 6:9','Hebrews 12:1','Isaiah 43:2','2 Peter 1:4','Hebrews 12:2','Proverbs 27:17','James 1:2-4'][i],
            reading: [
              'Read Galatians 6:9 — "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up." Week 3 is the test of this promise.',
              'Read Hebrews 12:1 — "Let us run with perseverance the race marked out for us." Your race. Not someone else\'s timeline or someone else\'s results.',
              'Read Isaiah 43:2 — "When you pass through the waters, I will be with you." This week might feel like deep water. God is in it with you.',
              'Read 2 Peter 1:4. God has given us "very great and precious promises." They are waiting for you. Your breakthrough may be one more faithful day away.',
              'Read Hebrews 12:2 — "fixing our eyes on Jesus, the pioneer and perfecter of faith." When the journey gets blurry, refocus on who you\'re becoming.',
              'Read Proverbs 27:17 — "As iron sharpens iron, so one person sharpens another." You were not designed to do this alone.',
              'Read James 1:2-4 and sit with the idea that the testing of your faith produces perseverance. What is being tested in you this week?'
            ][i],
            reflection: [
              'Write about a time in the past you gave up on something. What would have been different if you\'d kept going?',
              'What is the "race marked out for you"? What does finishing this 8 weeks represent for your life?',
              'What deep water are you in right now — physically, spiritually, or emotionally? Write honestly.',
              'Which of God\'s promises feels hardest to believe right now? Write it down. Then write "I choose to believe this today."',
              'Who are you becoming through this process? Describe that person in the present tense.',
              'Reach out to one person today and tell them where you\'re at in the journey. Be honest.',
              'Write a letter to yourself at Week 1. What do you want her/him to know?'
            ][i],
            prayer: ['God, give me Your strength to keep going.','Help me run my own race with joy.','I trust You in the deep water.','I choose Your promises over my doubts.','Fix my eyes on You, not the finish line.','Send me the right people for this season.','Thank You for what perseverance is producing in me.'][i],
            app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Journal Entry', page: 'MyJournalEntries' }]
          },
          workout: {
            title: ['Strength Circuit','Recovery Walk','HIIT 30','Yoga Flow','Cardio Blast','Full Body Strength','Rest Day'][i],
            workout_id: ['strength-circuit','morning-energizer','hiit-30','yoga-flow','cardio-blast','beginner-full-body','bedtime-stretch'][i],
            note: ['This week we step up to circuit training. Rest 45 seconds between exercises.','Active recovery today — 20-30 minutes at a comfortable pace.','Halfway through the week. Bring intensity.','Listen to your body. Move where it wants to move today.','Friday finish — give everything you have left.','Weekend warrior. Bring a friend if you can.','Total rest. You earned it.'][i],
            motivational_tip: ['Every rep is practice for perseverance.','Recovery is productive. Rest without guilt.','You are not tired — you are becoming.','Strength isn\'t the absence of softness.','Finish the week strong.','Shared effort multiplies the reward.','Rest is the final act of discipline.'][i],
            app_links: [{ label: 'Start Workout', page: 'Workouts' }]
          },
          nutrition: {
            focus: ['Reduce Processed Snacks','Eat the Rainbow','Protein Timing','Gut Health Foods','Anti-Inflammatory Week','Social Meal Planning','Week 3 Food Review'][i],
            guidance: [
              'Replace one processed snack per day with a whole food alternative this week.',
              'Eat at least 5 different colors of fruits/vegetables today. Each color represents different phytonutrients.',
              'Have protein within 45 minutes of your workout. This is when your muscles absorb amino acids most efficiently.',
              'Add one probiotic food today: Greek yogurt, kefir, kimchi, sauerkraut, or kombucha.',
              'Focus on foods with anti-inflammatory properties: berries, fatty fish, olive oil, turmeric, leafy greens.',
              'Plan a group meal or potluck with healthy options. Community eating can inspire better choices.',
              'Review this week\'s food log. What\'s your average protein intake? Most people are under 100g daily.'
            ][i],
            recipe: {
              name: ['Trail Mix with Dark Chocolate','Rainbow Buddha Bowl','Post-Workout Protein Smoothie','Kefir Berry Parfait','Anti-Inflammatory Golden Milk','Healthy Potluck Hummus Platter','Macro Review Bowl'][i],
              ingredients: [['½ cup almonds','¼ cup walnuts','2 tbsp pumpkin seeds','2 tbsp dark chocolate chips','¼ cup dried cranberries'],['1 cup mixed greens','¼ beet','¼ cup shredded carrots','¼ cup purple cabbage','¼ cup edamame','2 tbsp tahini dressing'],['1 scoop vanilla protein powder','1 banana','½ cup frozen mango','1 cup almond milk','1 tbsp almond butter','handful spinach'],['1 cup kefir','½ cup mixed berries','2 tbsp granola','1 tsp honey','fresh mint'],['1.5 cups oat milk','1 tsp turmeric','½ tsp cinnamon','¼ tsp ginger','1 tsp honey','pinch black pepper'],['2 cans chickpeas','4 tbsp tahini','2 lemons','3 garlic cloves','raw vegetables for dipping'],['Choose 1 serving each of your favorite protein, grain, and vegetable from this week']],
              instructions: ['Mix and store in portions for the week.','Assemble bowl, drizzle tahini dressing.','Blend all ingredients until smooth.','Layer and serve cold.','Heat milk, whisk in spices, do not boil. Serve warm.','Blend chickpeas, tahini, lemon, garlic. Season with salt. Serve with vegetables.','Combine and log macros.'],
              macros: ['Per portion: ~180 cal | 5g protein | 18g carbs | 11g fat','Approx. 390 cal | 16g protein | 52g carbs | 15g fat','Approx. 360 cal | 30g protein | 42g carbs | 8g fat','Approx. 220 cal | 12g protein | 32g carbs | 4g fat','Approx. 90 cal | 3g protein | 16g carbs | 2g fat','Per serving: ~180 cal | 8g protein | 22g carbs | 8g fat','Varies — track in food log'],
              why: ['Nuts provide healthy fats and satisfying crunch. Dark chocolate adds magnesium and antioxidants.','Different colors = different antioxidants, vitamins, and minerals. Eating the rainbow is proven to reduce disease risk.','The banana and mango provide fast carbs for glycogen replenishment. Protein powder repairs muscle.','Kefir has more probiotics than yogurt and is easily absorbed by most lactose-sensitive people.','Turmeric + black pepper increases curcumin absorption by 2000%. The black pepper is critical.','Homemade hummus has no preservatives and you control the quality of every ingredient.','Awareness of your macro balance is one of the most powerful nutrition tools available.']
            }[i],
            app_links: [{ label: 'Log Meals', page: 'Nutrition' }]
          },
          reflection: {
            prompt: [
              'What has been the hardest moment so far in this journey? What helped you through it?',
              'How long do you think it takes to build a habit? What does research say vs. what has your experience been?',
              'What breakthrough — however small — have you experienced in Week 3?',
              'Write out 5 promises of God that apply to your life right now. Where did you find them?',
              'If you had to describe your "race" to someone else, what would you say it looks like?',
              'Who do you need to thank for supporting you in this journey? Write them a message.',
              'What habit from this week are you most proud of? What do you want to carry into Week 4?'
            ][i],
            app_links: [{ label: i === 6 ? 'Weekly Reflection' : 'Journal Entry', page: i === 6 ? 'WeeklyReflectionPage' : 'MyJournalEntries' }]
          }
        }))
      },
      {
        week: 4,
        theme: 'Surrender',
        theme_verse: 'Proverbs 3:5-6 — "Trust in the Lord with all your heart and lean not on your own understanding."',
        overview: 'Halfway through. This week we slow down and go deep. Real transformation requires releasing control — of outcomes, timelines, and expectations. Surrender isn\'t passive. It\'s the most active thing you can do.',
        focus_color: '#AFC7E3',
        days: Array.from({ length: 7 }, (_, i) => ({
          day: 22 + i,
          label: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i],
          theme: ['Let Go of the Scale','Trust the Process','Prayer as Power','Rest in His Timing','Emotional Honesty','Midpoint Celebration','Halfway Reflection'][i],
          devotion: { title: ['Outcomes Belong to God','Unseen Work','Pray Without Ceasing','His Timing is Perfect','Feel to Heal','Gratitude at the Halfway Mark','Looking Back, Looking Forward'][i], scripture: ['Proverbs 16:9','Romans 8:28','Philippians 4:6-7','Ecclesiastes 3:1','Psalm 34:18','Deuteronomy 8:2','Lamentations 3:22-23'][i], reading: ['Proverbs 16:9 — "In their hearts humans plan their course, but the Lord establishes their steps." The plan is yours. The outcome is His.','Romans 8:28 — all things work together for good. Not all things are good — but all things work. Even the hard weeks.','Philippians 4:6-7 — bring everything to God in prayer. Not just the spiritual things. Everything.','Ecclesiastes 3:1 — there is a time for everything. You are exactly where you\'re supposed to be, even if it doesn\'t feel like it.','Psalm 34:18 — God is close to the brokenhearted. Your emotions aren\'t obstacles to growth — they\'re the terrain of it.','Deuteronomy 8:2 — "Remember how the Lord your God led you all the way." Take stock of 4 weeks of faithfulness.','Lamentations 3:22-23 — His mercies are new every morning. Great is His faithfulness. Every morning is a fresh start.'][i], reflection: ['What outcome are you most attached to in this journey? What would it feel like to hold it loosely?','Where have you seen God working in your journey in a way you didn\'t expect?','What have you been carrying that you need to bring to God in prayer today?','Is there an area where you\'re fighting God\'s timing? Write honestly.','What emotion have you been avoiding feeling during this journey? Name it.','Write a gratitude list specifically about this journey — things you\'ve noticed, learned, or felt.','At the halfway point: what has changed? What hasn\'t? What do you still want?'][i], prayer: ['God, I hold my goals loosely. You know the destination better than I do.','Thank You for the unseen work You are doing in me.','I bring everything to You today. Every worry, every hope, every fear.','Your timing is good even when I don\'t understand it.','I choose to feel what I\'ve been avoiding.','Thank You for 4 weeks. I celebrate what You\'ve done.','Your mercies are new this morning. Thank You.'][i], app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Prayer', page: 'Prayer' }] },
          workout: { title: ['Mobility Flow','Core Crusher','Fat Burn 20','Recovery Yoga','HIIT Tabata','Strength Circuit','Complete Rest'][i], workout_id: ['mobility-flow','core-crusher','fat-burn-20','yoga-flow','tabata-intense','strength-circuit','bedtime-stretch'][i], note: ['Focus on range of motion and release.','A strong core is your foundation — for everything.','Midweek intensity. Bring it.','Restorative practice today.','Tabata: 20 seconds on, 10 seconds rest. 8 rounds.','Push for personal bests today.','Rest completely — celebrate getting to the halfway point.'][i], motivational_tip: ['Flexibility is strength of a different kind.','Every crunch is a deposit into your future self.','Halfway through the program — this intensity will build you.','Healing and growth happen in the rest.','Tabata was designed by Olympians. You\'re training like one.','4 weeks in. What you can do now vs. Week 1.','You made it to the halfway point. That alone is worth celebrating.'][i], app_links: [{ label: 'Start Workout', page: 'Workouts' }] },
          nutrition: { focus: ['Mindful Eating','Whole Grain Swap','Pre/Post Workout Nutrition','Gut Microbiome','Emotional Eating Awareness','Celebrate with Food Well','Halfway Nutrition Review'][i], guidance: ['Eat one meal today with zero screens. Sit, chew slowly, and actually taste your food.','Swap white rice for brown rice, white bread for whole grain, and white pasta for whole wheat or lentil pasta.','Eat 20g+ of protein before your workout today. Eggs, Greek yogurt, or a protein shake all work.','Add fermented foods this week: yogurt, kefir, kimchi, or sauerkraut to support gut diversity.','Notice today if you eat for any reason other than hunger. No judgment — just awareness.','Plan a celebratory meal that\'s still aligned with your goals. You can celebrate with food well.','Review: How many days did you log your meals? What\'s your average calorie intake been?'][i], recipe: { name: ['Mindful Grain Bowl','Whole Grain Mediterranean Bowl','Pre-Workout Banana Oat Bars','Gut-Healing Miso Soup','Stress Less Chamomile Smoothie','Celebration Dark Chocolate Bark','Macro Balance Plate'][i], ingredients: [['1 cup farro or barley','2 oz protein of choice','1 cup roasted vegetables','lemon tahini dressing'],['1 cup brown rice','1 cup mixed vegetables','2 tbsp hummus','olives','cherry tomatoes','feta'],['2 ripe bananas','1.5 cups oats','¼ cup almond butter','2 tbsp honey','pinch of salt'],['2 cups miso broth','1 block tofu (cubed)','1 sheet nori','scallions','1 tsp sesame oil'],['1 cup brewed chamomile tea (cooled)','1 banana','½ cup frozen mango','1 tsp ashwagandha powder','1 tsp honey'],['100g dark chocolate (70%+)','¼ cup mixed nuts','2 tbsp dried cranberries','sea salt','optional: ½ tsp coconut oil'],['4-6 oz protein','½ cup complex carb','2 cups vegetables','healthy fat topping']], instructions: ['Cook grain. Assemble bowl. Dress with tahini.','Assemble bowl with all ingredients.','Mash bananas, mix in oats, almond butter, honey. Press into pan. Refrigerate 1 hour. Cut into bars.','Heat miso broth, add tofu and nori. Top with scallions and sesame oil.','Blend all ingredients until smooth.','Melt chocolate, spread thin. Top with nuts, cranberries, sea salt. Refrigerate until set.','Assemble and log in food log.'], macros: ['~400 cal | 20g protein | 52g carbs | 12g fat','~380 cal | 14g protein | 58g carbs | 12g fat','Per bar: ~160 cal | 5g protein | 22g carbs | 7g fat','~120 cal | 10g protein | 8g carbs | 5g fat','~180 cal | 3g protein | 38g carbs | 2g fat','Per serving: ~220 cal | 4g protein | 22g carbs | 14g fat','Varies — track in food log'], why: ['Farro is an ancient grain with 7g protein per cup and rich, nutty flavor.','A balanced Mediterranean bowl hit every macronutrient and is deeply satisfying.','These bars are ready-made for pre-workout fuel with slow carbs and nut butter protein.','Miso provides probiotics plus isoflavones. One of the most studied longevity foods.','Chamomile reduces cortisol. Ashwagandha is an adaptogen that helps your body manage stress.','Dark chocolate (70%+) is genuinely healthy — flavonoids improve blood flow and mood.','The perfect macro-balanced plate: protein for muscle, carbs for energy, vegetables for micronutrients.'] }[i], app_links: [{ label: 'Log Meals', page: 'Nutrition' }] },
          reflection: { prompt: ['What are you still trying to control in this journey that you haven\'t surrendered yet?','What "unseen work" do you think God might be doing in you right now?','What prayer have you been praying that you\'re waiting to see answered?','What area of your life requires the most patience right now?','What emotion have you been numbing with food, busyness, or distraction? What would it look like to actually feel it?','Write a letter to your future self at Week 8. What do you want her/him to feel?','At the halfway point: who are you becoming? Be specific.'][i], app_links: [{ label: i === 6 ? 'Weekly Reflection' : 'Journal Entry', page: i === 6 ? 'WeeklyReflectionPage' : 'MyJournalEntries' }] }
        }))
      },
      {
        week: 5, theme: 'Momentum', theme_verse: 'Isaiah 40:31 — "Those who hope in the Lord will renew their strength. They will soar on wings like eagles."',
        overview: 'The back half begins. You\'ve built the foundation — now you build on it. This week is about stepping into the energy you\'ve been generating and letting it carry you.',
        focus_color: '#0EA5E9',
        days: Array.from({ length: 7 }, (_, i) => ({
          day: 29 + i,
          label: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i],
          theme: ['Renewed Strength','Soaring Higher','The Flywheel Effect','Pressing Deeper','Sprint to the Finish','New Levels','Week 5 Review'][i],
          devotion: { title: ['Strength for the Second Half','Eagle\'s Wings','Every Good Thing Builds','The Deeper Well','Run and Not Grow Weary','He Opens Doors','Five Down, Three to Go'][i], scripture: ['Isaiah 40:31','Ephesians 3:20','Romans 5:3-5','Colossians 1:9-10','Isaiah 40:31','Revelation 3:8','Philippians 3:14'][i], reading: ['This is the week you catch a second wind. "Those who hope in the Lord will renew their strength" — this is a promise, not a possibility.','Ephesians 3:20 — "immeasurably more than all we ask or imagine." God\'s vision for your health and growth exceeds your own.','Romans 5:3-5 — suffering produces perseverance, perseverance produces character, character produces hope. You are living this sequence.','Colossians 1:9-10 — pray that you be filled with the knowledge of God\'s will in all wisdom and spiritual understanding.','You\'re in the back half. The same verse from Monday is your fuel for Friday: run and not grow weary.','Revelation 3:8 — "I know your deeds. See, I have placed before you an open door." What door is opening for you?','Philippians 3:14 — "I press on toward the goal." Five weeks of pressing. Three more to go.'][i], reflection: ['What new strength have you discovered in yourself this journey?','What would it look like to receive "immeasurably more" in your health and spiritual life?','Where have you seen the sequence: difficulty → perseverance → character → hope in your life?','What spiritual understanding have you gained through this journey that you didn\'t have 5 weeks ago?','What makes you weary? What renews you? Are you getting enough of what renews you?','What door do you sense is opening in your life because of the work you\'ve done?','5 weeks down. Write down your biggest win in each of the 4 areas: faith, fitness, nutrition, mindset.'][i], prayer: ['Renew my strength, Lord. Give me Your energy for this second half.','Open my eyes to what You have planned beyond what I can imagine.','Thank You for the character being built in the hard moments.','Fill me with wisdom and spiritual understanding today.','I press on. I don\'t give up. I run with You.','Show me the doors You\'re opening.','Press me toward the goal, Lord.'][i], app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Journal Entry', page: 'MyJournalEntries' }] },
          workout: { title: ['HIIT 30','Upper Body Strength','Tabata Intense','Yoga Flow','Cardio Blast','Lower Body Blast','Rest & Reflect'][i], workout_id: ['hiit-30','upper-body-strength','tabata-intense','yoga-flow','cardio-blast','lower-body-blast','bedtime-stretch'][i], note: ['Open Week 5 with intensity.','Push for personal records on every exercise today.','Tabata is the gold standard for metabolic conditioning.','Honor the work you\'ve done. Move gently today.','Last hard cardio of the week. Make it count.','Strong legs = strong foundation.','Rest. You\'ve earned it.'][i], motivational_tip: ['Your body has changed more than the mirror can show in 5 weeks.','Hit the weights with everything you\'ve built.','20 seconds of your absolute best. Then 10 seconds of rest. Repeat 8 times.','You can\'t pour from an empty cup.','You started Week 5. You will finish it.','Your best workout of the program might be this one.','Active rest = earned rest.'][i], app_links: [{ label: 'Start Workout', page: 'Workouts' }] },
          nutrition: { focus: ['Energy Foods','Reduce Sugar Further','Metabolic Boost','Gut & Brain Connection','Intuitive Eating','Social Wellness','Week 5 Review'][i], guidance: ['Focus on foods that create genuine energy: complex carbs, lean protein, healthy fats, and plenty of water.','Target: reduce added sugar to under 25g today (the WHO recommendation). Read every label.','Add metabolism-supporting foods: green tea, protein, spicy foods, or apple cider vinegar.','Your gut produces 95% of your serotonin. Feed it well: fiber, fermented foods, polyphenols.','Today, eat only when you\'re physically hungry. Stop when satisfied (not full).','Cook a healthy meal with family or friends. The act of preparing food together is deeply connecting.','Look at your log for 5 weeks. What has changed? What still needs work?'][i], recipe: { name: ['Energy Grain Bowl','Low-Sugar Chia Pudding','Metabolism Boost Green Tea Smoothie','Brain-Gut Fermented Bowl','Hunger Cue Soup','Family Taco Night (Healthy Version)','Week 5 Signature Salad'][i], ingredients: [['1 cup farro','3 oz salmon','½ avocado','1 cup arugula','lemon vinaigrette'],['¼ cup chia seeds','1 cup coconut milk (unsweetened)','½ tsp vanilla','1 tbsp maple syrup','berries'],['1 cup strong green tea (cooled)','1 banana','½ cup mango','1 scoop vanilla protein','1 cup spinach'],['1 cup cooked barley','½ cup kimchi','½ cup edamame','soft-boiled egg','sesame seeds','soy sauce'],['2 cups vegetable broth','½ cup white beans','1 cup spinach','½ cup celery','½ onion','thyme'],['Lettuce wraps or small corn tortillas','ground turkey seasoned with cumin/chili','pico de gallo','avocado','lime'],['Mixed greens, protein of choice, colorful vegetables, olive oil + lemon dressing']], instructions: ['Cook farro, assemble bowl.','Mix chia, coconut milk, vanilla, syrup. Refrigerate 4+ hours. Top with berries.','Blend all ingredients.','Assemble bowl with all ingredients.','Simmer everything 20 min. Blend half for thickness if desired.','Brown turkey, warm tortillas or prepare wraps. Top as desired.','Assemble and log.'], macros: ['~490 cal | 34g protein | 48g carbs | 18g fat','~260 cal | 8g protein | 28g carbs | 13g fat','~280 cal | 24g protein | 36g carbs | 3g fat','~360 cal | 18g protein | 48g carbs | 10g fat','~180 cal | 10g protein | 28g carbs | 2g fat','Per serving: ~380 cal | 28g protein | 38g carbs | 12g fat','Varies — track in food log'], why: ['Farro + salmon + avocado is the trifecta of omega-3s, complete protein, and complex carbs.','Chia provides 11g fiber per 2 tbsp. Coconut milk adds lauric acid, a beneficial medium-chain fatty acid.','EGCG in green tea boosts metabolism by 4%. Combined with protein, it\'s a strong metabolic stack.','Barley and kimchi together create a probiotic-rich, high-fiber gut healing meal.','White beans contain resistant starch that feeds beneficial gut bacteria and improves satiety.','By choosing lean protein and fresh toppings over cheese and sour cream, you cut calories by ~40%.','A consistently well-constructed salad is one of the most powerful health habits available.'] }[i], app_links: [{ label: 'Log Meals', page: 'Nutrition' }] },
          reflection: { prompt: ['Where are you feeling genuine momentum in your life right now?','If you could ask God for one thing in the remaining 3 weeks, what would it be?','What character quality have you developed through this journey? How have others noticed?','What is God teaching you about yourself through this process?','What renews your energy? Are you prioritizing it enough?','How has your relationship with food changed over 5 weeks?','5 weeks in — what does the person you\'re becoming actually feel like?'][i], app_links: [{ label: i === 6 ? 'Weekly Reflection' : 'Journal Entry', page: i === 6 ? 'WeeklyReflectionPage' : 'MyJournalEntries' }] }
        }))
      },
      {
        week: 6, theme: 'Identity', theme_verse: 'Ephesians 2:10 — "We are God\'s handiwork, created in Christ Jesus to do good works."',
        overview: 'Six weeks in, the physical changes are real — but the deeper transformation is who you\'re becoming. This week we anchor everything in identity: not what you do, but who you are.',
        focus_color: '#c9a227',
        days: Array.from({ length: 7 }, (_, i) => ({
          day: 36 + i, label: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i],
          theme: ['Created for Good Works','Fearfully Made','New Creation','Rooted and Grounded','Walking in Identity','Strength from Within','Week 6 Review'][i],
          devotion: { title: ['You Were Made On Purpose','The Detail Work','Old Things Have Passed','Unshakeable Roots','The Real You','From the Inside Out','Grateful for the Becoming'][i], scripture: ['Ephesians 2:10','Psalm 139:14','2 Corinthians 5:17','Ephesians 3:17-19','Colossians 3:12-14','Galatians 5:22-23','Psalm 103:1-5'][i], reading: ['Ephesians 2:10 — you are God\'s workmanship, His masterpiece. Created for works prepared in advance. There\'s a purpose here bigger than getting healthy.','Psalm 139:14 — "I am fearfully and wonderfully made." This isn\'t about your body at a certain weight — it\'s about your body as a sacred, intentional creation.','2 Corinthians 5:17 — "If anyone is in Christ, the new creation has come: the old has gone, the new is here!" You are not who you were 6 weeks ago.','Ephesians 3:17-19 — "rooted and established in love." When your identity is rooted in Christ\'s love, no storm can uproot you.','Colossians 3:12-14 — "clothe yourselves with compassion, kindness, humility, gentleness and patience." These are the character qualities of your transformed self.','Galatians 5:22-23 — the fruit of the Spirit. How many of these qualities have grown in you this journey?','Psalm 103:1-5 — bless the Lord who forgives, heals, redeems, crowns, and satisfies. This is who you belong to.'][i], reflection: ['What "good works" do you think your renewed health and strength are preparing you for?','How do you genuinely feel about your body right now? Is your self-talk changing?','What "old things" have passed in you over these 6 weeks? What has become new?','What threatens to uproot your identity most? What keeps you grounded?','Describe yourself using only positive, true statements for one full page.','Which fruit of the Spirit has grown most in you through this journey?','List every blessing from Psalm 103 that applies to your journey right now.'][i], prayer: ['God, show me the works You created me for.','I receive how You made me today.','Thank You for making me new.','Root me deeper in Your love.','I walk in the identity You\'ve given me.','Grow Your fruit in me.','I bless You with everything in me.'][i], app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Identity in Christ', page: 'IdentityInChristPage' }] },
          workout: { title: ['Strength Circuit','Cardio Blast','Core Crusher','Yoga Flow','HIIT 30','Lower Body Blast','Rest Day'][i], workout_id: ['strength-circuit','cardio-blast','core-crusher','yoga-flow','hiit-30','lower-body-blast','bedtime-stretch'][i], note: ['You are noticeably stronger than Week 1. Prove it today.','Cardio with intention — this is your weekly cardio anchor.','A strong core reflects a grounded identity.','Move with gratitude for what this body can do.','Push hard. Two weeks left after this.','Legs power everything.','Rest and reflect on who you\'ve become.'][i], motivational_tip: ['The person who started Week 1 couldn\'t do what you\'re doing today.','Cardio is mental as much as physical. Mind over lungs.','Core strength = physical center. Identity = spiritual center.','Gratitude transforms the hardest workouts into acts of worship.','One week from now you\'ll wish you pushed harder today.','Strong foundation, strong future.','Rest isn\'t retreat — it\'s renewal.'][i], app_links: [{ label: 'Start Workout', page: 'Workouts' }] },
          nutrition: { focus: ['Identity-Aligned Eating','Nourish Not Punish','Food as Fuel','Clean & Simple','Weekly Best Meals','Celebrate Your Progress','Week 6 Food Review'][i], guidance: ['Today, eat in a way that reflects who you\'re becoming, not who you used to be.','Notice: are you using food to nourish yourself, or to punish yourself for past choices?','Before each meal: ask "does this fuel the body I\'m building?"','Challenge: eat only whole, recognizable ingredients today. Nothing with more than 5 ingredients.','Recreate your favorite healthy meal from the past 6 weeks.','Plan one treat today that you genuinely enjoy — and eat it slowly, without guilt.','6-week food log review: what patterns have supported your best energy days?'][i], recipe: { name: ['Whole30-Style Turkey Bowl','Self-Care Soup','Athlete\'s Pre-Workout Plate','Clean 5-Ingredient Chicken','Favorite Recipe Recreated','Dark Chocolate Avocado Mousse','6-Week Signature Bowl'][i], ingredients: [['5 oz ground turkey','1 cup sweet potato','½ avocado','mixed greens','lime, cumin, chili'],['2 cups chicken broth','1 cup sweet potato','½ cup lentils','1 tsp ginger','turmeric','spinach'],['1 cup oatmeal','1 tbsp almond butter','1 banana','honey','chia seeds'],['4 oz chicken breast','olive oil','garlic','lemon','rosemary'],['Your choice — make something you loved this program'],['1 ripe avocado','2 tbsp cocoa powder','2 tbsp maple syrup','¼ tsp vanilla','pinch salt'],['Your choice — build your perfect balanced bowl']], instructions: ['Brown turkey with spices. Roast sweet potato. Assemble bowl.','Simmer all ingredients 25 min.','Cook oatmeal. Top with remaining ingredients.','Marinate chicken 30 min. Bake 400°F 20 min.','Follow your chosen recipe.','Blend all ingredients until silky smooth. Refrigerate 30 min.','Assemble and celebrate.'], macros: ['~440 cal | 36g protein | 38g carbs | 16g fat','~280 cal | 18g protein | 36g carbs | 4g fat','~400 cal | 12g protein | 58g carbs | 14g fat','~240 cal | 34g protein | 2g carbs | 10g fat','Varies','Per serving: ~220 cal | 3g protein | 20g carbs | 16g fat','Varies — track it'], why: ['This combination provides all macros and the healthy fats from avocado support hormone balance.','Ginger and turmeric are anti-inflammatory. Lentils provide iron and fiber. This is a healing bowl.','Oatmeal before a workout provides beta-glucan, which has been shown to improve endurance performance.','Simple, clean, high-protein. Sometimes the best meals have the fewest ingredients.','Cooking a meal you love is an act of self-respect.','Avocado provides the fat base for this mousse, making it rich and creamy without dairy.','The best bowl is the one you\'ll actually eat with joy.'] }[i], app_links: [{ label: 'Log Meals', page: 'Nutrition' }] },
          reflection: { prompt: ['How has your understanding of your identity changed in 6 weeks?','What does nourishing your body feel like now vs. Week 1?','If you had to describe your relationship with food right now in one sentence, what would it be?','What does a life truly rooted in Christ look like for you practically?','Write a description of the person you\'re becoming in third person, as if describing them to a friend.','What has brought you the most joy in this journey so far?','6 weeks of faithfulness. What is the single most important thing that has changed?'][i], app_links: [{ label: i === 6 ? 'Weekly Reflection' : 'IdentityInChristPage', page: i === 6 ? 'WeeklyReflectionPage' : 'IdentityInChristPage' }] }
        }))
      },
      {
        week: 7, theme: 'Overflow', theme_verse: 'John 10:10 — "I have come that they may have life, and have it to the full."',
        overview: 'Seven weeks of building. This week is about living in the overflow — letting what you\'ve built flow outward into your relationships, your purpose, and your daily experience of life.',
        focus_color: '#FD9C2D',
        days: Array.from({ length: 7 }, (_, i) => ({
          day: 43 + i, label: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i],
          theme: ['Life Abundant','Sharing Your Overflow','Purpose Fuels Fitness','Stillness Before the Finish','The Final Push','Legacy & Generosity','Week 7 Review'][i],
          devotion: { title: ['The Full Life','Let It Flow','Why This All Matters','Quiet Before the Crescendo','Almost There','Plant Seeds for Others','Seven Weeks of Grace'][i], scripture: ['John 10:10','2 Corinthians 9:8','Colossians 3:23-24','Mark 1:35','Philippians 4:13','Proverbs 11:25','Psalm 126:5-6'][i], reading: ['John 10:10 — "life to the full." Not just surviving — thriving. Not just getting by — flourishing. This is what you\'ve been building.','2 Corinthians 9:8 — "God is able to bless you abundantly, so that in all things at all times, having all that you need, you will abound in every good work."','Colossians 3:23-24 — "Whatever you do, work at it with all your heart, as working for the Lord." Every rep. Every meal. Every journal entry.','Mark 1:35 — Jesus, before the biggest day of His ministry, slipped away alone to pray. The most productive people protect their stillness.','Philippians 4:13 — one week left. Everything you need is available to you through Christ.','Proverbs 11:25 — "A generous person will prosper." The abundance you\'ve built is meant to be shared.','Psalm 126:5-6 — "Those who sow in tears will reap with songs of joy." Every hard day of this journey was a seed.'][i], reflection: ['What does "life to the full" actually look like for you? Get specific.','How has your transformation already begun to affect the people around you?','If this journey is an act of worship, what has that changed about how you show up?','What do you need to be still about before Week 8?','What does "I can do all things through Christ" mean to you right now, practically?','What seeds have you been planting in others through this journey?','Seven weeks of showing up. Write the most honest summary of this journey you can.'][i], prayer: ['God, I want the full life You promised.','Let me overflow into the lives of the people around me.','I do this for Your glory, not mine.','Speak in the stillness, Lord.','I press on. Through You, I can.','Make my growth a gift for others.','Thank You for every tear, every sweat, every breakthrough.'][i], app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Prayer', page: 'Prayer' }] },
          workout: { title: ['Athlete Conditioning','Upper Body Strength','HIIT 30','Yoga Flow','Cardio Blast + Core','Bodyweight Mastery','Rest & Reflect'][i], workout_id: ['athlete-conditioning','upper-body-strength','hiit-30','yoga-flow','cardio-blast','bodyweight-master','bedtime-stretch'][i], note: ['Athlete conditioning — you\'re ready for this.','Push for new personal records today.','Go all out. One week left.','Honor the journey with intentional movement.','Final Friday cardio push. Leave nothing.','Bodyweight mastery — your own body is the equipment.','Rest with gratitude.'][i], motivational_tip: ['7 weeks of training. You are an athlete.','Set a new standard this week. Then keep it.','Last hard workout before the final week. Make it legendary.','Flow with the journey. You are near the end.','You have one final cardio week left. Run like it.','No equipment needed. You ARE the equipment.','Final rest before the last week. Let your body prepare.'][i], app_links: [{ label: 'Start Workout', page: 'Workouts' }] },
          nutrition: { focus: ['Abundance Mindset','Give to Others','Food as Generosity','Pre-Final Week Prep','Fuel for the Finish','Celebratory Cooking','Week 7 Nutrition Review'][i], guidance: ['Shift from "what can\'t I eat" to "what nourishing things can I add" — abundance mindset changes the relationship with food.','Challenge: bring a healthy dish to share with someone this week.','Cook a meal with the intention of giving it away.','Prep food for the final week. Enter Week 8 fueled and ready.','Eat specifically for energy and performance this week — not restriction.','Prepare a meal that celebrates who you\'ve become.','Review: what eating habits are now automatic? Which still require effort?'][i], recipe: { name: ['Abundance Buddha Bowl','Shareable Veggie Soup','Gift Meal: Chicken Stir-Fry','Week 8 Prep Bowls','Performance Plate','Celebration Feast Bowl','7-Week Favorite'][i], ingredients: [['1 cup brown rice','4 oz tofu or chicken','1 cup roasted vegetables','avocado','sesame dressing'],['4 cups vegetable broth','2 cans cannellini beans','3 cups kale','2 carrots','1 can diced tomatoes','Italian herbs'],['4 oz chicken breast','2 cups mixed vegetables','2 tbsp low-sodium soy sauce','1 tsp sesame oil','garlic','ginger'],['2 cups quinoa (batch)','4 cups mixed roasted vegetables','2 cans chickpeas','tahini dressing','herbs'],['6 oz lean protein','1 cup sweet potato','1 cup spinach','½ avocado','olive oil dressing'],['Your absolute favorite healthy meal from the program — elevated.'],['Make your favorite recipe from the past 7 weeks.']], instructions: ['Cook rice. Roast vegetables. Assemble bowl with all ingredients.','Simmer all ingredients 30 min. This makes ~6 servings — share it.','Stir-fry chicken with vegetables, add sauce. Serve immediately.','Batch cook all components. Store separately for 5 days of ready meals.','Grill or bake protein. Roast sweet potato. Assemble with avocado and dressing.','Prepare your favorite and eat it with people you love.','Prepare with love and intention.'], macros: ['~460 cal | 22g protein | 58g carbs | 18g fat','Per serving: ~260 cal | 14g protein | 38g carbs | 4g fat','~340 cal | 36g protein | 22g carbs | 12g fat','Per bowl: ~440 cal | 18g protein | 58g carbs | 14g fat','~480 cal | 40g protein | 40g carbs | 18g fat','Varies — eat with joy','Your best numbers yet'], why: ['The combination of rice, protein, and varied vegetables covers all micronutrients in one bowl.','White beans + kale = one of the most nutritionally dense combinations available.','Ginger and garlic are anti-inflammatory and antiviral. Stir-fry is one of the fastest healthy meals.','Batch prep for the final week means you arrive at the finish line fueled, not scrambling.','This macro profile supports peak performance for your final week of workouts.','Food prepared with love and shared with others is a form of generosity.','You know what works for your body now. Trust that knowledge.'] }[i], app_links: [{ label: 'Log Meals', page: 'Nutrition' }, { label: 'Browse Recipes', page: 'DiscoverRecipes' }] },
          reflection: { prompt: ['What would "life to the full" look like for you in a month? In a year?','Who has noticed a change in you over these 7 weeks? What did they say?','What has this journey taught you about yourself that surprised you most?','What do you need to be still about right now? What answer might be waiting in the quiet?','What is one thing you can do this week that your Week 1 self couldn\'t do?','What gift has this journey given you that you want to pass on?','Seven weeks. Write a one-paragraph summary of what has happened in you.'][i], app_links: [{ label: i === 6 ? 'WeeklyReflectionPage' : 'MyJournalEntries', page: i === 6 ? 'WeeklyReflectionPage' : 'MyJournalEntries' }] }
        }))
      },
      {
        week: 8, theme: 'Legacy',
        theme_verse: 'Philippians 1:6 — "He who began a good work in you will carry it on to completion until the day of Christ Jesus."',
        overview: 'This is it — the final week. Not the end of the journey, but the beginning of a new normal. Week 8 is about anchoring everything you\'ve built, celebrating what God has done, and setting your eyes on what comes next.',
        focus_color: '#c9a227',
        days: [
          { day: 50, label: 'Monday', theme: 'The Beginning of Forever', devotion: { title: 'He Will Complete It', scripture: 'Philippians 1:6', reading: 'Read Philippians 1:6. This verse is your promise for everything beyond Week 8. The God who started this work in you will not abandon it. You don\'t have to white-knuckle the rest of your life — He is in it.', reflection: 'Write about what you want your life to look like 6 months from now. What habits do you want to still have? What would you like to be true?', prayer: 'God, I trust You to complete what You started in me. Not just these 8 weeks — all of it.', app_links: [{ label: 'Open Bible to Philippians', page: 'Bible' }, { label: 'Journal Entry', page: 'MyJournalEntries' }] }, workout: { title: 'Strength Circuit — Personal Best Day', workout_id: 'strength-circuit', note: 'Final week. Go for personal records on everything. Prove to yourself what 8 weeks of faithfulness creates.', motivational_tip: 'You are not the same person who started Week 1. Prove it today.', app_links: [{ label: 'Start Strength Circuit', page: 'Workouts' }] }, nutrition: { focus: 'Final Week Excellence', guidance: 'This week, eat with the confidence of someone who knows how to nourish themselves. You have 8 weeks of wisdom. Use it.', recipe: { name: 'Personal Best Bowl', ingredients: ['Your best protein from the program', 'Your favorite grain', 'Your best vegetable combination', 'Your go-to dressing or sauce'], instructions: 'Build the bowl you\'ve been eating toward all 8 weeks. The one that feels like you.', macros: 'Your personal best — log it and celebrate it.', why: 'You know your body now. Build the meal that makes you feel your best.' }, app_links: [{ label: 'Log Your Meals', page: 'Nutrition' }] }, reflection: { prompt: 'What does "complete" feel like? Not perfect — complete. There\'s a difference. Write about it.', app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }] } },
          { day: 51, label: 'Tuesday', theme: 'Gratitude for the Journey', devotion: { title: 'Look How Far You\'ve Come', scripture: 'Psalm 126:1-3', reading: 'Read Psalm 126:1-3 — "We were like those who dreamed... The Lord has done great things for us, and we are filled with joy." When God restores, people around you notice. What have people noticed in you?', reflection: 'Write a gratitude list specifically for this journey — every hard day, every breakthrough, every person who supported you, every moment of grace.', prayer: 'Lord, You have done great things. I am filled with joy.', app_links: [{ label: 'Gratitude Journal', page: 'GratitudeJournalPage' }] }, workout: { title: 'Cardio Blast — Final Cardio', workout_id: 'cardio-blast', note: 'Your last dedicated cardio workout of the program. Pour everything in.', motivational_tip: 'The finish line is in sight. Sprint.', app_links: [{ label: 'Start Cardio Blast', page: 'Workouts' }] }, nutrition: { focus: 'Celebrate with Nourishment', guidance: 'Cook or order your absolute favorite healthy meal today and eat it slowly, with full presence and gratitude.', recipe: { name: 'Gratitude Feast — Your Choice', ingredients: ['Your 3 favorite healthy ingredients', 'prepared with love and intention'], instructions: 'Make the meal that, when you eat it, you feel proud of yourself.', macros: 'No macro targets today — just nourishment with joy.', why: 'Food eaten with gratitude and presence is absorbed differently. Mindful eating is real science.' }, app_links: [{ label: 'Log Meals', page: 'Nutrition' }] }, reflection: { prompt: 'Write a letter to the person you were 8 weeks ago. What do you want them to know?', app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }] } },
          { day: 52, label: 'Wednesday', theme: 'What Remains', devotion: { title: 'The Things That Last', scripture: '1 Corinthians 13:13', reading: 'Read 1 Corinthians 13:13 — "And now these three remain: faith, hope and love. But the greatest of these is love." What remains after 8 weeks? Not just the physical changes — what remains in your character, your faith, your capacity to love?', reflection: 'What will you carry forward from this journey? Make a list of the habits, truths, and practices that will remain part of your life permanently.', prayer: 'God, let what remains be what matters. Faith, hope, and love — keep these growing in me.', app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Habit Builder', page: 'HabitBuilderPage' }] }, workout: { title: 'HIIT 30 — Final Intensity Block', workout_id: 'hiit-30', note: 'Second-to-last hard workout. Everything you have.', motivational_tip: 'This is what 8 weeks of showing up looks like. It looks like you doing this workout.', app_links: [{ label: 'Start HIIT 30', page: 'Workouts' }] }, nutrition: { focus: 'Build Your Permanent Blueprint', guidance: 'Write down the 5 foods that have become non-negotiables in your life. These are your anchors going forward — no matter what season you\'re in, these stay.', recipe: { name: 'Blueprint Plate', ingredients: ['1 of your 5 non-negotiable foods as the anchor', 'complementary proteins and vegetables', 'a source of healthy fat'], instructions: 'Build a plate that represents your permanent nutritional foundation.', macros: 'Your standard — know it, own it.', why: 'People who identify their dietary anchors are 3x more likely to maintain healthy eating over 12 months.' }, app_links: [{ label: 'Food Log History', page: 'FoodLogHistory' }] }, reflection: { prompt: 'What habits are you committing to keep after this program ends? Write them as permanent commitments, not intentions.', app_links: [{ label: 'Habit Builder', page: 'HabitBuilderPage' }] } },
          { day: 53, label: 'Thursday', theme: 'Strength for What\'s Next', devotion: { title: 'The Next Chapter', scripture: 'Joshua 1:9', reading: 'Read Joshua 1:9 — "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go." You are about to cross into a new chapter. The same God who led you here will lead you forward.', reflection: 'What is the next "promised land" in your life — the next thing you\'re believing God for beyond these 8 weeks?', prayer: 'God, go before me into the next season. I will be strong and courageous because You are with me.', app_links: [{ label: 'Open Bible to Joshua', page: 'Bible' }, { label: 'Growth Pathways', page: 'GrowthPathwaysPage' }] }, workout: { title: 'Lower Body Blast — Final Leg Day', workout_id: 'lower-body-blast', note: 'Build the strongest foundation possible for everything that comes next.', motivational_tip: 'Every squat today is a step toward the next chapter.', app_links: [{ label: 'Start Lower Body Blast', page: 'Workouts' }] }, nutrition: { focus: 'Forward-Fueling', guidance: 'Today, shop for next week\'s groceries with your 5 non-negotiable foods as the foundation. You\'re not ending a program — you\'re starting a lifestyle.', recipe: { name: 'Cornerstone Grain Bowl', ingredients: ['1 cup quinoa','5 oz grilled chicken or tofu','1 cup roasted vegetables','½ avocado','olive oil, lemon, herbs'], instructions: 'Cook quinoa. Grill protein. Roast vegetables. Assemble. This is your cornerstone meal.', macros: '~500 cal | 40g protein | 48g carbs | 18g fat', why: 'This balanced, whole-food bowl hits every macro and every micronutrient group. Make it your weekly anchor meal.' }, app_links: [{ label: 'Log Meals', page: 'Nutrition' }] }, reflection: { prompt: 'What does "strong and courageous" look like in your daily life going forward?', app_links: [{ label: 'Affirmations', page: 'AffirmationsPage' }] } },
          { day: 54, label: 'Friday', theme: 'The Final Workout', devotion: { title: 'Finish What You Started', scripture: '2 Timothy 4:7', reading: 'Read 2 Timothy 4:7 — "I have fought the good fight, I have finished the race, I have kept the faith." Paul didn\'t say he won every battle or never struggled. He finished. He kept the faith. That\'s the goal.', reflection: 'Write your version of 2 Timothy 4:7 for this 8-week journey. "I have ____. I have ____. I have ____."', prayer: 'God, I finish this race with faith. Thank You for every step.', app_links: [{ label: 'Open Bible to 2 Timothy', page: 'Bible' }] }, workout: { title: 'Athlete Conditioning — The Final Workout', workout_id: 'athlete-conditioning', note: '🏆 THIS IS IT. Your final workout of the 8-week plan. Leave every single thing you have on the floor. You will never do "Week 8 Day 54" again. Make it unforgettable.', motivational_tip: 'Eight weeks ago you started. Today you finish. The person finishing this workout is not the same person who started. That difference is everything.', app_links: [{ label: 'Start Athlete Conditioning', page: 'Workouts' }] }, nutrition: { focus: 'Completion Celebration Meal', guidance: 'Tonight, prepare a beautiful, nourishing meal to celebrate the completion of 8 weeks. Set the table. Light a candle. Eat slowly. Let it be a ritual.', recipe: { name: 'Celebration Salmon & Sweet Potato Feast', ingredients: ['6-8 oz wild salmon','1 large sweet potato (roasted)','1 cup asparagus','2 tbsp olive oil','lemon, garlic, fresh herbs','side salad with lemon vinaigrette','sparkling water with citrus'], instructions: 'Season salmon generously. Roast sweet potato 45 min at 400°F. Sauté asparagus in olive oil and garlic. Pan-sear salmon 4 min per side. Plate beautifully. Celebrate.', macros: '~580 cal | 48g protein | 44g carbs | 22g fat', why: 'This meal is a nutritional masterpiece: omega-3s from salmon, vitamin A and potassium from sweet potato, folate from asparagus. Eat it with pride.' }, app_links: [{ label: 'Log Your Celebration Meal', page: 'Nutrition' }] }, reflection: { prompt: 'Write your 2 Timothy 4:7 version for this journey. Then write: "I am proud of myself because..." and finish that sentence 10 times.', app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }] } },
          { day: 55, label: 'Saturday', theme: 'Share Your Story', devotion: { title: 'Your Testimony Is a Weapon', scripture: 'Revelation 12:11', reading: 'Read Revelation 12:11 — "They triumphed over him by the blood of the Lamb and by the word of their testimony." Your story — even an incomplete one — is a weapon against discouragement in someone else\'s life.', reflection: 'Write your 8-week testimony. Not a highlight reel — the honest version. The hard weeks, the breakthroughs, what surprised you, what changed. Then share it with at least one person.', prayer: 'God, use my story for someone who needs to hear it.', app_links: [{ label: 'Open Bible', page: 'Bible' } ] }, workout: { title: 'Yoga Flow — Celebration Practice', workout_id: 'yoga-flow', note: 'Move with gratitude today. This is a celebration of what your body can do.', motivational_tip: 'You did it. Let today\'s practice be a thank-you to your body.', app_links: [{ label: 'Start Yoga Flow', page: 'Workouts' }] }, nutrition: { focus: 'Share a Meal', guidance: 'Cook for someone today — or take someone out. The most powerful thing you can do with what you\'ve learned is share it. Offer to cook for a friend. Share a recipe. Be generous.', recipe: { name: 'Share-Worthy Overnight Oats Bar', ingredients: ['Make a batch of 6 overnight oats jars','rolled oats, chia seeds, almond milk, honey, vanilla','top each differently: berries, banana, nut butter, granola'], instructions: 'Make 6 jars. Share them with people in your life. Include a note.', macros: 'Per jar: ~310 cal | 10g protein | 46g carbs | 10g fat', why: 'Making something for others is an act of love. And these jars are genuinely delicious.' }, app_links: [{ label: 'Browse Recipes to Share', page: 'DiscoverRecipes' }] }, reflection: { prompt: 'Write the testimony. The real one. Then share it.', app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }] } },
          { day: 56, label: 'Sunday', theme: 'The Beginning', devotion: { title: 'This Is the Start, Not the End', scripture: 'Philippians 3:12-14', reading: 'Read Philippians 3:12-14 — "Not that I have already obtained all this... but I press on to take hold of that for which Christ Jesus took hold of me." Eight weeks is not a finish line — it\'s a launchpad. Press on.', reflection: 'Final reflection: Who are you now? How has your relationship with God changed? Your body? Your mind? Write the most honest, grateful, forward-looking entry you can.', prayer: 'God, thank You for these 8 weeks. I press on. I don\'t stop here. You began something good in me — and I trust You to complete it. Amen.', app_links: [{ label: 'Open Bible to Philippians', page: 'Bible' }, { label: 'Weekly Reflection', page: 'WeeklyReflectionPage' }] }, workout: { title: 'Bedtime Stretch — Final Rest', workout_id: 'bedtime-stretch', note: '🙏 Rest. Honor your body. Be still and know that He is God.', motivational_tip: 'You finished. You kept the faith. This is just the beginning.', app_links: [{ label: 'Final Bedtime Stretch', page: 'Workouts' }] }, nutrition: { focus: 'Sustaining Lifestyle', guidance: 'Today: write your personal nutrition manifesto. 5-10 principles that govern how you eat going forward. Not rules — values. How you nourish yourself is an expression of how you value yourself.', recipe: { name: 'The Journey Bowl — Your Signature Recipe', ingredients: ['Your personal non-negotiable protein','Your favorite grain','Your go-to vegetable','Your trusted healthy fat','The sauce or dressing you always come back to'], instructions: 'Make it. Photograph it. Name it. This is yours. You earned it.', macros: 'The best macros are the ones you\'ll sustain for life.', why: 'This is no longer a "recipe" — it\'s a ritual. A marker of who you\'ve become.' }, app_links: [{ label: 'Food Log History', page: 'FoodLogHistory' }] }, reflection: { prompt: '8 weeks. 56 days. Who are you now?\n\nWrite freely for as long as it takes. This entry is for your future self — the one who will open this journal a year from now and remember who they were when they pressed through.\n\nPress on.', app_links: [{ label: 'Final Journal Entry', page: 'MyJournalEntries' }, { label: 'Weekly Reflection', page: 'WeeklyReflectionPage' }] } }
        ]
      }
    ]
  }
];

COACHING_PLANS.push({
  id: 'love-languages-relationships',
  title: 'Love That Lasts',
  subtitle: '8-Week Relationship Transformation',
  description: 'An 8-week journey rooted in the Five Love Languages — Words of Affirmation, Acts of Service, Receiving Gifts, Quality Time, and Physical Touch — combined with Scripture and inner healing work. Whether you\'re growing a marriage, repairing a friendship, deepening family bonds, or learning to love yourself the way God loves you, this plan will transform how you give and receive love.',
  theme_verse: '"Above all, love each other deeply, because love covers over a multitude of sins." — 1 Peter 4:8',
  coach: 'Hannah',
  difficulty: 'beginner',
  duration_weeks: 8,
  category: 'relationships',
  color_from: '#e11d48',
  color_to: '#0A1A2F',
  emoji: '❤️',
  tags: ['Relationships', 'Faith', 'Mindset', 'Journaling', 'Healing'],
  weeks: [
    {
      week: 1,
      theme: 'The Foundation of Love',
      theme_verse: '1 Corinthians 13:4-5 — "Love is patient, love is kind. It does not envy, it does not boast, it is not proud."',
      overview: 'Before we can love others well, we have to understand what love actually is — not Hollywood love, not transactional love, but the kind God modeled for us. This week we lay the foundation: discovering your primary love language, understanding how you received love growing up, and identifying where your love patterns may have broken down.',
      focus_color: '#e11d48',
      days: [
        {
          day: 1, label: 'Monday',
          theme: 'What Is Love, Really?',
          devotion: {
            title: 'God Defined It First',
            scripture: '1 John 4:8',
            reading: 'Read 1 John 4:8 — "Whoever does not love does not know God, because God is love." Love isn\'t just something God does — it\'s who He is. Every healthy relationship you build this week starts from understanding the source.',
            reflection: 'Journal: What was the primary way love was shown to you growing up? Was it through words, actions, time, gifts, or touch? How has that shaped how you give and receive love today?',
            prayer: 'God, teach me to love the way You love — patient, kind, and unconditional. Show me where my understanding of love has been distorted.',
            app_links: [{ label: 'Open Bible to 1 John', page: 'Bible' }, { label: 'Write in Journal', page: 'MyJournalEntries' }]
          },
          mindset_work: {
            title: 'Discover Your Love Language',
            exercise: 'Take the Love Language self-assessment: For each pair, choose which matters more to you. (A) Hearing "I love you / I\'m proud of you" vs (B) Someone doing something helpful for you without being asked. (A) Receiving a thoughtful gift vs (B) Having someone\'s undivided attention. (A) A long hug or physical closeness vs (B) Someone writing you a heartfelt note. Tally your answers. Which came up most? That\'s likely your primary love language.',
            prompt: 'Write down your top 2 love languages and one specific memory where you felt deeply loved in that language. What made that moment so meaningful?',
            app_links: [{ label: 'Open Affirmations', page: 'AffirmationsPage' }, { label: 'Journal Entry', page: 'MyJournalEntries' }]
          },
          relationship_challenge: {
            title: 'The Love Language Audit',
            action: 'Think of your most important relationship right now. Without asking them, write down what you think their primary love language is. What evidence do you have? What have they complained about that they never receive? What do they ask for most often?',
            scripture_anchor: 'Philippians 2:4 — "Not looking to your own interests but each of you to the interests of the others."'
          },
          reflection: {
            prompt: 'What is the gap between how you naturally show love and how the people in your life actually need to receive it?',
            app_links: [{ label: 'Emotional Check-In', page: 'EmotionalCheckInPage' }]
          }
        },
        {
          day: 2, label: 'Tuesday',
          theme: 'Words of Affirmation',
          devotion: {
            title: 'The Power of the Spoken Word',
            scripture: 'Proverbs 18:21',
            reading: 'Read Proverbs 18:21 — "The tongue has the power of life and death." Words are not neutral. Every conversation you have either deposits life or withdraws it. People whose love language is Words of Affirmation don\'t just want compliments — they need verbal acknowledgment that they are seen, valued, and appreciated.',
            reflection: 'Think of the most encouraging words anyone has ever spoken over you. Write them down. How did those words change you? How long did they stay with you?',
            prayer: 'God, set a guard over my mouth today. Let every word I speak deposit life into the people around me.',
            app_links: [{ label: 'Open Bible to Proverbs', page: 'Bible' }, { label: 'Affirmations', page: 'AffirmationsPage' }]
          },
          mindset_work: {
            title: 'Write It Out',
            exercise: 'Identify 3 people in your life. For each one, write 5 genuine, specific affirmations — not "you\'re great" but "the way you show up for your friends without being asked shows a depth of character I genuinely admire." Specificity is what makes affirmations land.',
            prompt: 'What words do you wish someone would say to you that you\'ve never heard? Write them to yourself first.',
            app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }]
          },
          relationship_challenge: {
            title: 'Say It Out Loud',
            action: 'Send one genuine, specific written affirmation to someone in your life today. Not a text emoji — a real sentence. "I noticed that you... and it means more than you know." Watch what happens.',
            scripture_anchor: 'Ephesians 4:29 — "Do not let any unwholesome talk come out of your mouths, but only what is helpful for building others up."'
          },
          reflection: {
            prompt: 'How do critical or negative words from your past still affect how you speak to yourself or others today?',
            app_links: [{ label: 'Mindset Reset', page: 'MindsetResetPage' }]
          }
        },
        {
          day: 3, label: 'Wednesday',
          theme: 'Acts of Service',
          devotion: {
            title: 'Love in Action',
            scripture: 'Mark 10:45',
            reading: 'Read Mark 10:45 — "For even the Son of Man did not come to be served, but to serve." Jesus, the King of the universe, washed His disciples\' feet. Acts of Service isn\'t about being a servant with no boundaries — it\'s about choosing to show love through action for someone whose heart opens when people do things for them.',
            reflection: 'Is there someone in your life whose love language might be Acts of Service — who always seems to notice when you do (or don\'t) help, who says "you never do anything around here" or "I have to do everything myself"? What are they really saying?',
            prayer: 'Jesus, You served without ego. Help me see service as love, not as weakness.',
            app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Prayer', page: 'Prayer' }]
          },
          mindset_work: {
            title: 'The Request vs. The Love',
            exercise: 'Make a list of things the important people in your life have asked you to do repeatedly. These repeated requests are almost always unmet love language needs in disguise. The person who keeps asking you to clean up, help with dinner, or plan ahead — they\'re not nagging. They\'re saying "I feel loved when you do these things for me."',
            prompt: 'Write about one person whose repeated requests you\'ve interpreted as nagging or controlling. Reframe: what might they really be asking for?',
            app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }]
          },
          relationship_challenge: {
            title: 'Do One Unsolicited Thing',
            action: 'Today, do one act of service for someone without being asked and without telling them you did it. Clean something, handle something they\'ve been meaning to do, take something off their plate. Notice how it feels to serve without recognition.',
            scripture_anchor: 'Galatians 5:13 — "Serve one another humbly in love."'
          },
          reflection: {
            prompt: 'Where does serving others feel like burden vs. gift to you? What\'s the difference in those moments?',
            app_links: [{ label: 'Emotional Check-In', page: 'EmotionalCheckInPage' }]
          }
        },
        {
          day: 4, label: 'Thursday',
          theme: 'Receiving Gifts',
          devotion: {
            title: 'The Symbol Behind the Gift',
            scripture: 'James 1:17',
            reading: 'Read James 1:17 — "Every good and perfect gift is from above." For people whose love language is Receiving Gifts, it\'s never about the money or the object. It\'s about what the gift communicates: you were on my mind, I thought of you, you matter enough for me to mark this moment. God Himself speaks this language — He gave us His Son.',
            reflection: 'Think of a gift — however small — that someone gave you that meant everything. What made it so meaningful? What did it communicate that words couldn\'t?',
            prayer: 'God, thank You for Your gifts — the seen and the unseen. Help me become someone who marks the moments that matter in the lives of those I love.',
            app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Gratitude Journal', page: 'GratitudeJournalPage' }]
          },
          mindset_work: {
            title: 'Mark the Moments',
            exercise: 'The gift-language person doesn\'t need expensive. They need thoughtful. Make a list of 5 people you love and one meaningful, low-cost or free gesture you could give each one that would say "I see you." It could be a handwritten note, a photo you print and frame, their favorite coffee, a playlist, a book.',
            prompt: 'Have you ever dismissed someone\'s hurt feelings when you forgot a birthday, anniversary, or moment that mattered to them? Reread that through the lens of their love language.',
            app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }]
          },
          relationship_challenge: {
            title: 'Give Without an Occasion',
            action: 'Give someone a small, thoughtful, unexpected gift today — something that says "I thought of you." It doesn\'t have to cost anything. A note. A flower. Their favorite snack. The thought is the point.',
            scripture_anchor: '2 Corinthians 9:7 — "God loves a cheerful giver."'
          },
          reflection: {
            prompt: 'Are you better at giving or receiving? What does that tell you about how you were taught to love?',
            app_links: [{ label: 'Emotional Check-In', page: 'EmotionalCheckInPage' }]
          }
        },
        {
          day: 5, label: 'Friday',
          theme: 'Quality Time',
          devotion: {
            title: 'Presence Is the Present',
            scripture: 'Psalm 46:10',
            reading: 'Read Psalm 46:10 — "Be still, and know that I am God." Even God speaks this language. He doesn\'t just want your requests — He wants your presence. People whose love language is Quality Time don\'t need grand events. They need you fully there — phone down, eyes up, heart open.',
            reflection: 'When was the last time you were fully present with someone you love — not distracted, not multitasking, not halfway somewhere else? What made that time special?',
            prayer: 'Lord, teach me to be fully present — with You, and with the people You\'ve placed in my life.',
            app_links: [{ label: 'Guided Meditation', page: 'GuidedMeditationsPage' }, { label: 'Open Bible', page: 'Bible' }]
          },
          mindset_work: {
            title: 'Phone-Free Time Experiment',
            exercise: 'Schedule one hour today that is completely phone-free with another person OR alone in reflection. No notifications, no checking. Full presence. After, journal: What did you notice? What was hard? What opened up when the distractions were removed?',
            prompt: 'Who in your life is quietly starving for your undivided attention? What has it cost that relationship?',
            app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }]
          },
          relationship_challenge: {
            title: 'Schedule the Time',
            action: 'Block out and protect one intentional Quality Time event with someone important to you this week. Put it in your calendar. Guard it like a meeting you can\'t cancel. Show up fully.',
            scripture_anchor: 'Ecclesiastes 3:1 — "There is a time for everything, and a season for every activity under the heavens."'
          },
          reflection: {
            prompt: 'What habits or devices are stealing your presence from the relationships that matter most?',
            app_links: [{ label: 'Habit Builder', page: 'HabitBuilderPage' }]
          }
        },
        {
          day: 6, label: 'Saturday',
          theme: 'Physical Touch',
          devotion: {
            title: 'The Healing in Human Contact',
            scripture: 'Matthew 8:3',
            reading: 'Read Matthew 8:3 — "Jesus reached out his hand and touched the man." The leper hadn\'t been touched in years. Jesus could have healed him with a word. He chose to touch him first. For people whose love language is Physical Touch, connection is communicated through the body — a hug, a hand on the shoulder, being physically close.',
            reflection: 'Think about the role physical connection has played in your most important relationships. Have you been starved for it? Have you withheld it? Has it been used against you in a way that made this language complicated?',
            prayer: 'Jesus, You touched the untouchable. Help me be someone whose presence brings comfort and safety to others.',
            app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Journal Entry', page: 'MyJournalEntries' }]
          },
          mindset_work: {
            title: 'Presence and Safety',
            exercise: 'Physical Touch as a love language is about safety and connection, not just physical contact. Write about what makes physical presence feel safe vs. unsafe for you. Then: is there someone in your life who needs more physical affirmation — a hug, a hand squeeze, a pat on the back — that you\'ve been withholding?',
            prompt: 'What does "safe closeness" look like in your healthiest relationships? How do you cultivate that?',
            app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }]
          },
          relationship_challenge: {
            title: 'Be Present Physically',
            action: 'Today, offer one meaningful physical gesture of connection to someone you love — a longer hug than usual, sitting close, a hand on their arm when they\'re struggling. Be intentional. Notice their response.',
            scripture_anchor: 'Romans 16:16 — "Greet one another with a holy kiss." (The culture of warm, genuine human connection in the early church.)'
          },
          reflection: {
            prompt: 'Week 1 reflection: Which love language felt most natural to practice this week? Which was hardest? What does that tell you?',
            app_links: [{ label: 'Weekly Reflection', page: 'WeeklyReflectionPage' }]
          }
        },
        {
          day: 7, label: 'Sunday',
          theme: 'Sabbath & Self-Love',
          devotion: {
            title: 'You Cannot Pour from Empty',
            scripture: 'Matthew 22:39',
            reading: 'Read Matthew 22:39 — "Love your neighbor as yourself." The command assumes self-love. Not narcissism — dignity. Jesus didn\'t say love your neighbor instead of yourself. He said "as." You cannot give what you don\'t have. Today we rest and receive.',
            reflection: 'In what ways have you been loving others from an empty tank? What does your own soul need right now — what love language do you need to receive?',
            prayer: 'God, I receive Your love today. Fill me so that I have something real to give.',
            app_links: [{ label: 'Guided Meditation', page: 'GuidedMeditationsPage' }, { label: 'Prayer', page: 'Prayer' }]
          },
          mindset_work: {
            title: 'Speak Your Language to Yourself',
            exercise: 'Identify your top love language and intentionally give it to yourself today. If Words of Affirmation: write 10 true, kind things about yourself. If Quality Time: spend an hour doing something you genuinely enjoy alone. If Gifts: buy yourself something small and meaningful. If Acts of Service: do one thing for Future You (prep, organize, plan). If Physical Touch: get a massage, take a bath, stretch slowly.',
            prompt: 'What would it mean to treat yourself with the same love and intentionality you\'re learning to show others?',
            app_links: [{ label: 'Affirmations', page: 'AffirmationsPage' }, { label: 'Journal Entry', page: 'MyJournalEntries' }]
          },
          relationship_challenge: {
            title: 'Rest As an Act of Love',
            action: 'Protect today as a day of rest. Do not catch up on work, obligations, or relationship labor. Let yourself be loved — by God, and by whatever restores your soul.',
            scripture_anchor: 'Psalm 23:2-3 — "He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul."'
          },
          reflection: {
            prompt: 'What do you most want from your relationships that you haven\'t been able to ask for? Start by writing it here.',
            app_links: [{ label: 'Emotional Check-In', page: 'EmotionalCheckInPage' }]
          }
        }
      ]
    },
    {
      week: 2,
      theme: 'Understanding Your Partner / Person',
      theme_verse: 'Philippians 2:3-4 — "In humility value others above yourselves, not looking to your own interests but each of you to the interests of the others."',
      overview: 'This week we go deeper — learning to truly understand the person you\'re trying to love. Most relationship conflict isn\'t about what it seems to be about. Underneath every argument is usually an unmet love language need. This week you\'ll learn to listen at a deeper level, ask better questions, and begin the process of speaking someone else\'s language fluently.',
      focus_color: '#be123c',
      days: Array.from({ length: 7 }, (_, i) => ({
        day: 8 + i, label: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i],
        theme: ['Listening to Understand','The Complaint Is the Clue','Their Story Shapes Their Language','Asking the Right Questions','Breaking Old Patterns','Practice Week','The Mid-Point Check-In'][i],
        devotion: {
          title: ['Hear Before You Speak','What Are They Really Saying?','Love Formed in Childhood','The Power of a Good Question','Old Patterns, New Choices','Consistency Is Love','Pause and Assess'][i],
          scripture: ['James 1:19','Proverbs 20:5','Psalm 139:13-14','Proverbs 20:5','Romans 12:2','1 Corinthians 13:7','Lamentations 3:40'][i],
          reading: [
            'Read James 1:19 — "Everyone should be quick to listen, slow to speak and slow to become angry." Most people listen to respond. This week\'s challenge: listen to understand. There is a huge difference.',
            'Read Proverbs 20:5 — "The purposes of a person\'s heart are deep waters, but one who has insight draws them out." A complaint is always a surface-level expression of a deeper need. "You never spend time with me" = Quality Time. "You don\'t appreciate anything I do" = Acts of Service. "You forgot our anniversary" = Receiving Gifts. Learn to hear what\'s underneath.',
            'Read Psalm 139:13-14 — God formed your partner or friend in their mother\'s womb, with their entire history. The way they give and receive love was largely shaped before they met you. Understanding their story changes how you respond to their behavior.',
            'Read Proverbs 20:5 again. Good questions draw out deep water. "How are you?" draws nothing. "What\'s been weighing on you this week that you haven\'t said out loud yet?" draws out soul.',
            'Read Romans 12:2 — "Be transformed by the renewing of your mind." Old relationship patterns aren\'t destiny. They\'re defaults. You can choose a new pattern — but it takes awareness, intention, and grace.',
            '1 Corinthians 13:7 — Love "always perseveres." Consistency is one of the most profound expressions of love there is. Showing up the same way on the 400th day as the first — that\'s love as a decision.',
            'Lamentations 3:40 — "Let us examine our ways and test them, and let us return to the Lord." Midway through Week 2 — pause and assess. Not to judge yourself, but to see clearly.'
          ][i],
          reflection: [
            'Think of your last significant argument. What was it really about underneath? What love language need was going unmet?',
            'Write the last 3 complaints or criticisms you received from someone close to you. Translate each one: what love language were they actually expressing?',
            'What do you know about how the important people in your life experienced love (or its absence) growing up? How might that history show up in your relationship with them today?',
            'Write 5 questions you\'ve never asked someone important to you — questions that could genuinely change how well you know them.',
            'What is one relationship pattern you keep repeating that you\'re ready to break? What would the new pattern look like?',
            'What is one consistent, small action you could take every single day this week that would make someone feel loved in their language?',
            'Week 2 check-in: What has surprised you most about someone you love since starting this plan?'
          ][i],
          prayer: [
            'God, slow my tongue and open my ears. Help me hear what is really being said.',
            'Give me insight, Lord, to hear what\'s underneath the surface.',
            'Help me hold the story of the people I love with tenderness, not judgment.',
            'Give me the courage to ask the questions that draw out deep water.',
            'Lord, transform my relational defaults. Help me choose love over reaction.',
            'Let my consistency be a form of love today.',
            'Help me see clearly, Lord. Not to judge — but to grow.'
          ][i],
          app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Journal Entry', page: 'MyJournalEntries' }]
        },
        mindset_work: {
          title: ['The Listening Exercise','Translation Practice','The Backstory Map','The Deep Question List','Pattern Interrupt','Daily Love Language Deposit','Week 2 Review'][i],
          exercise: [
            'Today, in every significant conversation, practice one rule: ask one follow-up question before sharing your own perspective. Just one. "Tell me more about that." "What did that feel like?" "What do you need from me right now?" Notice how the conversation changes.',
            'Take the 3 complaints from your devotion reflection and write a "translation" for each. Then write what a loving, language-specific response to each would look like.',
            'Draw or write a brief "love map" for someone you love: What are their biggest stressors? What are their deepest fears? What brings them the most joy? What was love like for them growing up? What do they dream about? Most people have never done this exercise. It\'s transformative.',
            'Write the 5 questions from your devotion. Then this week, ask at least 2 of them — not in an interview style, but woven naturally into real conversation.',
            'Identify one moment this week when you felt yourself sliding into an old pattern. Write: what triggered it, what the old response would have been, and what you chose instead.',
            'Commit to one daily love language deposit for one person this week. Small, consistent, specific. Track it each day.',
            'Review the week: Where did you grow? Where did you fall back into old patterns? What will you carry into Week 3?'
          ][i],
          prompt: [
            'What makes it hard for you to truly listen without preparing your response?',
            'Which complaint is the hardest to translate with compassion rather than defensiveness?',
            'What gaps exist in your "love map" of someone close to you? What don\'t you know that you should?',
            'What question are you most afraid to ask someone you love? Why?',
            'What triggers you most in close relationships? Where does that trigger come from?',
            'How does it feel to love consistently even when you don\'t feel like it?',
            'What has Week 2 revealed about how you relate to the people you love?'
          ][i],
          app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }, { label: 'Emotional Check-In', page: 'EmotionalCheckInPage' }]
        },
        relationship_challenge: {
          title: ['Ask Before Assuming','Reframe the Complaint','Learn Their Story','Ask the Deep Question','Choose the New Pattern','Make the Daily Deposit','Celebrate Progress'][i],
          action: [
            'Before assuming you know what someone means today, ask a clarifying question. "What I\'m hearing is ___. Is that right?"',
            'The next time someone complains to you, try to identify the love language underneath before responding.',
            'Ask someone you love about their childhood experience of love today. "How did the people who raised you show love?" Listen without judgment.',
            'Ask one of your "deep questions" to someone this week in a natural moment of conversation.',
            'When you feel an old pattern triggered today, pause for 5 seconds before responding. Use those 5 seconds to choose.',
            'Make your daily love language deposit every single day this week without announcing it.',
            'Tell someone you\'ve been doing this work what you\'ve noticed about them. Share an observation, not a critique.'
          ][i],
          scripture_anchor: ['James 1:19','Proverbs 20:5','Psalm 139:13','Proverbs 18:13','Romans 12:2','1 Corinthians 13:8','Hebrews 10:24'][i]
        },
        reflection: {
          prompt: [
            'What did you hear differently today when you slowed down to listen?',
            'What complaint from someone you love have you been responding to at the surface level instead of the need beneath it?',
            'How does knowing someone\'s backstory change how you respond to their behavior?',
            'What happened when you asked a deeper question? What opened up?',
            'What did you choose this week that your old self wouldn\'t have?',
            'What does consistency in love feel like — both to give and to receive?',
            'What is the most important thing you\'ve learned about love in two weeks?'
          ][i],
          app_links: [{ label: i === 6 ? 'WeeklyReflectionPage' : 'MyJournalEntries', page: i === 6 ? 'WeeklyReflectionPage' : 'MyJournalEntries' }]
        }
      }))
    },
    {
      week: 3,
      theme: 'Words of Affirmation — Deep Dive',
      theme_verse: 'Ephesians 4:29 — "Do not let any unwholesome talk come out of your mouths, but only what is helpful for building others up according to their needs."',
      overview: 'Words are one of the most underused and most misused tools in relationships. This week we go all-in on the language of affirmation — learning to speak life over others, confront lovingly, apologize well, and break the habit of critical, careless, or withholding speech.',
      focus_color: '#9f1239',
      days: Array.from({ length: 7 }, (_, i) => ({
        day: 15 + i, label: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i],
        theme: ['Specific Praise','Encouragement in Hard Times','The Apology Language','Speaking Life Over Children','Loving Confrontation','Gratitude Out Loud','Sabbath Words'][i],
        devotion: {
          title: ['Say It Specifically','Words That Hold People Up','Saying Sorry Well','Blessing the Next Generation','Truth in Love','The Gratitude Voice','Rest the Tongue'][i],
          scripture: ['1 Thessalonians 5:11','Hebrews 10:24-25','Matthew 5:23-24','Proverbs 22:6','Ephesians 4:15','1 Thessalonians 5:18','Psalm 19:14'][i],
          reading: [
            'Read 1 Thessalonians 5:11 — "Encourage one another and build each other up." Generic praise bounces off people. Specific praise penetrates. "You\'re amazing" means little. "The way you stayed calm in that meeting when everyone else panicked — that\'s rare, and it matters" — that lands.',
            'Read Hebrews 10:24-25 — "Spur one another on toward love and good deeds." The people in your life are fighting battles you can\'t see. Your words of encouragement might be the only fuel they get today.',
            'Read Matthew 5:23-24. Before going to God with your offering, go reconcile with your brother. A good apology is one of the most healing things a human can offer another. A bad one re-wounds.',
            'Read Proverbs 22:6. The words you speak over children shape their identity. This applies to anyone younger than you, anyone you lead, anyone who looks up to you.',
            'Read Ephesians 4:15 — "Speaking the truth in love." Truth without love is brutality. Love without truth is flattery. The skill is holding both at once.',
            'Read 1 Thessalonians 5:18 — "Give thanks in all circumstances." Gratitude expressed out loud is a gift to the person receiving it and to yourself.',
            'Read Psalm 19:14 — "May these words of my mouth and this meditation of my heart be pleasing in your sight, Lord." A prayer worth making every morning.'
          ][i],
          reflection: [
            'Think of a time someone gave you a specific compliment that changed how you saw yourself. What was it? Why did it land?',
            'Who in your life is fighting a battle right now that you haven\'t acknowledged? What words do they need to hear?',
            'How do you typically apologize? Is your apology about relieving your own guilt or genuinely healing the other person?',
            'What words have you spoken over a child, younger person, or someone you lead that you wish you could take back? What would you say instead?',
            'What truth have you been withholding from someone you love out of fear? What is the cost of that silence?',
            'Who have you never fully thanked — someone whose impact on your life you\'ve felt but never voiced?',
            'What words have you been speaking over yourself this week? Are they words of life or words of limitation?'
          ][i],
          prayer: [
            'Lord, help me see specifically. Help me name what I notice and say it out loud.',
            'Use my words today to hold someone up who is about to fall.',
            'God, give me the humility to apologize well — not to feel better, but to heal.',
            'Let the words I speak over the young people in my life be seeds of identity and destiny.',
            'Give me the courage to speak truth and the wisdom to hold it gently.',
            'I don\'t say thank you enough. Let today be different.',
            'Guard my tongue today, Lord. Let what comes out of my mouth be worthy of Your ear.'
          ][i],
          app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Affirmations', page: 'AffirmationsPage' }]
        },
        mindset_work: {
          title: ['The Specificity Practice','Write the Encouragement Letter','The Full Apology Framework','Blessing Exercise','The Loving Confrontation Script','Gratitude Letter','Affirmation Day'][i],
          exercise: [
            'For every compliment or affirmation you give today, add a "because" — "I appreciate you because..." or "That was impressive because..." The "because" is what makes it land.',
            'Write a full letter of encouragement to someone who is struggling. Don\'t send it yet. Write it as if it might be the last letter they ever receive from you. Then decide whether to share it.',
            'The Five Languages of Apology (Gary Chapman): (1) Expressing regret — "I\'m sorry." (2) Accepting responsibility — "I was wrong." (3) Making restitution — "What can I do to make it right?" (4) Genuine repentance — "I\'ll work to not repeat this." (5) Requesting forgiveness — "Will you forgive me?" Most apologies only include #1. Try using all five.',
            'Speak a genuine blessing over someone today — not a wish but a declaration. "I see in you the capacity to ___. I believe God is going to use that in ___." Say it to their face.',
            'Write out a confrontation you\'ve been avoiding. Use this structure: "When you ___ I feel ___ because ___. What I need is ___." Practice saying it out loud alone first.',
            'Write a full letter of gratitude to someone who\'s never been fully thanked. Unlike the encouragement letter — send this one.',
            'Write 10 affirmations about yourself. Not aspirations — truths. Things that are already true. Read them aloud.'
          ][i],
          prompt: [
            'What would change in your relationships if every compliment you gave was specific?',
            'Who needs your encouragement most right now? What are you waiting for?',
            'What would it feel like to receive a truly full apology from someone who hurt you? Have you ever given one?',
            'What identity words are you speaking over the people who look up to you?',
            'What truth have you been softening so much it lost its power? What would it sound like spoken with both love and clarity?',
            'Why is it hard to express gratitude out loud, even when we feel it deeply?',
            'What are the words your soul most needs to hear right now?'
          ][i],
          app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }, { label: 'Affirmations', page: 'AffirmationsPage' }]
        },
        relationship_challenge: {
          title: ['Specific Compliment Day','Send the Letter','Practice the Apology','Speak a Blessing','Have the Conversation','Send Gratitude','Rest in Truth'][i],
          action: [
            'Give 3 specific, genuine compliments today — each one with a "because."',
            'Share your encouragement letter with the person it was written for.',
            'If there\'s an apology you owe someone, write the full five-part version and deliver it — in person, by phone, or in a letter.',
            'Speak a genuine blessing over a child, younger person, or someone who needs to hear it.',
            'Have one honest, loving conversation you\'ve been avoiding. Use the framework. Be gentle but clear.',
            'Send your gratitude letter today. Don\'t wait for the right moment.',
            'Rest. Say kind things to yourself and let today be a day of receiving words of life from God\'s own Word.'
          ][i],
          scripture_anchor: ['1 Thessalonians 5:11','Hebrews 10:24','James 5:16','Numbers 6:24-26','Ephesians 4:15','Colossians 3:17','Psalm 19:14'][i]
        },
        reflection: {
          prompt: [
            'What specific thing did you notice about someone today that you\'ve never said out loud before?',
            'What did writing the encouragement letter reveal about how much you actually see this person?',
            'What does your typical apology reveal about who you\'re really trying to make feel better?',
            'What happened when you spoke a blessing? How did it land?',
            'How did it feel to speak truth in love? What was the hardest part?',
            'What did expressing gratitude out loud feel like — for you and for them?',
            'Summarize Week 3: how has your relationship with words changed?'
          ][i],
          app_links: [{ label: i === 6 ? 'WeeklyReflectionPage' : 'MyJournalEntries', page: i === 6 ? 'WeeklyReflectionPage' : 'MyJournalEntries' }]
        }
      }))
    },
    {
      week: 4,
      theme: 'Quality Time — Deep Dive',
      theme_verse: 'Ecclesiastes 4:9-10 — "Two are better than one... If either of them falls down, one can help the other up."',
      overview: 'Presence is one of the rarest gifts in the modern world. This week we go deep on the love language of Quality Time — what it means to be truly present, how to protect time in a distracted world, how to create rituals of connection, and what shared experience does for the bond between people.',
      focus_color: '#881337',
      days: Array.from({ length: 7 }, (_, i) => ({
        day: 22 + i, label: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i],
        theme: ['Undivided Attention','The Date That Matters','Shared Activities','Family Rituals','Quality Over Quantity','Presence in Pain','The Sabbath as Connection'][i],
        devotion: {
          title: ['Put the Phone Down','Creating Space to Connect','Doing Life Together','Anchoring the Family','Time Is Currency','Sitting in the Dark Together','Sacred Time'][i],
          scripture: ['Matthew 6:21','Song of Solomon 2:10-12','Luke 10:38-42','Deuteronomy 6:6-7','Ephesians 5:15-16','Job 2:11-13','Mark 6:31'][i],
          reading: [
            'Read Matthew 6:21 — "Where your treasure is, there your heart will be also." Time is treasure. What you spend your time on reveals what you actually value — not what you say you value.',
            'Read Song of Solomon 2:10-12 — "My beloved spoke and said to me, \'Rise up, come away.\'" The beloved invites the other into an intentional experience. Quality time relationships thrive on invitation — "Come away with me. I want to be with you specifically."',
            'Read Luke 10:38-42. Martha is doing everything. Mary is just being with Jesus. Jesus says Mary chose better. Sometimes the most loving thing is not to do more — it\'s to stop and be present.',
            'Read Deuteronomy 6:6-7. These commands were given for everyday rhythms — walking, lying down, getting up. Intentional connection happens in the margins of ordinary life, not just on special occasions.',
            'Read Ephesians 5:15-16 — "Making the most of every opportunity." Quality time doesn\'t require hours. It requires intention. Five fully-present minutes beats two hours of distracted togetherness.',
            'Read Job 2:11-13. When Job\'s friends arrived, they sat with him in silence for seven days. They didn\'t fix. They didn\'t explain. They showed up and stayed. That is one of the most profound acts of love in Scripture.',
            'Read Mark 6:31 — "Come with me by yourselves to a quiet place and get some rest." Jesus built rhythms of withdrawal and rest into His own life. Sabbath rest is relational — with God and with those you love.'
          ][i],
          reflection: [
            'How do the people closest to you experience your presence? Are you physically there but emotionally elsewhere?',
            'When was the last time you created an intentional experience — not just spent time together, but planned something specifically for someone?',
            'Is there a "Mary vs. Martha" tension in your closest relationships? Are you doing instead of being?',
            'What are the natural connection rituals in your household or relationships? Which ones have faded? Which ones could be restored?',
            'Think of a 5-minute conversation recently that felt like it mattered more than an hour with the same person on another day. What made the difference?',
            'Think of someone who sat with you in pain without trying to fix it. What did their presence mean?',
            'What does Sabbath — true rest and connection — look like for you?'
          ][i],
          prayer: [
            'God, help me put down what\'s distracting me and pick up what actually matters.',
            'Lord, give me the creativity to create moments that say "you are worth my full attention."',
            'Help me resist the pull to do and instead just be — with You and with the people I love.',
            'God, build connection into the ordinary moments of my life.',
            'Let five minutes of full presence be worth more than hours of distraction.',
            'Give me the gift of showing up in pain without needing to fix it.',
            'God, I receive rest today — with You, and with the ones I love.'
          ][i],
          app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Guided Meditation', page: 'GuidedMeditationsPage' }]
        },
        mindset_work: {
          title: ['The Presence Audit','Plan the Experience','The Shared Activity List','The Ritual Map','The 10-Minute Presence Practice','The Sit-With Exercise','Sabbath Connection Plan'][i],
          exercise: [
            'Audit your last 48 hours: when were you physically present with someone but mentally elsewhere? What pulled your attention away? What would full presence have looked like in those moments?',
            'Plan one intentional Quality Time experience for someone whose love language is Quality Time (or for yourself). It doesn\'t need to be expensive — it needs to be specific to them: their favorite restaurant, activity, or place.',
            'Make a list of activities you genuinely enjoy doing with other people. Then ask the important person in your life to make their own list. Find the overlap. Schedule one.',
            'Map your relationship rituals: What do you do consistently together that anchors your connection? (Morning coffee, evening walk, Sunday dinner, weekly call.) Which ones are working? Which have been lost? Which new one would you most want to create?',
            'Practice 10 minutes of completely undistracted presence with someone today. No agenda, no phones, no multitasking. Just be with them and be curious about them.',
            'Think of someone who is currently going through pain. Practice the discipline of NOT giving advice — instead, write what it would look like to simply show up and sit with them.',
            'Design your ideal Sabbath: what does a day of true rest and connection look like for you? Who is in it? What do you do? What do you protect it from?'
          ][i],
          prompt: [
            'What would the people closest to you say about the quality of your presence?',
            'What experience could you create for someone this week that says "I planned this specifically for you"?',
            'What shared activity has built the deepest connection in your life? Why did it work?',
            'What ritual from your past do you miss? Is it possible to restore it?',
            'What does it feel like to have someone\'s full, undivided attention? When did you last give it?',
            'What makes it hard to sit with someone in pain without trying to fix them?',
            'What does your soul most need in a Sabbath rest right now?'
          ][i],
          app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }, { label: 'Habit Builder', page: 'HabitBuilderPage' }]
        },
        relationship_challenge: {
          title: ['Phone-Free Hour','Book the Experience','Do the Activity','Create a New Ritual','10-Minute Presence','Show Up','Take the Rest'][i],
          action: [
            'Spend one full hour phone-free with someone you love today.',
            'Book or plan the Quality Time experience. Put it on the calendar.',
            'Do the overlapping activity from your lists this week.',
            'Start one new small connection ritual this week — something you can sustain.',
            'Practice 10 minutes of full presence today. Do it daily for the rest of the week.',
            'Reach out to someone in pain and offer your presence — not your advice.',
            'Protect today as Sabbath. Be with God, be with people you love, be with yourself.'
          ][i],
          scripture_anchor: ['Matthew 6:21','Song of Solomon 2:10','Luke 10:42','Deuteronomy 6:7','Ephesians 5:16','Job 2:13','Mark 6:31'][i]
        },
        reflection: {
          prompt: [
            'What distracted you from presence today? What would it take to protect against that?',
            'What does planning an experience say to the person you\'re planning it for?',
            'What happens inside you when you do something you love with someone you love?',
            'What would consistent connection rituals change in your most important relationships?',
            'What did 10 minutes of full presence reveal?',
            'What is the difference between being with someone and being present with them?',
            'Week 4 reflection: what has this week taught you about time, presence, and love?'
          ][i],
          app_links: [{ label: i === 6 ? 'WeeklyReflectionPage' : 'MyJournalEntries', page: i === 6 ? 'WeeklyReflectionPage' : 'MyJournalEntries' }]
        }
      }))
    },
    {
      week: 5,
      theme: 'Acts of Service — Deep Dive',
      theme_verse: 'Galatians 5:13 — "Serve one another humbly in love."',
      overview: 'Service is love made visible. This week we explore what it means to love through action — not as obligation, but as gift. We\'ll work through the difference between serving from love vs. serving from fear, how to identify what service means to the people around you, and how to sustain a life of loving service without burning out.',
      focus_color: '#e11d48',
      days: Array.from({ length: 7 }, (_, i) => ({
        day: 29 + i, label: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i],
        theme: ['Service vs. Servitude','The Unexpected Help','Service in Marriage','Service at Work','Service to Strangers','Sustaining Service','Rest as Service to Self'][i],
        devotion: {
          title: ['Choosing to Serve','The Element of Surprise','The Serving Spouse','The Serving Professional','Love for the Stranger','Fueling the Server','You Cannot Give What You Don\'t Have'][i],
          scripture: ['Mark 10:45','Romans 12:10','1 Peter 3:8-9','Colossians 3:23','Luke 10:30-37','Isaiah 40:31','Matthew 11:28-29'][i],
          reading: [
            'Read Mark 10:45. Jesus served from wholeness, not from wound. There\'s a difference between serving because you are afraid, people-pleasing, or trying to earn love — and serving because you are full and it flows out. Which kind of service are you giving?',
            'Read Romans 12:10 — "Honor one another above yourselves." The unexpected act of service — the one no one asked for, that no one may even know about — is often the most powerful.',
            'Read 1 Peter 3:8-9. In marriage and in any close relationship, service isn\'t tit-for-tat. It\'s not "I did the dishes so you owe me." It\'s "I do the dishes because I love you and because your rest is worth more to me than my convenience."',
            'Read Colossians 3:23 — "Whatever you do, work at it with all your heart, as working for the Lord." Your workplace is a field of service. How you show up for your team, clients, and colleagues is a form of love.',
            'Read Luke 10:30-37. The Samaritan didn\'t stop to ask "does this person deserve my help?" He saw a need and he filled it. Who is the "neighbor" in your daily path whose need you\'ve been walking past?',
            'Read Isaiah 40:31 — "Those who hope in the Lord will renew their strength." You cannot sustain a life of service from an empty tank. Renewal is not selfishness — it\'s faithfulness to the people who depend on you.',
            'Read Matthew 11:28-29 — "Come to me, all you who are weary, and I will give you rest." Jesus invites the burned-out, the exhausted, the over-servers. Receive His rest today.'
          ][i],
          reflection: [
            'Are you serving from love or from fear right now? What would it feel like to serve only from love?',
            'What unsolicited act of service would mean the most to someone in your life right now?',
            'In your closest relationship, do you keep score? What would it mean to stop?',
            'How do you serve the people you work with? What would change if you saw your work as an act of love?',
            'Who is the "neighbor" in your daily path — the one with a need you\'ve been walking past?',
            'What renews you? Are you protecting time to refuel?',
            'What does it mean to receive rest — not just stop working, but genuinely rest?'
          ][i],
          prayer: [
            'God, help me serve from fullness today, not from fear.',
            'Give me eyes to see the unseen need and a heart that wants to fill it.',
            'Lord, help me stop keeping score and start giving freely.',
            'Let my work today be an act of love — for the people I serve and for You.',
            'Open my eyes to the neighbor in front of me that I keep walking past.',
            'Help me receive renewal without guilt.',
            'Jesus, I come to You weary. Give me rest today.'
          ][i],
          app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Journal Entry', page: 'MyJournalEntries' }]
        },
        mindset_work: {
          title: ['The Motivation Check','The Unsolicited Service Plan','The Score-Keeping Audit','Service at Work List','The Neighbor Exercise','The Renewal Plan','Rest Practice'][i],
          exercise: [
            'Honestly examine your service: List 5 things you regularly do for others. For each one, write: Am I doing this from love, duty, fear, or desire for approval? No judgment — just honesty.',
            'Identify one person whose love language is Acts of Service. Without telling them, plan and execute one completely unsolicited act of service for them this week.',
            'In your closest relationship, write an honest assessment of whether you keep score. "I did ___ so they should ___." What would it look like to serve without the ledger?',
            'List 5 ways you could serve the people you work with more intentionally this week. Pick one and do it.',
            'Walk through your normal day in your mind. Who are the people you encounter regularly whose needs you\'ve been overlooking? What small act of service could you offer?',
            'Design your personal renewal plan: What fills your tank? Schedule it this week as non-negotiable.',
            'Practice receiving. Ask someone to serve you in something small today and say "thank you" without minimizing it or deflecting.'
          ][i],
          prompt: [
            'What would your service look like if you removed the need for recognition or reciprocation?',
            'How do you think the person will feel when they discover the unsolicited thing you did for them?',
            'What does score-keeping cost you in relationships?',
            'What would it mean to see your workplace as a field of love and service?',
            'Who have you been walking past?',
            'What happens when you run on empty — to you and to the people you serve?',
            'What makes rest hard to receive without guilt?'
          ][i],
          app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }, { label: 'Habit Builder', page: 'HabitBuilderPage' }]
        },
        relationship_challenge: {
          title: ['Service Inventory','Do the Unsolicited Thing','Drop the Ledger','Serve Your Team','See the Neighbor','Schedule Renewal','Receive Rest'][i],
          action: [
            'Do a service inventory this week — identify one thing you do out of obligation you\'d like to shift to love.',
            'Execute the unsolicited act of service. Don\'t tell anyone.',
            'Go one full day without mentally noting what someone else hasn\'t done.',
            'Serve one person at work in a way that goes beyond your job description.',
            'Do one thing for someone outside your inner circle — a neighbor, stranger, or acquaintance.',
            'Schedule and protect one renewal activity this week. Treat it like a meeting.',
            'Say yes to help today if someone offers it. Practice receiving.'
          ][i],
          scripture_anchor: ['Mark 10:45','Romans 12:10','1 Peter 4:10','Colossians 3:23','Luke 10:37','Isaiah 40:31','Matthew 11:28'][i]
        },
        reflection: {
          prompt: [
            'What would love-based service look like in your relationships this week?',
            'What did the unsolicited act of service cost you? What did it give you?',
            'What would you do differently if you fully dropped the ledger?',
            'How does serving at work well connect to how you love the people in your life?',
            'What happened when you noticed and responded to the neighbor in your path?',
            'What does your renewal plan reveal about what you\'ve been neglecting?',
            'Week 5: What has serving and being served taught you about love this week?'
          ][i],
          app_links: [{ label: i === 6 ? 'WeeklyReflectionPage' : 'MyJournalEntries', page: i === 6 ? 'WeeklyReflectionPage' : 'MyJournalEntries' }]
        }
      }))
    },
    {
      week: 6,
      theme: 'Healing Broken Relationships',
      theme_verse: 'Colossians 3:13 — "Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you."',
      overview: 'Not all relationships are in a good place. This week we go into the harder work — forgiveness, reconciliation, healthy boundaries, and what to do when love has been broken. This is perhaps the most important week of the entire plan.',
      focus_color: '#be123c',
      days: Array.from({ length: 7 }, (_, i) => ({
        day: 36 + i, label: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i],
        theme: ['What Forgiveness Is (and Isn\'t)','The Forgiveness Process','Reconciliation vs. Restoration','Healthy Boundaries','When Love Isn\'t Returned','Grieving a Relationship','Receiving God\'s Love'][i],
        devotion: {
          title: ['Forgiveness Is for You','The Long Walk','Not All Relationships Are Restored','Boundaries as Love','The Unrequited Love','Permission to Grieve','The Perfect Lover'][i],
          scripture: ['Matthew 18:21-22','Genesis 50:19-21','Romans 12:18','Matthew 10:16','Luke 15:20','Psalm 34:18','Zephaniah 3:17'][i],
          reading: [
            'Read Matthew 18:21-22. Seventy times seven isn\'t a number — it\'s a posture. Forgiveness isn\'t condoning what happened. It\'s releasing the debt. It\'s choosing not to let someone else\'s actions imprison you.',
            'Read Genesis 50:19-21. Joseph was sold into slavery by his brothers. Spent years in a pit and in prison. And when he had power over them, he said "You intended to harm me, but God intended it for good." The journey to that sentence took 13 years. Forgiveness is rarely instant.',
            'Read Romans 12:18 — "If it is possible, as far as it depends on you, live at peace with everyone." Note: "if it is possible." And "as far as it depends on you." Paul acknowledges that reconciliation is not always possible. Your job is your side.',
            'Read Matthew 10:16 — "Be as shrewd as snakes and as innocent as doves." Healthy boundaries are not walls — they are wisdom. They protect the relationship as much as they protect you.',
            'Read Luke 15:20. The father in the parable doesn\'t chase the son. He watches, he waits, and when the son returns, he runs. Sometimes love looks like holding space without chasing.',
            'Read Psalm 34:18 — "The Lord is close to the brokenhearted." Grief over a relationship — whether it ended, changed, or never became what you hoped — is a legitimate loss. God meets you there.',
            'Read Zephaniah 3:17 — "He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing." The perfect love you\'ve been searching for in every relationship already exists. It comes from God alone.'
          ][i],
          reflection: [
            'Is there someone you need to forgive? Not for their sake — for yours. What is holding that unforgiveness costing you?',
            'What does your personal forgiveness journey look like — what steps have you taken, and what remains?',
            'Is there a relationship in your life that should be reconciled vs. one where you\'ve done your part and the other person must choose?',
            'Where do you need better boundaries in a relationship right now? What are you allowing that is slowly eroding you?',
            'Is there someone you love who isn\'t ready or able to receive your love right now? What does faithfully loving them from a distance look like?',
            'What relationship loss — past or present — have you not fully grieved? Give yourself permission today.',
            'In what ways have you been searching for perfect love from imperfect people? How might your relationships change if you let God fill that need first?'
          ][i],
          prayer: [
            'God, I release ___. I choose forgiveness — not because it was okay, but because I refuse to carry this anymore.',
            'Lord, help me trust Your timing the way Joseph did. Give me eyes to see purpose in my pain.',
            'Help me live at peace on my side. I release the outcome of the other side to You.',
            'God, give me wisdom — the shrewdness to protect myself and the grace to stay open to love.',
            'Lord, teach me to love faithfully without losing myself.',
            'You are close to me right now. I receive that nearness.',
            'God, fill the places in me that I\'ve been trying to fill with people. You are enough.'
          ][i],
          app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Prayer', page: 'Prayer' }]
        },
        mindset_work: {
          title: ['The Forgiveness Letter','The Journey Map','The Two Columns','The Boundary Statement','The Faithful Love Plan','The Grief Practice','Receiving Love from God'][i],
          exercise: [
            'Write a forgiveness letter to someone who hurt you — not to send, but to release. Write everything: what they did, how it affected you, what it cost you. End with: "I choose to release this. I am no longer holding this debt." You don\'t have to feel it yet. Start with the choice.',
            'Map your forgiveness journey for one relationship: Where did it start? Where are you now? What\'s the next step — even a tiny one?',
            'Draw two columns: "My Part" and "Their Part." In "My Part," list only what you are responsible for in a broken relationship. In "Their Part," list what belongs to them. Your job is only to work your column.',
            'Write a clear, specific boundary statement for one relationship: "I am no longer willing to ___. When that happens, I will ___." Practice saying it out loud.',
            'Write a "faithful love plan" for someone who isn\'t currently able to receive what you offer. What does loving them well look like from where you are — without self-abandonment?',
            'Set a timer for 20 minutes. Write freely about a relationship loss you haven\'t fully processed. Let yourself feel it. Then close the journal and do something gentle for yourself.',
            'Sit quietly for 10 minutes. Read Zephaniah 3:17 slowly. Imagine God singing over you. What does it feel like to be fully known and fully loved?'
          ][i],
          prompt: [
            'What is the unforgiven thing costing you daily? What would freedom feel like?',
            'What has your forgiveness journey taught you about yourself?',
            'What clarity does separating "my part" from "their part" bring?',
            'What relationship would change most immediately if you implemented one clear boundary?',
            'What does loving someone faithfully look like when they can\'t receive it right now?',
            'What do you need to grieve that you\'ve been avoiding?',
            'What would change in your relationships if your deepest need for love was already fully met?'
          ][i],
          app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }, { label: 'Emotional Check-In', page: 'EmotionalCheckInPage' }]
        },
        relationship_challenge: {
          title: ['Take the First Step','One Step Forward','Work Your Column','Set the Boundary','Love from a Distance','Allow the Grief','Receive It'][i],
          action: [
            'Take one concrete step toward forgiveness today — even if it\'s just writing the letter.',
            'Identify the next step in your forgiveness journey and take it.',
            'Focus exclusively on your column in one broken relationship this week.',
            'Practice your boundary statement — say it to a trusted friend first if needed.',
            'Write a prayer for the person who can\'t receive your love right now. Release the outcome.',
            'Give yourself 20 minutes to grieve what has been lost.',
            'Receive God\'s love today in whatever form feels most real to you — through worship, Scripture, prayer, or nature.'
          ][i],
          scripture_anchor: ['Matthew 18:22','Genesis 50:20','Romans 12:18','Proverbs 4:23','Luke 15:20','Psalm 34:18','Zephaniah 3:17'][i]
        },
        reflection: {
          prompt: [
            'What does choosing forgiveness feel like — even before the feeling follows?',
            'Where are you on your forgiveness journey, honestly?',
            'What does working your column relieve you of?',
            'What does a well-placed boundary protect — in the relationship and in yourself?',
            'What does faithful love look like when it isn\'t being received?',
            'What grief are you still carrying that deserves to be set down?',
            'Week 6: What has this week\'s work on healing taught you about love, forgiveness, and yourself?'
          ][i],
          app_links: [{ label: i === 6 ? 'WeeklyReflectionPage' : 'MyJournalEntries', page: i === 6 ? 'WeeklyReflectionPage' : 'MyJournalEntries' }]
        }
      }))
    },
    {
      week: 7,
      theme: 'Building a Love Culture',
      theme_verse: 'Hebrews 10:24 — "And let us consider how we may spur one another on toward love and good deeds."',
      overview: 'Individual love languages matter. But this week we zoom out — how do you build a culture of love in a household, a friendship group, a team, or a community? This is about love that becomes a way of life, not just a weekly intention.',
      focus_color: '#9f1239',
      days: Array.from({ length: 7 }, (_, i) => ({
        day: 43 + i, label: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i],
        theme: ['The Love Culture Audit','Leading with Love','Modeling Love for Children','Creating Belonging','Conflict as Connection','Love That Endures','Overflow into Community'][i],
        devotion: { title: ['What Does Your Environment Communicate?','The Leader Sets the Tone','They Watch Before They Listen','Everyone Belongs','Fighting Well','Love Is a Long Game','Beyond the Inner Circle'][i], scripture: ['1 Corinthians 14:1','John 13:34-35','Deuteronomy 11:19','Romans 15:7','Ephesians 4:26-27','1 Corinthians 13:7','Luke 14:13-14'][i],
          reading: ['Read 1 Corinthians 14:1 — "Follow the way of love." A culture of love doesn\'t happen accidentally. It\'s cultivated. It requires someone to go first, to model it, to protect it when it\'s threatened.','Read John 13:34-35 — "By this everyone will know that you are my disciples, if you love one another." The primary evidence of a life with God is not doctrine or attendance — it\'s love. And it\'s visible.','Read Deuteronomy 11:19. The command is to talk about these things when you sit, walk, lie down, get up. Children absorb culture in the margins, not in the lectures. What are they absorbing in the margins of your home?','Read Romans 15:7 — "Accept one another, then, just as Christ accepted you." Belonging is not earned in a culture of love. It\'s given. The question for your relationships: do people feel accepted before they feel good enough?','Read Ephesians 4:26-27 — "Do not let the sun go down while you are still angry." Conflict handled well actually deepens connection. Conflict avoided creates distance that compounds over time.','Read 1 Corinthians 13:7 — love "always perseveres." The evidence of real love is not how it shows up on good days. It\'s how it shows up on hard ones.','Read Luke 14:13-14. Jesus describes a party where the uninvited, the overlooked, the forgotten are the guests of honor. A love culture eventually overflows outward to include who others exclude.'][i],
          reflection: ['What does the emotional environment of your home or primary relationship feel like? If love is an atmosphere, what is the temperature?','What culture are you setting with how you love the people closest to you?','What are the children or younger people in your life absorbing about love from watching you?','Do the people in your closest relationships feel like they belong before they earn it?','What is your conflict pattern in close relationships — do you fight and repair, or avoid and distance?','What in your important relationships has required you to love even when you didn\'t feel like it?','Who outside your inner circle is waiting to experience the overflow of the love culture you\'ve been building?'][i],
          prayer: ['God, make love the atmosphere of my home and my heart.','Let the way I love be the most visible thing about me.','Lord, let what the people around me catch from watching me be worth catching.','Help me be a person in whose presence people feel they belong exactly as they are.','Give me the courage to repair quickly and the humility to go first.','Help me love on the hard days the same way I love on the good ones.','Let my love overflow to the people on the edges — the ones no one else is going to.'][i],
          app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Journal Entry', page: 'MyJournalEntries' }]
        },
        mindset_work: { title: ['The Culture Assessment','The Leader\'s Love Inventory','The Margin Audit','The Belonging Test','The Repair Playbook','The Long Game Commitment','The Overflow Plan'][i], exercise: ['Rate your relationship culture on a scale of 1-10 in each area: How safe do people feel to be honest with you? How quickly are conflicts repaired? How often are love languages spoken? How often do people leave interactions with you feeling better than before?','As a leader — in your home, your family, your team — write the love culture you want to create. What does it look, sound, and feel like? What is your specific role in building it?','Observe the margins of your home or closest relationships this week: what is being communicated about love when no one is "trying"? At the dinner table, in the car, before bed?','Make a list of people in your life. Put a checkmark next to the ones who feel like they belong unconditionally. Circle the ones you\'re not sure about. What would it take to make them certain?','Design your personal conflict repair playbook: What do you do when things go wrong? How quickly do you repair? What is your first move? What words do you use? Write it out before you need it.','Write a "long game" commitment for your most important relationship: what does loving this person look like in 1 year, 5 years, 20 years? What are you willing to sustain?','Identify one person outside your inner circle who could benefit from the love culture you\'ve been building. Make a plan to include them.'][i],
          prompt: ['What would people say the temperature is in your relationships right now?','What does your love look like when no one is watching or tracking?','What are the people who watch you learning about love?','What does belonging look like in your relationships?','What is your move when things go wrong in a close relationship?','What does long-game love require of you that short-game love doesn\'t?','Who is on the edges of your relational world who could use an invitation in?'][i],
          app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }, { label: 'Emotional Check-In', page: 'EmotionalCheckInPage' }]
        },
        relationship_challenge: { title: ['Raise the Temperature','Model It','Observe the Margins','Create Belonging','Repair First','Love on a Hard Day','Make the Invitation'][i], action: ['Do one concrete thing today to raise the love temperature in your closest environment.','Lead with love in one specific way today — in your home, with your team, in your community.','Pay attention to the margins of your interactions today. What are they communicating?','Do one thing for one person in your life to make them feel they belong unconditionally.','The next time conflict arises, go first in repair — even if it wasn\'t your fault.','Choose to love someone today in their language even though you don\'t feel like it.','Extend an invitation to someone on the edges of your relational world.'][i],
          scripture_anchor: ['1 Corinthians 14:1','John 13:35','Deuteronomy 11:19','Romans 15:7','Ephesians 4:26','1 Corinthians 13:7','Luke 14:13'][i]
        },
        reflection: { prompt: ['What one change would most dramatically shift the love culture in your most important relationship?','What does love look like when it leads?','What did you notice in the margins this week?','What does belonging feel like to receive? To give?','What did going first in repair cost you? What did it create?','What did choosing to love on a hard day teach you?','Week 7: What does a love culture look like in practice?'][i], app_links: [{ label: i === 6 ? 'WeeklyReflectionPage' : 'MyJournalEntries', page: i === 6 ? 'WeeklyReflectionPage' : 'MyJournalEntries' }] }
      }))
    },
    {
      week: 8,
      theme: 'Love That Lasts',
      theme_verse: 'Philippians 1:6 — "He who began a good work in you will carry it on to completion until the day of Christ Jesus."',
      overview: 'This is the final week — but not the end. Love is not a destination; it\'s a direction. This week we anchor everything you\'ve learned, celebrate the relationships that have grown, name what still needs work, and set your eyes forward on the kind of lover you are becoming.',
      focus_color: '#e11d48',
      days: [
        { day: 50, label: 'Monday', theme: 'The Person You\'ve Become', devotion: { title: 'You Are Not Who You Were', scripture: '2 Corinthians 5:17', reading: 'Read 2 Corinthians 5:17 — "The old has gone, the new is here." Eight weeks ago you began this journey with a certain understanding of love. That understanding has been stretched. You are not the same person who started Week 1.', reflection: 'Write: who were you in relationships 8 weeks ago? What patterns did you bring? What did you not know that you know now?', prayer: 'God, thank You for the transformation You\'ve worked in me. I am not who I was. Help me live from this new place.', app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Journal Entry', page: 'MyJournalEntries' }] }, mindset_work: { title: 'The Before and After', exercise: 'Write your relational "before and after." What were your defaults 8 weeks ago in conflict, in affection, in presence, in service? What are they now? What has changed — even slightly?', prompt: 'What is the most significant shift in how you love someone that has happened in these 8 weeks?', app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }] }, relationship_challenge: { title: 'Tell Someone', action: 'Tell one person in your life what you\'ve been doing for 8 weeks and what it has meant for how you love them. Be specific.', scripture_anchor: '2 Corinthians 5:17' }, reflection: { prompt: 'What parts of the "old you" in relationships are you most glad to leave behind?', app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }] } },
        { day: 51, label: 'Tuesday', theme: 'Celebrating What Was Built', devotion: { title: 'Look at What Love Has Done', scripture: 'Psalm 126:1-3', reading: 'Read Psalm 126:1-3 — "We were like those who dreamed... The Lord has done great things for us." Look at what has changed in your relationships over these 8 weeks. Some of it is dramatic. Some of it is subtle. All of it is real.', reflection: 'Write a gratitude list for this journey — every conversation that went better, every moment of presence, every forgiveness step taken, every love language practiced.', prayer: 'Lord, You have done great things. I am filled with joy.', app_links: [{ label: 'Gratitude Journal', page: 'GratitudeJournalPage' }] }, mindset_work: { title: 'The Relationship Wins List', exercise: 'List every relational win from the past 8 weeks — big and small. Include moments you almost defaulted to the old pattern but chose differently. Moments you showed up. Moments you loved well.', prompt: 'Which relationship has changed most noticeably over these 8 weeks? What drove that change?', app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }] }, relationship_challenge: { title: 'Celebrate Together', action: 'Do something to celebrate a relationship that has grown during this plan. Mark the moment.', scripture_anchor: 'Psalm 126:3' }, reflection: { prompt: 'What do you most want to protect from these 8 weeks going forward?', app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }] } },
        { day: 52, label: 'Wednesday', theme: 'What Still Needs Work', devotion: { title: 'Honest Without Harsh', scripture: 'Proverbs 27:17', reading: 'Read Proverbs 27:17 — "As iron sharpens iron, so one person sharpens another." Growth requires honest assessment. Not self-condemnation — honest evaluation. Where are you still defaulting to old patterns? Where does love still cost you more than you\'re comfortable giving?', reflection: 'Write an honest assessment: where in your relationships are you still operating from old wiring? What will require continued, intentional work?', prayer: 'God, keep sharpening me. Show me what still needs work — not to shame me, but to grow me.', app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Journal Entry', page: 'MyJournalEntries' }] }, mindset_work: { title: 'The Honest Assessment', exercise: 'Rate yourself honestly in each love language: How naturally do you speak Words of Affirmation? Acts of Service? Giving Gifts? Quality Time? Physical Touch? For your lowest score, write one specific commitment for how you will grow in that language.', prompt: 'What is the hardest love language for you to give consistently? What would it take to grow there?', app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }] }, relationship_challenge: { title: 'Name It to Someone', action: 'Tell a trusted person one area of your relationship life that still needs work. Ask them to hold you accountable.', scripture_anchor: 'Proverbs 27:17' }, reflection: { prompt: 'What do you need to keep working on, and what support do you need to do it?', app_links: [{ label: 'Emotional Check-In', page: 'EmotionalCheckInPage' }] } },
        { day: 53, label: 'Thursday', theme: 'Commitments Going Forward', devotion: { title: 'Not Intentions — Commitments', scripture: 'Joshua 24:15', reading: 'Read Joshua 24:15 — "Choose for yourselves this day whom you will serve." Joshua didn\'t express hope or intention. He made a declaration. Love going forward isn\'t about good feelings — it\'s about commitments you make on ordinary days when feelings are irrelevant.', reflection: 'What commitments — not goals, not intentions, but commitments — do you want to make about how you love the people in your life going forward?', prayer: 'God, I choose today. Not just when it\'s easy — I choose to love the way You love, consistently, regardless of how I feel.', app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Habit Builder', page: 'HabitBuilderPage' }] }, mindset_work: { title: 'The Love Commitment List', exercise: 'Write 5 specific commitments about how you will love going forward. Not "I will be better" — specific: "I will ask one genuine question every day." "I will put my phone away during dinner." "I will say I love you and mean it." "I will initiate repair within 24 hours of conflict."', prompt: 'What is one commitment that, if kept consistently, would most transform your most important relationship?', app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }] }, relationship_challenge: { title: 'Write the Commitment', action: 'Write your 5 love commitments somewhere permanent — in your journal, on a card you keep, on your phone. Read them every morning for the next 30 days.', scripture_anchor: 'Joshua 24:15' }, reflection: { prompt: 'What makes a commitment different from an intention? Which are you making?', app_links: [{ label: 'Habit Builder', page: 'HabitBuilderPage' }] } },
        { day: 54, label: 'Friday', theme: 'The Greatest of These', devotion: { title: 'Love Is the Point', scripture: '1 Corinthians 13:13', reading: 'Read 1 Corinthians 13:13 — "And now these three remain: faith, hope and love. But the greatest of these is love." Everything else in this life is temporary. The love you build — the love you give — is the thing that lasts. It\'s the thing God most cares about.', reflection: 'At the end of your life, what do you want the people who knew you to say about how you loved them? Write that eulogy now — and let it become your north star.', prayer: 'God, let love be the most defining thing about me. Not my achievements, not my reputation — my love. Make me someone who loved well.', app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Journal Entry', page: 'MyJournalEntries' }] }, mindset_work: { title: 'The Love Eulogy', exercise: 'Write the eulogy you want — not the one people would write today, but the one you\'re building toward. How did you love? Who felt most loved by you? What did your presence give to the world? Read it aloud. Let it settle.', prompt: 'What is the one thing you most want to be true about how you loved, at the end of everything?', app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }] }, relationship_challenge: { title: 'Live Toward It', action: 'Today, do one thing that the person in your eulogy would have done. Be that person today.', scripture_anchor: '1 Corinthians 13:13' }, reflection: { prompt: 'What does it mean that love is the greatest of these? What does that change about how you spend your time, energy, and attention?', app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }] } },
        { day: 55, label: 'Saturday', theme: 'Share Your Story', devotion: { title: 'Your Testimony Is a Gift', scripture: 'Revelation 12:11', reading: 'Read Revelation 12:11 — "They triumphed by the word of their testimony." Your love story — even incomplete, even messy, even still in process — is a weapon against someone else\'s hopelessness. Share it.', reflection: 'Write your testimony from these 8 weeks: what you brought in, what happened, what has changed, and what you\'re walking toward.', prayer: 'God, use my story. Let what happened in me encourage someone who needs it.', app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Journal Entry', page: 'MyJournalEntries' }] }, mindset_work: { title: 'Write and Share', exercise: 'Write a short testimony — 1-2 paragraphs — about what this 8-week journey did in you and in your relationships. Then share it with at least one person.', prompt: 'What would encourage someone else who is struggling in relationships right now?', app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }] }, relationship_challenge: { title: 'Pass It On', action: 'Share what you\'ve learned with someone who could benefit. Give this plan to someone who needs it.', scripture_anchor: 'Revelation 12:11' }, reflection: { prompt: 'What would you tell someone at the beginning of this journey?', app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }] } },
        { day: 56, label: 'Sunday', theme: 'Love Never Ends', devotion: { title: 'This Is Just the Beginning', scripture: '1 Corinthians 13:8', reading: 'Read 1 Corinthians 13:8 — "Love never fails." Everything else passes away. Prophecies, tongues, knowledge — all temporary. Love remains. What you have built in these 8 weeks — in your heart, in your habits, in your relationships — is the work that outlasts everything.', reflection: 'Final reflection: What do you most want to carry from these 8 weeks? Who are you now as a lover of people? Write freely. Write honestly. Write for the version of yourself who will read this in a year and need to remember.', prayer: 'God, I press on. I don\'t stop here. Continue what You\'ve started in me. Make me someone who loves the way You love — for the rest of my life. Amen.', app_links: [{ label: 'Open Bible', page: 'Bible' }, { label: 'Journal Entry', page: 'MyJournalEntries' }, { label: 'Weekly Reflection', page: 'WeeklyReflectionPage' }] }, mindset_work: { title: 'The Final Letter', exercise: 'Write a letter to the person you\'re becoming — the version of you who has been loving intentionally, consistently, and skillfully for one year. What has changed? What do they know that you\'re only beginning to learn? Let this letter be your vision.', prompt: '8 weeks. 56 days. Who are you now as a lover of people?', app_links: [{ label: 'Journal Entry', page: 'MyJournalEntries' }] }, relationship_challenge: { title: 'Love Someone Fully Today', action: 'Today, love one person in their primary love language as fully and intentionally as you know how. Make it count. Let it be a picture of the lover you are becoming.', scripture_anchor: '1 Corinthians 13:8' }, reflection: { prompt: '8 weeks of choosing love. What has it cost you? What has it given you? What does "love never fails" mean to you now, personally?', app_links: [{ label: 'Final Journal Entry', page: 'MyJournalEntries' }, { label: 'Weekly Reflection', page: 'WeeklyReflectionPage' }] } }
      ]
    }
  ]
});
