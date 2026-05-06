/**
 * Daily discussion topics for community groups.
 * ─────────────────────────────────────────────────────────────────────────
 * Each group receives a different discussion prompt every day. The prompt
 * is selected deterministically from a 60-prompt library per category,
 * with a per-group offset that ensures two groups in the same category
 * see different prompts on the same day.
 *
 * SELECTION FORMULA:
 *   topic_index = (dayOfYear + groupOffset) % 60
 *   where groupOffset = stableHash(groupId) % 60
 *
 * GUARANTEES:
 *   - Same group, same day → same prompt (shared discussion thread)
 *   - Same group, next day → different prompt
 *   - Different groups, same category, same day → likely different prompts
 *   - A daily user in one group sees a repeat every 60 days
 *   - A user across multiple groups in the same category sees many more
 *     unique prompts thanks to per-group offsets
 *
 * WHY STATIC (NOT LLM-GENERATED):
 *   - Theological consistency: hand-vetted, scripture-aligned, no risk of
 *     LLM drift toward New Age vocabulary or doctrinally-suspect phrasing.
 *   - Zero ongoing cost: 32 groups × 365 days would mean ~12k LLM calls/yr.
 *   - Instant load: no 3-5s wait for the first member each day.
 *   - This mirrors the static-script approach used for guided meditations
 *     in src/utils/meditationScripts.js for the same reasons.
 *
 * AUTHORING NOTES (per prompt):
 *   - One or two sentences, ending in an open question
 *   - Christian framing throughout
 *   - Invites a specific personal story, not a yes/no answer
 *   - Avoids clichés ("what are you grateful for today")
 *   - Tone matches the category (reflective, energizing, tender, etc.)
 *
 * GROWING THE LIBRARY:
 *   To extend a category beyond 60 prompts, simply append to the array
 *   below and update the cycle length constant if needed. The selection
 *   function will automatically incorporate the new entries.
 */

// 60 prompts per category. Cycle length = 60.
const CYCLE_LENGTH = 60;

const TOPICS = {
  // ─── BIBLE STUDY (60) ───────────────────────────────────────────────────
  // Scripture-rooted reflection. Invites members to share what God's Word is
  // teaching them, characters they're drawn to, verses they're wrestling with.
  bible_study: [
    "Which character in Scripture has surprised you most this year, and what surprised you about them?",
    "Share one verse you've been carrying with you lately. Why is it sticking?",
    "What's a passage you used to read past quickly that has recently stopped you in your tracks?",
    "When you read about Jesus interacting with someone in the Gospels, who do you most identify with — and why?",
    "What's one Old Testament story you wish you understood better?",
    "Describe a time when a verse you'd read a hundred times suddenly meant something new.",
    "If you could ask one Bible figure a single question, who would you choose, and what would you ask?",
    "What's a portion of Scripture you tend to avoid? What do you think is underneath that?",
    "Which of the Psalms speaks most to your current season?",
    "Tell us about a verse that felt like God speaking directly to you this week.",
    "What's a parable of Jesus that you wrestle with?",
    "Which woman in Scripture do you find yourself thinking about lately?",
    "Share one truth from the Bible that has reshaped how you see yourself.",
    "What's a passage that helped you through your hardest season?",
    "Describe an attribute of God that has become more real to you recently.",
    "Which book of the Bible do you find yourself returning to again and again?",
    "What's a Bible promise you're holding onto right now?",
    "Tell us about a time when reading Scripture led you to repent.",
    "Which of Jesus' miracles speaks loudest to your heart, and why?",
    "What's a hard teaching of Jesus that you're still wrestling with?",
    "Share a passage that has shaped your view of marriage, family, or friendship.",
    "Which of the disciples do you find most relatable, and what does that say about you?",
    "What's one thing you've learned about prayer from how Jesus prayed?",
    "Tell us about a verse you've memorized — and the moment that prompted you to memorize it.",
    "Which prophet's voice cuts through to you most clearly?",
    "Share one passage that has helped you trust God's timing.",
    "What's something you used to believe about God that Scripture has corrected?",
    "Describe a time when the Bible challenged you, even when you didn't want to hear it.",
    "Which of Paul's letters has shaped you most, and what specifically?",
    "Tell us about a Bible character whose obedience inspires you.",
    "What's one verse that addresses a fear you carry?",
    "Share a passage that makes you laugh — or smile.",
    "Which biblical figure's failure has comforted you?",
    "What's a Scripture you wish more people knew?",
    "Describe an image from the Bible that has stayed with you.",
    "Tell us about a verse you'd want on the wall of your home.",
    "Which of the Beatitudes feels most distant from your life right now?",
    "Share a Scripture that has taught you about forgiveness.",
    "What's a story in the Bible where you can't tell whose side you're meant to take?",
    "Tell us about a passage that has shaped how you approach work.",
    "Which Bible character's prayer would you most like to pray in your own voice?",
    "Share a verse that has reframed how you think about money or generosity.",
    "What's something Jesus said that you find genuinely hard to do?",
    "Describe a moment when Scripture showed you a sin you didn't know you had.",
    "Tell us about a passage that has shaped how you parent — or how you wish to parent one day.",
    "Which Bible character do you most want to meet in heaven?",
    "Share a verse you're praying over your future this season.",
    "What's a portion of Scripture that has helped you grieve?",
    "Tell us about a verse that gives you courage to share your faith.",
    "Which of the 'I am' statements of Jesus rings most loudly for you right now?",
    "Share a passage that has shaped how you see your body.",
    "What's a Scripture you've come to understand differently as you've gotten older?",
    "Tell us about a moment when reading the Bible felt boring — and what changed.",
    "Which biblical city or place would you most want to visit, and why?",
    "Share a verse that has shaped how you handle conflict.",
    "What's a Scripture that addresses the kind of doubt you sometimes feel?",
    "Tell us about a Bible character whose faithfulness in waiting has marked you.",
    "Which passage do you go to when life feels chaotic?",
    "Share a verse you'd give to someone who is just beginning to follow Jesus.",
    "What's a part of the Bible you'd love to study together with this group?",
  ],

  // ─── PRAYER (60) ────────────────────────────────────────────────────────
  // Honest, vulnerable, practice-oriented. Members share what they're praying,
  // how they pray, what God seems to be saying, where prayer feels stuck.
  prayer: [
    "What's one prayer you're holding right now that you'd ask others to carry with you?",
    "Describe a time recently when you felt God genuinely heard you.",
    "What's a prayer of yours that God answered differently than you asked?",
    "Where does prayer feel stuck for you right now?",
    "Share a recent answered prayer — even a small one.",
    "What position or posture do you pray in most often, and why?",
    "Tell us about a prayer you've been praying for years.",
    "What's the hardest thing you've ever prayed?",
    "Describe a moment when prayer felt like it actually changed you, not your circumstances.",
    "What's one thing you'd love to learn about prayer from someone in this group?",
    "Share a prayer you find yourself returning to in seasons of stress.",
    "When was the last time you wept while praying?",
    "What time of day do you find prayer comes most naturally?",
    "Describe a prayer practice you used to have that you'd like to recover.",
    "Tell us about a person you can't help praying for.",
    "What's something you struggle to bring before God in prayer?",
    "Share a moment when someone else's prayer for you changed something.",
    "What's a Psalm you've prayed as your own?",
    "Describe a place where you most easily meet God in prayer.",
    "Tell us about a season when prayer felt like silence — and what carried you through.",
    "What's the most surprising answer to prayer you've ever experienced?",
    "Share a prayer of confession you needed to pray this week.",
    "What does it look like for you to pray with your spouse, family, or roommates?",
    "Describe one thing you wish were easier for you in prayer.",
    "Tell us about a hymn or song that prays words you couldn't find on your own.",
    "What's a prayer you've prayed that you suspect God smiled at?",
    "Share a prayer you've been afraid to pray. You don't have to share the details.",
    "Describe a moment when you sensed the Holy Spirit guiding your prayer.",
    "What's a Scripture you've learned to pray back to God?",
    "Tell us about your prayer for someone outside this group, who doesn't yet know Jesus.",
    "What's the most honest prayer you've prayed lately?",
    "Share a way you pray that doesn't involve words.",
    "Describe a time when fasting and prayer went together for you.",
    "Tell us about a prayer that took years to be answered.",
    "What's something you're learning to thank God for that used to feel hard?",
    "Share a prayer you pray over your home.",
    "What does intercession look like in your daily life?",
    "Describe how prayer in community has felt different from praying alone.",
    "Tell us about the Lord's Prayer — which line lands hardest for you right now?",
    "What's a prayer your mother, father, or grandparent prayed over you?",
    "Share a prayer you carry into a particular relationship.",
    "Describe a moment when prayer felt deeply ordinary — and that's what made it sacred.",
    "Tell us about a season when you couldn't pray, and someone prayed for you.",
    "What's a prayer you'd love to teach a child to pray?",
    "Share a way prayer has changed how you make decisions.",
    "Describe a prayer you've prayed for your work or calling.",
    "Tell us about a time when journaling helped your prayer life.",
    "What's a posture of surrender you're learning in prayer?",
    "Share a prayer you'd like the people you love to pray over you.",
    "Describe a moment when worship became prayer for you.",
    "Tell us about your prayer for healing — physical, emotional, or relational.",
    "What's a prayer of praise that has shaped your week?",
    "Share a prayer you've been praying about a fear.",
    "Describe a way you've experienced God's nearness when no one else was praying with you.",
    "Tell us about a prayer for guidance — and what came of it.",
    "What's something you'd like this group to pray for you about right now?",
    "Share a prayer of gratitude that's harder than it should be.",
    "Describe how silence has — or hasn't — found a place in your prayer life.",
    "Tell us about a prayer you've prayed for your enemies.",
    "What's one way you'd love to deepen your prayer life over the next month?",
  ],

  // ─── WELLNESS (60) ──────────────────────────────────────────────────────
  // Whole-person care: rest, mental health, healthy habits, holistic faith.
  // Frames wellness through stewardship of the body and soul God gave you.
  wellness: [
    "What's one practice that has actually moved the needle on your wellbeing this year?",
    "Where in your life are you running on fumes — and what's God saying about it?",
    "Describe a small habit you've built that quietly shapes your days.",
    "What does Sabbath rest look like for you, honestly?",
    "Share one wellness practice you've abandoned that you'd like to recover.",
    "Where does anxiety tend to show up in your body? What helps?",
    "Tell us about a season when caring for your body became an act of worship.",
    "What's a wellness goal you've been afraid to set out loud?",
    "Describe a person whose calm presence makes you breathe easier.",
    "Share one boundary you've set this year that has protected your peace.",
    "What does self-care mean to you that doesn't feel selfish?",
    "Tell us about a moment when you said no to something good in order to say yes to something better.",
    "Where in your life are you striving when you could be receiving?",
    "Describe a place that restores you when you go there.",
    "Share something about your sleep that you're working on or learning to honor.",
    "What's an area where shame is louder than truth in how you see yourself?",
    "Tell us about a counselor, doctor, or wise friend who has helped you grow whole.",
    "Where does perfectionism still own you, and what's one step toward freedom?",
    "Describe a movement practice you genuinely look forward to.",
    "Share a way you're learning to talk to yourself with kindness.",
    "What's one thing you do daily that keeps you grounded?",
    "Tell us about a season of rest that surprised you with its gifts.",
    "Where do you struggle to say no?",
    "Describe a moment when you noticed your body was telling you something your mind wouldn't.",
    "Share an honest answer to: how is your soul today?",
    "What's a stress you've been carrying that you haven't named yet?",
    "Tell us about a friendship that makes you healthier just by being in it.",
    "Where does comparison still hijack you?",
    "Describe a small act of self-care that feels deeply spiritual to you.",
    "Share a way you're learning to trust your body again.",
    "What's a meal, walk, or rhythm that has become sacred to you?",
    "Tell us about a fear you're working to face in healthy ways.",
    "Where are you tempted to numb instead of feel?",
    "Describe a season of healing that took longer than you wanted.",
    "Share a practice that helps you transition from work mode to rest.",
    "What's one way technology helps your wellbeing — and one way it hurts it?",
    "Tell us about a person you'd want to invite into your wellness journey.",
    "Where do you sense God inviting you to slow down?",
    "Describe a moment when a friend's question helped you see your life more clearly.",
    "Share a way you've grown in emotional honesty this year.",
    "What's a relationship that has been good for your soul?",
    "Tell us about something you've been postponing that your soul needs.",
    "Where in your life are you carrying weight that isn't yours to carry?",
    "Describe a fear about your body or health that you'd like to surrender.",
    "Share something that genuinely makes you feel alive.",
    "What's a bad rhythm you've broken — or are trying to break?",
    "Tell us about a practice that connects your mind, body, and spirit.",
    "Where does laughter still find you regularly?",
    "Describe a way you've grown in caring for your mental health.",
    "Share an honest answer to: what would slowing down cost you, really?",
    "What's a part of your story you're learning to tell with less shame?",
    "Tell us about a recent small joy that lifted you.",
    "Where do you most need rest right now — physical, emotional, or spiritual?",
    "Describe a discipline that has stopped feeling like a discipline.",
    "Share something you've stopped doing that has been good for you.",
    "What's a way you're learning to live more presently?",
    "Tell us about a wellness habit you've maintained for over a year. How did you build it?",
    "Where is God inviting you to greater integrity between what you say and how you live?",
    "Describe a way you'd like to grow in stewarding your body this season.",
    "Share one practice you'd love to add to your week, even imperfectly.",
  ],

  // ─── WORKOUT (60) ───────────────────────────────────────────────────────
  // Strength, discipline, the body as a temple. Energizing tone but honest
  // about plateaus, injuries, motivation dips. Faith woven in but not forced.
  workout: [
    "What's one physical limit you've pushed past in the last month — and what did it teach you?",
    "Tell us about a workout that wrecked you in the best way recently.",
    "What movement makes you feel most like yourself?",
    "Describe a fitness goal you're chasing right now.",
    "Share a moment when training your body taught you something about your faith.",
    "Where are you in your current training cycle — building, peaking, recovering?",
    "What's a lift, a distance, or a skill you've been working toward for a while?",
    "Tell us about a setback that ended up being a comeback.",
    "Describe a workout song or playlist that gets you locked in.",
    "Share one habit that has transformed your training this year.",
    "What's a piece of fitness advice you wish you'd heard ten years earlier?",
    "Tell us about a coach, trainer, or training partner who shaped you.",
    "Where do you struggle most with consistency?",
    "Describe a moment when you almost quit — and what got you to the next set.",
    "Share a non-scale victory you're proud of.",
    "What's a body part you used to neglect that you've learned to train?",
    "Tell us about a recovery practice that has changed your training.",
    "Where are you in the comparison-vs-competition spectrum right now?",
    "Describe a goal you've chased that taught you something even though you didn't reach it.",
    "Share a Bible verse that has motivated you in a hard workout.",
    "What's a physical skill you'd love to learn this year?",
    "Tell us about your warmup ritual.",
    "Where do you train — gym, home, outdoors, mix?",
    "Describe a moment when your body did more than you thought it could.",
    "Share a piece of equipment you couldn't train without.",
    "What's a workout style you used to hate that has grown on you?",
    "Tell us about an injury that taught you something.",
    "Where are you in your rest-day discipline? Honest answer.",
    "Describe a hike, run, or ride that's stayed in your memory.",
    "Share a way training has shaped your character beyond your body.",
    "What's a session this week you're proud of?",
    "Tell us about your relationship with the scale.",
    "Where do you find motivation when you're not feeling it?",
    "Describe a movement you're working to master.",
    "Share a meal that fuels your hardest workouts.",
    "What's a podcast, channel, or coach that's making you better?",
    "Tell us about a partner workout that pushed you past what you'd do alone.",
    "Where do you most need to grow — mobility, strength, endurance, or skill?",
    "Describe a moment when prayer found you mid-workout.",
    "Share a goal you're chasing this quarter.",
    "What's a metric or number you're tracking right now?",
    "Tell us about your post-workout routine.",
    "Where do you feel weakest — and how are you addressing it?",
    "Describe an outdoor workout you'd love to try or do again.",
    "Share something about your training that surprises people.",
    "What's a fitness myth you used to believe that you've outgrown?",
    "Tell us about a moment when your body let you down — and how you handled it.",
    "Where do you draw the line between discipline and obsession?",
    "Describe a coach you'd love to train under for a day.",
    "Share a way the church and the gym have intersected for you.",
    "What's a session that sounds boring but has been transforming you?",
    "Tell us about a friend you've gotten into training.",
    "Where are you in your sleep — your real recovery?",
    "Describe a stretch, mobility piece, or warmup that fixed something nagging.",
    "Share a way training your body has helped you train your mind.",
    "What's a goal you almost gave up on that you're glad you didn't?",
    "Tell us about a moment when you trained tired and were glad you showed up anyway.",
    "Where do you want to be physically a year from now?",
    "Describe a recovery habit you've adopted in the last six months.",
    "Share something you're learning to celebrate about your body.",
  ],

  // ─── COOKING (60) ───────────────────────────────────────────────────────
  // Food as gathering, nourishment, faith, family heritage. Recipes and
  // techniques but also memory and meaning around the table.
  cooking: [
    "What's a meal that always makes your kitchen smell like home?",
    "Tell us about the first recipe you learned to make well.",
    "Describe a dish you've cooked dozens of times that still feels special.",
    "Share a meal that connects you to a person you love or have lost.",
    "What's an ingredient you've stopped cooking with — and one you've started?",
    "Tell us about a recipe disaster you can finally laugh about.",
    "Describe your weeknight dinner default that never lets you down.",
    "Share a kitchen tool you couldn't cook without.",
    "What's a recipe handed down through your family that you still make?",
    "Tell us about a meal you cooked for someone going through a hard time.",
    "Describe a dish that takes more time than it has any right to — and it's worth it.",
    "Share a way you've grown as a cook this year.",
    "What's a cuisine you've been wanting to learn?",
    "Tell us about a dish you make differently from how it's 'supposed' to be made.",
    "Describe a cookbook that has earned permanent residence in your kitchen.",
    "Share a meal that transformed how you think about food.",
    "What's a dish you make that always brings the table closer together?",
    "Tell us about a Sunday dinner tradition you're trying to build or keep alive.",
    "Describe a flavor combination that surprised you the first time.",
    "Share a meal you cook for yourself when no one's watching.",
    "What's a homemade staple you'll never go back to buying?",
    "Tell us about a recipe you finally got right after many tries.",
    "Describe how cooking has become a spiritual practice for you, if it has.",
    "Share a dish you make for celebrations.",
    "What's a vegetable you used to hate that you now love?",
    "Tell us about a meal someone made for you that you'll never forget.",
    "Describe a kitchen habit that has saved you time over and over.",
    "Share a baking project that intimidated you — and how it went.",
    "What's a sauce, dressing, or marinade you make from scratch every time?",
    "Tell us about cooking with your kids, parents, or grandparents.",
    "Describe a meal that fed you through a hard season of life.",
    "Share a recipe you'd want to teach a beginner.",
    "What's a regional dish you'd love to master?",
    "Tell us about a time you cooked for a crowd.",
    "Describe your favorite breakfast in three sentences or fewer.",
    "Share a dish your spouse or partner makes better than anyone.",
    "What's a meal you cook to celebrate good news?",
    "Tell us about your bread — homemade, store-bought, no judgment.",
    "Describe a way Scripture has shaped how you think about food and the table.",
    "Share a knife or pan that has been with you for years.",
    "What's a dish you eat when you're sick?",
    "Tell us about a recipe from someone outside your culture that you've embraced.",
    "Describe a meal that feels like a hug.",
    "Share something you've grown in your garden and cooked.",
    "What's a meal you've taught someone else to make?",
    "Tell us about your spice cabinet's most-used jar.",
    "Describe a holiday meal you couldn't imagine the holiday without.",
    "Share a way fasting has changed your relationship with food.",
    "What's a single-ingredient dish that you've come to love?",
    "Tell us about a recipe you adapted for a dietary need — and made it sing.",
    "Describe your favorite breakfast-for-dinner.",
    "Share a meal you'd want to eat one more time.",
    "What's a dish you're proud of from this past month?",
    "Tell us about your relationship with leftovers.",
    "Describe a meal you cook that's secretly a prayer.",
    "Share a kitchen mistake that taught you something.",
    "What's a cookbook author whose voice you trust?",
    "Tell us about a meal you've shared with strangers that became friendship.",
    "Describe your favorite seasonal ingredient and how you use it.",
    "Share a dish you'd want this group to taste together one day.",
  ],

  // ─── MARRIAGE (60) ──────────────────────────────────────────────────────
  // Tender, honest, growth-oriented. Frames marriage as covenant, sanctification,
  // and partnership. Welcomes both the struggle and the celebration.
  marriage: [
    "Describe a small habit you and your spouse have built that strengthens your bond.",
    "What's something you're grateful for in your marriage today, however small?",
    "Tell us about a season your marriage came through that made it stronger.",
    "Share one way your spouse has grown that has surprised you.",
    "What's a way you and your spouse pray together — or hope to learn to?",
    "Describe a date or moment recently that mattered more than you expected.",
    "Tell us about a fight that ended in genuine repair.",
    "What's something your spouse does that you never want to take for granted?",
    "Share a way your marriage has been challenged this year.",
    "Describe a tradition you've built together that means a lot.",
    "What's a Bible verse that has shaped your marriage?",
    "Tell us about a couple whose marriage you admire — and why.",
    "Share a way you and your spouse handle conflict that works for you.",
    "What's something you're working on in yourself for the sake of your marriage?",
    "Describe how your love has changed over the years.",
    "Tell us about a moment when you were forgiven by your spouse.",
    "Share a small gesture from your spouse that made your week.",
    "What's a way your spouse sees you that you're grateful for?",
    "Describe a season of distance and how you found your way back.",
    "Tell us about your favorite ordinary day with your spouse.",
    "Share a way Scripture has reframed how you love.",
    "What's something your spouse believes about you that helps you believe it too?",
    "Describe a way you've learned to communicate better.",
    "Tell us about a vacation, road trip, or weekend that has stayed with you.",
    "Share a way grace shows up in your marriage.",
    "What's something you want your kids — or future kids — to see in your marriage?",
    "Describe a habit that drains your relationship that you're working on.",
    "Tell us about a way you serve each other in small things.",
    "Share a memory from your dating or engagement days you still smile about.",
    "What's something you're learning about love that you didn't know at the wedding?",
    "Describe how you ask your spouse for help.",
    "Tell us about a way your spouse made you laugh recently.",
    "Share a fear you've had to bring into the open.",
    "What's a season of waiting you've walked through together?",
    "Describe a way your marriage has grown more honest.",
    "Tell us about a couple who has poured into your marriage.",
    "Share a hard conversation you're glad you had.",
    "What's a way you celebrate each other?",
    "Describe a way your spouse's faith has strengthened yours.",
    "Tell us about a financial decision you made together that mattered.",
    "Share a way you take care of your spouse's heart.",
    "What's something you've learned about apologizing well?",
    "Describe a way you've learned to listen better.",
    "Tell us about a moment when your marriage felt fragile — and what carried it.",
    "Share a way intimacy has grown for you.",
    "What's a dream you and your spouse share for the future?",
    "Describe a way you've learned to receive your spouse's love.",
    "Tell us about a gift you gave your spouse that meant more than you expected.",
    "Share a way you've grown in patience with each other.",
    "What's a hobby or interest you've leaned into together?",
    "Describe how you handle parenting decisions as a team.",
    "Tell us about a way you protect your marriage from outside pressures.",
    "Share a song that's become 'yours.'",
    "What's a way Christ at the center has been visible in your marriage?",
    "Describe a way you've learned to fight fair.",
    "Tell us about a way you make your spouse feel pursued.",
    "Share a way your marriage is different from your parents' — for better or harder.",
    "What's a verse you'd want printed on your bedroom wall?",
    "Describe a way you'd love to grow together over the next year.",
    "Tell us about something your spouse said recently that you carry around with you.",
  ],

  // ─── PARENTS (60) ───────────────────────────────────────────────────────
  // Real, grounded, faith-rooted. Speaks to parents at every stage —
  // newborns through adult kids. Holds tension between honesty and hope.
  parents: [
    "What's a small parenting win from this week that you're holding onto?",
    "Tell us about something your child said that shifted something in you.",
    "Share a way you're trying to disciple your kids in their current season.",
    "What's a parenting fear you're carrying that you'd like prayer for?",
    "Describe a habit or rhythm that's working for your family right now.",
    "Tell us about a moment when you parented better than you thought you could.",
    "Share a way Scripture is shaping how you parent.",
    "What's a bedtime, mealtime, or morning ritual that's become sacred?",
    "Describe a season of parenting that humbled you.",
    "Tell us about a parent whose example has shaped how you parent.",
    "Share a way your child has taught you something about God.",
    "What's a hard parenting decision you're wrestling with right now?",
    "Describe a way you're trying to apologize well to your kids.",
    "Tell us about a way your child has surprised you recently.",
    "Share a verse you pray over your child.",
    "What's a parenting weakness you're working on?",
    "Describe a moment when your patience ran out — and how you made it right.",
    "Tell us about a tradition your family keeps that you'd never give up.",
    "Share a way you're stewarding your kids' spiritual growth.",
    "What's a way you take care of yourself so you can show up for your kids?",
    "Describe a hard conversation you've had to have with your child.",
    "Tell us about a moment of joy with your kids this week.",
    "Share a way your spouse and you parent better as a team than alone.",
    "What's a way you're learning to listen to your child more carefully?",
    "Describe a way technology challenges your parenting right now.",
    "Tell us about a way community has helped you parent.",
    "Share a moment of repentance with your child that healed something.",
    "What's a season of parenting you're glad is behind you — or ahead of you?",
    "Describe a way you're praying for your child's future.",
    "Tell us about a discipline situation you handled in a way you're proud of.",
    "Share a verse that has comforted you on a hard parenting day.",
    "What's a way your child's questions have stretched your faith?",
    "Describe how your parenting has changed from your first child to your latest.",
    "Tell us about a moment when you saw God's grace in your child.",
    "Share a way you're protecting your family's pace and rhythm.",
    "What's a way you celebrate your kids that you want to keep doing?",
    "Describe a fear about your child that you've had to hand over to God.",
    "Tell us about a friend or mentor who has poured into your kids.",
    "Share a way you're teaching your child to pray.",
    "What's an area where you and your child are growing together?",
    "Describe a way grace shows up in your home.",
    "Tell us about a way Scripture is shaping your discipline.",
    "Share a way you've changed your mind about a parenting practice.",
    "What's a way you're cultivating gratitude in your kids?",
    "Describe a moment when you had to choose grace over consequences.",
    "Tell us about a way your child sees the world that you wish you could.",
    "Share a way you're trying to model rest and Sabbath.",
    "What's a habit you're trying to build into your family's daily rhythm?",
    "Describe a moment when your child's faith encouraged your own.",
    "Tell us about a way you're praying for your child's friendships.",
    "Share a parenting book or voice that has shaped you.",
    "What's a season of parenting that surprised you with its joy?",
    "Describe a way you're working to keep your marriage strong while parenting.",
    "Tell us about a hard 'no' you had to say — and don't regret.",
    "Share a way you're showing your child what it looks like to follow Jesus.",
    "What's a moment of laughter with your kids that you'll remember forever?",
    "Describe a way you're teaching your child to handle disappointment.",
    "Tell us about a way you're growing in patience.",
    "Share a way you've learned to celebrate small wins with your kids.",
    "What's a prayer you're praying over your home this season?",
  ],

  // ─── YOUTH (60) ─────────────────────────────────────────────────────────
  // Teen and young-adult voice. Identity, friendship, faith questions, school
  // and work pressure, future. Direct without being preachy.
  youth: [
    "What's something you're figuring out about yourself right now?",
    "Tell us about a friendship that's been making you better lately.",
    "Share something on your mind about the future that you don't always say out loud.",
    "What's a question about faith you're sitting with that doesn't have a clean answer?",
    "Describe a small win from this week that mattered to you.",
    "Tell us about a person whose faith makes you curious.",
    "Share a way you're trying to grow that's harder than it looks.",
    "What's a Bible verse that's been hitting different lately?",
    "Describe a part of your story that you used to hide that you're learning to share.",
    "Tell us about something you're proud of that no one knows about.",
    "Share a way you're building habits you actually want to keep.",
    "What's something you're learning about identity that's reshaping you?",
    "Describe a moment recently when you knew the right thing to do — and you did it.",
    "Tell us about a fear you'd like to face this year.",
    "Share a way your faith is different from your parents' faith.",
    "What's a comparison trap you're working to escape?",
    "Describe a way social media is messing with you — or helping you — right now.",
    "Tell us about a hard conversation you need to have soon.",
    "Share a moment when prayer felt real to you.",
    "What's a goal you're chasing that scares you a little?",
    "Describe a friend who actually sees you.",
    "Tell us about a part of yourself that you're learning to like.",
    "Share something you wish people understood about your generation.",
    "What's a value you're trying to build your life around?",
    "Describe a moment you stood up for something or someone.",
    "Tell us about a class, book, or person that's blowing your mind right now.",
    "Share a way you're trying to follow Jesus that's countercultural.",
    "What's a song that puts words to what you've been feeling?",
    "Describe a hobby that makes you feel most like yourself.",
    "Tell us about a way you're learning to handle stress.",
    "Share something kind you saw or did this week.",
    "What's a way you're growing that makes your parents proud?",
    "Describe a place that feels like sanctuary to you.",
    "Tell us about a question you've asked God lately.",
    "Share a way you're trying to take care of your mental health.",
    "What's a goal you'd love to share with people who'd actually root for you?",
    "Describe a regret you've made peace with.",
    "Tell us about a habit you're proud of building.",
    "Share a way friendship has surprised you this year.",
    "What's a part of your faith that you're owning more deeply?",
    "Describe a moment when you laughed harder than you have in a long time.",
    "Tell us about a leader, coach, or mentor who's shaped you.",
    "Share a way you handle peer pressure differently than you used to.",
    "What's something you're working through that you'd want this group to pray about?",
    "Describe a place you'd love to travel — and what you hope you'd find there.",
    "Tell us about a moment you felt seen by God.",
    "Share a way you're trying to be a better friend.",
    "What's a fear about the future you've handed to God this year?",
    "Describe a way you're stewarding your relationships with your family.",
    "Tell us about a way you're growing in confidence.",
    "Share something you've been learning about love.",
    "What's a way you're getting to know Jesus that's new?",
    "Describe a way the church has been good for you — or hard for you.",
    "Tell us about a person you'd like to become more like.",
    "Share a way you're building a life that feels like yours.",
    "What's a piece of advice you wish your younger self had received?",
    "Describe a moment when your faith was tested recently.",
    "Tell us about something you've learned to say no to.",
    "Share a dream you have that you've never said out loud.",
    "What's something good God is doing in your life right now, even if it's quiet?",
  ],

  // ─── OTHER (60) ─────────────────────────────────────────────────────────
  // Catch-all category — broad, faith-rooted, life-on-life. Designed to work
  // for any group whose specific category doesn't fit the eight above.
  other: [
    "What's God been teaching you lately, in a sentence or two?",
    "Tell us about a small mercy from this week.",
    "Share something you're grateful for that you didn't expect.",
    "What's a question you're sitting with right now?",
    "Describe a way you've grown this year that surprises you.",
    "Tell us about a person you're praying for who has no idea.",
    "Share a verse, song, or phrase that has stayed with you this week.",
    "What's a fear you're working to face?",
    "Describe a moment when you sensed God's nearness recently.",
    "Tell us about a way you're trying to walk more closely with Jesus.",
    "Share a way community has changed you.",
    "What's something you'd love to learn from this group?",
    "Describe a season of waiting you're in right now.",
    "Tell us about a way your faith has been tested.",
    "Share a small joy from yesterday.",
    "What's a hard 'yes' you've said this year that mattered?",
    "Describe a way you've changed your mind about something important.",
    "Tell us about a person whose faithfulness has marked you.",
    "Share a habit you're building, however imperfectly.",
    "What's a verse you keep coming back to?",
    "Describe a way you've experienced grace recently.",
    "Tell us about something you're celebrating today.",
    "Share a way God has surprised you.",
    "What's a part of your story you're learning to honor?",
    "Describe a way you're growing in honesty with yourself.",
    "Tell us about a person who saw something in you before you did.",
    "Share something hard you're walking through that you'd want prayer for.",
    "What's a small disciplinary practice that's shaping you?",
    "Describe a way you've learned to rest.",
    "Tell us about a place where God feels especially near.",
    "Share a way you're stewarding what you've been given.",
    "What's something good in your life right now that you don't take for granted?",
    "Describe a way you're learning to listen better.",
    "Tell us about a season you came through that taught you something.",
    "Share a way you serve others that brings you joy.",
    "What's a friendship that has shaped you deeply?",
    "Describe a way you're trying to grow in courage.",
    "Tell us about a recent moment when forgiveness happened — given or received.",
    "Share a hope you're carrying for the next year.",
    "What's a Scripture you've been wrestling with?",
    "Describe a way you're working to live with less hurry.",
    "Tell us about a way prayer has changed you, not just your circumstances.",
    "Share a way you've grown more comfortable with uncertainty.",
    "What's a way you'd like to be challenged by this group?",
    "Describe a way you're learning to receive love.",
    "Tell us about something you've started saying no to.",
    "Share a kindness that recently caught you off guard.",
    "What's a way you're growing in faithfulness in small things?",
    "Describe a way Jesus has surprised you in Scripture lately.",
    "Tell us about a way you're stewarding your time.",
    "Share a place in your life where you sense God moving.",
    "What's a longing you're learning to bring to God instead of fix on your own?",
    "Describe a way you're learning to celebrate other people's wins.",
    "Tell us about a way the Holy Spirit has met you in an unexpected place.",
    "Share something you'd love this group to pray for you about.",
    "What's a way you're trying to be more present with the people you love?",
    "Describe a season of fruitfulness you're seeing — even if small.",
    "Tell us about a way your faith has matured this year.",
    "Share a hope you have for this group itself.",
    "What's God doing in your life right now that you'd want to remember a year from now?",
  ],
};

// ─── Selection function ──────────────────────────────────────────────────

/**
 * Cheap, stable string hash. Maps a string (the group id) to a small
 * non-negative integer. Used purely for offsetting topic selection between
 * groups in the same category — does not need to be cryptographic.
 *
 * Two groups with different ids will (almost always) hash to different
 * values, which means they get different offsets, which means they pick
 * different prompts on the same day. That's the multi-key rotation
 * promise.
 */
function stringHash(s) {
  if (!s) return 0;
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Day of year (1-366). Uses local time to match the user's calendar
 * intuition — "today's topic" resets at local midnight, not UTC.
 */
function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / 86400000);
}

/**
 * Select the daily discussion topic for a given group.
 *
 * @param {string} groupId   — the group's stable id (database id)
 * @param {string} category  — one of the keys in TOPICS, e.g. 'bible_study'
 * @param {Date}  [date]     — defaults to today
 * @returns {string}         — the discussion prompt to render
 */
export function getDailyTopic(groupId, category, date = new Date()) {
  const list = TOPICS[category] || TOPICS.other;
  const offset = stringHash(groupId) % CYCLE_LENGTH;
  const index = (dayOfYear(date) + offset) % list.length;
  return list[index];
}

/**
 * ISO date string for the topic_date field on the Post entity.
 * Format: YYYY-MM-DD in local time.
 */
export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Export the raw library for tests, admin tools, or future expansion.
export { TOPICS, CYCLE_LENGTH };
