// Seed data: 32 diverse community groups across all categories.
// Uses localStorage key to prevent re-seeding.

export const SEED_KEY = 'groups_seeded_v1';

export const SEED_GROUPS = [
  // ── Bible Study (7) ─────────────────────────────────────────────────────
  {
    name: 'Genesis to Revelation',
    description: 'A year-long journey through the entire Bible. We read together, discuss weekly, and support each other every step of the way.',
    category: 'bible_study',
    is_private: false,
    member_count: 142,
  },
  {
    name: 'Women of the Word',
    description: 'A safe, encouraging space for women to dig deep into Scripture together. We meet virtually every Tuesday evening.',
    category: 'bible_study',
    is_private: false,
    member_count: 87,
  },
  {
    name: 'Men of Faith Bible Study',
    description: 'Iron sharpens iron. A brotherhood committed to studying God\'s word, holding each other accountable, and growing in faith.',
    category: 'bible_study',
    is_private: false,
    member_count: 63,
  },
  {
    name: 'Sunday Sermon Deep Dive',
    description: 'Didn\'t catch everything in the message? We break down Sunday\'s sermon together each week with notes, questions, and discussion.',
    category: 'bible_study',
    is_private: false,
    member_count: 54,
  },
  {
    name: 'Psalms & Proverbs Daily',
    description: 'One Psalm and one Proverb every single day. Short, consistent, powerful. Perfect for building a daily Scripture habit.',
    category: 'bible_study',
    is_private: false,
    member_count: 211,
  },
  {
    name: 'New Testament in 90 Days',
    description: 'Focused 90-day sprint through the entire New Testament. Daily readings, weekly check-ins, and accountability partners.',
    category: 'bible_study',
    is_private: false,
    member_count: 78,
  },
  {
    name: 'Revelation Unpacked',
    description: 'Verse-by-verse study of the Book of Revelation. We tackle the tough passages with context, humility, and open discussion.',
    category: 'bible_study',
    is_private: false,
    member_count: 45,
  },

  // ── Prayer (5) ──────────────────────────────────────────────────────────
  {
    name: '5AM Prayer Warriors',
    description: 'Starting each morning in intercession before the world wakes up. Daily prayer prompts, live sessions, and shared requests.',
    category: 'prayer',
    is_private: false,
    member_count: 189,
  },
  {
    name: 'Healing & Restoration Circle',
    description: 'A private, compassionate space for sharing prayer requests around physical, emotional, and relational healing.',
    category: 'prayer',
    is_private: false,
    member_count: 93,
  },
  {
    name: 'Prayer for the Nations',
    description: 'Interceding for countries, governments, and missionaries around the world. Weekly focus nations and daily prayer prompts.',
    category: 'prayer',
    is_private: false,
    member_count: 67,
  },
  {
    name: 'Fasting & Prayer Community',
    description: 'Corporate fasting for breakthrough. We fast together, pray together, and share testimonies of what God is doing.',
    category: 'prayer',
    is_private: false,
    member_count: 112,
  },
  {
    name: 'Bedtime Prayers for Parents',
    description: 'Helping parents pray over their children each night. Guided prayers, verses for kids, and community encouragement.',
    category: 'prayer',
    is_private: false,
    member_count: 58,
  },

  // ── Wellness (5) ────────────────────────────────────────────────────────
  {
    name: 'Faith & Mental Health',
    description: 'Bridging Scripture and mental wellness. A judgment-free zone for discussing anxiety, depression, and emotional health through a faith lens.',
    category: 'wellness',
    is_private: false,
    member_count: 204,
  },
  {
    name: 'Sober & Surrendered',
    description: 'Recovery and sobriety support grounded in faith. We celebrate milestones, walk through struggles, and point each other to God.',
    category: 'wellness',
    is_private: false,
    member_count: 76,
  },
  {
    name: 'Anxiety to Peace',
    description: 'Practical and spiritual tools for overcoming anxiety. Breathing exercises, Scripture, and community encouragement every day.',
    category: 'wellness',
    is_private: false,
    member_count: 138,
  },
  {
    name: 'Sleep & Rest Restoration',
    description: 'Improving sleep through faith-based habits: evening routines, stillness practices, and Scriptures for peaceful rest.',
    category: 'wellness',
    is_private: false,
    member_count: 49,
  },
  {
    name: 'Grief & Loss Support',
    description: 'Walking through grief together with compassion and faith. For those who have lost a loved one, a dream, or a season of life.',
    category: 'wellness',
    is_private: false,
    member_count: 61,
  },

  // ── Workout (4) ─────────────────────────────────────────────────────────
  {
    name: '30-Day Body Transformation',
    description: 'A 30-day challenge combining daily workouts, nutrition tips, and morning devotionals. New challenge starts every month.',
    category: 'workout',
    is_private: false,
    member_count: 256,
  },
  {
    name: 'Running for His Glory',
    description: 'Faith-fuelled runners of all levels. Training plans, worship playlist recommendations, and virtual race challenges together.',
    category: 'workout',
    is_private: false,
    member_count: 94,
  },
  {
    name: 'HIIT & Praise',
    description: 'High-intensity interval training set to praise and worship music. Post your workouts and encourage each other daily.',
    category: 'workout',
    is_private: false,
    member_count: 81,
  },
  {
    name: 'Beginners Fitness Journey',
    description: 'A no-judgment community for those just starting out. Simple routines, massive encouragement, and small wins celebrated big.',
    category: 'workout',
    is_private: false,
    member_count: 173,
  },

  // ── Cooking (3) ─────────────────────────────────────────────────────────
  {
    name: 'Healthy Meal Prep Sunday',
    description: 'Batch cooking for the week ahead. We share recipes, meal prep photos, grocery hauls, and nourishing food inspiration.',
    category: 'cooking',
    is_private: false,
    member_count: 119,
  },
  {
    name: 'Plant-Based & Faithful',
    description: 'Exploring plant-based eating as stewardship of the body. Recipes, tips, and encouragement for vegans and plant-curious folks.',
    category: 'cooking',
    is_private: false,
    member_count: 44,
  },
  {
    name: 'Budget Family Meals',
    description: 'Feeding a family well without breaking the bank. Affordable recipes, pantry staples, and creative cooking on any budget.',
    category: 'cooking',
    is_private: false,
    member_count: 88,
  },

  // ── Marriage (3) ────────────────────────────────────────────────────────
  {
    name: 'Newlyweds Community',
    description: 'For couples in the first three years of marriage. Real talk about adjustment, communication, and building a Christ-centred home.',
    category: 'marriage',
    is_private: false,
    member_count: 72,
  },
  {
    name: 'Rebuilding After Hardship',
    description: 'For couples who have walked through infidelity, betrayal, or crisis and are choosing to heal. Hope, grace, and guided resources.',
    category: 'marriage',
    is_private: false,
    member_count: 38,
  },
  {
    name: 'Date Night Ideas & Tips',
    description: 'Keeping the spark alive with creative date ideas, conversation starters, love language resources, and marriage enrichment.',
    category: 'marriage',
    is_private: false,
    member_count: 95,
  },

  // ── Parents (3) ─────────────────────────────────────────────────────────
  {
    name: 'Single Parents Support Circle',
    description: 'A faith community for single parents navigating the beautiful, hard journey of raising children alone. You\'re not alone.',
    category: 'parents',
    is_private: false,
    member_count: 84,
  },
  {
    name: 'Raising Godly Teenagers',
    description: 'Parenting teens with grace and truth. Sharing what works, what doesn\'t, and how to stay connected to your kids.',
    category: 'parents',
    is_private: false,
    member_count: 107,
  },
  {
    name: 'Homeschool Families Network',
    description: 'Connecting Christian homeschool families. Curriculum tips, co-op ideas, daily schedules, and encouragement for the journey.',
    category: 'parents',
    is_private: false,
    member_count: 53,
  },

  // ── Youth (2) ────────────────────────────────────────────────────────────
  {
    name: 'Teen Devotional Circle',
    description: 'For teenagers who want to grow in their faith. Daily devotionals designed for ages 13–18, with real questions and honest conversation.',
    category: 'youth',
    is_private: false,
    member_count: 66,
  },
  {
    name: 'College & Young Adults Faith',
    description: 'Community for university students and young adults navigating faith, identity, and life. Bible study, prayer, and real support.',
    category: 'youth',
    is_private: false,
    member_count: 128,
  },

  // ── Other (2) ────────────────────────────────────────────────────────────
  {
    name: 'Financial Freedom & Stewardship',
    description: 'Biblical principles for managing money: budgeting, debt freedom, tithing, investing, and building generational wealth.',
    category: 'other',
    is_private: false,
    member_count: 163,
  },
  {
    name: 'New Members Welcome Community',
    description: 'Just joined the app? Start here! Introductions, app tips, and a warm community to help you find your place.',
    category: 'other',
    is_private: false,
    member_count: 312,
  },
];
