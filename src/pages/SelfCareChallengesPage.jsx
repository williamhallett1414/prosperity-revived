import { useState, useEffect } from "react";
import { base44 } from '@/api/base44Client';
import { Flower2 } from 'lucide-react';
import ShareToFeedButton from '@/components/community/ShareToFeedButton';
import { localDateKey, todayKey } from '@/utils/localDate';

// ─── Challenge Catalogue ─────────────────────────────────────────────────────
const CHALLENGES = [
  {
    id: "wilderness-40", title: "40 Days in the Wilderness", emoji: "⛰️", category: "Faith",
    duration: 40, color: "#7c2d12", bg: "linear-gradient(135deg,#451a03,#92400e,#78350f)",
    tagline: "Walk as Christ walked. Die to self. Rise in Him.", xpPerDay: 75, featured: true,
    description: "Modeled after Jesus' 40 days in the wilderness (Matthew 4:1-11), this is the most demanding challenge in Prosperity Revived. You will fast from comfort, strip away distraction, face your deepest temptations, and learn to rely solely on Christ. This is not casual — it is a pilgrimage. You will be pushed to your mental, physical, and emotional limits. But on the other side is a faith that cannot be shaken. Are you ready to walk into the desert?",
    tasks: [
      // WEEK 1: THE DESCENT — Stripping Away
      { day: 1, title: "Enter the wilderness", verse: "Matthew 4:1-2", extraWritingPrompt: "✉️ Write your letter to God — why are you doing this? What are you leaving behind, and what are you stepping into?", content: "Today you begin. Delete one social media app from your phone. Write a letter to God telling Him why you're doing this. Read Matthew 4:1-2. Jesus was LED by the Spirit into the wilderness — this is not punishment, it is preparation.", prompt: "What are you hoping God does in you over the next 40 days?" },
      { day: 2, title: "The first fast", verse: "Psalm 63", content: "Skip one meal today. During that meal time, sit in silence with your Bible open to Psalm 63. No music, no podcast — just you and God. Feel the hunger. Let it remind you that you need Him more than food.", prompt: "What did hunger teach you about dependence today?" },
      { day: 3, title: "Confession", verse: "1 John 1:9", extraWritingPrompt: "📋 Write down every sin, habit, and compromise you've been carrying. Be brutally honest — no one sees this but God.", content: "Write down every sin, habit, and compromise you've been carrying. Be brutally honest — no one sees this but God. Read 1 John 1:9. Then pray over each one and physically destroy the paper.", prompt: "What did it feel like to name what you've been hiding?" },
      { day: 4, title: "Digital wilderness", verse: "Psalm 46:10", content: "No social media today. No YouTube. No streaming. No news. Only Scripture, prayer, and necessary communication. Read Psalm 46:10 — 'Be still and know that I am God.'", prompt: "What did you discover in the silence that noise had been covering?" },
      { day: 5, title: "The long walk", verse: "Genesis 5:24", content: "Walk for 45 minutes in solitude. No earbuds. No phone. Just walk and pray. Talk to God like He's walking beside you — because He is. Read Genesis 5:24 — Enoch walked with God.", prompt: "What did God say to you on the walk?" },
      { day: 6, title: "Sleep on the floor", verse: "Philippians 2:5-8", content: "Tonight, sleep on the floor with only a blanket. Before you lie down, read Philippians 2:5-8 — Christ emptied Himself. Feel the discomfort. Offer it as worship.", prompt: "What did physical discomfort reveal about your attachment to comfort?" },
      { day: 7, title: "The first Sabbath", verse: "Hebrews 4:9-10", content: "Do no work today. No productivity. No hustle. Rest as an act of radical trust that God provides even when you stop performing. Read Exodus 20:8-11 and Hebrews 4:9-10.", prompt: "What was hardest about stopping? What does that reveal?" },

      // WEEK 2: THE TEMPTATION — Facing Your Flesh
      { day: 8, title: "Name your temptation", verse: "Matthew 4:3-10", extraWritingPrompt: "✍️ Write down your three greatest temptations honestly. Which of Jesus' temptations mirrors yours?", content: "Jesus was tempted three times. What are YOUR three greatest temptations? Write them down honestly. Read Matthew 4:3-10 and identify which of Jesus' temptations mirrors yours.", prompt: "What are the three temptations that have the strongest grip on you?" },
      { day: 9, title: "Fast from your vice", content: "Whatever your greatest comfort vice is — caffeine, sugar, entertainment, spending, complaining — fast from it today. Replace every craving with a sentence prayer.", prompt: "How many times did you reach for your vice? What prayer replaced it?" },
      { day: 10, title: "Cold water baptism", verse: "Galatians 2:20", content: "Take an ice-cold shower this morning. Stay under for 2 full minutes. As the cold hits, declare: 'I am crucified with Christ. It is no longer I who live, but Christ lives in me.' (Galatians 2:20)", prompt: "What broke in you when you chose discomfort on purpose?" },
      { day: 11, title: "Serve someone invisible", verse: "Matthew 25:40", content: "Find someone no one notices — a janitor, a lonely neighbor, a homeless person — and serve them. Spend real time with them. Read Matthew 25:40.", prompt: "Who did you serve, and what did Jesus teach you through them?" },
      { day: 12, title: "Speak no complaint", verse: "Philippians 2:14-15", content: "Go the entire day without complaining — not once, about anything. Every time you catch yourself, stop and give thanks instead. Read Philippians 2:14-15.", prompt: "How many complaints did you catch? What replaced them?" },
      { day: 13, title: "Pray for your enemy", verse: "Matthew 5:44", content: "Think of the person you resent most. Pray for them by name for 10 minutes. Not that God would change them — pray that God would genuinely bless them. Read Matthew 5:44.", prompt: "What shifted in your heart as you prayed for someone who hurt you?" },
      { day: 14, title: "Second Sabbath + fast", verse: "Isaiah 58:6-9", content: "Full Sabbath rest AND skip one meal. Combine stillness with hunger. Read Isaiah 58:6-9 — God's chosen fast. Journal what God is breaking loose in you.", prompt: "After two weeks, what is God dismantling in you?" },

      // WEEK 3: THE BREAKING — Dying to Self
      { day: 15, title: "Give away something you love", verse: "Luke 12:33-34", content: "Find something you own that you genuinely love and give it away to someone who needs it more. Not junk — something that costs you. Read Luke 12:33-34.", prompt: "What did you give away, and what did it cost you emotionally?" },
      { day: 16, title: "Ask for forgiveness", verse: "Matthew 5:23-24", content: "Go to someone you've wronged — in person, by phone, or in writing — and ask for their forgiveness. No excuses, no explaining. Just own it. Read Matthew 5:23-24.", prompt: "Who did you approach, and what happened?" },
      { day: 17, title: "24-hour media fast", verse: "Psalm 119:37", content: "No phone, no screens, no media for 24 full hours. Only Bible, journal, and face-to-face conversation. You will feel withdrawal. Stay in it. Read Psalm 119:37.", prompt: "What emotions surfaced during 24 hours without a screen?" },
      { day: 18, title: "Mourn with someone", verse: "Romans 12:15", content: "Find someone who is grieving or struggling and sit with them. Don't fix. Don't preach. Just be present. Read Romans 12:15 — weep with those who weep.", prompt: "What happened when you chose presence over solutions?" },
      { day: 19, title: "Pray on your knees for 30 minutes", verse: "Daniel 6:10", content: "Physical posture shapes spiritual posture. Get on your knees and pray for 30 minutes without getting up. Read Daniel 6:10 — Daniel prayed on his knees three times a day even facing death.", prompt: "What did your body teach your spirit in that posture?" },
      { day: 20, title: "Write your eulogy", verse: "Psalm 90:12", extraWritingPrompt: "📜 Write what you want said about you when you die. Be specific about your character, legacy, and impact.", content: "Write what you want said about you when you die. Then compare it to how you're actually living. Read Psalm 90:12 — teach us to number our days. Let the gap between the two drive you to change.", prompt: "What is the biggest gap between who you want to be and who you are?" },
      { day: 21, title: "Third Sabbath — halfway", verse: "Psalm 23", content: "You are halfway through the wilderness. Rest. Read Psalm 23 slowly three times. Journal what has already changed in you. Name what God has done so far.", prompt: "Who were you 21 days ago, and who are you becoming?" },

      // WEEK 4: THE SURRENDER — Letting God Have Everything
      { day: 22, title: "Financial surrender", verse: "Malachi 3:10", content: "Give away money you weren't planning to give — to a church, a person in need, or a cause. Let it be an amount that makes you nervous. Read Malachi 3:10.", prompt: "What did it feel like to give beyond your comfort zone?" },
      { day: 23, title: "Confess to another person", verse: "James 5:16", content: "Find one trusted believer and confess a struggle or sin you've been hiding. Not to social media — to a real person, face to face. Read James 5:16.", prompt: "What happened when you brought darkness into light?" },
      { day: 24, title: "Sunrise prayer", verse: "Lamentations 3:22-23", content: "Wake before dawn. Go outside. Watch the sun rise while in prayer. Read Lamentations 3:22-23 — His mercies are new every morning. Let the sunrise preach to you.", prompt: "What did God say to you in the dawn?" },
      { day: 25, title: "Carry someone's burden", verse: "Galatians 6:2", content: "Ask someone: 'What's heavy for you right now?' and then actually help carry it — with action, not just words. Read Galatians 6:2.", prompt: "Whose burden did you share, and what did you do?" },
      { day: 26, title: "Worship in the storm", verse: "Acts 16:25", content: "Think of the hardest thing in your life right now. Instead of asking God to remove it, praise Him in the middle of it. Sing, shout, declare His goodness. Read Acts 16:25 — Paul and Silas worshipped in prison.", prompt: "What shifted when you praised God BEFORE the answer came?" },
      { day: 27, title: "The longest fast", verse: "Isaiah 58:6-9", content: "Fast from sunrise to sunset today — no food, only water. Read Isaiah 58:6-9 throughout the day. Break the fast at sunset with bread and prayer.", prompt: "What did a full day of hunger reveal about your dependence on God?" },
      { day: 28, title: "Fourth Sabbath", verse: "Psalm 91", content: "Rest completely. Read all of Psalm 91 — He who dwells in the shelter of the Most High. You have made it through four weeks. Let God restore you.", prompt: "What has 28 days in the wilderness taught you about who God is?" },

      // WEEK 5: THE MOUNTAIN — Building Unshakable Faith
      { day: 29, title: "Declare your identity", verse: "Ephesians 1:3-14", extraWritingPrompt: "✨ Write your 10 'I am' statements from Scripture. Then read them aloud three times — morning, noon, and night.", content: "Write 10 'I am' statements from Scripture about who God says you are. Read them aloud three times — in the morning, at noon, and before bed. Read Ephesians 1:3-14.", prompt: "Which identity statement hit deepest, and why?" },
      { day: 30, title: "Intercede for 1 hour", verse: "1 Timothy 2:1-4", content: "Pray for one solid hour for other people — not yourself. Family, friends, enemies, your city, your nation, the church. Read 1 Timothy 2:1-4.", prompt: "What did an hour of intercession do to your own heart?" },
      { day: 31, title: "Fast and serve", verse: "Matthew 25:35-40", content: "Skip one meal and use that time to serve someone else. Let your hunger fuel compassion. Read Matthew 25:35-40.", prompt: "How did combining fasting with service change both?" },
      { day: 32, title: "Write a psalm", verse: "Psalm 42", extraWritingPrompt: "🎵 Write your own psalm to God — raw, honest, your own words. Start where you are. Move to who God is. End with surrender.", content: "Write your own psalm to God — raw, honest, your own words. Start with where you are. Move to who God is. End with surrender. Read Psalm 42 as a model.", prompt: "What did your psalm express that ordinary prayer couldn't?" },
      { day: 33, title: "Memorize Matthew 4:1-11", verse: "Matthew 4:1-11", extraWritingPrompt: "📖 Write out Matthew 4:1-11 from memory. These words are your weapon.", content: "Memorize the full wilderness temptation passage. Speak it from memory by end of day. These are the words Jesus used to defeat the enemy — they are your weapon too.", prompt: "Which of Jesus' responses to temptation do you need most right now?" },
      { day: 34, title: "Physical endurance", verse: "Hebrews 12:1-2", content: "Push your body beyond where you'd normally quit — a longer run, a harder workout, extra reps, a steep hike. When your body screams stop, pray 'I can do all things through Christ' and keep going. Read Hebrews 12:1-2.", prompt: "What happened when you pushed past your limit with Christ?" },
      { day: 35, title: "Fifth Sabbath", verse: "Philippians 3:13-14", content: "Rest deeply. You have 5 days left. Read Philippians 3:13-14 — pressing on toward the goal. Journal the transformation you've experienced.", prompt: "What person are you leaving behind in this wilderness?" },

      // WEEK 6: THE RESURRECTION — Coming Out of the Desert
      { day: 36, title: "Forgive completely", verse: "Colossians 3:13", extraWritingPrompt: "📝 Write the names of everyone you are forgiving today. Pray release over each one.", content: "Today, fully forgive everyone who has ever wronged you. Write each name. Pray release over each one. This is not for them — it is for your freedom. Read Colossians 3:13.", prompt: "Who did you finally release, and what chains broke?" },
      { day: 37, title: "Commitment letter", verse: "Joshua 24:15", extraWritingPrompt: "📜 Write your covenant letter to God. Be specific — daily practices, boundaries, commitments. Sign it and date it.", content: "Write a covenant letter to God about who you will be when you leave this wilderness. Be specific — daily practices, boundaries, commitments. Sign it and date it. Read Joshua 24:15.", prompt: "What specific commitments are you making to God going forward?" },
      { day: 38, title: "Testimony", verse: "Revelation 12:11", extraWritingPrompt: "🙌 Write your wilderness testimony — what God did in you over 40 days. Share it with at least one person today.", content: "Write your wilderness testimony — what God did in you over 40 days. Share it with at least one person today. Your story is someone else's hope. Read Revelation 12:11.", prompt: "What is the one sentence that summarizes what God did?" },
      { day: 39, title: "The final fast", content: "One last fast from sunrise to sunset. This time, spend the day in worship, gratitude, and reading the book of John. Let the life of Christ wash over you one final time.", prompt: "How is this fast different from your first one on Day 2?" },
      { day: 40, title: "Exit the wilderness", verse: "Matthew 4:11", content: "You made it. Read Matthew 4:11 — 'Then the devil left Him, and angels came and attended Him.' Today, feast. Celebrate. Rest in the knowledge that you walked where Christ walked, and you came out changed. The wilderness was not your end — it was your beginning.", prompt: "Who are you now? And what will you never go back to?" },
    ],
  },
  {
    id: "gratitude-7", title: "7-Day Gratitude", emoji: "🙏", category: "Faith",
    duration: 7, color: "#D9A84A", bg: "linear-gradient(135deg,#f59e0b,#FAD98D)",
    tagline: "Cultivate a thankful heart in one week", xpPerDay: 40,
    tasks: [
      { day: 1, title: "Three blessings", content: "Write down three things you're grateful for — no matter how small. Look for God's fingerprints in ordinary moments.", prompt: "What three moments today revealed something beautiful?" },
      { day: 2, title: "Send encouragement", content: "Text, call, or message someone to tell them you appreciate them. Gratitude multiplies when shared.", prompt: "Who did you reach out to, and what did it feel like?" },
      { day: 3, title: "Answered prayers", content: "Recall 2-3 prayers God has answered in your life. Write them down and spend a moment in praise.", prompt: "How has God shown up for you in unexpected ways?" },
      { day: 4, title: "Grateful for hardship", content: "Name one difficulty that helped you grow. How did God use it? What would you have missed without it?", prompt: "What hard season turned out to be a gift in disguise?" },
      { day: 5, title: "Prayer of thanks only", content: "Spend 5 minutes in prayer focused entirely on thanksgiving. No requests - just gratitude.", prompt: "What surprised you when you prayed only in thanksgiving?" },
      { day: 6, title: "Gratitude walk", content: "Take a 10-minute walk outside. With every step, name something you're grateful for. Let it fill you.", prompt: "What did you notice on your walk that you usually overlook?" },
      { day: 7, title: "Share your gratitude", content: "Post, write, or tell someone one thing you're grateful for. Let your testimony encourage someone else.", prompt: "How has a week of gratitude changed your perspective?" },
    ],
  },
  {
    id: "stress-reset-5", title: "5-Day Stress Reset", emoji: "🕊️", category: "Mindset",
    duration: 5, color: "#0ea5e9", bg: "linear-gradient(135deg,#0ea5e9,#38bdf8)",
    tagline: "Find peace through prayer and practice", xpPerDay: 35,
    tasks: [
      { day: 1, title: "Box breathing", content: "Breathe in for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 10 times. Give God your anxiety with each exhale.", prompt: "How did intentional breathing shift your body and mind?" },
      { day: 2, title: "Scripture anchor", content: "Read Philippians 4:6-7 three times slowly. Write what it means to you today. Carry it as your mantra.", prompt: "What did this verse unlock in you today?" },
      { day: 3, title: "Prayer walk", content: "Walk for 10 minutes outside while praying aloud. Give God your specific stressors one by one.", prompt: "What specific stressor did you hand over, and how did it feel?" },
      { day: 4, title: "Digital sabbath hour", content: "Spend one hour without any screens. Read, pray, sit in stillness, or journal. Let your nervous system rest.", prompt: "What surprised you about the silence?" },
      { day: 5, title: "Surrender ritual", content: "Write your top three worries. Pray over each one, giving them to God. Then physically let them go.", prompt: "What shifted when you chose to release control?" },
    ],
  },
  {
    id: "morning-ritual-5", title: "5-Day Morning Ritual", emoji: "🌅", category: "Mindset",
    duration: 5, color: "#f97316", bg: "linear-gradient(135deg,#f97316,#fb923c)",
    tagline: "Own the first hour, own the day", xpPerDay: 35,
    tasks: [
      { day: 1, title: "Phone-free first 30", content: "Don't check your phone for the first 30 minutes after waking. Use that time to pray, breathe, and set your intention.", prompt: "How did starting without your phone change your morning energy?" },
      { day: 2, title: "Three intentions", content: "Before anything else, write three intentions for today - not tasks, but how you want to show up.", prompt: "What intentions did you set, and did you live them out?" },
      { day: 3, title: "Move your body first", content: "Do 10 minutes of movement before checking any screen.", prompt: "How did moving first change the rest of your morning?" },
      { day: 4, title: "Scripture before social", content: "Read one chapter of Scripture before opening any social media.", prompt: "What did God say to you before the world got a word in?" },
      { day: 5, title: "The full ritual", content: "Combine everything: no phone for 30 min, 3 intentions, movement, Scripture.", prompt: "What would it mean to make this your every morning?" },
    ],
  },
  {
    id: "kindness-5", title: "5-Day Kindness Challenge", emoji: "💛", category: "Relationships",
    duration: 5, color: "#f43f5e", bg: "linear-gradient(135deg,#f43f5e,#fb7185)",
    tagline: "Love your neighbour in concrete ways", xpPerDay: 30,
    tasks: [
      { day: 1, title: "Compliment three people", content: "Give a genuine, specific compliment to three different people today.", prompt: "Who did you compliment, and how did it land?" },
      { day: 2, title: "Anonymous service", content: "Do something kind for someone who won't know it was you.", prompt: "What did you do, and how did it feel to serve unseen?" },
      { day: 3, title: "Reconnect with someone", content: "Reach out to someone you haven't spoken to in a while.", prompt: "Who did you reconnect with? What was meaningful about it?" },
      { day: 4, title: "Listen deeply", content: "In your next conversation, practice listening to understand - not to respond.", prompt: "What did you hear that you might have missed before?" },
      { day: 5, title: "Pray for five people", content: "Write down five people and pray specifically for each one.", prompt: "Who did you pray for, and what did you sense for each of them?" },
    ],
  },
  {
    id: "rest-7", title: "7-Day Rest Challenge", emoji: "😴", category: "Body",
    duration: 7, color: "#6366f1", bg: "linear-gradient(135deg,#6366f1,#818cf8)",
    tagline: "Honor your body with real rest", xpPerDay: 40,
    tasks: [
      { day: 1, title: "Bedtime by 10:30pm", content: "Commit to being in bed by 10:30pm.", prompt: "How did getting to bed earlier affect how you woke up?" },
      { day: 2, title: "No screens after 9pm", content: "Put devices down by 9pm.", prompt: "What did you do with that screen-free time?" },
      { day: 3, title: "Afternoon reset", content: "Take a 10-20 minute rest after lunch.", prompt: "How did your afternoon feel after intentional rest?" },
      { day: 4, title: "Sabbath hour", content: "Carve out one hour today for something completely restful and joyful.", prompt: "What did you do, and did it feel genuinely restful?" },
      { day: 5, title: "No alarm", content: "If possible, let yourself wake naturally.", prompt: "What did your body's natural rhythm tell you?" },
      { day: 6, title: "Wind-down ritual", content: "Create a 15-minute bedtime routine: dim lights, prayer, light reading.", prompt: "How did a wind-down ritual change how you fell asleep?" },
      { day: 7, title: "Reflect on rest", content: "Write about this week.", prompt: "How did intentional rest transform your mood, energy, and faith?" },
    ],
  },
  {
    id: "movement-7", title: "7-Day Movement Challenge", emoji: "🏃", category: "Body",
    duration: 7, color: "#22c55e", bg: "linear-gradient(135deg,#22c55e,#22C55E)",
    tagline: "Move your body, lift your spirit", xpPerDay: 40,
    tasks: [
      { day: 1, title: "10-minute walk", content: "Go for a 10-minute walk - outside if possible. Pray while you walk.", prompt: "What happened when movement and prayer merged?" },
      { day: 2, title: "Stretch for 10 minutes", content: "Spend 10 minutes stretching. Release tension you've been carrying.", prompt: "What tension did you release - physical or emotional?" },
      { day: 3, title: "Push to 20 minutes", content: "Extend your walk or movement to 20 minutes.", prompt: "What did your mind do when your body moved longer?" },
      { day: 4, title: "Try something new", content: "Do a movement you don't normally do - dance, swim, cycle, jump rope.", prompt: "What new movement did you try, and how did it feel?" },
      { day: 5, title: "Move with someone", content: "Walk, run, or work out with another person today.", prompt: "How did shared movement deepen the connection?" },
      { day: 6, title: "Active recovery", content: "Take a gentle rest day - a slow walk or light stretching.", prompt: "How did intentional recovery feel compared to just stopping?" },
      { day: 7, title: "Reflect and commit", content: "Write down how 7 days of intentional movement changed you.", prompt: "What will you carry forward from this week?" },
    ],
  },
  {
    id: "scripture-memory-7", title: "Scripture Memory", emoji: "📖", category: "Faith",
    duration: 7, color: "#8b5cf6", bg: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
    tagline: "Hide God's Word deep in your heart", xpPerDay: 45,
    tasks: [
      { day: 1, title: "Philippians 4:13", content: "I can do all things through Christ who strengthens me. Say it ten times aloud.", prompt: "Where do you most need this truth today?" },
      { day: 2, title: "Psalm 46:10", content: "Be still, and know that I am God. Sit in 2 minutes of silence first.", prompt: "What did stillness reveal to you?" },
      { day: 3, title: "Proverbs 3:5-6", content: "Trust in the Lord with all your heart and lean not on your own understanding.", prompt: "Where are you leaning on yourself instead of trusting God?" },
      { day: 4, title: "Jeremiah 29:11", content: "For I know the plans I have for you, declares the Lord.", prompt: "What worry did this verse speak to today?" },
      { day: 5, title: "Isaiah 40:31", content: "Those who hope in the Lord will renew their strength.", prompt: "When did you feel renewed strength today?" },
      { day: 6, title: "Romans 8:28", content: "In all things God works for the good of those who love him.", prompt: "What situation is God currently redeeming in your life?" },
      { day: 7, title: "Joshua 1:9", content: "Be strong and courageous. Do not be afraid.", prompt: "What courage has a week of Scripture built in you?" },
    ],
  },
];

// ─── Fitness Challenges (converted from Workouts page) ──────────────────────
const FITNESS_CHALLENGES = [
  {
    id: "cardio-30", title: "30-Day Cardio", emoji: "❤️", category: "Body",
    duration: 30, color: "#ef4444", bg: "linear-gradient(135deg,#f87171,#dc2626)",
    tagline: "Build cardiovascular strength and endurance", xpPerDay: 35,
    tasks: Array.from({length: 30}, (_, i) => ({
      day: i + 1,
      title: `Cardio Session ${i + 1}`,
      content: "Complete 30 minutes of cardio (running, cycling, swimming, etc.). Track your pace and distance.",
      prompt: "How did your cardio session go today?"
    }))
  },
  {
    id: "strength-28", title: "28-Day Strength", emoji: "💪", category: "Body",
    duration: 28, color: "#374151", bg: "linear-gradient(135deg,#6b7280,#1f2937)",
    tagline: "Build lean muscle and increase strength", xpPerDay: 40,
    tasks: Array.from({length: 28}, (_, i) => ({
      day: i + 1,
      title: `Strength Day ${i + 1}`,
      content: "Complete a strength training session (weights, resistance bands, or bodyweight). Focus on proper form.",
      prompt: "Which muscle groups did you work today?"
    }))
  },
  {
    id: "flexibility-14", title: "14-Day Flexibility", emoji: "🧘", category: "Body",
    duration: 14, color: "#14b8a6", bg: "linear-gradient(135deg,#2dd4bf,#0d9488)",
    tagline: "Improve flexibility and reduce tension", xpPerDay: 30,
    tasks: Array.from({length: 14}, (_, i) => ({
      day: i + 1,
      title: `Flex Day ${i + 1}`,
      content: "Spend 20-30 minutes on stretching, yoga, or pilates. Breathe deeply and listen to your body.",
      prompt: "What areas of tension did you release today?"
    }))
  },
  {
    id: "hiit-21", title: "21-Day HIIT Blast", emoji: "⚡", category: "Body",
    duration: 21, color: "#f97316", bg: "linear-gradient(135deg,#fb923c,#ea580c)",
    tagline: "High-intensity intervals for maximum results", xpPerDay: 45,
    tasks: Array.from({length: 21}, (_, i) => ({
      day: i + 1,
      title: `HIIT Session ${i + 1}`,
      content: "30-45 minutes of high-intensity interval training. Push hard during work intervals, recover during rest.",
      prompt: "How did your energy and recovery feel?"
    }))
  },
  {
    id: "full-body-21", title: "21-Day Full Body", emoji: "🏋️", category: "Body",
    duration: 21, color: "#a855f7", bg: "linear-gradient(135deg,#d946ef,#7c3aed)",
    tagline: "Complete workout system for all muscle groups", xpPerDay: 50,
    tasks: Array.from({length: 21}, (_, i) => ({
      day: i + 1,
      title: `Full Body Workout ${i + 1}`,
      content: "60-minute full-body session combining strength, cardio, and flexibility. Every muscle group matters.",
      prompt: "What was your overall energy and performance?"
    }))
  },
];

// ─── Nutrition Challenges ─────────────────────────────────────────────────────
const NUTRITION_CHALLENGES = [
  {
    id: "hydration-7", title: "7-Day Hydration Challenge", emoji: "💧", category: "Body",
    duration: 7, color: "#06b6d4", bg: "linear-gradient(135deg,#06b6d4,#0891b2)",
    tagline: "Drink more water and feel the difference", xpPerDay: 30,
    tasks: Array.from({length: 7}, (_, i) => ({
      day: i + 1,
      title: `Hydration Day ${i + 1}`,
      content: "Drink at least 8 glasses (64 oz) of water today. Track each glass and notice how you feel.",
      prompt: "How did staying hydrated change your energy and mood?"
    }))
  },
  {
    id: "meal-prep-7", title: "7-Day Meal Prep", emoji: "🍳", category: "Body",
    duration: 7, color: "#ec4899", bg: "linear-gradient(135deg,#ec4899,#be185d)",
    tagline: "Plan and prepare meals for the week ahead", xpPerDay: 45,
    tasks: Array.from({length: 7}, (_, i) => ({
      day: i + 1,
      title: `Meal Prep Day ${i + 1}`,
      content: "Prepare one healthy meal or snack for the week. Focus on whole foods — grains, proteins, veggies.",
      prompt: "What did you prepare, and how will it nourish your body?"
    }))
  },
  {
    id: "veggie-challenge-14", title: "14-Day Veggie Challenge", emoji: "🥗", category: "Body",
    duration: 14, color: "#22c55e", bg: "linear-gradient(135deg,#84cc16,#65a30d)",
    tagline: "Eat a rainbow of vegetables every day", xpPerDay: 35,
    tasks: Array.from({length: 14}, (_, i) => ({
      day: i + 1,
      title: `Veggie Day ${i + 1}`,
      content: "Eat at least 3 different vegetables today. Aim for different colors — they have different nutrients.",
      prompt: "What vegetables did you eat, and how did they make you feel?"
    }))
  },
  {
    id: "sugar-detox-7", title: "7-Day Sugar Detox", emoji: "🍎", category: "Body",
    duration: 7, color: "#f59e0b", bg: "linear-gradient(135deg,#f59e0b,#d97706)",
    tagline: "Reset your relationship with sugar", xpPerDay: 40,
    tasks: Array.from({length: 7}, (_, i) => ({
      day: i + 1,
      title: `Sugar-Free Day ${i + 1}`,
      content: "Avoid added sugars today. Read labels, choose whole foods, and satisfy cravings with fruit.",
      prompt: "What sugar cravings did you notice, and how did you handle them?"
    }))
  },
  {
    id: "protein-power-7", title: "7-Day Protein Power", emoji: "🥚", category: "Body",
    duration: 7, color: "#8b5cf6", bg: "linear-gradient(135deg,#a855f7,#6d28d9)",
    tagline: "Build strength with protein-rich meals", xpPerDay: 38,
    tasks: Array.from({length: 7}, (_, i) => ({
      day: i + 1,
      title: `Protein Day ${i + 1}`,
      content: "Include a good source of protein at each meal — eggs, fish, beans, yogurt, meat, or nuts.",
      prompt: "What protein sources did you include, and how did they fuel you?"
    }))
  },
];

// Combine self-care, fitness, and nutrition challenges
const ALL_CHALLENGES = [...CHALLENGES, ...FITNESS_CHALLENGES, ...NUTRITION_CHALLENGES];

const CATS = ["All", "Faith", "Mindset", "Body", "Relationships"];
const CAT_COLORS = { Faith: "#D9A84A", Mindset: "#0ea5e9", Body: "#22c55e", Relationships: "#f43f5e" };

// ─── Storage ──────────────────────────────────────────────────────────────────
const LOCAL_KEY = "pr_selfcare_v3";
function loadLocal() { try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}"); } catch { return {}; } }
function saveLocal(d) { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(d)); } catch {} }
function todayStr() { return (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })(); }
function getDayTs(val) { return typeof val === "number" ? val : (val?.ts ?? 0); }
function getDayXP(val, fallback) { return typeof val === "number" ? fallback : (val?.xp ?? fallback); }

function getCompletedDays(cData) {
  if (!cData?.days) return [];
  return Object.keys(cData.days).map(Number).sort((a, b) => a - b);
}
function completedToday(cData) {
  if (!cData?.days) return false;
  return Object.values(cData.days).some(val => localDateKey(new Date(getDayTs(val))) === todayStr());
}
function calcStreak(cData) {
  if (!cData?.days) return 0;
  const byDate = {};
  Object.values(cData.days).forEach(val => { byDate[localDateKey(new Date(getDayTs(val)))] = true; });
  const today = todayStr();
  const yd = new Date(); yd.setDate(yd.getDate() - 1);
  const yesterday = localDateKey(yd);
  const start = byDate[today] ? new Date() : byDate[yesterday] ? yd : null;
  if (!start) return 0;
  let n = 0; const d = new Date(start);
  while (byDate[localDateKey(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function getTotalXP(localData) {
  return ALL_CHALLENGES.reduce((sum, c) => {
    const cData = localData[c.id];
    if (!cData?.days) return sum;
    return sum + Object.values(cData.days).reduce((s, val) => s + getDayXP(val, c.xpPerDay), 0);
  }, 0);
}
function getLevel(xp) {
  const L = [
    { min: 0,    max: 99,       label: "Seedling",   emoji: "🌱" },
    { min: 100,  max: 299,      label: "Grower",     emoji: "🌿" },
    { min: 300,  max: 599,      label: "Bloomer",    emoji: "🌸" },
    { min: 600,  max: 999,      label: "Thriver",    emoji: "🌳" },
    { min: 1000, max: Infinity, label: "Flourisher", emoji: "🌟" },
  ];
  return L.find(l => xp >= l.min && xp <= l.max) || L[0];
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti({ show }) {
  if (!show) return null;
  const colors = ["#FAD98D","#f43f5e","#0ea5e9","#22c55e","#8b5cf6","#f97316","#fbbf24"];
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,overflow:"hidden"}}>
      <style>{`@keyframes cf{to{transform:translateY(110vh) rotate(720deg);opacity:0}}`}</style>
      {Array.from({length:24},(_,i)=>(
        <div key={i} style={{
          position:"absolute",left:`${4+(i*3.8)%92}%`,top:"-20px",
          width:i%3===0?10:6,height:i%3===0?10:6,
          borderRadius:i%2===0?"50%":"2px",
          background:colors[i%colors.length],
          animation:`cf ${1.4+(i%3)*0.4}s ease-in ${i*0.05}s forwards`,
        }}/>
      ))}
    </div>
  );
}

// ─── XP Toast ─────────────────────────────────────────────────────────────────
function XPToast({ show, xp }) {
  return (
    <div style={{
      position:"fixed",top:70,right:16,zIndex:9998,
      background:"linear-gradient(135deg,#FAD98D,#c9a227)",
      color:"#0A1A2F",borderRadius:20,padding:"10px 18px",
      fontFamily:"Nunito,sans-serif",fontWeight:900,fontSize:15,
      boxShadow:"0 8px 32px rgba(217,184,120,0.5)",
      transition:"all 0.35s cubic-bezier(.34,1.56,.64,1)",
      transform:show?"translateY(0) scale(1)":"translateY(-80px) scale(0.8)",
      opacity:show?1:0,pointerEvents:"none",
    }}>✨ +{xp} XP earned!</div>
  );
}

// ─── Journey Map ──────────────────────────────────────────────────────────────
function JourneyMap({ challenge, completedDays }) {
  const nextDay = completedDays.length + 1;
  return (
    <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap",padding:"8px 0"}}>
      {challenge.tasks.map((t, i) => {
        const done = completedDays.includes(t.day);
        const cur  = !done && t.day === nextDay;
        return (
          <div key={t.day} style={{display:"flex",alignItems:"center"}}>
            <div style={{
              width:30,height:30,borderRadius:"50%",
              background: done ? challenge.color : cur ? challenge.color+"33" : "#F2F6FA",
              border:`2px solid ${done ? challenge.color : cur ? challenge.color : "#F2F6FA"}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:done?13:10,color:done?"white":cur?challenge.color:"#94a3b8",
              fontWeight:800,
            }}>{done?"✓":t.day}</div>
            {i < challenge.tasks.length-1 && (
              <div style={{width:8,height:2,background:done?"#FAD98D":"#F2F6FA",borderRadius:1}}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Challenge Detail View (NOT an overlay — renders as normal page content) ─
function ChallengeDetail({ challenge, localData, onBack, onStart, onComplete, onReset, onOpenChallenge, user }) {
  const [reflection, setReflection] = useState("");
  const [extraWriting, setExtraWriting] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showAllDays, setShowAllDays] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [lastSavedEntry, setLastSavedEntry] = useState(null);

  const cData        = localData[challenge.id] || null;
  const completedDays = getCompletedDays(cData);
  const isStarted    = !!cData;
  const isDone       = completedDays.length >= challenge.duration;
  const alreadyToday = completedToday(cData);
  const nextDayNum   = completedDays.length + 1;
  const currentTask  = !isDone ? challenge.tasks[completedDays.length] : null;
  const pct          = Math.round((completedDays.length / challenge.duration) * 100);
  const streak       = isStarted ? calcStreak(cData) : 0;
  const bonus        = streak >= 3 ? 10 : 0;
  const xpToday      = challenge.xpPerDay + bonus;
  const chars        = reflection.length;

  const handleComplete = async () => {
    if (!reflection.trim() || saving) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    const isLast = nextDayNum >= challenge.duration;

    // Build journal entry combining extra writing + reflection
    let entryContent = reflection.trim();
    if (extraWriting.trim()) {
      entryContent = `${currentTask?.extraWritingPrompt || '✍️ Writing'}\n${extraWriting.trim()}\n\n📝 Reflection:\n${reflection.trim()}`;
    }

    // Save to JournalEntry
    try {
      const saved = await base44.entities.JournalEntry.create({
        title: `${challenge.title} — Day ${nextDayNum}: ${currentTask?.title || ''}`,
        content: entryContent,
        entry_type: 'scripture_reflection',
        tags: ['challenge', challenge.category.toLowerCase(), challenge.id],
      });
      setLastSavedEntry(saved);
    } catch {}

    onComplete(challenge.id, nextDayNum, xpToday);
    setSaving(false);
    setReflection("");
    setExtraWriting("");
    setXpEarned(xpToday);
    setShowXP(true); setTimeout(() => setShowXP(false), 2500);
    if (isLast) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3500); }
  };

  const suggested = CHALLENGES.filter(c => c.id !== challenge.id && !localData[c.id]).slice(0, 2);

  return (
    <div style={{background:"#F8F4EE",fontFamily:"Nunito,sans-serif",minHeight:"100vh",paddingBottom:32}}>
      <Confetti show={showConfetti}/>
      <XPToast show={showXP} xp={xpEarned}/>

      {/* Back header */}
      <div style={{background:"white",borderBottom:"1px solid #F2F6FA",padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
        <button
          onClick={onBack}
          style={{width:38,height:38,borderRadius:"50%",background:"#F8F4EE",border:"none",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#0A1A2F",cursor:"pointer"}}
        >←</button>
        <div style={{flex:1}}>
          <div style={{fontFamily:"Lora,serif",fontWeight:700,fontSize:15,color:"#0A1A2F"}}>{challenge.title}</div>
          <div style={{fontSize:10,color:"#0A1A2F55",fontWeight:700,textTransform:"uppercase",letterSpacing:1.1}}>
            {challenge.duration} days · {challenge.category}{streak>1?` · 🔥 ${streak}-day streak`:""}
          </div>
        </div>
        <div style={{background:"linear-gradient(135deg,#FAD98D,#c9a227)",borderRadius:12,padding:"4px 10px",fontSize:11,fontWeight:900,color:"#0A1A2F"}}>
          +{challenge.xpPerDay} XP/day
        </div>
        {isStarted && (
          <button onClick={() => setConfirmReset(true)}
            style={{width:36,height:36,borderRadius:"50%",background:"#F8F4EE",border:"none",cursor:"pointer",fontSize:16,color:"#94a3b8"}}>↺</button>
        )}
      </div>

      <div style={{maxWidth:640,margin:"0 auto",padding:"0 16px"}}>

        {/* Hero card */}
        <div style={{marginTop:16,borderRadius:24,padding:20,background:challenge.bg,boxShadow:"0 12px 40px rgba(0,0,0,0.15)"}}>
          <div style={{fontSize:32,marginBottom:6}}>{challenge.emoji}</div>
          <div style={{color:"white",fontFamily:"Lora,serif",fontWeight:700,fontSize:20,lineHeight:1.2,marginBottom:4}}>{challenge.title}</div>
          <div style={{color:"rgba(255,255,255,0.75)",fontSize:13,marginBottom:isDone||!isStarted?0:14}}>{challenge.tagline}</div>

          {isStarted && !isDone && (
            <>
              <JourneyMap challenge={challenge} completedDays={completedDays}/>
              <div style={{background:"rgba(255,255,255,0.15)",borderRadius:14,padding:"10px 14px",marginTop:10}}>
                <div style={{display:"flex",justifyContent:"space-between",color:"white",fontSize:11,fontWeight:800,marginBottom:6}}>
                  <span>{completedDays.length}/{challenge.duration} days</span><span>{pct}%</span>
                </div>
                <div style={{height:7,background:"rgba(255,255,255,0.25)",borderRadius:99,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:"white",borderRadius:99}}/>
                </div>
              </div>
            </>
          )}

          {isDone && (
            <div style={{marginTop:14,background:"rgba(255,255,255,0.2)",borderRadius:16,padding:20,textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:8}}>🏆</div>
              <div style={{color:"white",fontFamily:"Lora,serif",fontWeight:700,fontSize:18}}>Challenge Complete!</div>
              <div style={{color:"rgba(255,255,255,0.7)",fontSize:12,marginTop:4}}>All {challenge.duration} days done</div>
            </div>
          )}
        </div>

        {/* Post-completion */}
        {isDone && (
          <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:10}}>
            {suggested.length > 0 && (
              <div style={{background:"white",borderRadius:20,border:"1px solid #F2F6FA",padding:"16px 20px"}}>
                <div style={{fontFamily:"Lora,serif",fontWeight:600,fontSize:14,color:"#0A1A2F",marginBottom:4}}>🌱 What's Next?</div>
                <div style={{fontSize:12,color:"#0A1A2F55",marginBottom:12}}>You've built real momentum. Keep growing.</div>
                {suggested.map(next => (
                  <button key={next.id} onClick={() => onOpenChallenge(next)}
                    style={{width:"100%",background:"#F8F4EE",borderRadius:14,border:"1px solid #F2F6FA",
                      padding:"10px 14px",display:"flex",alignItems:"center",gap:10,marginBottom:8,cursor:"pointer",textAlign:"left"}}>
                    <span style={{fontSize:24}}>{next.emoji}</span>
                    <div>
                      <div style={{fontWeight:700,fontSize:13,color:"#0A1A2F"}}>{next.title}</div>
                      <div style={{fontSize:11,color:"#0A1A2F44"}}>{next.duration} days · {next.xpPerDay} XP/day</div>
                    </div>
                    <span style={{marginLeft:"auto",color:"#FAD98D",fontWeight:900}}>→</span>
                  </button>
                ))}
              </div>
            )}
            <div style={{display:"flex",justifyContent:"center"}}>
              <ShareToFeedButton
                type="general_win"
                title={`Completed the ${challenge.title} challenge! 🏆`}
                content={`Just finished all ${challenge.duration} days of the "${challenge.title}" self-care challenge on Prosperity Revived. Consistency is built one day at a time. 🙏`}
                source="Hannah"
                label="Share this win"
                color="#FD9C2D"
                user={user}
              />
            </div>
            <button onClick={() => onReset(challenge.id)}
              style={{background:"white",border:"1px solid #F2F6FA",borderRadius:16,padding:"12px",
                color:"#94a3b8",fontSize:12,fontWeight:700,cursor:"pointer"}}>
              ↺ Repeat This Challenge
            </button>
          </div>
        )}

        {/* Today's task */}
        {isStarted && !isDone && currentTask && (
          <div style={{marginTop:16}}>
            <div style={{fontSize:10,fontWeight:800,color:"#0A1A2F44",textTransform:"uppercase",letterSpacing:1.5,marginBottom:10}}>
              {alreadyToday ? "✅ Completed Today" : `Today — Day ${nextDayNum} of ${challenge.duration}`}
            </div>

            {alreadyToday ? (
              <div style={{background:"white",borderRadius:20,border:"1px solid #D1FAE5",padding:20}}>
                <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:12}}>
                  <div style={{width:44,height:44,borderRadius:"50%",background:"#ECFDF5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>✅</div>
                  <div>
                    <div style={{fontWeight:800,fontSize:14,color:"#059669"}}>Day {completedDays[completedDays.length-1]} Complete!</div>
                    <div style={{fontSize:12,color:"#059669aa",marginTop:2}}>Beautifully done. Come back tomorrow for Day {nextDayNum}.</div>
                    <div style={{fontSize:11,color:"#059669",marginTop:4,fontWeight:700}}>📓 Saved to your Journal</div>
                  </div>
                </div>
                <ShareToFeedButton
                  type="scripture_reflection"
                  title={`${challenge.title} — Day ${completedDays[completedDays.length-1]} ⛰️`}
                  content={`Completed Day ${completedDays[completedDays.length-1]} of 40 Days in the Wilderness. Walking as Christ walked. 🙏`}
                  source="Gideon"
                  label="Share this day"
                  color={challenge.color}
                  user={user}
                />
              </div>
            ) : (
              <div style={{background:"white",borderRadius:24,border:`2px solid ${challenge.color}44`,padding:20,boxShadow:`0 4px 24px ${challenge.color}15`}}>
                {/* Day badge */}
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:challenge.bg,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:900,fontSize:14}}>
                    {nextDayNum}
                  </div>
                  <div>
                    <div style={{fontFamily:"Lora,serif",fontWeight:700,fontSize:16,color:"#0A1A2F"}}>{currentTask.title}</div>
                    <div style={{fontSize:10,color:"#0A1A2F44",fontWeight:700}}>Day {nextDayNum} Challenge</div>
                  </div>
                </div>

                {/* Task content */}
                <div style={{background:"#F8F4EE",borderRadius:14,padding:"12px 14px",fontSize:13,color:"#0A1A2F88",lineHeight:1.7,marginBottom:16}}>
                  {currentTask.content}
                </div>

                {/* Recommended verse link */}
                {currentTask.verse && (
                  <a
                    href={`https://www.bible.com/bible/111/${currentTask.verse.replace(/\s/g,'').replace(':','.').replace('-','.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display:"flex",alignItems:"center",gap:10,
                      background:"linear-gradient(135deg,#451a03,#78350f)",
                      borderRadius:14,padding:"10px 14px",marginBottom:16,
                      textDecoration:"none",
                    }}
                  >
                    <span style={{fontSize:18}}>📖</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,fontWeight:900,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:0.8}}>Today's Scripture</div>
                      <div style={{fontSize:13,fontWeight:800,color:"white"}}>{currentTask.verse}</div>
                    </div>
                    <span style={{color:"rgba(255,255,255,0.4)",fontSize:16}}>→</span>
                  </a>
                )}

                {/* Extra writing area — task-specific */}
                {currentTask?.extraWritingPrompt && (
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:800,color:"#0A1A2F44",textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>
                      ✍️ Today's Writing Task
                    </div>
                    <div style={{background:"#F0EBE0",borderRadius:12,padding:"8px 12px",fontSize:11,color:challenge.color,fontWeight:700,marginBottom:8,fontStyle:"italic"}}>
                      {currentTask.extraWritingPrompt}
                    </div>
                    <textarea
                      value={extraWriting}
                      onChange={e => setExtraWriting(e.target.value)}
                      placeholder="Write here…"
                      rows={5}
                      style={{
                        width:"100%",background:"#FFFBF5",borderRadius:14,
                        padding:"12px 14px",fontSize:13,color:"#0A1A2F",
                        border:"1.5px solid #F0EBE0",
                        outline:"none",resize:"none",lineHeight:1.8,
                        fontFamily:"Nunito,sans-serif",boxSizing:"border-box",
                      }}
                    />
                  </div>
                )}

                {/* Reflection */}
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:800,color:"#0A1A2F44",textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>
                    📝 Your Reflection <span style={{color:"#f43f5e"}}>*</span>
                  </div>
                  <div style={{background:"#F0EBE0",borderRadius:12,padding:"8px 12px",fontSize:11,color:challenge.color,fontWeight:700,marginBottom:8,fontStyle:"italic"}}>
                    💭 {currentTask.prompt}
                  </div>
                  <div style={{position:"relative"}}>
                    <textarea
                      maxLength={1000}
                      value={reflection}
                      onChange={e => setReflection(e.target.value)}
                      placeholder="Write freely — what did God show you today?"
                      rows={4}
                      style={{
                        width:"100%",background:"#F8F4EE",borderRadius:14,
                        padding:"12px 14px",fontSize:13,color:"#0A1A2F",
                        border:`1.5px solid ${chars>0?challenge.color+"66":"#F2F6FA"}`,
                        outline:"none",resize:"none",lineHeight:1.7,
                        fontFamily:"Nunito,sans-serif",boxSizing:"border-box",
                      }}
                    />
                    <div style={{position:"absolute",bottom:10,right:12,fontSize:10,color:chars>20?"#22c55e":"#94a3b8",fontWeight:700}}>
                      {chars} chars
                    </div>
                  </div>
                </div>

                {bonus > 0 && (
                  <div style={{background:"linear-gradient(135deg,#fef3c7,#fde68a)",borderRadius:12,padding:"8px 12px",fontSize:11,fontWeight:800,color:"#92400e",marginBottom:12}}>
                    🔥 {streak}-day streak! +{bonus} bonus XP
                  </div>
                )}

                <button
                  onClick={handleComplete}
                  disabled={saving || !reflection.trim()}
                  style={{
                    width:"100%",padding:"15px",borderRadius:18,
                    background:reflection.trim()?challenge.bg:"#F2F6FA",
                    border:"none",color:reflection.trim()?"white":"#94a3b8",
                    fontFamily:"Nunito,sans-serif",fontWeight:900,fontSize:15,
                    cursor:reflection.trim()?"pointer":"not-allowed",
                    display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                    boxShadow:reflection.trim()?`0 8px 24px ${challenge.color}44`:"none",
                  }}
                >
                  {saving ? "Saving…" : `✓ Complete Day ${nextDayNum} · +${xpToday} XP`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* All days accordion */}
        <div style={{marginTop:20}}>
          <button onClick={() => setShowAllDays(s => !s)}
            style={{width:"100%",background:"none",border:"none",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,padding:0}}>
            <span style={{fontSize:10,fontWeight:800,color:"#0A1A2F44",textTransform:"uppercase",letterSpacing:1.5}}>
              All {challenge.duration} Days
            </span>
            <span style={{color:"#0A1A2F33",fontSize:16,display:"inline-block",transform:showAllDays?"rotate(180deg)":"none",transition:"transform 0.2s"}}>⌄</span>
          </button>
          {showAllDays && (
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {challenge.tasks.map(task => {
                const done   = completedDays.includes(task.day);
                const isCurr = isStarted && task.day === nextDayNum && !isDone && !alreadyToday;
                const locked = isStarted && task.day > nextDayNum;
                return (
                  <div key={task.day} style={{
                    background:done?"#ECFDF5":isCurr?"white":"#F8F4EE",
                    border:`1.5px solid ${done?"#A7F3D0":isCurr?challenge.color+"44":"#F2F6FA"}`,
                    borderRadius:18,padding:"12px 14px",display:"flex",gap:12,alignItems:"flex-start",
                    opacity:locked?0.45:1,
                  }}>
                    <div style={{width:30,height:30,borderRadius:"50%",background:done?"#10b981":isCurr?challenge.color:"#F2F6FA",color:done||isCurr?"white":"#94a3b8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,flexShrink:0}}>
                      {done?"✓":locked?"🔒":task.day}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:800,fontSize:13,color:done?"#059669":"#0A1A2F",marginBottom:3}}>Day {task.day}: {task.title}</div>
                      {!locked
                        ? <div style={{fontSize:11,color:done?"#059669aa":"#0A1A2F55",lineHeight:1.6}}>{task.content}</div>
                        : <div style={{fontSize:11,color:"#0A1A2F33"}}>Unlocks after Day {task.day-1}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Start CTA */}
      {!isStarted && (
        <div style={{padding:"16px",marginTop:16}}>
          <button onClick={() => onStart(challenge.id)}
            style={{width:"100%",padding:"16px",borderRadius:20,
              background:"linear-gradient(135deg,#FAD98D,#c9a227)",
              border:"none",color:"#0A1A2F",fontFamily:"Nunito,sans-serif",
              fontWeight:900,fontSize:16,cursor:"pointer",
              boxShadow:"0 8px 24px rgba(217,184,120,0.4)"}}>
            ★ Start This Challenge · Earn up to {challenge.xpPerDay * challenge.duration} XP
          </button>
        </div>
      )}

      {/* Reset confirm */}
      {confirmReset && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)",
          display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"0 16px 32px",zIndex:200}}>
          <div style={{background:"white",borderRadius:28,padding:28,width:"100%",maxWidth:380,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
            <div style={{fontFamily:"Lora,serif",fontWeight:700,fontSize:18,color:"#0A1A2F",textAlign:"center",marginBottom:6}}>Reset Challenge?</div>
            <div style={{fontSize:12,color:"#0A1A2F55",textAlign:"center",marginBottom:24,lineHeight:1.6}}>Your progress will be cleared. Journal entries will stay.</div>
            <div style={{display:"flex",gap:12}}>
              <button onClick={() => setConfirmReset(false)}
                style={{flex:1,padding:14,borderRadius:16,border:"1px solid #F2F6FA",background:"white",cursor:"pointer",fontWeight:700,fontSize:13,color:"#0A1A2F66"}}>Cancel</button>
              <button onClick={() => { onReset(challenge.id); setConfirmReset(false); }}
                style={{flex:1,padding:14,borderRadius:16,border:"none",background:"#f43f5e",color:"white",cursor:"pointer",fontWeight:800,fontSize:13}}>Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Challenge Card (list view) ───────────────────────────────────────────────
function ChallengeCard({ challenge, localData, onOpen, isFitness }) {
  const cData         = localData[challenge.id] || null;
  const completedDays = getCompletedDays(cData);
  const isStarted     = !!cData;
  const isDone        = completedDays.length >= challenge.duration;
  const pct           = (completedDays.length / challenge.duration) * 100;
  const streak        = isStarted ? calcStreak(cData) : 0;
  const doneToday     = completedToday(cData);
  const catColor      = CAT_COLORS[challenge.category];

  return (
    <button onClick={() => onOpen(challenge)}
      style={{width:"100%",background:"white",borderRadius:22,border:"1.5px solid #F2F6FA",
        cursor:"pointer",textAlign:"left",overflow:"hidden",padding:0}}>
      <div style={{height:3,background:challenge.bg}}/>
      <div style={{padding:"14px 16px"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
          <div style={{width:44,height:44,borderRadius:14,background:challenge.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
            {challenge.emoji}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:4}}>
              <div style={{fontFamily:"Lora,serif",fontWeight:700,fontSize:14,color:"#0A1A2F",lineHeight:1.2}}>{challenge.title}</div>
              <span style={{color:"#CBD5E1",fontSize:18,flexShrink:0}}>›</span>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5,margin:"5px 0"}}>
              <span style={{fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:1,padding:"2px 7px",borderRadius:99,background:catColor+"18",color:catColor,border:`1px solid ${catColor}33`}}>{challenge.category}</span>
              <span style={{fontSize:10,color:"#0A1A2F44"}}>{challenge.duration} days</span>
              <span style={{fontSize:10,color:"#FAD98D",fontWeight:700}}>· {challenge.xpPerDay*challenge.duration} XP</span>
              {isStarted && !isDone && streak>0 && <span style={{fontSize:10,fontWeight:800,color:"#f97316"}}>🔥 {streak}d</span>}
              {doneToday && !isDone && <span style={{fontSize:10,fontWeight:800,color:"#22c55e"}}>✓ Done</span>}
              {isDone && <span style={{fontSize:10,fontWeight:800,color:"#8b5cf6"}}>🏆 Complete</span>}
            </div>
            <div style={{fontSize:11,color:"#0A1A2F44",lineHeight:1.4}}>{challenge.tagline}</div>
          </div>
        </div>
        {isStarted && (
          <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #F8F4EE"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontSize:10,color:"#0A1A2F44"}}>{isDone?"🎉 Finished!":`Day ${completedDays.length+1} of ${challenge.duration}`}</span>
              <span style={{fontSize:10,fontWeight:800,color:challenge.color}}>{Math.round(pct)}%</span>
            </div>
            <div style={{height:5,background:"#F0EBE0",borderRadius:99,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct}%`,background:challenge.bg,borderRadius:99}}/>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SelfCareChallengesPage() {
  const [localData,   setLocalData]   = useState(loadLocal);
  const [selectedId,  setSelectedId]  = useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);
  const [activeCat,   setActiveCat]   = useState("All");

  const selected      = selectedId ? ALL_CHALLENGES.find(c => c.id === selectedId) : null;
  const activeList    = ALL_CHALLENGES.filter(c => localData[c.id] && getCompletedDays(localData[c.id]).length < c.duration);
  const completedCount = ALL_CHALLENGES.filter(c => localData[c.id] && getCompletedDays(localData[c.id]).length >= c.duration).length;
  const totalXP       = getTotalXP(localData);
  const level         = getLevel(totalXP);
  const hasAny        = Object.keys(localData).length > 0;

  const handleStart    = id => { const u = {...localData,[id]:{startedAt:Date.now(),days:{}}}; setLocalData(u); saveLocal(u); };
  const handleComplete = (id, dayNum, xp) => {
    const ex = localData[id] || {startedAt:Date.now(),days:{}};
    const days = {...(ex.days||{}),[dayNum]:{ts:Date.now(),xp}};
    const u = {...localData,[id]:{...ex,days}};
    setLocalData(u); saveLocal(u);
  };
  const handleReset    = id => { const u={...localData}; delete u[id]; setLocalData(u); saveLocal(u); setSelectedId(null); };

  const filtered = [...(activeCat==="All" ? ALL_CHALLENGES : ALL_CHALLENGES.filter(c=>c.category===activeCat))]
    .sort((a,b)=>{
      const aA=localData[a.id]&&getCompletedDays(localData[a.id]).length<a.duration;
      const bA=localData[b.id]&&getCompletedDays(localData[b.id]).length<b.duration;
      const aD=localData[a.id]&&getCompletedDays(localData[a.id]).length>=a.duration;
      const bD=localData[b.id]&&getCompletedDays(localData[b.id]).length>=b.duration;
      if(aA&&!bA)return -1; if(bA&&!aA)return 1;
      if(aD&&!bD)return 1;  if(bD&&!aD)return -1;
      return 0;
    });

  // ── If a challenge is selected, render it as the full page ──────────────────
  if (selected) {
    return (
      <ChallengeDetail
        key={selected.id}
        challenge={selected}
        localData={localData}
        onBack={() => setSelectedId(null)}
        onStart={handleStart}
        onComplete={handleComplete}
        onReset={handleReset}
        onOpenChallenge={c => setSelectedId(c.id)}
        user={user}
      />
    );
  }

  // ── List view ───────────────────────────────────────────────────────────────
  return (
    <div style={{background:"#F8F4EE",fontFamily:"Nunito,sans-serif",minHeight:"100vh",paddingBottom:32}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,400&family=Nunito:wght@400;600;700;800;900&display=swap');
        .sc-cat::-webkit-scrollbar{display:none}
      `}</style>

      {/* ── Standard Header ── */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#FAD98D]/20 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FAD98D] to-[#c9a227] flex items-center justify-center">
            <Flower2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white dark:text-white">Self-Care Challenges</h1>
            <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">Build healthy habits</p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{padding:"8px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{background:"linear-gradient(135deg,#FAD98D,#c9a227)",borderRadius:20,padding:"6px 14px",display:"flex",alignItems:"center",gap:6,boxShadow:"0 4px 12px rgba(217,184,120,0.3)"}}>
          <span style={{fontSize:14}}>{level.emoji}</span>
          <div>
            <div style={{fontSize:11,fontWeight:900,color:"#0A1A2F"}}>{totalXP} XP</div>
            <div style={{fontSize:8,fontWeight:800,color:"#0A1A2F77",textTransform:"uppercase",letterSpacing:0.8}}>{level.label}</div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:640,margin:"0 auto",padding:"16px 16px 0"}}>

        {/* Active challenges hero */}
        {activeList.length>0 && (
          <div style={{marginBottom:20}}>
            {activeList.map(c => {
              const cData = localData[c.id];
              const cDays = getCompletedDays(cData);
              const todayDone = completedToday(cData);
              const nextDay = cDays.length+1;
              const streak = calcStreak(cData);
              return (
                <div key={c.id} onClick={()=>setSelectedId(c.id)}
                  style={{borderRadius:24,background:c.bg,padding:"18px 20px",cursor:"pointer",
                    boxShadow:"0 12px 40px rgba(0,0,0,0.15)",marginBottom:10,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:-20,right:-20,fontSize:80,opacity:0.12,pointerEvents:"none"}}>{c.emoji}</div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{background:"rgba(255,255,255,0.2)",borderRadius:99,padding:"3px 10px",fontSize:10,color:"white",fontWeight:800,textTransform:"uppercase",letterSpacing:1}}>🎯 Today's Focus</div>
                    {streak>1&&<div style={{background:"rgba(255,255,255,0.2)",borderRadius:99,padding:"3px 10px",fontSize:10,color:"white",fontWeight:800}}>🔥 {streak}-day streak</div>}
                  </div>
                  <div style={{color:"white",fontFamily:"Lora,serif",fontWeight:700,fontSize:17,marginBottom:4}}>{c.title}</div>
                  {todayDone
                    ? <div style={{color:"rgba(255,255,255,0.85)",fontSize:13}}>✅ Day {cDays.length} done! Return tomorrow for Day {nextDay}.</div>
                    : <div style={{color:"rgba(255,255,255,0.85)",fontSize:13}}>Day {nextDay}: {c.tasks[cDays.length]?.title} →</div>}
                </div>
              );
            })}
          </div>
        )}

        {/* Stats */}
        {hasAny && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
            {[
              {label:"Active",value:activeList.length,emoji:"🔥"},
              {label:"Done",value:completedCount,emoji:"🏆"},
              {label:"Level",value:level.label,emoji:level.emoji},
            ].map(s=>(
              <div key={s.label} style={{background:"white",borderRadius:20,border:"1px solid #F2F6FA",padding:"12px 8px",textAlign:"center"}}>
                <div style={{fontSize:20,marginBottom:4}}>{s.emoji}</div>
                <div style={{fontSize:15,fontWeight:900,color:"#0A1A2F"}}>{s.value}</div>
                <div style={{fontSize:9,fontWeight:800,color:"#0A1A2F44",textTransform:"uppercase",letterSpacing:1}}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Onboarding */}
        {!hasAny && (
          <div style={{background:"linear-gradient(135deg,#0A1A2F,#0A1A2F)",borderRadius:24,padding:"20px",marginBottom:20,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",right:-10,top:-10,fontSize:80,opacity:0.08}}>🌱</div>
            <div style={{color:"#FAD98D",fontFamily:"Lora,serif",fontWeight:700,fontSize:18,marginBottom:6}}>Start Your Growth Journey</div>
            <div style={{color:"rgba(255,255,255,0.7)",fontSize:13,lineHeight:1.6,marginBottom:14}}>Each challenge builds one positive habit — for your faith, mind, body, and relationships.</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["Complete a day","Write your reflection","Earn XP & level up","Build real habits"].map(s=>(
                <div key={s} style={{background:"rgba(217,184,120,0.15)",border:"1px solid rgba(217,184,120,0.3)",borderRadius:99,padding:"4px 10px",fontSize:11,color:"#FAD98D",fontWeight:700}}>✦ {s}</div>
              ))}
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="sc-cat" style={{display:"flex",gap:8,overflowX:"auto",marginBottom:16,paddingBottom:4,scrollbarWidth:"none",msOverflowStyle:"none"}}>
          {CATS.map(cat=>(
            <button key={cat} onClick={()=>setActiveCat(cat)}
              style={{flexShrink:0,fontSize:12,fontWeight:800,padding:"7px 16px",borderRadius:99,border:"1.5px solid",
                borderColor:activeCat===cat?"#0A1A2F":"#F2F6FA",
                background:activeCat===cat?"#0A1A2F":"white",
                color:activeCat===cat?"white":"#0A1A2F66",cursor:"pointer"}}>
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Challenge Banner */}
        {(() => {
          const featured = CHALLENGES.find(c => c.featured);
          if (!featured) return null;
          const isActive = !!localData[featured.id];
          const isCompleted = isActive && getCompletedDays(localData[featured.id]).length >= featured.duration;
          const daysLeft = isActive ? featured.duration - getCompletedDays(localData[featured.id]).length : featured.duration;
          return (
            <div onClick={() => setSelectedId(featured.id)}
              style={{
                borderRadius: 24, padding: "24px 20px", cursor: "pointer",
                background: featured.bg,
                boxShadow: "0 16px 48px rgba(69,26,3,0.4)",
                marginBottom: 16, position: "relative", overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)"
              }}>
              <div style={{position:"absolute",top:-30,right:-30,fontSize:120,opacity:0.06,pointerEvents:"none"}}>✝</div>
              <div style={{position:"absolute",bottom:-20,left:-20,fontSize:80,opacity:0.04,pointerEvents:"none"}}>⛰️</div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{background:"rgba(255,255,255,0.15)",borderRadius:99,padding:"3px 12px",fontSize:9,color:"rgba(255,255,255,0.9)",fontWeight:900,textTransform:"uppercase",letterSpacing:1.5}}>✦ Featured Challenge</div>
                {isActive && !isCompleted && <div style={{background:"rgba(255,255,255,0.12)",borderRadius:99,padding:"3px 10px",fontSize:9,color:"rgba(255,255,255,0.8)",fontWeight:800}}>{daysLeft} days left</div>}
                {isCompleted && <div style={{background:"rgba(255,255,255,0.12)",borderRadius:99,padding:"3px 10px",fontSize:9,color:"rgba(255,255,255,0.8)",fontWeight:800}}>✅ Completed</div>}
              </div>
              <div style={{color:"white",fontFamily:"Lora,serif",fontWeight:700,fontSize:22,marginBottom:6,lineHeight:1.2}}>{featured.title}</div>
              <div style={{color:"rgba(255,255,255,0.55)",fontSize:12,fontStyle:"italic",marginBottom:10,lineHeight:1.5}}>{featured.tagline}</div>
              <div style={{color:"rgba(255,255,255,0.65)",fontSize:12,lineHeight:1.7,marginBottom:14}}>{featured.description?.substring(0, 180)}...</div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <a
                  href="https://www.bible.com/bible/111/MAT.4.NIV"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{display:"flex",alignItems:"center",gap:6,textDecoration:"none"}}
                >
                  <span style={{fontSize:13}}>📖</span>
                  <span style={{color:"rgba(255,255,255,0.85)",fontSize:11,fontWeight:700,textDecoration:"underline",textUnderlineOffset:2}}>Matthew 4:1-11</span>
                </a>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:13}}>⏳</span>
                  <span style={{color:"rgba(255,255,255,0.6)",fontSize:11,fontWeight:600}}>40 Days</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:13}}>🔥</span>
                  <span style={{color:"rgba(255,255,255,0.6)",fontSize:11,fontWeight:600}}>{featured.xpPerDay} XP/day</span>
                </div>
              </div>
              <div style={{marginTop:14,background:"rgba(255,255,255,0.12)",borderRadius:16,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <span style={{color:"white",fontSize:13,fontWeight:700}}>{isActive ? (isCompleted ? "View Journey" : "Continue Your Pilgrimage") : "Begin the Pilgrimage"}</span>
                <span style={{color:"rgba(255,255,255,0.5)",fontSize:14}}>→</span>
              </div>
            </div>
          );
        })()}

        {/* Challenge list */}
         <div style={{display:"flex",flexDirection:"column",gap:12}}>
           {filtered.map(c=>(
             <ChallengeCard key={c.id} challenge={c} localData={localData} onOpen={c=>setSelectedId(c.id)} isFitness={FITNESS_CHALLENGES.find(f=>f.id===c.id)? true : false}/>
           ))}
         </div>

        {/* All-done nudge */}
        {hasAny && activeList.length===0 && completedCount>0 && (
          <div style={{marginTop:24,background:"white",borderRadius:22,border:"1px solid #F2F6FA",padding:"18px 20px",textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:8}}>🌟</div>
            <div style={{fontFamily:"Lora,serif",fontWeight:700,fontSize:16,color:"#0A1A2F",marginBottom:4}}>You're on a roll!</div>
            <div style={{fontSize:13,color:"#0A1A2F55"}}>Pick a new challenge below and keep growing.</div>
          </div>
        )}
      </div>
    </div>
  );
}